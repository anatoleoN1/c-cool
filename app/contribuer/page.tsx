"use client";

import { FormEvent, useState } from "react";
import AppShell from "@/components/layout/AppShell";

const types = ["Devoir manquant", "Correction", "Cours / fiche", "Exercice", "Information d’agenda", "Autre"];

export default function ContribuerPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Participation</p>
        <h2 className="page-title">Contribuer</h2>
        <p className="page-description">Signale une information manquante ou propose une ressource. Rien n’est publié directement : chaque proposition est vérifiée.</p>
        <section className="section contribution-form-wrap">
          {sent ? <div className="success-message"><strong>Proposition envoyée.</strong><p>Elle sera examinée avant toute publication.</p><button className="text-button" onClick={() => setSent(false)}>Faire une autre proposition →</button></div> : (
            <form className="contribution-form" onSubmit={submit}>
              <label>Type<select name="type" defaultValue={types[0]}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label>Titre<input name="title" required placeholder="Ex. Exercice 12 de maths" /></label>
              <label>Détails<textarea name="details" required rows={6} placeholder="Décris précisément ce qui doit être ajouté ou corrigé…" /></label>
              <button className="auth-submit" type="submit">Envoyer pour vérification</button>
            </form>
          )}
        </section>
      </div>
    </AppShell>
  );
}
