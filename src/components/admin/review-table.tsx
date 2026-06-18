import { moderateOrganizationAction } from "@/app/admin/actions";

const statusTone: Record<string, string> = {
  "em revisão": "bg-amber-100 text-amber-800",
  "precisa ajuste": "bg-rose-100 text-rose-700",
  publicado: "bg-emerald-100 text-emerald-700",
  rascunho: "bg-slate-100 text-slate-700"
};

type ReviewItem = {
  id: string;
  name: string;
  status: string;
  category: string;
  city: string;
  updatedAt: string;
  moderationNotes: string | null;
};

type ReviewTableProps = {
  items: ReviewItem[];
};

export function ReviewTable({ items }: ReviewTableProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-soft)] text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            <th className="px-5 py-4 font-semibold">Cadastro</th>
            <th className="px-5 py-4 font-semibold">Categoria</th>
            <th className="px-5 py-4 font-semibold">Cidade</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold">Atualizado</th>
            <th className="px-5 py-4 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[var(--color-border)] last:border-b-0">
              <td className="px-5 py-4 font-semibold text-[var(--color-foreground)]">{item.name}</td>
              <td className="px-5 py-4 text-sm text-[var(--color-muted)]">{item.category}</td>
              <td className="px-5 py-4 text-sm text-[var(--color-muted)]">{item.city}</td>
              <td className="px-5 py-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone[item.status]}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-5 py-4 text-sm text-[var(--color-muted)]">{item.updatedAt}</td>
              <td className="px-5 py-4">
                <form action={moderateOrganizationAction} className="space-y-2">
                  <input type="hidden" name="organizationId" value={item.id} />
                  <textarea
                    name="moderationNotes"
                    defaultValue={item.moderationNotes ?? ""}
                    className="min-h-20 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-soft)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none"
                    placeholder="Observação opcional para a curadoria"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      name="intent"
                      value="publish"
                      className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Publicar
                    </button>
                    <button
                      type="submit"
                      name="intent"
                      value="needs_changes"
                      className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Solicitar ajuste
                    </button>
                  </div>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
