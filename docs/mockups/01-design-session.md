# 01 — Design session (whiteboard + voice interviewer)

Candidate works an emerging-tech prompt with the AI interviewer for 20–25 minutes.

```
+-----------------------------------------------------------------------------+
| Design an LLM gateway for 50 internal teams         Senior  |  18:42 left   |
| Phases: [Reqs ✓] [Estimate ✓] [High-level ●] [Deep dive] [Trade-offs] [Wrap] |
+---------------------------------------------------+-------------------------+
| WHITEBOARD                                        | INTERVIEWER             |
|                                                   |                         |
|  [Client SDK] --> [Gateway API] --> [Router]      |  (AI) "How do you pick  |
|                        |              |   \       |  a model per request?"  |
|                   [Auth/Quota]   [Provider A]     |                         |
|                        |         [Provider B]     |  (You) "Policy table    |
|                   [Usage store]  [Semantic cache] |  keyed by team + task"  |
|                                                   |                         |
|  Toolbar: [Box] [Arrow] [DB] [Queue] [Cache] [Txt]|  [● Mic on]  [Text mode]|
+---------------------------------------------------+-------------------------+
| Notes: QPS ~2K peak, p95 < 800 ms, cost cap per team      [End phase ->]    |
+-----------------------------------------------------------------------------+
```

- Components are typed (Box, DB, Queue, Cache) so the diagram saves as structured JSON.
- Text mode is always available as a fallback for voice.
- The phase bar is driven by the interviewer state machine.
