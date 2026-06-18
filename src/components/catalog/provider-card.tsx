import Link from "next/link";
import { Clock3, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Provider } from "@/types/catalog";

type ProviderCardProps = {
  provider: Provider;
};

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <article className="group rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge>{provider.category.replace("-", " ")}</Badge>
            {provider.verified ? <Badge className="bg-emerald-100 text-emerald-700">Verificado</Badge> : null}
          </div>
          <h3 className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">{provider.name}</h3>
        </div>
        <div className="rounded-2xl bg-[var(--color-soft)] px-3 py-2 text-right">
          {provider.reviewCount > 0 ? (
            <>
              <div className="flex items-center gap-1 text-sm font-semibold text-[var(--color-foreground)]">
                <Star className="size-4 fill-current text-amber-500" />
                {provider.rating.toFixed(1)}
              </div>
              <p className="text-xs text-[var(--color-muted)]">{provider.reviewCount} avaliações</p>
            </>
          ) : (
            <>
              <div className="text-sm font-semibold text-[var(--color-foreground)]">Novo cadastro</div>
              <p className="text-xs text-[var(--color-muted)]">sem avaliações curadas</p>
            </>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm leading-6 text-[var(--color-muted)]">{provider.summary}</p>

      <div className="mb-5 flex flex-wrap gap-2">
        {provider.services.map((service) => (
          <span key={service} className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
            {service}
          </span>
        ))}
      </div>

      <div className="mb-5 grid gap-3 text-sm text-[var(--color-muted)] sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-[var(--color-primary)]" />
          {provider.neighborhood}, {provider.city}
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="size-4 text-[var(--color-primary)]" />
          Resposta {provider.responseTime}
        </div>
      </div>

      <Link
        href={`/categoria/${provider.category}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition group-hover:gap-3"
      >
        Ver categoria relacionada
      </Link>
    </article>
  );
}
