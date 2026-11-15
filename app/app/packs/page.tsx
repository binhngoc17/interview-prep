import { packForCandidate } from "@/lib/candidate-pack";
import { listPublishedPacks } from "@/lib/published-packs";

export default async function PacksPage() {
  const packs = await listPublishedPacks();

  return (
    <main className="app-page">
      <p className="kicker">Company packs</p>
      <h1>Practice for a specific team.</h1>
      {packs.length === 0 ? (
        <p>
          No pack has been published yet. A pack goes live when its file is
          merged on the default branch.
        </p>
      ) : (
        <ul className="app-list">
          {packs.map((pack) => {
            const view = packForCandidate(pack, "free");
            return (
              <li key={pack.id}>
                <div>
                  <span className="chip">{view.locked ? "Pro" : "Free"}</span>
                  <h2>
                    {pack.company} · {pack.role}
                  </h2>
                  <p className="app-meta">{pack.level}</p>
                </div>
                <a className="btn btn-ghost" href={`/app/packs/${pack.id}`}>
                  {view.locked ? "Preview" : "Open"}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
