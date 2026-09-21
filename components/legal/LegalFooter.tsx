import Link from "next/link";

const links = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Données & confidentialité" },
  { href: "/cookies", label: "Cookies" },
];

export default function LegalFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={`legal-footer${compact ? " legal-footer-compact" : ""}`}>
      <div className="legal-footer-inner">
        <nav aria-label="Informations légales" className="legal-footer-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} C-Cool</p>
      </div>
    </footer>
  );
}
