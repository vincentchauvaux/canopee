# Commandes à exécuter sur le VPS

## 🔐 Connexion au VPS

```bash
ssh ubuntu@51.178.44.114
# Mot de passe: H2usmpssneaky
```

## 🚀 Correction automatique (Recommandé)

Une fois connecté, exécutez ces commandes :

```bash
cd /var/www/canopee

# Appliquer les migrations Prisma
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Vérifier la base de données
node scripts/check-database.js

# Redémarrer l'application
pm2 restart canopee

# Vérifier les logs
pm2 logs canopee --lines 50
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


