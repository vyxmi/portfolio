import { readFile } from "node:fs/promises";
import path from "node:path";
import { hasCaseStudyAccess } from "@/lib/case-study-access";

export const runtime = "nodejs";
const types: Record<string, string> = { ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".mp4":"video/mp4" };
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
  if (!(await hasCaseStudyAccess())) return new Response(null, { status: 401, headers });
  const { filename } = await params;
  if (!/^[a-zA-Z0-9_-]+\.(png|webp|gif|jpe?g|mp4)$/.test(filename)) return new Response(null, { status: 404, headers });
  try {
    const bytes = await readFile(path.join(process.cwd(), "content/protected/adem-user-list", filename));
    return new Response(new Uint8Array(bytes), { headers: { ...headers, "Content-Type": types[path.extname(filename)] } });
  } catch {
    return new Response(null, { status: 404, headers });
  }
}
