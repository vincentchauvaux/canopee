# Agent - Canopée

## État du Projet

### ✅ Complété

1. **Structure de base du projet**
   - Configuration Next.js 14 avec TypeScript
   - Configuration Tailwind CSS avec charte graphique
   - Structure des dossiers (app/, components/, prisma/)

2. **Composants de base**
   - Header sticky avec transition au scroll et adaptation intelligente des couleurs de texte (blanc sur fond transparent, couleurs sombres sur fond blanc)
   - Hero section avec carrousel d'images automatique (7 images qui défilent toutes les 5 secondes) et citation aléatoire
   - Section Agenda (placeholder)
   - Section Fil d'actualité (placeholder)
   - Section Informations pratiques avec section dédiée au Yin Yoga (bienfaits, horaires, professeure)
   - Footer avec phase lunaire simulée et informations de contact réelles (Carol Nelissen, adresse Wauthier-Braine)

3. **Base de données**
   - Schéma Prisma complet avec tous les modèles
   - Relations entre les modèles configurées

4. **Authentification**
   - Configuration NextAuth.js
   - Support Email/Password, Google OAuth, Facebook OAuth
   - Page de connexion/inscription
   - API route pour l'inscription
   - Types TypeScript pour NextAuth
   - Gestion optimisée de Prisma (singleton pattern)

### 🚧 En cours / À faire

1. **Agenda** ✅
   - [x] Vue calendrier hebdomadaire avec navigation
   - [x] Affichage des cours avec couleurs par type
   - [x] Fonctionnalité de réservation/annulation
   - [x] API routes pour CRUD des cours
   - [x] API routes pour les réservations
   - [ ] Intégration Google Calendar API (à venir)
   - [ ] Intégration Microsoft Graph API (Outlook) (à venir)
   - [ ] Export vers calendrier personnel (à venir)

2. **Fil d'actualité** ✅
   - [x] API routes pour CRUD des actualités
   - [x] Affichage dynamique des articles en grid
   - [x] Modal détaillée pour chaque article
   - [x] Système de commentaires complet (créer, modifier, supprimer)
   - [x] Compteur de vues automatique
   - [x] Compteur de commentaires
   - [ ] Upload d'images pour les articles (à venir)

3. **Panel Admin** ✅
   - [x] Dashboard admin avec statistiques
   - [x] Gestion des actualités (CRUD complet)
   - [x] Gestion de l'agenda (CRUD complet)
   - [x] Gestion des utilisateurs (liste et statistiques)
   - [x] Modération des commentaires (via API)
   - [x] Statistiques de fréquentation (réservations, vues, commentaires)

4. **Profil utilisateur**
   - [ ] Page de profil
   - [ ] Upload de photo de profil
   - [ ] Édition des informations
   - [ ] Historique des cours
   - [ ] Calendrier personnel synchronisé
   - [ ] Paramètres de notification

5. **Fonctionnalités avancées**
   - [ ] Intégration API phase lunaire réelle
   - [ ] Notifications en temps réel
   - [ ] Email de confirmation de réservation
   - [ ] Système de paiement (optionnel)

## Architecture Technique

### Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js v4
- **Validation**: Zod

### Structure des fichiers

```
yoga/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts
│   │       └── register/route.ts
│   ├── auth/
│   │   └── signin/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Agenda.tsx
│   ├── NewsFeed.tsx
│   ├── PracticalInfo.tsx
│   └── Footer.tsx
├── images/
│   ├── background/
│   └── Informations/
├── lib/
│   ├── auth.ts
│   └── prisma.ts
├── types/
│   └── next-auth.d.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

## Charte Graphique - Canopée

### Couleurs
- Primaire: `#264E36` (Vert Canopée - Feuillage profond)
- Primaire clair: `#4F7F5A` (Vert feuille tendre)
- Secondaire: `#7DAA6A` (Mousse douce)
- Secondaire clair: `#AFCFA1` (Lichen)
- Accent: `#F2E8C9` (Lumière forestière)
- Texte: `#2A2D23` (Écorce foncée), `#FFFFFF` (Blanc)
- Neutre: `#DAD7CD` (Écorce claire)

### Typographie
- Titres: Cormorant Garamond (serif)
- Corps: Inter / Montserrat (sans-serif)

## Prochaines Étapes

1. Implémenter l'agenda avec calendrier interactif
2. Créer les API routes pour les actualités
3. Développer le système de commentaires
4. Créer le panel admin
5. Ajouter la gestion des réservations
6. Implémenter les intégrations API (Google Calendar, Outlook)

## Notes

- Le projet utilise Next.js 14 avec App Router
- L'authentification est gérée par NextAuth.js
- La base de données utilise Prisma ORM avec singleton pattern pour éviter les connexions multiples
- Le design est responsive et mobile-first
- Les composants sont en TypeScript avec typage strict
- Types TypeScript personnalisés pour NextAuth et types partagés
- Documentation complète (README.md, INSTALLATION.md)

## Informations sur le Yin Yoga

Le site présente le cours de Yin Yoga avec les informations suivantes :
- **Horaires** : Vendredi de 18h à 19h
- **Adresse** : Rue Jean Theys, 10, 1440 Wauthier-Braine
- **Professeure** : Carol Nelissen
  - Certifiée E.T.Y. et Karma Yoga Institute
  - Membre ABEFY
- **Site web** : canopee-yin-yoga.com
- **Bienfaits** :
  - Action sur les tissus profonds (articulations, fascias…)
  - Développement de la pleine conscience des sensations physiques et mentales
  - Travail sur les méridiens
- **Indications** :
  - Vie trop stressante (trop yang)
  - Tensions dans le corps
  - Sentiment de déséquilibre généralisé
- **Origine** : Inspiré du yoga taoïste et de la médecine traditionnelle chinoise

## Fichiers Créés

### Configuration
- `package.json` - Dépendances du projet
- `tsconfig.json` - Configuration TypeScript
- `tailwind.config.ts` - Configuration Tailwind CSS
- `next.config.js` - Configuration Next.js (domaines d'images externes configurés : lunopia.com)
- `.eslintrc.json` - Configuration ESLint
- `.gitignore` - Fichiers à ignorer

### Application
- `app/layout.tsx` - Layout principal avec providers
- `app/page.tsx` - Page d'accueil one-page
- `app/globals.css` - Styles globaux et polices
- `app/providers.tsx` - Providers React (NextAuth)
- `app/auth/signin/page.tsx` - Page de connexion/inscription
- `app/saisons-mtc/page.tsx` - Page dédiée aux saisons en Médecine Traditionnelle Chinoise avec toutes les informations détaillées
- `app/yin-yoga/page.tsx` - Page dédiée au Yin Yoga de Canopée avec présentation complète : origine, pratique, bienfaits et informations pratiques
- `app/mon-parcours/page.tsx` - Page "Carol Nelissen" présentant son parcours de formation (Viniyoga, Yin Yoga), sa philosophie et ses certifications. La première image est affichée en cercle parfait (rounded-full) et la deuxième image occupe toute la hauteur de sa colonne.
- `app/faq/page.tsx` - Page FAQ présentant les informations sur les cours de Yin Yoga : types de cours (individuel ou collectif, max 3 personnes), horaires (individuel selon convenance, collectif vendredi 18h-19h), prix (individuel 15€, collectif 12€) et modalités (individuel adapté aux besoins, collectif thématiques annoncées)
- `app/admin/page.tsx` - Dashboard administrateur
- `app/admin/classes/page.tsx` - Gestion des cours
- `app/admin/news/page.tsx` - Gestion des actualités
- `app/admin/users/page.tsx` - Gestion des utilisateurs

### API Routes
- `app/api/auth/[...nextauth]/route.ts` - Handler NextAuth
- `app/api/auth/register/route.ts` - API d'inscription
- `app/api/classes/route.ts` - CRUD des cours (GET, POST)
- `app/api/classes/[id]/route.ts` - Gestion d'un cours spécifique (GET, PATCH, DELETE)
- `app/api/bookings/route.ts` - Gestion des réservations (GET, POST)
- `app/api/bookings/[id]/route.ts` - Annulation d'une réservation (DELETE)
- `app/api/news/route.ts` - CRUD des actualités (GET, POST)
- `app/api/news/[id]/route.ts` - Gestion d'une actualité (GET, PATCH, DELETE)
- `app/api/news/[id]/comments/route.ts` - Commentaires d'une actualité (GET, POST)
- `app/api/comments/[id]/route.ts` - Gestion d'un commentaire (PATCH, DELETE)
- `app/api/admin/users/route.ts` - Liste des utilisateurs (admin uniquement)
- `app/api/admin/bookings/route.ts` - Liste des réservations (admin uniquement)
- `app/api/lunar/route.ts` - Récupération des informations lunaires depuis lunopia.com (phase, illumination, image dynamique)

### Composants
- `components/Header.tsx` - Header sticky avec transition et adaptation automatique des couleurs de texte selon le background (blanc sur fond transparent, couleurs sombres sur fond blanc). Sur les pages `/profile` et `/mon-parcours`, le header a un fond blanc dès le départ (pas d'effet de transparence)
- `components/Hero.tsx` - Section hero avec carrousel d'images automatique (7 images qui défilent toutes les 5 secondes) et citation aléatoire
- `components/Agenda.tsx` - Section agenda interactive avec calendrier hebdomadaire, réservations
- `components/NewsFeed.tsx` - Fil d'actualité affichant les descriptions des prochains cours (3 par défaut, bouton "Voir plus" pour afficher plus)
- `components/NewsModal.tsx` - Modal pour afficher les détails d'une actualité
- `components/CommentSection.tsx` - Section de commentaires avec CRUD
- `components/PracticalInfo.tsx` - Informations pratiques avec section dédiée au Yin Yoga présentant les bienfaits, les horaires (vendredi 18h-19h), l'adresse (Rue Jean Theys, 10, 1440 Wauthier-Braine), et les informations sur la professeure Carol Nelissen (certifiée E.T.Y. et Karma Yoga Institute, membre ABEFY)
- `components/Footer.tsx` - Footer avec phase lunaire récupérée depuis lunopia.com (image dynamique incluse), saisons de la médecine traditionnelle chinoise (MTC) avec dates 2025 précises et citation du jour. Mise à jour automatique : phase lunaire toutes les heures, saison MTC et citation chaque jour à minuit. Lien vers la page dédiée aux saisons MTC. Informations de contact réelles : adresse (Rue Jean Theys, 10, 1440 Wauthier-Braine), professeure Carol Nelissen, lien vers canopee-yin-yoga.com
- `components/admin/ClassFormModal.tsx` - Formulaire de création/modification de cours
- `components/admin/NewsFormModal.tsx` - Formulaire de création/modification d'actualité

### Utilitaires
- `lib/auth.ts` - Configuration NextAuth
- `lib/prisma.ts` - Client Prisma singleton
- `types/next-auth.d.ts` - Types NextAuth
- `types/index.ts` - Types partagés

### Base de données
- `prisma/schema.prisma` - Schéma complet de la base de données

### Documentation
- `README.md` - Documentation principale
- `INSTALLATION.md` - Guide d'installation détaillé
- `agent.md` - État du projet et notes

