import type { AuditFields, UserRole } from "./common";

export interface User extends AuditFields {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  activeSchoolIds: string[];
  photoURL?: string;
}

export interface School extends AuditFields {
  id: string;
  name: string;
  slug: string;
  published: boolean;
}

export interface Member extends AuditFields {
  userId: string;
  schoolId: string;
  role: UserRole;
  status: "active" | "invited" | "suspended";
  classIds: string[];
}
