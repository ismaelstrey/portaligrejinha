import { OrganizationStatus, UserRole } from "@prisma/client";

import { prisma } from "@/server/db";
import type { Category, Provider } from "@/types/catalog";
import type { SubmissionItem } from "@/types/panel";

function mapProvider(data: {
  id: string;
  name: string;
  slug: string;
  summary: string;
  neighborhood: string;
  city: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  responseTimeMinutes: number;
  latitude: number;
  longitude: number;
  mapX: number;
  mapY: number;
  category: { slug: string };
  services: Array<{ title: string }>;
}): Provider {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    category: data.category.slug,
    neighborhood: data.neighborhood,
    city: data.city,
    summary: data.summary,
    services: data.services.map((service) => service.title),
    verified: data.verified,
    rating: data.rating,
    reviewCount: data.reviewCount,
    responseTime:
      data.responseTimeMinutes <= 0
        ? "não informado"
        : data.responseTimeMinutes <= 30
          ? `até ${data.responseTimeMinutes} min`
          : `até ${Math.round(data.responseTimeMinutes / 60)} hora`,
    latitude: data.latitude,
    longitude: data.longitude,
    x: data.mapX,
    y: data.mapY
  };
}

function formatStatus(status: OrganizationStatus) {
  if (status === OrganizationStatus.REVIEW) {
    return "em revisão";
  }

  if (status === OrganizationStatus.NEEDS_CHANGES) {
    return "precisa ajuste";
  }

  if (status === OrganizationStatus.DRAFT) {
    return "rascunho";
  }

  return "publicado";
}

function formatRelativeDate(date: Date) {
  return new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" }).format(
    -Math.max(1, Math.round((Date.now() - date.getTime()) / (1000 * 60))),
    "minute"
  );
}

export async function getCategories(): Promise<Category[]> {
  const data = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return data.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description
  }));
}

export async function getDashboardHighlights() {
  const [publishedOrganizations, reviewOrganizations, categoryCount] = await Promise.all([
    prisma.organization.count({
      where: { status: OrganizationStatus.PUBLISHED }
    }),
    prisma.organization.count({
      where: { status: { in: [OrganizationStatus.REVIEW, OrganizationStatus.NEEDS_CHANGES] } }
    }),
    prisma.category.count()
  ]);

  return [
    {
      label: "Cadastros publicados",
      value: publishedOrganizations.toString(),
      detail: "visíveis no catálogo público"
    },
    {
      label: "Em revisão",
      value: reviewOrganizations.toString(),
      detail: "fila de curadoria ativa"
    },
    {
      label: "Categorias ativas",
      value: categoryCount.toString(),
      detail: "base inicial do portal"
    }
  ];
}

export async function getFeaturedProviders() {
  const data = await prisma.organization.findMany({
    where: { status: OrganizationStatus.PUBLISHED },
    include: {
      category: true,
      services: {
        orderBy: { title: "asc" }
      }
    },
    orderBy: [{ verified: "desc" }, { rating: "desc" }],
    take: 4
  });

  return data.map(mapProvider);
}

export async function getExploreProviders() {
  const data = await prisma.organization.findMany({
    where: { status: OrganizationStatus.PUBLISHED },
    include: {
      category: true,
      services: {
        orderBy: { title: "asc" }
      }
    },
    orderBy: [{ verified: "desc" }, { rating: "desc" }]
  });

  return data.map(mapProvider);
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    return null;
  }

  return {
    slug: category.slug,
    name: category.name,
    description: category.description
  };
}

export async function getProvidersByCategory(slug: string) {
  const data = await prisma.organization.findMany({
    where: {
      status: OrganizationStatus.PUBLISHED,
      category: { slug }
    },
    include: {
      category: true,
      services: {
        orderBy: { title: "asc" }
      }
    },
    orderBy: [{ verified: "desc" }, { rating: "desc" }]
  });

  return data.map(mapProvider);
}

export async function getReviewQueue() {
  const data = await prisma.organization.findMany({
    where: {
      status: { in: [OrganizationStatus.REVIEW, OrganizationStatus.NEEDS_CHANGES, OrganizationStatus.PUBLISHED] }
    },
    include: {
      category: true
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 10
  });

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    status: formatStatus(item.status),
    category: item.category.name,
    city: item.city,
    updatedAt: formatRelativeDate(item.updatedAt),
    moderationNotes: item.moderationNotes
  }));
}

export async function getAdminSummary() {
  const [reviewCount, publishedCount, needsChangesCount] = await Promise.all([
    prisma.organization.count({ where: { status: OrganizationStatus.REVIEW } }),
    prisma.organization.count({ where: { status: OrganizationStatus.PUBLISHED } }),
    prisma.organization.count({ where: { status: OrganizationStatus.NEEDS_CHANGES } })
  ]);

  return [
    {
      title: "Fila de revisão",
      detail: `${reviewCount} itens aguardando análise editorial e geográfica.`
    },
    {
      title: "Publicados",
      detail: `${publishedCount} cadastros já estão visíveis no catálogo.`
    },
    {
      title: "Precisam de ajuste",
      detail: `${needsChangesCount} cadastros voltaram para correção.`
    }
  ];
}

export async function getCurrentUserSnapshot(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
}

export async function getProviderSubmissions(userId: string): Promise<SubmissionItem[]> {
  const items = await prisma.organization.findMany({
    where: {
      ownerId: userId
    },
    include: {
      category: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    categoryName: item.category.name,
    city: item.city,
    neighborhood: item.neighborhood,
    statusLabel: formatStatus(item.status),
    updatedAt: formatRelativeDate(item.updatedAt),
    moderationNotes: item.moderationNotes
  }));
}

export const accessMatrix = {
  admin: [UserRole.ADMIN, UserRole.REVIEWER],
  painel: [UserRole.ADMIN, UserRole.REVIEWER, UserRole.PROVIDER]
};
