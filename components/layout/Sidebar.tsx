"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

const navigation = [
  { href: "/", label: "Accueil", icon: "⌂" },
  { href: "/agenda", label: "Agenda", icon: "◷" },
  { href: "/cours", label: "Cours", icon: "▤" },
  { href: "/exercices", label: "Exercices", icon: "✓" },
  { href: "/devoirs", label: "Devoirs", icon: "☑" },
  { href: "/devoirs", label: "Devoirs", icon: "☑" },
  { href: "/revisions", label: "Révisions", icon: "↻" },
  { href: "/evaluations", label: "Évaluations", icon: "◇" },
  { href: "/calcul-mental", label: "Calcul mental", icon: "∑" },
  { href: "/classe", label: "Classe", icon: "◎" },
  { href: "/messages", label: "Messages", icon: "□" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">C</div>
        <span>C-Cool</span>
      </div>

      <nav className="navigation" aria-label="Navigation principale">
        {navigation.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${active ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        {profile?.role === "moderator" || profile?.role === "admin" ? (
          <Link href="/moderation" className={`nav-item ${pathname.startsWith("/moderation") ? "active" : ""}`}>
            <span className="nav-icon">⚑</span><span>Modération</span>
          </Link>
        ) : null}
        <Link href="/contribuer" className={`nav-item ${pathname.startsWith("/contribuer") ? "active" : ""}`}>
          <span className="nav-icon">＋</span><span>Contribuer</span>
        </Link>
        <Link
          href="/parametres"
          className={`nav-item ${
            pathname.startsWith("/parametres") ? "active" : ""
          }`}
        >
          <span className="nav-icon">⚙</span>
          <span>Paramètres</span>
        </Link>
      </div>
    </aside>
  );
}
