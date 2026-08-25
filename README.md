# Nairi Corporation V5.3 — Simple Business

V5.3 reprend la base fonctionnelle Corporation + Logistics et conserve la DA Steel & Slate, avec une interface publique beaucoup plus courte et mobile-first.

## Déploiement

Remplace le contenu du dépôt par celui de ce dossier puis pousse sur Git. Vercel reconstruira l'application Vite automatiquement.

Les fichiers réellement utilisés par Vite sont notamment :

- `src/main.jsx`
- `src/styles.css`
- `public/assets/nairi-logo.png`

Évite de déposer des copies de `main.jsx` ou `styles.css` à la racine du dépôt.

## Supabase

Si la base V4 est déjà installée, **aucune nouvelle requête SQL n'est nécessaire pour V5.3**.

Pour une nouvelle installation, utilise `supabase-v4.sql`, puis crée le compte staff avec `STAFF-BOOTSTRAP.sql`.

## Changements principaux

- page publique raccourcie ;
- navigation mobile revue ;
- rails horizontaux sur mobile pour services, flotte, partenaires et carrières ;
- boutons Demande / Suivi persistants sur téléphone ;
- formulaire Logistics fortement simplifié ;
- date, fréquence et priorité facultatives et masquées par défaut ;
- suivi toujours uniquement par numéro de téléphone ;
- gestion des candidatures staff améliorée avec filtres, fiche et notes internes ;
- flotte toujours administrable depuis l'espace staff.

## FiveM

Le front reste responsive et compatible avec l'intégration NUI prévue dans le dossier `fivem/`.
