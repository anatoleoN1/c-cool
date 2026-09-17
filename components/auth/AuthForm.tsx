"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function AuthForm({ nextPath }: { nextPath: string }) {
  const { signIn, signUp, isConfigured } = useAuth();
  const router = useRouter();
  const [registering, setRegistering] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) return;
    setPending(true); setError(null);
    try {
      if (registering) await signUp(displayName, email, password);
      else await signIn(email, password);
      router.replace(nextPath.startsWith("/") ? nextPath : "/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "La connexion a échoué.");
    } finally { setPending(false); }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-mode"><button type="button" className={!registering ? "selected" : ""} onClick={() => setRegistering(false)}>Connexion</button><button type="button" className={registering ? "selected" : ""} onClick={() => setRegistering(true)}>Inscription</button></div>
      {registering && <label>Prénom ou nom d&apos;usage<input required value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" /></label>}
      <label>Adresse e-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
      <label>Mot de passe<input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={registering ? "new-password" : "current-password"} /></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      {!isConfigured && <p className="auth-error">Firebase doit être configuré avant de pouvoir se connecter.</p>}
      <button className="auth-submit" disabled={pending || !isConfigured}>{pending ? "Patientez…" : registering ? "Créer mon compte" : "Se connecter"}</button>
    </form>
  );
}
