"use client";

import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, isConfigured, accessAllowed, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isConfigured && !loading && !user) {
      router.replace(`/connexion?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (
      isConfigured &&
      !loading &&
      user &&
      !accessAllowed &&
      pathname !== "/indisponible"
    ) {
      router.replace("/indisponible");
    }
  }, [accessAllowed, isConfigured, loading, pathname, router, user]);

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

  if (loading || !user || !accessAllowed) {
    return <main className="auth-gate"><p>Vérification de votre accès…</p></main>;
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
            <h1>{profile?.className || profile?.classCode || "Ma classe"}</h1>
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
