"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ClassMessageRepository } from "@/lib/repositories/classroom-repository";
import type { ClassMessage } from "@/types";

export default function ClassePage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ClassMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const schoolId = profile?.activeSchoolIds[0];

  useEffect(() => {
    if (!schoolId) return;
    void new ClassMessageRepository(schoolId)
      .list()
      .then((items) => setMessages(items.slice(-5).reverse()))
      .finally(() => setLoading(false));
  }, [schoolId]);

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Vie de classe</p>
        <h2 className="page-title">Classe</h2>
        <p className="page-description">
          Le point central de la vie collective C-Cool : informations utiles, ressources partagées et accès rapides au travail de la classe.
        </p>

        <section className="section class-hero">
          <div>
            <span className="card-label">Espace C-Cool</span>
            <h3>Notre classe</h3>
            <p>Un espace indépendant d’École Directe, construit pour organiser la vie de classe sans dépendre de sa messagerie.</p>
          </div>
          <Link href="/messages" className="auth-submit">Ouvrir le groupe →</Link>
        </section>

        <section className="section class-shortcuts">
          <Link href="/devoirs" className="class-shortcut"><span>☑</span><div><strong>Devoirs</strong><p>Voir le travail à faire</p></div></Link>
          <Link href="/evaluations" className="class-shortcut"><span>◇</span><div><strong>Évaluations</strong><p>Contrôles et interrogations</p></div></Link>
          <Link href="/cours" className="class-shortcut"><span>▤</span><div><strong>Cours</strong><p>Fiches et chapitres partagés</p></div></Link>
          <Link href="/contribuer" className="class-shortcut"><span>＋</span><div><strong>Contribuer</strong><p>Proposer une correction ou une ressource</p></div></Link>
        </section>

        <section className="section">
          <div className="section-heading">
            <div><p className="section-label">Activité récente</p><h2>Derniers messages</h2></div>
            <Link href="/messages">Tout voir →</Link>
          </div>
          <div className="class-feed">
            {loading && <p className="page-description">Chargement…</p>}
            {!loading && messages.length === 0 && <div className="empty-state"><strong>Aucune activité.</strong><p>Les messages utiles apparaîtront ici.</p></div>}
            {messages.map((message) => (
              <article className="feed-row" key={message.id}>
                <div className="avatar">{message.authorName.slice(0, 1).toUpperCase()}</div>
                <div>
                  <span className="todo-subject">{message.kind}</span>
                  <strong>{message.content}</strong>
                  <p>{message.authorName} · {new Date(message.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section class-rules">
          <p className="section-label">Esprit du groupe</p>
          <h2>Simple, utile, respectueux.</h2>
          <p>Pas de spam, pas d’informations personnelles, et on privilégie les messages qui aident réellement la classe. Les signalements pourront être modérés par C-Cool.</p>
        </section>
      </div>
    </AppShell>
  );
}
