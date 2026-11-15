import { notFound } from "next/navigation";
import { packForCandidate } from "@/lib/candidate-pack";
import { listPublishedPacks } from "@/lib/published-packs";

export default async function PackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pack = (await listPublishedPacks()).find((item) => item.id === id);
  if (!pack) notFound();
  const view = packForCandidate(pack, "free");

  return (
    <main className="app-page">
      <p className="kicker">{pack.level}</p>
      <h1>
        {pack.company} · {pack.role}
      </h1>
      {view.locked ? (
        <p>
          This pack is part of Pro. Payments are not open yet, so the brief and
          questions stay hidden on the free plan.
        </p>
      ) : (
        <>
          <p className="lede">{view.brief}</p>
          <ol className="app-list">
            {view.questions.map((question) => (
              <li key={question.title}>
                <div>
                  <h2>{question.title}</h2>
                  <p>{question.prompt}</p>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}
