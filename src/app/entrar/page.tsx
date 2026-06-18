import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/auth";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Entrar | Portal Igrejinha",
  description: "Acesso ao painel e ao backoffice do portal."
};

type EntrarPageProps = {
  searchParams: Promise<{
    erro?: string;
    redirectTo?: string;
  }>;
};

export default async function EntrarPage({ searchParams }: EntrarPageProps) {
  const session = await getAuthSession();
  const params = await searchParams;

  if (session?.user) {
    redirect(params.redirectTo || "/painel");
  }

  const errorMessage = params.erro ? "E-mail ou senha inválidos." : null;
  const redirectTo = params.redirectTo || "/painel";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[36px] border border-[var(--color-border)] bg-white p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Autenticação inicial</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--color-foreground)]">Entrar no portal</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            Nesta fase, o sistema usa autenticação local com credenciais salvas no PostgreSQL via `Prisma`.
          </p>

          <SignInForm errorMessage={errorMessage} redirectTo={redirectTo} />
        </div>

        <aside className="space-y-6">
          <article className="rounded-[36px] border border-[var(--color-border)] bg-white p-7">
            <div className="mb-4 inline-flex rounded-2xl bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary)]">
              <ShieldCheck className="size-5" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[var(--color-foreground)]">Perfis disponíveis</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
              <li><strong className="text-[var(--color-foreground)]">Admin</strong>: acesso completo ao backoffice.</li>
              <li><strong className="text-[var(--color-foreground)]">Curadoria</strong>: revisão e qualidade de dados.</li>
              <li><strong className="text-[var(--color-foreground)]">Prestador</strong>: gestão do cadastro próprio.</li>
            </ul>
          </article>

          <article className="rounded-[36px] border border-[var(--color-border)] bg-[var(--color-soft)] p-7">
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              A base já está pronta para evoluir depois para login social, convites, redefinição de senha e trilha de auditoria por sessão.
            </p>
          </article>
        </aside>
      </section>
    </main>
  );
}
