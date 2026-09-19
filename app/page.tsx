"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import type { EcoleDirecteHomeworkIndex, EcoleDirecteScheduleItem } from "@/lib/ecoledirecte/types";

export default function Home() {
  const [schedule, setSchedule] = useState<EcoleDirecteScheduleItem[]>([]);
  const [homework, setHomework] = useState<EcoleDirecteHomeworkIndex>({});
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const end = new Date(today);
    end.setDate(end.getDate() + 7);
    void Promise.all([
      fetch(`/api/ecoledirecte/session?kind=schedule&start=${iso(today)}&end=${iso(end)}`).then((r) => r.ok ? r.json() : null),
      fetch("/api/ecoledirecte/session?kind=homework").then((r) => r.ok ? r.json() : null),
    ]).then(([scheduleData, homeworkData]) => {
      if (Array.isArray(scheduleData?.data)) setSchedule(scheduleData.data);
      if (homeworkData?.data && typeof homeworkData.data === "object" && !Array.isArray(homeworkData.data)) setHomework(homeworkData.data);
      if (!scheduleData && !homeworkData) {
        setSessionError("La session École Directe a expiré. Reconnecte-toi pour actualiser tes données.");
      } else if (scheduleData?.error || homeworkData?.error) {
        setSessionError(scheduleData?.error || homeworkData?.error || "École Directe est momentanément indisponible.");
      }
    });
  }, []);

  const upcomingHomework = Object.entries(homework)
    .flatMap(([date, items]) => items.map((item) => ({ date, item })))
    .filter(({ item }) => !item.effectue)
    .slice(0, 4);

  const nextClasses = [...schedule]
    .filter((item) => !item.isAnnule)
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .slice(0, 3);

  return (
    <AppShell>
      <div className="page-content">
        <section className="welcome">
          <p className="section-label">Aujourd&apos;hui</p>
          <h2>Bonjour 👋</h2>
          <p>Voici ce qui compte maintenant : tes cours, tes devoirs et tes révisions.</p>
        </section>

        {sessionError && <p className="auth-error" role="alert">{sessionError}</p>}

        <section className="dashboard-grid">
          <Link href="/agenda" className="feature-card">
            <span className="card-icon">◷</span>
            <div><span className="card-label">Agenda</span><strong>Voir ma journée</strong><p>Emploi du temps École Directe.</p></div>
            <span className="arrow">→</span>
          </Link>
          <Link href="/revisions" className="feature-card">
            <span className="card-icon">↻</span>
            <div><span className="card-label">Révisions</span><strong>Continuer mes révisions</strong><p>Planning adapté à ta progression.</p></div>
            <span className="arrow">→</span>
          </Link>
          <Link href="/calcul-mental" className="feature-card">
            <span className="card-icon">∑</span>
            <div><span className="card-label">Calcul mental</span><strong>S&apos;entraîner</strong><p>Calculs et vitesse de réponse.</p></div>
            <span className="arrow">→</span>
          </Link>
        </section>

        <section className="section">
          <div className="section-heading"><div><p className="section-label">Prochainement</p><h2>À faire</h2></div><Link href="/devoirs">Tous les devoirs →</Link></div>
          <div className="todo-list">
            {upcomingHomework.length === 0 && <p className="page-description">Aucun devoir non effectué signalé.</p>}
            {upcomingHomework.map(({ date, item }) => (
              <div className="todo-item" key={item.idDevoir}>
                <span className="todo-dot" />
                <div><span className="todo-subject">{item.matiere || item.codeMatiere || "Matière"}</span><strong>{item.interrogation ? "Interrogation" : "Travail à faire"}</strong><p>{new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading"><div><p className="section-label">Cours à venir</p><h2>Prochains cours</h2></div><Link href="/agenda">Agenda →</Link></div>
          <div className="todo-list">
            {nextClasses.map((item) => (
              <div className="todo-item" key={item.id}>
                <span className="todo-dot" />
                <div><span className="todo-subject">{item.matiere || item.text}</span><strong>{new Date(item.start_date.replace(" ", "T")).toLocaleDateString("fr-FR", { weekday: "long" })} · {item.start_date.slice(11,16)}</strong><p>{item.salle || "Salle non précisée"}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
