# Intégration FiveM

Cette V3 contient deux modes :

1. **Site / téléphone web** : ouvre directement `https://TON-DOMAINE.vercel.app/`.
2. **NUI plein écran** : utilise `?fivem=1`, puis le resource Lua envoie le message `open`.

## Installation NUI générique

- Copie le dossier `fivem` dans tes resources, par exemple `resources/[nairi]/nairi_app`.
- Remplace `TON-DOMAINE.vercel.app` dans `fxmanifest.lua`.
- Ajoute `ensure nairi_app` dans `server.cfg`.
- `/nairi` ou F6 ouvre l'interface.
- Échap ferme l'interface.

## Pour une vraie app dans le téléphone FiveM

Le frontend est déjà responsive et peut être affiché dans une WebView / iframe avec l'URL du site.
La déclaration exacte de l'app dépend du script téléphone utilisé (LB Phone, NPWD, qs-smartphone, etc.).
Une fois le nom du téléphone connu, il suffit d'adapter son fichier de déclaration d'app : le site lui-même n'a pas à être recodé.
