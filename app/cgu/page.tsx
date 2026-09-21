import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Conditions générales d’utilisation",
  description: "Conditions générales d’utilisation de C-Cool.",
};

export default function CguPage() {
  return (
    <LegalPage
      title="Conditions générales d’utilisation"
      intro="Les présentes conditions encadrent l’utilisation de C-Cool, plateforme destinée à faciliter l’organisation du travail scolaire et le partage de ressources au sein d’une communauté scolaire."
      sections={[
        {
          title: "1. Objet du service",
          children: (
            <>
              <p>C-Cool est une plateforme numérique destinée à regrouper des informations scolaires, faciliter l’organisation du travail personnel et proposer des fonctionnalités de révision, d’exercices et de contribution communautaire.</p>
              <p>Le service peut utiliser des informations issues d’École Directe afin d’afficher notamment l’emploi du temps, les devoirs et d’autres informations scolaires disponibles pour le compte connecté.</p>
              <p>C-Cool constitue un service complémentaire et ne remplace pas les outils ou communications officiels de l’établissement scolaire.</p>
            </>
          ),
        },
        {
          title: "2. Conditions d’accès",
          children: (
            <>
              <p>L’accès à certaines fonctionnalités est réservé aux utilisateurs autorisés par C-Cool et, lorsque cela est applicable, à une classe ou à un établissement déterminé.</p>
              <p>L’utilisateur s’engage à utiliser uniquement son propre compte et à ne pas tenter d’accéder aux données, comptes ou fonctionnalités auxquels il n’est pas autorisé.</p>
              <p>Les identifiants et mots de passe École Directe ne doivent pas être communiqués à d’autres utilisateurs.</p>
            </>
          ),
        },
        {
          title: "3. Connexion à École Directe",
          children: (
            <>
              <p>Lors de la connexion, les identifiants nécessaires sont transmis au service École Directe via le serveur C-Cool afin de permettre l’authentification. C-Cool ne doit pas conserver le mot de passe École Directe dans sa base de données.</p>
              <p>La disponibilité et le comportement de l’API École Directe dépendent d’un service tiers. Une interruption, modification ou limitation de ce service peut entraîner une indisponibilité de certaines fonctionnalités de C-Cool.</p>
            </>
          ),
        },
        {
          title: "4. Contributions des utilisateurs",
          children: (
            <>
              <p>C-Cool peut permettre aux utilisateurs de proposer des devoirs, corrections, notes de cours, exercices, méthodes, modifications d’agenda ou autres contenus destinés à leur communauté scolaire.</p>
              <p>Une contribution n’est pas publiée automatiquement : elle peut être soumise à une modération et à une validation par un utilisateur disposant des droits appropriés.</p>
              <p>L’auteur s’engage à proposer des contenus pertinents, licites, respectueux et compatibles avec un contexte scolaire.</p>
              <p>Il est interdit de publier des informations personnelles concernant un tiers, des identifiants, des mots de passe, des données confidentielles, du contenu illicite ou du contenu portant atteinte aux droits d’autrui.</p>
            </>
          ),
        },
        {
          title: "5. Modération",
          children: (
            <>
              <p>Les contributions peuvent être acceptées, refusées, modifiées, masquées ou supprimées lorsqu’elles ne respectent pas les règles du service, les droits de tiers ou les exigences de sécurité.</p>
              <p>Les comptes disposant de droits de modération ou d’administration sont utilisés pour gérer les contenus et les accès conformément aux règles internes de C-Cool.</p>
              <p>Une charte de modération distincte pourra être créée ultérieurement afin de préciser les règles applicables aux contributions et aux décisions de modération.</p>
            </>
          ),
        },
        {
          title: "6. Disponibilité du service",
          children: (
            <>
              <p>C-Cool est fourni dans la limite des possibilités techniques disponibles. Des interruptions peuvent notamment résulter de maintenance, d’incidents techniques, de défaillances de prestataires ou d’indisponibilité d’École Directe.</p>
              <p>Aucune garantie de disponibilité permanente ou d’exhaustivité des informations scolaires n’est donnée.</p>
            </>
          ),
        },
        {
          title: "7. Exactitude des informations",
          children: (
            <>
              <p>Les informations provenant d’un service tiers ou d’une contribution communautaire peuvent contenir des erreurs ou être incomplètes. Pour les informations officielles importantes, l’utilisateur doit se référer aux communications de son établissement.</p>
            </>
          ),
        },
        {
          title: "8. Sécurité et usages interdits",
          children: (
            <>
              <p>Sont notamment interdits : les tentatives d’accès non autorisées, l’exploitation volontaire de failles, l’introduction de code malveillant, le contournement des mécanismes de sécurité, l’usurpation de compte et l’utilisation du service pour nuire à d’autres personnes.</p>
              <p>Une vulnérabilité peut être signalée à : <strong>redtrap.off@gmail.com (provisoire)</strong>.</p>
            </>
          ),
        },
        {
          title: "9. Données personnelles",
          children: (
            <p>Les traitements de données personnelles sont décrits séparément dans la <a href="/confidentialite" className="underline">politique de confidentialité et de protection des données</a>.</p>
          ),
        },
        {
          title: "10. Évolution des CGU",
          children: (
            <p>C-Cool peut faire évoluer les présentes conditions afin de tenir compte de l’évolution du service, de ses fonctionnalités ou du cadre applicable. La date de dernière mise à jour est indiquée en haut de cette page.</p>
          ),
        },
        {
          title: "11. Contact",
          children: (
            <p>Pour toute question concernant les présentes CGU : <strong>redtrap.off@gmail.com (provisoire) </strong>.</p>
          ),
        },
      ]}
    />
  );
}
