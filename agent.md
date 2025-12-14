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
- Projet initialisé et poussé sur GitHub avec commit initial

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
- `app/api/admin/users/route.ts` - Liste des utilisateurs (admin uniquement)
- `app/api/admin/bookings/route.ts` - Liste des réservations (admin uniquement)
- `app/api/lunar/route.ts` - Récupération des informations lunaires depuis lunopia.com (phase, illumination, image dynamique)

### Composants

- `components/Header.tsx` - Header sticky avec transition et adaptation automatique des couleurs de texte selon le background (blanc sur fond transparent, couleurs sombres sur fond blanc). Sur les pages `/profile`, `/mon-parcours`, `/yin-yoga` et `/faq`, le header a un fond blanc dès le départ (pas d'effet de transparence)
- `components/Hero.tsx` - Section hero avec carrousel d'images automatique (7 images qui défilent toutes les 5 secondes) et citation aléatoire
- `components/Agenda.tsx` - Section agenda interactive avec calendrier hebdomadaire, réservations
- `components/NewsFeed.tsx` - Fil d'actualité affichant les descriptions des prochains cours (3 par défaut, bouton "Voir plus" pour afficher plus)
- `components/NewsModal.tsx` - Modal pour afficher les détails d'une actualité
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
