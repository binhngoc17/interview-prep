import { notFound } from "next/navigation";
import { AnswerForm } from "@/app/components/AnswerForm";
import { readActivity } from "@/lib/activity-store";
import { simulation } from "@/lib/catalog";
import { getSession } from "@/lib/current-user";
import { canStart } from "@/lib/entitlements";

export default async function SimulationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = simulation(slug);
  if (!item) notFound();
  const session = await getSession();
  const history = session ? await readActivity(session.email) : [];
  const gate = canStart(history, "simulation", Date.now());

  return (
    <main className="app-page">
      <p className="kicker">{item.badge}</p>
      <h1>{item.title}</h1>
      <p className="lede">{item.prompt}</p>
      {item.counts && !gate.allowed ? (
        <p className="waitlist-error" role="status">
          The free plan includes {gate.limit} simulation this month. The
          Question of the Week is still open.
        </p>
      ) : (
        <AnswerForm
          kind="simulation"
          slug={item.slug}
          steps={item.steps}
          build={item.build}
        />
      )}
    </main>
  );
}
