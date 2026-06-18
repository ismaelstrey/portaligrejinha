"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
  slug?: string;
  status: string;
  category: string;
  city: string;
  updatedAt: string;
  moderationNotes: string | null;
};

type ReviewTableProps = {
  items: ReviewItem[];
};

function normalizeFilter(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function ReviewTable({ items }: ReviewTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todas");

  const statuses = useMemo(() => Array.from(new Set(items.map((item) => item.status))).sort(), [items]);
  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))).sort(), [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = normalizeFilter(searchTerm);

    return items.filter((item) => {
      const searchableText = normalizeFilter(`${item.name} ${item.category} ${item.city} ${item.status}`);
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesStatus = statusFilter === "todos" || item.status === statusFilter;
      const matchesCategory = categoryFilter === "todas" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [categoryFilter, items, searchTerm, statusFilter]);

  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-white">
      <div className="grid gap-3 border-b border-[var(--color-border)] bg-[var(--color-soft)] p-4 lg:grid-cols-[1fr_220px_220px]">
        <div>
          <label htmlFor="admin-review-search" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Buscar cadastro
          </label>
          <input
            id="admin-review-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Nome, categoria, cidade ou status"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          />
        </div>

        <div>
          <label htmlFor="admin-review-status" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Status
          </label>
          <select
            id="admin-review-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            <option value="todos">Todos</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="admin-review-category" className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Categoria
          </label>
          <select
            id="admin-review-category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          >
            <option value="todas">Todas</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
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
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-[var(--color-border)] last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[var(--color-foreground)]">{item.name}</div>
                    {item.slug && item.status === "publicado" ? (
                      <Link href={`/prestador/${item.slug}`} className="mt-1 inline-flex text-xs font-semibold text-[var(--color-primary)]">
                        Ver página pública
                      </Link>
                    ) : (
                      <p className="mt-1 text-xs text-[var(--color-muted)]">Página pública disponível após publicação.</p>
                    )}
                  </td>
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
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm leading-6 text-[var(--color-muted)]">
                  Nenhum cadastro encontrado com os filtros atuais. Ajuste a busca, status ou categoria para ampliar a fila.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
