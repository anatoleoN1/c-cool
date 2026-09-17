"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [compact, setCompact] = useState(false);

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Application</p>
        <h2 className="page-title">Paramètres</h2>
        <p className="page-description">Gère les préférences de ton espace C-Cool.</p>
        <section className="section settings-list">
          <label className="setting-row"><div><strong>Notifications</strong><p>Recevoir les rappels de devoirs et révisions.</p></div><input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} /></label>
          <label className="setting-row"><div><strong>Affichage compact</strong><p>Réduire l’espacement dans les listes.</p></div><input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} /></label>
          <div className="setting-row"><div><strong>Compte</strong><p>Les informations sensibles et l’authentification sont gérées par Firebase.</p></div></div>
        </section>
      </div>
    </AppShell>
  );
}
