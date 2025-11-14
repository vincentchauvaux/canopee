# Canopée - Site One-Page

Site web moderne et élégant pour un studio de yoga avec système d'authentification, gestion d'agenda et fil d'actualité.

## 🚀 Technologies

- **Frontend**: Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + NextAuth.js
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js (Email, Google OAuth, Facebook OAuth)
- **Calendrier**: Intégration Google Calendar API et Microsoft Graph API (Outlook)

## 📋 Prérequis

- Node.js 18+
- PostgreSQL
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet** (si applicable) ou naviguer dans le dossier

2. **Installer les dépendances**:

```bash
npm install
```

3. **Configurer les variables d'environnement**:
   Créez un fichier `.env` à la racine du projet avec les variables suivantes:

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/yoga_studio?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth Facebook
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Google Calendar API
GOOGLE_CALENDAR_API_KEY="your-google-calendar-api-key"

# Microsoft Graph API (Outlook)
MICROSOFT_CLIENT_ID="your-microsoft-client-id"
MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret"
MICROSOFT_TENANT_ID="your-microsoft-tenant-id"
```

**Générer NEXTAUTH_SECRET**:

```bash
openssl rand -base64 32
```

4. **Configurer la base de données**:

```bash
# Générer le client Prisma
npx prisma generate

# Créer les migrations
npx prisma migrate dev --name init

# (Optionnel) Ouvrir Prisma Studio pour visualiser la base de données
npx prisma studio
```

5. **Lancer le serveur de développement**:

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
yoga/
├── app/
│   ├── api/              # API Routes
│   │   └── auth/         # Authentification
│   ├── auth/             # Pages d'authentification
│   ├── globals.css       # Styles globaux
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Page d'accueil
│   └── providers.tsx     # Providers (NextAuth)
├── components/           # Composants React
│   ├── Header.tsx        # Header sticky
│   ├── Hero.tsx          # Section hero
│   ├── Agenda.tsx        # Section agenda
│   ├── NewsFeed.tsx      # Fil d'actualité
│   ├── PracticalInfo.tsx # Informations pratiques
│   └── Footer.tsx        # Footer
├── prisma/
│   └── schema.prisma     # Schéma de base de données
├── public/               # Fichiers statiques
└── package.json
```

## 🎨 Charte Graphique - Canopée

### Couleurs

- **Primaire (60%) - Feuillage profond**: Vert Canopée `#264E36` / Vert feuille tendre `#4F7F5A`
- **Secondaire (30%) - Sous-bois & nature humide**: Mousse douce `#7DAA6A` / Lichen `#AFCFA1`
- **Accent (10%) - Lumière filtrée**: Lumière forestière `#F2E8C9`
- **Neutres - Terre & tronc**: Écorce foncée `#2A2D23`, Écorce claire `#DAD7CD`, Blanc `#FFFFFF`

### Typographie

- **Titres**: Cormorant Garamond (serif)
- **Corps**: Inter / Montserrat (sans-serif)

## 🔐 Authentification

Le site supporte trois méthodes d'authentification:

1. **Email + Mot de passe** (inscription/connexion locale)
2. **Google OAuth**
3. **Facebook OAuth**

### Configuration OAuth

#### Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet
3. Activer l'API Google+
4. Créer des identifiants OAuth 2.0
5. Ajouter l'URI de redirection: `http://localhost:3000/api/auth/callback/google`

#### Facebook OAuth

1. Aller sur [Facebook Developers](https://developers.facebook.com/)
2. Créer une nouvelle application
3. Ajouter Facebook Login
4. Configurer les URI de redirection: `http://localhost:3000/api/auth/callback/facebook`

## 📅 Fonctionnalités

### ✅ Implémenté

- [x] Structure de base (Header, Hero, sections)
- [x] Design responsive
- [x] Schéma de base de données Prisma
- [x] Authentification de base (NextAuth.js)
- [x] Page de connexion/inscription
- [x] Footer avec phase lunaire (simulée)

### 🚧 À implémenter

- [ ] Intégration complète de l'agenda avec calendrier
- [ ] Synchronisation Google Calendar API
- [ ] Synchronisation Microsoft Graph API (Outlook)
- [ ] Système d'actualités complet avec CRUD
- [ ] Système de commentaires
- [ ] Panel admin
- [ ] Gestion des réservations
- [ ] Profil utilisateur avec upload de photo
- [ ] Intégration API phase lunaire réelle

## 🗄️ Base de Données

### Modèles Prisma

- **User**: Utilisateurs (local, Google, Facebook)
- **Class**: Cours de yoga
- **News**: Articles d'actualité
- **Comment**: Commentaires sur les actualités
- **Booking**: Réservations de cours

## 🚀 Déploiement

### Vercel (Recommandé)

1. Installer Vercel CLI:

```bash
npm i -g vercel
```

2. Déployer:

```bash
vercel
```

3. Configurer les variables d'environnement dans le dashboard Vercel

4. Configurer la base de données PostgreSQL (ex: Supabase, Railway, Neon)

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Configurer les variables d'environnement

## 📝 Scripts Disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Build de production
- `npm run start` - Lancer le serveur de production
- `npm run lint` - Linter le code

## 🔒 Sécurité

- JWT tokens pour l'authentification
- Mots de passe hashés avec bcrypt
- Validation des inputs avec Zod
- Protection CSRF (NextAuth)
- Rate limiting (à implémenter)

## 📱 Responsive Design

Le site est entièrement responsive avec une approche mobile-first:

- Mobile: 1 colonne
- Tablette: 2 colonnes
- Desktop: 3-4 colonnes

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

## 🆘 Support

Pour toute question ou problème, ouvrez une issue sur le repository.
