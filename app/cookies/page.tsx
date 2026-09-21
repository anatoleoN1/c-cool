import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Cookies et traceurs",
  description: "Politique relative aux cookies et autres traceurs de C-Cool.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookies et traceurs"
      intro="C-Cool privilégie un fonctionnement avec le minimum de traceurs. Cette page devra être tenue à jour en fonction des cookies et services réellement activés en production."
      sections={[
        {
          title: "1. Qu’est-ce qu’un cookie ?",
          children: (
            <p>Un cookie ou autre traceur est un mécanisme permettant de stocker ou de lire des informations sur l’équipement utilisé pour accéder à un service. Tous les traceurs ne sont pas soumis aux mêmes règles.</p>
          ),
        },
        {
          title: "2. Traceurs nécessaires au fonctionnement",
          children: (
            <>
              <p>C-Cool peut utiliser des mécanismes de session et d’authentification strictement nécessaires au fonctionnement du service et à la sécurité des comptes.</p>
              <p>Ils peuvent notamment permettre de maintenir une session, d’authentifier une requête ou de mémoriser un choix technique nécessaire au service.</p>
              <p><strong>Inventaire exact des cookies C-Cool :</strong> [À COMPLÉTER — nom, finalité, durée, domaine, type et service concerné].</p>
            </>
          ),
        },
        {
          title: "3. Traceurs soumis au consentement",
          children: (
            <>
              <p>Si C-Cool ajoute des traceurs de mesure d’audience, de publicité, de réseaux sociaux ou d’autres fonctionnalités nécessitant un consentement, ils ne devront être activés qu’après le recueil d’un consentement valide lorsque la réglementation l’exige.</p>
              <p>Le refus doit être aussi simple que l’acceptation et le retrait du consentement doit rester possible à tout moment.</p>
              <p><strong>Traceurs soumis à consentement actuellement utilisés :</strong> [À COMPLÉTER — ou indiquer « aucun » après inventaire].</p>
            </>
          ),
        },
        {
          title: "4. Gestion des préférences",
          children: (
            <>
              <p><strong>Gestionnaire de consentement :</strong> [À COMPLÉTER — aucun / outil retenu / mécanisme C-Cool].</p>
              <p>Si un gestionnaire de consentement est utilisé, le lien permettant de modifier ou retirer les choix devra rester accessible depuis le site.</p>
            </>
          ),
        },
        {
          title: "5. Services tiers",
          children: (
            <>
              <p>C-Cool utilise des services tiers pour certaines fonctions techniques. Leur comportement en matière de cookies ou de traceurs doit être vérifié avant chaque mise en production.</p>
              <p><strong>Liste finale des services tiers déposant ou lisant des traceurs :</strong> [À COMPLÉTER après audit du site déployé].</p>
            </>
          ),
        },
        {
          title: "6. Mise à jour",
          children: (
            <p>Cette page est mise à jour lorsque les cookies, traceurs, services tiers ou mécanismes de consentement de C-Cool évoluent.</p>
          ),
        },
      ]}
    />
  );
}
