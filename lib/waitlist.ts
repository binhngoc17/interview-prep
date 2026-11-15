export const TIMELINES = [
  { value: "within-2-weeks", label: "Within 2 weeks" },
  { value: "within-2-months", label: "Within 2 months" },
  { value: "later", label: "Later this year" },
  { value: "exploring", label: "Just exploring" },
] as const;

export type Timeline = (typeof TIMELINES)[number]["value"];

export type WaitlistEntry = {
  email: string;
  timeline: Timeline;
  company?: string;
};

export type WaitlistResult =
  { ok: true; entry: WaitlistEntry } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isTimeline(value: unknown): value is Timeline {
  return TIMELINES.some((timeline) => timeline.value === value);
}

export function parseWaitlistEntry(input: unknown): WaitlistResult {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const email =
    typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!isTimeline(record.timeline)) {
    return { ok: false, error: "Choose when your next interview is." };
  }

  const company =
    typeof record.company === "string" ? record.company.trim() : "";
  if (company.length > 80) {
    return { ok: false, error: "Keep the company name under 80 characters." };
  }

  const entry: WaitlistEntry = { email, timeline: record.timeline };
  if (company) entry.company = company;
  return { ok: true, entry };
}
