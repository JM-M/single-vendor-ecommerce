import type { User } from "@/payload-types";
import { ClientUser } from "payload";

export const isSuperAdmin = (user: User | ClientUser | null): boolean => {
  return Boolean(user?.roles?.includes("super-admin"));
};

export const isAdmin = (user: User | ClientUser | null): boolean => {
  if (isSuperAdmin(user)) return true;
  return Boolean(user?.roles?.includes("admin"));
};
