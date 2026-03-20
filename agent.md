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
   - [x] Compteur de vues automatique
   - [ ] Upload d'images pour les articles (à venir)

3. **Panel Admin** ✅

   - [x] Dashboard admin avec statistiques
   - [x] Gestion des actualités (CRUD complet)
   - [x] Gestion de l'agenda (CRUD complet)
   - [x] Gestion des utilisateurs (liste et statistiques)
   - [x] Statistiques de fréquentation (réservations, vues)

4. **Profil utilisateur**

   - [x] Page de profil
   - [x] Upload de photo de profil (upload fichier ou URL)
   - [x] Édition des informations
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
- **Base de données**: PostgreSQL avec Prisma ORM (actuellement hébergé sur Supabase)
- **Authentification**: NextAuth.js v4
- **Validation**: Zod

### Indépendance avec Prisma

**Important** : Le projet utilise **Prisma comme ORM**, ce qui offre une **indépendance totale** vis-à-vis du fournisseur de base de données.

- ✅ **Prisma** = ORM (Object-Relational Mapping) - Outil pour interagir avec la base de données
- ✅ **Supabase** = Hébergement PostgreSQL (peut être remplacé facilement)

**Avantages de Prisma :**

- Indépendance du fournisseur : migration facile entre Supabase, Railway, Neon, PostgreSQL local, AWS RDS, etc.
- Aucun changement de code nécessaire : il suffit de modifier la `DATABASE_URL` dans `.env`
- Schéma type-safe avec TypeScript
- Migrations automatiques

**Pour changer de fournisseur PostgreSQL :**

1. Exporter les données depuis Supabase
2. Créer une base sur le nouveau fournisseur (Railway, Neon, local, etc.)
3. Importer les données
4. Mettre à jour `DATABASE_URL` dans `.env`
5. Aucun changement de code Prisma nécessaire

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

## Charte Graphique - Canopée (maquettes Google Stitch, mars 2026)

Le design suit l’esprit **« Botanical Editorial »** décrit dans `stitch-reference/stitch/canop_e_ether/DESIGN.md` : surfaces crème en couches, peu de bordures dures, boutons en pilule, hiérarchie éditoriale.

### Couleurs (système Stitch / Material)

- Fond & surfaces: `#fafaee` (surface), `#f4f4e8` (surface-container-low), `#ffffff` (surface-container-lowest), `#eeefe3` (surface-container)
- Primaire: `#334537` (+ `primary-container` `#4a5d4e` pour dégradés / variantes)
- Secondaire: `#516256`, `secondary-container` `#cfe2d2`
- Texte: `#1a1c15` (on-surface), variantes `#434843` / `#546558`
- Contours « fantômes »: `outline-variant` `#c3c8c1` (souvent en faible opacité)
- Palette historique `canopee.*` et alias `accent` / `gray` conservés dans Tailwind pour compatibilité

### Typographie

- Titres & éditorial: **Noto Serif** (`next/font` — variable `--font-noto-serif`)
- Corps & UI: **Manrope** (`--font-manrope`)

### Fichiers de référence design (local)

- Dossier extrait du zip Stitch : `stitch-reference/` (ignoré par Git — voir `.gitignore`)
- HTML exportés : `accueil_news`, `yin_yoga_carol`, `agenda_r_servation`, `espace_professeur`

### Couleurs historiques (documentation)

- Ancienne primaire projet: `#264E36` — toujours documentée sous `canopee.primary` dans Tailwind

## Prochaines Étapes

1. ✅ Implémenter l'agenda avec calendrier interactif
2. ✅ Créer les API routes pour les actualités
3. ✅ Créer le panel admin
4. ✅ Ajouter la gestion des réservations
5. 🚧 Finaliser le déploiement sur OVH (VPS-1)
6. [ ] Implémenter les intégrations API (Google Calendar, Outlook)

## Notes

- Le projet utilise Next.js 14 avec App Router
- L'authentification est gérée par NextAuth.js
- La base de données utilise Prisma ORM avec singleton pattern pour éviter les connexions multiples
- Le design est responsive et mobile-first
- Les composants sont en TypeScript avec typage strict
- Types TypeScript personnalisés pour NextAuth et types partagés
- Documentation complète (README.md, INSTALLATION.md)

## Dépôt Git

- **Repository GitHub** : `git@github.com:vincentchauvaux/canopee.git`
- **Branche principale** : `main`
- **Branche VPS** : `main` (doit être utilisée sur le VPS en production)
- **Branche `Carol`** : travail et livrables côté Carol (nom exact sur le remote : `origin/Carol`)
- **Branche `vinc`** : branche de travail Vincent ; pour y intégrer le dernier état de Carol puis pousser :
  ```bash
  git checkout vinc && git fetch origin && git merge origin/Carol && git push origin vinc
  ```
- Projet initialisé et poussé sur GitHub avec commit initial

**Dernière synchro `Carol` → `vinc` (push)** : 20 mars 2025 — fast-forward `5d3982d..ddf82f6` sur `origin/vinc`.

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

- `app/layout.tsx` - Layout avec providers, **coquille Stitch** (top bar, zone contenu, footer léger, bottom nav)
- `app/page.tsx` - Accueil éditorial (`HomeStitch`) sans hero plein écran
- `app/globals.css` - Styles globaux et polices
- `app/providers.tsx` - Providers React (NextAuth)
- `app/auth/signin/page.tsx` - Page de connexion/inscription (carte `surface-container-lowest`, champs `outline-variant`, CTA `rounded-full`, fond `bg-surface`)
- `app/saisons-mtc/page.tsx` - Page dédiée aux saisons en Médecine Traditionnelle Chinoise avec toutes les informations détaillées
- `app/yin-yoga/page.tsx` - Page dédiée au Yin Yoga de Canopée avec présentation complète : origine, pratique, bienfaits et informations pratiques
- `app/mon-parcours/page.tsx` - Page "Carol Nelissen" présentant son parcours de formation (Viniyoga, Yin Yoga), sa philosophie et ses certifications. La première image est affichée en cercle parfait (rounded-full) et la deuxième image occupe toute la hauteur de sa colonne.
- `app/faq/page.tsx` - Page FAQ présentant les informations sur les cours de Yin Yoga : types de cours (individuel ou collectif, max 3 personnes), horaires (individuel selon convenance, collectif vendredi 18h-19h), prix (individuel 15€, collectif 12€) et modalités (individuel adapté aux besoins, collectif thématiques annoncées)
- `app/profile/page.tsx` - Page de profil (surfaces `surface-container-low`, bordures `outline-variant`, boutons pilule, titres `text-primary`) : édition prénom, nom, téléphone, date de naissance, photo (fichier max 5MB ou URL). **Admin** : « Mes réservations » + « Actions rapides » (agenda, actus, panel admin)
- `app/admin/page.tsx` - Dashboard **espace enseignant** Stitch : bento (ajouter cours, news, stats membres), section **« Mes cours »** (liste à venir avec vignette dégradée `color`, badge type, horaire, inscrits, édition / suppression via `ClassFormModal`, lien « Voir tout » vers `/admin/classes`), puis tuiles statistiques et lien utilisateurs
- `app/admin/classes/page.tsx` - Liste **harmonisée** avec le dashboard : cartes Stitch (vignette dégradée, badge type, description, date/heure, intervenant, places), sections **À venir** / **Passés**, boutons Material **edit** / **delete**, lien retour `/admin`, `ClassFormModal` comme sur `/admin`
- `app/admin/news/page.tsx` - Gestion des actualités (liste en **cartes** Stitch comme le dashboard : vignette, métadonnées, actions edit/delete, `NewsFormModal`)
- `app/admin/users/page.tsx` - Gestion des utilisateurs (liste en **cartes** : avatar, email, stats, rôle)

### API Routes

- `app/api/auth/[...nextauth]/route.ts` - Handler NextAuth
- `app/api/auth/register/route.ts` - API d'inscription
- `app/api/classes/route.ts` - CRUD des cours (GET, POST)
- `app/api/classes/[id]/route.ts` - Gestion d'un cours spécifique (GET, PATCH, DELETE)
- `app/api/bookings/route.ts` - Gestion des réservations (GET, POST)
- `app/api/bookings/[id]/route.ts` - Annulation d'une réservation (DELETE)
- `app/api/news/route.ts` - CRUD des actualités (GET, POST)
- `app/api/news/[id]/route.ts` - Gestion d'une actualité (GET, PATCH, DELETE)
- `app/api/admin/users/route.ts` - Liste des utilisateurs (admin uniquement)
- `app/api/admin/bookings/route.ts` - Liste des réservations (admin uniquement)
- `app/api/lunar/route.ts` - Récupération des informations lunaires depuis lunopia.com (phase, illumination, image dynamique)

### Composants

- `components/stitch/StitchTopBar.tsx` — App bar Stitch + ouverture du menu
- `components/stitch/StitchMenuDrawer.tsx` — Navigation secondaire (parcours, yin, MTC, FAQ, infos, admin cours, profil, connexion / déconnexion)
- `components/stitch/StitchBottomNav.tsx` — Tab bar 3 items (Accueil, Agenda, Admin) ; **pilule verte** = un seul `motion.div` dont la position / taille sont **mesurées** (`getBoundingClientRect` + `ResizeObserver`) puis animées en **ressort** (Framer Motion) pour un glissement fluide entre onglets
- `components/stitch/StitchAuxFooter.tsx` — Liens légers au-dessus du tab bar
- `components/HomeHeroDesktop.tsx` — **Héros (lg+)** : masque fixe avec **`clip-path: inset(0 round 0 0 1.5rem 1.5rem)`** (+ `WebkitClipPath`) en plus de `overflow-hidden` / `rounded-b-3xl`, double wrapper interne, **`contain: paint`** — le rail horizontal en **`x`** ne fait plus « sauter » le rognage pendant la transition. Auto 6,5 s, flèches + pastilles ; CTA inscriptions / agenda.
- `components/HomeStitch.tsx` — Page d’accueil alignée maquette `accueil_news` + héros desktop au-dessus du contenu étroit
- `components/PublicNewsBento.tsx` — Bento actualités **lecture publique** + `NewsModal`
- `components/ScheduleBooking.tsx` — Semaine horizontale + liste du jour + réservation
- `app/agenda/page.tsx` — Route réservation
- `app/infos/page.tsx` — Infos pratiques (`PracticalInfo`)
- `components/NewsFeed.tsx` — (Conservé) Fil admin cours + actus ; non utilisé sur l’accueil public actuel
- `components/NewsModal.tsx` - Modal pour afficher les détails d'une actualité
- `components/PracticalInfo.tsx` - Infos pratiques : **bloc vert flagship** « L’art du Yin Yoga » (Stitch), puis bienfaits / indications, encart infos (horaires, Rue Jean Theys 10 Wauthier-Braine, Carol Nelissen), grille tarifs / matériel / débutants sur surfaces claires
- `components/Footer.tsx` - Footer fond **primary** (Stitch), texte clair ; phase lunaire (lunopia / API), saison MTC, citation, navigation ; hovers discrets vers `secondary-container`
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
- `DEPLOIEMENT_OVH.md` - Guide de déploiement sur OVH avec le domaine canopee.be (Pack Starter + VPS-1)
- `ANALYSE_DEPLOIEMENT.md` - Analyse complète du projet pour le déploiement (type de site, build, variables d'environnement, etc.)
- `MIGRATION_SUPABASE.md` - Guide complet de migration de PostgreSQL vers Supabase
- `ENV_SETUP.md` - Guide complet de configuration des variables d'environnement
- `CONFIG_ENV_PRODUCTION.md` - Configuration .env prête pour la production (VPS)
- `agent.md` - État du projet et notes

## Informations de Déploiement

### Configuration Actuelle

- **Hébergement** : OVH
  - **Pack Starter OVH** : Hébergement web (optionnel, non utilisé pour l'application)
  - **VPS-1 OVH** : Serveur principal pour l'application Next.js
- **Domaine** : canopee.be (canopée.be)
- **Base de données** : Supabase (déjà configurée)
  - **URL Dashboard** : https://kzogkberupkzpjdojvhn.supabase.co
  - **URL Connexion** : `postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public`

### Type d'Application

- **Application Node.js/SSR (Next.js 14)** - Nécessite un serveur Node.js
- **PAS un site statique** - Routes API, authentification, base de données

### Commandes de Build

- Installation : `npm install`
- Build : `npm run build`
- Démarrage : `npm start` (ou `next start`)

### Dossier de Production

- **`.next/`** - Généré après `npm run build`, contient tous les fichiers optimisés

### Serveur Requis

- **OUI** - Serveur Node.js obligatoire (port 3000 par défaut)
- **VPS-1 OVH** : Serveur configuré avec Node.js 18+, PM2, Nginx
- Reverse proxy (Nginx) configuré pour rediriger le trafic depuis port 80/443 vers 3000

### Base de Données

- **Type** : PostgreSQL (actuellement hébergé sur Supabase)
- **ORM** : Prisma (offre l'indépendance vis-à-vis du fournisseur)
- **Variable** : `DATABASE_URL` (format : `postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public`)
- **Configuration** : Voir [CONFIGURATION_SUPABASE.md](./CONFIGURATION_SUPABASE.md)
- **Indépendance** : Prisma permet de migrer facilement vers Railway, Neon, PostgreSQL local, AWS RDS, etc. en changeant uniquement la `DATABASE_URL`

### Variables d'Environnement Requises

#### Obligatoires

- `DATABASE_URL` - URL de connexion Supabase PostgreSQL
- `NEXTAUTH_SECRET` - Secret pour NextAuth.js (générer avec `openssl rand -base64 32`)
- `NEXTAUTH_URL` - URL publique de l'application : `https://canopee.be` (production)

#### Optionnelles (OAuth)

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Authentification Google
- `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` - Authentification Facebook

#### Système

- `NODE_ENV` - `production` en production
- `NEXT_PUBLIC_DOMAIN` - `canopee.be` (pour les images)

### Configuration

- **Fichier** : `next.config.js`
- **Mode** : SSR (Server-Side Rendering)
- **Images** : Domaines autorisés : `localhost`, `www.lunopia.com`, `canopee.be`, `canopée.be`

### Prérequis Déploiement

1. **VPS-1 OVH** avec accès SSH
2. Node.js 18+ (installé sur le VPS)
3. PM2 (gestionnaire de processus, installé sur le VPS)
4. Nginx (reverse proxy, installé sur le VPS)
5. Base de données Supabase (déjà configurée)

### Étapes Déploiement

1. Se connecter au VPS-1 OVH via SSH
2. Installer Node.js 18+, PM2, Nginx, Git
3. Cloner le repository dans `/var/www/canopee`
4. `npm install` - Installer les dépendances
5. Configurer `.env` avec toutes les variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, etc.)
6. `npx prisma generate` - Générer le client Prisma
7. `npx prisma migrate deploy` - Appliquer les migrations
8. `npm run build` - Construire l'application
9. Configurer PM2 avec `ecosystem.config.js`
10. Configurer Nginx comme reverse proxy pour canopee.be
11. Configurer SSL/HTTPS avec Let's Encrypt
12. Configurer DNS pour pointer canopee.be vers le VPS-1

📖 **Guide complet** : Voir [DEPLOIEMENT_OVH.md](./DEPLOIEMENT_OVH.md)

### Fichiers de Configuration Créés

- `ecosystem.config.js` - Configuration PM2 pour la production
- `CHECKLIST_DEPLOIEMENT.md` - Checklist complète pour suivre l'avancement du déploiement
- `scripts/install-vps.sh` - Script d'installation automatique pour le VPS (Ubuntu 22.04)
- `GUIDE_INSTALLATION_VPS.md` - Guide d'installation détaillé avec méthode automatique et manuelle

### Statut du Déploiement

- 🚧 **En cours** - Configuration du VPS-1 OVH et déploiement de l'application
- 📋 **Checklist disponible** - Voir [CHECKLIST_DEPLOIEMENT.md](./CHECKLIST_DEPLOIEMENT.md) pour suivre l'avancement
- 🔍 **Guide de vérification** - Voir [VERIFICATION_OVH.md](./VERIFICATION_OVH.md) pour identifier ce qui est déjà configuré

## Corrections Récentes

### Corrections ESLint - Apostrophes et Guillemets (Décembre 2024)

- ✅ Correction de toutes les apostrophes non échappées dans le JSX
- ✅ Remplacement de `'` par `&apos;` dans le contenu JSX
- ✅ Remplacement de `"` par `&quot;` dans le contenu JSX
- ✅ Correction des apostrophes dans les expressions JSX (template literals)
- ✅ Correction des apostrophes dans les commentaires JSX

**Fichiers corrigés :**

- `app/mon-parcours/page.tsx` - Toutes les apostrophes échappées
- `app/profile/page.tsx` - Apostrophes échappées
- `app/saisons-mtc/page.tsx` - Apostrophes dans les expressions JSX corrigées
- `app/yin-yoga/page.tsx` - Apostrophes échappées (y compris dans les commentaires)
- `components/Agenda.tsx` - Apostrophe échappée
- `components/NewsFeed.tsx` - Apostrophe échappée
- `components/admin/ClassFormModal.tsx` - Apostrophe échappée

**Note :** Toutes les apostrophes dans le contenu JSX doivent être échappées avec `&apos;` pour respecter les règles ESLint `react/no-unescaped-entities`.

### Corrections Base de Données - Erreur "prepared statement does not exist" (Décembre 2024)

- ✅ Amélioration de la gestion des connexions Prisma dans `lib/prisma.ts`
- ✅ Ajout d'une fonction `withRetry` pour réessayer automatiquement les requêtes en cas d'erreur de connexion
- ✅ Gestion des erreurs de connexion PostgreSQL (codes P1001, P1008, 26000)
- ✅ Fermeture propre des connexions à l'arrêt de l'application
- ✅ Documentation créée : `FIX_DATABASE_CONNECTION.md`

**Problème résolu :** L'erreur `prepared statement "s36" does not exist` (code 26000) qui se produisait lorsque Prisma essayait d'utiliser une connexion PostgreSQL fermée ou expirée (problème courant avec Supabase).

**Solution :**

- Détection automatique des erreurs de connexion
- Réessai automatique des requêtes (jusqu'à 3 tentatives)
- Recommandation d'ajouter des paramètres de connexion à la DATABASE_URL (`connection_limit`, `pool_timeout`, `connect_timeout`)

### Problème Admin en Production (Décembre 2024)

**Problème :** L'utilisateur admin fonctionne en local mais pas en production (OVH).

**Causes possibles :**

- L'utilisateur n'existe pas dans la base de données Supabase de production
- L'utilisateur existe mais n'a pas le rôle `admin` en production
- Problème de session/authentification (token JWT non régénéré)
- Variables d'environnement incorrectes (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`)

**Solutions :**

1. **Vérifier l'utilisateur dans Supabase** :

   - Dashboard Supabase → Table Editor → users
   - Chercher `etibaliomecus@live.be`
   - Vérifier que `role = 'admin'`

2. **Scripts de diagnostic** :

   ```bash
   # Sur le VPS
   node scripts/diagnose-admin.js etibaliomecus@live.be
   node scripts/check-user-role.js etibaliomecus@live.be
   ```

3. **Créer/Mettre à jour l'admin** :

   ```bash
   # Si l'utilisateur existe déjà
   node scripts/create-admin.js etibaliomecus@live.be

   # Synchroniser depuis local vers production
   node scripts/sync-admin-to-production.js etibaliomecus@live.be "Vincent" "Chauvaux"
   ```

4. **Via Supabase SQL Editor** :

   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'etibaliomecus@live.be';
   ```

5. **Après mise à jour** :
   - Déconnectez-vous du site
   - Videz les cookies du navigateur
   - Reconnectez-vous pour régénérer le token JWT

📖 **Guide complet** : Voir [FIX_ADMIN_PRODUCTION.md](./FIX_ADMIN_PRODUCTION.md)

### Amélioration de la page Profil - Gestion des 401 en production (Décembre 2025)

- ✅ Mise à jour de `app/profile/page.tsx` pour mieux gérer les réponses `401 Unauthorized` de `/api/profile` en production.
- ✅ En cas de 401, la page redirige automatiquement vers `/auth/signin` au lieu de lever une erreur générique.
- ✅ Affichage d'un message d'erreur utilisateur lorsqu'une erreur inattendue empêche le chargement du profil, au lieu de laisser une erreur React minifiée dans la console.

### Correction des erreurs d'hydratation React (Décembre 2024)

**Problème :** Erreurs React minifiées #425, #418, #423 causées par des différences entre le rendu serveur et client.

**Causes identifiées :**

- Utilisation de `Math.random()` et `new Date()` dans le rendu initial, causant des différences entre SSR et client
- Calculs dynamiques (phase lunaire, citations, dates) exécutés pendant le rendu serveur
- Comparaisons de dates avec `new Date()` qui peuvent varier entre serveur et client

**Solutions appliquées :**

1. **Hero.tsx** :
   - ✅ Ajout d'un état `isMounted` pour s'assurer que la citation aléatoire n'est générée qu'après l'hydratation
   - ✅ La citation n'est affichée qu'après le montage du composant côté client

2. **Footer.tsx** :
   - ✅ Ajout d'un état `currentYear` et `isMounted` pour éviter les différences de rendu
   - ✅ Utilisation de `suppressHydrationWarning` sur l'élément contenant l'année

3. **MoonPhase.tsx** :
   - ✅ Déplacement du calcul de la phase lunaire dans un `useEffect` pour qu'il ne s'exécute qu'après l'hydratation
   - ✅ Valeurs par défaut pour le rendu serveur

4. **Agenda.tsx** :
   - ✅ Ajout d'un état `today` calculé uniquement après le montage
   - ✅ La comparaison `isToday` utilise maintenant l'état `today` au lieu de `new Date()` directement

5. **NewsFeed.tsx** :
   - ✅ Ajout d'un état `isMounted` pour s'assurer que les données ne sont chargées qu'après l'hydratation

**Résultat :** Les erreurs d'hydratation React sont résolues. Le rendu serveur et client sont maintenant cohérents, évitant les erreurs #425, #418, et #423.

### Correction des erreurs de hooks React - Build échoué (Décembre 2024)

**Problème :** Le build Next.js échouait avec l'erreur "React Hook 'useEffect' is called conditionally" dans `Agenda.tsx` et `NewsFeed.tsx`.

**Causes identifiées :**

- Les hooks `useEffect` étaient appelés après un `return null` conditionnel (vérification `isAdmin`)
- Violation de la règle des hooks React : les hooks doivent toujours être appelés dans le même ordre, avant tout return conditionnel

**Solutions appliquées :**

1. **Agenda.tsx** :
   - ✅ Déplacement du `useEffect` qui appelle `fetchClasses()` avant le `return null`
   - ✅ Ajout d'une vérification `isAdmin` dans le `useEffect` et dans `fetchClasses()`
   - ✅ Ajout de `isAdmin` dans les dépendances du `useEffect`

2. **NewsFeed.tsx** :
   - ✅ Déplacement du `useEffect` qui appelle `fetchUpcomingClasses()` avant le `return null`
   - ✅ Ajout d'une vérification `isAdmin` dans le `useEffect` et dans `fetchUpcomingClasses()`
   - ✅ Ajout de `isAdmin` dans les dépendances du `useEffect`

**Résultat :** Le build passe maintenant sans erreurs. Les hooks sont correctement appelés avant tout return conditionnel, respectant les règles des hooks React.

### Erreur 500 sur /api/classes (Décembre 2024)

**Problème :** L'API `/api/classes` retourne une erreur 500 lors de la récupération des cours.

**Causes possibles :**

- Table `classes` n'existe pas dans la base de données (migrations non appliquées)
- Problème de connexion à Supabase
- Format de date invalide dans les paramètres

**Solutions :**

1. **Vérifier et appliquer les migrations** :

   ```bash
   # Sur le VPS
   cd /var/www/canopee
   npx prisma migrate deploy
   npx prisma generate
   pm2 restart canopee
   ```

2. **Script de diagnostic** :

   ```bash
   node scripts/check-database.js
   ```

3. **Vérifier les tables dans Supabase** :

   - Dashboard → Table Editor → Vérifier que `classes` existe

4. **Vérifier DATABASE_URL** :
   - Vérifier que l'URL est correcte dans `.env`
   - Ajouter des paramètres de connexion si nécessaire

📖 **Guide complet** : Voir [FIX_API_CLASSES_500.md](./FIX_API_CLASSES_500.md)

### Erreur 404 sur /api/auth/signin (Décembre 2024)

**Problème :** L'erreur `GET https://canopee.be/api/auth/signin?csrf=true 404 (Not Found)` apparaît lors de la tentative de connexion.

**Causes possibles :**

- Route NextAuth non correctement configurée
- Problème de build (routes API non générées)
- Configuration `NEXTAUTH_URL` incorrecte
- Problème avec le reverse proxy Nginx

**Solutions :**

1. **Vérifier la configuration de la route** :

   - Le fichier `app/api/auth/[...nextauth]/route.ts` doit exporter GET et POST
   - Ajouter `export const dynamic = 'force-dynamic'` pour forcer le mode dynamique

2. **Vérifier NEXTAUTH_URL** :

   ```bash
   # Sur le VPS
   cd /var/www/canopee
   cat .env | grep NEXTAUTH_URL
   ```

   - Doit être `NEXTAUTH_URL="https://canopee.be"` (pas `http://` ou `localhost`)

3. **Rebuild l'application** :

   ```bash
   npm run build
   pm2 restart canopee
   ```

4. **Vérifier la configuration Nginx** :

   - S'assurer que toutes les routes `/api/*` sont proxifiées vers Next.js

5. **Vérifier les logs** :
   ```bash
   pm2 logs canopee
   sudo tail -f /var/log/nginx/error.log
   ```

📖 **Guide complet** : Voir [FIX_NEXTAUTH_404.md](./FIX_NEXTAUTH_404.md)

**Scripts et guides utiles :**

- `scripts/compare-env.js` - Comparer les fichiers .env local et VPS
- [VERIFICATION_ENV_VPS.md](./VERIFICATION_ENV_VPS.md) - Guide de vérification du .env VPS
- [MODIFIER_ENV_VPS.md](./MODIFIER_ENV_VPS.md) - Comment modifier le fichier .env sur le VPS

### Correction des secrets dans Git (Décembre 2024)

**Problème :** GitHub bloque le push car des secrets (Google OAuth Client ID et Secret) ont été détectés dans un fichier `.env.backup` commité dans l'historique Git.

**Solution appliquée :**

1. ✅ Ajout de `.env.backup` et `*.env.backup` dans `.gitignore` pour éviter les commits futurs
2. ✅ Utilisation de `git rebase -i` pour modifier le commit `bf6258b` et supprimer le fichier `.env.backup`
3. ✅ Suppression du fichier de l'historique Git avec `git rm --cached .env.backup`
4. ✅ Réécriture de l'historique pour éliminer les secrets

**Résultat :** Le fichier `.env.backup` a été complètement retiré de l'historique Git. Le push vers GitHub devrait maintenant fonctionner sans blocage.

**Note importante :** Les fichiers contenant des secrets (`.env`, `.env.local`, `.env.backup`, etc.) doivent toujours être dans `.gitignore` et ne jamais être commités dans Git.

### Correction des erreurs 400 sur les images Next.js (Décembre 2024)

**Problème :** Erreurs 400 (Bad Request) lors du chargement d'images via Next.js Image Optimizer :
- `GET http://localhost:3000/_next/image?url=%2Fimages%2Fbackground%2Fbg_01.jpg&w=1920&q=90 400 (Bad Request)`
- `GET http://localhost:3000/_next/image?url=%2Fimages%2Fbackground%2Fbg_02.jpg&w=1920&q=90 400 (Bad Request)`
- `GET http://localhost:3000/_next/image?url=%2Fimages%2FInformations%2FCarol_Nelissen_Yoga.png&w=1080&q=75 400 (Bad Request)`

**Causes identifiées :**

1. **Fichiers manquants dans `public/`** : Les images étaient dans `images/` mais pas dans `public/images/`. Next.js sert les fichiers statiques uniquement depuis le dossier `public/`.
2. **Extensions incorrectes** : Les fichiers étaient en `.jpeg` mais référencés avec `.jpg` dans le code.

**Solutions appliquées :**

1. ✅ Copie des fichiers `bg_01.jpeg` et `bg_02.jpeg` de `images/background/` vers `public/images/background/`
2. ✅ Correction des extensions dans `components/Hero.tsx` : `.jpg` → `.jpeg`
3. ✅ Copie du fichier `Carol_Nelissen_Yoga.png` de `images/Informations/` vers `public/images/Informations/`

**Résultat :** Les images se chargent correctement via Next.js Image Optimizer. Toutes les images statiques doivent être dans le dossier `public/` pour être accessibles via les chemins `/images/...`.

**Note importante :** 
- Les fichiers dans `images/` sont des fichiers sources (peuvent être utilisés pour le développement)
- Les fichiers dans `public/images/` sont les fichiers servis par Next.js (nécessaires pour la production)
- Les chemins dans le code doivent correspondre exactement aux extensions des fichiers (`.jpg` vs `.jpeg`, `.png`, etc.)

### Reformulation de la page Saisons MTC (Décembre 2024)

**Objectif :** Reformuler le contenu de la page `/saisons-mtc` pour éviter le copier-coller tout en conservant le sens, et améliorer la qualité rédactionnelle.

**Modifications apportées :**

1. ✅ **Descriptions des saisons reformulées** :
   - Printemps : "Période d&apos;épanouissement et de croissance" au lieu de "La saison de l&apos;expansion"
   - Été : "Moment d&apos;expression et de rayonnement maximal" au lieu de "La saison de l&apos;extériorisation"
   - Intersaison : "Temps de mutation et de réorganisation" au lieu de "La saison de la transformation"
   - Automne : "Phase de changement et de ralentissement" au lieu de "La saison de la transition"
   - Hiver : "Temps de repli et de ressourcement" au lieu de "La saison de l&apos;introspection"

2. ✅ **Texte d&apos;introduction reformulé** :
   - Reformulation complète des paragraphes d&apos;introduction sur le calendrier chinois
   - Amélioration de la fluidité et de la clarté du texte
   - Conservation de toutes les informations essentielles

3. ✅ **Titres et sous-titres améliorés** :
   - "période d&apos;épanouissement" au lieu de "saison de l&apos;expansion"
   - "période de rayonnement" au lieu de "saison de l&apos;extériorisation"
   - "période de mutation" au lieu de "saison de la transformation"
   - "période de changement" au lieu de "saison de la transition"
   - "période de repli" au lieu de "saison de l&apos;introspection"

4. ✅ **Texte de conclusion reformulé** :
   - Reformulation du paragraphe sur l&apos;harmonie et le tao
   - Amélioration de la formulation de la question introductive

5. ✅ **Correction des problèmes d&apos;encodage** :
   - Vérification que tous les `&apos;` sont correctement utilisés (déjà en place)
   - Amélioration de la cohérence dans l&apos;utilisation des apostrophes

**Résultat :** Le contenu de la page est maintenant entièrement reformulé, plus fluide et original, tout en conservant fidèlement le sens et les informations essentielles sur les saisons en Médecine Traditionnelle Chinoise.

### Ajustements de formulation sur les titres des saisons (Mars 2026)

- ✅ Correction des articles devant les saisons pour un français naturel : `LE PRINTEMPS`, `L&apos;ÉTÉ`, `L&apos;AUTOMNE`, `L&apos;HIVER` au lieu de formulations incorrectes comme `LE HIVER`.
- ✅ Reformulation de la phrase d&apos;introduction de chaque saison : « Au printemps / Pendant l&apos;été / Pendant l&apos;automne / Pendant l&apos;hiver, l&apos;élément … prédomine » pour un ton plus fluide et pédagogique.

### Actualités : ajout de la date d&apos;événement et amélioration du Fil d&apos;actualité (Mars 2026)

- ✅ Ajout d&apos;un champ optionnel `eventDate` dans le modèle Prisma `News` pour dater explicitement une actualité (par ex. « samedi sans cours »).
- ✅ Mise à jour de l&apos;API `/api/news` (POST/GET) et `/api/news/[id]` (PATCH) pour lire/écrire `eventDate` et trier les actualités d&apos;abord par `eventDate`, puis par `createdAt`.
- ✅ Mise à jour de `NewsFormModal` pour permettre le choix d&apos;une date de l&apos;actualité via un champ `type="date"`.
- ✅ Assouplissement du `NewsFeed` : le Fil d&apos;actualité affiche maintenant tous les cours à venir (date ≥ aujourd&apos;hui), même si la description est vide (le filtre qui exigeait une description non vide a été retiré).

### Correction de l'erreur 401 lors de la connexion (Décembre 2024)

**Problème :** Erreur `POST https://canopee.be/api/auth/callback/credentials 401 (Unauthorized)` lors de la tentative de connexion avec `etibaliomecus@live.be`.

**Causes possibles :**
- L'utilisateur n'existe pas dans la base de données
- L'utilisateur n'a pas de passwordHash (créé via OAuth)
- Le mot de passe est incorrect
- Problème de connexion à la base de données
- NEXTAUTH_SECRET manquant ou incorrect

**Solutions appliquées :**

1. ✅ **Amélioration des logs d'authentification** dans `lib/auth.ts` :
   - Logs détaillés pour chaque étape de l'authentification
   - Messages d'erreur spécifiques (utilisateur non trouvé, pas de passwordHash, mot de passe incorrect)
   - Logs de succès pour le débogage

2. ✅ **Script de diagnostic** `scripts/diagnose-login.js` :
   - Vérifie la configuration (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
   - Vérifie l'existence de l'utilisateur
   - Vérifie la présence d'un passwordHash
   - Aide à identifier rapidement le problème

3. ✅ **Documentation complète** `FIX_LOGIN_401.md` :
   - Guide étape par étape pour diagnostiquer et résoudre l'erreur 401
   - Solutions pour chaque cause possible
   - Commandes à exécuter sur le VPS

**Solutions appliquées (suite) :**

4. ✅ **Script de synchronisation** `scripts/sync-user-to-production.js` :
   - Synchronise l'utilisateur depuis la base locale vers la production (Supabase)
   - Copie le passwordHash et toutes les informations utilisateur
   - Résout le problème "ça fonctionne en local mais pas en production"

**Résultat :** Les logs d'authentification sont maintenant plus détaillés et aideront à identifier rapidement la cause de l'erreur 401. Un script de diagnostic permet de vérifier la configuration et l'état de l'utilisateur. Un script de synchronisation permet de copier l'utilisateur depuis local vers production.

📖 **Guide complet** : Voir [FIX_LOGIN_401.md](./FIX_LOGIN_401.md)

### Guide pour voir les logs (Décembre 2024)

**Documentation créée** : `VOIR_LOGS.md` - Guide complet pour visualiser les logs de l'application.

**Contenu du guide :**

1. ✅ **Logs en développement local** :
   - Console du terminal
   - Logs Prisma (requêtes SQL, erreurs)

2. ✅ **Logs en production (VPS)** :
   - Logs PM2 (application Next.js)
   - Logs Nginx (reverse proxy)
   - Logs d'authentification
   - Logs de la base de données

3. ✅ **Commandes utiles** :
   - `pm2 logs canopee` - Voir tous les logs
   - `pm2 logs canopee --err` - Voir uniquement les erreurs
   - `pm2 logs canopee --lines 50` - Voir les 50 dernières lignes
   - Filtrage et recherche dans les logs

4. ✅ **Emplacement des fichiers** :
   - Logs PM2 : `/var/www/canopee/logs/`
   - Logs Nginx : `/var/log/nginx/`

5. ✅ **Scripts de diagnostic** :
   - `check-database.js` - Vérifier la base de données
   - `diagnose-admin.js` - Diagnostiquer les problèmes admin
   - `diagnose-login.js` - Diagnostiquer les problèmes de connexion

📖 **Guide complet** : Voir [VOIR_LOGS.md](./VOIR_LOGS.md)

### Correction "prepared statement already exists" et déconnexion impossible (Mars 2025)

**Problème :** Erreur Prisma 42P05 `prepared statement "s2" already exists` dans les logs, et impossible de se déconnecter (réconnexion automatique apparente).

**Causes :** (1) Prisma avec le pooler Supabase (PgBouncer) déclenche des conflits de prepared statements ; (2) le callback JWT appelait la DB à chaque requête pour rafraîchir le rôle, ce qui provoquait l’erreur et une session incohérente au signOut.

**Solutions appliquées :**

1. ✅ **`lib/auth.ts`** : suppression de l’appel Prisma à chaque requête dans le callback JWT. Le rôle est conservé dans le token (mis à jour à la connexion), plus d’appel DB à chaque chargement → plus d’erreur 42P05 sur la session, déconnexion fonctionnelle.
2. ✅ **Documentation** : `FIX_PREPARED_STATEMENT_LOGOUT.md` – ajout de `?pgbouncer=true` à la `DATABASE_URL` sur le VPS si utilisation du pooler (port 6543).

**Résultat :** La déconnexion fonctionne à nouveau. Les erreurs "prepared statement already exists" en session sont évitées. Pour les autres appels Prisma, ajouter `&pgbouncer=true` à la `DATABASE_URL` sur le VPS si besoin.

📖 **Guide** : Voir [FIX_PREPARED_STATEMENT_LOGOUT.md](./FIX_PREPARED_STATEMENT_LOGOUT.md)

### PostgreSQL sur le VPS (sans Supabase) et renforcement auth (Mars 2025)

**Objectif :** Utiliser PostgreSQL installé directement sur le VPS au lieu de Supabase ; corriger déconnexion et connexion email/mot de passe.

**Modifications :**

1. ✅ **Guide `CONFIG_POSTGRES_VPS.md`** : installation PostgreSQL sur le VPS, création base et utilisateur, `DATABASE_URL` locale, migrations, création d’un admin (ex. `admin@canopee.be` / `admin`), rebuild et redémarrage.
2. ✅ **`lib/auth.ts`** : appels Prisma (authorize, signIn, jwt OAuth) passés dans `withRetry` pour limiter les échecs en cas d’erreur transitoire ; suppression du domaine personnalisé du cookie de session pour que la déconnexion supprime correctement le cookie sur le host actuel ; ajout du bloc `events.signOut`.
3. ✅ **`scripts/create-admin.js`** : valeurs par défaut `admin@canopee.be` / `admin` pour créer rapidement un compte admin (sans arguments : `node scripts/create-admin.js`).
4. ✅ **`GUIDE_INSTALLATION_VPS.md`** : mention de l’option « PostgreSQL sur le VPS » et lien vers `CONFIG_POSTGRES_VPS.md`.

**Résultat :** L’app peut tourner entièrement avec PostgreSQL sur le VPS (plus de dépendance Supabase). Connexion par email/mot de passe et déconnexion fonctionnent après déploiement du code et configuration de la base locale. Création d’un admin en une commande.

📖 **Guide** : Voir [CONFIG_POSTGRES_VPS.md](./CONFIG_POSTGRES_VPS.md)

### Correction de l'erreur "Tenant or user not found" (Janvier 2025)

**Problème :** Erreur `FATAL: Tenant or user not found` lors de la connexion à Supabase, empêchant l'authentification et l'accès à l'application.

**Causes identifiées :**
- Mot de passe incorrect dans `DATABASE_URL`
- Mot de passe Supabase changé sans mise à jour de `.env`
- Caractères spéciaux dans le mot de passe non encodés en URL
- Format incorrect de `DATABASE_URL`

**Solutions appliquées :**

1. ✅ **Guide de correction complet** `FIX_TENANT_NOT_FOUND.md` :
   - Étapes détaillées pour récupérer la connection string depuis Supabase
   - Instructions pour mettre à jour `DATABASE_URL` sur le VPS
   - Guide pour encoder les caractères spéciaux dans le mot de passe
   - Instructions pour réinitialiser le mot de passe Supabase
   - Commandes de test et vérification

2. ✅ **Amélioration du script de diagnostic** `scripts/check-database.js` :
   - Détection spécifique de l'erreur "Tenant or user not found"
   - Messages d'aide contextuels avec solutions étape par étape
   - Lien vers le guide complet

**Résultat :** Un guide complet permet de résoudre rapidement l'erreur "Tenant or user not found" en vérifiant et corrigeant la `DATABASE_URL`. Le script de diagnostic détecte automatiquement cette erreur et fournit des instructions précises.

📖 **Guide complet** : Voir [FIX_TENANT_NOT_FOUND.md](./FIX_TENANT_NOT_FOUND.md)

### Correction de l'erreur "No token or token.id" sur la page profil (Janvier 2025)

**Problème :** Erreur `[getSessionFromRequest] No token or token.id` lors de l'accès à la page `/profile`, empêchant l'affichage du profil utilisateur.

**Causes identifiées :**
- Utilisateur non connecté (pas de session active)
- Cookie de session non envoyé avec la requête
- `NEXTAUTH_SECRET` incorrect ou manquant
- Cookie expiré ou invalide
- Problème de configuration des cookies (secure, sameSite, domaine)
- `NEXTAUTH_URL` incorrect ou non configuré

**Solutions appliquées :**

1. ✅ **Guide de correction complet** `FIX_NO_TOKEN_PROFILE.md` :
   - Vérification de la connexion utilisateur
   - Vérification de `NEXTAUTH_SECRET` et `NEXTAUTH_URL`
   - Instructions pour vider les cookies et se reconnecter
   - Vérification de la configuration des cookies
   - Tests de diagnostic côté navigateur et serveur
   - Checklist complète de vérification

2. ✅ **Amélioration des logs** dans `lib/get-session.ts` :
   - Logs supplémentaires pour diagnostiquer l'absence de token
   - Vérification de la configuration `NEXTAUTH_SECRET` et `NEXTAUTH_URL`
   - Messages plus détaillés pour identifier rapidement le problème

**Résultat :** Un guide complet permet de résoudre rapidement l'erreur "No token or token.id" en vérifiant la configuration NextAuth et la session utilisateur. Les logs améliorés aident à identifier rapidement la cause du problème.

📖 **Guide complet** : Voir [FIX_NO_TOKEN_PROFILE.md](./FIX_NO_TOKEN_PROFILE.md)

### Correction de la redirection vers signin lors de l'accès au profil (Janvier 2025)

**Problème :** Lors de l'accès à la page `/profile`, l'utilisateur est automatiquement redirigé vers `/auth/signin`, même s'il est connecté.

**Causes identifiées :**
- `NEXTAUTH_URL` non configuré ou incorrect
- Cookie de session non lu par NextAuth côté client
- Session expirée ou invalide
- Problème de configuration du `SessionProvider`
- Cookie bloqué par le navigateur

**Solutions appliquées :**

1. ✅ **Guide de correction complet** `FIX_REDIRECT_SIGNIN_PROFILE.md` :
   - Vérification de `NEXTAUTH_URL` (doit être `https://canopee.be`)
   - Instructions pour vider les cookies et se reconnecter
   - Vérification des cookies dans les requêtes réseau
   - Tests de diagnostic (API de session, console navigateur)
   - Checklist complète de vérification

2. ✅ **Amélioration du SessionProvider** dans `app/providers.tsx` :
   - Ajout de `refetchInterval={0}` pour éviter les rechargements inutiles
   - Ajout de `refetchOnWindowFocus={true}` pour recharger la session au focus

**Résultat :** Un guide complet permet de résoudre rapidement le problème de redirection vers signin en vérifiant la configuration NextAuth et la session utilisateur. Le `SessionProvider` a été amélioré pour mieux gérer le rechargement de la session.

📖 **Guide complet** : Voir [FIX_REDIRECT_SIGNIN_PROFILE.md](./FIX_REDIRECT_SIGNIN_PROFILE.md)

### Rebuild nécessaire après changement de NEXTAUTH_URL (Janvier 2025)

**Problème :** Après avoir modifié `NEXTAUTH_URL` dans `.env`, l'application redirige toujours vers `/auth/signin` même après redémarrage de PM2.

**Cause identifiée :**
- Next.js compile certaines variables d'environnement au moment du build
- `NEXTAUTH_URL` est utilisé par NextAuth pour valider les cookies
- Un simple redémarrage ne suffit pas, il faut **rebuild l'application**

**Solution appliquée :**

1. ✅ **Guide de correction complet** `FIX_REBUILD_AFTER_ENV_CHANGE.md` :
   - Instructions pour vider le cache Next.js (`.next`)
   - Procédure de rebuild complète (`npm run build`)
   - Redémarrage de PM2 après rebuild
   - Tests de vérification
   - Checklist complète

**Procédure à suivre après modification de NEXTAUTH_URL :**
1. Vérifier que `NEXTAUTH_URL` est correct dans `.env`
2. Vider le cache : `rm -rf .next`
3. Rebuild : `npm run build`
4. Redémarrer : `pm2 restart canopee`
5. Vider les cookies du navigateur et se reconnecter

**Résultat :** Un guide complet explique pourquoi un rebuild est nécessaire après modification de variables d'environnement importantes et comment procéder étape par étape.

📖 **Guide complet** : Voir [FIX_REBUILD_AFTER_ENV_CHANGE.md](./FIX_REBUILD_AFTER_ENV_CHANGE.md)

### Cookie domaine IDN pour canopée.be (Mars 2025)

**Problème :** La page `/profile` sur https://canopée.be ne s’affiche pas (redirection signin ou chargement infini) car le cookie de session n’est pas correctement associé au domaine en Punycode (`xn--canope-fva.be`).

**Solutions appliquées :**

1. ✅ **Cookie domaine en production** dans `lib/auth.ts` : si `NEXTAUTH_URL` contient `canopée`, le cookie de session est défini avec `domain: '.xn--canope-fva.be'` pour que le navigateur l’envoie quand l’utilisateur visite `canopée.be`.
2. ✅ **Page profile** : lorsqu’il n’y a pas de session ou de profil, la page affiche « Redirection vers la connexion... » au lieu de rester blanche (`return null`).
3. ✅ **FIX_DOMAIN_PUNYCODE.md** : ajout de la solution 1b (essayer `NEXTAUTH_URL="https://xn--canope-fva.be"` si le problème persiste).

**À faire après déploiement :** rebuild (`rm -rf .next && npm run build`), redémarrage PM2, puis vider les cookies du site et se reconnecter.

📖 **Guide** : [FIX_DOMAIN_PUNYCODE.md](./FIX_DOMAIN_PUNYCODE.md)

### Guide de diagnostic pour la page profile en production (Janvier 2025)

**Problème :** La page `/profile` fonctionne en local mais pas en production (redirection vers `/auth/signin`) malgré tous les changements effectués.

**Guide de diagnostic créé** : `DIAGNOSTIC_PROFILE_PRODUCTION.md` - Guide complet pour diagnostiquer et résoudre le problème de la page profile en production.

**Contenu du guide :**

1. ✅ **Diagnostic étape par étape** :
   - Vérification de la session (`fetch('/api/auth/session')`)
   - Vérification de `NEXTAUTH_URL` sur le VPS
   - Vérification que le rebuild a été fait
   - Vérification des logs d'authentification
   - Vérification des cookies dans le navigateur
   - Vérification de la requête API dans le navigateur

2. ✅ **Solutions selon le diagnostic** :
   - Solution si vous n'êtes pas connecté
   - Solution si `NEXTAUTH_URL` est incorrect
   - Solution si le rebuild n'a pas été fait
   - Solution si les cookies ne sont pas envoyés
   - Solution si problème de base de données

3. ✅ **Procédure complète de correction** :
   - Commandes complètes à exécuter sur le VPS
   - Actions côté navigateur
   - Tests de la session dans la console

4. ✅ **Checklist complète** :
   - Liste de vérification de tous les points importants
   - Informations à collecter pour le diagnostic

**Résultat :** Un guide de diagnostic complet permet d'identifier rapidement la cause du problème et d'appliquer la solution appropriée.

📖 **Guide complet** : Voir [DIAGNOSTIC_PROFILE_PRODUCTION.md](./DIAGNOSTIC_PROFILE_PRODUCTION.md)

### Correction : useSession() ne détecte pas la session côté client (Janvier 2025)

**Problème :** La session API fonctionne (`/api/auth/session` retourne bien la session), mais `useSession()` côté client dans la page profile retourne `null`, causant une redirection vers `/auth/signin`.

**Cause identifiée :**
- Le `SessionProvider` de NextAuth ne charge pas correctement la session côté client
- Problème de configuration du `SessionProvider` (manque de `basePath`)
- Problème de timing où `useSession()` est appelé avant que la session soit chargée

**Solutions appliquées :**

1. ✅ **Amélioration du SessionProvider** dans `app/providers.tsx` :
   - Ajout de `basePath="/api/auth"` pour s'assurer que le SessionProvider utilise le bon chemin
   - Configuration de `refetchOnWindowFocus={true}` pour recharger la session au focus
   - Configuration de `refetchInterval={5 * 60}` pour recharger la session toutes les 5 minutes

2. ✅ **Amélioration de la page profile** dans `app/profile/page.tsx` :
   - Meilleure gestion du statut `loading` vs `unauthenticated`
   - Logs de débogage pour identifier le problème
   - Vérification explicite du statut `authenticated` avant de charger le profil

3. ✅ **Guide de correction** `FIX_USESESSION_NOT_DETECTING.md` :
   - Explication du problème
   - Instructions de déploiement
   - Tests à effectuer
   - Checklist complète

**Résultat :** Le `SessionProvider` est maintenant correctement configuré et la page profile gère mieux le chargement de la session. Les logs aident à identifier si le problème persiste.

📖 **Guide complet** : Voir [FIX_USESESSION_NOT_DETECTING.md](./FIX_USESESSION_NOT_DETECTING.md)

### Structure « app mobile » Google Stitch (Mars 2026)

Référence projet : [aperçu Stitch](https://stitch.withgoogle.com/preview/17038211574734318459?node-id=c5071cccd79a468fafdeee8d1a742d34&raw=1) et exports HTML dans `stitch-reference/stitch/`.

**Coquille globale** (`app/layout.tsx`) :

- **StitchTopBar** : barre fixe — icône `spa` (ouvre le menu tiroir), titre « Canopée » centré (serif italique), avatar / profil à droite si connecté.
- **StitchBottomNav** : 3 onglets fixes — **Accueil** `/`, **Agenda** `/agenda`, **Admin** `/admin` (non-admin → `/auth/signin?callbackUrl=/admin`) ; le fond arrondi actif **glisse** d’un lien à l’autre (mesure DOM + ressort Framer Motion / [Motion](https://motion.dev/)).
- **StitchAuxFooter** : liens secondaires (Parcours, Yin, Infos, MTC) au-dessus de la barre du bas.
- Zone contenu : `pt-[4.75rem] pb-32 min-h-dvh bg-surface`. Routes `/auth/*` : pas de top/bottom bar (chrome masqué).

**Nouvelles routes**

- `/agenda` — réservation style maquette : bandeau semaine horizontal (pilules), liste des cours du jour, badges places / complet, réservation si connecté (`ScheduleBooking.tsx`).
- `/infos` — page dédiée « Infos pratiques & tarifs » (`PracticalInfo.tsx`).

**Accueil** (`components/HomeStitch.tsx` + `PublicNewsBento.tsx`)

- Plus de hero plein écran ni carrousel : flux type `accueil_news` (accroche, **actualités publiques** via `GET /api/news`, bloc vert Yin, citation).
- **NewsFeed.tsx** conservé dans le repo pour un éventuel fil admin avancé (cours + news) mais **retiré de l’accueil**.

**Fichiers supprimés**

- `components/Header.tsx`, `components/Hero.tsx`, `components/Agenda.tsx` (remplacés par la coquille Stitch + `/agenda`).

**Autres pages**

- `yin-yoga`, `mon-parcours`, `faq`, `saisons-mtc` : sans Header/Footer locaux ; fond `bg-surface`, même chrome global.
- Icônes : **Material Symbols Outlined** (lien Google Fonts + classes dans `globals.css`).
- `next.config.js` : domaine images `lh3.googleusercontent.com` pour les visuels d’actus.

- ⚠️ Après modification Prisma : `npx prisma generate`.

### Mise en page accueil & pied de page (Mars 2026)

- **Carte « L’art du Yin Yoga »** (`HomeStitch.tsx`) : le bloc timer / rythme n’est plus en `absolute` — disposition **flex** (`md:flex-row`, `items-end`) pour que le texte ne soit jamais recouvert.
- **Pied léger + barre du bas** : `StitchAuxFooter` a un **`padding-bottom`** suffisant (`calc(6.75rem + safe-area)`) pour que la mention *Canopée — Yin Yoga…* et les liens ne passent pas sous **`StitchBottomNav`**. Le `<html>` inclut **`scroll-padding-bottom`** pour le défilement.

### Développement : chunks / CSS en 500 (ERR_ABORTED)

Si `/agenda` ou `/admin` renvoient **500** sur `/_next/static/...`, causes fréquentes : cache `.next` corrompu → `rm -rf .next && npm run dev` ; **deux instances** de `next dev` (ports 3000 et 3001) — n’en garder qu’une ; sous macOS, **`EMFILE: too many open files`** (Watchpack) peut empêcher la compilation fiable → augmenter la limite (`ulimit -n`) ou fermer des apps.

### Animations (Framer Motion, Mars 2026)

- **Transition de route** : `app/template.tsx` (client) — à chaque navigation App Router, le contenu entre en fondu + léger décalage vertical ; `/auth/*` plus courte et discrète. Respect de **`prefers-reduced-motion`** (`useReducedMotion`).
- **Composants** : `components/motion/Reveal.tsx` (apparition au scroll : `fade-up`, `fade`, `soft-zoom`, `slide-right`), `components/motion/Stagger.tsx` (`StaggerChildren` + `StaggerItem` pour échelonner les blocs), `components/motion/easings.ts` (courbe `easeCanopy`).
- **Utilisation** : accueil (`HomeStitch`, `PublicNewsBento`), agenda (`ScheduleBooking` — cartes séances en cascade au changement de jour), infos (`PracticalInfo`).
- **Dépendance** : `framer-motion` (^11).

### Harmonisation résiduelle Stitch (Mars 2026)

Pages et composants alignés sur les mêmes **tokens** que `/admin` et `/admin/classes` : `bg-surface`, `surface-container-low` / `lowest`, `text-primary` / `on-surface` / `on-surface-variant`, `outline-variant`, boutons **pilule** (`rounded-full`), champs **rounded-xl**.

- **Admin** : `/admin/news`, `/admin/users` ; `NewsFormModal`, `ClassFormModal` (en-têtes, champs, `z-[100]`).
- **Auth** : `/auth/signin`, `/auth/error`.
- **Public / compte** : `NewsModal`, `/profile`, FAQ, Mon parcours, Saisons MTC (textes et encarts).

### Évolution design Google Stitch — charte (Mars 2026)

- Palette surfaces / primary, Noto Serif + Manrope, ombres « ambient » — voir section **Charte Graphique** ci-dessous.
- **Footer** lourd (lune, MTC long) : fichier `components/Footer.tsx` **non branché** dans le layout actuel (menu + `/saisons-mtc` pour le contenu MTC). Réutilisable si besoin.

### Amélioration du bouton de déconnexion dans le Header (Mars 2026)

- ✅ Le bouton **« Déconnexion »** (desktop et mobile) dans `components/Header.tsx` appelle `signOut({ callbackUrl: "/" })`.
- ✅ Après la déconnexion, redirection vers `/`.
- ✅ Sur mobile, le menu se referme au clic sur Déconnexion.

### Amélioration de la page profil en cas d’erreur 500 (Mars 2026)

- ✅ La page `app/profile/page.tsx` importe désormais `signOut` de NextAuth.
- ✅ Lorsque l’appel à `/api/profile` renvoie une erreur serveur (statut ≥ 500), la page déclenche automatiquement `signOut({ callbackUrl: "/auth/signin" })` au lieu de rester bloquée sur « Redirection vers la connexion... » avec une session encore active dans le header.
- ✅ Objectif : éviter l’état incohérent « session côté client mais profil impossible à charger » et forcer une vraie déconnexion propre avant de renvoyer vers la page de connexion.

### Réservations aux cours : retrait du front (Mars 2026)

- ✅ Suppression de `components/ScheduleBooking.tsx` et remplacement de `/agenda` par une page statique informative (`app/agenda/page.tsx`) : pas d’appel à `/api/bookings`, renvoi vers l’accueil / connexion.
- ✅ CTAs « Réserver » / liens vers réservation : `HomeStitch`, `HomeHeroDesktop`, `yin-yoga` → libellés type « Voir l’agenda » / « Voir le planning » / « Infos agenda », hero premier slide « Connexion » au lieu de « S’inscrire » (compte, pas cours).
- ✅ Profil : section « Mes réservations » et fetch `/api/bookings` supprimés.
- ✅ Admin dashboard (`app/admin/page.tsx`) : plus de carte ni de compteur « Réservations », plus de ligne « inscrits » sur les cartes cours ; plus d’appel à `/api/admin/bookings` depuis cette page.
- ✅ Admin membres (`app/admin/users/page.tsx`) : colonne « Réservations » retirée.
- ℹ️ Les routes API `/api/bookings`, `/api/admin/bookings` restent disponibles pour un usage backend / outils.

### Vérification : Les données de profil existent-elles dans Supabase ? (Janvier 2025)

**Question :** Le problème de la page profile est-il lié au fait que Supabase ne dispose pas des informations à afficher sur cette page ?

**Réponse :** Probablement NON. D'après l'analyse du code, le problème vient plutôt de l'authentification (session, cookies) que de l'absence de données. Cependant, il est important de vérifier que les données existent bien dans Supabase.

**Guide de vérification créé** : `VERIFICATION_DONNEES_PROFILE.md` - Guide complet pour vérifier si les données de profil existent dans Supabase.

**Contenu du guide :**

1. ✅ **Méthodes de vérification** :
   - Via l'interface Supabase (Table Editor) - Recommandé
   - Via SQL Editor dans Supabase
   - Via Prisma Studio (local)
   - Via la ligne de commande (psql)

2. ✅ **Analyse du code** :
   - Ce que la page profile attend (interface UserProfile)
   - Ce que l'API profile récupère
   - Conclusion : Les champs optionnels peuvent être NULL

3. ✅ **Diagnostic** :
   - Si la table `users` est vide → C'est le problème
   - Si la table `users` contient des utilisateurs → Le problème vient de l'authentification

4. ✅ **Vérification des permissions RLS** :
   - Comment vérifier si Row Level Security bloque l'accès
   - Comment désactiver temporairement RLS pour tester

5. ✅ **Checklist de vérification** :
   - Liste de tous les points à vérifier
   - Actions recommandées selon le diagnostic

**Résultat :** Un guide complet permet de vérifier rapidement si le problème vient de l'absence de données dans Supabase ou d'un problème d'authentification. La plupart du temps, le problème vient de l'authentification (session, cookies, NEXTAUTH_URL) plutôt que de l'absence de données.

📖 **Guide complet** : Voir [VERIFICATION_DONNEES_PROFILE.md](./VERIFICATION_DONNEES_PROFILE.md)
