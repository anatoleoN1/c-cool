"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { AssessmentRepository, ChapterRepository } from "@/lib/repositories/learning-repository";
import { ProgressRepository } from "@/lib/repositories/progress-repository";
import { generateAdaptiveRevisionPlan, type PlannedRevisionSession } from "@/lib/algorithms/revision-planner";
import type { Assessment, Chapter, Progress } from "@/types";

export default function RevisionsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [now] = useState(() => Date.now());
  const loading = authLoading || (!!profile && dataLoading);

  useEffect(() => {
    const schoolId = profile?.activeSchoolIds[0];
    if (!schoolId || !user) return;
    let cancelled = false;
    void Promise.all([
      new AssessmentRepository(schoolId).listPublished(),
      new ChapterRepository(schoolId).listPublished(),
      new ProgressRepository(user.uid).listChapterProgress(),
    ]).then(([assessmentItems, chapterItems, progressItems]) => {
      if (cancelled) return;
      const upcoming = assessmentItems.filter((item) => new Date(item.date).getTime() >= now);
      setAssessments(upcoming);
      setChapters(chapterItems);
      setProgress(progressItems);
      setSelectedId((current) => current || upcoming[0]?.id || "");
    }).finally(() => {
      if (!cancelled) setDataLoading(false);
    });
    return () => { cancelled = true; };
  }, [profile?.activeSchoolIds, user, now]);

  const selected = useMemo(() => assessments.find((item) => item.id === selectedId) ?? null, [assessments, selectedId]);
  const sessions = useMemo<PlannedRevisionSession[]>(
    () => selected ? generateAdaptiveRevisionPlan(selected, chapters, progress) : [],
    [selected, chapters, progress],
  );

  async function savePlan() {
    if (!user || !profile?.activeSchoolIds[0] || !selected) return;
    const currentTime = new Date().toISOString();
    await new ProgressRepository(user.uid).saveRevisionPlan({
      userId: user.uid, schoolId: profile.activeSchoolIds[0], assessmentId: selected.id,
      generatedFor: currentTime, sessions, status: "active",
      createdAt: currentTime, updatedAt: currentTime, createdBy: user.uid, updatedBy: user.uid,
    });
    setSaved(true);
  }

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Préparation</p><h2 className="page-title">Révisions</h2>
        <p className="page-description">C-Cool répartit automatiquement les séances selon la date du contrôle, sa difficulté et les chapitres que tu maîtrises le moins.</p>
        {loading ? <p className="page-description">Analyse de ta progression…</p> : !assessments.length ? (
          <section className="section empty-state"><strong>Aucune évaluation à venir.</strong><p>Le planning adaptatif se générera dès qu&apos;une évaluation sera publiée.</p></section>
        ) : (
          <>
            <section className="section"><label className="mental-select"><span className="mental-label">Évaluation</span>
              <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                {assessments.map((assessment) => <option key={assessment.id} value={assessment.id}>{assessment.title} · {new Date(assessment.date).toLocaleDateString("fr-FR")}</option>)}
              </select>
            </label></section>
            <section className="section revision-plan">
              {sessions.map((session, index) => {
                const chapter = chapters.find((item) => item.id === session.chapterId);
                return <article className="revision-step" key={`${session.date}-${session.chapterId}`}>
                  <span className="revision-number">{index + 1}</span><div>
                    <span className="todo-subject">{new Date(`${session.date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span>
                    <strong>{chapter?.title || "Chapitre"}</strong>
                    <p>{session.reason} · {session.durationMinutes} min · priorité {session.priority}</p>
                  </div>
                </article>;
              })}
            </section>
            <button type="button" className="auth-submit" onClick={() => void savePlan()}>{saved ? "Planning enregistré ✓" : "Enregistrer mon planning"}</button>
          </>
        )}
      </div>
    </AppShell>
  );
}
