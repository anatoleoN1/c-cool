"use client";

import Link from "next/link";

type Section = {
  title: string;
  children: React.ReactNode;
};

export default function LegalPage({
  eyebrow = "C-Cool",
  title,
  intro,
  updated = "À COMPLÉTER",
  sections,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  updated?: string;
  sections: Section[];
}) {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100">
            ← Retour à C-Cool
          </Link>
          <p className="section-label mt-8">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {intro && <p className="mt-4 max-w-3xl text-base leading-7 opacity-75">{intro}</p>}
          <p className="mt-4 text-xs opacity-55">Dernière mise à jour : {updated}</p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="border-b border-black/8 pb-8 last:border-0">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-7 opacity-80">
                {section.children}
              </div>
            </section>
          ))}
        </div>

        <nav aria-label="Pages légales" className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-black/8 pt-6 text-sm opacity-70">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/cgu">CGU</Link>
          <Link href="/confidentialite">Données & confidentialité</Link>
          <Link href="/cookies">Cookies</Link>
        </nav>
      </div>
    </main>
  );
}
