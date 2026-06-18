import Link from "next/link";
import { ArrowRight, Building2, MapPinned, Search, ShieldCheck } from "lucide-react";

import { ProviderCard } from "@/components/catalog/provider-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategories, getDashboardHighlights, getFeaturedProviders } from "@/server/portal-data";

export default async function HomePage() {
  const [categories, dashboardHighlights, providers] = await Promise.all([
    getCategories(),
    getDashboardHighlights(),
    getFeaturedProviders()
  ]);

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[40px] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(239,244,255,0.92))] p-8 shadow-[var(--shadow-soft)] lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-end">
          <div>
            <Badge>Fase inicial já implementada</Badge>
            <h1 className="font-display mt-5 max-w-4xl text-5xl font-black leading-none tracking-tight text-[var(--color-foreground)] sm:text-6xl">
              Um portal local para encontrar serviços, comércios e informações úteis com visão em lista e mapa.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              Esta primeira versão transforma o blueprint em um app real em `Next.js`, com catálogo público, fluxo inicial
              de cadastro, base administrativa e experiência de exploração preparada para crescer.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/explorar">
                <Button>
                  Explorar no mapa
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/painel">
                <Button variant="secondary">Cadastrar negócio</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {dashboardHighlights.map((item) => (
              <article key={item.label} className="rounded-[28px] border border-white/60 bg-white/90 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">{item.label}</p>
                <p className="mt-3 text-4xl font-black tracking-tight text-[var(--color-foreground)]">{item.value}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Descoberta pública",
            icon: Search,
            text: "Busca, categorias, páginas locais e estrutura preparada para SEO."
          },
          {
            title: "Modo mapa",
            icon: MapPinned,
            text: "Lista sincronizada, marcadores e base pronta para viewport e clustering."
          },
          {
            title: "Governança",
            icon: ShieldCheck,
            text: "Painel de revisão e qualidade de dados desde a primeira fase."
          }
        ].map(({ title, icon: Icon, text }) => (
          <article key={title} className="rounded-[32px] border border-[var(--color-border)] bg-white p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-[var(--color-primary-soft)] p-3 text-[var(--color-primary)]">
              <Icon className="size-5" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-[var(--color-foreground)]">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[40px] border border-[var(--color-border)] bg-white p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Categorias base</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-foreground)]">Estrutura inicial do catálogo</h2>
          </div>
          <Link href="/explorar" className="text-sm font-semibold text-[var(--color-primary)]">
            Abrir exploração
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categoria/${category.slug}`}
              className="group rounded-[28px] border border-[var(--color-border)] bg-[var(--color-soft)] p-5 transition hover:-translate-y-1 hover:bg-white"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-white p-3 text-[var(--color-primary)]">
                <Building2 className="size-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--color-foreground)]">{category.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[40px] border border-[var(--color-border)] bg-white p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Vitrine inicial</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-foreground)]">Prestadores e comércios em destaque</h2>
          </div>
          <Link href="/painel" className="text-sm font-semibold text-[var(--color-primary)]">
            Entrar no painel
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </section>
    </main>
  );
}
