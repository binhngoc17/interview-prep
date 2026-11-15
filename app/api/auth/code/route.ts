import { issueLoginCode, normalizeEmail } from "@/lib/auth";
import { saveLoginCode, takeLoginCode } from "@/lib/code-store";
import { deliverLoginCode } from "@/lib/mail";
import { authSecret } from "@/lib/secret";

const RESEND_AFTER_MS = 30_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const email = normalizeEmail(
    typeof body === "object" && body && "email" in body
      ? String(body.email)
      : "",
  );
  if (!email)
    return Response.json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );

  const existing = await takeLoginCode(email);
  if (existing && Date.now() - existing.sentAt < RESEND_AFTER_MS) {
    return Response.json(
      { ok: false, error: "Wait a moment before requesting another code." },
      { status: 429 },
    );
  }

  const issued = issueLoginCode(email, authSecret(), Date.now());
  try {
    const delivery = await deliverLoginCode(email, issued.code);
    await saveLoginCode(issued.record, Date.now());
    return Response.json({
      ok: true,
      devCode: delivery === "dev" ? issued.code : undefined,
    });
  } catch {
    return Response.json(
      { ok: false, error: "We couldn't send the code. Try again." },
      { status: 503 },
    );
  }
}
