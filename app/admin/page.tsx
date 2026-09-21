"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ContributionRepository } from "@/lib/repositories/contribution-repository";
import type { Contribution } from "@/types";

export default function AdminPage() {
  const { role, profile } = useAuth();
  const [items, setItems] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const schoolId = profile?.activeSchoolIds[0];
      if (!schoolId || role !== "admin") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const all = await new ContributionRepository(schoolId).list();
        if (!cancelled) {
          setItems(
            all.filter(
              (item) => item.status === "pending" || item.status === "under_review",
            ),
          );
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Impossible de charger les contributions.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void refresh();
    return () => {
      cancelled = true;
    };
  }, [profile?.activeSchoolIds, role]);

  async function review(item: Contribution, status: "approved" | "rejected") {
    const schoolId = profile?.activeSchoolIds[0];
    if (!schoolId || role !== "admin") return;

    try {
      const reviewerId = profile?.id || "";
      if (status === "approved") {
        await new ContributionRepository(schoolId).approve(item, reviewerId);
      } else {
        await new ContributionRepository(schoolId).update(item.id, {
          status,
          reviewedAt: new Date().toISOString(),
          reviewedBy: reviewerId,
          updatedAt: new Date().toISOString(),
          updatedBy: reviewerId,
        });
      }
      setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La modification a échoué.");
    }
  }

  if (role !== "admin") {
    return (
      <AppShell>
        <div className="page-content">
          <p className="section-label">Administration</p>
          <h2 className="page-title">Accès refusé</h2>
          <p className="page-description">Cette zone est réservée aux administrateurs C-Cool.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">C-Cool Admin</p>
        <h2 className="page-title">Administration</h2>
        <p className="page-description">
          Contrôle du contenu officiel, des contributions et de la vie de la classe.
        </p>

        <section className="section">
          <div className="settings-section-title">Contributions à traiter</div>

          {loading ? <p>Chargement…</p> : null}
          {error ? <p className="auth-error">{error}</p> : null}

          {!loading && !error && items.length === 0 ? (
            <p>Aucune contribution en attente.</p>
          ) : null}

          <div className="moderation-list">
            {items.map((item) => (
              <article className="moderation-row" key={item.id}>
                <div>
                  <span className="todo-subject">{item.kind}</span>
                  <strong>{item.title}</strong>
                  <p>{item.content}</p>
                  <p>Proposé par {item.authorId}</p>
                </div>
                <div className="moderation-actions">
                  <button type="button" onClick={() => void review(item, "approved")}>
                    Valider
                  </button>
                  <button type="button" onClick={() => void review(item, "rejected")}>
                    Rejeter
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="settings-section-title">Prochaines briques</div>
          <p>
            Gestion des cours, exercices, évaluations, membres et paramètres de classe.
            Cette zone utilisera les mêmes contrôles d&apos;accès administrateur.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
