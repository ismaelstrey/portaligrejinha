import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, ExternalLink, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getCategoryBySlug, getProviderBySlug } from "@/server/portal-data";

type ProviderPageProps = {
  params: Promise<{ slug: string }>;
};

function normalizeWhatsApp(value?: string | null) {
  return value?.replace(/\D/g, "") ?? "";
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    return {
      title: "Prestador não encontrado | Portal Igrejinha"
    };
  }

  return {
    title: `${provider.name} | Portal Igrejinha`,
    description: provider.summary
  };
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const category = await getCategoryBySlug(provider.category);
  const whatsappNumber = normalizeWhatsApp(provider.whatsapp ?? provider.phone);
  const hasDirectContact = Boolean(provider.phone || provider.whatsapp || provider.email || provider.website);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/explorar" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
        <ArrowLeft className="size-4" />
        Voltar para exploração
      </Link>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[40px] border border-[var(--color-border)] bg-white p-7 shadow-[var(--shadow-soft)] lg:p-9">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge>{category?.name ?? provider.category.replace("-", " ")}</Badge>
            {provider.verified ? (
              <Badge className="bg-emerald-100 text-emerald-700">
                <ShieldCheck className="mr-1 size-3" />
                Verificado
              </Badge>
            ) : null}
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-[var(--color-foreground)] sm:text-5xl">{provider.name}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-muted)]">{provider.description ?? provider.summary}</p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] bg-[var(--color-soft)] p-5">
              <div className="mb-3 inline-flex rounded-2xl bg-white p-3 text-[var(--color-primary)]">
                <MapPin className="size-5" />
              </div>
              <h2 className="font-bold text-[var(--color-foreground)]">Localização</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {provider.address ? `${provider.address}, ` : ""}{provider.neighborhood}, {provider.city}
              </p>
            </div>

            <div className="rounded-[28px] bg-[var(--color-soft)] p-5">
              <div className="mb-3 inline-flex rounded-2xl bg-white p-3 text-[var(--color-primary)]">
                <Clock3 className="size-5" />
              </div>
              <h2 className="font-bold text-[var(--color-foreground)]">Tempo de resposta</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">Resposta {provider.responseTime}</p>
            </div>

            <div className="rounded-[28px] bg-[var(--color-soft)] p-5">
              <div className="mb-3 inline-flex rounded-2xl bg-white p-3 text-[var(--color-primary)]">
                <Star className="size-5" />
              </div>
              <h2 className="font-bold text-[var(--color-foreground)]">Reputação</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {provider.reviewCount > 0 ? `${provider.rating.toFixed(1)} em ${provider.reviewCount} avaliações` : "Novo cadastro sem avaliações curadas"}
              </p>
            </div>
          </div>

          <section className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Serviços oferecidos</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {provider.services.map((service) => (
                <span key={service} className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)]">
                  {service}
                </span>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-5">
          <section className="rounded-[32px] border border-[var(--color-border)] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Contato</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-foreground)]">Fale com o prestador</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              Use os canais informados pelo cadastro para confirmar disponibilidade, orçamento e horários.
            </p>

            <div className="mt-5 space-y-3">
              {provider.whatsapp && whatsappNumber ? (
                <Link
                  href={`https://wa.me/55${whatsappNumber}`}
                  target="_blank"
                  className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
                >
                  <MessageCircle className="size-4" />
                  Chamar no WhatsApp
                </Link>
              ) : null}

              {provider.phone ? (
                <Link href={`tel:${provider.phone}`} className="flex items-center gap-3 rounded-2xl bg-[var(--color-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-foreground)]">
                  <Phone className="size-4 text-[var(--color-primary)]" />
                  {provider.phone}
                </Link>
              ) : null}

              {provider.email ? (
                <Link href={`mailto:${provider.email}`} className="flex items-center gap-3 rounded-2xl bg-[var(--color-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-foreground)]">
                  <Mail className="size-4 text-[var(--color-primary)]" />
                  {provider.email}
                </Link>
              ) : null}

              {provider.website ? (
                <Link
                  href={provider.website}
                  target="_blank"
                  className="flex items-center gap-3 rounded-2xl bg-[var(--color-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-foreground)]"
                >
                  <ExternalLink className="size-4 text-[var(--color-primary)]" />
                  Site ou rede social
                </Link>
              ) : null}

              {!hasDirectContact ? (
                <div className="rounded-2xl bg-[var(--color-soft)] px-4 py-3 text-sm leading-6 text-[var(--color-muted)]">
                  Este cadastro ainda não possui canais de contato públicos. Consulte a categoria ou retorne ao mapa.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[32px] border border-[var(--color-border)] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Categoria</p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-[var(--color-foreground)]">{category?.name ?? "Categoria local"}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{category?.description ?? "Veja outros prestadores relacionados no catálogo."}</p>
            <Link
              href={`/categoria/${provider.category}`}
              className="mt-5 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]"
            >
              Ver categoria completa
            </Link>
          </section>
        </aside>
      </section>
    </main>
  );
}
