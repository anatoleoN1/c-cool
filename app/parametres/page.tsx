import AppShell from "@/components/layout/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Application</p>
        <h2 className="page-title">Paramètres</h2>
        <p className="page-description">
          Les paramètres de ton compte seront disponibles ici.
        </p>
      </div>
    </AppShell>
  );
}
