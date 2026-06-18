import type { SubmissionItem } from "@/types/panel";

type SubmissionListProps = {
  items: SubmissionItem[];
};

const statusTone: Record<string, string> = {
  rascunho: "bg-slate-100 text-slate-700",
  "em revisão": "bg-amber-100 text-amber-800",
  "precisa ajuste": "bg-rose-100 text-rose-700",
  publicado: "bg-emerald-100 text-emerald-700"
};

export function SubmissionList({ items }: SubmissionListProps) {
  return (
    <article className="rounded-[32px] border border-[var(--color-border)] bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Seus cadastros</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-foreground)]">Acompanhamento do fluxo</h2>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-[24px] bg-[var(--color-soft)] px-4 py-5 text-sm leading-6 text-[var(--color-muted)]">
            Você ainda não enviou nenhum cadastro nesta conta.
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-[var(--color-foreground)]">{item.name}</h3>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {item.categoryName} • {item.neighborhood}, {item.city}
                  </p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone[item.statusLabel] ?? statusTone.rascunho}`}>
                  {item.statusLabel}
                </span>
              </div>

              <p className="mt-3 text-sm text-[var(--color-muted)]">Atualizado {item.updatedAt}</p>

              {item.moderationNotes ? (
                <div className="mt-3 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                  <strong>Observação da curadoria:</strong> {item.moderationNotes}
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </article>
  );
}
