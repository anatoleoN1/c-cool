import type { AuditFields, Provenance } from "./common";

export interface Subject extends AuditFields {
  id: string;
  schoolId: string;
  name: string;
  color?: string;
  published: boolean;
}

export interface Chapter extends AuditFields {
  id: string;
  schoolId: string;
  subjectId: string;
  title: string;
  order: number;
  published: boolean;
}

export interface Course extends AuditFields, Provenance {
  id: string;
  schoolId: string;
  subjectId: string;
  chapterIds: string[];
  title: string;
  content?: string;
  resourceIds: string[];
  published: boolean;
}

export interface ExerciseScope {
  exerciseNumber?: string;
  includedParts?: string[];
  excludedParts?: string[];
  freeText?: string;
}

export interface Homework extends AuditFields, Provenance {
  id: string;
  schoolId: string;
  subjectId?: string;
  chapterIds: string[];
  title: string;
  description?: string;
  dueAt?: string;
  scope?: ExerciseScope;
  published: boolean;
}

export interface Assessment extends AuditFields, Provenance {
  id: string;
  schoolId: string;
  subjectId: string;
  chapterIds: string[];
  title: string;
  date: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  published: boolean;
}

export interface Exercise extends AuditFields, Provenance {
  id: string;
  schoolId: string;
  subjectId: string;
  chapterIds: string[];
  title: string;
  prompt: string;
  scope?: ExerciseScope;
  published: boolean;
}

export interface Correction extends AuditFields, Provenance {
  id: string;
  schoolId: string;
  exerciseId: string;
  content: string;
  authorRole: "student" | "moderator" | "admin" | "teacher";
  verificationStatus: "unverified" | "verified";
  confidence: number;
  published: boolean;
}
