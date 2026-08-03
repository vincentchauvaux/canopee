# Commandes à exécuter sur le VPS

## 🔐 Connexion au VPS

```bash
ssh ubuntu@51.178.44.114
# Mot de passe: H2usmpssneaky
```

## 🚀 Correction automatique (Recommandé)

Une fois connecté en **ubuntu** (pas root), exécutez ces commandes :

```bash
cd /var/www/canopee

# Appliquer les migrations Prisma
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Vérifier la base de données
node scripts/check-database.js

# Redémarrer Canopée (PM2 ubuntu uniquement — jamais sudo pm2 pour canopee)
pm2 restart canopee

# Vérifier les logs
pm2 logs canopee --lines 50
```

## ⚙️ PM2 — séparation Canopée / streamtv

| App | Utilisateur PM2 | Port |
|-----|-----------------|------|
| Canopée | `ubuntu` | 3000 |
| streamtv | `root` | 3001 |

```bash
# Canopée (ubuntu)
pm2 list
pm2 restart canopee

# streamtv (root)
sudo pm2 list
sudo pm2 restart streamtv
```

**Important :** ne jamais lancer `canopee` via `sudo pm2` — cela recrée le conflit sur le port 3000.

Diagnostic rapide :

```bash
pm2 list && sudo pm2 list
sudo ss -tlnp | grep -E ':3000|:3001'
```

Script de correction automatique (depuis le repo local) :

```bash
ssh ubuntu@51.178.44.114 'bash -s' < scripts/fix-pm2-vps.sh
```

## 📋 Correction étape par étape

### 1. Vérifier le statut des migrations

```bash
cd /var/www/canopee
npx prisma migrate status
```

### 2. Appliquer les migrations

```bash
npx prisma migrate deploy
```

### 3. Générer le client Prisma

```bash
npx prisma generate
```

### 4. Vérifier la base de données

```bash
node scripts/check-database.js
```

### 5. Redémarrer l'application

```bash
pm2 restart canopee
```

### 6. Vérifier les logs

```bash
pm2 logs canopee --lines 100
```

## 🧪 Tester l'API

```bash
# Tester l'API directement
curl https://canopee.be/api/classes

# Ou depuis le VPS
curl http://localhost:3000/api/classes
```

## 🔍 Vérifications supplémentaires

### Vérifier les variables d'environnement

```bash
cd /var/www/canopee
cat .env | grep DATABASE_URL
cat .env | grep NEXTAUTH
```

### Vérifier que l'application tourne

```bash
pm2 status
pm2 info canopee
```

### Vérifier les erreurs

```bash
pm2 logs canopee --err --lines 50
```

## 📞 En cas de problème

1. **Migrations échouent** :

   - Vérifiez `DATABASE_URL` dans `.env`
   - Vérifiez la connexion : `psql "$DATABASE_URL" -c "SELECT version();"`

2. **Application ne démarre pas** :

   - Vérifiez les logs : `pm2 logs canopee`
   - Vérifiez les dépendances : `npm install`

3. **Erreur 500 persiste** :
   - Vérifiez les logs : `pm2 logs canopee --err`
   - Vérifiez la base de données : `node scripts/check-database.js`



