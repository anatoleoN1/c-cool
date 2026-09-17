import type { AuditFields } from "./common";
import type { ExerciseScope } from "./learning";

export type ContributionKind = "homework" | "schedule_change" | "correction" | "course_note" | "method";
export type ContributionStatus = "pending" | "under_review" | "approved" | "rejected" | "merged";

export interface Contribution extends AuditFields {
  id: string;
  schoolId: string;
  authorId: string;
  kind: ContributionKind;
  title: string;
  content: string;
  subjectId?: string;
  chapterIds: string[];
  scope?: ExerciseScope;
  status: ContributionStatus;
  normalizedText: string;
  similarityClusterId?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  officialRecordRef?: string;
}
