export type Step = { id: string; phase: string; prompt: string };

export type Simulation = {
  slug: string;
  title: string;
  level: "Senior";
  minutes: string;
  counts: boolean;
  badge: string;
  prompt: string;
  steps: Step[];
  build: { title: string; body: string; checks: string[] };
};

export type Drill = {
  slug: string;
  title: string;
  minutes: string;
  prompt: string;
};

export const SIMULATIONS: Simulation[] = [
  {
    slug: "llm-gateway",
    title: "LLM gateway for 50 internal teams",
    level: "Senior",
    minutes: "25 min",
    counts: false,
    badge: "Question of the Week",
    prompt:
      "Design a gateway that routes LLM traffic for 50 internal teams, with a monthly cost cap per team and a fallback provider.",
    steps: [
      {
        id: "requirements",
        phase: "Requirements",
        prompt:
          "What do you clarify before designing? Cover traffic, latency, tenancy, and cost.",
      },
      {
        id: "estimation",
        phase: "Estimation",
        prompt:
          "Estimate peak tokens per second and a rough monthly spend for one heavy team.",
      },
      {
        id: "architecture",
        phase: "High-level design",
        prompt:
          "Walk the path of one request, from the client to a provider and back.",
      },
      {
        id: "depth",
        phase: "Deep dive",
        prompt:
          "The primary provider times out mid-stream. What happens to the caller, and what do you retry?",
      },
      {
        id: "tradeoffs",
        phase: "Trade-offs",
        prompt:
          "Where do you spend money to buy latency, and where do you refuse to?",
      },
      {
        id: "defend-cache",
        phase: "Defend",
        prompt:
          "Your semantic cache could return a 10-minute-old answer. For which requests is that acceptable?",
      },
      {
        id: "defend-quota",
        phase: "Defend",
        prompt:
          "Two requests from the same team pass the quota check at the same moment. How do you stop them from overspending the cap?",
      },
    ],
    build: {
      title: "Quota check",
      body: "Implement the function that accepts or rejects one request against a team's remaining monthly budget. This is the thin slice of the gateway.",
      checks: [
        "Rejects a request that would exceed the remaining budget.",
        "Allows a request that fits, and returns the budget that would remain.",
        "Treats two overlapping checks against the same budget as one spend.",
      ],
    },
  },
  {
    slug: "support-rag",
    title: "Enterprise RAG for a support desk",
    level: "Senior",
    minutes: "25 min",
    counts: true,
    badge: "Simulation",
    prompt:
      "Design a retrieval-augmented assistant that answers support questions from internal documents, and refuses when it cannot ground an answer.",
    steps: [
      {
        id: "requirements",
        phase: "Requirements",
        prompt:
          "Who asks questions, how fresh must documents be, and what must the assistant never answer?",
      },
      {
        id: "estimation",
        phase: "Estimation",
        prompt:
          "Estimate documents, query rate, and the latency budget for retrieval plus generation.",
      },
      {
        id: "architecture",
        phase: "High-level design",
        prompt:
          "Show ingestion, the index, retrieval, and the path that decides to answer or refuse.",
      },
      {
        id: "depth",
        phase: "Deep dive",
        prompt:
          "A document is updated. How does a query one minute later avoid the old chunk?",
      },
      {
        id: "tradeoffs",
        phase: "Trade-offs",
        prompt:
          "What do you give up by refusing more often, and why is that the right default?",
      },
      {
        id: "defend-acl",
        phase: "Defend",
        prompt:
          "Two teams share the index. How do you stop one team retrieving the other's documents?",
      },
      {
        id: "defend-eval",
        phase: "Defend",
        prompt:
          "How would you notice that answer quality dropped after a model change?",
      },
    ],
    build: {
      title: "Grounded or refuse",
      body: "Implement the decision that returns an answer only when the retrieved chunks clear a relevance bar, and otherwise returns a refusal.",
      checks: [
        "Refuses when no chunk clears the bar.",
        "Returns the answer and the chunk ids it used when one does.",
        "Does not return a chunk the caller is not allowed to see.",
      ],
    },
  },
];

export const DRILLS: Drill[] = [
  {
    slug: "tokens",
    title: "Tokens per second",
    minutes: "5 min",
    prompt:
      "A team sends 40 requests per second. Each request averages 800 input tokens and 300 output tokens. What is the peak token rate, and which number would you provision a provider for?",
  },
  {
    slug: "idempotency",
    title: "Idempotent charge",
    minutes: "5 min",
    prompt:
      "A client retries a 'spend quota' call after a timeout. How do you make sure the team is charged once?",
  },
  {
    slug: "staleness",
    title: "Cache staleness",
    minutes: "5 min",
    prompt:
      "Name one request you would cache for a support bot and one you would never cache. Say what makes them different.",
  },
  {
    slug: "fallback",
    title: "Provider fallback",
    minutes: "5 min",
    prompt:
      "The primary model returns a 429. What do you do for the in-flight request, and what do you change for the next 30 seconds of traffic?",
  },
];

export function simulation(slug: string): Simulation | undefined {
  return SIMULATIONS.find((item) => item.slug === slug);
}

export function drill(slug: string): Drill | undefined {
  return DRILLS.find((item) => item.slug === slug);
}
