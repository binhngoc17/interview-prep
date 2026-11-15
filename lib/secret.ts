import { randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

let cached: string | undefined;

export function authSecret(): string {
  if (cached) return cached;
  const fromEnv = process.env.AUTH_SECRET;
  if (fromEnv && fromEnv.length >= 16) {
    cached = fromEnv;
    return cached;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be at least 16 characters");
  }
  const file = path.join(process.cwd(), "data", "dev-auth-secret");
  try {
    cached = readFileSync(file, "utf8").trim();
  } catch {
    cached = randomBytes(32).toString("hex");
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, cached);
  }
  if (cached.length < 16)
    throw new Error("AUTH_SECRET must be at least 16 characters");
  return cached;
}
