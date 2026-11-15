import { notFound } from "next/navigation";
import { AnswerForm } from "@/app/components/AnswerForm";
import { readActivity } from "@/lib/activity-store";
import { drill } from "@/lib/catalog";
import { getSession } from "@/lib/current-user";
import { canStart } from "@/lib/entitlements";

export default async function DrillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = drill(slug);
  if (!item) notFound();
  const session = await getSession();
  const history = session ? await readActivity(session.email) : [];
  const gate = canStart(history, "drill", Date.now());

  return (
    <main className="app-page">
      <p className="kicker">Drill · {item.minutes}</p>
      <h1>{item.title}</h1>
      {gate.allowed ? (
        <AnswerForm
          kind="drill"
          slug={item.slug}
          steps={[{ id: "answer", phase: "Drill", prompt: item.prompt }]}
        />
      ) : (
        <p className="waitlist-error" role="status">
          The free plan includes {gate.limit} drills this week.
        </p>
      )}
    </main>
  );
}
