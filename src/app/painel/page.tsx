import type { Metadata } from "next";
import { Check, ShieldAlert, Sparkles } from "lucide-react";

import { ProviderOnboardingForm } from "@/components/forms/provider-onboarding-form";
import { SubmissionList } from "@/components/panel/submission-list";
import { requireRole } from "@/lib/access";
import { getCategories, getCurrentUserSnapshot, getProviderSubmissions } from "@/server/portal-data";

export const metadata: Metadata = {
  title: "Painel do prestador | Portal Igrejinha",
  description: "Fluxo inicial de cadastro e envio para moderação."
};

export default async function PainelPage() {
  const session = await requireRole("/painel", ["ADMIN", "REVIEWER", "PROVIDER"]);
  const [user, categories, submissions] = await Promise.all([
    getCurrentUserSnapshot(session.user.id),
    getCategories(),
    getProviderSubmissions(session.user.id)
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <ProviderOnboardingForm categories={categories} />
          <SubmissionList items={submissions} />
        </div>

        <section className="space-y-6">
          <article className="rounded-[32px] border border-[var(--color-border)] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Fluxo editorial</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-foreground)]">O que acontece após o envio</h2>
            <div className="mt-4 rounded-[24px] bg-[var(--color-soft)] px-4 py-4 text-sm text-[var(--color-muted)]">
              Sessão ativa como <strong className="text-[var(--color-foreground)]">{user?.name}</strong> com perfil{" "}
              <strong className="text-[var(--color-foreground)]">{session.user.role}</strong>.
            </div>
            <div className="mt-6 space-y-4">
              {[
                "Validação dos campos obrigatórios e do resumo do serviço.",
                "Checagem de duplicidade por nome, contato e área do mapa.",
                "Entrada na fila de curadoria para aprovação ou ajuste.",
                "Publicação nas páginas públicas após revisão."
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-[24px] bg-[var(--color-soft)] px-4 py-4">
                  <div className="mt-0.5 rounded-full bg-white p-2 text-[var(--color-primary)]">
                    {index < 3 ? <Check className="size-4" /> : <Sparkles className="size-4" />}
                  </div>
                  <p className="text-sm leading-6 text-[var(--color-muted)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 size-5 text-amber-700" />
              <div>
                <h3 className="text-lg font-bold text-amber-900">Autenticação preparada para a próxima fase</h3>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  O painel já grava cadastros reais no PostgreSQL, preserva o vínculo com o usuário autenticado e deixa
                  o item pronto para o fluxo de moderação.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
