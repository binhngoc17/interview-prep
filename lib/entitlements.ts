export type Activity = {
  email: string;
  kind: "simulation" | "drill";
  slug: string;
  at: string;
  counts: boolean;
};

const LIMITS = { simulation: 1, drill: 3 } as const;

export function canStart(
  items: Activity[],
  kind: Activity["kind"],
  now: number,
): { allowed: boolean; used: number; limit: number } {
  const limit = LIMITS[kind];
  const used = items.filter(
    (item) =>
      item.counts && item.kind === kind && sameWindow(item.at, now, kind),
  ).length;
  return { allowed: used < limit, used, limit };
}

function sameWindow(at: string, now: number, kind: Activity["kind"]): boolean {
  const then = Date.parse(at);
  if (Number.isNaN(then)) return false;
  if (kind === "simulation") return monthKey(then) === monthKey(now);
  return weekKey(then) === weekKey(now);
}

function monthKey(ms: number): string {
  const date = new Date(ms);
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
}

function weekKey(ms: number): string {
  const date = new Date(ms);
  const utc = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${utc.getUTCFullYear()}-W${week}`;
}
