# 07 — Ask Cursor for a pack

The admin tool is Cursor, pointed at this repo. There is no separate login screen.

```
+-----------------------------------------------------------------------------+
| Cursor · interview-prep                                          main       |
+-----------------------------------------------------------------------------+
| You                                                                         |
| Create an exclusive Senior pack for Grab, role "Backend engineer, AI        |
| platform", 2 questions.                                                     |
| Source 1 (note): Alumni debrief, Oct 2026. 45-min system design. They push  |
| on cost per request and on fallback when the LLM provider is down.          |
| Source 2 (url): https://engineering.grab.com/support-bot-platform           |
+-----------------------------------------------------------------------------+
| Agent                                                                       |
| Wrote content/packs/grab-ai-platform-senior/pack.json                       |
| Brief cites source 1 for the 45-minute round and marks token estimates as   |
| a practice expectation. Validator passed.                                   |
| Commit on a branch and open a PR. Merge publishes the pack.                 |
+-----------------------------------------------------------------------------+
| [ Review diff ]                                     [ Commit and open PR ]  |
+-----------------------------------------------------------------------------+
```

- The agent refuses when the message has no source. A company name alone is not enough.
- The agent writes original practice prompts. It does not call a question a leaked or official Grab question.
- Company names and the URL are illustrative.
