import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Données personnelles & confidentialité",
  description: "Politique de confidentialité et de protection des données de C-Cool.",
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Données personnelles & confidentialité"
      intro="Cette page explique quelles données C-Cool traite, pourquoi, avec quels prestataires et quels droits peuvent être exercés. Les éléments marqués « À COMPLÉTER » doivent être vérifiés avant la mise en production publique."
      sections={[
        {
          title: "1. Responsable du traitement",
          children: (
            <>
              <p><strong>Responsable du traitement :</strong> [À COMPLÉTER — identité juridique exacte]</p>
              <p><strong>Contact vie privée / données :</strong> [À COMPLÉTER — e-mail]</p>
              <p><strong>DPO :</strong> [À COMPLÉTER — nom/contact si un DPO est désigné ou si un DPO est concerné par le dispositif retenu]</p>
            </>
          ),
        },
        {
          title: "2. Données traitées",
          children: (
            <>
              <p>Selon les fonctionnalités utilisées, C-Cool peut traiter notamment :</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>des informations de compte et d’identification nécessaires à l’accès au service ;</li>
                <li>des informations scolaires récupérées depuis École Directe, telles que la classe, l’emploi du temps, les devoirs et les informations nécessaires au fonctionnement des fonctionnalités concernées ;</li>
                <li>des contenus créés ou proposés dans C-Cool, notamment les contributions, corrections, notes de cours ou exercices ;</li>
                <li>des préférences d’utilisation, par exemple les préférences d’affichage ;</li>
                <li>des informations techniques nécessaires à la sécurité, au fonctionnement et au diagnostic du service.</li>
              </ul>
              <p><strong>Liste exacte des données stockées dans Firebase / autres prestataires :</strong> [À COMPLÉTER après inventaire technique final].</p>
            </>
          ),
        },
        {
          title: "3. Identifiants École Directe",
          children: (
            <>
              <p>Les identifiants nécessaires à la connexion à École Directe sont utilisés pour authentifier la session. Le mot de passe École Directe n’a pas vocation à être enregistré dans Firestore.</p>
              <p>Des jetons techniques de session peuvent être utilisés côté serveur pour maintenir l’accès aux fonctionnalités École Directe. <strong>Durée exacte de conservation / expiration des jetons :</strong> [À COMPLÉTER après vérification technique].</p>
              <p>Ne communique jamais ton mot de passe ou tes jetons de session à un autre utilisateur.</p>
            </>
          ),
        },
        {
          title: "4. Finalités des traitements",
          children: (
            <>
              <p>Les données peuvent être utilisées pour :</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>authentifier l’utilisateur et sécuriser son compte ;</li>
                <li>fournir les fonctionnalités demandées ;</li>
                <li>afficher et organiser les informations scolaires ;</li>
                <li>enregistrer les préférences de l’utilisateur ;</li>
                <li>permettre la proposition, la modération et la publication de contributions ;</li>
                <li>prévenir les abus et assurer la sécurité du service ;</li>
                <li>diagnostiquer les erreurs et maintenir le service.</li>
              </ul>
            </>
          ),
        },
        {
          title: "5. Bases légales",
          children: (
            <>
              <p>Chaque traitement doit être rattaché à une base légale adaptée au contexte réel du service. C-Cool prévoit notamment de distinguer, selon les traitements, l’exécution du service demandé, l’intérêt légitime lorsque ses conditions sont réunies, l’obligation légale lorsqu’elle s’applique et le consentement lorsqu’il est requis.</p>
              <p><strong>Tableau final des traitements, finalités, données, bases légales et durées :</strong> [À COMPLÉTER ET VALIDER AVANT PUBLICATION].</p>
            </>
          ),
        },
        {
          title: "6. Destinataires et prestataires",
          children: (
            <>
              <p>Les données peuvent être traitées par C-Cool et par les prestataires techniques indispensables au fonctionnement du service.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li><strong>Firebase / Google Cloud :</strong> authentification et stockage de données applicatives, selon les services effectivement activés.</li>
                <li><strong>Hébergeur web :</strong> [À COMPLÉTER — Vercel ou autre solution finalement retenue].</li>
                <li><strong>École Directe :</strong> service tiers utilisé pour récupérer les informations scolaires et assurer l’authentification École Directe.</li>
              </ul>
              <p><strong>Liste complète des sous-traitants et services tiers :</strong> [À COMPLÉTER après l’inventaire des dépendances et services réellement activés].</p>
            </>
          ),
        },
        {
          title: "7. Transferts hors de l’Union européenne",
          children: (
            <p><strong>À COMPLÉTER — indiquer les pays ou zones de traitement/transfert réellement concernés par Firebase, l’hébergeur, École Directe et tout autre prestataire, ainsi que le mécanisme juridique applicable lorsqu’un transfert est concerné.</strong></p>
          ),
        },
        {
          title: "8. Durées de conservation",
          children: (
            <>
              <p>Les données ne doivent être conservées que pendant une durée adaptée à leur finalité et aux obligations éventuellement applicables.</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Compte utilisateur : [À COMPLÉTER]</li>
                <li>Profil et données scolaires synchronisées : [À COMPLÉTER]</li>
                <li>Contributions : [À COMPLÉTER]</li>
                <li>Journaux de sécurité / diagnostic : [À COMPLÉTER]</li>
                <li>Demandes relatives aux droits : [À COMPLÉTER]</li>
                <li>Sessions / jetons techniques : [À COMPLÉTER]</li>
              </ul>
            </>
          ),
        },
        {
          title: "9. Droits des personnes",
          children: (
            <>
              <p>Selon le traitement concerné et les conditions prévues par le RGPD, les personnes peuvent disposer de droits d’accès, de rectification, d’effacement, de limitation, d’opposition et, lorsque les conditions sont réunies, de portabilité, ainsi que du droit de retirer un consentement lorsqu’un traitement repose sur celui-ci.</p>
              <p>Pour exercer un droit : <strong>[À COMPLÉTER — adresse e-mail / procédure]</strong>.</p>
              <p>Une réclamation peut également être adressée à la <a href="https://www.cnil.fr/" className="underline">CNIL</a>, autorité française de protection des données.</p>
            </>
          ),
        },
        {
          title: "10. Données concernant les mineurs",
          children: (
            <>
              <p>C-Cool peut être utilisé dans un contexte scolaire comprenant des utilisateurs mineurs. Les traitements doivent être configurés selon leur base légale réelle et les règles applicables aux mineurs.</p>
              <p><strong>À COMPLÉTER :</strong> préciser le rôle de l’établissement, des responsables légaux et de C-Cool dans le contexte de déploiement, ainsi que les modalités applicables lorsque le consentement est utilisé comme base légale.</p>
            </>
          ),
        },
        {
          title: "11. Sécurité",
          children: (
            <>
              <p>C-Cool met en œuvre des mesures techniques et organisationnelles destinées à protéger les données contre les accès non autorisés, la perte, l’altération ou la divulgation.</p>
              <p>Les mots de passe École Directe ne sont pas destinés à être stockés dans Firestore. Les droits d’accès aux données C-Cool sont contrôlés par l’authentification et les règles applicatives / Firestore.</p>
              <p><strong>Mesures de sécurité complémentaires à documenter :</strong> [À COMPLÉTER — sauvegardes, journalisation, procédure d’incident, gestion des comptes administrateurs, etc.].</p>
            </>
          ),
        },
        {
          title: "12. Mise à jour",
          children: (
            <p>Cette politique peut être mise à jour lorsque les traitements, les prestataires ou les fonctionnalités de C-Cool évoluent. La date de dernière mise à jour est indiquée en haut de la page.</p>
          ),
        },
      ]}
    />
  );
}
