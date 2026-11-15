"use client";

import { useState, type FormEvent } from "react";
import { TIMELINES } from "@/lib/waitlist";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "done" }
  | { kind: "error"; message: string };

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          timeline: data.get("timeline"),
          company: data.get("company"),
        }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      setStatus(
        result.ok
          ? { kind: "done" }
          : { kind: "error", message: result.error ?? "Something went wrong." },
      );
    } catch {
      setStatus({
        kind: "error",
        message: "Could not reach the server. Try again.",
      });
    }
  }

  if (status.kind === "done") {
    return (
      <div className="waitlist-done" role="status">
        <strong>You&apos;re on the list.</strong>
        <p>
          We&apos;ll email you when your beta invite is ready, with founding
          pricing.
        </p>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit} noValidate>
      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </label>
      <label>
        <span>Next interview</span>
        <select name="timeline" defaultValue="" required>
          <option value="" disabled>
            Choose one
          </option>
          {TIMELINES.map((timeline) => (
            <option key={timeline.value} value={timeline.value}>
              {timeline.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>
          Target company <em>optional</em>
        </span>
        <input
          name="company"
          type="text"
          maxLength={80}
          placeholder="Where are you interviewing?"
        />
      </label>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status.kind === "sending"}
      >
        {status.kind === "sending" ? "Joining…" : "Join the waitlist"}
      </button>
      {status.kind === "error" && (
        <p className="waitlist-error" role="alert">
          {status.message}
        </p>
      )}
    </form>
  );
}
