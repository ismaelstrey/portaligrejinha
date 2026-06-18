"use server";

import { OrganizationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/access";
import { prisma } from "@/server/db";

export async function moderateOrganizationAction(formData: FormData) {
  await requireRole("/admin", ["ADMIN", "REVIEWER"]);

  const organizationId = String(formData.get("organizationId") ?? "");
  const intent = String(formData.get("intent") ?? "");
  const moderationNotes = String(formData.get("moderationNotes") ?? "").trim();

  if (!organizationId || (intent !== "publish" && intent !== "needs_changes")) {
    return;
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { category: true }
  });

  if (!organization) {
    return;
  }

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      status: intent === "publish" ? OrganizationStatus.PUBLISHED : OrganizationStatus.NEEDS_CHANGES,
      moderationNotes: moderationNotes || null,
      reviewedAt: new Date()
    }
  });

  revalidatePath("/admin");
  revalidatePath("/explorar");
  revalidatePath("/");
  revalidatePath("/painel");
  revalidatePath(`/categoria/${organization.category.slug}`);
}
