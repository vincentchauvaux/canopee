# Fix: Erreur 401 lors de la connexion

## Problème

Erreur `POST https://canopee.be/api/auth/callback/credentials 401 (Unauthorized)` lors de la tentative de connexion avec `etibaliomecus@live.be`.

**Cas spécifique :** Si vous pouvez vous connecter en local mais pas en production, l'utilisateur existe probablement uniquement dans votre base de données locale et pas dans la base de production (Supabase).

## Causes possibles

1. **L'utilisateur n'existe pas dans la base de données de production** (cas le plus fréquent si ça fonctionne en local)
2. **L'utilisateur existe en production mais n'a pas de passwordHash** (créé via OAuth au lieu de credentials)
3. **Le mot de passe est différent entre local et production**
4. **Problème de connexion à la base de données**
5. **NEXTAUTH_SECRET manquant ou incorrect**

## Solutions

### 0. Synchroniser l'utilisateur depuis local vers production (Recommandé si ça fonctionne en local)

Si vous pouvez vous connecter en local mais pas en production, synchronisez l'utilisateur :

**Sur votre machine locale :**

1. **Configurer DATABASE_URL_LOCAL** (optionnel, utilise DATABASE_URL par défaut) :
   ```bash
   # Dans votre .env local
   DATABASE_URL_LOCAL="postgresql://..." # Votre base locale
   DATABASE_URL="postgresql://postgres:...@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public" # Supabase production
   ```

2. **Exécuter le script de synchronisation** :
   ```bash
   node scripts/sync-user-to-production.js etibaliomecus@live.be
   ```

Le script va :
- ✅ Récupérer l'utilisateur depuis votre base locale (avec le passwordHash)
- ✅ Créer ou mettre à jour l'utilisateur dans Supabase (production)
- ✅ Copier toutes les informations (passwordHash, rôle, nom, etc.)

3. **Tester la connexion** :
   - Allez sur https://canopee.be/auth/signin
   - Connectez-vous avec les mêmes identifiants qu'en local

### 1. Vérifier l'utilisateur dans Supabase

1. Allez sur le dashboard Supabase : https://kzogkberupkzpjdojvhn.supabase.co
2. Table Editor → `users`
3. Cherchez `etibaliomecus@live.be`
4. Vérifiez :
   - ✅ L'utilisateur existe
   - ✅ `passwordHash` n'est pas `null`
   - ✅ `authProvider` est `local` (pas `google` ou `facebook`)

### 2. Script de diagnostic (sur le VPS)

```bash
# Se connecter au VPS
ssh votre-utilisateur@votre-vps

# Aller dans le dossier du projet
cd /var/www/canopee

# Exécuter le diagnostic
node scripts/diagnose-login.js etibaliomecus@live.be
```

Le script vérifiera :
- ✅ Configuration (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
- ✅ Existence de l'utilisateur
- ✅ Présence d'un passwordHash
- ✅ Configuration NEXTAUTH_SECRET

### 3. Vérifier les logs serveur

Les logs améliorés dans `lib/auth.ts` afficheront maintenant des messages détaillés :

```bash
# Sur le VPS
pm2 logs canopee --err --lines 50
```

Vous verrez des messages comme :
- `[AUTH] Utilisateur non trouvé: etibaliomecus@live.be`
- `[AUTH] Utilisateur sans passwordHash: ...`
- `[AUTH] Mot de passe incorrect pour: ...`
- `[AUTH] Connexion réussie pour: ...`

### 4. Si l'utilisateur n'a pas de passwordHash

Si l'utilisateur a été créé via OAuth (Google/Facebook), il n'aura pas de `passwordHash`.

**Solution 1 : Réinitialiser le mot de passe**

Créez un script `scripts/reset-password.js` :

```javascript
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("Usage: node scripts/reset-password.js <email> <new-password>");
    process.exit(1);
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const user = await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        authProvider: 'local',
      },
    });

    console.log(`✅ Mot de passe réinitialisé pour ${email}`);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
```

Puis exécutez :
```bash
node scripts/reset-password.js etibaliomecus@live.be "votre-nouveau-mot-de-passe"
```

**Solution 2 : Se connecter via OAuth**

Si l'utilisateur a été créé via Google/Facebook, utilisez le bouton OAuth correspondant sur la page de connexion.

### 5. Si l'utilisateur n'existe pas

Créez l'utilisateur via l'inscription sur le site :
1. Allez sur https://canopee.be/auth/signin
2. Cliquez sur "Pas encore de compte ? S'inscrire"
3. Remplissez le formulaire avec `etibaliomecus@live.be`
4. Connectez-vous avec les identifiants créés

### 6. Vérifier NEXTAUTH_SECRET

```bash
# Sur le VPS
cd /var/www/canopee
cat .env | grep NEXTAUTH_SECRET
```

Doit afficher quelque chose comme :
```
NEXTAUTH_SECRET="wdu9SfsEOeMx44gJuOZyUgSrJYiTB40ZfmMU4Lu0IJ8="
```

Si c'est vide ou un placeholder, générez un nouveau secret :
```bash
openssl rand -base64 32
```

Puis mettez à jour `.env` et redémarrez :
```bash
pm2 restart canopee
```

### 7. Vérifier NEXTAUTH_URL

```bash
# Sur le VPS
cat .env | grep NEXTAUTH_URL
```

Doit être :
```
NEXTAUTH_URL="https://canopee.be"
```

**Important** : Pas `http://`, pas `localhost`, pas `canopée.be` (avec accent).

### 8. Vérifier la connexion à la base de données

```bash
# Sur le VPS
node scripts/check-database.js
```

Si vous obtenez une erreur de connexion :
1. Vérifiez `DATABASE_URL` dans `.env`
2. Vérifiez que l'IP du VPS n'est pas bloquée dans Supabase (Settings → Database → Connection Pooling)

## Modifications apportées

### Amélioration des logs d'authentification

Le fichier `lib/auth.ts` a été amélioré pour afficher des logs détaillés lors des tentatives de connexion :

- ✅ Logs quand les credentials sont manquants
- ✅ Logs quand l'utilisateur n'existe pas
- ✅ Logs quand l'utilisateur n'a pas de passwordHash
- ✅ Logs quand le mot de passe est incorrect
- ✅ Logs quand la connexion réussit
- ✅ Gestion des erreurs avec logs

Ces logs apparaîtront dans les logs PM2 et aideront à diagnostiquer le problème.

### Script de diagnostic

Un nouveau script `scripts/diagnose-login.js` a été créé pour diagnostiquer les problèmes de connexion :

```bash
node scripts/diagnose-login.js etibaliomecus@live.be
```

Le script vérifie :
- Configuration (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL)
- Existence de l'utilisateur
- Présence d'un passwordHash
- Configuration NEXTAUTH_SECRET

## Étapes de diagnostic recommandées

**Si vous pouvez vous connecter en local mais pas en production :**

1. **Synchroniser l'utilisateur depuis local** :
   ```bash
   # Sur votre machine locale
   node scripts/sync-user-to-production.js etibaliomecus@live.be
   ```

2. **Tester la connexion en production** :
   - Allez sur https://canopee.be/auth/signin
   - Connectez-vous avec les mêmes identifiants qu'en local

**Si la synchronisation ne fonctionne pas ou si vous n'avez pas accès à la base locale :**

1. **Vérifier les logs serveur** :
   ```bash
   pm2 logs canopee --err --lines 50
   ```

2. **Exécuter le diagnostic** :
   ```bash
   node scripts/diagnose-login.js etibaliomecus@live.be
   ```

3. **Vérifier dans Supabase** :
   - Dashboard → Table Editor → `users`
   - Chercher `etibaliomecus@live.be`
   - Vérifier `passwordHash` et `authProvider`

4. **Si nécessaire, réinitialiser le mot de passe** :
   ```bash
   node scripts/reset-password.js etibaliomecus@live.be "nouveau-mot-de-passe"
   ```

5. **Redémarrer l'application** :
   ```bash
   pm2 restart canopee
   ```

6. **Tester la connexion** :
   - Aller sur https://canopee.be/auth/signin
   - Essayer de se connecter avec `etibaliomecus@live.be`
   - Vérifier les logs si l'erreur persiste

## Notes importantes

- Les logs d'authentification sont maintenant plus détaillés et aideront à identifier rapidement le problème
- Si l'utilisateur a été créé via OAuth, il faut soit réinitialiser le mot de passe, soit utiliser OAuth pour se connecter
- NEXTAUTH_SECRET doit être identique entre les environnements si vous utilisez plusieurs instances
- NEXTAUTH_URL doit correspondre exactement au domaine utilisé (https://canopee.be)

