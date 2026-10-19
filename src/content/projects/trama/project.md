---
title: TRAMA — Follow the Thread
order: 2
category: Lancement produit · Direction artistique, 3D & web
tag: 3D · Direction artistique
short: Lancement fictif d'un fauteuil Vitra autour d'un fil rouge, de la stratégie de communication au modèle 3D, en passant par les affiches, le motion et un site en scrollytelling.
role: Stratégie de communication, direction artistique, modélisation 3D et développement web
client: Vitra (projet étudiant fictif)
year: 2026
tools:
  - Blender
  - Three.js
  - JavaScript
  - HTML/CSS
  - Photoshop
  - After Effects
  - Claude Code
  - ChatGPT
links:
  - label: Voir le site démo
    url: https://trama-demo.netlify.app/
model: /models/trama-fauteuil.glb
cover: 01-affiche-follow-the-thread.jpg
---

## Le projet

**TRAMA** est un fauteuil lounge imaginé pour Vitra : coque en bois moulé, textile tissé en fibres recyclées, démontable et réparable. Un seul **fil de trame rouge** traverse le tissage et ressort en couture visible. En italien, *trama* désigne à la fois la trame d'un tissu et l'intrigue d'un récit.

Le brief : lancer ce fauteuil sur le Vitra Campus le 26 novembre 2026, en s'appuyant sur l'héritage de la marque (Eames, Panton, Prouvé) sans paraître tourné vers le passé.

## Le concept : Follow the Thread

Un fil rouge relie tout le lancement et change de rôle à chaque temps du parcours :

- **Passé** : il trace un trait continu entre les icônes de la collection ;
- **Présent** : il se tisse et devient la couture du fauteuil ;
- **Futur** : il s'allume, les fils convergent et la lumière révèle TRAMA.

Signature : *Past shaped us. Now we shape what comes next.* La charte reste volontairement sobre : noir, blanc et un seul rouge, toujours en ligne, jamais en fond.

## Ce que j'ai réalisé

- **Stratégie de communication** : benchmark, cibles, message, déroulé de la soirée et calendrier de diffusion (teaser, révélation, ouverture publique).
- **Affiches** : pré-lancement « Coming soon », affiche « Follow the Thread » et visuel « Sold out » pour l'après-lancement.
- **Motion design** : logo animé où le fil rouge écrit TRAMA, et teaser vidéo.
- **Modèle 3D** sous Blender, entièrement généré par scripts Python : coque, piètement, garnissage, coussins et passepoil. Chaque pièce est séparée et porte son décalage de vue éclatée. Export web compressé en Draco (≈ 4,5 Mo, textures 1K).
- **Site démo** en three.js : un seul fil rouge SVG se dessine au scroll à travers toute la page, le fauteuil s'ouvre pièce par pièce, puis le fil se détache seul avant la révélation.

Le modèle ci-dessous est celui du site : fais-le tourner, puis écarte ses pièces avec le curseur « Vue éclatée ».
