import assert from "node:assert/strict";
import test from "node:test";
import {
  hashLoginCode,
  issueLoginCode,
  normalizeEmail,
  readSession,
  signSession,
  verifyLoginCode,
  type LoginCode,
} from "../lib/auth.ts";

const SECRET = "test-secret-at-least-16";

test("normalizes a usable email and rejects the rest", () => {
  assert.equal(normalizeEmail("  Ngoc@Example.COM "), "ngoc@example.com");
  assert.equal(normalizeEmail("not-an-email"), null);
  assert.equal(normalizeEmail("a@b"), null);
});

test("a code signs in once, then cannot be reused", () => {
  const now = 1_700_000_000_000;
  const issued = issueLoginCode(
    "ngoc@example.com",
    SECRET,
    now,
    () => "123456",
  );
  assert.equal(issued.code, "123456");

  const ok = verifyLoginCode(issued.record, "123456", SECRET, now + 1000);
  assert.equal(ok.status, "valid");

  const again = verifyLoginCode(issued.record, "123456", SECRET, now + 1000);
  assert.equal(again.status, "used");
});

test("five wrong codes burn the code", () => {
  const now = 1_700_000_000_000;
  const issued = issueLoginCode(
    "ngoc@example.com",
    SECRET,
    now,
    () => "123456",
  );
  let record: LoginCode = issued.record;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const result = verifyLoginCode(record, "000000", SECRET, now);
    assert.equal(result.status, "invalid");
    record = result.record;
  }
  assert.equal(verifyLoginCode(record, "123456", SECRET, now).status, "locked");
});

test("an expired code is rejected", () => {
  const now = 1_700_000_000_000;
  const issued = issueLoginCode(
    "ngoc@example.com",
    SECRET,
    now,
    () => "123456",
  );
  assert.equal(
    verifyLoginCode(issued.record, "123456", SECRET, now + 10 * 60 * 1000 + 1)
      .status,
    "expired",
  );
});

test("the session cookie round-trips and expires", () => {
  const now = 1_700_000_000_000;
  const token = signSession("ngoc@example.com", SECRET, now);
  assert.equal(readSession(token, SECRET, now + 1000), "ngoc@example.com");
  assert.equal(
    readSession(token, SECRET, now + 14 * 24 * 60 * 60 * 1000 + 1),
    null,
  );
  assert.equal(readSession(`${token}x`, SECRET, now), null);
  assert.equal(
    hashLoginCode("ngoc@example.com", "123456", SECRET).length > 10,
    true,
  );
});
