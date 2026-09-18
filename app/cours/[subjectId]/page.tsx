"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ChapterRepository, CourseRepository, SubjectRepository } from "@/lib/repositories/learning-repository";
import type { Chapter, Course, Subject } from "@/types";

export default function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { profile } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { subjectId } = await params;
      const schoolId = profile?.activeSchoolIds[0];
      if (!schoolId) {
        setLoading(false);
        return;
      }

      try {
        const subjectRepository = new SubjectRepository(schoolId);
        const chapterRepository = new ChapterRepository(schoolId);
        const courseRepository = new CourseRepository(schoolId);

        const [subjects, chapterItems, courseItems] = await Promise.all([
          subjectRepository.listPublished(),
          chapterRepository.listPublishedForSubject(subjectId),
          courseRepository.listPublished(),
        ]);

        if (cancelled) return;
        setSubject(subjects.find((item) => item.id === subjectId) ?? null);
        setChapters(chapterItems);
        setCourses(courseItems.filter((item) => item.chapterIds.some((id) => chapterItems.some((chapter) => chapter.id === id))));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [params, profile?.activeSchoolIds]);

  return (
    <AppShell>
      <div className="page-content">
        <Link href="/cours" className="text-button">← Toutes les matières</Link>
        {loading ? (
          <p className="page-description">Chargement du cours…</p>
        ) : !subject ? (
          <section className="section empty-state">
            <strong>Matière introuvable.</strong>
            <p>Cette matière n’est pas publiée pour ton établissement.</p>
          </section>
        ) : (
          <>
            <p className="section-label">Cours</p>
            <h2 className="page-title">{subject.name}</h2>
            <p className="page-description">Chapitres et ressources disponibles dans cette matière.</p>

            <section className="section course-list">
              {chapters.map((chapter) => {
                const chapterCourses = courses.filter((course) => course.chapterIds.includes(chapter.id));
                return (
                  <article className="course-row" key={chapter.id}>
                    <span className="course-mark">{chapter.order}</span>
                    <div>
                      <strong>{chapter.title}</strong>
                      <p>{chapterCourses.length} ressource{chapterCourses.length > 1 ? "s" : ""} de cours publiée{chapterCourses.length > 1 ? "s" : ""}</p>
                    </div>
                    <span className="course-count">{chapterCourses.length} →</span>
                  </article>
                );
              })}
              {chapters.length === 0 && (
                <div className="empty-state">
                  <strong>Aucun chapitre publié.</strong>
                  <p>Le contenu apparaîtra ici après publication par l’administration.</p>
                </div>
              )}
            </section>

            {courses.length > 0 && (
              <section className="section">
                <p className="section-label">Ressources</p>
                <div className="course-list">
                  {courses.map((course) => (
                    <article className="course-row" key={course.id}>
                      <span className="course-mark">C</span>
                      <div>
                        <strong>{course.title}</strong>
                        <p>{course.content ? course.content.slice(0, 120) : "Ressource de cours"}</p>
                      </div>
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
