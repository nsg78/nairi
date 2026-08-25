# Nairi Corporation V4 — Corporation & Logistics

Cette version recentre complètement la plateforme sur **Nairi Corporation** et **Nairi Logistics**.

## Changements V4

- Suppression de toute formulation OOC dans le site public.
- Refonte de la présentation Logistics : ravitaillement, desserte dédiée, urgence, fret sur mesure, inter-sites et transport sensible.
- Nairi Corporation conserve une place centrale : mise en relation, sourcing, négociation et gestion de dossier.
- Suivi client **uniquement avec le numéro de téléphone** : aucune référence à mémoriser.
- Si un numéro possède plusieurs demandes, le client retrouve une liste de ses dossiers puis ouvre celui qu'il souhaite suivre.
- Réponses client / Nairi directement dans le dossier.
- Notes internes invisibles du client côté opérations.
- Flotte Logistics administrable : ajout, modification, suppression, image, marque, catégorie, immatriculation, capacité/usage, statut et visibilité publique.
- Partenaires administrables avec image + texte + lien optionnel.
- Nouvelle identité visuelle **Basalte / Tuf / Ivoire** : plus chaude, plus éditoriale et moins générique que la V3, sans revenir au noir/or.

## Installation locale

```bash
npm install
npm run dev
```

Sans variables Supabase, le site démarre en **mode démo local** avec `localStorage`.

## Supabase

Dans Supabase > SQL Editor, exécuter :

`supabase-v4.sql`

Le script fonctionne sur une base neuve ou sur la base des versions précédentes. Il conserve les anciennes tables Automotive mais elles ne sont pas utilisées par cette version.

Créer ensuite un utilisateur dans **Authentication > Users**, puis adapter et exécuter :

`STAFF-BOOTSTRAP.sql`

Variables Vercel / `.env` :

```env
VITE_SUPABASE_URL=https://TON-PROJET.supabase.co
VITE_SUPABASE_ANON_KEY=TA_CLE_ANON
```

## Suivi par téléphone

Le client n'a plus besoin de conserver une référence.

Le numéro renseigné lors de l'ouverture du dossier permet de retrouver ses demandes. Les références internes (`NC-...` / `NL-...`) restent visibles uniquement dans l'espace opérations afin de faciliter le travail de l'équipe.

Les RPC utilisées sont :

- `track_cases_by_phone(phone)`
- `case_public_messages_by_phone(case_id, phone)`
- `reply_case_by_phone(case_id, phone, body)`

## Flotte

Le menu **Flotte** de l'espace opérations permet de gérer le catalogue sans modifier le code :

- ajouter un véhicule ;
- modifier son image et sa description ;
- définir marque / catégorie / immatriculation / capacité ;
- changer son statut ;
- masquer temporairement un véhicule ;
- supprimer un véhicule.

La grille publique s'adapte automatiquement à 1, 2, 3, 4 véhicules ou davantage.

## FiveM

Le dossier `fivem/` reste disponible pour l'intégration NUI. Le frontend public est responsive et peut également être utilisé comme base pour une application téléphone FiveM.
