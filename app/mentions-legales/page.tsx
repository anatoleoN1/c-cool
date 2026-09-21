import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales de C-Cool.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Les informations permettant d’identifier l’éditeur de C-Cool et les principaux prestataires techniques du service."
      sections={[
        {
          title: "Éditeur du site",
          children: (
            <>
              <p><strong>Nom / dénomination :</strong> OERLEMANS Anatole</p>
              <p><strong>Statut / forme juridique :</strong> Projet personnel</p>
              <p><strong>Adresse :</strong> [À COMPLÉTER — adresse légalement requise, selon le statut de l’éditeur]</p>
              <p><strong>E-mail :</strong> redtrap.off@gmail.com (provisoire)</p>
              <p><strong>Téléphone :</strong> [À COMPLÉTER si applicable]</p>
              <p><strong>Responsable de la publication :</strong> [À COMPLÉTER]</p>
            </>
          ),
        },
        {
          title: "Hébergement",
          children: (
            <>
              <p><strong>Hébergeur de l’application web :</strong> [À COMPLÉTER — par exemple Vercel, si ce choix est confirmé]</p>
              <p><strong>Adresse de l’hébergeur :</strong> [À COMPLÉTER depuis les mentions officielles de l’hébergeur retenu]</p>
              <p><strong>Site de l’hébergeur :</strong> [À COMPLÉTER]</p>
              <p><strong>Services de données :</strong> C-Cool utilise également des services tiers pour l’authentification et le stockage de certaines données applicatives. Les prestataires concernés sont détaillés dans la politique de confidentialité.</p>
            </>
          ),
        },
        {
          title: "Propriété intellectuelle",
          children: (
            <>
              <p>Le nom, le logo, l’interface, les textes, le code et les autres éléments créés spécifiquement pour C-Cool sont protégés par les règles applicables à la propriété intellectuelle, sous réserve des droits détenus par des tiers.</p>
              <p><strong>Titulaires des droits / licence du code :</strong> [À COMPLÉTER — notamment si le dépôt GitHub est public ou sous licence open source]</p>
              <p>Les contenus scolaires provenant d’un établissement ou de services tiers restent soumis aux droits qui leur sont applicables. C-Cool ne revendique pas la propriété de ces contenus.</p>
            </>
          ),
        },
        {
          title: "Services et marques de tiers",
          children: (
            <>
              <p>C-Cool peut interagir avec École Directe et avec des services techniques tiers nécessaires à son fonctionnement. C-Cool n’est pas présenté comme un service officiel d’École Directe sauf accord explicite contraire.</p>
              <p>Les noms et marques de tiers appartiennent à leurs titulaires respectifs.</p>
            </>
          ),
        },
        {
          title: "Contact",
          children: (
            <p>Pour toute question relative au site, contactez : <strong>redtrap.off@gmail.com (provisoire)</strong>.</p>
          ),
        },
      ]}
    />
  );
}
