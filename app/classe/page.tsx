import AppShell from "@/components/layout/AppShell";

const announcements = [
  ["Classe", "Contrôle de maths déplacé à vendredi", "Publié par un modérateur"],
  ["Ressource", "Une fiche de révision sur les vecteurs est disponible", "Ajoutée aujourd’hui"],
  ["Information", "Pensez à vérifier vos devoirs avant le week-end", "C-Cool"],
];

export default function ClassePage() {
  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Communauté</p>
        <h2 className="page-title">Classe</h2>
        <p className="page-description">Les informations utiles de la classe, avec une validation avant publication.</p>
        <section className="section class-feed">
          {announcements.map(([label, title, meta]) => (
            <article className="feed-row" key={title}><span className="card-icon">{label.slice(0, 1)}</span><div><span className="todo-subject">{label}</span><strong>{title}</strong><p>{meta}</p></div></article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
