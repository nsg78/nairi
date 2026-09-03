# Post OP Logistics V8

Rebranding complet de la V7.1 vers **Post OP Logistics**.

## Direction
- Nom public : Post OP Logistics
- Positionnement : livraison, fret, ravitaillement, transport routier et dessertes
- Identité inspirée du logo lore GTA fourni : brun postal, orange, crème et blanc
- Le design reste moderne : cartes propres, gros hero, portail client simple, back-office cohérent
- Le Phantom devient le véhicule principal par défaut ; le Pounder n'est plus seedé en démo
- Flotte réelle Supabase inchangée et toujours modifiable via l'espace interne

## Palette
- Orange : #EFA21A
- Orange foncé : #CE8610
- Brun : #725D38
- Brun sombre : #3C2F1F
- Crème : #F3EEE4
- Blanc papier : #FFFDF9

## Déploiement
Remplacer `src/main.jsx` et `src/styles.css`, ajouter `public/assets/postop-logo.webp`.
Le SQL `supabase-postop-v8.sql` est uniquement nécessaire si tu veux aussi les nouvelles références `PO-...` et les messages système Post OP.
