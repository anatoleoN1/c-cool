"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Accueil", icon: "⌂" },
  { href: "/agenda", label: "Agenda", icon: "◷" },
  { href: "/cours", label: "Cours", icon: "▤" },
  { href: "/exercices", label: "Exercices", icon: "✓" },
  { href: "/revisions", label: "Révisions", icon: "↻" },
  { href: "/calcul-mental", label: "Calcul mental", icon: "∑" },
  { href: "/classe", label: "Classe", icon: "◎" },
  { href: "/messages", label: "Messages", icon: "□" },
];

export default function Sidebar() {
  const pathname = usePathname();

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
