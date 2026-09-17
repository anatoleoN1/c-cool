import AppShell from "@/components/layout/AppShell";

const subjects = [
  ["Mathématiques", "Algèbre, fonctions, géométrie", "8 chapitres"],
  ["Français", "Littérature, langue, expression", "6 chapitres"],
  ["Physique", "Mécanique, énergie, électricité", "5 chapitres"],
  ["Histoire-Géographie", "Repères et méthodes", "7 chapitres"],
  ["Anglais", "Grammar, vocabulary, culture", "6 chapitres"],
];

export default function CoursPage() {
  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Apprentissage</p>
        <h2 className="page-title">Cours</h2>
        <p className="page-description">Retrouve rapidement tes chapitres, fiches et ressources de cours.</p>
        <section className="section course-list">
          {subjects.map(([name, description, count]) => (
            <a href={`/cours/${name.toLowerCase().replaceAll(" ", "-")}`} className="course-row" key={name}>
              <span className="course-mark">{name.slice(0, 1)}</span>
              <div><strong>{name}</strong><p>{description}</p></div>
              <span className="course-count">{count} →</span>
            </a>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
