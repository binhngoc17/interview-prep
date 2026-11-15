import { DRILLS } from "@/lib/catalog";
import { readActivity } from "@/lib/activity-store";
import { getSession } from "@/lib/current-user";
import { canStart } from "@/lib/entitlements";

export default async function DrillsPage() {
  const session = await getSession();
  const history = session ? await readActivity(session.email) : [];
  const gate = canStart(history, "drill", Date.now());

  return (
    <main className="app-page">
      <p className="kicker">Drills</p>
      <h1>Ten minutes, one idea.</h1>
      <p className="app-meta">
        {gate.used} of {gate.limit} used this week.
      </p>
      <ul className="app-list">
        {DRILLS.map((item) => (
          <li key={item.slug}>
            <div>
              <h2>{item.title}</h2>
              <p className="app-meta">{item.minutes}</p>
            </div>
            <a className="btn btn-primary" href={`/app/drills/${item.slug}`}>
              Start
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
