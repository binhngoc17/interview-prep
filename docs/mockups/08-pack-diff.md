# 08 — The pack file in the diff

The admin reviews the file Cursor wrote before anything is committed. This is the editor.

```
+-----------------------------------------------------------------------------+
| Diff · content/packs/grab-ai-platform-senior/pack.json           + new file |
+-----------------------------------------------------------------------------+
| company:   Grab                                                             |
| role:      Backend engineer, AI platform                                    |
| level:     senior                                                           |
| exclusive: true                                                             |
| brief:     45-minute system design round (source 1). Interviewers push on   |
|            cost per request and provider fallback. Practice expectation:    |
|            estimate tokens/sec and discuss eval after a fallback.           |
| sources:   1 note, 1 url with excerpt                                       |
| questions: 2                                                                |
|   1. LLM gateway for customer-support bots                                  |
|      probes: 4 · rubric: 7 dimensions · reference architecture: present     |
|   2. Eval pipeline for support-bot answers                                  |
|      probes: 4 · rubric: 7 dimensions · reference architecture: present     |
+-----------------------------------------------------------------------------+
| [ Edit in file ]                                            [ Commit ]      |
+-----------------------------------------------------------------------------+
```

- The admin edits the JSON directly: brief, probes, rubric text, reference architecture.
- `exclusive: true` means the later paywall will treat the pack as Pro content. Set it to false for a pack that should be free, such as a question of the week.
- Sources stay in the file so the reviewer can see what grounded the draft. The future candidate app strips them.
