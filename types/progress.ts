import type { AuditFields } from "./common";

export interface Progress extends AuditFields {
  userId: string;
  schoolId: string;
  chapterId: string;
  masteryScore: number;
  attempts: number;
  successRate: number;
  averageResponseTimeMs: number;
  weak: boolean;
  lastPracticedAt?: string;
}

export interface RevisionPlan extends AuditFields {
  id: string;
  userId: string;
  schoolId: string;
  assessmentId: string;
  generatedFor: string;
  sessions: RevisionSession[];
  status: "active" | "completed" | "archived";
}

export interface RevisionSession {
  date: string;
  chapterId: string;
  durationMinutes: number;
  priority: "low" | "medium" | "high";
  reason: string;
}

export interface MentalMathAttempt extends AuditFields {
  id: string;
  userId: string;
  schoolId: string;
  operation: "addition" | "subtraction" | "multiplication" | "division";
  format: "direct" | "missing_factor" | "missing_operand" | "inverse_division";
  difficulty: number;
  question: string;
  answer: string;
  expectedAnswer: string;
  correct: boolean;
  responseTimeMs: number;
  timed: boolean;
}
