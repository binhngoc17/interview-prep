import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LoginCode } from "./auth";

type StoredCode = LoginCode & { sentAt: number };

const FILE = path.join(process.cwd(), "data", "login-codes.json");

async function readAll(): Promise<Record<string, StoredCode>> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Record<
      string,
      StoredCode
    >;
  } catch {
    return {};
  }
}

async function writeAll(codes: Record<string, StoredCode>): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(codes));
}

export async function saveLoginCode(
  record: LoginCode,
  sentAt: number,
): Promise<void> {
  const codes = await readAll();
  codes[record.email] = { ...record, sentAt };
  await writeAll(codes);
}

export async function takeLoginCode(email: string): Promise<StoredCode | null> {
  const codes = await readAll();
  return codes[email] ?? null;
}

export async function updateLoginCode(record: StoredCode): Promise<void> {
  const codes = await readAll();
  codes[record.email] = record;
  await writeAll(codes);
}
