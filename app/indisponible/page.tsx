"use client";

import LegalFooter from "@/components/legal/LegalFooter";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IndisponiblePage() {
  const { signOut, accessAllowed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (accessAllowed) router.replace("/");
  }, [accessAllowed, router]);

  async function handleSignOut() {
    await signOut();
    router.replace("/connexion");
  }

  return (
    <main className="auth-page">
      <section className="auth-card access-denied-card">
        <div className="brand">
          <div className="brand-mark">C</div>
          <span>C-Cool</span>
        </div>

        <p className="section-label">Accès limité</p>
        <h1>C-Cool n’est pas encore disponible pour ce compte.</h1>
        <p className="auth-intro">
          Cette version de C-Cool est actuellement réservée aux élèves de
          <strong> 2nde 5 de PCH</strong>.
        </p>
        <p className="auth-intro">
          Ton compte École Directe a bien été identifié, mais il ne correspond
          pas à la classe autorisée.
        </p>

        <button className="auth-submit" type="button" onClick={() => void handleSignOut()}>
          Se déconnecter
        </button>
      </section>

      <LegalFooter compact />
    </main>
  );
}
