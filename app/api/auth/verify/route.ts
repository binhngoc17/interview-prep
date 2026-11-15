import { normalizeEmail, verifyLoginCode } from "@/lib/auth";
import { takeLoginCode, updateLoginCode } from "@/lib/code-store";
import { setSession } from "@/lib/current-user";
import { authSecret } from "@/lib/secret";

const MESSAGES = {
  invalid: "That code is not valid.",
  expired: "That code expired. Request a new one.",
  locked: "Too many attempts. Request a new code.",
  used: "That code was already used. Request a new one.",
} as const;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const record =
    typeof body === "object" && body ? (body as Record<string, unknown>) : {};
  const email = normalizeEmail(
    typeof record.email === "string" ? record.email : "",
  );
  const code = typeof record.code === "string" ? record.code.trim() : "";
  if (!email || !/^\d{6}$/.test(code)) {
    return Response.json(
      { ok: false, error: "Enter the 6-digit code." },
      { status: 400 },
    );
  }

  const stored = await takeLoginCode(email);
  if (!stored)
    return Response.json(
      { ok: false, error: MESSAGES.invalid },
      { status: 400 },
    );

  const result = verifyLoginCode(stored, code, authSecret(), Date.now());
  await updateLoginCode({ ...stored, ...result.record, sentAt: stored.sentAt });
  if (result.status !== "valid") {
    return Response.json(
      { ok: false, error: MESSAGES[result.status] },
      { status: 400 },
    );
  }

  await setSession(email);
  return Response.json({ ok: true });
}
