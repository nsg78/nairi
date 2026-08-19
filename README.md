# Nairi Corporation — V1 Platform

Plateforme RP GTA V / FiveM : site public + formulaires + suivi de dossier + back-office staff + Automotive + Logistics + recrutement + finances.

## Ce qui est déjà codé

- Homepage Nairi Corporation (Advisory, Automotive, Logistics)
- Demande de mise en relation / Advisory
- Catalogue Automotive dynamique
- Réservation véhicule + chauffeur + durée + estimation + caution
- Demande Logistics : ravitaillement, urgence, transport spécial, convoi sécurisé
- Recrutement : poids lourd, chauffeur privé, conseiller/commercial
- Référence de dossier générée côté client
- Suivi d'un dossier avec référence + téléphone
- Login staff Supabase Auth
- Dashboard staff
- Gestion des statuts des demandes
- CRUD catalogue Automotive
- Journal Finance entrée / sortie
- Gestion des candidatures
- Base de flotte Logistics
- Mode démo automatique sans Supabase
- Responsive mobile / WebView
- Resource FiveM NUI générique fourni dans `/fivem`

---

# Installation la plus simple

## 1. Supabase

1. Crée un projet sur Supabase.
2. Ouvre **SQL Editor** → **New query**.
3. Copie-colle **tout le fichier `supabase.sql`** et exécute-le.
4. Ouvre **Authentication → Users → Add user** et crée ton compte staff avec e-mail + mot de passe.
5. Retourne dans SQL Editor et exécute les 4 lignes tout en bas de `supabase.sql` après avoir remplacé l'e-mail. Cela transforme ce compte en staff Nairi.

Aucune autre table n'est à créer à la main.

## 2. Variables Supabase

Copie `.env.example` en `.env` :

```bash
VITE_SUPABASE_URL=https://TON-PROJET.supabase.co
VITE_SUPABASE_ANON_KEY=TA_CLE_ANON_OU_PUBLISHABLE
```

Dans Supabase tu trouves ces valeurs dans les réglages API du projet.

**Ne mets jamais la clé `service_role` / secret dans ce frontend.** La clé navigateur + les règles RLS du SQL suffisent.

## 3. Lancer en local

```bash
npm install
npm run dev
```

Vite te donnera une URL locale.

Si tu ne mets aucune variable Supabase, le site démarre quand même en **mode démo** : pratique pour tester l'interface sans rien configurer.

## 4. Vercel

Tu peux remplacer le contenu de ton repo actuel par ce projet, puis push Git.

Dans Vercel :

- Framework : normalement détecté automatiquement comme **Vite**
- Build command : `npm run build`
- Output directory : `dist`
- Ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans **Project Settings → Environment Variables**
- Redéploie

`vercel.json` est déjà présent pour éviter les problèmes de routes / refresh.

---

# Accès staff

Sur le site : bouton **Staff** en haut, ou `/#staff`.

Le dashboard possède actuellement :

- Vue générale
- Demandes Automotive / Logistics / Advisory
- Automotive : ajout / modification / suppression des véhicules
- Logistics : aperçu missions + flotte
- Finance : entrées / sorties
- Recrutement : entretien / acceptation / refus

---

# Images

Le logo fourni est local dans `public/assets/nairi-logo.png`.
Les images des véhicules utilisent pour l'instant les URLs que tu as données. Pour une version définitive, le plus propre sera de mettre les images dans `public/assets` ou dans Supabase Storage afin de ne plus dépendre des sites externes.

---

# FiveM

Le dossier `/fivem` contient un resource générique avec `/nairi` + F6 et support de fermeture Échap.
Pour l'intégrer **dans le téléphone du serveur**, il faudra seulement connaître le script de téléphone utilisé afin d'écrire son fichier d'enregistrement d'app spécifique.

L'URL normale est adaptée au téléphone. Le mode NUI plein écran utilise :

`https://TON-DOMAINE.vercel.app/?fivem=1`

---

# Idées V1.1 déjà prévues par la BDD

Le SQL contient déjà de quoi poursuivre avec : affectation d'un staff, affectation chauffeur/véhicule fret, caution encaissée/restituée, dégâts, notes internes et liaison des écritures Finance aux opérations.
