import assert from "node:assert/strict";
import test from "node:test";
import { parseWaitlistEntry } from "../lib/waitlist.ts";

test("accepts an email and timeline, normalizing the email", () => {
  assert.deepEqual(
    parseWaitlistEntry({
      email: "  Ngoc@Example.COM ",
      timeline: "within-2-months",
    }),
    {
      ok: true,
      entry: { email: "ngoc@example.com", timeline: "within-2-months" },
    },
  );
});

test("keeps an optional target company, trimmed", () => {
  assert.deepEqual(
    parseWaitlistEntry({
      email: "a@b.co",
      timeline: "within-2-weeks",
      company: "  Grab ",
    }),
    {
      ok: true,
      entry: { email: "a@b.co", timeline: "within-2-weeks", company: "Grab" },
    },
  );
});

test("drops an empty company", () => {
  assert.deepEqual(
    parseWaitlistEntry({
      email: "a@b.co",
      timeline: "exploring",
      company: "   ",
    }),
    { ok: true, entry: { email: "a@b.co", timeline: "exploring" } },
  );
});

test("rejects bad input with a message the form can show", () => {
  assert.deepEqual(parseWaitlistEntry(null), {
    ok: false,
    error: "Enter a valid email address.",
  });
  assert.deepEqual(
    parseWaitlistEntry({ email: "not-an-email", timeline: "later" }),
    {
      ok: false,
      error: "Enter a valid email address.",
    },
  );
  assert.deepEqual(
    parseWaitlistEntry({ email: "a@b.co", timeline: "tomorrow" }),
    {
      ok: false,
      error: "Choose when your next interview is.",
    },
  );
  assert.deepEqual(
    parseWaitlistEntry({
      email: "a@b.co",
      timeline: "later",
      company: "x".repeat(81),
    }),
    {
      ok: false,
      error: "Keep the company name under 80 characters.",
    },
  );
});
