import AppShell from "@/components/layout/AppShell";

const messages = [
  ["C-Cool", "Bienvenue sur C-Cool", "Ton espace regroupe cours, devoirs, exercices et révisions."],
  ["Classe", "Information importante", "Les dernières informations validées par les modérateurs apparaîtront ici."],
];

export default function MessagesPage() {
  return (
    <AppShell>
      <div className="page-content">
        <p className="section-label">Communication</p>
        <h2 className="page-title">Messages</h2>
        <p className="page-description">Retrouve ici les messages et informations utiles à ta scolarité.</p>
        <section className="section message-list">{messages.map(([sender, title, body]) => <article className="message-row" key={title}><div className="avatar">{sender.slice(0,1)}</div><div><span className="todo-subject">{sender}</span><strong>{title}</strong><p>{body}</p></div></article>)}</section>
      </div>
    </AppShell>
  );
}
