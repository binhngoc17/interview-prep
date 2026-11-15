import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSession } from "@/lib/current-user";
import { site } from "@/lib/site";

const LINKS = [
  ["Home", "/app"],
  ["Practice", "/app/practice"],
  ["Drills", "/app/drills"],
  ["Packs", "/app/packs"],
  ["Request prep", "/app/request"],
  ["Progress", "/app/progress"],
];

export default async function CandidateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="app-shell">
      <aside className="app-nav">
        <a className="logo" href="/">
          <span className="logo-mark" aria-hidden="true" />
          {site.name}
        </a>
        <nav aria-label="Practice">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <p className="app-email">{session.email}</p>
        <form action="/api/auth/logout" method="post">
          <button className="auth-back" type="submit">
            Log out
          </button>
        </form>
      </aside>
      <div className="app-main">{children}</div>
    </div>
  );
}
