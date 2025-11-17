# 🚀 Guide d'Installation VPS - Canopée

Guide complet pour installer et déployer Canopée sur un VPS OVH (Ubuntu 22.04).

## 📋 Prérequis

- **VPS OVH** : VPS Essentials 2 vCores / 4 Go RAM / 80 Go SSD (recommandé)
- **Système** : Ubuntu 22.04 LTS
- **Accès** : SSH avec droits root
- **Base de données** : Supabase (déjà configurée) - https://kzogkberupkzpjdojvhn.supabase.co

## 🎯 Méthode 1 : Installation Automatique (Recommandée)

### Utiliser le script d'installation

Le script `scripts/install-vps.sh` automatise toute l'installation :

```bash
# Sur votre machine locale, transférer le script
scp scripts/install-vps.sh root@IP_DU_VPS:/root/

# Se connecter au VPS
ssh root@IP_DU_VPS

# Rendre le script exécutable
chmod +x install-vps.sh

# Exécuter le script
sudo bash install-vps.sh
```

Le script va :
- ✅ Mettre à jour le système
- ✅ Installer Node.js 18+, PM2, Nginx, Git
- ✅ Cloner le repository
- ✅ Installer les dépendances
- ✅ Configurer les variables d'environnement (interactif)
- ✅ Générer Prisma et appliquer les migrations
- ✅ Builder l'application
- ✅ Configurer PM2
- ✅ Configurer Nginx
- ✅ Installer SSL avec Let's Encrypt (optionnel)

## 🎯 Méthode 2 : Installation Manuelle

### Étape 1 : Préparer le VPS

```bash
# Se connecter au VPS
ssh root@IP_DU_VPS

# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier l'installation
node -v  # Doit afficher v18.x ou supérieur
npm -v

# Installer PM2
sudo npm install -g pm2

# Installer Nginx
sudo apt install -y nginx

# Installer Git
sudo apt install -y git
```

### Étape 2 : Cloner et configurer le projet

```bash
# Créer le répertoire
sudo mkdir -p /var/www/canopee
cd /var/www/canopee

# Cloner le repository
git clone git@github.com:vincentchauvaux/canopee.git .

# Installer les dépendances
npm install
```

### Étape 3 : Configurer les variables d'environnement

```bash
# Créer le fichier .env
nano .env
```

Contenu du fichier `.env` :

```env
# Base de données Supabase
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

**Générer NEXTAUTH_SECRET** :
```bash
openssl rand -base64 32
```

**Important** : Remplacez `[PASSWORD]` par votre vrai mot de passe Supabase (récupéré dans Settings → Database).

### Étape 4 : Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy
```

### Étape 5 : Build de l'application

```bash
# Build en mode production
npm run build
```

### Étape 6 : Configurer PM2

Le fichier `ecosystem.config.js` est déjà présent dans le projet. Démarrer l'application :

```bash
# Démarrer l'application
pm2 start ecosystem.config.js

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique
pm2 startup
```

### Étape 7 : Configurer Nginx

```bash
# Supprimer la config par défaut
sudo rm /etc/nginx/sites-enabled/default

# Créer la configuration
sudo nano /etc/nginx/sites-available/canopee
```

Contenu de la configuration Nginx :

```nginx
server {
    listen 80;
    server_name canopee.be www.canopee.be;

    # Redirection HTTPS (sera activée après installation SSL)
    # return 301 https://$server_name$request_uri;

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
sudo ln -s /etc/nginx/sites-available/canopee /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### Étape 8 : Installer SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d canopee.be -d www.canopee.be

# Suivre les instructions interactives
# Certbot configurera automatiquement Nginx

# Tester le renouvellement automatique
sudo certbot renew --dry-run
```

**Note** : Certbot modifiera automatiquement la configuration Nginx pour activer HTTPS.

### Étape 9 : Configurer le DNS dans OVH

1. Allez dans votre espace client OVH
2. **Domaines** → **canopee.be** → **Zone DNS**
3. Modifiez l'enregistrement **A** pour pointer vers l'IP de votre VPS :
   ```
   Type    Nom          Valeur           TTL
   A       @            IP_DU_VPS         3600
   A       www          IP_DU_VPS         3600
   ```

**Trouver l'IP de votre VPS** :
```bash
curl ifconfig.me
```

**Important** : La propagation DNS peut prendre jusqu'à 24-48h, mais généralement quelques heures suffisent.

## ✅ Vérification

### Vérifier que l'application tourne

```bash
# Voir le statut PM2
pm2 status

# Voir les logs
pm2 logs canopee

# Tester l'application directement
curl http://localhost:3000
```

### Tester depuis l'extérieur

- **Via IP** : `http://IP_DU_VPS` (devrait rediriger vers HTTPS si SSL est configuré)
- **Via domaine** : `https://canopee.be` (après configuration DNS)

## 🔄 Mise à jour de l'application

Pour mettre à jour l'application après des modifications :

```bash
# Se connecter au VPS
ssh root@IP_DU_VPS

# Aller dans le répertoire
cd /var/www/canopee

# Récupérer les dernières modifications
git pull

# Installer les nouvelles dépendances
npm install

# Appliquer les migrations (si nécessaire)
npx prisma migrate deploy

# Rebuild
npm run build

# Redémarrer l'application
pm2 restart canopee
```

## 📊 Commandes Utiles

### PM2

```bash
# Voir le statut
pm2 status

# Voir les logs
pm2 logs canopee

# Redémarrer
pm2 restart canopee

# Arrêter
pm2 stop canopee

# Supprimer
pm2 delete canopee

# Monitorer
pm2 monit
```

### Nginx

```bash
# Tester la configuration
sudo nginx -t

# Recharger
sudo systemctl reload nginx

# Redémarrer
sudo systemctl restart nginx

# Voir les logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/canopee-access.log
```

### Base de données

```bash
# Tester la connexion Supabase
psql "postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres"
```

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Vérifier les logs
pm2 logs canopee

# Vérifier les variables d'environnement
pm2 env 0

# Vérifier que le port 3000 est libre
netstat -tulpn | grep 3000
```

### Erreur 502 Bad Gateway

- Vérifier que l'application tourne : `pm2 status`
- Vérifier les logs Nginx : `sudo tail -f /var/log/nginx/error.log`
- Vérifier le port 3000 : `netstat -tulpn | grep 3000`

### Erreur de connexion à la base de données

- Vérifier que l'URL de connexion est correcte dans `.env`
- Vérifier que l'IP du VPS n'est pas bloquée dans Supabase (Settings → Database → Connection Pooling)
- Tester la connexion : `psql "postgresql://..."`

### Le site ne s'affiche pas

- Vérifier la configuration DNS (doit pointer vers l'IP du VPS)
- Vérifier que Nginx tourne : `sudo systemctl status nginx`
- Vérifier que l'application tourne : `pm2 status`
- Vérifier les logs : `pm2 logs canopee` et `sudo tail -f /var/log/nginx/error.log`

## 📝 Notes Importantes

- **Base de données** : Nous utilisons Supabase (hébergée), pas PostgreSQL local
- **Pack Starter OVH** : Non utilisé pour cette application (optionnel)
- **VPS-1 OVH** : Serveur principal pour l'application Next.js
- **Domaine** : canopee.be (sans accent dans les configurations techniques)

## 🔗 Liens Utiles

- **Dashboard Supabase** : https://kzogkberupkzpjdojvhn.supabase.co
- **Espace client OVH** : https://www.ovh.com/manager/
- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation PM2** : https://pm2.keymetrics.io/docs/

---

**Guide créé le** : $(date)

**Version** : 1.0


