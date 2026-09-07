const $=selector=>document.querySelector(selector);
const state={catalog:null,collection:"brain",id:null,draft:null,dirty:false,tab:"metadata",block:0,undo:null};
const labels={heroLine:"Opening summary",tagline:"Short description",previewOutcome:"Homepage outcome (optional)",previewImage:"Homepage image",relatedUrl:"Source / external link",originalDate:"Original date",displayDateOverride:"Display date",contentEntries:"Dated entries",src:"Asset path",alt:"Alternative text",eyebrow:"Section label",body:"Paragraphs",items:"List items",heroImage:"Hero image",secondaryCategory:"Legacy secondary category"};
const domains={design:"Design + Technology",music:"Music",writing:"Writing + Ideas",crafts:"Art + Craft",community:"People + Community",life:"Life"};
const defaults={
  story:{kind:"story",heading:"",body:[""]},sectionHeading:{kind:"sectionHeading",heading:"",eyebrow:""},
  image:{kind:"image",src:"",alt:"",caption:"",width:1200,height:800},video:{kind:"video",src:"",caption:""},
  quote:{kind:"quote",text:"",attribution:""},expand:{kind:"expand",label:"",body:[""]},
  insight:{kind:"insight",heading:"",body:[""]},constraint:{kind:"constraint",heading:"",body:[""]},
  flowSteps:{kind:"flowSteps",steps:[""]},statement:{kind:"statement",heading:""},
};
function node(tag,props={},...children){const e=document.createElement(tag);for(const [k,v]of Object.entries(props)){if(k.startsWith("on"))e.addEventListener(k.slice(2).toLowerCase(),v);else if(k==="class")e.className=v;else if(k==="text")e.textContent=v;else if(k.startsWith("aria-"))e.setAttribute(k,v);else e[k]=v;}for(const child of children.flat()){if(child!=null)e.append(child instanceof Node?child:document.createTextNode(String(child)));}return e;}
function say(text,error=false){$("#status").textContent=text;$("#status").className=error?"error":"";}
function dirty(){state.dirty=true;$("#save").disabled=false;say("Unsaved changes");}
async function api(url,data){const response=await fetch(url,{method:data?"POST":"GET",headers:{"X-Content-Token":window.CONTENT_TOKEN,...(data?{"Content-Type":"application/json"}:{})},body:data?JSON.stringify(data):undefined});const result=await response.json();if(!response.ok)throw new Error(result.error);return result;}
function preview(src){return "/media?token="+encodeURIComponent(window.CONTENT_TOKEN)+"&src="+encodeURIComponent(src);}
function title(record){return record.title||record.content?.split("\n")[0]||record.contentEntries?.[0]?.text||record.id||record.slug;}
function status(record){return record.status||(record.private?"private":"published");}
function abandon(){return !state.dirty||confirm("Discard your unsaved changes?");}
async function reload(){if(!abandon())return;state.catalog=await api("/api/catalog");state.dirty=false;const records=state.catalog[state.collection];select(state.collection==="site"?"site":state.id&&records.some(r=>(r.id||r.slug)===state.id)?state.id:(records[0]?.id||records[0]?.slug),true);say("Saved locally. Deploy separately when ready.");}
function select(id,force=false){if(!force&&!abandon())return;state.id=id;state.block=0;const record=state.collection==="site"?state.catalog.site:state.catalog[state.collection].find(r=>(r.id||r.slug)===id);state.draft=structuredClone(record||{});state.dirty=false;$("#save").disabled=true;if(state.collection==="brain")state.draft.status=status(state.draft);renderList();renderEditor();$("#editor").scrollTop=0;$("#undo").disabled=!(state.undo?.collection===state.collection&&state.undo?.id===state.id);}
function renderList(){
  const query=$("#search").value.toLowerCase();$("#new").hidden=state.collection!=="brain";$("#search").hidden=state.collection==="site";
  document.querySelectorAll("[data-collection]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.collection===state.collection)));
  $("#list").replaceChildren();
  if(state.collection==="site")return;
  for(const r of state.catalog[state.collection]){const id=r.id||r.slug;if(![title(r),id,status(r)].join(" ").toLowerCase().includes(query))continue;$("#list").append(node("button",{"aria-pressed":id===state.id,onClick:()=>select(id)},title(r).slice(0,100),node("small",{text:state.collection==="brain"?status(r):r.company})));}
}
function field(label,value,onChange,kind="text"){
  let input;
  if(kind==="checkbox")input=node("input",{type:"checkbox",checked:!!value,onChange:e=>{onChange(e.target.checked);dirty();}});
  else if(Array.isArray(kind)){input=node("select",{onChange:e=>{onChange(e.target.value);dirty();}},kind.map(v=>node("option",{value:v,text:v})));input.value=value??"";}
  else if(kind==="textarea")input=node("textarea",{value:value??"",rows:Math.min(14,Math.max(3,String(value||"").split("\n").length+1)),onInput:e=>{onChange(e.target.value);dirty();}});
  else input=node("input",{type:kind,value:value??"",onInput:e=>{onChange(kind==="number"?Number(e.target.value):e.target.value);dirty();}});
  input.setAttribute("aria-label",label||"Item");
  return node("label",{class:"field"},node("span",{text:label}),input);
}
function simple(container,key,kind="text",label=labels[key]||key){container.append(field(label,state.draft[key],value=>state.draft[key]=value,kind));}
function generic(value,onChange,label){
  if(typeof value==="string")return field(label,value,onChange,/body|paragraph|content|text|note|caption/i.test(label)||value.length>100?"textarea":"text");
  if(typeof value==="number")return field(label,value,onChange,"number");
  if(typeof value==="boolean")return field(label,value,onChange,"checkbox");
  const box=node("div",{class:"nested"});
  if(label)box.append(node("h3",{text:label}));
  if(Array.isArray(value)){
    value.forEach((item,i)=>{const wrap=node("div",{class:"item"});wrap.append(generic(item,v=>{value[i]=v;onChange(value);},typeof item==="string"&&/Paragraphs|body|note/i.test(label)?"Paragraph":""),node("div",{class:"row"},node("button",{text:"↑",title:"Move up",disabled:i===0,onClick:()=>{[value[i-1],value[i]]=[value[i],value[i-1]];onChange(value);dirty();renderEditor();}}),node("button",{text:"↓",title:"Move down",disabled:i===value.length-1,onClick:()=>{[value[i+1],value[i]]=[value[i],value[i+1]];onChange(value);dirty();renderEditor();}}),node("button",{text:"Remove",onClick:()=>{value.splice(i,1);onChange(value);dirty();renderEditor();}})));box.append(wrap);});
    box.append(node("button",{text:"Add item",onClick:()=>{const first=value[0];value.push(label==="Outcomes"?{value:"",label:""}:label==="Dated entries"?{date:"",text:""}:typeof first==="object"&&first?Object.fromEntries(Object.entries(first).map(([k,v])=>[k,Array.isArray(v)?[]:typeof v==="number"?0:typeof v==="boolean"?false:""])):"");onChange(value);dirty();renderEditor();}}));
  }else if(value&&typeof value==="object"){for(const [key,v]of Object.entries(value)){if(key==="kind")continue;box.append(generic(v,next=>{value[key]=next;onChange(value);},labels[key]||key));}}
  return box;
}
async function pickFile(onUploaded,accept="image/png,image/jpeg,image/webp,image/gif"){
  const input=node("input",{type:"file",accept});input.onchange=async()=>{const file=input.files[0];if(!file)return;say("Uploading…");try{const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]);reader.onerror=reject;reader.readAsDataURL(file);});const result=await api("/api/upload",{collection:state.collection,id:state.id,filename:file.name,base64});onUploaded(result);dirty();renderEditor();}catch(error){say(error.message,true);}};input.click();
}
function renderBrain(main){
  simple(main,"title");simple(main,"content","textarea");
  const row=node("div",{class:"row"});
  row.append(field("Visibility",state.draft.status,v=>state.draft.status=v,["published","draft","private","archive","graveyard"]),field("Feature on Home",state.draft.featured,v=>state.draft.featured=v,"checkbox"));main.append(row);
  const checks=node("div",{class:"checks"});
  Object.entries(domains).forEach(([key,label])=>checks.append(node("label",{},node("input",{type:"checkbox",checked:state.draft.domains?.includes(key)||false,onChange:e=>{state.draft.domains=Object.keys(domains).filter(d=>d===key?e.target.checked:state.draft.domains?.includes(d));dirty();}}),label)));
  main.append(node("h3",{text:"Domains"}),checks);
  simple(main,"subtype","text","Type (note, photo, album, event…)");simple(main,"relationship","text","Relationship (made, collected, learned…)");main.append(field("Tags",state.draft.tags?.join(", ")||"",v=>state.draft.tags=v.split(",").map(s=>s.trim()).filter(Boolean)));
  main.append(field("Related objects (IDs, separated by commas)",state.draft.relatedIds?.join(", ")||"",v=>state.draft.relatedIds=v.split(",").map(s=>s.trim()).filter(Boolean)));
  simple(main,"originalDate");simple(main,"datePrecision",["unknown","date","exact","month","year","approximate","range"]);simple(main,"displayDateOverride");simple(main,"relatedUrl");
  main.append(node("h3",{text:"Media"}));
  (state.draft.media||[]).forEach((m,i)=>main.append(node("div",{class:"item"},node("img",{src:preview("/brain/"+m.filename),alt:m.alt||""}),field("Alternative text",m.alt||"",v=>m.alt=v),node("button",{text:"Remove from object",onClick:()=>{state.draft.media.splice(i,1);dirty();renderEditor();}}))));
  main.append(node("button",{text:"Upload image",onClick:()=>pickFile(m=>{state.draft.media??=[];state.draft.media.push(m);})}));
  const extra=node("details",{},node("summary",{text:"Additional metadata"}));
  for(const key of ["contentEntries","credit","rating","category","secondaryCategory","type","vessel","emailFrom","emailTo"]){if(state.draft[key]!==undefined)extra.append(generic(state.draft[key],v=>state.draft[key]=v,labels[key]||key));}
  main.append(extra);
}
function renderProject(main){
  main.append(node("div",{class:"row"},...["metadata","article"].map(tab=>node("button",{text:tab,"aria-pressed":state.tab===tab,onClick:()=>{state.tab=tab;renderEditor();}}))));
  if(state.tab==="metadata"){
    for(const key of ["title","company","role","year","tagline","result","previewOutcome"])simple(main,key,key==="result"?"textarea":"text");
    main.append(field("Featured on Home",state.draft.featured??["chance-deposit-flow","adem-user-list","carinsurance-com","chance-live"].includes(state.id),v=>state.draft.featured=v,"checkbox"));
    simple(main,"order","number","Order on Home");
    main.append(generic(state.draft.metrics,v=>state.draft.metrics=v,"Outcomes"));
    state.draft.content??={heroLine:"",blocks:[]};
    main.append(field("Opening summary",state.draft.content.heroLine,v=>state.draft.content.heroLine=v,"textarea"));
    if(state.draft.content.heroImage){main.append(node("img",{src:preview(state.draft.content.heroImage.src),alt:"",style:"width:100%;max-height:260px;object-fit:contain"}),generic(state.draft.content.heroImage,v=>state.draft.content.heroImage=v,"Hero image"));}
    main.append(node("button",{text:"Upload hero image",onClick:()=>pickFile(({video,...image})=>state.draft.content.heroImage=image)}));
    if(state.id!=="adem-user-list"){if(state.draft.previewImage)main.append(generic(state.draft.previewImage,v=>state.draft.previewImage=v,"Homepage image"));main.append(node("div",{class:"row"},node("button",{text:"Upload homepage image",onClick:()=>pickFile(image=>state.draft.previewImage={src:image.src,alt:image.alt})}),node("button",{text:"Use interactive default",onClick:()=>{delete state.draft.previewImage;dirty();renderEditor();}})));}
    return;
  }
  state.draft.content??={heroLine:"",blocks:[]};const blocks=state.draft.content.blocks;
  const tools=node("div",{class:"row"});const kinds=node("select",{"aria-label":"New block type"},Object.keys(defaults).map(k=>node("option",{value:k,text:k})));
  tools.append(kinds,node("button",{text:"Add block",onClick:()=>{blocks.push(structuredClone(defaults[kinds.value]));state.block=blocks.length-1;dirty();renderEditor();}}),node("button",{text:"Upload image / video",onClick:()=>pickFile(asset=>{const {video,...image}=asset;blocks.push(video?{kind:"video",src:asset.src,caption:""}:{kind:"image",...image,caption:""});state.block=blocks.length-1;},"image/png,image/jpeg,image/webp,image/gif,video/mp4")}));
  main.append(tools);
  const list=node("nav",{class:"block-list","aria-label":"Article blocks"}),editor=node("div"),layout=node("div",{class:"article-editor"},list,editor);main.append(layout);
  blocks.forEach((block,i)=>list.append(node("button",{"aria-pressed":state.block===i,onClick:()=>{state.block=i;renderEditor();}},String(block.heading||block.label||block.text||block.body?.[0]||block.caption||block.kind).slice(0,80),node("small",{text:block.kind}))));
  const block=blocks[state.block];if(!block)return;
  editor.append(node("div",{class:"row"},node("button",{text:"Move up",disabled:state.block===0,onClick:()=>{const i=state.block;[blocks[i-1],blocks[i]]=[blocks[i],blocks[i-1]];state.block--;dirty();renderEditor();}}),node("button",{text:"Move down",disabled:state.block===blocks.length-1,onClick:()=>{const i=state.block;[blocks[i+1],blocks[i]]=[blocks[i],blocks[i+1]];state.block++;dirty();renderEditor();}}),node("button",{text:"Remove block",onClick:()=>{if(!confirm("Remove this block from your draft?"))return;blocks.splice(state.block,1);state.block=Math.max(0,state.block-1);dirty();renderEditor();}})));
  if(block.kind==="image"&&block.src)editor.append(node("img",{src:preview(block.src),alt:block.alt||"",style:"max-width:100%;max-height:280px;object-fit:contain"}));
  editor.append(generic(block,v=>blocks[state.block]=v,""));
  const advanced=node("details",{},node("summary",{text:"Block data"}),node("p",{class:"help",text:"For uncommon fields. Normal text and media edits use the form above."}));
  const raw=node("textarea",{value:JSON.stringify(block,null,2),rows:12,"aria-label":"Block JSON"});
  advanced.append(raw,node("button",{text:"Apply block data",onClick:()=>{try{const value=JSON.parse(raw.value);if(!value.kind)throw new Error("Block needs a kind");blocks[state.block]=value;dirty();renderEditor();}catch(error){say(error.message,true);}}}));editor.append(advanced);
}
function renderEditor(){
  const main=$("#editor");main.replaceChildren();
  const link=state.collection==="brain"?"/brain?object="+state.id:state.collection==="projects"?"/work/"+state.id:"/";
  main.append(node("div",{class:"title-row"},node("h2",{text:state.collection==="site"?"Site settings":state.draft.title||state.id}),node("a",{class:"preview",href:"http://localhost:3000"+link,target:"_blank",rel:"noreferrer",text:"Preview ↗"})));
  if(state.collection==="brain")renderBrain(main);
  else if(state.collection==="projects")renderProject(main);
  else for(const key of Object.keys(state.draft))simple(main,key);
}
$("#search").addEventListener("input",renderList);
document.querySelectorAll("[data-collection]").forEach(button=>button.addEventListener("click",()=>{if(!abandon())return;state.collection=button.dataset.collection;state.id=null;state.dirty=false;select(state.collection==="site"?"site":state.catalog[state.collection][0]?.id||state.catalog[state.collection][0]?.slug,true);}));
$("#reload").addEventListener("click",()=>reload().catch(e=>say(e.message,true)));
$("#new").addEventListener("click",()=>{if(!abandon())return;const next=Math.max(...state.catalog.brain.map(o=>Number(o.id.slice(2))))+1;const id="B-"+String(next).padStart(4,"0");const record={id,type:"thought",status:"draft",title:"",content:"",domains:[],tags:[],relationship:"",subtype:"note",media:[],relatedIds:[],datePrecision:"unknown"};state.catalog.brain.push(record);select(id,true);dirty();});
$("#save").addEventListener("click",async()=>{const button=$("#save");button.disabled=true;say("Validating and saving…");try{const result=await api("/api/save",{collection:state.collection,id:state.id,record:state.draft,revision:state.catalog.revisions[state.collection]});state.undo={collection:state.collection,id:state.id,record:structuredClone(state.collection==="site"?state.catalog.site:state.catalog[state.collection].find(r=>(r.id||r.slug)===state.id))};$("#undo").disabled=false;state.catalog.revisions[state.collection]=result.revision;if(state.collection==="site")state.catalog.site=structuredClone(state.draft);else{const items=state.catalog[state.collection];items[items.findIndex(r=>(r.id||r.slug)===state.id)]=structuredClone(state.draft);}state.dirty=false;say("Saved locally.");renderList();}catch(error){button.disabled=false;say(error.message,true);}});
$("#undo").addEventListener("click",()=>{if(!state.undo||!abandon())return;state.draft=structuredClone(state.undo.record);dirty();renderEditor();$("#save").click();});
window.addEventListener("beforeunload",event=>{if(state.dirty){event.preventDefault();event.returnValue="";}});
reload().catch(error=>say(error.message,true));
