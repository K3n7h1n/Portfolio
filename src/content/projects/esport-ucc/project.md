---
title: Esport UCC — Communication & stream
order: 3
category: Projet collectif · Affiche, overlays OBS et régie de stream
tag: Esport · Stream
short: "Projet collectif mené pendant ma formation autour du club esport : l'affiche de la réunion d'ouverture, puis tout l'habillage des lives (overlays OBS animés, transition et régie en direct)."
role: Projet collectif · affiche, design et développement des overlays
client: Club esport UCC · BUT MMI
year: 2026
tools:
  - Photoshop
  - HTML/CSS
  - JavaScript
  - Three.js
  - OBS Studio
  - Node.js
  - Claude Code
  - ChatGPT
cover: 01-affiche-reunion-ouverture.webp
---

## Le projet

Un projet collectif réalisé au cours de ma formation, pour donner une identité cohérente au club esport : de l'affiche qui lance l'année jusqu'à l'habillage complet des matchs diffusés en direct sur Twitch.

## L'affiche de la réunion d'ouverture

Pour annoncer la réunion d'ouverture de l'année, j'ai réalisé une affiche dynamique et immédiatement identifiable à l'univers de l'esport : une ambiance sombre dominée par le violet et le rose, des effets lumineux et une photographie centrale. La hiérarchie met d'abord en avant le titre de l'événement, puis les informations pratiques (date, heure, lieu). Réalisée sur **Photoshop** : traitement de l'image, effets lumineux, composition et typographie.

## Les overlays de stream

Dans la continuité de cette direction artistique, nous avons conçu l'habillage des lives du club : **treize scènes animées** pour OBS au style HUD / tech, aux couleurs de la charte.

- **Avant et après le live** : Starting Soon avec compte à rebours, Be Right Back, Fin de stream avec le prochain live.
- **Pendant le match** : scène de jeu avec score, jeu + caméra du joueur, plateau des commentateurs avec le chat Twitch.
- **Temps forts** : présentation des équipes, pick & ban des maps Valorant (images récupérées via une API publique), mi-temps, écran Victoire / Défaite automatique avec MVP et statistiques, écran « Problème technique ».
- **Alertes** follow, sub, bits, raid et don, avec file d'attente, sons et particules.
- **Transition** exportée en vidéo avec transparence (stinger OBS), et logo du club en 3D (three.js).

## Une régie pour piloter le live

Pour que n'importe quel membre du club puisse gérer un stream sans toucher au code, les overlays se pilotent depuis **une régie locale** : une page de formulaires (score, textes, timers, équipes, maps, réseaux…) avec aperçu en direct. Un petit serveur Node.js enregistre chaque réglage, et les scènes l'appliquent dans OBS en quelques secondes, sans recharger. La régie peut aussi s'intégrer directement à OBS comme panneau.

## La charte

Tout respecte la charte du club : six couleurs, des dégradés d'au moins trois teintes dans un ordre imposé, jamais de passage direct du cyan au magenta et jamais de blanc, y compris dans les shaders et les canvas.
