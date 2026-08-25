# Nairi Corporation V3 — Corporate & Logistics

Cette version retire temporairement **Automotive** et concentre le projet sur :

- **Nairi Corporation** : mise en relation, sourcing, négociation et gestion de dossiers.
- **Nairi Logistics** : ravitaillement entreprise, desserte récurrente, urgence, fret hors-script, transfert inter-sites et convois sensibles.
- **Dossiers clients** : ouverture rapide sans compte, référence unique, suivi par référence + téléphone, réponses client/staff.
- **Back-office staff** : qualification, affectation, statuts, réponses publiques, notes internes, partenaires, flotte, finance, recrutement.
- **Partenaires** : ajout / modification depuis le back-office avec image, texte, label et lien externe optionnel.
- **FiveM** : interface responsive et base NUI conservée.

## 1. Tester sans Supabase

Le projet fonctionne en **mode démo** si aucune variable Supabase n'est définie.
Les données sont alors enregistrées dans le `localStorage` du navigateur.

```bash
npm install
npm run dev
```

Ouvre ensuite l'URL indiquée par Vite. Le bouton Staff permet d'ouvrir le back-office en mode démo.

## 2. Installer Supabase

Dans ton projet Supabase :

1. Va dans **SQL Editor**.
2. Colle le contenu de `supabase-v3.sql`.
3. Clique sur **Run**.

Le script est prévu pour être exécuté sur une base neuve **ou par-dessus l'ancienne V1/V2**. Les anciennes tables Automotive ne sont pas supprimées : elles ne sont simplement plus utilisées par la V3.

### Créer le compte staff

1. Supabase > **Authentication > Users** > ajoute ton compte.
2. Ouvre `STAFF-BOOTSTRAP.sql`.
3. Remplace `TON-EMAIL@EXEMPLE.COM`.
4. Exécute le bloc dans SQL Editor.

Pour un autre membre du staff, duplique simplement l'INSERT avec son e-mail et son nom.

## 3. Variables Vercel

Copie `.env.example` en `.env.local` pour le développement local, ou ajoute ces variables dans Vercel :

```env
VITE_SUPABASE_URL=https://TON-PROJET.supabase.co
VITE_SUPABASE_ANON_KEY=TA_CLE_PUBLIQUE_ANON
VITE_DISCORD_URL=https://discord.gg/TONDISCORD
```

N'utilise **jamais** la clé `service_role` dans Vercel côté frontend.

## 4. Déploiement Vercel

Le projet est un Vite standard.

- Build command : `npm run build`
- Output directory : `dist`

Le fichier `vercel.json` gère déjà le fallback SPA.

## 5. Fonctionnement des dossiers

### Côté client

Le client clique sur **Ouvrir un dossier** puis choisit :

- **Nairi Corporation** : mise en relation, sourcing, négociation, gestion.
- **Nairi Logistics** : ravitaillement, desserte, urgence, fret spécial, transfert ou convoi.

Après validation, il reçoit une référence du type :

- `NC-260825-AB12` pour Corporation
- `NL-260825-CD34` pour Logistics

Il peut ensuite ouvrir **Suivre un dossier**, saisir cette référence + le téléphone de la demande, consulter le statut et répondre au staff.

### Côté staff

Dans **Nairi / Operations** :

- ouvrir un dossier ;
- affecter un responsable ;
- changer son statut ;
- répondre au client ;
- ajouter une **note interne** invisible du client ;
- voir l'historique complet.

Statuts disponibles :

`Nouveau → Qualifié → Accepté → Planifié → En cours → Terminé`

Avec en plus : `Attente client`, `Refusé`, `Annulé`.

## 6. Site vs Discord

La V3 évite volontairement de remplacer Discord à 100 %.

**Site Nairi** : tout ce qui mérite un numéro de dossier, un responsable, un statut, un historique ou une clôture.

**Discord** : discussions rapides, communauté, vocal, échanges qui ne nécessitent pas de suivi structuré.

Cela évite d'avoir deux outils qui font exactement la même chose.

## 7. Partenaires

Back-office > **Partenaires** > Ajouter :

- Nom
- Label
- Image URL
- Texte
- Lien externe optionnel
- Ordre d'affichage
- Visible / masqué

Le bloc apparaît automatiquement sur le site public.

## 8. Logistics — logique RP prévue

La branche a été pensée comme une vraie entreprise de transport autour du script camionneur :

- contrats de desserte avec les entreprises ;
- ravitaillements réguliers ;
- ruptures de stock urgentes ;
- missions hors-script ;
- transport de marchandises RP ;
- transferts inter-sites ;
- convois sensibles ;
- affectation interne et suivi des missions.

Le client ne réserve pas un Pounder : il réserve **une prestation**. Nairi choisit ensuite le véhicule adéquat.

## 9. FiveM

Le dossier `fivem/` contient un lanceur NUI générique.

Pour une intégration comme application native dans un téléphone FiveM (LB Phone, NPWD, QS, etc.), il faudra adapter seulement la déclaration spécifique au téléphone utilisé.

## 10. Direction artistique V3

La DA abandonne :

- le noir/or générique ;
- le rouge/noir de la V2 ;
- les coordonnées, HUD et éléments pseudo-militaires de l'ancien design.

La nouvelle identité utilise :

- graphite profond ;
- ivoire chaud ;
- gris minéral ;
- accent acier/pétrole très discret ;
- grands blocs éditoriaux ;
- visuels Logistics plus importants ;
- interface staff volontairement plus fonctionnelle que le site public.
