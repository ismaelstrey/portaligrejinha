import Link from "next/link";

export default function AcessoNegadoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-[36px] border border-[var(--color-border)] bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Permissão insuficiente</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--color-foreground)]">Você não tem acesso a esta área</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          Entre com um perfil compatível com o painel solicitado ou volte para a área pública do portal.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/entrar" className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
            Entrar
          </Link>
          <Link href="/" className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-foreground)]">
            Voltar
          </Link>
        </div>
      </div>
    </main>
  );
}
