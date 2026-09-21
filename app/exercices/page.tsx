"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ExerciseRepository } from "@/lib/repositories/learning-repository";
import type { Exercise } from "@/types";
import PublishedContributionList from "@/components/contributions/PublishedContributionList";

export default function ExercicesPage() {
  const { profile, loading: authLoading } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const loading = authLoading || (!!profile && dataLoading);

  useEffect(() => {
    const schoolId = profile?.activeSchoolIds[0];
    if (!schoolId) return;
    let cancelled = false;
    void new ExerciseRepository(schoolId).listPublished()
      .then((items) => { if (!cancelled) setExercises(items); })
      .finally(() => { if (!cancelled) setDataLoading(false); });
    return () => { cancelled = true; };
  }, [profile?.activeSchoolIds]);

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Entraînement</p><h2 className="page-title">Exercices</h2>
        <p className="page-description">Des exercices publiés par matière pour passer de la compréhension à la maîtrise.</p>
        <section className="section exercise-list" aria-live="polite">
          {loading && <p className="page-description">Chargement des exercices…</p>}
          {!loading && exercises.length === 0 && (
            <div className="empty-state"><strong>Aucun exercice publié pour le moment.</strong><p>Les exercices apparaîtront ici après publication par l’administration.</p></div>
          )}
          {exercises.map((exercise) => (
            <article className="exercise-row" key={exercise.id}>
              <div><span className="todo-subject">{exercise.subjectId}</span><strong>{exercise.title}</strong><p>{exercise.prompt.slice(0, 140)}</p></div>
              <Link href={`/exercices/${exercise.id}`} className="text-button">Ouvrir →</Link>
            </article>
          ))}
        </section>
        <PublishedContributionList schoolId={profile?.activeSchoolIds[0]} kinds={["exercise", "correction"]} title="Exercices et corrections proposés par la classe" />
      </div>
    </AppShell>
  );
}
