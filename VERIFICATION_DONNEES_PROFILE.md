# 🔍 Vérification : Les données de profil existent-elles dans Supabase ?

## ❓ Question

Le problème de la page profile est-il lié au fait que Supabase ne dispose pas des informations à afficher sur cette page ?

## ✅ Réponse

**Probablement NON.** D'après l'analyse du code, le problème vient plutôt de l'authentification (session, cookies) que de l'absence de données.

Cependant, il est important de vérifier que les données existent bien dans Supabase.

## 🔍 Vérification des données dans Supabase

### Méthode 1 : Via l'interface Supabase (Recommandé)

1. **Accéder au dashboard Supabase** :
   - Allez sur https://kzogkberupkzpjdojvhn.supabase.co
   - Connectez-vous à votre compte

2. **Ouvrir le Table Editor** :
   - Cliquez sur **"Table Editor"** dans le menu de gauche
   - Sélectionnez la table **"users"**

3. **Vérifier les données** :
   - Vous devriez voir tous les utilisateurs
   - Vérifiez que les colonnes suivantes existent :
     - `id` ✅
     - `email` ✅
     - `firstName` (peut être NULL)
     - `lastName` (peut être NULL)
     - `profilePic` (peut être NULL)
     - `phone` (peut être NULL)
     - `dateOfBirth` (peut être NULL)
     - `role` ✅
     - `createdAt` ✅
     - `lastLogin` (peut être NULL)

4. **Vérifier qu'il y a au moins un utilisateur** :
   - Si la table est vide → **C'est le problème !**
   - Si la table contient des utilisateurs → Le problème vient d'ailleurs

### Méthode 2 : Via SQL Editor dans Supabase

1. **Ouvrir le SQL Editor** :
   - Dans Supabase, cliquez sur **"SQL Editor"** dans le menu de gauche
   - Cliquez sur **"New query"**

2. **Exécuter cette requête** :

```sql
-- Compter les utilisateurs
SELECT COUNT(*) as total_users FROM users;

-- Voir tous les utilisateurs avec leurs données
SELECT 
  id,
  email,
  "firstName",
  "lastName",
  "profilePic",
  phone,
  "dateOfBirth",
  role,
  "createdAt",
  "lastLogin",
  "authProvider"
FROM users
ORDER BY "createdAt" DESC;
```

3. **Interpréter les résultats** :
   - Si `total_users = 0` → **Aucun utilisateur dans la base, c'est le problème !**
   - Si `total_users > 0` mais que tous les champs sont NULL → Les utilisateurs existent mais n'ont pas complété leur profil
   - Si les données sont présentes → Le problème vient de l'authentification, pas des données

### Méthode 3 : Via Prisma Studio (Local)

```bash
# Dans votre environnement local
cd /Users/hakou/yoga
npx prisma studio
```

1. Prisma Studio s'ouvre dans le navigateur (http://localhost:5555)
2. Cliquez sur la table **"User"**
3. Vérifiez les données

**⚠️ Note** : Prisma Studio se connecte à la base de données configurée dans `DATABASE_URL` de votre `.env` local. Assurez-vous que `DATABASE_URL` pointe vers Supabase.

### Méthode 4 : Via la ligne de commande (psql)

```bash
# Tester la connexion et voir les utilisateurs
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;"
psql "$DATABASE_URL" -c "SELECT email, \"firstName\", \"lastName\", role FROM users LIMIT 5;"
```

## 📊 Analyse du code

### Ce que la page profile attend

D'après `app/profile/page.tsx`, la page attend ces données :

```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName?: string | null;      // Optionnel
  lastName?: string | null;         // Optionnel
  profilePic?: string | null;       // Optionnel
  phone?: string | null;            // Optionnel
  dateOfBirth?: string | null;      // Optionnel
  role: string;                     // Requis
  createdAt: string;                // Requis
  lastLogin?: string | null;        // Optionnel
}
```

### Ce que l'API profile récupère

D'après `app/api/profile/route.ts`, l'API récupère :

```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    profilePic: true,
    phone: true,
    dateOfBirth: true,
    role: true,
    createdAt: true,
    lastLogin: true,
    authProvider: true,
  },
})
```

### Conclusion

**Les champs `firstName`, `lastName`, `phone`, `dateOfBirth`, `profilePic` sont optionnels.** La page profile peut s'afficher même si ces champs sont NULL. Elle affichera simplement "Non renseigné" pour ces champs.

**Les seuls champs vraiment requis sont :**
- `id` ✅ (généré automatiquement)
- `email` ✅ (requis lors de la création)
- `role` ✅ (défaut: 'user')
- `createdAt` ✅ (généré automatiquement)

## 🎯 Diagnostic : Est-ce que c'est le problème ?

### Si la table `users` est VIDE :

**✅ OUI, c'est le problème !**

**Solutions :**
1. Créer un utilisateur via l'inscription sur le site
2. Utiliser le script `create-admin.js` pour créer un admin
3. Vérifier que les migrations Prisma ont été appliquées : `npx prisma migrate deploy`

### Si la table `users` contient des utilisateurs :

**❌ NON, ce n'est PAS le problème des données.**

Le problème vient probablement de :
1. **L'authentification** (session, cookies, NEXTAUTH_URL) - Voir [DIAGNOSTIC_PROFILE_PRODUCTION.md](./DIAGNOSTIC_PROFILE_PRODUCTION.md)
2. **La connexion à Supabase** (DATABASE_URL incorrect) - Voir [FIX_TENANT_NOT_FOUND.md](./FIX_TENANT_NOT_FOUND.md)
3. **Les permissions RLS** (Row Level Security) dans Supabase

## 🔧 Vérification des permissions RLS dans Supabase

Si les utilisateurs existent mais que l'API ne peut pas les récupérer, vérifiez les Row Level Security (RLS) :

1. **Dans Supabase** :
   - Allez dans **"Authentication"** → **"Policies"**
   - Ou dans **"SQL Editor"**, exécutez :

```sql
-- Vérifier si RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';

-- Si RLS est activé et cause des problèmes, vous pouvez temporairement le désactiver (⚠️ pour test uniquement)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**⚠️ Important** : Désactiver RLS n'est pas recommandé en production. Configurez plutôt des politiques appropriées.

## 📋 Checklist de vérification

- [ ] La table `users` existe dans Supabase
- [ ] La table `users` contient au moins un utilisateur
- [ ] Les colonnes requises existent (`id`, `email`, `role`, `createdAt`)
- [ ] Les migrations Prisma ont été appliquées (`npx prisma migrate deploy`)
- [ ] La connexion à Supabase fonctionne (`node scripts/check-database.js`)
- [ ] RLS n'est pas activé ou est correctement configuré
- [ ] `DATABASE_URL` dans `.env` pointe vers Supabase

## 💡 Actions recommandées

1. **Vérifier d'abord que les utilisateurs existent** (via Supabase Table Editor)
2. **Si les utilisateurs n'existent pas** → Créer un utilisateur
3. **Si les utilisateurs existent** → Le problème vient de l'authentification, voir [DIAGNOSTIC_PROFILE_PRODUCTION.md](./DIAGNOSTIC_PROFILE_PRODUCTION.md)

## 🔗 Documents connexes

- [DIAGNOSTIC_PROFILE_PRODUCTION.md](./DIAGNOSTIC_PROFILE_PRODUCTION.md) - Diagnostic complet de la page profile
- [FIX_TENANT_NOT_FOUND.md](./FIX_TENANT_NOT_FOUND.md) - Problèmes de connexion Supabase
- [CONFIGURATION_SUPABASE.md](./CONFIGURATION_SUPABASE.md) - Configuration Supabase
- [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md) - Migration vers Supabase
