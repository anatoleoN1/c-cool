"use client";

import { useEffect, useState } from "react";
import { PublishedContributionRepository } from "@/lib/repositories/contribution-repository";
import type { Contribution, ContributionKind } from "@/types";

const labels: Record<ContributionKind, string> = {
  homework: "Devoir",
  correction: "Correction",
  course_note: "Cours / fiche",
  exercise: "Exercice",
  schedule_change: "Agenda",
  method: "Méthode",
  other: "Contribution",
};

export default function PublishedContributionList({
  schoolId,
  kinds,
  title = "Contributions de la classe",
}: {
  schoolId?: string;
  kinds: ContributionKind[];
  title?: string;
}) {
  const [items, setItems] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) {
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const lists = await Promise.all(
          kinds.map((kind) => new PublishedContributionRepository(schoolId).list(kind)),
        );
        if (!cancelled) {
          setItems(
            lists
              .flat()
              .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
          );
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [schoolId, kinds.join(",")]);

  if (loading || !items.length) return null;

  return (
    <section className="section">
      <p className="section-label">Communauté C-Cool</p>
      <h2>{title}</h2>
      <div className="exercise-list">
        {items.map((item) => (
          <article className="exercise-row" key={item.id}>
            <div>
              <span className="todo-subject">{labels[item.kind]}</span>
              <strong>{item.title}</strong>
              <p>{item.content}</p>
            </div>
            <span className="exercise-time">Publié</span>
          </article>
        ))}
      </div>
    </section>
  );
}
