-- User data for interview-prep. Applied once in the Supabase SQL editor
-- or through the management API. The Next.js server uses the secret key.
-- No policies: the anon and authenticated roles cannot read these tables.

create table if not exists users (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists login_codes (
  email text primary key,
  hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  used boolean not null default false,
  sent_at timestamptz not null
);

create table if not exists activity (
  id uuid primary key default gen_random_uuid(),
  email text not null references users (email),
  kind text not null check (kind in ('simulation', 'drill')),
  slug text not null,
  at timestamptz not null,
  counts boolean not null,
  answers jsonb not null
);

create index if not exists activity_email_at on activity (email, at desc);

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  timeline text not null,
  company text,
  joined_at timestamptz not null
);

create table if not exists prep_requests (
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
