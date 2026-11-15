import assert from "node:assert/strict";
import test from "node:test";
import { canStart, type Activity } from "../lib/entitlements.ts";
import { packForCandidate, type CandidatePack } from "../lib/candidate-pack.ts";

const now = Date.parse("2026-11-15T09:00:00.000Z");

function activity(kind: Activity["kind"], at: string, counts = true): Activity {
  return { email: "a@b.co", kind, slug: "x", at, counts };
}

test("free plan allows one simulation a month and three drills a week", () => {
  assert.equal(canStart([], "simulation", now).allowed, true);

  const usedSim = canStart(
    [activity("simulation", "2026-11-02T00:00:00.000Z")],
    "simulation",
    now,
  );
  assert.equal(usedSim.allowed, false);
  assert.equal(usedSim.limit, 1);

  const lastMonth = canStart(
    [activity("simulation", "2026-10-31T00:00:00.000Z")],
    "simulation",
    now,
  );
  assert.equal(lastMonth.allowed, true);

  const drills = [
    activity("drill", "2026-11-10T00:00:00.000Z"),
    activity("drill", "2026-11-12T00:00:00.000Z"),
    activity("drill", "2026-11-14T00:00:00.000Z"),
  ];
  assert.equal(canStart(drills, "drill", now).allowed, false);
  assert.equal(canStart(drills.slice(0, 2), "drill", now).allowed, true);
});

test("a practice item that does not count stays available", () => {
  const items = [activity("simulation", "2026-11-02T00:00:00.000Z", false)];
  assert.equal(canStart(items, "simulation", now).allowed, true);
});

test("exclusive packs hide their questions from the free plan", () => {
  const pack: CandidatePack = {
    id: "grab-senior",
    company: "Grab",
    role: "Backend",
    level: "senior",
    exclusive: true,
    brief: "A private brief.",
    questions: [{ title: "Gateway", prompt: "Design it." }],
  };

  const locked = packForCandidate(pack, "free");
  assert.equal(locked.locked, true);
  assert.equal("brief" in locked, false);
  assert.equal("questions" in locked, false);

  const open = packForCandidate(pack, "pro");
  assert.equal(open.locked, false);
  if (!open.locked) assert.equal(open.questions[0].title, "Gateway");

  const freePack = packForCandidate({ ...pack, exclusive: false }, "free");
  assert.equal(freePack.locked, false);
});
