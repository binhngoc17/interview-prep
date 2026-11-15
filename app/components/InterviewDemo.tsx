"use client";

import { useEffect, useState } from "react";

const PHASES = [
  "Requirements",
  "Estimation",
  "High-level",
  "Deep dive",
  "Trade-offs",
];

type Speaker = "ai" | "you";

const SCRIPT: Array<{ speaker: Speaker; text: string; phase: number }> = [
  {
    speaker: "ai",
    text: "Design an LLM gateway for 50 internal teams. What do you clarify first?",
    phase: 0,
  },
  {
    speaker: "you",
    text: "Peak QPS, the latency target, and whether each team has a cost cap.",
    phase: 0,
  },
  {
    speaker: "ai",
    text: "About 2K QPS at peak, p95 under 800 ms, a monthly cap per team. Rough token throughput?",
    phase: 1,
  },
  {
    speaker: "you",
    text: "2K req/s × ~1.5K tokens ≈ 3M tokens/s at peak, so caching and batching matter.",
    phase: 1,
  },
  { speaker: "ai", text: "How do you pick a model per request?", phase: 2 },
  {
    speaker: "you",
    text: "A policy table keyed by team and task, checked after auth and quota.",
    phase: 2,
  },
  {
    speaker: "ai",
    text: "Your semantic cache could serve 10-minute-old answers. Is that acceptable?",
    phase: 3,
  },
];

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  step: number;
  flagged?: boolean;
};

const NODES: Node[] = [
  { id: "client", label: "Client", x: 4, y: 85, w: 60, step: 0 },
  { id: "gateway", label: "Gateway", x: 80, y: 85, w: 72, step: 1 },
  { id: "router", label: "Router", x: 170, y: 85, w: 64, step: 3 },
  { id: "provA", label: "Model A", x: 252, y: 45, w: 70, step: 4 },
  { id: "provB", label: "Model B", x: 252, y: 125, w: 70, step: 4 },
  { id: "quota", label: "Quota", x: 80, y: 158, w: 72, step: 5 },
  { id: "cache", label: "Cache", x: 170, y: 12, w: 64, step: 6, flagged: true },
];

const EDGES: Array<{ d: string; step: number }> = [
  { d: "M64 101 H80", step: 1 },
  { d: "M152 101 H170", step: 3 },
  { d: "M234 94 L252 62", step: 4 },
  { d: "M234 108 L252 140", step: 4 },
  { d: "M116 117 V158", step: 5 },
  { d: "M202 85 V44", step: 6 },
];

const STEP_MS = 2400;
const HOLD_MS = 4200;

export function InterviewDemo() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(SCRIPT.length - 1);
      setPaused(true);
    }
  }, []);

  useEffect(() => {
    if (paused) return;
    const atEnd = step >= SCRIPT.length - 1;
    const timer = window.setTimeout(
      () => setStep(atEnd ? 0 : step + 1),
      atEnd ? HOLD_MS : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [step, paused]);

  const phase = SCRIPT[step].phase;
  const visible = SCRIPT.slice(0, step + 1).slice(-4);
  const speaking = SCRIPT[step].speaker;

  return (
    <figure className="demo" aria-label="Sample design session, illustrative">
      <div className="demo-bar">
        <span className="demo-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="demo-title">
          Design session · LLM gateway · Senior
        </span>
        <span className="demo-timer">18:42 left</span>
      </div>

      <ol className="demo-phases" aria-label="Interview phases">
        {PHASES.map((name, index) => (
          <li
            key={name}
            className={
              index < phase ? "done" : index === phase ? "active" : undefined
            }
            aria-current={index === phase ? "step" : undefined}
          >
            {name}
          </li>
        ))}
      </ol>

      <div className="demo-body">
        <div className="demo-board">
          <span className="demo-label">Whiteboard</span>
          <svg
            viewBox="0 0 326 196"
            role="img"
            aria-label="Architecture diagram the candidate is drawing"
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
              </marker>
            </defs>
            {EDGES.map((edge) => (
              <path
                key={edge.d}
                d={edge.d}
                className={`edge ${step >= edge.step ? "on" : ""}`}
                markerEnd="url(#arrow)"
              />
            ))}
            {NODES.map((node) => (
              <g
                key={node.id}
                className={`node ${step >= node.step ? "on" : ""} ${node.flagged ? "flagged" : ""}`}
              >
                <rect x={node.x} y={node.y} width={node.w} height={32} rx={8} />
                <text
                  x={node.x + node.w / 2}
                  y={node.y + 20.5}
                  textAnchor="middle"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
          {step >= 6 && (
            <span className="demo-flag">Weak spot: cache staleness</span>
          )}
        </div>

        <div className="demo-chat">
          <span className="demo-label">Interviewer</span>
          <ul className="demo-messages">
            {visible.map((message) => (
              <li key={message.text} className={`msg ${message.speaker}`}>
                <span className="msg-who">
                  {message.speaker === "ai" ? "AI" : "You"}
                </span>
                <p>{message.text}</p>
              </li>
            ))}
          </ul>
          <div className="demo-voice">
            <span
              className={`wave ${paused ? "still" : ""}`}
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>
              {speaking === "ai" ? "Interviewer speaking" : "Listening"} · text
              mode available
            </span>
            <button
              type="button"
              className="demo-pause"
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? "Play" : "Pause"}
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
}
