"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createProviderSubmission } from "@/app/painel/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/types/catalog";

const providerSchema = z.object({
  businessName: z.string().min(3, "Informe um nome com pelo menos 3 caracteres."),
  categorySlug: z.string().min(2, "Escolha uma categoria."),
  contact: z.string().min(8, "Informe um contato válido."),
  neighborhood: z.string().min(2, "Informe o bairro."),
  city: z.string().min(2, "Informe a cidade."),
  address: z.string().min(4, "Informe o endereço."),
  services: z.string().min(3, "Informe ao menos um serviço."),
  summary: z.string().min(20, "Descreva melhor o serviço em pelo menos 20 caracteres."),
  latitude: z.union([z.number(), z.nan()]).optional(),
  longitude: z.union([z.number(), z.nan()]).optional()
});

type ProviderFormData = z.infer<typeof providerSchema>;

type ProviderOnboardingFormProps = {
  categories: Category[];
};

export function ProviderOnboardingForm({ categories }: ProviderOnboardingFormProps) {
  const [serverMessage, setServerMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [activeIntent, setActiveIntent] = useState<"draft" | "review">("draft");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful }
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      businessName: "",
      categorySlug: categories[0]?.slug ?? "",
      contact: "",
      neighborhood: "",
      city: "Igrejinha",
      address: "",
      services: "",
      summary: "",
      latitude: Number.NaN,
      longitude: Number.NaN
    }
  });

  const submitWithIntent = (values: ProviderFormData, intent: "draft" | "review") => {
    setActiveIntent(intent);

    startTransition(async () => {
      const result = await createProviderSubmission({
        businessName: values.businessName,
        categorySlug: values.categorySlug,
        contact: values.contact,
        neighborhood: values.neighborhood,
        city: values.city,
        address: values.address,
        services: values.services,
        summary: values.summary,
        latitude: Number.isNaN(values.latitude) ? undefined : Number(values.latitude),
        longitude: Number.isNaN(values.longitude) ? undefined : Number(values.longitude),
        intent
      });

      setServerMessage({
        success: result.success,
        text: result.message
      });

      if (result.success) {
        reset({
          businessName: "",
          categorySlug: categories[0]?.slug ?? "",
          contact: "",
          neighborhood: "",
          city: "Igrejinha",
          address: "",
          services: "",
          summary: "",
          latitude: Number.NaN,
          longitude: Number.NaN
        });
      }
    });
  };

  return (
    <div className="rounded-[32px] border border-[var(--color-border)] bg-white p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">Fluxo inicial</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-foreground)]">Cadastro guiado do prestador</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Formulário conectado ao banco com `Server Actions`, `react-hook-form` e `zod`.
        </p>
      </div>

      {serverMessage?.success || isSubmitSuccessful ? (
        <div className="mb-6 flex items-start gap-3 rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          {serverMessage?.text ?? "Cadastro salvo com sucesso."}
        </div>
      ) : null}

      {serverMessage && !serverMessage.success ? (
        <div className="mb-6 rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
          {serverMessage.text}
        </div>
      ) : null}

      <form className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Nome do negócio</label>
          <Input placeholder="Ex.: Estúdio Serra Criativa" {...register("businessName")} />
          {errors.businessName ? <p className="mt-2 text-sm text-rose-600">{errors.businessName.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Categoria principal</label>
          <select
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary-soft)]"
            {...register("categorySlug")}
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categorySlug ? <p className="mt-2 text-sm text-rose-600">{errors.categorySlug.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Contato</label>
          <Input placeholder="WhatsApp ou telefone" {...register("contact")} />
          {errors.contact ? <p className="mt-2 text-sm text-rose-600">{errors.contact.message}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Bairro</label>
          <Input placeholder="Centro, Bom Pastor, Viaduto..." {...register("neighborhood")} />
          {errors.neighborhood ? <p className="mt-2 text-sm text-rose-600">{errors.neighborhood.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Cidade</label>
          <Input placeholder="Igrejinha" {...register("city")} />
          {errors.city ? <p className="mt-2 text-sm text-rose-600">{errors.city.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Endereço</label>
          <Input placeholder="Rua, número e complemento" {...register("address")} />
          {errors.address ? <p className="mt-2 text-sm text-rose-600">{errors.address.message}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Serviços oferecidos</label>
          <Input placeholder="Separe por vírgula: elétrica, hidráulica, pintura" {...register("services")} />
          {errors.services ? <p className="mt-2 text-sm text-rose-600">{errors.services.message}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Resumo do serviço</label>
          <Textarea placeholder="Explique o que você oferece, para quem e em quais bairros atende." {...register("summary")} />
          {errors.summary ? <p className="mt-2 text-sm text-rose-600">{errors.summary.message}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Latitude opcional</label>
          <Input type="number" step="0.000001" placeholder="-29.5744" {...register("latitude", { valueAsNumber: true })} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--color-foreground)]">Longitude opcional</label>
          <Input type="number" step="0.000001" placeholder="-50.7905" {...register("longitude", { valueAsNumber: true })} />
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
          <Button
            type="button"
            disabled={isPending}
            onClick={handleSubmit((values) => submitWithIntent(values, "draft"))}
          >
            {isPending && activeIntent === "draft" ? "Salvando..." : "Salvar rascunho"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={handleSubmit((values) => submitWithIntent(values, "review"))}
          >
            {isPending && activeIntent === "review" ? "Enviando..." : "Enviar para revisão"}
          </Button>
        </div>
      </form>
    </div>
  );
}
