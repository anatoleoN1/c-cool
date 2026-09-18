"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ChapterRepository, SubjectRepository } from "@/lib/repositories/learning-repository";
import type { Subject } from "@/types";

export default function CoursPage() {
  const { profile, loading: authLoading } = useAuth();
  const [subjects, setSubjects] = useState<Array<Subject & { chapterCount: number }>>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const loading = authLoading || dataLoading;

  useEffect(() => {
    const schoolId = profile?.activeSchoolIds[0];
    if (!schoolId) return;

    let cancelled = false;
    setDataLoading(true);

    async function load() {
      try {
        const repository = new SubjectRepository(schoolId);
        const chapters = new ChapterRepository(schoolId);
        const items = await repository.listPublished();
        const withCounts = await Promise.all(
          items.map(async (subject) => ({
            ...subject,
            chapterCount: (await chapters.listPublishedForSubject(subject.id)).length,
          })),
        );
        if (!cancelled) {
          setSubjects(withCounts.sort((a, b) => a.name.localeCompare(b.name, "fr")));
        }
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [profile?.activeSchoolIds]);

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Apprentissage</p>
        <h2 className="page-title">Cours</h2>
        <p className="page-description">
          Retrouve rapidement tes chapitres, fiches et ressources de cours.
        </p>

        <section className="section course-list" aria-live="polite">
          {loading && <p className="page-description">Chargement des matières…</p>}
          {!loading && subjects.length === 0 && (
            <div className="empty-state">
              <strong>Aucun cours publié pour le moment.</strong>
              <p>Les matières apparaîtront ici dès qu’elles seront ajoutées à ton établissement.</p>
            </div>
          )}
          {subjects.map((subject) => (
            <Link href={`/cours/${subject.id}`} className="course-row" key={subject.id}>
              <span className="course-mark" style={subject.color ? { background: subject.color } : undefined}>
                {subject.name.slice(0, 1)}
              </span>
              <div>
                <strong>{subject.name}</strong>
                <p>Cours, chapitres et ressources de la matière</p>
              </div>
              <span className="course-count">
                {subject.chapterCount} chapitre{subject.chapterCount > 1 ? "s" : ""} →
              </span>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
