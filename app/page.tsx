import { getSession } from "@/lib/current-user";
import { site } from "@/lib/site";
import { InterviewDemo } from "./components/InterviewDemo";
import { WaitlistForm } from "./components/WaitlistForm";

const LOOP = [
  {
    name: "Design",
    time: "20–25 min",
    body: "A voice AI interviewer walks you through requirements, estimation, high-level design, deep dive, and trade-offs while you draw on a live whiteboard.",
  },
  {
    name: "Defend",
    time: "10 min",
    body: "The interviewer reads your diagram, finds the weak spots, and pushes on them the way a senior interviewer would.",
  },
  {
    name: "Score",
    time: "Instant",
    body: "A separate evaluator scores you on seven rubric dimensions and gives you the top three fixes. It is calibrated against mentor-scored sessions.",
  },
  {
    name: "Build",
    time: "30–60 min, optional",
    body: "Your design becomes a spec, a scaffold, and failing tests for one thin slice. Implement it with an AI assistant and get scored on fidelity to your design.",
  },
];

const RUBRIC = [
  {
    name: "Requirements",
    score: 4.0,
    note: "Clarified QPS, latency, cost caps",
  },
  { name: "Estimation", score: 3.0, note: "Token throughput not estimated" },
  { name: "Architecture", score: 4.0, note: "Clear routing and quota path" },
  { name: "Depth", score: 3.0, note: "Cache invalidation shallow" },
  { name: "Trade-offs", score: 3.0, note: "No failover cost discussion" },
  { name: "Communication", score: 4.0, note: "Structured, narrated decisions" },
  { name: "AI concerns", score: 3.0, note: "Eval and safety filters missing" },
];

const QUESTIONS = [
  "LLM gateway",
  "Enterprise RAG",
  "Agent orchestration",
  "Semantic cache",
  "1B-vector database",
  "AI coding assistant backend",
  "Voice-agent infrastructure",
  "LLM eval pipeline",
  "GPU scheduler",
  "Token-based rate limiter",
];

const DAILY = [
  {
    name: "Micro-drills",
    body: "5–10 minute reps on estimation, API design, and failure modes.",
  },
  {
    name: "Question of the Week",
    body: "One fresh emerging-tech prompt every week, free for everyone.",
  },
  {
    name: "Pattern cards",
    body: "Two-minute refreshers on backpressure, idempotency, cache invalidation.",
  },
  {
    name: "Skills map",
    body: "See where you are solid, developing, or untested at each level.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "Start practicing today",
    features: [
      "3 drills per week",
      "1 simulation per month",
      "Question of the Week",
    ],
  },
  {
    name: "Pro",
    price: "Founding price",
    note: "Locked in for waitlist members",
    featured: true,
    features: [
      "Unlimited drills",
      "8 simulations per month",
      "Build Mode",
      "Full question bank",
      "Exclusive company packs",
      "On-demand prep before your interview",
    ],
  },
  {
    name: "Pro + Mentor",
    price: "Founding price",
    note: "For a human second opinion",
    features: [
      "Everything in Pro",
      "One 20-minute Big Tech mentor review per month",
    ],
  },
];

const FAQ = [
  {
    q: "Can I use this during a real interview?",
    a: "No, and we will never build that. There are no overlays, hidden copilots, or screen readers. This is for practice before the interview, so the skill is yours when it counts.",
  },
  {
    q: "Do I have to speak out loud?",
    a: "Voice is the default because real interviews are spoken, but text mode is always one click away.",
  },
  {
    q: "Can I practice in Vietnamese?",
    a: "Explanations and concept notes can switch to Vietnamese. Practice and scoring stay in English, because your interview will be in English.",
  },
  {
    q: "What is in a company pack?",
    a: "A short brief on how the target team interviews plus full practice questions, grounded in alumni debriefs and public engineering posts. Anything a source does not support is labeled as a practice expectation. Prompts are original, never leaked questions.",
  },
  {
    q: "How much can I trust the AI score?",
    a: "Scoring runs in a separate evaluator, not the interviewer, to avoid flattery. We calibrate it against sessions scored by Big Tech mentors and track how often they agree.",
  },
  {
    q: "When can I start?",
    a: "Beta invites go out in waves, starting with the waitlist.",
  },
];

export default async function Home() {
  const session = await getSession();
  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a href="#top" className="logo">
            <span className="logo-mark" aria-hidden="true" />
            {site.name}
          </a>
          <nav aria-label="Main">
            <a href="#how-it-works">How it works</a>
            <a href="#questions">Questions</a>
            <a href="#packs">Company packs</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a
            href={session ? "/app" : "/login"}
            className="btn btn-primary btn-sm"
          >
            {session ? "Open app" : "Log in"}
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="pulse" aria-hidden="true" />
                AI system design interviews for the AI era
              </p>
              <h1>
                Practice like it&apos;s the real interview —{" "}
                <span className="grad">then build it.</span>
              </h1>
              <p className="lede">
                A voice AI interviewer and a live whiteboard on the questions
                Big Tech asks now: LLM gateways, RAG, agents, GPU scheduling.
                Get scored on a calibrated rubric, then implement a slice of
                your own design.
              </p>
              <div className="hero-cta">
                <a href="#waitlist" className="btn btn-primary">
                  Join the waitlist
                </a>
                <a href="#how-it-works" className="btn btn-ghost">
                  See how it works
                </a>
              </div>
              <p className="hero-vi" lang="vi">
                {site.taglineVi}
              </p>
            </div>
            <InterviewDemo />
          </div>
        </section>

        <section id="how-it-works" className="section">
          <div className="container">
            <div className="section-head">
              <p className="kicker">The loop</p>
              <h2>Design. Defend. Build.</h2>
              <p>
                Other tools stop at feedback. You finish by building what you
                designed.
              </p>
            </div>
            <ol className="loop">
              {LOOP.map((step, index) => (
                <li key={step.name} className="loop-step">
                  <span className="loop-num">{index + 1}</span>
                  <h3>{step.name}</h3>
                  <span className="chip">{step.time}</span>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container split">
            <div>
              <p className="kicker">Score report</p>
              <h2>Know exactly what a senior interviewer would flag.</h2>
              <p>
                Seven dimensions, including the one most prep ignores: AI
                concerns such as cost, latency, evals, and safety. Every score
                comes with the evidence from your session and the three fixes
                that move you up a level.
              </p>
              <ul className="ticks">
                <li>
                  Separate evaluator, never the interviewer grading itself
                </li>
                <li>Calibrated against Big Tech mentor scores</li>
                <li>Replay the transcript and diagram for any score</li>
              </ul>
            </div>
            <div
              className="report"
              aria-label="Sample score report, illustrative"
            >
              <div className="report-head">
                <div>
                  <strong>LLM gateway for 50 teams</strong>
                  <span>
                    Sample report · Estimated level: Senior (borderline)
                  </span>
                </div>
                <span className="report-score">3.4</span>
              </div>
              <ul className="bars">
                {RUBRIC.map((row) => (
                  <li key={row.name}>
                    <span className="bar-name">{row.name}</span>
                    <span className="bar" aria-hidden="true">
                      <span style={{ width: `${(row.score / 5) * 100}%` }} />
                    </span>
                    <span className="bar-score">{row.score.toFixed(1)}</span>
                    <span className="bar-note">{row.note}</span>
                  </li>
                ))}
              </ul>
              <div className="report-fixes">
                <strong>Top fix</strong> Estimate tokens/sec and cost per team
                before choosing providers.
              </div>
            </div>
          </div>
        </section>

        <section id="questions" className="section">
          <div className="container">
            <div className="section-head">
              <p className="kicker">Question bank</p>
              <h2>
                The system design questions that are actually being asked.
              </h2>
              <p>
                Sourced from mentor recollections, alumni debriefs, and
                engineering blogs. Each ships with level variants, interviewer
                probes, failure scenarios, a reference architecture, and a Build
                slice.
              </p>
            </div>
            <ul className="topics">
              {QUESTIONS.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="packs" className="section section-dark">
          <div className="container">
            <div className="section-head">
              <p className="kicker">Pro</p>
              <h2>Interviewing somewhere specific? Prepare for that room.</h2>
            </div>
            <div className="packs">
              <article className="pack-card">
                <span className="chip chip-accent">Exclusive</span>
                <h3>Company packs</h3>
                <p>
                  How the target team runs its system design round, plus full
                  practice questions with probes and a rubric. Grounded in
                  alumni debriefs and public engineering posts, reviewed by a
                  person before it goes live.
                </p>
                <div
                  className="pack-preview"
                  aria-label="Example pack, illustrative"
                >
                  <div className="pack-row">
                    <span>Backend engineer, AI platform</span>
                    <span className="chip">Senior</span>
                  </div>
                  <p>
                    Expect one 45-minute system design round{" "}
                    <em>(alumni debrief)</em>. Practice expectation: estimate
                    tokens per second and discuss eval after a provider
                    fallback.
                  </p>
                  <span className="pack-meta">
                    2 questions · 4 probes each · 7-dimension rubric
                  </span>
                </div>
              </article>
              <article className="pack-card">
                <span className="chip chip-accent">On demand</span>
                <h3>Prep for your interview date</h3>
                <p>
                  Tell us the company, role, level, and date. We prepare a pack
                  for that interview and add it to your practice plan, so your
                  last two weeks go to the right questions.
                </p>
                <ol className="request-steps">
                  <li>
                    <strong>Request</strong> Company, role, level, interview
                    date
                  </li>
                  <li>
                    <strong>We prepare</strong> A brief and questions, reviewed
                    before release
                  </li>
                  <li>
                    <strong>You practice</strong> Full simulations against that
                    pack, scored
                  </li>
                </ol>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <p className="kicker">Every day</p>
              <h2>Ten minutes a day keeps the rust off.</h2>
            </div>
            <ul className="daily">
              {DAILY.map((item) => (
                <li key={item.name}>
                  <h3>{item.name}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section principle">
          <div className="container principle-inner">
            <h2>Learn it, don&apos;t fake it.</h2>
            <p>
              No live-interview assistance, ever. We build tools that make you
              better before the interview, so the offer is earned and the job is
              one you can actually do.
            </p>
          </div>
        </section>

        <section id="pricing" className="section">
          <div className="container">
            <div className="section-head">
              <p className="kicker">Pricing</p>
              <h2>
                Start free. Upgrade when your interview is on the calendar.
              </h2>
              <p>
                Pricing is being finalized. Waitlist members lock in founding
                prices.
              </p>
            </div>
            <ul className="plans">
              {PLANS.map((plan) => (
                <li
                  key={plan.name}
                  className={`plan ${plan.featured ? "plan-featured" : ""}`}
                >
                  {plan.featured && (
                    <span className="plan-badge">Recommended</span>
                  )}
                  <h3>{plan.name}</h3>
                  <p className="plan-price">{plan.price}</p>
                  <p className="plan-note">{plan.note}</p>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <a
                    href="#waitlist"
                    className={`btn ${plan.featured ? "btn-primary" : "btn-ghost"}`}
                  >
                    {plan.name === "Free"
                      ? "Get early access"
                      : "Join for founding price"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="faq" className="section section-alt">
          <div className="container faq-wrap">
            <div className="section-head">
              <p className="kicker">FAQ</p>
              <h2>Questions, answered.</h2>
            </div>
            <div className="faq">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="waitlist" className="section cta">
          <div className="container cta-inner">
            <div>
              <h2>Your next system design round, rehearsed.</h2>
              <p>
                Join the waitlist for a beta invite and founding pricing. Tell
                us when you&apos;re interviewing and we&apos;ll prioritize you.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="logo">
            <span className="logo-mark" aria-hidden="true" />
            {site.name}
          </span>
          <span>Practice before the interview. Never during it.</span>
        </div>
      </footer>
    </>
  );
}
