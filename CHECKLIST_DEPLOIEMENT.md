# ✅ Checklist de Déploiement - Canopée

Cette checklist vous permet de suivre l'avancement de votre déploiement sur OVH.

## 📋 Prérequis

- [ ] Compte OVH avec le domaine **canopée.be** réservé
- [ ] **Pack Starter OVH** activé (optionnel, non utilisé pour l'application)
- [ ] **VPS-1 OVH** activé et accessible via SSH
- [ ] Base de données **Supabase** configurée (https://kzogkberupkzpjdojvhn.supabase.co)
- [ ] Repository GitHub accessible (`git@github.com:vincentchauvaux/canopee.git`)

## 🖥️ Configuration du VPS-1

### Installation des outils

- [ ] Connexion SSH au VPS-1 réussie
- [ ] Système mis à jour (`apt update && apt upgrade -y`)
- [ ] Node.js 18+ installé (`node --version` doit afficher v18.x ou supérieur)
- [ ] npm installé (`npm --version`)
- [ ] PM2 installé globalement (`npm install -g pm2`)
- [ ] Nginx installé (`apt install -y nginx`)
- [ ] Git installé (`apt install -y git`)

## 🗄️ Base de données Supabase

- [ ] Accès au dashboard Supabase (https://kzogkberupkzpjdojvhn.supabase.co)
- [ ] Mot de passe de la base de données récupéré (Settings → Database)
- [ ] URL de connexion PostgreSQL copiée
- [ ] Test de connexion réussi depuis le VPS (optionnel : `psql "postgresql://..."`)

## 📦 Déploiement de l'application

### Clonage et installation

- [ ] Répertoire créé (`mkdir -p /var/www/canopee`)
- [ ] Repository cloné (`git clone git@github.com:vincentchauvaux/canopee.git /var/www/canopee`)
- [ ] Dépendances installées (`npm install`)

### Configuration des variables d'environnement

- [ ] Fichier `.env` créé dans `/var/www/canopee`
- [ ] `DATABASE_URL` configuré avec l'URL Supabase complète
- [ ] `NEXTAUTH_SECRET` généré (`openssl rand -base64 32`) et ajouté
- [ ] `NEXTAUTH_URL` configuré (`https://canopee.be` pour la production)
- [ ] `NODE_ENV` configuré (`production`)
- [ ] `NEXT_PUBLIC_DOMAIN` configuré (`canopee.be`)
- [ ] `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` configurés (si OAuth Google utilisé)
- [ ] `FACEBOOK_CLIENT_ID` et `FACEBOOK_CLIENT_SECRET` configurés (si OAuth Facebook utilisé)

### Initialisation de la base de données

- [ ] Client Prisma généré (`npx prisma generate`)
- [ ] Migrations appliquées (`npx prisma migrate deploy`)
- [ ] Vérification que les tables sont créées (via Prisma Studio ou Supabase Dashboard)

### Build de l'application

- [ ] Application buildée (`npm run build`)
- [ ] Aucune erreur lors du build
- [ ] Dossier `.next/` généré avec succès

## ⚙️ Configuration PM2

- [ ] Fichier `ecosystem.config.js` présent dans `/var/www/canopee`
- [ ] Application démarrée avec PM2 (`pm2 start ecosystem.config.js`)
- [ ] PM2 sauvegardé (`pm2 save`)
- [ ] PM2 configuré pour démarrer au boot (`pm2 startup`)
- [ ] Application accessible sur `http://localhost:3000` depuis le VPS

## 🌐 Configuration Nginx

- [ ] Fichier de configuration créé (`/etc/nginx/sites-available/canopee.be`)
- [ ] Configuration Nginx testée (`nginx -t`)
- [ ] Lien symbolique créé (`ln -s /etc/nginx/sites-available/canopee.be /etc/nginx/sites-enabled/`)
- [ ] Nginx rechargé (`systemctl reload nginx`)
- [ ] Site accessible via IP du VPS (avant configuration DNS)

## 🔒 Configuration SSL/HTTPS

- [ ] Certbot installé (`apt install -y certbot python3-certbot-nginx`)
- [ ] Certificat SSL obtenu (`certbot --nginx -d canopee.be -d www.canopee.be`)
- [ ] Certificat SSL configuré automatiquement par Certbot
- [ ] Renouvellement automatique testé (`certbot renew --dry-run`)
- [ ] Service certbot.timer vérifié (`systemctl status certbot.timer`)

## 🌍 Configuration DNS

- [ ] Accès à l'espace client OVH
- [ ] Zone DNS du domaine `canopee.be` ouverte
- [ ] Enregistrement A pour `@` (racine) pointant vers l'IP du VPS-1
- [ ] Enregistrement A pour `www` pointant vers l'IP du VPS-1
- [ ] Propagation DNS vérifiée (peut prendre jusqu'à 24-48h)

## 🔐 Configuration OAuth (si utilisé)

### Google OAuth

- [ ] Google Cloud Console ouvert
- [ ] Authorized redirect URIs mis à jour :
  - `https://canopee.be/api/auth/callback/google`
  - `https://www.canopee.be/api/auth/callback/google`
- [ ] Variables d'environnement mises à jour sur le serveur

### Facebook OAuth

- [ ] Facebook Developers Console ouvert
- [ ] Domaines ajoutés : `canopee.be` et `www.canopee.be`
- [ ] Valid OAuth Redirect URIs mis à jour :
  - `https://canopee.be/api/auth/callback/facebook`
  - `https://www.canopee.be/api/auth/callback/facebook`
- [ ] Variables d'environnement mises à jour sur le serveur

## ✅ Tests finaux

- [ ] Site accessible via `https://canopee.be` (sans www)
- [ ] Site accessible via `https://www.canopee.be` (avec www)
- [ ] Redirection HTTP → HTTPS fonctionne
- [ ] Page d'accueil s'affiche correctement
- [ ] Authentification fonctionne (email/password)
- [ ] Authentification OAuth fonctionne (si configuré)
- [ ] Agenda s'affiche et fonctionne
- [ ] Réservation de cours fonctionne
- [ ] Fil d'actualité s'affiche
- [ ] Panel admin accessible (si utilisateur admin)
- [ ] Images et ressources statiques se chargent correctement
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas d'erreurs dans les logs PM2 (`pm2 logs canopee`)
- [ ] Pas d'erreurs dans les logs Nginx (`tail -f /var/log/nginx/error.log`)

## 📊 Monitoring

- [ ] PM2 monitor configuré (`pm2 monit`)
- [ ] Logs PM2 vérifiés régulièrement
- [ ] Logs Nginx vérifiés régulièrement
- [ ] Performance du site vérifiée (Lighthouse, PageSpeed)

## 🔄 Mise à jour future

Pour mettre à jour l'application :

```bash
# Se connecter au VPS
ssh root@votre-ip-ovh

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

## 🆘 En cas de problème

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

- Vérifier que l'URL de connexion est correcte dans `.env`
- Vérifier que l'IP du VPS n'est pas bloquée dans Supabase
- Tester la connexion : `psql "postgresql://..."`

### Erreur 502 Bad Gateway

- Vérifier que l'application tourne : `pm2 status`
- Vérifier les logs Nginx : `tail -f /var/log/nginx/error.log`
- Vérifier le port 3000 : `netstat -tulpn | grep 3000`

## 📝 Notes

- **Pack Starter OVH** : Non utilisé pour cette application (optionnel)
- **VPS-1 OVH** : Serveur principal pour l'application Next.js
- **Base de données** : Supabase (hébergée, pas besoin d'installer PostgreSQL)
- **Domaine** : canopee.be (sans accent dans les configurations techniques)

---

**Date de dernière mise à jour** : $(date)

**Statut** : 🚧 En cours de déploiement


