"use client";

import { FormEvent, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ContributionRepository } from "@/lib/repositories/contribution-repository";
import type { ContributionKind } from "@/types";

const types: Array<{ label: string; kind: ContributionKind }> = [
  { label: "Devoir manquant", kind: "homework" },
  { label: "Correction", kind: "correction" },
  { label: "Cours / fiche", kind: "course_note" },
  { label: "Exercice", kind: "exercise" },
  { label: "Information d’agenda", kind: "schedule_change" },
  { label: "Autre", kind: "other" },
];

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ContribuerPage() {
  const { user, profile } = useAuth();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !profile?.activeSchoolIds[0]) {
      setError("Ton compte n’est pas encore associé à un établissement.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const details = String(form.get("details") ?? "").trim();
    const kind = String(form.get("type") ?? "homework") as ContributionKind;

    if (!title || !details) return;

    setPending(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const schoolId = profile.activeSchoolIds[0];

      await new ContributionRepository(schoolId).createPending({
        schoolId,
        authorId: user.uid,
        kind,
        title,
        content: details,
        chapterIds: [],
        status: "pending",
        normalizedText: normalize(`${title} ${details}`),
        createdAt: now,
        updatedAt: now,
        createdBy: user.uid,
        updatedBy: user.uid,
      });

      setSent(true);
      event.currentTarget.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La proposition n’a pas pu être envoyée.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Participation</p>
        <h2 className="page-title">Contribuer</h2>
        <p className="page-description">
          Signale une information manquante ou propose une ressource. Rien n’est publié directement : chaque proposition est vérifiée.
        </p>
        <section className="section contribution-form-wrap">
          {sent ? (
            <div className="success-message">
              <strong>Proposition envoyée.</strong>
              <p>Elle est maintenant en attente de vérification.</p>
              <button className="text-button" onClick={() => setSent(false)}>
                Faire une autre proposition →
              </button>
            </div>
          ) : (
            <form className="contribution-form" onSubmit={submit}>
              <label>
                Type
                <select name="type" defaultValue={types[0].kind}>
                  {types.map((type) => <option key={type.kind} value={type.kind}>{type.label}</option>)}
                </select>
              </label>
              <label>
                Titre
                <input name="title" required placeholder="Ex. Exercice 12 de maths" />
              </label>
              <label>
                Détails
                <textarea name="details" required rows={6} placeholder="Décris précisément ce qui doit être ajouté ou corrigé…" />
              </label>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button className="auth-submit" type="submit" disabled={pending}>
                {pending ? "Envoi…" : "Envoyer pour vérification"}
              </button>
            </form>
          )}
        </section>
      </div>
    </AppShell>
  );
}
