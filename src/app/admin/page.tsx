import type { Metadata } from "next";
import { Eye, TimerReset, WandSparkles } from "lucide-react";

import { ReviewTable } from "@/components/admin/review-table";
import { requireRole } from "@/lib/access";
import { getAdminSummary, getReviewQueue } from "@/server/portal-data";

export const metadata: Metadata = {
  title: "Admin | Portal Igrejinha",
  description: "Base administrativa inicial para curadoria de cadastros."
};

const adminIcons = [Eye, TimerReset, WandSparkles];

export default async function AdminPage() {
  await requireRole("/admin", ["ADMIN", "REVIEWER"]);
  const [adminCards, reviewQueue] = await Promise.all([getAdminSummary(), getReviewQueue()]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[36px] border border-[var(--color-border)] bg-white p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Backoffice</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--color-foreground)]">Curadoria e governança do catálogo</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Tela inicial do admin com visão do fluxo de revisão, pronta para receber autenticação real, filtros operacionais e histórico completo.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {adminCards.map(({ title, detail }, index) => {
            const Icon = adminIcons[index] ?? Eye;

            return (
            <article key={title} className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-soft)] p-5">
              <div className="mb-4 inline-flex rounded-2xl bg-white p-3 text-[var(--color-primary)]">
                <Icon className="size-5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--color-foreground)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{detail}</p>
            </article>
            );
          })}
        </div>

        <ReviewTable items={reviewQueue} />
      </section>
    </main>
  );
}
