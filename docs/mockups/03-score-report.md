# 03 — Rubric score report

Produced by a separate evaluator pass, calibrated against mentor-scored sessions.

```
+-----------------------------------------------------------------------------+
| LLM gateway for 50 teams — Report                 Overall: 3.4 / 5          |
| Estimated level: Senior (borderline)    Calibration: AI-mentor agreement 0.78|
+-----------------------------------------------------------------------------+
| Requirements       ████████░░  4.0   Clarified QPS, latency, cost caps      |
| Estimation         ██████░░░░  3.0   Token throughput not estimated          |
| Architecture       ████████░░  4.0   Clear routing + quota path              |
| Depth              ██████░░░░  3.0   Cache invalidation shallow              |
| Trade-offs         ██████░░░░  3.0   No failover cost discussion             |
| Communication      ████████░░  4.0   Structured, narrated decisions          |
| AI concerns        ██████░░░░  3.0   Eval + safety filters missing           |
+-----------------------------------------------------------------------------+
| Top 3 fixes                                                                 |
|  1. Estimate tokens/sec and cost per team before choosing providers.        |
|  2. Define cache TTL + invalidation on model/prompt version change.         |
|  3. Add an eval/safety stage between router and response.                   |
+-----------------------------------------------------------------------------+
| [Replay transcript]  [Try Build Mode ->]  [Request mentor review ($)]       |
+-----------------------------------------------------------------------------+
```
