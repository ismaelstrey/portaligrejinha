"use client";

import type { ReactNode } from "react";
import { signOut } from "next-auth/react";

type SignOutButtonProps = {
  children: ReactNode;
};

export function SignOutButton({ children }: SignOutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-soft)]"
    >
      {children}
    </button>
  );
}
