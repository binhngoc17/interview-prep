# Supabase user data

Date: 2026-11-15. Status: ready for review.

Move user data off local files and into Supabase so the app can run on Vercel. Login stays the email code and signed cookie that already ship. This slice does not add Vietnamese copy, the Vercel email project, or CV upload.

## Decisions

- Supabase is the database. It does not own login. Supabase Auth is out of this slice.
- The browser never talks to Supabase. The Next.js server uses the secret key (`SUPABASE_SECRET_KEY`).
- One store interface. Both `SUPABASE_URL` and `SUPABASE_SECRET_KEY` select Supabase. Neither set, outside production, keeps the current files. Any other combination throws, including production with both missing and development with only one set.
- A user row is created when a code is accepted. Asking for a code does not create a user.
- Existing files under `data/` are not imported.
- Practice prompts, packs, and scores stay in the repo and stay in English.

## Scope

This slice ships:

- `supabase/schema.sql`, applied once in the Supabase SQL editor.
- A server-only store with file and Supabase adapters.
- Route handlers and server pages that read and write through that store: login codes, practice activity, the waitlist, and prep requests.

Later slices, each with its own spec:

- Login email through the Resend integration on the Vercel project. The mail function already calls Resend when `RESEND_API_KEY` and `EMAIL_FROM` are set.
- Vietnamese and English for the interface. Practice prompts and scores stay English.
- CV upload and review, including a storage bucket and a new table. Those are not in this schema.

This slice does not add payments, voice, the whiteboard, calibrated scoring, or Build Mode.

## What stays

The code issuer, the HMAC hash, the 10-minute expiry, the five-attempt lock, and the 14-day `session` cookie stay in `lib/auth.ts` and `lib/current-user.ts`. `AUTH_SECRET` stays an environment variable. `lib/mail.ts` is unchanged. Entitlement math in `lib/entitlements.ts` stays a pure function over activity rows.

## Store

Server modules call `getUserStore()`. It reads the environment on each call and does not cache the choice.

```ts
type UserStore = {
  saveLoginCode(record: LoginCode, sentAt: number): Promise<void>;
  takeLoginCode(
    email: string,
  ): Promise<(LoginCode & { sentAt: number }) | null>;
  updateLoginCode(record: LoginCode & { sentAt: number }): Promise<void>;
  readActivity(email: string): Promise<StoredActivity[]>;
  writeActivity(item: StoredActivity): Promise<void>;
  addWaitlist(entry: WaitlistEntry & { joinedAt: string }): Promise<void>;
  addPrepRequest(request: PrepRequest): Promise<void>;
};
```

`lib/supabase-store.ts` starts with `import "server-only"`. The secret key is not imported from a client component. The file adapter is the current JSON and JSONL modules behind the same methods.

Row level security is enabled on every table. There are no policies for the anon or authenticated roles. The secret key bypasses row level security, which is the only access path.

## Tables

```sql
create table users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table login_codes (
  email text primary key,
  hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  used boolean not null default false,
  sent_at timestamptz not null
);

create table activity (
  id uuid primary key default gen_random_uuid(),
  email text not null references users (email),
  kind text not null check (kind in ('simulation', 'drill')),
  slug text not null,
  at timestamptz not null,
  counts boolean not null,
  answers jsonb not null
);

create index activity_email_at on activity (email, at desc);

create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  timeline text not null,
  company text,
  joined_at timestamptz not null
);

create table prep_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null references users (email),
  company text not null,
  role text not null,
  level text not null check (level in ('mid', 'senior', 'staff')),
  interview_date date not null,
  requested_at timestamptz not null
);

alter table users enable row level security;
alter table login_codes enable row level security;
alter table activity enable row level security;
alter table waitlist enable row level security;
alter table prep_requests enable row level security;
```

`gen_random_uuid()` is available on Supabase. No policies are created. `login_codes` does not reference `users`, because a person may never finish signing in. The plaintext code is not stored. `waitlist` allows the same email more than once. `answers` is the string map the practice route already saves.

Timestamps in the app stay ISO strings and epoch milliseconds at the store boundary. The adapter converts them to `timestamptz` and back.

## Data flow

1. **Send code.** Validate the email. Read that email’s code row. If `sent_at` is under 30 seconds ago, return 429. Otherwise write the new hash, then call the mail function. A failed write does not send mail. A failed send leaves the new row in place. The person can ask again after the cooldown, which replaces the row.
2. **Verify.** Read the row, run `verifyLoginCode`, and write the row back. On `valid`, insert the user if absent and set the session cookie.
3. **Practice and drills.** Read that user’s activity, run `canStart`, then insert one row. The free-plan limits stay 1 counted simulation per UTC month and 3 drills per ISO week. Question of the Week still has `counts: false`.
4. **Waitlist.** Insert one row after the current validation. No session.
5. **Prep request.** Require a session, validate company, role, level, and date, then insert one row.

A concurrent double-submit can race a read-then-write the way the file store does today. This slice does not add optimistic locking.

## Errors

| Situation                                                     | Response                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Store is not configured, or only one Supabase variable is set | 503. Body: `{ "ok": false, "error": "This action is temporarily unavailable." }` The server log names the missing variable and does not include the key or the login code.                                                                                  |
| Supabase or the file write fails                              | 500. Send: "The code could not be sent. Try again." Verify: "That code could not be checked. Try again." Practice: "That session could not be saved." Waitlist: "The signup could not be saved. Try again." Prep request: "The request could not be saved." |
| Bad email, code, or form field                                | The 400 and 401 messages that already exist.                                                                                                                                                                                                                |
| Code invalid, expired, used, or locked                        | Unchanged.                                                                                                                                                                                                                                                  |

## Tests

`npm test` does not call Supabase.

- The selector decides Supabase when both variables are set, files when neither is set, and throws when exactly one is set or when production has neither. That test does not open a network connection.
- A fake Supabase client records the table and payload. Saving a login code stores the hash and not the plaintext. An activity row round-trips `answers`, `counts`, and the timestamp.
- Existing auth, entitlement, and waitlist parser tests stay as they are.

With the keys unset, the browser login, a drill, a prep request, and the waitlist still use files. With both keys set, the same screens write to Supabase. That cloud check waits until the project keys exist.

## Environment

```text
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

Both are server-only. Do not prefix them with `NEXT_PUBLIC_`. `.env.example` lists them and states that production requires both.
