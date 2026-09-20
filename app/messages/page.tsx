"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { ClassMessageRepository } from "@/lib/repositories/classroom-repository";
import type { ClassMessage, ClassMessageKind } from "@/types";

const kinds: Array<{ value: ClassMessageKind; label: string }> = [
  { value: "message", label: "Message" },
  { value: "homework", label: "Devoir" },
  { value: "evaluation", label: "Évaluation" },
  { value: "resource", label: "Ressource" },
  { value: "announcement", label: "Annonce" },
];

export default function MessagesPage() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ClassMessage[]>([]);
  const [content, setContent] = useState("");
  const [kind, setKind] = useState<ClassMessageKind>("message");
  const [linkHref, setLinkHref] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schoolId = profile?.activeSchoolIds[0];

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      if (!schoolId) return;

      try {
        setLoading(true);
        const items = await new ClassMessageRepository(schoolId).list();
        if (!cancelled) {
          setMessages(items);
          setError(null);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(
            caught instanceof Error ? caught.message : "Impossible de charger le groupe.",
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
  }, [schoolId]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!user || !profile?.activeSchoolIds[0] || !content.trim()) return;

    setSending(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      await new ClassMessageRepository(profile.activeSchoolIds[0]).create({
        schoolId: profile.activeSchoolIds[0],
        authorId: user.uid,
        authorName: user.displayName || profile.displayName || "Élève",
        kind,
        content: content.trim(),
        linkHref: linkHref.trim() || undefined,
        linkLabel: linkLabel.trim() || undefined,
        createdAt: now,
        updatedAt: now,
        createdBy: user.uid,
        updatedBy: user.uid,
      });

      setContent("");
      setLinkHref("");
      setLinkLabel("");
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Le message n’a pas pu être envoyé.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Communication</p>
        <h2 className="page-title">Messages</h2>
        <p className="page-description">
          Le groupe de classe C-Cool : messages, devoirs, évaluations et ressources partagées.
        </p>

        <section className="section message-composer">
          <div className="message-composer-heading">
            <div>
              <span className="section-label">Groupe de classe</span>
              <h3>Partager quelque chose</h3>
            </div>
            <span className="message-count">{messages.length} message{messages.length > 1 ? "s" : ""}</span>
          </div>

          <form onSubmit={submit} className="contribution-form">
            <div className="message-kind-row">
              {kinds.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={kind === item.value ? "mental-chip selected" : "mental-chip"}
                  onClick={() => setKind(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Ex. Le devoir de maths est finalement pour vendredi…"
              required
            />
            <div className="message-link-fields">
              <input value={linkHref} onChange={(event) => setLinkHref(event.target.value)} placeholder="Lien C-Cool (facultatif), ex. /devoirs" />
              <input value={linkLabel} onChange={(event) => setLinkLabel(event.target.value)} placeholder="Texte du lien (facultatif)" />
            </div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="auth-submit" type="submit" disabled={sending || !content.trim()}>
              {sending ? "Envoi…" : "Publier dans le groupe"}
            </button>
          </form>
        </section>

        <section className="section message-list" aria-live="polite">
          {loading && <p className="page-description">Chargement du groupe…</p>}
          {!loading && messages.length === 0 && (
            <div className="empty-state">
              <strong>Le groupe est encore vide.</strong>
              <p>Sois le premier à partager une information utile à la classe.</p>
            </div>
          )}
          {[...messages].reverse().map((message) => (
            <article className="message-row" key={message.id}>
              <div className="avatar">{message.authorName.slice(0, 1).toUpperCase()}</div>
              <div className="message-body">
                <div className="message-meta">
                  <strong>{message.authorName}</strong>
                  <span>{kinds.find((item) => item.value === message.kind)?.label || "Message"}</span>
                  <time>{new Date(message.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
                </div>
                <p>{message.content}</p>
                {message.linkHref && (
                  message.linkHref.startsWith("/") ? (
                    <Link href={message.linkHref} className="message-link">{message.linkLabel || "Ouvrir dans C-Cool"} →</Link>
                  ) : (
                    <span className="message-link">{message.linkLabel || message.linkHref}</span>
                  )
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
