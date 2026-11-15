import { clearSession } from "@/lib/current-user";

export async function POST() {
  await clearSession();
  return new Response(null, { status: 303, headers: { Location: "/" } });
}
