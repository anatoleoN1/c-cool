export type UserRole = "student" | "moderator" | "admin";
export type DataSource = "ecole_directe" | "admin" | "approved_student" | "teacher";
export type ISODateString = string;

export interface AuditFields {
  createdAt: ISODateString;
  updatedAt: ISODateString;
  createdBy: string;
  updatedBy: string;
}

export interface Provenance {
  source: DataSource;
  sourceRef?: string;
  verifiedAt?: ISODateString;
  verifiedBy?: string;
}
