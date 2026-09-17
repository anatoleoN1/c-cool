import AppShell from "@/components/layout/AppShell";

const plan = [
  ["J-7 → J-5", "Relire les fiches", "Comprendre et mémoriser les notions."],
  ["J-4 → J-3", "Entraînement", "Questions faciles puis intermédiaires."],
  ["J-2", "Exercices", "S'entraîner sur les points difficiles."],
  ["J-1", "Simulation", "Faire un sujet et revoir les erreurs."],
];

export default function RevisionsPage() {
  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Préparation</p>
        <h2 className="page-title">Révisions</h2>
        <p className="page-description">Un planning progressif qui s’adapte à tes évaluations et à ta progression.</p>
        <section className="section revision-plan">
          {plan.map(([period, title, description], index) => (
            <article className="revision-step" key={period}>
              <span className="revision-number">{index + 1}</span>
              <div><span className="todo-subject">{period}</span><strong>{title}</strong><p>{description}</p></div>
              <button type="button" className="text-button">Ouvrir →</button>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
