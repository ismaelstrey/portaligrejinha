import { OrganizationStatus, UserRole } from "@prisma/client";

import {
  categories as fallbackCategories,
  dashboardHighlights as fallbackDashboardHighlights,
  providers as fallbackProviders,
  reviewQueue as fallbackReviewQueue
} from "@/data/mock-data";
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

function getErrorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String(error.code);
  }

  return "";
}

function isDatabaseUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const code = getErrorCode(error);

  return (
    code === "P1001" ||
    message.includes("Can't reach database server") ||
    message.includes("Timed out fetching a new connection") ||
    message.includes("Temporary failure in name resolution")
  );
}

function isLocalFallbackEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.PORTAL_DATA_FALLBACK === "enabled";
}

function getFallbackAdminSummary() {
  const reviewCount = fallbackReviewQueue.filter((item) => item.status === "em revisão").length;
  const publishedCount = fallbackReviewQueue.filter((item) => item.status === "publicado").length;
  const needsChangesCount = fallbackReviewQueue.filter((item) => item.status === "precisa ajuste").length;

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

async function readWithDatabaseFallback<T>(operation: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isLocalFallbackEnabled() || !isDatabaseUnavailable(error)) {
      throw error;
    }

    console.warn("[portal-data] Banco indisponível; usando dados locais de fallback.");
    return fallback();
  }
}

export async function getCategories(): Promise<Category[]> {
  return readWithDatabaseFallback(async () => {
    const data = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });

    return data.map((item) => ({
      slug: item.slug,
      name: item.name,
      description: item.description
    }));
  }, () => fallbackCategories);
}

export async function getDashboardHighlights() {
  return readWithDatabaseFallback(async () => {
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
  }, () => fallbackDashboardHighlights);
}

export async function getFeaturedProviders() {
  return readWithDatabaseFallback(async () => {
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
  }, () => fallbackProviders.slice(0, 4));
}

export async function getExploreProviders() {
  return readWithDatabaseFallback(async () => {
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
  }, () => fallbackProviders);
}

export async function getCategoryBySlug(slug: string) {
  return readWithDatabaseFallback(async () => {
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
  }, () => fallbackCategories.find((category) => category.slug === slug) ?? null);
}

export async function getProvidersByCategory(slug: string) {
  return readWithDatabaseFallback(async () => {
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
  }, () => fallbackProviders.filter((provider) => provider.category === slug));
}

export async function getReviewQueue() {
  return readWithDatabaseFallback(async () => {
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
  }, () => fallbackReviewQueue.map((item) => ({ ...item, moderationNotes: null })));
}

export async function getAdminSummary() {
  return readWithDatabaseFallback(async () => {
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
  }, getFallbackAdminSummary);
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
