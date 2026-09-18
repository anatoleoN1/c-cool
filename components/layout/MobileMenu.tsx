"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const navigation = [
  { href: "/", label: "Accueil", icon: "⌂" },
  { href: "/agenda", label: "Agenda", icon: "◷" },
  { href: "/cours", label: "Cours", icon: "▤" },
  { href: "/exercices", label: "Exercices", icon: "✓" },
  { href: "/devoirs", label: "Devoirs", icon: "☑" },
  { href: "/revisions", label: "Révisions", icon: "↻" },
  { href: "/evaluations", label: "Évaluations", icon: "◇" },
  { href: "/calcul-mental", label: "Calcul mental", icon: "∑" },
  { href: "/classe", label: "Classe", icon: "◎" },
  { href: "/messages", label: "Messages", icon: "□" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        className="mobile-menu"
        aria-label="Ouvrir le menu"
        onClick={() => setOpen(true)}
      >
        ☰
      </button>

      {open && (
        <div className="mobile-overlay" onClick={() => setOpen(false)}>
          <aside
            className="mobile-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <div className="brand">
                <div className="brand-mark">C</div>
                <span>C-Cool</span>
              </div>

              <button
                className="mobile-close"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <nav className="navigation">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-item"
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              {profile?.role === "moderator" || profile?.role === "admin" ? (
                <Link href="/moderation" className="nav-item" onClick={() => setOpen(false)}>
                  <span className="nav-icon">⚑</span><span>Modération</span>
                </Link>
              ) : null}
              <Link href="/contribuer" className="nav-item" onClick={() => setOpen(false)}>
                <span className="nav-icon">＋</span><span>Contribuer</span>
              </Link>
              <Link
                href="/parametres"
                className="nav-item"
                onClick={() => setOpen(false)}
              >
                <span className="nav-icon">⚙</span>
                <span>Paramètres</span>
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
