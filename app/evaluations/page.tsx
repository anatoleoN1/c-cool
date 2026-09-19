"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { AssessmentRepository } from "@/lib/repositories/learning-repository";
import type { Assessment } from "@/types";
import type { EcoleDirecteHomeworkIndex } from "@/lib/ecoledirecte/types";

type EvaluationItem = {
  id: string;
  subject: string;
  title: string;
  date: string;
  source: "C-Cool" | "École Directe";
};

export default function EvaluationsPage() {
  const { profile, loading: authLoading } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [edEvaluations, setEdEvaluations] = useState<EvaluationItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    const schoolId = profile?.activeSchoolIds[0];
    if (!schoolId) return;

    let cancelled = false;

    void Promise.all([
      new AssessmentRepository(schoolId).listPublished(),
      fetch("/api/ecoledirecte/session?kind=homework").then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Les interrogations École Directe sont momentanément indisponibles.");
        return data.data as EcoleDirecteHomeworkIndex;
      }),
    ])
      .then(([cCoolItems, homework]) => {
        if (cancelled) return;

        setAssessments(cCoolItems);

        const items: EvaluationItem[] = Object.entries(homework || {}).flatMap(([date, entries]) =>
          entries
            .filter((entry) => entry.interrogation === true)
            .map((entry) => ({
              id: `ed-${entry.idDevoir}-${date}`,
              subject: entry.matiere || entry.codeMatiere || "Matière",
              title: "Interrogation",
              date,
              source: "École Directe",
            })),
        );

        setEdEvaluations(items);
        setError(null);
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Impossible de charger les évaluations.");
        }
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => { cancelled = true; };
  }, [profile?.activeSchoolIds]);

  const upcoming = useMemo<EvaluationItem[]>(() => {
    const cCool = assessments.map((item) => ({
      id: `ccool-${item.id}`,
      subject: item.subjectId,
      title: item.title,
      date: item.date,
      source: "C-Cool" as const,
    }));

    return [...cCool, ...edEvaluations]
      .filter((item) => new Date(item.date).getTime() >= now)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [assessments, edEvaluations, now]);

  const loading = authLoading || dataLoading;

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Organisation</p>
        <h2 className="page-title">Évaluations</h2>
        <p className="page-description">
          Les évaluations C-Cool et les interrogations signalées par École Directe.
        </p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
            <p className="page-description" style={{ marginTop: 6 }}>
              Les évaluations C-Cool restent accessibles même si École Directe est momentanément indisponible.
            </p>
          </div>
        )}

        <section className="section exercise-list">
          {loading && <p className="page-description">Chargement des évaluations…</p>}
          {!loading && upcoming.length === 0 && (
            <div className="empty-state">
              <strong>Aucune évaluation à venir.</strong>
              <p>Une interrogation apparaîtra ici lorsqu&apos;elle sera signalée par École Directe ou publiée dans C-Cool.</p>
            </div>
          )}

          {upcoming.map((item) => (
            <article className="exercise-row" key={item.id}>
              <div>
                <span className="todo-subject">{item.subject}</span>
                <strong>{item.title}</strong>
                <p>
                  {new Date(`${item.date}T12:00:00`).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <span className="exercise-time">{item.source}</span>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
