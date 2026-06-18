"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SignInFormProps = {
  errorMessage: string | null;
  redirectTo: string;
};

export function SignInForm({ errorMessage, redirectTo }: SignInFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(errorMessage);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setLocalError(null);

    const result = await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false,
      callbackUrl: redirectTo
    });

    setPending(false);

    if (result?.error) {
      setLocalError("E-mail ou senha inválidos.");
      return;
    }

    router.push(result?.url ?? redirectTo);
    router.refresh();
  }

  return (
    <form
      className="mt-8 space-y-4"
      action={async (formData) => {
        await handleSubmit(formData);
      }}
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">E-mail</label>
        <Input type="email" name="email" placeholder="voce@exemplo.com" required />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Senha</label>
        <Input type="password" name="password" placeholder="Sua senha" required />
      </div>

      {localError ? <p className="text-sm font-medium text-rose-600">{localError}</p> : null}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          <KeyRound className="mr-2 size-4" />
          {pending ? "Entrando..." : "Entrar"}
        </Button>
        <Link href="/" className="inline-flex items-center rounded-full px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
          Voltar para o portal
        </Link>
      </div>
    </form>
  );
}
