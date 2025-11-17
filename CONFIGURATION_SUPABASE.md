# Configuration Supabase - Guide Rapide

## 📍 Votre Projet Supabase

**URL du Dashboard** : https://kzogkberupkzpjdojvhn.supabase.co

## 🔑 Récupérer l'URL de Connexion

### Étape 1 : Accéder aux paramètres de la base de données

1. Allez sur https://kzogkberupkzpjdojvhn.supabase.co
2. Connectez-vous à votre compte Supabase
3. Cliquez sur **Settings** (⚙️) dans le menu de gauche
4. Cliquez sur **Database** dans le sous-menu

### Étape 2 : Récupérer la Connection String

Dans la section **"Connection string"** :

1. Sélectionnez l'onglet **"URI"** (pas "JDBC" ni "Golang")
2. Vous verrez une URL qui ressemble à :

   ```
   postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

   OU

   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres
   ```

3. **Important** : Remplacez `[YOUR-PASSWORD]` par le mot de passe de votre base de données
   - C'est le mot de passe que vous avez défini lors de la création du projet Supabase
   - Si vous l'avez oublié, vous pouvez le réinitialiser dans Settings → Database → Database Password

### Étape 3 : Formater l'URL pour Prisma

Ajoutez `?schema=public` à la fin de l'URL. Le format final doit être :

```
postgresql://postgres:[YOUR-PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public
```

## 📝 Configuration du fichier .env

### Créer ou mettre à jour le fichier .env

À la racine de votre projet, créez ou modifiez le fichier `.env` :

```env
# Base de données Supabase
DATABASE_URL="postgresql://postgres:[VOTRE-MOT-DE-PASSE]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public"

# NextAuth
# En développement
NEXTAUTH_URL="http://localhost:3000"
# En production (sur VPS-1 OVH)
# NEXTAUTH_URL="https://canopee.be"
NEXTAUTH_SECRET="votre-secret-nextauth"

# OAuth Google (optionnel)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OAuth Facebook (optionnel)
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
```

**⚠️ Important** :

- Remplacez `[VOTRE-MOT-DE-PASSE]` par votre vrai mot de passe Supabase
- Générer `NEXTAUTH_SECRET` avec : `openssl rand -base64 32`

## ✅ Vérifier la connexion

### 1. Générer le client Prisma

```bash
npx prisma generate
```

### 2. Appliquer les migrations

```bash
npx prisma migrate deploy
```

### 3. Tester avec Prisma Studio

```bash
npx prisma studio
```

Si Prisma Studio s'ouvre sans erreur, la connexion fonctionne ! 🎉

## 🔍 Si vous avez oublié le mot de passe

1. Allez dans Settings → Database
2. Cliquez sur **"Reset database password"**
3. Choisissez un nouveau mot de passe fort
4. Mettez à jour votre fichier `.env` avec le nouveau mot de passe

## 🚨 Problèmes courants

### Erreur : "password authentication failed"

→ Vérifiez que le mot de passe dans `.env` correspond au mot de passe Supabase

### Erreur : "connection refused"

→ Vérifiez que l'URL est correcte et que votre IP n'est pas bloquée (Settings → Database → Connection Pooling)

### Erreur : "relation does not exist"

→ Exécutez les migrations : `npx prisma migrate deploy`

## 📚 Prochaines étapes

Une fois la connexion configurée :

1. ✅ Vérifier la connexion avec `npx prisma studio`
2. ✅ Si vous migrez depuis une base existante, voir [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md)
3. ✅ Créer un utilisateur admin (voir [CREATE_ADMIN.md](./CREATE_ADMIN.md))
4. ✅ Lancer l'application : `npm run dev`

---

**Besoin d'aide ?** Consultez [DATABASE_SETUP.md](./DATABASE_SETUP.md) pour plus de détails.
