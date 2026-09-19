"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function AuthForm({ nextPath }: { nextPath: string }) {
  const { signIn, completeEcoleDirecteQcm, isConfigured } = useAuth();
  const router = useRouter();
  const [identifiant, setIdentifiant] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [qcm, setQcm] = useState<{ question: string; propositions: Array<{ encoded: string; label: string }> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) return;
    setPending(true); setError(null);
    try {
      const result = await signIn(identifiant, motdepasse);
      if (result.kind === "qcm") {
        setQcm({ question: result.question, propositions: result.propositions });
        return;
      }
      router.replace(nextPath.startsWith("/") ? nextPath : "/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La connexion a échoué.");
    } finally { setPending(false); }
  }

  async function submitQcm(choice: string) {
    setPending(true); setError(null);
    try {
      await completeEcoleDirecteQcm(identifiant, motdepasse, choice);
      router.replace(nextPath.startsWith("/") ? nextPath : "/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Le QCM a échoué.");
    } finally { setPending(false); }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <p className="auth-intro">Utilise tes identifiants <strong>École Directe</strong>. Ils sont transmis uniquement au serveur C-Cool pour la connexion à École Directe.</p>
      {!qcm ? (
        <>
          <label htmlFor="ecole-directe-identifiant">Identifiant École Directe<input id="ecole-directe-identifiant" name="identifiant" required value={identifiant} onChange={(event) => setIdentifiant(event.target.value)} autoComplete="username" /></label>
          <label htmlFor="ecole-directe-motdepasse">Mot de passe École Directe<input id="ecole-directe-motdepasse" name="motdepasse" required type="password" value={motdepasse} onChange={(event) => setMotdepasse(event.target.value)} autoComplete="current-password" /></label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          {!isConfigured && <p className="auth-error">Firebase doit être configuré avant de pouvoir se connecter.</p>}
          <button className="auth-submit" disabled={pending || !isConfigured}>{pending ? "Connexion à École Directe…" : "Se connecter avec École Directe"}</button>
        </>
      ) : (
        <>
          <div className="qcm-panel">
  <p className="qcm-eyebrow">Vérification École Directe</p>
  <p className="qcm-question"><strong>{qcm.question || "Réponds à la question de sécurité École Directe."}</strong></p>
  <p className="qcm-help">Choisis la réponse correspondant à ta question de sécurité.</p>
</div>
          <div className="qcm-options">
            {qcm.propositions.map((choice) => (
              <button key={choice.encoded} type="button" className="auth-submit" disabled={pending} onClick={() => void submitQcm(choice.encoded)}>
                {choice.label}
              </button>
            ))}
          </div>
          {error && <p className="auth-error" role="alert">{error}</p>}
        </>
      )}
    </form>
  );
}
