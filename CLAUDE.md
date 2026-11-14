# CLAUDE.md

Guidance for AI coding agents working in this repository.

## What this is

An AI interview prep platform built around the **Design → Defend → Build** loop: a voice + whiteboard AI system design interviewer on emerging-tech questions, a rubric score report, and an optional Build Mode where the candidate implements a thin slice of their own design. Target users are Vietnamese engineers aiming for Big Tech roles. Read `docs/strategy.md` before making product decisions.

## Current state

Pre-MVP (Phase 0, validation). The repo holds strategy docs, screen mockups (`docs/mockups/`), and CI. There is no application code yet.

## Planned stack

- Next.js (TypeScript) web app with a structured whiteboard (diagram stored as JSON the AI can reason over).
- Voice: realtime speech-to-speech or STT → LLM → TTS, always with a text fallback.
- Interviewer: phase/probe state machine wrapped around an LLM.
- Evaluator: a separate LLM pass in its own context, never the interviewer's context.
- Build Mode: containerized sandbox, templated repos, test runner.
- Payments: Stripe plus a Vietnamese gateway.

## Product rules that affect code

- **No live-interview assistance.** Never add features that help during a real interview (overlays, hidden copilots, screen reading).
- **Scoring must be calibratable.** Persist transcripts, diagram JSON, rubric scores, and mentor labels so AI-vs-mentor agreement can be measured.
- **Track COGS per simulation.** Log token, voice-minute, and sandbox usage per session from day one.
- **Language:** UI explanations may toggle to Vietnamese; practice and scoring stay in English.

## Conventions

- Keep docs in `docs/`; mockups in `docs/mockups/` as Markdown wireframes.
- CI (`.github/workflows/ci.yml`) runs markdown lint and, once `package.json` exists, `npm run lint` and `npm test`. Keep both passing.
- Deploy is a placeholder job on `main`; do not wire real credentials into the workflow.
