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
              <div><p><strong>Cookies actuellement définis par le serveur C-Cool :</strong></p><ul className="list-disc space-y-1 pl-5"><li><code>c_cool_ed_token</code> : session École Directe côté serveur — maximum 7 jours — HTTP-only.</li><li><code>c_cool_ed_student</code> : identifiant technique du compte École Directe utilisé pour les appels serveur — maximum 7 jours — HTTP-only.</li><li><code>c_cool_ed_school</code>, <code>c_cool_ed_school_name</code>, <code>c_cool_ed_school_id</code>, <code>c_cool_ed_school_rne</code> : informations techniques d’établissement nécessaires au fonctionnement — maximum 7 jours — HTTP-only.</li><li><code>c_cool_ed_class_id</code>, <code>c_cool_ed_class_code</code>, <code>c_cool_ed_class_name</code> : informations techniques de classe — maximum 7 jours — HTTP-only.</li><li><code>c_cool_ed_role</code>, <code>c_cool_ed_account_type</code> : rôle et type de compte nécessaires au fonctionnement — maximum 7 jours — HTTP-only.</li><li><code>c_cool_ed_pending_token</code>, <code>c_cool_ed_pending_2fa</code>, <code>c_cool_ed_pending_cookie</code> : données temporaires de connexion/QCM — maximum 10 minutes — HTTP-only.</li></ul><p>Les cookies de session sont configurés en <code>SameSite=Lax</code> et avec l’attribut <code>Secure</code> en production. Ils sont utilisés pour le fonctionnement et la sécurité de l’authentification ; leur qualification juridique définitive comme traceurs strictement nécessaires doit être confirmée lors de l’audit final.</p></div>
            </>
          ),
        },
        {
          title: "3. Traceurs soumis au consentement",
          children: (
            <>
              <p>Si C-Cool ajoute des traceurs de mesure d’audience, de publicité, de réseaux sociaux ou d’autres fonctionnalités nécessitant un consentement, ils ne devront être activés qu’après le recueil d’un consentement valide lorsque la réglementation l’exige.</p>
              <p>Le refus doit être aussi simple que l’acceptation et le retrait du consentement doit rester possible à tout moment.</p>
              <p><strong>Mesure d’audience :</strong> aucune utilisation active de Firebase Analytics n’a été trouvée dans le code actuel. En revanche, Firebase App Check utilise reCAPTCHA Enterprise en production lorsqu’il est configuré ; ce dispositif doit être inclus dans l’audit des services tiers et de leurs éventuels traceurs avant publication définitive.</p>
            </>
          ),
        },
        {
          title: "4. Gestion des préférences",
          children: (
            <>
              <p><strong>Gestionnaire de consentement :</strong> aucun.</p>
              <p>Si un gestionnaire de consentement est utilisé, le lien permettant de modifier ou retirer les choix devra rester accessible depuis le site.</p>
            </>
          ),
        },
        {
          title: "5. Services tiers",
          children: (
            <>
              <p>C-Cool utilise des services tiers pour certaines fonctions techniques. Leur comportement en matière de cookies ou de traceurs doit être vérifié avant chaque mise en production.</p>
              <p><strong>Liste finale des services tiers déposant ou lisant des traceurs :</strong> Firebase App Check / reCAPTCHA Enterprise doit être vérifié sur le site déployé. Aucun autre service de mesure d’audience n’est actuellement appelé par le code identifié.</p>
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
