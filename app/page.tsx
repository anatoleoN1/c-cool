import AppShell from "@/components/layout/AppShell";

const upcoming = [
  {
    subject: "Mathématiques",
    title: "Exercices sur les vecteurs",
    date: "Demain",
  },
  {
    subject: "Français",
    title: "Lecture — L’Ami du Prince",
    date: "Jeudi",
  },
  {
    subject: "Physique",
    title: "Réviser le chapitre",
    date: "Vendredi",
  },
];

export default function Home() {
  return (
    <AppShell>
      <div className="page-content">
        <section className="welcome">
          <p className="section-label">Aujourd&apos;hui</p>

          <h2>Bonjour 👋</h2>

          <p>
            Retrouvez vos cours, devoirs, exercices et révisions au même
            endroit.
          </p>
        </section>

        <section className="dashboard-grid">
          <a href="/agenda" className="feature-card">
            <span className="card-icon">◷</span>

            <div>
              <span className="card-label">Agenda</span>
              <strong>Voir ma journée</strong>
              <p>Devoirs, cours et événements à venir.</p>
            </div>

            <span className="arrow">→</span>
          </a>

          <a href="/revisions" className="feature-card">
            <span className="card-icon">↻</span>

            <div>
              <span className="card-label">Révisions</span>
              <strong>Continuer mes révisions</strong>
              <p>Travail recommandé selon ta progression.</p>
            </div>

            <span className="arrow">→</span>
          </a>

          <a href="/calcul-mental" className="feature-card">
            <span className="card-icon">∑</span>

            <div>
              <span className="card-label">Calcul mental</span>
              <strong>S&apos;entraîner</strong>
              <p>Tables, calculs et défis chronométrés.</p>
            </div>

            <span className="arrow">→</span>
          </a>
        </section>

        <section className="section">
          <div className="section-heading">
            <div>
              <p className="section-label">Prochainement</p>
              <h2>À faire</h2>
            </div>

            <a href="/agenda">Tout voir →</a>
          </div>

          <div className="todo-list">
            {upcoming.map((item) => (
              <div className="todo-item" key={item.title}>
                <span className="todo-dot" />

                <div>
                  <span className="todo-subject">{item.subject}</span>
                  <strong>{item.title}</strong>
                  <p>{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
