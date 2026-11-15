import { redirect } from "next/navigation";
import { site } from "@/lib/site";
import { getSession } from "@/lib/current-user";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (await getSession()) redirect("/app");

  return (
    <main className="auth-page">
      <a className="logo" href="/">
        <span className="logo-mark" aria-hidden="true" />
        {site.name}
      </a>
      <LoginForm />
    </main>
  );
}
