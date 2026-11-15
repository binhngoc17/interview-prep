import { SIMULATIONS } from "@/lib/catalog";

export default function PracticePage() {
  return (
    <main className="app-page">
      <p className="kicker">Practice</p>
      <h1>Design, then defend.</h1>
      <ul className="app-list">
        {SIMULATIONS.map((item) => (
          <li key={item.slug}>
            <div>
              <span className="chip">{item.badge}</span>
              <h2>{item.title}</h2>
              <p>{item.prompt}</p>
              <p className="app-meta">
                {item.level} · {item.minutes}
                {item.counts
                  ? " · uses your monthly simulation"
                  : " · free this week"}
              </p>
            </div>
            <a className="btn btn-primary" href={`/app/practice/${item.slug}`}>
              Start
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
