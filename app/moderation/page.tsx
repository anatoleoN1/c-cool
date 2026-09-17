import AppShell from "@/components/layout/AppShell";

const pending = [
  ["Devoir manquant", "Maths — exercice 14", "Proposé par un élève"],
  ["Correction", "Physique — mouvement", "Correction proposée"],
  ["Information", "Cours déplacé vendredi", "À vérifier"],
];

export default function ModerationPage() {
  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Administration</p>
        <h2 className="page-title">Modération</h2>
        <p className="page-description">Les contributions restent en attente jusqu’à leur validation.</p>
        <section className="section moderation-list">
          {pending.map(([type, title, meta]) => (
            <article className="moderation-row" key={title}><div><span className="todo-subject">{type}</span><strong>{title}</strong><p>{meta}</p></div><div className="moderation-actions"><button type="button">Examiner</button><button type="button">Rejeter</button></div></article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
