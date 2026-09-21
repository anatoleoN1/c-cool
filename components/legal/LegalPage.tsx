import Link from "next/link";

type Section = {
  title: string;
  children: React.ReactNode;
};

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Données & confidentialité" },
  { href: "/cookies", label: "Cookies" },
];

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
    <main className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <Link href="/" className="legal-back">
            <span aria-hidden="true">←</span>
            Retour à C-Cool
          </Link>

          <div className="legal-heading">
            <p className="section-label">{eyebrow}</p>
            <h1>{title}</h1>
            {intro && <p className="legal-intro">{intro}</p>}
            <p className="legal-updated">Dernière mise à jour · {updated}</p>
          </div>
        </header>

        <nav aria-label="Navigation légale" className="legal-nav">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <article className="legal-document">
          {sections.map((section, index) => (
            <section key={section.title} className="legal-section">
              <div className="legal-section-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="legal-section-content">
                <h2>{section.title.replace(/^\d+\.\s*/, "")}</h2>
                <div className="legal-prose">{section.children}</div>
              </div>
            </section>
          ))}
        </article>

        <div className="legal-bottom-nav">
          <Link href="/">← Retour à C-Cool</Link>
          <nav aria-label="Pages légales">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
