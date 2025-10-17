# Comment ajouter vos vidéos à la page À propos

## 📁 Emplacement des vidéos

Placez vos vidéos dans le dossier : `public/videos/`

## 🎬 Vidéos recommandées

### Vidéo 1 : TikTok pour le compte MMI
- **Nom du fichier** : `tiktok-mmi.mp4`
- **Format recommandé** : MP4 (H.264)
- **Résolution** : 1920x1080 (Full HD) ou 1280x720 (HD)
- **Durée** : 10-30 secondes
- **Poids** : < 5 MB pour de meilleures performances

### Vidéo 2 : Participation au serveur vocal d'anime
- **Nom du fichier** : `anime-server.mp4`
- **Format recommandé** : MP4 (H.264)
- **Résolution** : 1920x1080 (Full HD) ou 1280x720 (HD)
- **Durée** : 10-30 secondes
- **Poids** : < 5 MB

### Vidéo 3 : Les jeux vidéo
- **Nom du fichier** : `jeux-video.mp4`
- **Format recommandé** : MP4 (H.264)
- **Résolution** : 1920x1080 (Full HD) ou 1280x720 (HD)
- **Durée** : 10-30 secondes
- **Poids** : < 5 MB

## 🔧 Modification du code

Une fois vos vidéos ajoutées dans `public/videos/`, ouvrez le fichier `src/pages/A-propos.astro` et remplacez les sections de vidéos :

### Pour la Vidéo 1 (TikTok MMI) :

```astro
<!-- Remplacer cette section -->
<div class="aspect-video bg-gradient-to-br from-red-600/80 to-orange-500/60 backdrop-blur-sm flex items-center justify-center">
    <div class="absolute inset-0 bg-gradient-to-br from-red-500/30 to-pink-500/30 group-hover:scale-110 transition-transform duration-500"></div>
    <div class="relative z-10 text-center">
        <svg class="w-20 h-20 text-white mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
        </svg>
    </div>
</div>

<!-- Par ce code -->
<video 
    autoplay 
    muted 
    loop 
    playsinline 
    class="w-full h-full object-cover aspect-video"
>
    <source src="/videos/tiktok-mmi.mp4" type="video/mp4">
    Votre navigateur ne supporte pas la lecture vidéo.
</video>
```

### Pour la Vidéo 2 (Anime Server) :

```astro
<!-- Remplacer cette section -->
<div class="aspect-video bg-gradient-to-br from-blue-600/80 to-purple-500/60 backdrop-blur-sm flex items-center justify-center">
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 group-hover:scale-110 transition-transform duration-500"></div>
    <div class="relative z-10 text-center">
        <svg class="w-20 h-20 text-white mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
        </svg>
    </div>
</div>

<!-- Par ce code -->
<video 
    autoplay 
    muted 
    loop 
    playsinline 
    class="w-full h-full object-cover aspect-video"
>
    <source src="/videos/anime-server.mp4" type="video/mp4">
    Votre navigateur ne supporte pas la lecture vidéo.
</video>
```

### Pour la Vidéo 3 (Jeux Vidéo) :

```astro
<!-- Remplacer cette section -->
<div class="aspect-video bg-gradient-to-br from-purple-600/80 to-pink-500/60 backdrop-blur-sm flex items-center justify-center">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 group-hover:scale-110 transition-transform duration-500"></div>
    <div class="relative z-10 text-center">
        <svg class="w-20 h-20 text-white mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
        </svg>
    </div>
</div>

<!-- Par ce code -->
<video 
    autoplay 
    muted 
    loop 
    playsinline 
    class="w-full h-full object-cover aspect-video"
>
    <source src="/videos/jeux-video.mp4" type="video/mp4">
    Votre navigateur ne supporte pas la lecture vidéo.
</video>
```

## 🎨 Optimisation des vidéos

### Avec FFmpeg (ligne de commande)

Pour optimiser vos vidéos et réduire leur taille :

```bash
# Installer FFmpeg si nécessaire : https://ffmpeg.org/download.html

# Compresser une vidéo
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -vf scale=1280:720 -b:v 1M output.mp4

# Pour un fichier encore plus léger
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -vf scale=854:480 -b:v 500k output.mp4
```

### Outils en ligne recommandés

- **HandBrake** : https://handbrake.fr/ (gratuit, desktop)
- **CloudConvert** : https://cloudconvert.com/mp4-converter (en ligne)
- **Clipchamp** : https://clipchamp.com/ (en ligne, Microsoft)

## 📊 Format vidéo recommandé

- **Codec vidéo** : H.264 (compatibilité maximale)
- **Codec audio** : AAC
- **Conteneur** : MP4
- **Bitrate vidéo** : 1-2 Mbps
- **FPS** : 30 ou 60
- **Ratio** : 16:9 (format horizontal)

## ⚡ Conseils de performance

1. **Optimisez la taille** : Visez < 5 MB par vidéo
2. **Résolution adaptée** : 720p suffit pour le web
3. **Courtes durées** : 10-30 secondes pour des boucles fluides
4. **Compression** : Utilisez un outil de compression avant upload
5. **Lazy loading** : Les vidéos se chargent uniquement quand visibles

## 🐛 Dépannage

### La vidéo ne s'affiche pas
- Vérifiez que le fichier est bien dans `public/videos/`
- Vérifiez le nom du fichier (sensible à la casse)
- Ouvrez la console du navigateur (F12) pour voir les erreurs

### La vidéo ne joue pas automatiquement
- Vérifiez que l'attribut `muted` est présent
- Les navigateurs bloquent l'autoplay des vidéos avec son

### La vidéo ralentit la page
- Réduisez la taille du fichier
- Utilisez une résolution plus basse (720p au lieu de 1080p)
- Augmentez la compression

## 🎯 Résultat attendu

Une fois les vidéos ajoutées :
- ✅ Lecture automatique en boucle
- ✅ Effet parallaxe au scroll
- ✅ Bordures néon au survol
- ✅ Transitions fluides
- ✅ Responsive sur tous les appareils

Pour plus d'aide, consultez la documentation Astro : https://docs.astro.build/
