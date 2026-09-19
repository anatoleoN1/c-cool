"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import type { EcoleDirecteHomeworkIndex } from "@/lib/ecoledirecte/types";

export default function DevoirsPage() {
  const { profile } = useAuth();
  const [homework, setHomework] = useState<EcoleDirecteHomeworkIndex>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/ecoledirecte/session?kind=homework")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossible de récupérer les devoirs.");
        if (!data.data || typeof data.data !== "object" || Array.isArray(data.data)) throw new Error("La session ÉcoleDirecte a expiré. Reconnecte-toi.");
        return data.data as EcoleDirecteHomeworkIndex;
      })
      .then((data) => setHomework(data || {}))
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Devoirs indisponibles."))
      .finally(() => setLoading(false));
  }, []);

  const dates = Object.keys(homework).sort();

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Travail</p>
        <h2 className="page-title">Devoirs</h2>
        <p className="page-description">Les devoirs à faire récupérés depuis École Directe.</p>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <section className="section exercise-list">
          {loading && <p className="page-description">Chargement des devoirs…</p>}
          {!loading && !dates.length && <div className="empty-state"><strong>Aucun devoir à faire.</strong><p>École Directe ne signale actuellement aucun travail à venir.</p></div>}
          {dates.map((date) => (
            <div key={date}>
              <p className="section-label">{new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
              {homework[date].filter((item) => profile?.preferences?.showCompletedHomework || !item.effectue).map((item) => (
                <article className="exercise-row" key={item.idDevoir}>
                  <div>
                    <span className="todo-subject">{item.matiere || item.codeMatiere || "Matière"}</span>
                    <strong>{item.interrogation ? "Interrogation" : "Travail à faire"}</strong>
                    <p>{item.rendreEnLigne ? "À rendre en ligne" : item.documentsAFaire ? "Document à préparer" : "Voir le détail du devoir"}</p>
                  </div>
                  <span className="exercise-time">{item.effectue ? "Fait" : "À faire"}</span>
                </article>
              ))}
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
