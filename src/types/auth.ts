import type { DefaultSession } from "next-auth";

export type AppRole = "ADMIN" | "REVIEWER" | "PROVIDER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: AppRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    role?: AppRole;
  }
}
