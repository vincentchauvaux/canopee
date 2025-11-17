# Analyse du Projet - Déploiement OVH

## 1. Type de Site

**Application Node.js/SSR (Next.js)**

**Explication :**

- Le projet utilise **Next.js 14** avec l'App Router
- Présence de routes API (`app/api/`) qui nécessitent un serveur Node.js
- Utilisation de NextAuth.js pour l'authentification (nécessite un serveur)
- Connexion à une base de données PostgreSQL via Prisma (nécessite un serveur)
- Le fichier `next.config.js` montre que l'export statique est commenté (ligne 19 : `// output: 'export'`)
- Le projet utilise le rendu côté serveur (SSR) et les Server Components de Next.js

**Conclusion :** Ce n'est **PAS** un site statique. C'est une application Next.js qui nécessite un serveur Node.js pour fonctionner.

---

## 2. Commandes de Build

### Installation des dépendances

```bash
npm install
```

### Construction du projet

```bash
npm run build
```

### Démarrage en production

```bash
npm start
```

**Note :** La commande `npm run build` génère les fichiers optimisés dans le dossier `.next/` et prépare l'application pour la production.

---

## 3. Dossier des Fichiers de Production

**Dossier : `.next/`**

Next.js génère tous les fichiers de production dans le dossier `.next/` lors de l'exécution de `npm run build`. Ce dossier contient :

- Les pages pré-rendues
- Les routes API compilées
- Les assets optimisés
- Les fichiers de configuration nécessaires au runtime

**Important :** Le dossier `.next/` est généralement ignoré par Git (dans `.gitignore`). Il doit être généré sur le serveur de production après `npm install` et `npm run build`.

---

## 4. Serveur Nécessaire

**OUI, un serveur Node.js est obligatoire**

**Raisons :**

- Routes API (`/api/*`) nécessitent un serveur Node.js
- NextAuth.js nécessite un serveur pour gérer les sessions
- Connexion à la base de données PostgreSQL via Prisma
- Rendu côté serveur (SSR) de Next.js
- Gestion des requêtes dynamiques

**Le projet ne peut PAS être servi comme simple fichiers statiques.**

**Commande de démarrage :** `npm start` (ou `next start`)

---

## 5. Base de Données

**OUI, le projet utilise une base de données**

### Type

**PostgreSQL** (peut être hébergé sur Supabase, Railway, Neon, ou localement)

### Configuration

- **ORM :** Prisma
- **Fichier de schéma :** `prisma/schema.prisma`
- **URL de connexion :** Variable d'environnement `DATABASE_URL`

### Modèles de données

- `User` (utilisateurs avec authentification)
- `Class` (cours de yoga)
- `News` (actualités)
- `Comment` (commentaires sur les actualités)
- `Booking` (réservations de cours)

### Paramètres de connexion

La connexion est configurée dans `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Format attendu de DATABASE_URL :**

```
postgresql://user:password@host:port/database?schema=public
```

---

## 6. Variables d'Environnement Nécessaires

### Variables obligatoires

| Variable          | Description                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`    | URL de connexion PostgreSQL (format : `postgresql://user:password@host:port/database?schema=public`) |
| `NEXTAUTH_SECRET` | Secret pour signer les tokens JWT de NextAuth.js (générer avec : `openssl rand -base64 32`)          |
| `NEXTAUTH_URL`    | URL publique de l'application (ex : `https://canopée.be`)                                            |

### Variables optionnelles (OAuth)

| Variable                 | Description                                                     |
| ------------------------ | --------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`       | ID client Google OAuth (si authentification Google activée)     |
| `GOOGLE_CLIENT_SECRET`   | Secret client Google OAuth                                      |
| `FACEBOOK_CLIENT_ID`     | ID client Facebook OAuth (si authentification Facebook activée) |
| `FACEBOOK_CLIENT_SECRET` | Secret client Facebook OAuth                                    |

### Variables système

| Variable                    | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `NODE_ENV`                  | Environnement d'exécution (`production` en production)                      |
| `NEXT_PUBLIC_STATIC_EXPORT` | Optionnel : `true` pour forcer l'export statique (non utilisé actuellement) |

### Fichier `.env` recommandé en production

```env
# Base de données
DATABASE_URL=postgresql://user:password@host:port/database?schema=public

# NextAuth
NEXTAUTH_SECRET=votre_secret_genere_avec_openssl
NEXTAUTH_URL=https://canopée.be

# OAuth (optionnel)
GOOGLE_CLIENT_ID=votre_google_client_id
GOOGLE_CLIENT_SECRET=votre_google_client_secret
FACEBOOK_CLIENT_ID=votre_facebook_client_id
FACEBOOK_CLIENT_SECRET=votre_facebook_client_secret

# Environnement
NODE_ENV=production
```

---

## 7. Fichier de Configuration de Déploiement

**Fichier : `next.config.js`**

### Configuration actuelle

- **React Strict Mode** : Activé
- **Images** : Domaines autorisés : `localhost`, `www.lunopia.com`, `canopée.be`
- **Optimisation des images** : Désactivée si `NEXT_PUBLIC_STATIC_EXPORT=true` (non utilisé actuellement)
- **Export statique** : Commenté (ligne 19) - l'application utilise le mode SSR

### Points importants pour le déploiement

- Les images externes de `lunopia.com` sont autorisées (pour la phase lunaire)
- Le domaine `canopée.be` est configuré pour les images
- L'application est configurée pour le mode SSR (pas d'export statique)

---

## Résumé pour Déploiement OVH

### Prérequis

1. **Node.js** (version 18+ recommandée)
2. **Base de données** : Supabase (recommandé) ou PostgreSQL
3. **PM2** ou **systemd** (gestionnaire de processus, optionnel mais recommandé)

### Étapes de déploiement

1. Installer les dépendances : `npm install`
2. Générer le client Prisma : `npx prisma generate`
3. Appliquer les migrations : `npx prisma migrate deploy`
4. Configurer les variables d'environnement (fichier `.env`)
5. Construire l'application : `npm run build`
6. Démarrer le serveur : `npm start` (ou utiliser PM2)

### Fichiers à déployer

- Tous les fichiers du projet (sauf `node_modules/` et `.next/`)
- Le dossier `.next/` sera généré sur le serveur après `npm run build`

### Port par défaut

Next.js écoute sur le port **3000** par défaut. Configurer un reverse proxy (Nginx) pour rediriger le trafic depuis le port 80/443 vers le port 3000.
