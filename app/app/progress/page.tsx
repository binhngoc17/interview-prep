import { readActivity } from "@/lib/activity-store";
import { drill, simulation } from "@/lib/catalog";
import { getSession } from "@/lib/current-user";

export default async function ProgressPage() {
  const session = await getSession();
  const history = session
    ? (await readActivity(session.email)).slice().reverse()
    : [];

  return (
    <main className="app-page">
      <p className="kicker">Progress</p>
      <h1>What you have practiced.</h1>
      {history.length === 0 ? (
        <p>Nothing saved yet. A finished simulation or drill shows up here.</p>
      ) : (
        <ul className="app-list">
          {history.map((item) => {
            const title =
              item.kind === "drill"
                ? drill(item.slug)?.title
                : simulation(item.slug)?.title;
            return (
              <li key={`${item.at}-${item.slug}`}>
                <div>
                  <span className="chip">{item.kind}</span>
                  <h2>{title ?? item.slug}</h2>
                  <p className="app-meta">
                    {new Date(item.at).toLocaleString("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
