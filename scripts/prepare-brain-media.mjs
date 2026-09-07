import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const original = path.join(root, "content/brain-media");
const previews = path.join(root, "content/brain-previews");
await fs.mkdir(original, { recursive: true });
await fs.mkdir(previews, { recursive: true });
// One-time migration: no Brain asset bypasses the public visibility check.
const old = path.join(root, "public/brain");
for (const file of await fs.readdir(old).catch(() => [])) {
  if (/\.(png|jpe?g|gif|webp)$/i.test(file)) await fs.rename(path.join(old,file), path.join(original,file));
}
let bytesBefore = 0, bytesAfter = 0, count = 0;
for (const file of await fs.readdir(original)) {
  if (!/\.(png|jpe?g|gif|webp)$/i.test(file)) continue;
  const source = path.join(original,file), target = path.join(previews,file+".webp");
  bytesBefore += (await fs.stat(source)).size;
  try { await fs.access(target); } catch { await sharp(source).rotate().resize({width:800,height:1000,fit:"inside",withoutEnlargement:true}).webp({quality:78}).toFile(target); }
  bytesAfter += (await fs.stat(target)).size;
  count++;
}
console.log(JSON.stringify({count,originalMB:Math.round(bytesBefore/1048576),previewMB:Math.round(bytesAfter/1048576*10)/10}));
