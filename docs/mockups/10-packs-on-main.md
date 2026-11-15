# 10 — What is live on main

Merge publishes. The candidate app, in a later slice, reads only what is on the default branch.

```
+-----------------------------------------------------------------------------+
| github.com / interview-prep / content/packs                    branch: main |
+-----------------------------------------------------------------------------+
| grab-ai-platform-senior/pack.json          exclusive   merged today         |
| shopee-data-platform-staff/pack.json       exclusive   Nov 12               |
| vng-backend-mid/pack.json                  free        Nov 10               |
+-----------------------------------------------------------------------------+
| A pack here is published.                                                   |
| To change one: edit the file in Cursor, open a PR, merge.                   |
| To unpublish: delete the directory in a PR, merge.                          |
| A pack that exists only on a branch is still a draft.                       |
+-----------------------------------------------------------------------------+
```

- Candidates never see this directory listing. They see a published pack's brief and questions after the subscription slice allows it.
- The repo stays private, because source notes can include alumni debriefs.
