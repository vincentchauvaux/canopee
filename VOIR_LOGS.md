# 📊 Guide : Comment voir les logs

Ce guide explique comment visualiser les logs de l'application Canopée en développement et en production.

## 🖥️ En développement local

### Console du terminal

Lorsque vous lancez l'application en mode développement :

```bash
npm run dev
```

Tous les logs (`console.log`, `console.error`, etc.) s'affichent directement dans le terminal où l'application tourne.

### Logs Prisma

Les logs Prisma sont configurés dans `lib/prisma.ts` :

- **En développement** : Affiche les requêtes, erreurs et avertissements
- **En production** : Affiche uniquement les erreurs

Pour voir les requêtes SQL en développement, les logs apparaissent automatiquement dans la console.

## 🚀 En production (VPS OVH)

### 1. Logs PM2 (Application Next.js)

PM2 gère l'application et stocke les logs dans des fichiers.

#### Voir les logs en temps réel

```bash
# Se connecter au VPS
ssh ubuntu@51.178.44.114

# Aller dans le répertoire de l'application
cd /var/www/canopee

# Voir tous les logs en temps réel
pm2 logs canopee

# Voir les 50 dernières lignes
pm2 logs canopee --lines 50

# Voir uniquement les erreurs
pm2 logs canopee --err

# Voir uniquement la sortie standard
pm2 logs canopee --out
```

#### Voir les fichiers de logs directement

Les logs sont stockés dans `/var/www/canopee/logs/` :

```bash
cd /var/www/canopee

# Voir les erreurs
tail -f logs/err.log

# Voir la sortie standard
tail -f logs/out.log

# Voir les 100 dernières lignes d'erreur
tail -n 100 logs/err.log

# Rechercher une erreur spécifique
grep "ERROR" logs/err.log
grep "401" logs/err.log
```

#### Statut et informations PM2

```bash
# Voir le statut de l'application
pm2 status

# Voir les informations détaillées
pm2 info canopee

# Voir les variables d'environnement
pm2 env 0
```

### 2. Logs Nginx (Reverse Proxy)

Nginx fait office de reverse proxy et a ses propres logs.

```bash
# Logs d'erreur Nginx
sudo tail -f /var/log/nginx/error.log

# Logs d'accès Nginx (toutes les requêtes)
sudo tail -f /var/log/nginx/access.log

# Voir les 100 dernières lignes d'erreur
sudo tail -n 100 /var/log/nginx/error.log

# Rechercher des erreurs spécifiques
sudo grep "502" /var/log/nginx/error.log
sudo grep "canopee" /var/log/nginx/access.log
```

### 3. Logs d'authentification

Les logs d'authentification sont configurés dans `lib/auth.ts` et apparaissent dans les logs PM2 :

- `[AUTH] Credentials manquants` - Problème avec les identifiants
- `[AUTH] Utilisateur non trouvé` - Email introuvable
- `[AUTH] Utilisateur sans passwordHash` - Utilisateur créé via OAuth
- `[AUTH] Mot de passe incorrect` - Mot de passe invalide
- `[AUTH] Connexion réussie` - Connexion réussie

Pour voir ces logs :

```bash
pm2 logs canopee | grep "AUTH"
```

### 4. Logs de la base de données

Les erreurs de connexion Prisma apparaissent dans les logs PM2. Pour voir uniquement les erreurs de base de données :

```bash
pm2 logs canopee | grep -i "prisma\|database\|postgres\|supabase"
```

## 🔍 Commandes utiles pour le débogage

### Voir les logs récents

```bash
# Dernières 100 lignes de tous les logs
pm2 logs canopee --lines 100

# Dernières erreurs uniquement
pm2 logs canopee --err --lines 50
```

### Filtrer les logs

```bash
# Rechercher une erreur spécifique
pm2 logs canopee | grep "401"
pm2 logs canopee | grep "500"
pm2 logs canopee | grep "ERROR"

# Rechercher par email
pm2 logs canopee | grep "etibaliomecus@live.be"

# Rechercher les requêtes API
pm2 logs canopee | grep "/api/"
```

### Suivre les logs en temps réel

```bash
# Suivre tous les logs (équivalent à tail -f)
pm2 logs canopee --lines 0

# Suivre uniquement les erreurs
pm2 logs canopee --err --lines 0
```

## 📁 Emplacement des fichiers de logs

### Sur le VPS

- **Logs PM2** : `/var/www/canopee/logs/`
  - `err.log` - Erreurs
  - `out.log` - Sortie standard
- **Logs Nginx** : `/var/log/nginx/`
  - `error.log` - Erreurs Nginx
  - `access.log` - Toutes les requêtes HTTP

### Configuration PM2

La configuration des logs est dans `ecosystem.config.js` :

```javascript
error_file: './logs/err.log',
out_file: './logs/out.log',
log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
merge_logs: true,
```

## 🛠️ Scripts de diagnostic

Le projet contient plusieurs scripts qui affichent des informations utiles :

```bash
# Vérifier la base de données
node scripts/check-database.js

# Diagnostiquer un problème d'admin
node scripts/diagnose-admin.js etibaliomecus@live.be

# Diagnostiquer un problème de connexion
node scripts/diagnose-login.js etibaliomecus@live.be

# Vérifier le rôle d'un utilisateur
node scripts/check-user-role.js etibaliomecus@live.be
```

## 📊 Logs Supabase

Pour voir les logs de la base de données Supabase :

1. Aller sur le [Dashboard Supabase](https://kzogkberupkzpjdojvhn.supabase.co)
2. Naviguer vers **Logs** dans le menu
3. Filtrer par type de log (Database, API, Auth, etc.)

## 💡 Conseils

1. **En cas d'erreur 500** : Commencez par `pm2 logs canopee --err` pour voir les erreurs
2. **En cas d'erreur 404** : Vérifiez les logs Nginx avec `sudo tail -f /var/log/nginx/error.log`
3. **En cas de problème d'authentification** : Utilisez `pm2 logs canopee | grep "AUTH"`
4. **Pour suivre une action en temps réel** : Utilisez `pm2 logs canopee --lines 0` dans un terminal séparé

## 🔄 Redémarrer l'application après consultation des logs

Si vous avez identifié un problème et l'avez corrigé :

```bash
cd /var/www/canopee
pm2 restart canopee
pm2 logs canopee --lines 20  # Vérifier que tout démarre correctement
```

