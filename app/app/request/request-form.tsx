"use client";

import { useState, type FormEvent } from "react";

export function RequestForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: data.get("company"),
          role: data.get("role"),
          level: data.get("level"),
          date: data.get("date"),
        }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      if (!result.ok) {
        setError(result.error ?? "The request could not be saved.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="app-done" role="status">
        <h2>Request received.</h2>
        <p>
          A person reviews it and publishes a pack before your date. You&apos;ll
          find it under Company packs.
        </p>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit}>
      <label>
        <span>Company</span>
        <input name="company" required maxLength={80} />
      </label>
      <label>
        <span>Role</span>
        <input name="role" required maxLength={120} />
      </label>
      <label>
        <span>Level</span>
        <select name="level" defaultValue="senior">
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="staff">Staff</option>
        </select>
      </label>
      <label>
        <span>Interview date</span>
        <input name="date" type="date" required />
      </label>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Request prep"}
      </button>
      {error && (
        <p className="waitlist-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
