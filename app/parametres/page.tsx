"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserRepository } from "@/lib/repositories/user-repository";

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [notificationsOverride, setNotificationsOverride] = useState<boolean | null>(null);
  const [compactOverride, setCompactOverride] = useState<boolean | null>(null);
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [completedOverride, setCompletedOverride] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);

  const preferences = profile?.preferences;
  const notifications = notificationsOverride ?? preferences?.notifications ?? true;
  const compact = compactOverride ?? preferences?.compact ?? false;
  const reducedMotion = motionOverride ?? preferences?.reducedMotion ?? false;
  const showCompletedHomework = completedOverride ?? preferences?.showCompletedHomework ?? false;

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = reducedMotion ? "true" : "false";
    document.documentElement.dataset.compact = compact ? "true" : "false";
  }, [compact, reducedMotion]);

  async function save(next: {
    notifications: boolean;
    compact: boolean;
    reducedMotion: boolean;
    showCompletedHomework: boolean;
  }) {
    if (!user) return;
    setSaved(false);
    try {
      await new UserRepository().updatePreferences(user.uid, next);
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  function update(partial: Partial<{
    notifications: boolean;
    compact: boolean;
    reducedMotion: boolean;
    showCompletedHomework: boolean;
  }>) {
    const next = { notifications, compact, reducedMotion, showCompletedHomework, ...partial };
    if (partial.notifications !== undefined) setNotificationsOverride(partial.notifications);
    if (partial.compact !== undefined) setCompactOverride(partial.compact);
    if (partial.reducedMotion !== undefined) setMotionOverride(partial.reducedMotion);
    if (partial.showCompletedHomework !== undefined) setCompletedOverride(partial.showCompletedHomework);
    void save(next);
  }

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Application</p>
        <h2 className="page-title">Paramètres</h2>
        <p className="page-description">Personnalise ton espace C-Cool sans toucher aux données École Directe.</p>

        <section className="section settings-list">
          <div className="settings-section-title">Expérience</div>
          <label className="setting-row">
            <div><strong>Notifications</strong><p>Activer les rappels de devoirs et de révisions.</p></div>
            <input type="checkbox" checked={notifications} onChange={(e) => update({ notifications: e.target.checked })} />
          </label>
          <label className="setting-row">
            <div><strong>Affichage compact</strong><p>Réduire l’espacement dans les listes et les fils.</p></div>
            <input type="checkbox" checked={compact} onChange={(e) => update({ compact: e.target.checked })} />
          </label>
          <label className="setting-row">
            <div><strong>Réduire les animations</strong><p>Désactiver les mouvements non essentiels de l’interface.</p></div>
            <input type="checkbox" checked={reducedMotion} onChange={(e) => update({ reducedMotion: e.target.checked })} />
          </label>
          <label className="setting-row">
            <div><strong>Afficher les devoirs terminés</strong><p>Conserver les devoirs marqués comme faits dans les listes C-Cool.</p></div>
            <input type="checkbox" checked={showCompletedHomework} onChange={(e) => update({ showCompletedHomework: e.target.checked })} />
          </label>

          {saved && <p className="success-message">Préférences enregistrées.</p>}
        </section>

        <section className="section settings-list">
          <div className="settings-section-title">Compte et données</div>
          <div className="setting-row">
            <div>
              <strong>{profile?.displayName || user?.displayName || "Élève"}</strong>
              <p>{profile?.activeSchoolIds[0] || "Établissement non chargé"} · Les données officielles viennent d’École Directe et les contenus C-Cool sont stockés séparément.</p>
            </div>
          </div>
          <div className="setting-row">
            <div><strong>Session École Directe</strong><p>Si l’API indique que ton token est expiré, reconnecte-toi pour en générer un nouveau.</p></div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
