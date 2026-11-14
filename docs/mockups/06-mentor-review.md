# 06 — Mentor review

Mentor-side screen for the 20-minute human review upsell. Mentor scores also feed the calibration gold set.

```
+-----------------------------------------------------------------------------+
| Mentor review queue (3)         Mentor: Big Tech Staff Eng   Earned: $240   |
+---------------------+-------------------------------------------------------+
| QUEUE               | Run: LLM gateway for 50 teams · Candidate #1832       |
|                     +---------------------------+---------------------------+
| > LLM gateway  20m  | REPLAY                    | YOUR SCORES (AI in grey)  |
|   RAG search   20m  |  [diagram at 12:40]       |  Requirements  [4] (4.0)  |
|   GPU sched.   20m  |  ▶ ──●──────────── 12:40  |  Estimation    [2] (3.0)  |
|                     |  transcript excerpt ...   |  Architecture  [4] (4.0)  |
|                     |                           |  Depth         [3] (3.0)  |
|                     | Build: 3/5 tests passing  |  Trade-offs    [3] (3.0)  |
|                     |                           |  Communication [4] (4.0)  |
|                     |                           |  AI concerns   [2] (3.0)  |
|                     +---------------------------+---------------------------+
|                     | Feedback to candidate:                                |
|                     | [ Strong routing story. Estimation skipped token ...] |
|                     |                    [Record voice note]  [Submit ->]   |
+---------------------+-------------------------------------------------------+
```

- Mentor scores are stored as gold labels for AI-vs-mentor agreement tracking.
- Earnings reflect the per-review revenue share.
