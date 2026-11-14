# 02 — Defend (challenge round)

A 10-minute round where the interviewer probes weak spots it found in the diagram.

```
+-----------------------------------------------------------------------------+
| DEFEND                                                       09:30 left     |
+---------------------------------------------------+-------------------------+
| WHITEBOARD (read-only, weak spots highlighted)    | CHALLENGES              |
|                                                   |                         |
|  [Gateway API] --> [Router] --> [Provider A]      |  1. ! Semantic cache    |
|                       |                           |     staleness           |
|                 (!)[Semantic cache]               |     "What if cached     |
|                                                   |     answers are 10 min  |
|  (!)[Usage store]  single writer?                 |     stale?"  [Answering]|
|                                                   |  2. ! Usage store       |
|                                                   |     write bottleneck    |
|                                                   |  3.   Provider outage   |
|                                                   |     failover            |
+---------------------------------------------------+-------------------------+
| [● Mic on]  [Text mode]                       [Skip]  [Finish -> Score]     |
+-----------------------------------------------------------------------------+
```

- Challenges come from the diagram JSON plus the question's "interviewer probes" list.
- Each challenge links to the highlighted component.
