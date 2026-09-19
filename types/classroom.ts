import type { AuditFields } from "./common";

export type ClassMessageKind = "message" | "homework" | "evaluation" | "resource" | "announcement";

export interface ClassMessage extends AuditFields {
  id: string;
  schoolId: string;
  authorId: string;
  authorName: string;
  kind: ClassMessageKind;
  content: string;
  linkHref?: string;
  linkLabel?: string;
}
