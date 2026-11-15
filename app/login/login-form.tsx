"use client";

import { useState, type FormEvent } from "react";

type Step =
  { kind: "email" } | { kind: "code"; email: string; devCode?: string };

export function LoginForm() {
  const [step, setStep] = useState<Step>({ kind: "email" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        error?: string;
        devCode?: string;
      };
      if (!result.ok) {
        setError(result.error ?? "We couldn't send the code.");
        return;
      }
      setStep({ kind: "code", email: email.trim(), devCode: result.devCode });
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step.kind !== "code") return;
    const code = String(new FormData(event.currentTarget).get("code") ?? "");
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: step.email, code }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      if (!result.ok) {
        setError(result.error ?? "That code is not valid.");
        return;
      }
      window.location.assign("/app");
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (step.kind === "code") {
    return (
      <form className="auth-card" onSubmit={verify}>
        <h1>Check your email</h1>
        <p>We sent a 6-digit code to {step.email}. It expires in 10 minutes.</p>
        {step.devCode && (
          <p className="auth-dev">
            Email delivery is not configured on this server. Your code is{" "}
            <strong>{step.devCode}</strong>.
          </p>
        )}
        <label>
          <span>Code</span>
          <input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            required
            placeholder="123456"
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Checking…" : "Continue"}
        </button>
        {error && (
          <p className="waitlist-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="auth-back"
          type="button"
          onClick={() => {
            setStep({ kind: "email" });
            setError("");
          }}
        >
          Use a different email
        </button>
      </form>
    );
  }

  return (
    <form className="auth-card" onSubmit={sendCode}>
      <h1>Log in</h1>
      <p>Enter your email and we&apos;ll send you a code. No password.</p>
      <label>
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </label>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send code"}
      </button>
      {error && (
        <p className="waitlist-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
