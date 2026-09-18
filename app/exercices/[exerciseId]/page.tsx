"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ExerciseRepository } from "@/lib/repositories/learning-repository";
import type { Exercise } from "@/types";

export default function ExercisePage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { profile } = useAuth();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { exerciseId } = await params;
      const schoolId = profile?.activeSchoolIds[0];
      if (!schoolId) {
        setLoading(false);
        return;
      }
      try {
        const item = await new ExerciseRepository(schoolId).get(exerciseId);
        if (!cancelled) setExercise(item?.published ? item : null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [params, profile?.activeSchoolIds]);

  return (
    <AppShell>
      <div className="page-content">
        <Link href="/exercices" className="text-button">← Tous les exercices</Link>
        {loading ? (
          <p className="page-description">Chargement…</p>
        ) : !exercise ? (
          <section className="section empty-state">
            <strong>Exercice introuvable.</strong>
            <p>Cet exercice n’est pas disponible.</p>
          </section>
        ) : (
          <>
            <p className="section-label">Exercice</p>
            <h2 className="page-title">{exercise.title}</h2>
            <section className="section">
              <p className="page-description">{exercise.prompt}</p>
              {exercise.scope?.freeText && <p className="todo-subject">{exercise.scope.freeText}</p>}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
