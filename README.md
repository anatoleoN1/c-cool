# C-Cool

Plateforme éducative collaborative, construite avec Next.js, TypeScript et Firebase. Le socle actuel fournit l’authentification e-mail, les rôles, les règles de sécurité, les repositories Firestore et des algorithmes métier testés.

## Prérequis

- Node.js 20 LTS (adapté au Raspberry Pi 5) et npm ;
- un projet Firebase ;
- Firebase CLI, installée par les dépendances de développement ou globalement.

## Installation et développement

```bash
cp .env.example .env.local
cp .firebaserc.example .firebaserc
npm install
npm run dev
```

Renseignez dans `.env.local` les valeurs Web de Firebase. Les variables `NEXT_PUBLIC_FIREBASE_*` identifient publiquement une application Web Firebase : elles ne sont pas des secrets. Les clés Firebase Admin sont exclusivement serveur, sans préfixe `NEXT_PUBLIC_`, et ne doivent jamais être commitées.

La page `/connexion` permet l’inscription et la connexion e-mail/mot de passe une fois Firebase Authentication activé.

## Émulateurs Firebase

Dans `.env.local`, réglez `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`, puis lancez :

```bash
npx firebase emulators:start
```

L’interface Emulator est disponible sur `http://127.0.0.1:4000`. Activez Email/Password dans l’émulateur ou créez un utilisateur depuis C-Cool. Les ports sont définis dans `firebase.json`.

## Vérification

```bash
npm run lint
npm test
npm run build
```

## Architecture

- `app/` : routes Next.js App Router ;
- `components/auth` : contexte et formulaire d’authentification ;
- `components/layout` : navigation et enveloppe de l’application ;
- `lib/firebase` : SDK client, SDK Admin serveur et rôles ;
- `lib/repositories` : accès Firestore isolé des composants React ;
- `lib/domain` : règles métier pures ;
- `lib/algorithms` : similarité, répétition espacée, progression et plans de révision ;
- `lib/ed` : contrat d’adaptateur École Directe, sans implémentation ni identifiant ;
- `types/` : modèle de domaine ;
- `functions/` : Cloud Functions TypeScript, notamment attribution sécurisée des rôles.

Les données École Directe futures seront limitées au backend et séparées dans `edRaw`; aucune donnée d’identification École Directe ne doit être mise dans le client, Firestore en clair ou les journaux.

## Sécurité et rôles

Les rôles sont `student`, `moderator` et `admin`. Ils sont prévus dans le profil Firestore et les Firebase custom claims. La Cloud Function `setUserRole` est accessible uniquement à un administrateur.

Les règles de `firestore.rules` imposent notamment :

- un élève modifie son profil et ses données personnelles uniquement ;
- un élève crée seulement des contributions `pending` ;
- les données officielles ne sont écrites que par un administrateur ;
- les modérateurs accèdent à la file de modération ;
- les données brutes École Directe sont entièrement inaccessibles depuis le client.

Les SDK Admin et Cloud Functions contournent les Security Rules : chaque fonction doit donc vérifier explicitement l’identité et le rôle de son appelant.

## Déploiement Firebase

1. Créez/configurez le projet Firebase et copiez son identifiant dans `.firebaserc`.
2. Activez Authentication avec le fournisseur Email/Password.
3. Créez Firestore et Firebase Storage dans la même région.
4. Installez les dépendances des fonctions : `cd functions && npm install`.
5. Vérifiez le projet, puis déployez :

```bash
npx firebase deploy --only firestore:rules,firestore:indexes,storage,functions
```

Le déploiement du front Next.js sur Firebase App Hosting doit être configuré dans la console Firebase ; ne déployez jamais un fichier `.env.local` ni une clé de compte de service.
