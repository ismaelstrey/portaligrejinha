export const roles = ["visitor", "provider", "reviewer", "admin"] as const;

export type Role = (typeof roles)[number];

export const roleLabels: Record<Role, string> = {
  visitor: "Visitante",
  provider: "Prestador",
  reviewer: "Curadoria",
  admin: "Administrador"
};
