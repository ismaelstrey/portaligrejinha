import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProviderCard } from "@/components/catalog/provider-card";
import { getCategoryBySlug, getProvidersByCategory } from "@/server/portal-data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoria não encontrada | Portal Igrejinha"
    };
  }

  return {
    title: `${category.name} | Portal Igrejinha`,
    description: category.description
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, categoryProviders] = await Promise.all([getCategoryBySlug(slug), getProvidersByCategory(slug)]);

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[36px] border border-[var(--color-border)] bg-white p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Categoria local</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--color-foreground)]">{category.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">{category.description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/explorar" className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
            Ver no mapa
          </Link>
          <Link
            href="/painel"
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-soft)] px-5 py-3 text-sm font-semibold text-[var(--color-foreground)]"
          >
            Cadastrar nesta categoria
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        {categoryProviders.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </section>
    </main>
  );
}
