# Fix : Erreur 500 sur /api/classes

## 🔍 Problème

L'API `/api/classes` retourne une erreur 500 (Internal Server Error) lors de la récupération des cours.

## 🔧 Causes Possibles

1. **Table `classes` n'existe pas dans la base de données**

   - Les migrations Prisma n'ont pas été appliquées en production
   - Code d'erreur : `P2021` (table does not exist)

2. **Problème de connexion à la base de données**

   - Connexion Supabase expirée ou fermée
   - IP du VPS bloquée dans Supabase
   - Code d'erreur : `P1001` (Cannot reach database server)

3. **Problème avec les dates**

   - Format de date invalide dans les paramètres de requête
   - Conversion de date échoue

4. **Problème avec la relation `bookings`**
   - La table `bookings` n'existe pas
   - Relation mal configurée

## ✅ Solutions

### Solution 1 : Vérifier les migrations Prisma

1. **Se connecter au VPS** :

   ```bash
   ssh votre-utilisateur@votre-vps-ovh
   ```

2. **Aller dans le projet** :

   ```bash
   cd /var/www/canopee
   ```

3. **Vérifier le statut des migrations** :

   ```bash
   npx prisma migrate status
   ```

4. **Appliquer les migrations si nécessaire** :

   ```bash
   npx prisma migrate deploy
   ```

5. **Générer le client Prisma** :

   ```bash
   npx prisma generate
   ```

6. **Redémarrer l'application** :
   ```bash
   pm2 restart canopee
   ```

### Solution 2 : Vérifier la base de données avec le script

1. **Sur le VPS** :

   ```bash
   cd /var/www/canopee
   node scripts/check-database.js
   ```

2. **Lire le résultat** :
   - Si une table n'existe pas → Appliquer les migrations (Solution 1)
   - Si problème de connexion → Vérifier DATABASE_URL et Supabase

### Solution 3 : Vérifier les logs

1. **Voir les logs de l'application** :

   ```bash
   pm2 logs canopee --lines 100
   ```

2. **Chercher les erreurs** :
   - Erreurs Prisma (codes P1001, P2021, etc.)
   - Messages d'erreur détaillés

### Solution 4 : Vérifier Supabase

1. **Accéder au dashboard Supabase** :

   - https://kzogkberupkzpjdojvhn.supabase.co

2. **Vérifier les tables** :

   - Table Editor → Vérifier que les tables existent :
     - `users`
     - `classes`
     - `bookings`
     - `news`
     - `comments`

3. **Vérifier les paramètres de sécurité** :
   - Settings → Database → Connection Pooling
   - Vérifier que l'IP du VPS n'est pas bloquée

### Solution 5 : Vérifier DATABASE_URL

1. **Sur le VPS, vérifier .env** :

   ```bash
   cd /var/www/canopee
   cat .env | grep DATABASE_URL
   ```

2. **Vérifier le format** :

   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public"
   ```

3. **Ajouter des paramètres de connexion si nécessaire** :

   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public&connection_limit=10&pool_timeout=20&connect_timeout=10"
   ```

4. **Redémarrer l'application** :
   ```bash
   pm2 restart canopee
   ```

## 🧪 Test de l'API

Après avoir appliqué les solutions :

1. **Tester l'API directement** :

   ```bash
   curl https://canopee.be/api/classes
   ```

2. **Ou depuis le navigateur** :
   - Ouvrir : https://canopee.be/api/classes
   - Devrait retourner un JSON avec les cours (ou un tableau vide)

## 📝 Checklist de Vérification

- [ ] Les migrations Prisma sont appliquées (`npx prisma migrate deploy`)
- [ ] Le client Prisma est généré (`npx prisma generate`)
- [ ] Les tables existent dans Supabase (Table Editor)
- [ ] `DATABASE_URL` est correct dans `.env`
- [ ] L'IP du VPS n'est pas bloquée dans Supabase
- [ ] L'application a été redémarrée après les modifications
- [ ] Les logs ne montrent pas d'erreurs Prisma

## 🚨 Erreurs Courantes

### Erreur P2021 : Table does not exist

**Cause** : Les migrations n'ont pas été appliquées

**Solution** :

```bash
cd /var/www/canopee
npx prisma migrate deploy
npx prisma generate
pm2 restart canopee
```

### Erreur P1001 : Cannot reach database server

**Cause** : Problème de connexion à Supabase

**Solution** :

1. Vérifier `DATABASE_URL` dans `.env`
2. Vérifier les paramètres de sécurité Supabase
3. Tester la connexion : `psql "$DATABASE_URL" -c "SELECT version();"`

### Erreur 500 sans code Prisma

**Cause** : Erreur dans le code de l'API

**Solution** :

1. Vérifier les logs : `pm2 logs canopee`
2. Vérifier que toutes les dépendances sont installées
3. Vérifier que le code est à jour

## 📞 Support

Si le problème persiste :

1. Exécuter le script de diagnostic :

   ```bash
   node scripts/check-database.js
   ```

2. Vérifier les logs :

   ```bash
   pm2 logs canopee --err --lines 50
   ```

3. Vérifier les logs Supabase (Dashboard → Logs)



