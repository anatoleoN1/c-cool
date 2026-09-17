import type { UserRole } from "@/types";

export function hasRole(role: UserRole | undefined, ...accepted: UserRole[]): boolean {
  return Boolean(role && accepted.includes(role));
}

export const roleLabel: Record<UserRole, string> = {
  student: "Élève",
  moderator: "Modérateur",
  admin: "Administrateur",
};
