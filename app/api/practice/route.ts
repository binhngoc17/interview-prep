import { writeActivity, readActivity } from "@/lib/activity-store";
import { drill, simulation } from "@/lib/catalog";
import { getSession } from "@/lib/current-user";
import { canStart } from "@/lib/entitlements";

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
  const kind =
    record.kind === "drill"
      ? "drill"
      : record.kind === "simulation"
        ? "simulation"
        : null;
  const slug = typeof record.slug === "string" ? record.slug : "";
  const answers = isStringRecord(record.answers) ? record.answers : null;
  if (!kind || !answers)
    return Response.json(
      { ok: false, error: "That session could not be saved." },
      { status: 400 },
    );

  const item = kind === "drill" ? drill(slug) : simulation(slug);
  if (!item)
    return Response.json(
      { ok: false, error: "That session could not be saved." },
      { status: 400 },
    );
  const expected =
    kind === "drill"
      ? ["answer"]
      : simulation(slug)!.steps.map((step) => step.id);
  if (expected.some((id) => !answers[id]?.trim())) {
    return Response.json(
      { ok: false, error: "Answer every prompt before finishing." },
      { status: 400 },
    );
  }

  const counts = kind === "simulation" ? simulation(slug)!.counts : true;
  const history = await readActivity(session.email);
  const gate = canStart(history, kind, Date.now());
  if (counts && !gate.allowed) {
    const noun =
      kind === "drill" ? "drills this week" : "simulation this month";
    return Response.json(
      { ok: false, error: `The free plan includes ${gate.limit} ${noun}.` },
      { status: 403 },
    );
  }

  await writeActivity({
    email: session.email,
    kind,
    slug,
    at: new Date().toISOString(),
    counts,
    answers,
  });
  return Response.json({ ok: true });
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    return false;
  return Object.values(value).every((item) => typeof item === "string");
}
