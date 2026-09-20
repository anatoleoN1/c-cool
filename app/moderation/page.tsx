"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ContributionRepository } from "@/lib/repositories/contribution-repository";
import type { Contribution } from "@/types";

export default function ModerationPage() {
  const { role, profile } = useAuth();
  const [pending, setPending] = useState<Contribution[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const schoolId = profile?.activeSchoolIds[0];
      if (!schoolId || (role !== "moderator" && role !== "admin")) return;

      try {
        const contributions = await new ContributionRepository(schoolId).list();
        if (!cancelled) {
          setPending(
            contributions.filter(
              (item) => item.status === "pending" || item.status === "under_review",
            ),
          );
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Impossible de charger la file de modération.",
          );
        }
      }
    }

    void refresh();
    return () => {
      cancelled = true;
    };
  }, [profile?.activeSchoolIds, role]);

  async function review(item: Contribution, status: "approved" | "rejected") {
    const schoolId = profile?.activeSchoolIds[0];
    if (!schoolId) return;

    try {
      await new ContributionRepository(schoolId).update(item.id, {
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: profile?.id || "",
        updatedAt: new Date().toISOString(),
        updatedBy: profile?.id || "",
      });
      setPending((current) => current.filter((candidate) => candidate.id !== item.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La décision n'a pas été enregistrée.");
    }
  }

  if (role !== "moderator" && role !== "admin") {
    return (
      <AppShell>
        <div className="page-content">
          <p className="section-label">Administration</p>
          <h2 className="page-title">Accès refusé</h2>
          <p className="page-description">
            Cette zone est réservée aux modérateurs et administrateurs C-Cool.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Administration</p>
        <h2 className="page-title">Modération</h2>
        <p className="page-description">
          Les contributions des élèves restent en attente jusqu’à leur validation.
        </p>

        {error ? <p className="auth-error">{error}</p> : null}

        <section className="section moderation-list">
          {pending.length === 0 && !error ? (
            <p>Aucune contribution en attente.</p>
          ) : null}

          {pending.map((item) => (
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
        </section>
      </div>
    </AppShell>
  );
}
