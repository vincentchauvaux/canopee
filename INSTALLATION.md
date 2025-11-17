# Guide d'Installation - Canopée

## 🚀 Installation Rapide

### 1. Prérequis

Assurez-vous d'avoir installé :
- **Node.js** 18+ ([télécharger](https://nodejs.org/))
- **npm** ou **yarn**
- **Base de données** : Supabase (recommandé) ou PostgreSQL local

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de la base de données

#### Option A: Supabase (Recommandé - Cloud)

1. **Créer un compte** : https://supabase.com
2. **Créer un nouveau projet**
3. **Récupérer la connection string** :
   - Aller dans Settings → Database
   - Copier la "Connection string" (URI)
   - Format : `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

4. **Configurer dans `.env`** :
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?schema=public"
```

📖 **Guide de migration** : Si vous avez déjà une base PostgreSQL, voir [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md)

#### Option B: PostgreSQL local

1. Créer une base de données PostgreSQL :
```sql
CREATE DATABASE yoga_studio;
```

2. Configurer la variable d'environnement dans `.env` :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/yoga_studio?schema=public"
```

#### Option C: Autres services cloud

- **Railway** (gratuit) : https://railway.app
- **Neon** (gratuit) : https://neon.tech

### 4. Configuration des variables d'environnement

1. Créer un fichier `.env` à la racine du projet
2. Copier les variables depuis `.env.example` (si disponible) ou utiliser ce template :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/yoga_studio?schema=public"

# NextAuth
# En développement
NEXTAUTH_URL="http://localhost:3000"
# En production (sur VPS-1 OVH)
# NEXTAUTH_URL="https://canopee.be"
NEXTAUTH_SECRET="votre-secret-ici"

# OAuth Google (optionnel pour commencer)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OAuth Facebook (optionnel pour commencer)
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# APIs (optionnel pour commencer)
GOOGLE_CALENDAR_API_KEY=""
MICROSOFT_CLIENT_ID=""
MICROSOFT_CLIENT_SECRET=""
MICROSOFT_TENANT_ID=""
```

**Générer NEXTAUTH_SECRET** :
```bash
openssl rand -base64 32
```

### 5. Initialisation de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les migrations et appliquer le schéma
npx prisma migrate dev --name init

# (Optionnel) Ouvrir Prisma Studio pour visualiser la base de données
npx prisma studio
```

### 6. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration OAuth (Optionnel)

### Google OAuth

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Activer l'API Google+ / Google Identity
4. Aller dans "Identifiants" → "Créer des identifiants" → "ID client OAuth 2.0"
5. Type d'application : Application Web
6. URI de redirection autorisées : `http://localhost:3000/api/auth/callback/google`
7. Copier le Client ID et Client Secret dans `.env`

### Facebook OAuth

1. Aller sur [Facebook Developers](https://developers.facebook.com/)
2. Créer une nouvelle application
3. Ajouter le produit "Facebook Login"
4. Aller dans "Paramètres" → "Paramètres de base"
5. Ajouter l'URI de redirection : `http://localhost:3000/api/auth/callback/facebook`
6. Copier l'ID de l'application et le Secret de l'application dans `.env`

## 🐛 Dépannage

### Erreur de connexion à la base de données

- **Avec Supabase** : Vérifier que l'URL de connexion est correcte dans `.env`
- **Avec PostgreSQL local** : 
  - Vérifier que PostgreSQL est en cours d'exécution
  - Vérifier les identifiants dans `DATABASE_URL`
  - Tester la connexion : `psql -U user -d yoga_studio`

### Erreur Prisma

```bash
# Réinitialiser Prisma
npx prisma generate
npx prisma migrate reset
npx prisma migrate dev
```

### Erreur NextAuth

- Vérifier que `NEXTAUTH_SECRET` est défini
- Vérifier que `NEXTAUTH_URL` correspond à l'URL du serveur

### Port déjà utilisé

Si le port 3000 est déjà utilisé :
```bash
# Utiliser un autre port
PORT=3001 npm run dev
```

## 📝 Prochaines Étapes

Une fois l'installation terminée :

1. Créer un compte admin (via Prisma Studio ou directement en base)
2. Tester l'authentification
3. Commencer à ajouter des cours dans l'agenda
4. Créer des actualités

## 🆘 Besoin d'aide ?

Consultez le [README.md](./README.md) pour plus d'informations.

