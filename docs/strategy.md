# Strategy summary — AI Interview Prep Platform

Summary of the 9 Nov 2026 brainstorming draft (owner: Ngoc). Competitor pricing came from secondary sources and is directional only; re-verify before pricing decisions.

## Opportunity

AI mock-interview products are converging on "AI interviewer + feedback report". None of the reviewed players:

1. Lets the candidate **build** what they designed.
2. Serves **Vietnamese-speaking** candidates natively.
3. Anchors on **emerging-tech (AI-systems) design** questions as the core bank.

Hello Interview ended human mocks on 31 May 2026, leaving room for "AI + real Big Tech mentors".

## Wedge: Design → Defend → Build

| Step | Length | What happens |
|---|---|---|
| Design | 20–25 min | Voice AI interviewer + whiteboard on an emerging-tech prompt; phases: requirements → estimation → high-level design → deep dive → trade-offs → wrap |
| Defend | 10 min | Interviewer probes weak spots found in the diagram |
| Score | — | Rubric report (requirements, estimation, architecture, depth, trade-offs, communication, AI concerns: cost/latency/eval/safety), scored by a separate evaluator pass, calibrated against mentors |
| Build | 30–60 min, optional | Design → spec + scaffold + failing tests for one thin slice; candidate implements with an AI assistant; scored on prompting, verification, and design fidelity |
| Review | upsell | 20-min human mentor review of the run |

**Bite-size layer:** 5–10 min micro-drills, Question of the Week, 2-min pattern cards, Vietnamese explain-mode (scoring stays in English), skills progress map.

**Unfair advantages:** EngineerPro's 2K+ alumni, 500+ offers, 17 Big Tech mentors, live cohorts, YouTube/Substack/podcast/Discord.

## Question bank

Sourced from mentor recollections, alumni debriefs, and engineering blogs. Each question ships with level variants, clarifying questions, reference architectures, rubric, interviewer probes, failure scenarios, and a Build-slice spec. Seed topics: LLM gateway, enterprise RAG, agent orchestration, semantic cache, 1B-vector DB, AI coding assistant backend, voice-agent infra, LLM eval pipeline, GPU scheduler, token-based rate limiter, and more. Mentor review before publish; quarterly refresh.

## MVP architecture

- Next.js web app + structured whiteboard (tldraw/Excalidraw-style JSON the AI can reason over).
- Voice via realtime speech-to-speech or STT→LLM→TTS, with text fallback.
- Interviewer = phase/probe state machine around an LLM; **evaluator runs in a separate context** to reduce sycophancy.
- Build Mode: containerized sandbox, templated repos, test runner, in-sandbox AI assistant.
- Data: transcripts, diagram JSON, rubric scores, mentor gold labels.
- Payments: Stripe + a Vietnamese gateway (MoMo/VNPay/bank transfer).

**Principles:** learning, not cheating (no live-interview assist); calibration over vibes; mentors as revenue-sharing co-owners.

## Pricing hypotheses

| Tier | Price | Includes |
|---|---|---|
| Free | $0 | 3 drills/week, 1 simulation/month, Question of the Week |
| Pro | ~$19–29/mo or ~$149–199/yr (VN ~₫250–400K/mo) | Unlimited drills, 8 simulations/mo, Build Mode, full bank |
| Pro + Mentor | ~$79–99/mo | Pro + 1 mentor review/mo |
| Cohort | Existing price | Live class + Pro |
| Teams/B2B | Per seat, later | Bootcamps, universities, companies |

No lifetime plans until per-simulation COGS is known.

## Timeline

| Phase | Dates | Exit criteria |
|---|---|---|
| 0 Validate | Nov 10 – Dec 7 | 30 interviews, 150 waitlist, prototype tested with 10 users, rubric v1 with 5 mentors |
| 1 MVP | Dec 8 – Feb 15 | Text + voice sim for 6 questions; 50 beta users; ≥70% finish; AI-vs-mentor correlation on 30+ sessions |
| 2 Build + bite-size | Feb 16 – Apr 12 | Drills, Build for 6 questions, VN explain-mode, payments; 300 beta users; W4 retention ≥35% |
| 3 Public launch | Apr 13 – Jun 7 | 20-question bank, Pro, mentor marketplace; COGS <25% of revenue; NPS ≥40 |
| 4 Scale | Jun onward | B2B, new roles, new languages |

## Go-to-market

Beachhead: EngineerPro alumni and followers (VN + diaspora). Seed with founders' pricing → weekly "Question of the Week" content flywheel → bundle Pro into cohorts → referrals and Discord mock rooms → USD diaspora pricing → university/employer partnerships. Taglines to test: "Practice like it's the real interview — then build it." / "Luyện như phỏng vấn thật, rồi xây nó thật." / "Learn it, don't fake it."

North-star metric: reported offers. Also track activation, sims/user/week, sim→Build conversion, free→paid, W4/W8 retention, AI-vs-mentor agreement, COGS per sim.

## Top risks

Unreliable AI scoring (mentor gold set, separate evaluator), voice cost (text-first, capped voice), competitor copying (mentor trust + emerging-tech depth), mentor bandwidth (revenue share), stale bank (weekly cadence), VN willingness to pay (PPP + local rails), ethics perception (no copilot features).

## Open questions

1. MVP target role: classic backend, AI/agentic, or both?
2. Brand: EngineerPro or a new product brand?
3. How many mentors can commit to Phase 0 calibration and authoring?
4. Existing cohort pricing and conversion data?
5. External funding vs. bootstrapping?
