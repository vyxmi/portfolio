import { readFile } from "node:fs/promises";
import path from "node:path";
import { brainObjects } from "@/lib/brain/objects";
import { isPrivate } from "@/lib/brain/resolvers";

export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (path.basename(filename) !== filename || !brainObjects.some(o => !isPrivate(o) && o.media?.some(m => m.filename === filename))) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "private, no-store" } });
  }
  const preview = new URL(request.url).searchParams.has("preview");
  try {
    const file = preview ? path.join(process.cwd(), "content/brain-previews", filename + ".webp") : path.join(process.cwd(), "content/brain-media", filename);
    let bytes: Buffer;
    let extension = preview ? ".webp" : path.extname(filename).toLowerCase();
    try { bytes = await readFile(file); } catch {
      if (!preview) throw new Error("Missing media");
      bytes = await readFile(path.join(process.cwd(), "content/brain-media", filename));
      extension = path.extname(filename).toLowerCase();
    }
    const mime: Record<string,string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };
    return new Response(new Uint8Array(bytes), { headers: { "Content-Type": mime[extension] || "application/octet-stream", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response("Not found", { status: 404 }); }
}
