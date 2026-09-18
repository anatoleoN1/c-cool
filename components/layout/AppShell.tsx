"use client";

import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/firebase/analytics";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, isConfigured, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isConfigured) return;
    void trackEvent("c_cool_page_view", { page_path: pathname });
  }, [isConfigured, pathname]);

  useEffect(() => {
    if (isConfigured && !loading && !user) {
      router.replace(`/connexion?next=${encodeURIComponent(pathname)}`);
    }
  }, [isConfigured, loading, pathname, router, user]);

  if (!isConfigured) {
    return (
      <main className="auth-gate">
        <div className="auth-card">
          <p className="section-label">Configuration requise</p>
          <h1>Firebase n&apos;est pas encore configuré</h1>
          <p>Ajoutez les variables NEXT_PUBLIC_FIREBASE_* décrites dans le README.</p>
        </div>
      </main>
    );
  }

  if (loading || !user) {
    return <main className="auth-gate"><p>Chargement de votre espace…</p></main>;
  }

  const identity = profile?.displayName || user.displayName || user.email || "Élève";

  return (
    <main className="app-shell">
      <Sidebar />

      <section className="content">
        <header className="topbar">
          <MobileMenu />

          <div className="topbar-title">
            <p className="eyebrow">C-Cool</p>
            <h1>Ma classe</h1>
          </div>

          <div className="profile">
            <span className="profile-name">{identity}</span>
            <div className="avatar" title={identity}>{identity.slice(0, 1).toUpperCase()}</div>
            <button className="sign-out" onClick={() => void signOut()} aria-label="Se déconnecter">
              Déconnexion
            </button>
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}
