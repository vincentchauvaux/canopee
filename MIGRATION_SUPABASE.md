# Guide de Migration : PostgreSQL → Supabase

Ce guide vous explique comment migrer votre base de données PostgreSQL locale vers Supabase.

## 📋 Prérequis

- Compte Supabase créé ✅
- Accès à votre base de données PostgreSQL actuelle
- `pg_dump` installé (généralement inclus avec PostgreSQL)
- `psql` installé (pour tester la connexion)

## 🔍 Étape 1 : Préparer l'export de votre base de données actuelle

### 1.1 Identifier votre base de données actuelle

Vérifiez votre fichier `.env` pour connaître l'URL de connexion :

```bash
# Afficher la DATABASE_URL actuelle
grep DATABASE_URL .env
```

Format typique : `postgresql://user:password@host:port/database?schema=public`

### 1.2 Exporter le schéma (structure)

```bash
# Exporter uniquement le schéma (sans les données)
pg_dump --schema-only --no-owner --no-acl \
  -d votre_base_de_donnees \
  -f schema_export.sql

# OU si vous utilisez DATABASE_URL directement
pg_dump --schema-only --no-owner --no-acl \
  $DATABASE_URL \
  -f schema_export.sql
```

**Note :** Les options `--no-owner` et `--no-acl` sont importantes car Supabase gère les permissions différemment.

### 1.3 Exporter les données

```bash
# Exporter uniquement les données (INSERT statements)
pg_dump --data-only --no-owner --no-acl \
  -d votre_base_de_donnees \
  -f data_export.sql

# OU avec DATABASE_URL
pg_dump --data-only --no-owner --no-acl \
  $DATABASE_URL \
  -f data_export.sql
```

### 1.4 Exporter tout (schéma + données) - Alternative

Si vous préférez tout exporter en une seule fois :

```bash
pg_dump --no-owner --no-acl \
  $DATABASE_URL \
  -f full_export.sql
```

## 🚀 Étape 2 : Configurer Supabase

### 2.1 Créer un nouveau projet Supabase

1. Connectez-vous à [Supabase](https://supabase.com)
2. Cliquez sur **"New Project"**
3. Remplissez les informations :
   - **Name** : `canopee-yoga` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (⚠️ **SAVEZ-LE**)
   - **Region** : Choisissez la région la plus proche (ex: `West Europe` pour la Belgique)
4. Cliquez sur **"Create new project"**
5. Attendez 2-3 minutes que le projet soit créé

### 2.2 Récupérer les informations de connexion

1. Dans votre projet Supabase, allez dans **Settings** → **Database**
2. Trouvez la section **"Connection string"**
3. Copiez la **URI** (elle ressemble à) :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. Remplacez `[YOUR-PASSWORD]` par le mot de passe que vous avez créé

### 2.3 Tester la connexion (optionnel)

```bash
# Tester la connexion avec psql
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

Si la connexion fonctionne, vous verrez un prompt `postgres=#`. Tapez `\q` pour quitter.

## 📥 Étape 3 : Importer le schéma dans Supabase

### 3.1 Méthode recommandée : Utiliser Prisma Migrate

C'est la méthode la plus propre car elle utilise vos migrations Prisma existantes :

```bash
# 1. Sauvegarder votre DATABASE_URL actuelle
cp .env .env.backup

# 2. Mettre à jour temporairement la DATABASE_URL vers Supabase
# Éditez .env et remplacez DATABASE_URL par celle de Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?schema=public"

# 3. Générer le client Prisma
npx prisma generate

# 4. Appliquer les migrations (crée le schéma dans Supabase)
npx prisma migrate deploy

# OU si vous êtes en développement et voulez créer une nouvelle migration
npx prisma migrate dev --name migrate_to_supabase
```

### 3.2 Méthode alternative : Importer directement le SQL

Si vous préférez importer directement le fichier SQL :

```bash
# Importer le schéma dans Supabase
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" \
  -f schema_export.sql
```

**⚠️ Attention :** Si vous avez exporté avec `full_export.sql`, vous pouvez l'importer directement :

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" \
  -f full_export.sql
```

## 📊 Étape 4 : Importer les données

### 4.1 Si vous avez exporté les données séparément

```bash
# Importer les données
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" \
  -f data_export.sql
```

### 4.2 Vérifier l'import

Connectez-vous à Supabase et allez dans **Table Editor** pour vérifier que vos données sont présentes.

Ou via la ligne de commande :

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" \
  -c "SELECT COUNT(*) FROM users;"
```

## ✅ Étape 5 : Mettre à jour la configuration de l'application

### 5.1 Mettre à jour le fichier `.env`

```bash
# Éditez votre fichier .env
# Remplacez l'ancienne DATABASE_URL par celle de Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?schema=public"
```

**⚠️ Important :** 
- Remplacez `[YOUR-PASSWORD]` par votre vrai mot de passe
- Gardez `?schema=public` à la fin de l'URL

### 5.2 Régénérer le client Prisma

```bash
npx prisma generate
```

### 5.3 Tester la connexion

```bash
# Tester avec Prisma Studio
npx prisma studio
```

Prisma Studio devrait s'ouvrir et afficher vos tables avec les données.

## 🔧 Étape 6 : Vérifications finales

### 6.1 Vérifier les tables

```bash
# Lister toutes les tables
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" \
  -c "\dt"
```

Vous devriez voir :
- `users`
- `classes`
- `news`
- `comments`
- `bookings`

### 6.2 Vérifier les données

```bash
# Compter les enregistrements dans chaque table
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres" \
  -c "SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM classes) as classes,
    (SELECT COUNT(*) FROM news) as news,
    (SELECT COUNT(*) FROM comments) as comments,
    (SELECT COUNT(*) FROM bookings) as bookings;"
```

### 6.3 Tester l'application

```bash
# Démarrer l'application en mode développement
npm run dev
```

Testez les fonctionnalités principales :
- Connexion/inscription
- Affichage des cours
- Réservations
- Actualités et commentaires

## 🛡️ Étape 7 : Sécurité Supabase

### 7.1 Configurer les Row Level Security (RLS)

Supabase utilise Row Level Security par défaut. Vous devrez peut-être configurer les politiques selon vos besoins.

Pour l'instant, vous pouvez désactiver RLS pour tester (⚠️ **À configurer correctement en production**) :

```sql
-- Dans Supabase SQL Editor
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE news DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

**⚠️ Important :** En production, configurez correctement les politiques RLS pour sécuriser vos données.

### 7.2 Variables d'environnement Supabase (optionnel)

Si vous utilisez les fonctionnalités Supabase (Auth, Storage, etc.), vous pouvez ajouter :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

Ces clés se trouvent dans **Settings** → **API** de votre projet Supabase.

## 📝 Script de migration automatisé

Voici un script bash pour automatiser la migration :

```bash
#!/bin/bash
# migration-to-supabase.sh

set -e

echo "🚀 Migration vers Supabase"
echo ""

# Vérifier que DATABASE_URL est définie
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Erreur: DATABASE_URL n'est pas définie"
    echo "   Définissez-la avec: export DATABASE_URL='postgresql://...'"
    exit 1
fi

# Demander l'URL Supabase
read -p "📝 Entrez l'URL de connexion Supabase: " SUPABASE_URL

# Sauvegarder l'ancienne URL
echo "💾 Sauvegarde de l'ancienne configuration..."
cp .env .env.backup

# Exporter le schéma et les données
echo "📤 Export de la base de données..."
pg_dump --no-owner --no-acl $DATABASE_URL -f migration_export.sql

# Importer dans Supabase
echo "📥 Import dans Supabase..."
psql "$SUPABASE_URL" -f migration_export.sql

# Mettre à jour .env
echo "🔧 Mise à jour de .env..."
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$SUPABASE_URL\"|" .env

# Régénérer Prisma
echo "🔄 Régénération du client Prisma..."
npx prisma generate

echo ""
echo "✅ Migration terminée !"
echo "🧪 Testez avec: npx prisma studio"
```

Pour utiliser le script :

```bash
chmod +x migration-to-supabase.sh
export DATABASE_URL="postgresql://user:pass@localhost:5432/yoga_studio"
./migration-to-supabase.sh
```

## 🐛 Résolution de problèmes

### Erreur : "permission denied for schema public"

Supabase utilise des permissions spécifiques. Utilisez les options `--no-owner --no-acl` lors de l'export.

### Erreur : "relation already exists"

Cela signifie que le schéma existe déjà. Vous pouvez :
1. Supprimer les tables existantes dans Supabase
2. Ou utiliser `DROP TABLE IF EXISTS` avant l'import

### Erreur : "connection refused"

Vérifiez :
- Que l'URL Supabase est correcte
- Que le mot de passe est correct
- Que votre IP n'est pas bloquée (vérifiez dans Supabase Settings → Database → Connection Pooling)

### Les données ne s'affichent pas

1. Vérifiez que RLS est désactivé ou configuré correctement
2. Vérifiez les contraintes de clés étrangères
3. Vérifiez l'ordre d'import (les tables référencées doivent exister avant)

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Prisma avec Supabase](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-supabase)
- [Migration PostgreSQL](https://supabase.com/docs/guides/database/migrations)

## ✅ Checklist de migration

- [ ] Base de données PostgreSQL exportée
- [ ] Projet Supabase créé
- [ ] URL de connexion Supabase récupérée
- [ ] Schéma importé dans Supabase
- [ ] Données importées dans Supabase
- [ ] Fichier `.env` mis à jour
- [ ] Client Prisma régénéré
- [ ] Application testée
- [ ] RLS configuré (ou désactivé temporairement)
- [ ] Ancienne base de données sauvegardée

---

**🎉 Félicitations !** Votre base de données est maintenant migrée vers Supabase.

