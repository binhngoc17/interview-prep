"use client";

import { useState, type FormEvent } from "react";

type Step = { id: string; phase: string; prompt: string };

export function AnswerForm({
  kind,
  slug,
  steps,
  build,
}: {
  kind: "simulation" | "drill";
  slug: string;
  steps: Step[];
  build?: { title: string; body: string; checks: string[] };
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const step = steps[index];

  async function finish(nextAnswers: Record<string, string>) {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, slug, answers: nextAnswers }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      if (!result.ok) {
        setError(result.error ?? "That session could not be saved.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(
      new FormData(event.currentTarget).get("answer") ?? "",
    ).trim();
    if (!value) return;
    const next = { ...answers, [step.id]: value };
    setAnswers(next);
    if (index + 1 < steps.length) {
      setIndex(index + 1);
      event.currentTarget.reset();
      return;
    }
    void finish(next);
  }

  if (done) {
    return (
      <div className="app-done" role="status">
        <h2>Saved.</h2>
        <p>
          Your answers are stored. A calibrated score needs the separate
          evaluator, which is not connected yet.
        </p>
        {build && (
          <section className="app-build">
            <p className="kicker">Build slice</p>
            <h3>{build.title}</h3>
            <p>{build.body}</p>
            <ul>
              {build.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
            <p className="app-meta">
              The code sandbox is not running yet. The checks are what it will
              grade.
            </p>
          </section>
        )}
        <a className="btn btn-primary" href="/app/progress">
          See progress
        </a>
      </div>
    );
  }

  return (
    <form className="app-session" onSubmit={onSubmit}>
      <p className="app-meta">
        {step.phase} · {index + 1} of {steps.length}
      </p>
      <h2>{step.prompt}</h2>
      <textarea
        name="answer"
        rows={8}
        required
        placeholder="Say it the way you would in the interview."
      />
      {error && (
        <p className="waitlist-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Saving…" : index + 1 === steps.length ? "Finish" : "Next"}
      </button>
    </form>
  );
}
