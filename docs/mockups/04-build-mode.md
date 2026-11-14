# 04 — Build Mode

Optional 30–60 minute step: implement one thin slice of the candidate's own design with an AI assistant.

```
+-----------------------------------------------------------------------------+
| BUILD: Semantic-cache lookup with TTL (from your design)      41:10 left    |
+-------------------+-------------------------------+-------------------------+
| SPEC + FILES      | EDITOR  cache/lookup.ts       | AI ASSISTANT            |
|                   |                               |                         |
| Spec              | export async function lookup( |  (You) "Write a lookup  |
|  - embed query    |   query: string, ttlMs: number|  that returns null when |
|  - nearest hit    | ) {                           |  similarity < 0.92"     |
|    >= 0.92        |   const v = await embed(query)|                         |
|  - expire by TTL  |   ...                         |  (AI) proposed diff ... |
|                   | }                             |  [Apply] [Reject]       |
| Files             |                               |                         |
|  cache/lookup.ts  +-------------------------------+                         |
|  cache/lookup.test| TESTS  2 passing / 3 failing  |                         |
|                   |  ✗ expires entries after TTL  |                         |
+-------------------+-------------------------------+-------------------------+
| Scored on: prompt quality · verification habits · matches your design       |
|                                          [Run tests]  [Submit build]        |
+-----------------------------------------------------------------------------+
```

- Spec, scaffold, and failing tests are generated from the candidate's diagram and the question's Build-slice spec.
- Runs in a containerized sandbox.
