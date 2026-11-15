import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/current-user";

const LEVELS = new Set(["mid", "senior", "staff"]);
const FILE = path.join(process.cwd(), "data", "prep-requests.jsonl");

export async function POST(request: Request) {
  const session = await getSession();
  if (!session)
    return Response.json(
      { ok: false, error: "Log in to continue." },
      { status: 401 },
    );

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const record =
    typeof body === "object" && body ? (body as Record<string, unknown>) : {};
  const company =
    typeof record.company === "string" ? record.company.trim() : "";
  const role = typeof record.role === "string" ? record.role.trim() : "";
  const level = typeof record.level === "string" ? record.level : "";
  const date = typeof record.date === "string" ? record.date : "";
  if (company.length < 2 || company.length > 80) {
    return Response.json(
      { ok: false, error: "Enter the company." },
      { status: 400 },
    );
  }
  if (role.length < 2 || role.length > 120) {
    return Response.json(
      { ok: false, error: "Enter the role." },
      { status: 400 },
    );
  }
  if (!LEVELS.has(level))
    return Response.json(
      { ok: false, error: "Choose a level." },
      { status: 400 },
    );
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json(
      { ok: false, error: "Choose the interview date." },
      { status: 400 },
    );
  }

  await mkdir(path.dirname(FILE), { recursive: true });
  await appendFile(
    FILE,
    `${JSON.stringify({ email: session.email, company, role, level, date, requestedAt: new Date().toISOString() })}\n`,
  );
  return Response.json({ ok: true });
}
