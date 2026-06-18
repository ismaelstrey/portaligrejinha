import { redirect } from "next/navigation";

import { getAuthSession } from "@/auth";
import type { AppRole } from "@/types/auth";

export async function requireAuth(redirectTo: string) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(`/entrar?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return session;
}

export async function requireRole(redirectTo: string, roles: AppRole[]) {
  const session = await requireAuth(redirectTo);

  if (!roles.includes(session.user.role)) {
    redirect("/acesso-negado");
  }

  return session;
}
