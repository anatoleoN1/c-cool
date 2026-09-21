"use client";

import Link from "next/link";

export default function LegalFooter() {
  return (
    <footer className="border-t border-black/8 px-5 py-6 text-xs opacity-60 sm:px-8">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/mentions-legales" className="hover:opacity-100">Mentions légales</Link>
        <Link href="/cgu" className="hover:opacity-100">CGU</Link>
        <Link href="/confidentialite" className="hover:opacity-100">Données & confidentialité</Link>
        <Link href="/cookies" className="hover:opacity-100">Cookies</Link>
      </div>
      <p className="mt-2">© {new Date().getFullYear()} C-Cool · Informations légales à jour au {new Date().toLocaleDateString("fr-FR")}.</p>
    </footer>
  );
}
