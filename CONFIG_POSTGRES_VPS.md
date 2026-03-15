# Configuration PostgreSQL sur le VPS (sans Supabase)

Ce guide permet de faire tourner Canopée avec **PostgreSQL installé directement sur le VPS**, sans Supabase. Connexion email/mot de passe et déconnexion fonctionnent correctement avec cette configuration.

## Option rapide : script automatique

Si le projet est à jour sur le VPS (avec `scripts/setup-postgres-vps.sh`) :

```bash
# Sur le VPS, une fois connecté en SSH
cd /var/www/canopee
git pull   # pour récupérer le script si besoin
bash scripts/setup-postgres-vps.sh
```

Le script : installe PostgreSQL si besoin, te demande le mot de passe pour l’utilisateur `canopee`, crée la base, met à jour le `.env`, lance les migrations, crée l’admin `admin@canopee.be` / `admin`, build et redémarre PM2.

---

## Méthode manuelle

### 1. Installer PostgreSQL sur le VPS

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
sudo systemctl status postgresql
```

### 2. Créer la base et l’utilisateur

```bash
sudo -u postgres psql -c "
CREATE USER canopee WITH ENCRYPTED PASSWORD 'VOTRE_MOT_DE_PASSE_ICI';
CREATE DATABASE canopee OWNER canopee;
GRANT ALL PRIVILEGES ON DATABASE canopee TO canopee;
\c canopee
GRANT ALL ON SCHEMA public TO canopee;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO canopee;
"
```

Remplacez `VOTRE_MOT_DE_PASSE_ICI` par un mot de passe fort. Pour une configuration plus sécurisée, créez l’utilisateur sans mot de passe en ligne de commande et saisissez-le quand PostgreSQL le demande.

### 3. Configurer le fichier .env sur le VPS

Sur le VPS, dans `/var/www/canopee/.env`, utilisez une **seule** `DATABASE_URL` qui pointe vers PostgreSQL local (plus de Supabase) :

```env
# PostgreSQL sur le VPS (localhost)
DATABASE_URL="postgresql://canopee:VOTRE_MOT_DE_PASSE_ICI@localhost:5432/canopee?schema=public"

# NextAuth
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl"
NEXTAUTH_URL="https://canopee.be"

# OAuth Google (optionnel)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# OAuth Facebook (optionnel)
FACEBOOK_CLIENT_ID="..."
FACEBOOK_CLIENT_SECRET="..."

NODE_ENV="production"
```

Générer un nouveau `NEXTAUTH_SECRET` si besoin :

```bash
openssl rand -base64 32
```

### 4. Appliquer les migrations Prisma

```bash
cd /var/www/canopee
npx prisma migrate deploy
```

Si les migrations n’ont jamais été appliquées sur cette base, toutes les tables (users, classes, bookings, etc.) seront créées.

### 5. Créer un utilisateur admin (email + mot de passe)

Pour vous connecter avec **email / mot de passe** (pas seulement Google), il faut au moins un utilisateur avec `authProvider: 'local'` et un `passwordHash`. Utilisez le script fourni :

```bash
cd /var/www/canopee

# Créer un admin : email admin@canopee.be, mot de passe "admin"
node scripts/create-admin.js admin@canopee.be admin Admin Admin

# Ou avec un autre email / mot de passe
node scripts/create-admin.js votre@email.be VotreMotDePasse Prénom Nom
```

Par défaut (sans arguments), le script crée : `admin@yogastudio.fr` / `admin123`.

Après la première connexion, changez le mot de passe (par exemple via la page profil ou en recréant l’admin avec un mot de passe fort).

### 6. Rebuild et redémarrer l’application

Après toute modification de `.env` ou du code, rebuild et redémarrage sont nécessaires :

```bash
cd /var/www/canopee
npm run build
pm2 restart canopee
pm2 logs canopee --lines 30
```

### 7. Vérifications

- **Connexion email/mot de passe** : aller sur `/auth/signin`, onglet « Connexion », saisir l’email et le mot de passe de l’admin créé.
- **Déconnexion** : cliquer sur « Déconnexion » → vous devez être redirigé et ne plus être connecté.
- **Inscription** : onglet « Inscription » sur `/auth/signin` crée un nouveau compte (local) et vous connecte.

## Dépannage

- **Erreur de connexion à la base** : vérifier que PostgreSQL tourne (`sudo systemctl status postgresql`) et que `DATABASE_URL` dans `.env` est correct (utilisateur, mot de passe, base `canopee`).
- **"relation does not exist"** : exécuter `npx prisma migrate deploy` dans `/var/www/canopee`.
- **Impossible de se déconnecter** : s’assurer que le dernier code est déployé (sans appel DB à chaque requête dans le callback JWT) et que `pm2 restart canopee` a bien été fait après un `git pull` et `npm run build`.
- **Connexion Google uniquement** : si vous ne voyez que Google, c’est souvent qu’il n’y a aucun utilisateur local avec mot de passe. Créer un admin avec `node scripts/create-admin.js admin@canopee.be admin Admin Admin` puis se connecter avec cet email et le mot de passe « admin ».

## Résumé des commandes (copier-coller)

```bash
cd /var/www/canopee
# 1) Vérifier .env : DATABASE_URL=postgresql://canopee:xxx@localhost:5432/canopee?schema=public
# 2) Migrations
npx prisma migrate deploy
# 3) Créer admin (email admin@canopee.be, mot de passe admin)
node scripts/create-admin.js admin@canopee.be admin Admin Admin
# 4) Rebuild et redémarrer
npm run build
pm2 restart canopee
pm2 logs canopee --lines 20
```
