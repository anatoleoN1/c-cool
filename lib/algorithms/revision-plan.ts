import type { RevisionSession } from "@/types";

export interface RevisionPlanInput {
  assessmentDate: string;
  chapterIds: string[];
  difficulty: number;
  weakChapterIds: string[];
  today?: string;
}

export function generateRevisionSessions(input: RevisionPlanInput): RevisionSession[] {
  const today = new Date(`${input.today ?? new Date().toISOString().slice(0, 10)}T12:00:00`);
  const assessment = new Date(`${input.assessmentDate}T12:00:00`);
  const days = Math.max(1, Math.ceil((assessment.getTime() - today.getTime()) / 86_400_000));
  const sessions: RevisionSession[] = [];
  const chapters = input.chapterIds.length ? input.chapterIds : input.weakChapterIds;

  chapters.forEach((chapterId, index) => {
    const weak = input.weakChapterIds.includes(chapterId);
    const offset = Math.min(days - 1, Math.max(0, Math.floor((index * days) / Math.max(1, chapters.length))));
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    sessions.push({
      date: date.toISOString().slice(0, 10),
      chapterId,
      durationMinutes: 20 + input.difficulty * 5 + (weak ? 10 : 0),
      priority: weak ? "high" : input.difficulty >= 4 ? "medium" : "low",
      reason: weak ? "Notion à consolider" : "Préparation de l'évaluation",
    });
  });
  return sessions.sort((a, b) => a.date.localeCompare(b.date));
}
