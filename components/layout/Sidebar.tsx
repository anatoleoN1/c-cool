"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const navigation = [
  ["/", "Accueil"], ["/agenda", "Agenda"], ["/cours", "Cours"], ["/exercices", "Exercices"],
  ["/devoirs", "Devoirs"], ["/revisions", "Révisions"], ["/evaluations", "Évaluations"],
  ["/calcul-mental", "Calcul mental"], ["/classe", "Classe"], ["/messages", "Messages"],
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const isActive = (href:string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="C-Cool — accueil"><span className="brand-wordmark">C-Cool</span></Link>
      <div className="sidebar-label">Espace élève</div>
      <nav className="navigation" aria-label="Navigation principale">
        {navigation.map(([href,label]) => <Link key={href} href={href} className={`nav-item ${isActive(href) ? "active" : ""}`}>{label}</Link>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-label">Autres</div>
        {role === "admin" ? <Link href="/admin" className={`nav-item ${isActive("/admin") ? "active" : ""}`}>Administration</Link> : null}
        {role === "moderator" || role === "admin" ? <Link href="/moderation" className={`nav-item ${isActive("/moderation") ? "active" : ""}`}>Modération</Link> : null}
        <Link href="/contribuer" className={`nav-item ${isActive("/contribuer") ? "active" : ""}`}>Contribuer</Link>
        <Link href="/parametres" className={`nav-item ${isActive("/parametres") ? "active" : ""}`}>Paramètres</Link>
      </div>
    </aside>
  );
}