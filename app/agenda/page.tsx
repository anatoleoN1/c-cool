import AppShell from "@/components/layout/AppShell";

const days = [
  { day: "Lun", date: "21", items: ["Mathématiques — 08:00", "Français — 10:00", "Physique — 14:00"] },
  { day: "Mar", date: "22", items: ["Anglais — 09:00", "Histoire — 11:00"] },
  { day: "Mer", date: "23", items: ["Mathématiques — 08:00", "EPS — 10:00"] },
  { day: "Jeu", date: "24", items: ["Français — 09:00", "Physique — 13:30"] },
  { day: "Ven", date: "25", items: ["Mathématiques — 08:00", "Anglais — 10:00"] },
];

export default function AgendaPage() {
  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Organisation</p>
        <h2 className="page-title">Agenda</h2>
        <p className="page-description">Cours, devoirs et événements regroupés dans une seule vue.</p>
        <section className="section agenda-grid">
          {days.map((day) => (
            <article className="agenda-day" key={day.date}>
              <header><span>{day.day}</span><strong>{day.date}</strong></header>
              <div>{day.items.map((item) => <p key={item}><span className="todo-dot" />{item}</p>)}</div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
