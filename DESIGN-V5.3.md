# Nairi Corporation — V5.3 Simple Business

## Direction

Cette version conserve l'identité **Steel & Slate** choisie pour Nairi : graphite, bleu acier, Cinzel pour les titres, Plus Jakarta Sans pour le texte et JetBrains Mono uniquement pour les micro-labels.

La différence avec la V5/V5.2 est surtout structurelle : la page est volontairement plus courte, plus lisible et plus simple à parcourir.

## Principes UX

- Une seule page publique, sans multiplication de sous-pages.
- Trois accès immédiats après le hero : Corporation, Logistics, suivi client.
- Corporation et Logistics restent visibles directement, sans clic obligatoire pour comprendre les services.
- Sur mobile, les cartes deviennent des rails horizontaux afin de réduire fortement le défilement vertical.
- Deux actions mobiles persistantes : **Demande** et **Suivi**.
- Les formulaires s'ouvrent plein écran sur téléphone.
- Les zones purement décoratives ou redondantes des versions précédentes ont été supprimées.

## Formulaire Logistics

Le formulaire Logistics ne demande plus :

- objet du dossier ;
- point de départ ;
- destination ;
- marchandise ;
- volume / quantité.

Le client renseigne seulement :

- type de demande ;
- nom et prénom ;
- téléphone ;
- entreprise (facultatif) ;
- description libre.

Date, fréquence et priorité sont conservées mais rangées dans **Ajouter des précisions**, fermé par défaut.

Le titre interne du dossier est généré automatiquement à partir du type de service.

## Carrières

Le formulaire public est raccourci : identité, téléphone, poste, disponibilités facultatives et présentation libre.

Dans l'espace staff, les candidatures disposent maintenant :

- de filtres rapides ;
- d'une fiche détaillée ;
- d'un changement de statut ;
- de notes internes ;
- des coordonnées et disponibilités centralisées.

Aucune migration SQL supplémentaire n'est nécessaire par rapport à `supabase-v4.sql` : la colonne `notes` existe déjà dans `applications`.
