# Guide de Déploiement sur OVH - Canopée

Ce guide vous explique comment déployer votre site Next.js sur OVH avec le domaine **canopée.be**.

## 📋 Prérequis

- Compte OVH avec le domaine **canopée.be** réservé
- **Pack Starter OVH** activé (hébergement web)
- **VPS-1 OVH** activé (pour l'application Node.js)
- Accès SSH au VPS-1
- Base de données : **Supabase** (déjà configurée) - https://kzogkberupkzpjdojvhn.supabase.co

## 🎯 Configuration Actuelle

Votre configuration :

- **Pack Starter OVH** : Hébergement web pour les fichiers statiques (optionnel)
- **VPS-1 OVH** : Serveur pour l'application Next.js (Node.js)
- **Domaine** : canopée.be
- **Base de données** : Supabase (déjà configurée)

## 🚀 Déploiement sur VPS-1 OVH

Cette configuration permet d'utiliser toutes les fonctionnalités de Next.js (API Routes, authentification, base de données).

### ⚡ Installation Rapide (Recommandée)

**Utiliser le script d'installation automatique** :

```bash
# Transférer le script sur le VPS
scp scripts/install-vps.sh root@IP_DU_VPS:/root/

# Se connecter au VPS
ssh root@IP_DU_VPS

# Exécuter le script
sudo bash install-vps.sh
```

Le script automatise toute l'installation. Voir [GUIDE_INSTALLATION_VPS.md](./GUIDE_INSTALLATION_VPS.md) pour plus de détails.

### 📖 Installation Manuelle

Si vous préférez installer manuellement, suivez les étapes ci-dessous :

### 1. Préparer le VPS-1

```bash
# Se connecter au VPS-1
ssh root@votre-ip-vps-ovh
# OU si vous avez configuré un utilisateur :
ssh votre-utilisateur@votre-ip-vps-ovh

# Mettre à jour le système
apt update && apt upgrade -y

# Installer Node.js 18+ (LTS recommandé)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Vérifier l'installation
node --version  # Doit afficher v18.x ou supérieur
npm --version

# Installer PM2 pour gérer le processus
npm install -g pm2

# Installer Nginx (reverse proxy)
apt install -y nginx

# Installer Git (pour cloner le projet)
apt install -y git
```

### 2. Base de données Supabase (Déjà configurée)

**⚠️ Important** : Nous utilisons Supabase (base de données hébergée), **PAS PostgreSQL local** sur le VPS.

Votre base de données Supabase est déjà configurée :

- **URL du Dashboard** : https://kzogkberupkzpjdojvhn.supabase.co
- **URL de connexion** : À récupérer dans Settings → Database

**Avantages** :

- ✅ Pas besoin d'installer PostgreSQL sur le VPS
- ✅ Sauvegardes automatiques
- ✅ Interface d'administration intégrée
- ✅ Scalabilité facile

**Pour récupérer l'URL de connexion** :

1. Allez sur https://kzogkberupkzpjdojvhn.supabase.co
2. Settings → Database
3. Copiez la "Connection string" (URI)
4. Format : `postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public`

📖 **Guide détaillé** : Voir [CONFIGURATION_SUPABASE.md](./CONFIGURATION_SUPABASE.md)

### 3. Cloner et configurer le projet

```bash
# Créer un répertoire pour l'application
mkdir -p /var/www/canopee
cd /var/www/canopee

# Cloner votre repository
git clone git@github.com:vincentchauvaux/canopee.git .
# OU si vous utilisez HTTPS :
# git clone https://github.com/vincentchauvaux/canopee.git .

# Installer les dépendances
npm install

# Créer le fichier .env
nano .env
```

Contenu du fichier `.env` :

```env
# Base de données Supabase
# Remplacer [PASSWORD] par votre mot de passe Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public"

# NextAuth
NEXTAUTH_URL="https://canopee.be"
NEXTAUTH_SECRET="votre-secret-nextauth-genere"

# OAuth (si configuré)
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
FACEBOOK_CLIENT_ID="votre-facebook-client-id"
FACEBOOK_CLIENT_SECRET="votre-facebook-client-secret"

# Domaine pour les images
NEXT_PUBLIC_DOMAIN="canopee.be"

# Environnement
NODE_ENV="production"
```

**Générer `NEXTAUTH_SECRET`** :

```bash
openssl rand -base64 32
```

**Important** : Remplacez `[PASSWORD]` par votre vrai mot de passe Supabase (celui défini lors de la création du projet).

### 4. Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy
```

### 5. Build de l'application

```bash
# Build en mode production
npm run build
```

### 6. Configurer PM2

Créer un fichier `ecosystem.config.js` :

```javascript
module.exports = {
  apps: [
    {
      name: "canopee",
      script: "npm",
      args: "start",
      cwd: "/var/www/canopee",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

Démarrer avec PM2 :

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Configurer Nginx

Créer `/etc/nginx/sites-available/canopee.be` :

```nginx
server {
    listen 80;
    server_name canopee.be www.canopee.be;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name canopee.be www.canopee.be;

    ssl_certificate /etc/letsencrypt/live/canopee.be/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/canopee.be/privkey.pem;

    # Logs
    access_log /var/log/nginx/canopee-access.log;
    error_log /var/log/nginx/canopee-error.log;

    # Taille maximale des uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Activer le site :

```bash
# Créer le lien symbolique
ln -s /etc/nginx/sites-available/canopee.be /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Recharger Nginx
systemctl reload nginx
```

### 8. Configurer SSL avec Let's Encrypt

```bash
# Installer Certbot
apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
certbot --nginx -d canopee.be -d www.canopee.be

# Suivre les instructions interactives
# Certbot configurera automatiquement Nginx

# Tester le renouvellement automatique
certbot renew --dry-run

# Vérifier que le renouvellement automatique est configuré
systemctl status certbot.timer
```

### 9. Configuration DNS

Dans votre espace OVH, configurez les DNS pour `canopee.be` :

1. Allez dans votre espace client OVH
2. **Domaines** → **canopee.be** → **Zone DNS**
3. Ajoutez/modifiez les enregistrements :

```
Type    Nom          Valeur           TTL
A       @            IP_DE_VOTRE_VPS-1  3600
A       www          IP_DE_VOTRE_VPS-1  3600
```

**Note** : Remplacez `IP_DE_VOTRE_VPS-1` par l'IP publique de votre VPS-1 (visible dans votre espace client OVH).

**Important** : La propagation DNS peut prendre jusqu'à 24-48h, mais généralement quelques heures suffisent.

---

## 🔄 Mise à jour de l'application

Pour mettre à jour l'application après des modifications :

```bash
# Se connecter au VPS
ssh root@votre-ip-ovh

# Aller dans le répertoire
cd /var/www/canopee

# Récupérer les dernières modifications
git pull

# Installer les nouvelles dépendances
npm install

# Appliquer les migrations de base de données (si nécessaire)
npx prisma migrate deploy

# Rebuild
npm run build

# Redémarrer l'application
pm2 restart canopee
```

---

## 🔧 Configuration OAuth pour la production

### Google OAuth

1. Dans [Google Cloud Console](https://console.cloud.google.com/)
2. Modifier les **Authorized redirect URIs** :
   - `https://canopee.be/api/auth/callback/google`
   - `https://www.canopee.be/api/auth/callback/google`
3. Mettre à jour les variables d'environnement sur le serveur dans le fichier `.env`

### Facebook OAuth

1. Dans [Facebook Developers](https://developers.facebook.com/)
2. Ajouter les domaines : `canopee.be` et `www.canopee.be`
3. Modifier les **Valid OAuth Redirect URIs** :
   - `https://canopee.be/api/auth/callback/facebook`
   - `https://www.canopee.be/api/auth/callback/facebook`

---

## 📊 Monitoring et Logs

```bash
# Voir les logs de l'application
pm2 logs canopee

# Voir le statut
pm2 status

# Voir les logs Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs
pm2 logs canopee

# Vérifier les variables d'environnement
pm2 env 0

# Redémarrer
pm2 restart canopee
```

### Erreur de connexion à la base de données

**Avec Supabase** :

- Vérifier que l'URL de connexion est correcte dans `.env`
- Vérifier que votre IP du VPS n'est pas bloquée (Settings → Database → Connection Pooling)
- Tester la connexion depuis le VPS : `psql "postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres"`
- Si nécessaire, ajouter l'IP du VPS dans les paramètres de sécurité Supabase

**Avec PostgreSQL local** :

```bash
# Vérifier que PostgreSQL tourne
systemctl status postgresql

# Tester la connexion
psql -U yoga_user -d yoga_studio
```

### Erreur 502 Bad Gateway

- Vérifier que l'application tourne : `pm2 status`
- Vérifier les logs Nginx : `tail -f /var/log/nginx/error.log`
- Vérifier le port 3000 : `netstat -tulpn | grep 3000`

---

## 📝 Checklist de Déploiement

- [ ] VPS-1 configuré avec Node.js 18+
- [ ] Base de données Supabase configurée (https://kzogkberupkzpjdojvhn.supabase.co)
- [ ] Fichier `.env` configuré avec toutes les variables (DATABASE_URL, NEXTAUTH_SECRET, etc.)
- [ ] Base de données initialisée avec Prisma (`npx prisma migrate deploy`)
- [ ] Application buildée (`npm run build`)
- [ ] PM2 configuré et application démarrée
- [ ] Nginx configuré comme reverse proxy pour canopee.be
- [ ] SSL/HTTPS activé avec Let's Encrypt
- [ ] DNS configuré pour pointer canopee.be vers le VPS-1
- [ ] OAuth configuré avec les URLs de production (si utilisé)
- [ ] Tests de l'application en production (https://canopee.be)

---

## 🆘 Support

Pour toute question ou problème :

- Documentation OVH : https://docs.ovh.com/
- Support OVH : Via votre espace client

---

## 📌 Notes Importantes

- **Pack Starter OVH** : Utilisé pour l'hébergement web classique (optionnel, non utilisé pour cette application)
- **VPS-1 OVH** : Serveur principal pour l'application Next.js (Node.js requis)
- **Base de données** : Supabase (déjà configurée, pas besoin d'installer PostgreSQL sur le VPS)
- **Domaine** : canopee.be (sans accent dans les configurations techniques)

## 🔗 Liens Utiles

- **Dashboard Supabase** : https://kzogkberupkzpjdojvhn.supabase.co
- **Espace client OVH** : https://www.ovh.com/manager/
- **Documentation Supabase** : Voir [CONFIGURATION_SUPABASE.md](./CONFIGURATION_SUPABASE.md)
