"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { AssessmentRepository } from "@/lib/repositories/learning-repository";
import type { Assessment } from "@/types";

export default function EvaluationsPage() {
  const { profile, loading: authLoading } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [now] = useState(() => Date.now());
  const loading = authLoading || (!!profile && dataLoading);

  useEffect(() => {
    const schoolId = profile?.activeSchoolIds[0];
    if (!schoolId) return;
    let cancelled = false;
    void new AssessmentRepository(schoolId).listPublished()
      .then((items) => { if (!cancelled) setAssessments(items); })
      .finally(() => { if (!cancelled) setDataLoading(false); });
    return () => { cancelled = true; };
  }, [profile?.activeSchoolIds]);

  const upcoming = assessments.filter((item) => new Date(item.date).getTime() >= now);

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Organisation</p>
        <h2 className="page-title">Évaluations</h2>
        <p className="page-description">Contrôles et évaluations publiés pour ton établissement.</p>
        <section className="section exercise-list">
          {loading && <p className="page-description">Chargement des évaluations…</p>}
          {!loading && upcoming.length === 0 && (
            <div className="empty-state"><strong>Aucune évaluation à venir.</strong><p>Les contrôles apparaîtront ici dès leur publication.</p></div>
          )}
          {upcoming.map((assessment) => (
            <article className="exercise-row" key={assessment.id}>
              <div><span className="todo-subject">{assessment.subjectId}</span><strong>{assessment.title}</strong>
                <p>{new Date(assessment.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
              </div>
              <span className="exercise-time">Difficulté {assessment.difficulty}/5</span>
              <span className="text-button">Réviser →</span>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
