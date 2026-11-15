import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { parseWaitlistEntry } from "@/lib/waitlist";

const WAITLIST_FILE = path.join(process.cwd(), "data", "waitlist.jsonl");

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const result = parseWaitlistEntry(body);
  if (!result.ok) {
    return Response.json(result, { status: 400 });
  }

  await mkdir(path.dirname(WAITLIST_FILE), { recursive: true });
  await appendFile(
    WAITLIST_FILE,
    `${JSON.stringify({ ...result.entry, joinedAt: new Date().toISOString() })}\n`,
  );
  return Response.json({ ok: true });
}
