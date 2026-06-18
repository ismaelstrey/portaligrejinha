"use server";

import { OrganizationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/access";
import { prisma } from "@/server/db";

type CreateProviderPayload = {
  businessName: string;
  categorySlug: string;
  contact: string;
  neighborhood: string;
  city: string;
  address: string;
  summary: string;
  services: string;
  latitude?: number;
  longitude?: number;
  intent: "draft" | "review";
};

export type ProviderActionResult = {
  success: boolean;
  message: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function stringHash(value: string) {
  return value.split("").reduce((acc, char) => {
    return (acc * 31 + char.charCodeAt(0)) >>> 0;
  }, 7);
}

function resolveCoordinates(payload: CreateProviderPayload) {
  const baseLat = -29.5744;
  const baseLng = -50.7905;
  const hash = stringHash(`${payload.businessName}-${payload.neighborhood}-${payload.city}`);

  const latitude =
    payload.latitude ??
    baseLat + (((hash % 80) - 40) / 10000);

  const longitude =
    payload.longitude ??
    baseLng + ((((hash >> 3) % 80) - 40) / 10000);

  const x = Math.max(10, Math.min(90, Math.round(50 + (longitude - baseLng) * 8000)));
  const y = Math.max(10, Math.min(90, Math.round(50 - (latitude - baseLat) * 8000)));

  return {
    latitude,
    longitude,
    x,
    y
  };
}

export async function createProviderSubmission(payload: CreateProviderPayload): Promise<ProviderActionResult> {
  const session = await requireRole("/painel", ["ADMIN", "REVIEWER", "PROVIDER"]);

  const businessName = payload.businessName.trim();
  const categorySlug = payload.categorySlug.trim();
  const contact = payload.contact.trim();
  const neighborhood = payload.neighborhood.trim();
  const city = payload.city.trim();
  const address = payload.address.trim();
  const summary = payload.summary.trim();
  const services = payload.services
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (businessName.length < 3 || neighborhood.length < 2 || city.length < 2 || summary.length < 20 || services.length === 0) {
    return {
      success: false,
      message: "Preencha todos os campos obrigatórios e informe ao menos um serviço."
    };
  }

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) {
    return {
      success: false,
      message: "A categoria escolhida não foi encontrada."
    };
  }

  const existing = await prisma.organization.findFirst({
    where: {
      ownerId: session.user.id,
      name: {
        equals: businessName,
        mode: "insensitive"
      }
    }
  });

  if (existing) {
    return {
      success: false,
      message: "Você já possui um cadastro com este nome."
    };
  }

  const baseSlug = slugify(businessName) || `cadastro-${Date.now()}`;
  let uniqueSlug = baseSlug;
  let index = 1;

  while (await prisma.organization.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${index}`;
    index += 1;
  }

  const coordinates = resolveCoordinates(payload);

  const organization = await prisma.organization.create({
    data: {
      name: businessName,
      slug: uniqueSlug,
      summary,
      description: summary,
      phone: contact,
      whatsapp: contact,
      neighborhood,
      city,
      address: address || null,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      mapX: coordinates.x,
      mapY: coordinates.y,
      status: payload.intent === "draft" ? OrganizationStatus.DRAFT : OrganizationStatus.REVIEW,
      ownerId: session.user.id,
      categoryId: category.id
    }
  });

  await prisma.serviceOffering.createMany({
    data: services.map((service) => ({
      organizationId: organization.id,
      title: service,
      description: `Serviço oferecido por ${businessName}: ${service}.`
    }))
  });

  revalidatePath("/");
  revalidatePath("/explorar");
  revalidatePath("/painel");
  revalidatePath("/admin");
  revalidatePath(`/categoria/${category.slug}`);

  return {
    success: true,
    message:
      payload.intent === "draft"
        ? "Cadastro salvo como rascunho."
        : "Cadastro enviado para revisão da curadoria."
  };
}
