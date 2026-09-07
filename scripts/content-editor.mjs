import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import sharp from "sharp";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const port=Number(process.env.CONTENT_EDITOR_PORT||3111);
const origin=`http://127.0.0.1:${port}`;
const token=crypto.randomBytes(24).toString("hex");
const files={brain:"content/brain.json",projects:"content/projects.json",site:"content/site.json"};
const hash=text=>crypto.createHash("sha256").update(text).digest("hex");
const read=async file=>fs.readFile(path.join(root,file),"utf8");
const problem=(status,message)=>Object.assign(new Error(message),{status});
let writes=Promise.resolve();
function serial(fn){const next=writes.then(fn);writes=next.catch(()=>{});return next;}

// Executes only the repository's trusted TS data modules. Editor input remains
// JSON; it never becomes source code or an unrestricted filesystem path.
async function loadData(){
  const cache=new Map();
  async function prepare(filename){
    if(cache.has(filename))return;
    const source=await fs.readFile(filename,"utf8");
    const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
    const dependencies={};
    for(const [,specifier] of js.matchAll(/require\(["']([^"']+)["']\)/g)){
      if(specifier==="server-only"){dependencies[specifier]={};continue;}
      if(!specifier.startsWith("."))throw new Error("Unsupported data import");
      const resolved=path.resolve(path.dirname(filename),specifier);
      if(resolved.endsWith(".json"))dependencies[specifier]=JSON.parse(await fs.readFile(resolved,"utf8"));
      else {await prepare(resolved+".ts");dependencies[specifier]=cache.get(resolved+".ts");}
    }
    const exports={};
    new Function("exports","require",js)(exports,name=>dependencies[name]);
    cache.set(filename,exports);
  }
  const brainPath=path.join(root,"src/lib/brain/objects.ts"),projectPath=path.join(root,"src/lib/projects.ts");
  const domainPath=path.join(root,"src/lib/brain/domains.ts");
  await prepare(brainPath);await prepare(projectPath);await prepare(domainPath);
  const domainsFor=cache.get(domainPath).domainsFor;
  return {brain:cache.get(brainPath).brainObjects.map(o=>({...o,domains:o.domains??domainsFor(o)})),projects:cache.get(projectPath).projects};
}
async function catalog(){
  const data=await loadData();
  const revisions={};
  for(const [key,file] of Object.entries(files))revisions[key]=hash(await read(file));
  return {...data,site:JSON.parse(await read(files.site)),revisions};
}
function validateType(collection,record){
  const type=collection==="brain"?"BrainObject":"Project";
  const module=collection==="brain"?"../src/lib/brain/types":"../src/lib/projects";
  const virtual=path.join(root,"scripts/__content_validation__.ts");
  const source=`import type { ${type} } from "${module}";\nconst record: ${type} = ${JSON.stringify(record)};\nexport {};`;
  const config=ts.readConfigFile(path.join(root,"tsconfig.json"),ts.sys.readFile);
  const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,root);
  const options={...parsed.options,noEmit:true,incremental:false};
  const host=ts.createCompilerHost(options);
  const oldRead=host.readFile;
  host.readFile=file=>file===virtual?source:oldRead(file);
  const program=ts.createProgram([virtual],options,host);
  const errors=ts.getPreEmitDiagnostics(program).filter(d=>d.file?.fileName===virtual&&d.category===ts.DiagnosticCategory.Error);
  if(errors.length)throw problem(422,errors.slice(0,5).map(d=>ts.flattenDiagnosticMessageText(d.messageText," ")).join("\n"));
}
function checkUrls(value,key=""){
  if(key==="src" && typeof value==="string" && (!value || !value.startsWith("/") || value.startsWith("//")))throw problem(422,"Upload an asset or use its local file path. External links belong in link fields.");
  if(typeof value==="string" && /^(src|href|relatedUrl|previewUrl)$/.test(key) && value && !/^(\/(?!\/)|https:\/\/|mailto:)/.test(value))throw problem(422,`Invalid ${key}: use a local path or https URL.`);
  if(Array.isArray(value))value.forEach(v=>checkUrls(v,key));
  else if(value&&typeof value==="object")Object.entries(value).forEach(([k,v])=>{if(["__proto__","constructor","prototype"].includes(k))throw problem(422,"Invalid field name");checkUrls(v,k);});
}
async function body(req){
  if(!req.headers["content-type"]?.startsWith("application/json"))throw problem(415,"Use JSON");
  let size=0;const chunks=[];
  for await(const chunk of req){size+=chunk.length;if(size>45000000)throw problem(413,"Upload is too large");chunks.push(chunk);}
  try{return JSON.parse(Buffer.concat(chunks).toString("utf8"));}catch{throw problem(400,"Invalid JSON");}
}
async function save(payload){
  const {collection,id,record,revision}=payload;
  if(!Object.hasOwn(files,collection))throw problem(400,"Unknown collection");
  if(!record||typeof record!=="object"||Array.isArray(record))throw problem(422,"Expected a record");
  checkUrls(record);
  if(collection==="site"){
    const allowed=["availability","email","professionalCalendar","brainCalendar","linkedin"];
    if(Object.keys(record).some(k=>!allowed.includes(k))||allowed.some(k=>typeof record[k]!=="string"))throw problem(422,"Invalid site settings");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)||/[\r\n]/.test(record.email))throw problem(422,"Invalid email");
    for(const key of ["professionalCalendar","brainCalendar","linkedin"])if(!record[key].startsWith("https://"))throw problem(422,"Contact links must use https");
  }else{
    const data=await loadData();
    if(collection==="projects"&&!data.projects.some(p=>p.slug===id))throw problem(404,"Unknown project");
    if(collection==="brain"&&(!/^B-\d{4,}$/.test(id)||record.id!==id))throw problem(422,"Invalid Brain ID");
    if(collection==="projects"&&record.slug!==id)throw problem(422,"Project slug cannot be changed here");
    validateType(collection,record);
    if(collection==="projects"&&!record.title.trim())throw problem(422,"Add a project title");
    if(collection==="brain"){
      const domains=["design","music","writing","crafts","community","life"];
      if(record.domains?.some(d=>!domains.includes(d)))throw problem(422,"Unknown domain");
      const ids=new Set(data.brain.map(o=>o.id));
      if(record.relatedIds?.some(other=>other===id||!ids.has(other)))throw problem(422,"Related objects must exist and cannot point to themselves");
      for(const media of record.media||[]){if(path.basename(media.filename)!==media.filename)throw problem(422,"Invalid media filename");await fs.access(path.join(root,"content/brain-media",media.filename)).catch(()=>{throw problem(422,"Upload the media file before saving");});}
      if(!["published","draft","private","archive","graveyard"].includes(record.status))throw problem(422,"Choose a visibility status");
      if(record.status==="published"&&!record.title?.trim()&&!record.content?.trim()&&!record.contentEntries?.length&&!record.media?.length&&!record.relatedUrl&&!record.vessel?.includes("floating"))throw problem(422,"Add content, media, or a source link before publishing");
      record.private=record.status==="private";
    }
    if(collection==="projects"&&record.previewImage?.src.startsWith("/protected-media/"))throw problem(422,"A protected image cannot become a public thumbnail");
  }
  return serial(async()=>{
    const file=files[collection],previous=await read(file);
    if(hash(previous)!==revision)throw problem(409,"Content changed since this editor loaded. Reload before saving; your draft is still on screen.");
    const data=collection==="site"?record:{...JSON.parse(previous),[id]:record};
    const next=JSON.stringify(data,null,2)+"\n";
    const history=path.join(root,"content/.history");
    await fs.mkdir(history,{recursive:true});
    await fs.writeFile(path.join(history,`${collection}-${Date.now()}-${crypto.randomUUID()}.json`),previous);
    const temporary=path.join(root,file+".tmp");
    await fs.writeFile(temporary,next);
    await fs.rename(temporary,path.join(root,file));
    return {revision:hash(next)};
  });
}
async function upload(payload){
  const {collection,id,filename,base64}=payload;
  const data=await loadData();
  if(collection!=="brain"&&collection!=="projects")throw problem(400,"Invalid upload collection");
  if(collection==="brain"&&!/^B-\d{4,}$/.test(id))throw problem(400,"Invalid object");
  if(collection==="projects"&&!data.projects.some(p=>p.slug===id))throw problem(400,"Unknown project");
  if(typeof base64!=="string"||typeof filename!=="string")throw problem(400,"Missing file");
  const bytes=Buffer.from(base64,"base64");
  const video=path.extname(filename).toLowerCase()===".mp4";
  if(bytes.length>(video?30000000:12000000))throw problem(413,"Images can be up to 12MB; videos up to 30MB");
  let info,extension;
  if(video){
    if(collection!=="projects"||bytes.toString("ascii",4,8)!=="ftyp")throw problem(422,"MP4 uploads are supported for case studies; use an external link for Brain videos");
    extension=".mp4";
  }else{
    info=await sharp(bytes,{limitInputPixels:50000000}).metadata().catch(()=>{throw problem(422,"Could not read this image");});
    extension={jpeg:".jpg",png:".png",webp:".webp",gif:".gif"}[info.format];
    if(!extension)throw problem(422,"Use JPG, PNG, WebP or GIF");
  }
  const name=`${id}-${crypto.randomUUID()}${extension}`;
  const directory=collection==="brain"?"content/brain-media":id==="adem-user-list"?"content/protected/adem-user-list":"public/uploads";
  await fs.mkdir(path.join(root,directory),{recursive:true});
  await fs.writeFile(path.join(root,directory,name),bytes);
  if(collection==="brain"){
    await fs.mkdir(path.join(root,"content/brain-previews"),{recursive:true});
    await sharp(bytes).rotate().resize({width:800,height:1000,fit:"inside",withoutEnlargement:true}).webp({quality:78}).toFile(path.join(root,"content/brain-previews",name+".webp"));
    return {id:"M-"+crypto.randomUUID(),filename:name,alt:""};
  }
  return {src:(id==="adem-user-list"?"/protected-media/adem-user-list/":"/uploads/")+name,alt:"",width:info?.width,height:info?.height,video};
}
async function media(src){
  const clean=src.split("?")[0];
  let file;
  if(clean.startsWith("/brain/")){
    const name=path.basename(decodeURIComponent(clean));
    file=path.join(root,"content/brain-media",name);
  }else if(clean.startsWith("/protected-media/adem-user-list/")){
    file=path.join(root,"content/protected/adem-user-list",path.basename(decodeURIComponent(clean)));
  }else{
    file=path.resolve(root,"public","."+decodeURIComponent(clean));
    if(!file.startsWith(path.join(root,"public")+path.sep))throw problem(403,"Invalid media path");
  }
  const mime={".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".gif":"image/gif",".mp4":"video/mp4"}[path.extname(file).toLowerCase()];
  if(!mime)throw problem(403,"Unsupported media");
  return {bytes:await fs.readFile(file),mime};
}
const server=http.createServer(async(req,res)=>{
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("Referrer-Policy","no-referrer");
  try{
    if(req.headers.host!==`127.0.0.1:${port}`)throw problem(403,"Open the editor at "+origin);
    if(req.headers.origin&&req.headers.origin!==origin)throw problem(403,"Origin rejected");
    const url=new URL(req.url,origin);
    if(req.method==="GET"&&url.pathname==="/"){
      res.setHeader("Content-Type","text/html; charset=utf-8");
      res.end((await read("scripts/content-editor/index.html")).replace("__EDITOR_TOKEN__",JSON.stringify(token)));return;
    }
    if(req.method==="GET"&&url.pathname==="/editor.js"){res.setHeader("Content-Type","text/javascript; charset=utf-8");res.end(await read("scripts/content-editor/editor.js"));return;}
    if(req.headers["x-content-token"]!==token&&!(url.pathname==="/media"&&url.searchParams.get("token")===token))throw problem(403,"Editor token required");
    if(req.method==="GET"&&url.pathname==="/media"){const result=await media(url.searchParams.get("src")||"");res.setHeader("Content-Type",result.mime);res.end(result.bytes);return;}
    let result;
    if(req.method==="GET"&&url.pathname==="/api/catalog")result=await catalog();
    else if(req.method==="POST"&&url.pathname==="/api/save")result=await save(await body(req));
    else if(req.method==="POST"&&url.pathname==="/api/upload")result=await serial(()=>body(req).then(upload));
    else throw problem(404,"Not found");
    res.setHeader("Content-Type","application/json");res.end(JSON.stringify(result));
  }catch(error){res.statusCode=error.status||500;res.setHeader("Content-Type","application/json");res.end(JSON.stringify({error:error.status?error.message:"The editor could not complete that action. Check the terminal."}));if(!error.status)console.error(error);}
});
server.listen(port,"127.0.0.1",()=>console.log(`Content editor: ${origin}\nLocal only. Save updates content files; deployment remains separate.`));
