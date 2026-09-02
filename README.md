# IMEX Logistics V6

Site IC full logistics pour Los Santos.

## Identité
- Nom public : IMEX Logistics
- Palette : rouge / blanc / bleu foncé
- Positionnement : livraison, transport routier, ravitaillement, fret et dessertes d'entreprise

## Fonctionnalités conservées
- Ouverture de demandes logistiques
- Suivi client par téléphone
- Flotte dynamique administrable depuis le staff
- Recrutement (chauffeur PL, dispatcher/exploitant, commercial/conseiller)
- Back-office : missions, flotte, finance, candidatures
- Supabase Auth + RLS

## Vercel
Variables nécessaires :
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Après déploiement, exécuter `supabase-imex-v6.sql` une fois dans Supabase SQL Editor. Cette migration conserve l'historique existant.
