"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ChapterRepository, CourseRepository, SubjectRepository } from "@/lib/repositories/learning-repository";
import { ProgressRepository } from "@/lib/repositories/progress-repository";
import type { Chapter, Course, Progress, Subject } from "@/types";

export default function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { user, profile } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { subjectId } = await params;
      const schoolId = profile?.activeSchoolIds[0];
      if (!schoolId || !user) { setLoading(false); return; }
      try {
        const subjectRepository = new SubjectRepository(schoolId);
        const chapterRepository = new ChapterRepository(schoolId);
        const courseRepository = new CourseRepository(schoolId);
        const progressRepository = new ProgressRepository(user.uid);
        const [subjects, chapterItems, courseItems, progressItems] = await Promise.all([
          subjectRepository.listPublished(),
          chapterRepository.listPublishedForSubject(subjectId),
          courseRepository.listPublished(),
          progressRepository.listChapterProgress(),
        ]);
        if (cancelled) return;
        setSubject(subjects.find((item) => item.id === subjectId) ?? null);
        setChapters(chapterItems);
        setCourses(courseItems.filter((item) => item.chapterIds.some((id) => chapterItems.some((chapter) => chapter.id === id))));
        setProgress(Object.fromEntries(progressItems.map((item) => [item.chapterId, item])));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [params, profile?.activeSchoolIds, user]);

  async function setMastery(chapter: Chapter, masteryScore: number) {
    if (!user || !profile?.activeSchoolIds[0]) return;
    setSaving(chapter.id);
    const previous = progress[chapter.id];
    const attempts = (previous?.attempts ?? 0) + 1;
    const successRate = ((previous?.successRate ?? 0) * (attempts - 1) + (masteryScore >= 0.7 ? 1 : 0)) / attempts;
    const now = new Date().toISOString();
    const next: Progress = {
      userId: user.uid,
      schoolId: profile.activeSchoolIds[0],
      chapterId: chapter.id,
      masteryScore,
      attempts,
      successRate,
      averageResponseTimeMs: previous?.averageResponseTimeMs ?? 0,
      weak: masteryScore < 0.6,
      lastPracticedAt: now,
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
      createdBy: previous?.createdBy ?? user.uid,
      updatedBy: user.uid,
    };
    try {
      await new ProgressRepository(user.uid).upsertChapterProgress(chapter.id, next);
      setProgress((current) => ({ ...current, [chapter.id]: next }));
    } finally {
      setSaving(null);
    }
  }

  return (
    <AppShell>
      <div className="page-content">
        <Link href="/cours" className="text-button">← Toutes les matières</Link>
        {loading ? (
          <p className="page-description">Chargement du cours…</p>
        ) : !subject ? (
          <section className="section empty-state"><strong>Matière introuvable.</strong><p>Cette matière n’est pas publiée pour ton établissement.</p></section>
        ) : (
          <>
            <p className="section-label">Cours</p>
            <h2 className="page-title">{subject.name}</h2>
            <p className="page-description">Chapitres, ressources et niveau de maîtrise.</p>

            <section className="section course-list">
              {chapters.map((chapter) => {
                const chapterCourses = courses.filter((course) => course.chapterIds.includes(chapter.id));
                const current = progress[chapter.id];
                return (
                  <article className="course-row" key={chapter.id}>
                    <span className="course-mark">{chapter.order}</span>
                    <div>
                      <strong>{chapter.title}</strong>
                      <p>{chapterCourses.length} ressource{chapterCourses.length > 1 ? "s" : ""} · maîtrise {Math.round((current?.masteryScore ?? 0) * 100)}%</p>
                      <div className="mastery-actions">
                        <button type="button" disabled={saving === chapter.id} onClick={() => void setMastery(chapter, 0.9)}>Maîtrisé</button>
                        <button type="button" disabled={saving === chapter.id} onClick={() => void setMastery(chapter, 0.45)}>À revoir</button>
                      </div>
                    </div>
                    <span className="course-count">{chapterCourses.length} →</span>
                  </article>
                );
              })}
              {chapters.length === 0 && <div className="empty-state"><strong>Aucun chapitre publié.</strong><p>Le contenu apparaîtra ici après publication.</p></div>}
            </section>

            {courses.length > 0 && (
              <section className="section">
                <p className="section-label">Ressources</p>
                <div className="course-list">
                  {courses.map((course) => (
                    <article className="course-row" key={course.id}>
                      <span className="course-mark">C</span>
                      <div><strong>{course.title}</strong><p>{course.content ? course.content.slice(0, 120) : "Ressource de cours"}</p></div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
