# Configuration de la Base de Données PostgreSQL

## Option 1 : Installation Locale (macOS avec Homebrew)

### Étape 1 : Installer PostgreSQL

```bash
# Installer PostgreSQL
brew install postgresql@14

# Démarrer le service
brew services start postgresql@14
```

### Étape 2 : Créer la base de données

```bash
# Créer la base de données
createdb yoga_studio

# Vérifier que la base existe
psql -l
```

### Étape 3 : Configurer la variable d'environnement

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://votre_username@localhost:5432/yoga_studio?schema=public"
```

Remplacez `votre_username` par votre nom d'utilisateur système (obtenu avec `whoami`).

### Étape 4 : Initialiser Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer et appliquer les migrations
npx prisma migrate dev --name init

# (Optionnel) Ouvrir Prisma Studio pour visualiser
npx prisma studio
```

---

## Option 2 : Service Cloud (Recommandé pour débuter)

### Supabase (Gratuit, Simple)

1. **Créer un compte** : https://supabase.com
2. **Créer un nouveau projet**
3. **Récupérer la connection string** :
   - Aller dans Settings → Database
   - Copier la "Connection string" (URI)
   - Format : `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

4. **Ajouter dans `.env`** :
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?schema=public"
```

### Railway (Gratuit, Simple)

1. **Créer un compte** : https://railway.app
2. **Nouveau projet** → Add PostgreSQL
3. **Récupérer la connection string** dans les variables d'environnement
4. **Ajouter dans `.env`**

### Neon (Gratuit, Performant)

1. **Créer un compte** : https://neon.tech
2. **Créer un projet**
3. **Récupérer la connection string**
4. **Ajouter dans `.env`**

---

## Option 3 : Docker (Alternative)

Si vous avez Docker installé :

```bash
# Lancer PostgreSQL dans un conteneur
docker run --name yoga-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=yoga_studio \
  -p 5432:5432 \
  -d postgres:14

# Connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/yoga_studio?schema=public"
```

---

## Vérification

Pour vérifier que la connexion fonctionne :

```bash
# Tester la connexion avec Prisma
npx prisma db pull

# Ou avec psql (si installé localement)
psql $DATABASE_URL
```

---

## Script Automatique

Un script est disponible pour automatiser l'installation locale :

```bash
./setup-database.sh
```

---

## Problèmes Courants

### Erreur : "relation does not exist"
→ Exécutez les migrations : `npx prisma migrate dev`

### Erreur : "connection refused"
→ Vérifiez que PostgreSQL est démarré : `brew services list`

### Erreur : "password authentication failed"
→ Vérifiez les identifiants dans `DATABASE_URL`

### Réinitialiser la base de données
```bash
npx prisma migrate reset
```

