"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Category, Provider } from "@/types/catalog";

const LeafletCanvas = dynamic(
  () => import("@/components/catalog/leaflet-canvas").then((module) => module.LeafletCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[540px] items-center justify-center rounded-[28px] bg-[var(--color-soft)] text-sm font-medium text-[var(--color-muted)]">
        Carregando mapa real...
      </div>
    )
  }
);

type MapExplorerProps = {
  categories: Category[];
  providers: Provider[];
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function providerMatchesSearch(provider: Provider, search: string) {
  if (!search) {
    return true;
  }

  const searchableText = normalizeSearch([
    provider.name,
    provider.summary,
    provider.neighborhood,
    provider.city,
    provider.category,
    ...provider.services
  ].join(" "));

  return searchableText.includes(search);
}

export function MapExplorer({ categories, providers }: MapExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [activeId, setActiveId] = useState<string>(providers[0]?.id ?? "");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProviders = useMemo(() => {
    const normalizedSearch = normalizeSearch(searchTerm);

    return providers.filter((provider) => {
      const matchesCategory = activeCategory === "todos" || provider.category === activeCategory;

      return matchesCategory && providerMatchesSearch(provider, normalizedSearch);
    });
  }, [activeCategory, providers, searchTerm]);

  const activeProvider = filteredProviders.find((provider) => provider.id === activeId) ?? filteredProviders[0];

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-[32px] border border-[var(--color-border)] bg-white p-5">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Exploração</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-foreground)]">Lista sincronizada com mapa</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
            Nesta fase, o projeto já nasce com estado compartilhado entre filtros, lista e marcadores.
          </p>
        </div>

        <div className="mb-5">
          <label htmlFor="provider-search" className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">
            Buscar por nome, serviço ou bairro
          </label>
          <input
            id="provider-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Ex.: elétrica, Centro, mercado"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
          />
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("todos")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              activeCategory === "todos"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-soft)] text-[var(--color-foreground)]"
            )}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                activeCategory === category.slug
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-soft)] text-[var(--color-foreground)]"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => {
              const isActive = provider.id === activeProvider?.id;

              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setActiveId(provider.id)}
                  className={cn(
                    "w-full rounded-[24px] border p-4 text-left transition",
                    isActive
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                      : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/40"
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <h3 className="font-bold text-[var(--color-foreground)]">{provider.name}</h3>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[var(--color-primary)]">
                      {provider.reviewCount > 0 ? provider.rating.toFixed(1) : "novo"}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-muted)]">{provider.neighborhood}</p>
                </button>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-dashed border-[var(--color-border)] bg-[var(--color-soft)] p-5 text-sm leading-6 text-[var(--color-muted)]">
              Nenhum prestador encontrado com os filtros atuais. Tente buscar por outro serviço, bairro ou categoria.
            </div>
          )}
        </div>
      </aside>

      <div className="rounded-[36px] border border-[var(--color-border)] bg-[radial-gradient(circle_at_top,_rgba(74,54,227,0.12),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Modo mapa</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-foreground)]">
              Canvas geográfico preparado para clusters e viewport
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] shadow-sm">
            <Sparkles className="size-4 text-[var(--color-primary)]" />
            {filteredProviders.length} resultados visíveis
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-soft)]">
          <LeafletCanvas providers={filteredProviders} activeId={activeProvider?.id} onSelect={setActiveId} />

          {activeProvider ? (
            <div className="absolute bottom-5 left-5 z-[500] max-w-sm rounded-[28px] border border-[var(--color-border)] bg-white/95 p-5 shadow-xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Destaque no mapa</p>
              <h3 className="mt-2 text-xl font-black tracking-tight text-[var(--color-foreground)]">{activeProvider.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{activeProvider.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeProvider.services.map((service) => (
                  <span key={service} className="rounded-full bg-[var(--color-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-foreground)]">
                    {service}
                  </span>
                ))}
              </div>
              <Link
                href={`/prestador/${activeProvider.slug}`}
                className="mt-4 inline-flex rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Ver detalhes do prestador
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
