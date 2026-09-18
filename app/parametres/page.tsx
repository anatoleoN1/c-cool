"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserRepository } from "@/lib/repositories/user-repository";

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [notificationsOverride, setNotificationsOverride] = useState<boolean | null>(null);
  const [compactOverride, setCompactOverride] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);

  const notifications = notificationsOverride ?? profile?.preferences?.notifications ?? true;
  const compact = compactOverride ?? profile?.preferences?.compact ?? false;

  async function save(preferences: { notifications: boolean; compact: boolean }) {
    if (!user) return;
    setSaved(false);
    try {
      await new UserRepository().updatePreferences(user.uid, preferences);
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  function changeNotifications(value: boolean) {
    setNotificationsOverride(value);
    void save({ notifications: value, compact });
  }

  function changeCompact(value: boolean) {
    setCompactOverride(value);
    void save({ notifications, compact: value });
  }

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Application</p>
        <h2 className="page-title">Paramètres</h2>
        <p className="page-description">Gère les préférences de ton espace C-Cool.</p>
        <section className="section settings-list">
          <label className="setting-row">
            <div><strong>Notifications</strong><p>Recevoir les rappels de devoirs et révisions.</p></div>
            <input type="checkbox" checked={notifications} onChange={(e) => changeNotifications(e.target.checked)} />
          </label>
          <label className="setting-row">
            <div><strong>Affichage compact</strong><p>Réduire l’espacement dans les listes.</p></div>
            <input type="checkbox" checked={compact} onChange={(e) => changeCompact(e.target.checked)} />
          </label>
          {saved && <p className="success-message">Préférences enregistrées.</p>}
          <div className="setting-row">
            <div><strong>Compte</strong><p>Les informations sensibles et l’authentification sont gérées par Firebase.</p></div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
