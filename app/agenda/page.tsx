"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import type { EcoleDirecteScheduleItem } from "@/lib/ecoledirecte/types";
import PublishedContributionList from "@/components/contributions/PublishedContributionList";
import { useAuth } from "@/components/auth/AuthProvider";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(12, 0, 0, 0);
  return d;
}
function iso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function label(date: Date) {
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

export default function AgendaPage() {
  const { profile } = useAuth();
  const [week, setWeek] = useState(() => startOfWeek(new Date()));
  const [items, setItems] = useState<EcoleDirecteScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const end = new Date(week);
    end.setDate(end.getDate() + 6);
    void fetch(`/api/ecoledirecte/session?kind=schedule&start=${iso(week)}&end=${iso(end)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossible de récupérer l’agenda.");
        if (!Array.isArray(data.data)) throw new Error("La session ÉcoleDirecte a expiré. Reconnecte-toi.");
        return data.data as EcoleDirecteScheduleItem[];
      })
      .then((data) => { if (!cancelled) { setItems(data || []); setError(null); } })
      .catch((caught) => { if (!cancelled) setError(caught instanceof Error ? caught.message : "Agenda indisponible."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [week]);

  const days = useMemo(() => Array.from({ length: 5 }, (_, index) => {
    const date = new Date(week);
    date.setDate(date.getDate() + index);
    const dateKey = iso(date);
    return {
      date,
      dateKey,
      items: items.filter((item) => item.start_date.slice(0, 10) === dateKey)
        .sort((a, b) => a.start_date.localeCompare(b.start_date)),
    };
  }), [items, week]);

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Organisation</p>
        <div className="page-heading-row">
          <div>
            <h2 className="page-title">Agenda</h2>
            <p className="page-description">Ton emploi du temps réel depuis École Directe.</p>
          </div>
          <div className="agenda-controls">
            <button className="text-button" onClick={() => setWeek((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}>←</button>
            <strong>{week.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</strong>
            <button className="text-button" onClick={() => setWeek((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}>→</button>
          </div>
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}
        <section className="section agenda-grid">
          {loading ? <p className="page-description">Chargement de l’emploi du temps…</p> : days.map((day) => (
            <article className="agenda-day" key={day.dateKey}>
              <header><span>{label(day.date)}</span><strong>{day.date.getDate()}</strong></header>
              <div>
                {day.items.length === 0 && <p className="page-description">Aucun cours</p>}
                {day.items.map((item) => (
                  <div className="agenda-event" key={item.id}>
                    <span className="agenda-time">{item.start_date.slice(11, 16)}</span>
                    <div>
                      <strong>{item.matiere || item.text || "Cours"}</strong>
                      <p>{item.salle || "Salle non précisée"}{item.prof ? ` · ${item.prof}` : ""}</p>
                      {item.isAnnule && <span className="todo-subject">Annulé</span>}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
        <PublishedContributionList schoolId={profile?.activeSchoolIds[0]} kinds={["schedule_change"]} title="Modifications proposées par la classe" />
      </div>
    </AppShell>
  );
}
