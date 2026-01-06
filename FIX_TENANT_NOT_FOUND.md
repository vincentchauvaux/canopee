# 🔧 Correction : Erreur "Tenant or user not found"

## ❌ Problème

L'erreur suivante apparaît dans les logs :

```
Error querying the database: FATAL: Tenant or user not found
```

Cette erreur indique que **Supabase ne peut pas authentifier la connexion** avec les credentials fournis dans `DATABASE_URL`.

## 🔍 Causes possibles

1. **Mot de passe incorrect** dans la `DATABASE_URL`
2. **Format incorrect** de la `DATABASE_URL`
3. **Mot de passe Supabase changé** (réinitialisé dans le dashboard)
4. **Projet Supabase suspendu** ou supprimé
5. **Caractères spéciaux** dans le mot de passe non encodés (URL encoding)

## ✅ Solutions

### Solution 1 : Vérifier et corriger la DATABASE_URL

#### Étape 1 : Récupérer la nouvelle connection string depuis Supabase

1. Allez sur le [Dashboard Supabase](https://kzogkberupkzpjdojvhn.supabase.co)
2. Connectez-vous à votre compte
3. Allez dans **Settings** → **Database**
4. Dans la section **"Connection string"**, sélectionnez l'onglet **"URI"**
5. Copiez l'URL complète

#### Étape 2 : Vérifier le format

La `DATABASE_URL` doit avoir ce format :

```
postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public
```

**Important** :
- Remplacez `[PASSWORD]` par le **vrai mot de passe** de votre base Supabase
- Si le mot de passe contient des caractères spéciaux (`@`, `#`, `%`, etc.), ils doivent être **encodés en URL** :
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`
  - `?` → `%3F`
  - etc.

#### Étape 3 : Mettre à jour le fichier .env sur le VPS

```bash
# Se connecter au VPS
ssh ubuntu@51.178.44.114

# Aller dans le répertoire
cd /var/www/canopee

# Éditer le fichier .env
nano .env
```

Modifiez la ligne `DATABASE_URL` avec la nouvelle valeur.

**Exemple** :
```env
DATABASE_URL="postgresql://postgres:VotreNouveauMotDePasse@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public"
```

Sauvegardez avec `Ctrl+O`, puis `Ctrl+X`.

#### Étape 4 : Redémarrer l'application

```bash
# Redémarrer PM2 pour charger la nouvelle configuration
pm2 restart canopee

# Vérifier les logs
pm2 logs canopee --lines 20
```

### Solution 2 : Réinitialiser le mot de passe Supabase

Si vous avez oublié le mot de passe ou s'il a été changé :

1. Allez sur le [Dashboard Supabase](https://kzogkberupkzpjdojvhn.supabase.co)
2. Allez dans **Settings** → **Database**
3. Cliquez sur **"Reset database password"** ou **"Change database password"**
4. Définissez un nouveau mot de passe (notez-le bien !)
5. Mettez à jour la `DATABASE_URL` dans `.env` avec le nouveau mot de passe
6. Redémarrez l'application : `pm2 restart canopee`

### Solution 3 : Encoder les caractères spéciaux dans le mot de passe

Si votre mot de passe contient des caractères spéciaux, utilisez un outil d'encodage URL :

**En ligne de commande** :
```bash
# Sur le VPS
python3 -c "import urllib.parse; print(urllib.parse.quote('VotreMotDePasse@123#'))"
```

**Exemple** :
- Mot de passe original : `Mon@Pass#123`
- Mot de passe encodé : `Mon%40Pass%23123`
- DATABASE_URL : `postgresql://postgres:Mon%40Pass%23123@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public`

### Solution 4 : Vérifier que le projet Supabase est actif

1. Allez sur le [Dashboard Supabase](https://kzogkberupkzpjdojvhn.supabase.co)
2. Vérifiez que le projet est **actif** (pas suspendu)
3. Si le projet est suspendu, réactivez-le ou créez un nouveau projet

## 🧪 Tester la connexion

### Test 1 : Vérifier la DATABASE_URL

```bash
# Sur le VPS
cd /var/www/canopee

# Vérifier que DATABASE_URL est bien défini
cat .env | grep DATABASE_URL
```

### Test 2 : Tester la connexion avec psql

```bash
# Tester la connexion directement
psql "$DATABASE_URL" -c "SELECT version();"
```

Si cette commande échoue avec "Tenant or user not found", le problème vient de la `DATABASE_URL`.

### Test 3 : Utiliser le script de diagnostic

```bash
# Sur le VPS
cd /var/www/canopee
node scripts/check-database.js
```

Ce script va :
- Vérifier que `DATABASE_URL` est configuré
- Tester la connexion
- Vérifier les tables

## 📋 Checklist de vérification

- [ ] `DATABASE_URL` est présent dans `.env`
- [ ] Le format de `DATABASE_URL` est correct
- [ ] Le mot de passe dans `DATABASE_URL` correspond au mot de passe Supabase
- [ ] Les caractères spéciaux dans le mot de passe sont encodés en URL
- [ ] Le projet Supabase est actif (pas suspendu)
- [ ] La commande `psql "$DATABASE_URL" -c "SELECT version();"` fonctionne
- [ ] L'application a été redémarrée après modification de `.env`

## 🔄 Commandes complètes de correction

```bash
# 1. Se connecter au VPS
ssh ubuntu@51.178.44.114

# 2. Aller dans le répertoire
cd /var/www/canopee

# 3. Vérifier la DATABASE_URL actuelle
cat .env | grep DATABASE_URL

# 4. Éditer le fichier .env
nano .env
# → Modifier DATABASE_URL avec le bon mot de passe
# → Sauvegarder (Ctrl+O, puis Ctrl+X)

# 5. Tester la connexion
psql "$DATABASE_URL" -c "SELECT version();"

# 6. Si le test fonctionne, redémarrer l'application
pm2 restart canopee

# 7. Vérifier les logs
pm2 logs canopee --lines 20

# 8. Vérifier que l'erreur a disparu
pm2 logs canopee | grep -i "tenant\|error" | tail -10
```

## 💡 Prévention

Pour éviter ce problème à l'avenir :

1. **Notez le mot de passe Supabase** dans un gestionnaire de mots de passe sécurisé
2. **Ne changez pas le mot de passe** sans mettre à jour `.env` immédiatement
3. **Testez la connexion** après chaque modification de `DATABASE_URL`
4. **Utilisez des mots de passe simples** (sans caractères spéciaux) pour éviter les problèmes d'encodage

## 📞 Support

Si le problème persiste après avoir essayé toutes les solutions :

1. Vérifiez les logs Supabase dans le Dashboard → Logs
2. Vérifiez que votre IP VPS n'est pas bloquée dans Supabase (Settings → Database → Connection Pooling)
3. Contactez le support Supabase si nécessaire

## 🔗 Liens utiles

- [Dashboard Supabase](https://kzogkberupkzpjdojvhn.supabase.co)
- [Guide de configuration Supabase](./CONFIGURATION_SUPABASE.md)
- [Guide de vérification de la base de données](./FIX_DATABASE_CONNECTION.md)

