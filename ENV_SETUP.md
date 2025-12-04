# Configuration des Variables d'Environnement

Ce guide explique comment configurer le fichier `.env` pour le projet Canopée.

## 📋 Création du fichier .env

Créez un fichier `.env` à la racine du projet :

```bash
touch .env
```

## 🔧 Variables Obligatoires

### Base de données

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?schema=public"
```

**Format Supabase :**

- Remplacez `[PASSWORD]` par votre mot de passe Supabase
- Remplacez `[PROJECT]` par votre ID de projet Supabase
- Exemple : `postgresql://postgres:monmotdepasse@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public`

**Format PostgreSQL local :**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/yoga_studio?schema=public"
```

### NextAuth

```env
# Secret pour signer les tokens JWT
# Générer avec : openssl rand -base64 32
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl"

# URL publique de l'application
# Développement : http://localhost:3000
# Production : https://canopee.be
NEXTAUTH_URL="http://localhost:3000"
```

**Générer NEXTAUTH_SECRET :**

```bash
openssl rand -base64 32
```

### Environnement

```env
# production | development
NODE_ENV="development"

# Domaine public (pour les images et URLs)
# Développement : localhost:3000
# Production : canopee.be
NEXT_PUBLIC_DOMAIN="localhost:3000"
```

## 🔐 Variables Optionnelles (OAuth)

### Google OAuth

Si vous souhaitez activer l'authentification Google :

```env
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
```

**Configuration :**

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet
3. Activer l'API Google+
4. Créer des identifiants OAuth 2.0
5. Ajouter l'URI de redirection : `http://localhost:3000/api/auth/callback/google` (dev) ou `https://canopee.be/api/auth/callback/google` (prod)

📖 **Guide détaillé** : Voir [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

### Facebook OAuth

Si vous souhaitez activer l'authentification Facebook :

```env
FACEBOOK_CLIENT_ID="votre-facebook-app-id"
FACEBOOK_CLIENT_SECRET="votre-facebook-app-secret"
```

**Configuration :**

1. Aller sur [Facebook Developers](https://developers.facebook.com/)
2. Créer une nouvelle application
3. Ajouter Facebook Login
4. Configurer les URI de redirection : `http://localhost:3000/api/auth/callback/facebook` (dev) ou `https://canopee.be/api/auth/callback/facebook` (prod)

## 📝 Fichier .env complet (exemple)

### Développement

```env
# Base de données
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?schema=public"

# NextAuth
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Google (optionnel)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OAuth Facebook (optionnel)
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""

# Environnement
NODE_ENV="development"
NEXT_PUBLIC_DOMAIN="localhost:3000"
```

### Production

```env
# Base de données
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public"

# NextAuth
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl"
NEXTAUTH_URL="https://canopee.be"

# OAuth Google (optionnel)
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"

# OAuth Facebook (optionnel)
FACEBOOK_CLIENT_ID="votre-facebook-client-id"
FACEBOOK_CLIENT_SECRET="votre-facebook-client-secret"

# Environnement
NODE_ENV="production"
NEXT_PUBLIC_DOMAIN="canopee.be"
```

## ✅ Vérification

Après avoir créé le fichier `.env`, vérifiez que toutes les variables obligatoires sont définies :

```bash
# Vérifier que le fichier existe
ls -la .env

# Vérifier le contenu (sans afficher les secrets)
grep -E "^[A-Z_]+=" .env | cut -d'=' -f1
```

## 🔒 Sécurité

⚠️ **Important :**

- Le fichier `.env` est ignoré par Git (dans `.gitignore`)
- Ne jamais commiter le fichier `.env` dans le repository
- Ne jamais partager vos secrets publiquement
- Utiliser des secrets différents pour le développement et la production

## 🚀 Prochaines étapes

Après avoir configuré le fichier `.env` :

1. Installer les dépendances : `npm install`
2. Générer le client Prisma : `npx prisma generate`
3. Appliquer les migrations : `npx prisma migrate deploy`
4. Lancer le serveur : `npm run dev`

## 📚 Documentation complémentaire

- [INSTALLATION.md](./INSTALLATION.md) - Guide d'installation complet
- [CONFIGURATION_SUPABASE.md](./CONFIGURATION_SUPABASE.md) - Configuration Supabase
- [DEPLOIEMENT_OVH.md](./DEPLOIEMENT_OVH.md) - Guide de déploiement
- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - Configuration Google OAuth
