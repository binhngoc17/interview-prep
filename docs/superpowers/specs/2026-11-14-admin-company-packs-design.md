# Admin company packs

Date: 2026-11-14. Revised: 2026-11-15. Status: ready for review.

An admin creates a practice pack in an AI app such as Cursor, reviews the file, and publishes it by merging to GitHub. This repo is the content store. There is no admin web app, no database, and no model API in this slice.

Candidate practice, on-demand requests, and the subscription paywall are later slices. They read packs that are on the default branch.

## Decisions

- A pack is one JSON file: a short interview brief plus 1–3 full questions. Each question has a title, a prompt, probes, a seven-dimension rubric, and a reference architecture.
- The admin brings a company, a role, a level, and at least one source. Cursor writes the file. The admin edits the diff before committing.
- A pull request is the draft. Merging to the default branch publishes the pack. Deleting the file in a merged change unpublishes it.
- Pack text is English. Practice content is original. The brief states company facts only when a source supports them, and it labels anything else as a practice expectation.
- `exclusive` defaults to true. The later subscription slice reads that field. This slice does not build a paywall.

## Scope

This slice ships:

- The pack schema and a validator that CI runs on every pull request and on the default branch.
- A Cursor rule that tells the agent how to write a valid pack from the admin's company, role, level, and sources.
- One fixture pack under `tests/fixtures/`, used by the validator tests. Real packs land in `content/packs/` when an admin writes them.

Later slices, each with its own spec:

- Candidate practice against packs on the default branch.
- On-demand prep: a candidate request becomes a Cursor session that writes a pack and opens a pull request.
- Subscription gating that reads `exclusive`. Payments stay in Phase 2 of `docs/strategy.md`.

This slice does not add a candidate screen, voice, Build Mode, a Vietnamese UI, sign-in, or a generation API. Authoring cost sits in the AI app the admin already uses. Per-simulation cost logging starts with the practice slice.

## Where a pack lives

```text
content/packs/<pack-id>/pack.json
```

`<pack-id>` is kebab-case, 1–80 characters, unique. Example: `content/packs/grab-ai-platform-senior/pack.json`.

A file on the default branch is published. A file that exists only on a pull request is a draft. The future candidate loader reads `content/packs/*/pack.json` from the default branch and drops `sources` before sending a pack to a candidate.

The repo stays private. Sources can include alumni debriefs, and a public repo would publish those notes to everyone.

## Pack file

```json
{
  "company": "Grab",
  "role": "Backend engineer, AI platform",
  "level": "senior",
  "exclusive": true,
  "brief": "Expect one 45-minute system design round (source 1). Practice expectation: estimate tokens per second.",
  "sources": [
    {
      "kind": "note",
      "body": "Alumni debrief, Oct 2026: 45-minute system design round."
    },
    {
      "kind": "url",
      "body": "https://engineering.grab.com/example",
      "excerpt": "Short quoted passage the admin reviewed."
    }
  ],
  "questions": [
    {
      "title": "LLM gateway for customer-support bots",
      "prompt": "Design a gateway that routes support-bot traffic across two providers.",
      "probes": [
        "What happens when the primary provider times out?",
        "How do you cap monthly cost per team?",
        "How do you tell that answer quality dropped after fallback?"
      ],
      "rubric": [
        {
          "dimension": "requirements",
          "whatGoodLooksLike": "Clarifies QPS, latency, and cost caps."
        },
        {
          "dimension": "estimation",
          "whatGoodLooksLike": "Estimates tokens per second and monthly spend."
        },
        {
          "dimension": "architecture",
          "whatGoodLooksLike": "Router, quota service, provider adapters."
        },
        {
          "dimension": "depth",
          "whatGoodLooksLike": "Explains streaming failover."
        },
        {
          "dimension": "tradeoffs",
          "whatGoodLooksLike": "Compares cost, latency, and quality."
        },
        {
          "dimension": "communication",
          "whatGoodLooksLike": "States assumptions out loud."
        },
        {
          "dimension": "ai_concerns",
          "whatGoodLooksLike": "Covers cost, latency, eval, and safety."
        }
      ],
      "referenceArchitecture": "Client -> gateway -> quota check -> router -> provider A or B."
    }
  ]
}
```

| Field                         | Rule                                                                                                                                                                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| company, role                 | Trimmed, 1–120 characters                                                                                                                                                                                            |
| level                         | `mid`, `senior`, or `staff`                                                                                                                                                                                          |
| exclusive                     | Boolean. Omit it and the validator treats it as true                                                                                                                                                                 |
| brief                         | Trimmed, 1–4000 characters                                                                                                                                                                                           |
| sources                       | 1–5 items. A note `body` is 20–20000 characters. A URL `body` is `http` or `https`, at most 2000 characters, and includes an `excerpt` of 20–8000 characters that the admin reviewed. This slice does not fetch URLs |
| questions                     | 1–3 items                                                                                                                                                                                                            |
| title                         | 1–200 characters                                                                                                                                                                                                     |
| prompt, referenceArchitecture | 1–8000 characters                                                                                                                                                                                                    |
| probes                        | 3–8 non-empty strings, each at most 500 characters                                                                                                                                                                   |
| rubric                        | Exactly these keys, in order: `requirements`, `estimation`, `architecture`, `depth`, `tradeoffs`, `communication`, `ai_concerns`. Each `whatGoodLooksLike` is 1–2000 characters                                      |

`ai_concerns` covers cost, latency, eval, and safety. The dimension list matches the score report in `docs/mockups/03-score-report.md`.

## Authoring flow

Wireframes: `docs/mockups/07` through `10`.

1. The admin opens this repo in Cursor and asks for a pack, naming the company, role, level, question count, and pasting or pointing at sources.
2. The Cursor rule makes the agent write `content/packs/<pack-id>/pack.json`, ground the brief in those sources, and run the validator.
3. The admin reads the diff, edits the brief and questions in the file, and commits on a branch.
4. The admin opens a pull request. CI runs the validator. A failing pack cannot merge.
5. A reviewer reads the brief against the sources and merges. The merge publishes the pack.
6. A change to a published pack is a new pull request. Removing the directory unpublishes it. There is no in-file draft status.

The rule tells the agent:

- Write original practice prompts. Do not present a prompt as a leaked or official interview question.
- Tie company-specific sentences to a source. Label other sentences as practice expectations.
- Refuse to write the file when the admin gave no source.
- Run the validator and fix the file until it passes.

## Validator

A Node script, `npm test`, checks every `content/packs/*/pack.json` and the fixture. `package.json` defines `test` as that script. `npm run lint` runs the TypeScript check once the script is TypeScript; until then `lint` runs the same validator plus `tsc --noEmit` if a tsconfig exists. CI already runs both when `package.json` is present. No API key is added to the workflow.

The script exits 1 and names the file and the first broken rule. It exits 0 when every pack matches the table above. It rejects a pack id that is not kebab-case, a duplicate id, and a second `pack.json` inside a pack directory.

## Product constraints

- Content is for practice before an interview. Nothing in this slice reads a live interview screen.
- Rubric dimensions stay fixed so a later evaluator and a mentor can score the same axes.
- Candidates receive the brief and questions only. Sources stay in the file for the reviewer and are omitted from the candidate read.
