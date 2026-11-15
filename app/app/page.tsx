import { readActivity } from "@/lib/activity-store";
import { SIMULATIONS } from "@/lib/catalog";
import { getSession } from "@/lib/current-user";
import { canStart } from "@/lib/entitlements";

export default async function AppHome() {
  const session = await getSession();
  const history = session ? await readActivity(session.email) : [];
  const simulations = canStart(history, "simulation", Date.now());
  const drills = canStart(history, "drill", Date.now());
  const week = SIMULATIONS.find((item) => !item.counts);

  return (
    <main className="app-page">
      <p className="kicker">Free plan</p>
      <h1>What do you want to practice?</h1>
      <p className="lede">
        Text mode is live. Voice, the drawing whiteboard, and the calibrated
        score report come later. Your answers are saved so they can be scored.
      </p>
      <ul className="app-grid">
        <li>
          <h2>Design and defend</h2>
          <p>
            A full prompt with the interview phases, then two challenges on your
            answers.
          </p>
          <p className="app-meta">
            {simulations.used} of {simulations.limit} counted simulation used
            this month
          </p>
          <a className="btn btn-primary" href="/app/practice">
            Start practice
          </a>
        </li>
        <li>
          <h2>Question of the Week</h2>
          <p>{week?.title}. It does not use your monthly simulation.</p>
          <a className="btn btn-ghost" href={`/app/practice/${week?.slug}`}>
            Open it
          </a>
        </li>
        <li>
          <h2>Drills</h2>
          <p>
            Five-minute reps on estimation, idempotency, caching, and fallback.
          </p>
          <p className="app-meta">
            {drills.used} of {drills.limit} used this week
          </p>
          <a className="btn btn-ghost" href="/app/drills">
            Do a drill
          </a>
        </li>
        <li>
          <h2>Company packs</h2>
          <p>
            Published packs for a specific company and role. Exclusive packs are
            marked for Pro.
          </p>
          <a className="btn btn-ghost" href="/app/packs">
            Browse packs
          </a>
        </li>
        <li>
          <h2>On-demand prep</h2>
          <p>
            Tell us the company, role, level, and date. We prepare a pack before
            the interview.
          </p>
          <a className="btn btn-ghost" href="/app/request">
            Request a pack
          </a>
        </li>
        <li>
          <h2>Build</h2>
          <p>
            Each simulation ends with one thin slice and the checks it has to
            pass. The sandbox is not running yet.
          </p>
          <a className="btn btn-ghost" href="/app/progress">
            See saved work
          </a>
        </li>
      </ul>
    </main>
  );
}
