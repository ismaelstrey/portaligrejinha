import Link from "next/link";
import { Compass, LayoutDashboard, LogIn, LogOut, MapPinned, ShieldCheck } from "lucide-react";

import { getAuthSession } from "@/auth";
import { roleLabels } from "@/features/identity/model/roles";
import { SignOutButton } from "@/components/auth/sign-out-button";

const links = [
  { href: "/", label: "Início", icon: Compass },
  { href: "/explorar", label: "Explorar", icon: MapPinned },
  { href: "/painel", label: "Painel", icon: LayoutDashboard },
  { href: "/admin", label: "Admin", icon: ShieldCheck }
];

export async function SiteHeader() {
  const session = await getAuthSession();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="text-lg font-black tracking-tight text-[var(--color-foreground)]">
            Portal<span className="text-[var(--color-primary)]">Igrejinha</span>
          </Link>
          <p className="hidden text-sm text-[var(--color-muted)] md:block">
            Cadastro, descoberta local e visualização em mapa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="hidden rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-right md:block">
              <p className="text-sm font-semibold text-[var(--color-foreground)]">{session.user.name}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {roleLabels[session.user.role.toLowerCase() as keyof typeof roleLabels]}
              </p>
            </div>
          ) : null}

          <nav className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-soft)] p-1.5">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-white"
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          </nav>

          {session?.user ? (
            <SignOutButton>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sair</span>
            </SignOutButton>
          ) : (
            <Link
              href="/entrar"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-soft)]"
            >
              <LogIn className="size-4" />
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
