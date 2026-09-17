import AppShell from "@/components/layout/AppShell";

const exercises = [
  { subject: "Mathématiques", title: "Vecteurs — série 1", level: "Consolidation", time: "15 min" },
  { subject: "Mathématiques", title: "Fonctions affines", level: "Entraînement", time: "20 min" },
  { subject: "Physique", title: "Mouvement et vitesse", level: "Application", time: "15 min" },
  { subject: "Français", title: "Analyse de texte", level: "Méthode", time: "25 min" },
];

export default function ExercicesPage() {
  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Entraînement</p>
        <h2 className="page-title">Exercices</h2>
        <p className="page-description">Des exercices classés par matière et niveau pour passer de la compréhension à la maîtrise.</p>
        <section className="section exercise-list">
          {exercises.map((exercise) => (
            <article className="exercise-row" key={exercise.title}>
              <div><span className="todo-subject">{exercise.subject}</span><strong>{exercise.title}</strong><p>{exercise.level}</p></div>
              <span className="exercise-time">{exercise.time}</span>
              <button type="button" className="text-button">Commencer →</button>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
