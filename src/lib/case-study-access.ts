import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ACCESS_COOKIE = "adem-reviewer";
export const ACCESS_SECONDS = 8 * 60 * 60;

function secret() { return process.env.ADEM_CASE_STUDY_PASSWORD; }
function signature(value: string, key: string) {
  return createHmac("sha256", key).update(`adem:${value}`).digest("hex");
}
export function passwordMatches(value: string) {
  const key = secret();
  if (!key || !value || value.length > 1024) return false;
  return timingSafeEqual(createHash("sha256").update(value).digest(), createHash("sha256").update(key).digest());
}
export function createAccessToken() {
  const key = secret();
  if (!key) throw new Error("ADEM reviewer access is not configured");
  const expiry = String(Math.floor(Date.now() / 1000) + ACCESS_SECONDS);
  return `${expiry}.${signature(expiry, key)}`;
}
export async function hasCaseStudyAccess() {
  const key = secret();
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!key || !token) return false;
  const match = /^(\d{10})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return false;
  const remaining = Number(match[1]) - Math.floor(Date.now() / 1000);
  if (remaining <= 0 || remaining > ACCESS_SECONDS) return false;
  return timingSafeEqual(Buffer.from(match[2], "hex"), Buffer.from(signature(match[1], key), "hex"));
}
