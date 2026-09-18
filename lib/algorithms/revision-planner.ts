import type { Assessment, Chapter } from "@/types";
import type { Progress } from "@/types";

export type PlannedRevisionSession = {
  date: string;
  chapterId: string;
  durationMinutes: number;
  priority: "low" | "medium" | "high";
  reason: string;
};

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function generateAdaptiveRevisionPlan(
  assessment: Assessment,
  chapters: Chapter[],
  progress: Progress[],
  today = new Date(),
): PlannedRevisionSession[] {
  const chapterMap = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  const progressMap = new Map(progress.map((item) => [item.chapterId, item]));

  const targets = assessment.chapterIds
    .map((id) => chapterMap.get(id))
    .filter((chapter): chapter is Chapter => Boolean(chapter))
    .map((chapter) => {
      const item = progressMap.get(chapter.id);
      const mastery = item?.masteryScore ?? 0.35;
      const attempts = item?.attempts ?? 0;
      const weakness = Math.max(0, 1 - mastery);
      const confidencePenalty = attempts < 2 ? 0.2 : 0;
      return { chapter, score: weakness + confidencePenalty };
    })
    .sort((a, b) => b.score - a.score);

  if (!targets.length) return [];

  const examDate = new Date(assessment.date);
  examDate.setHours(12, 0, 0, 0);
  const dayBefore = addDays(examDate, -1);
  const start = new Date(Math.max(today.getTime(), addDays(examDate, -7).getTime()));
  start.setHours(12, 0, 0, 0);

  const sessions: PlannedRevisionSession[] = [];
  const days: Array<{ offset: number; label: string; duration: number }> = [
    { offset: -7, label: "Relecture", duration: 20 },
    { offset: -6, label: "Mémorisation", duration: 20 },
    { offset: -5, label: "Mémorisation", duration: 20 },
    { offset: -4, label: "Entraînement", duration: 25 },
    { offset: -3, label: "Entraînement", duration: 25 },
    { offset: -2, label: "Exercices", duration: 35 },
    { offset: -1, label: "Simulation", duration: 30 },
  ];

  for (const day of days) {
    const date = addDays(examDate, day.offset);
    if (date < start || date >= examDate) continue;

    const target = targets[(day.offset + 7) % targets.length];
    const isHigh = target.score >= 0.75 || assessment.difficulty >= 4;
    sessions.push({
      date: isoDate(date),
      chapterId: target.chapter.id,
      durationMinutes: day.duration + (isHigh ? 5 : 0),
      priority: isHigh ? "high" : target.score >= 0.45 ? "medium" : "low",
      reason: `${day.label} · ${target.chapter.title}`,
    });
  }

  const last = sessions[sessions.length - 1];
  if (last && last.date !== isoDate(dayBefore)) {
    const target = targets[0];
    sessions.push({
      date: isoDate(dayBefore),
      chapterId: target.chapter.id,
      durationMinutes: 30,
      priority: "high",
      reason: `Simulation finale · ${target.chapter.title}`,
    });
  }

  return sessions.sort((a, b) => a.date.localeCompare(b.date));
}
