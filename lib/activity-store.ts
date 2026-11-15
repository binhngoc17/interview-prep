import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import type { Activity } from "./entitlements";

const FILE = path.join(process.cwd(), "data", "activity.jsonl");

export type StoredActivity = Activity & { answers?: Record<string, string> };

export async function readActivity(email: string): Promise<StoredActivity[]> {
  try {
    const text = await readFile(FILE, "utf8");
    return text
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StoredActivity)
      .filter((item) => item.email === email);
  } catch {
    return [];
  }
}

export async function writeActivity(item: StoredActivity): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true });
  await appendFile(FILE, `${JSON.stringify(item)}\n`);
}
