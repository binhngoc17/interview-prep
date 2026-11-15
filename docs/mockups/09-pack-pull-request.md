# 09 — Pull request is the draft

Opening the pull request is the publish request. The pack is not live until merge.

```
+-----------------------------------------------------------------------------+
| PR #12 · Add Grab senior AI-platform pack                    Open           |
| branch: pack/grab-ai-platform-senior  ->  main                              |
+-----------------------------------------------------------------------------+
| Checks                                                                      |
|  pass  Validate interview packs                                             |
|        content/packs/grab-ai-platform-senior/pack.json                      |
+-----------------------------------------------------------------------------+
| Files                                                                       |
|  content/packs/grab-ai-platform-senior/pack.json                    +218    |
+-----------------------------------------------------------------------------+
| Review                                                                      |
|  Brief matches the alumni note. Token estimates are labeled as a practice   |
|  expectation. Prompts read as original practice, not a leaked question.     |
|                                                                             |
|  [ Comment ]                              [ Request changes ]  [ Merge ]    |
+-----------------------------------------------------------------------------+
```

When the file breaks the schema, merge stays blocked:

```
+-----------------------------------------------------------------------------+
|  fail  Validate interview packs                                             |
|  content/packs/grab-ai-platform-senior/pack.json                            |
|  Question 2 has 2 probes; at least 3 are required.                          |
+-----------------------------------------------------------------------------+
```

- CI runs the same check on every pull request and on the default branch. No API key is involved.
- The reviewer is a person. Cursor does not merge.
