# Fix : Utilisateur Admin ne fonctionne pas en production

## 🔍 Diagnostic du Problème

Si votre utilisateur admin fonctionne en local mais pas en production (OVH), voici les causes possibles :

### Causes possibles

1. **L'utilisateur n'existe pas dans la base de données de production**

   - Les bases de données locale et production (Supabase) sont séparées
   - L'utilisateur créé en local n'existe pas automatiquement en production

2. **L'utilisateur existe mais n'a pas le rôle `admin`**

   - L'utilisateur a été créé avec le rôle `user` par défaut
   - Le rôle n'a pas été mis à jour en production

3. **Problème de session/authentification**

   - Le token JWT n'est pas régénéré après la mise à jour du rôle
   - Problème avec `NEXTAUTH_SECRET` ou `NEXTAUTH_URL` en production

4. **Problème de connexion à la base de données**
   - La `DATABASE_URL` en production pointe vers une autre base
   - Problème de connexion Prisma

## ✅ Solutions

### Solution 1 : Vérifier l'utilisateur dans Supabase (Recommandé)

1. **Accéder au dashboard Supabase** :

   - Allez sur https://kzogkberupkzpjdojvhn.supabase.co
   - Connectez-vous à votre compte

2. **Vérifier l'utilisateur** :

   - Allez dans **Table Editor** → **users**
   - Cherchez l'email `etibaliomecus@live.be`
   - Vérifiez le champ `role` :
     - Si `role = 'user'` → Mettez-le à `admin`
     - Si l'utilisateur n'existe pas → Créez-le (voir Solution 2)

3. **Mettre à jour le rôle** :
   - Cliquez sur l'utilisateur
   - Changez `role` de `user` à `admin`
   - Sauvegardez

### Solution 2 : Créer/Mettre à jour l'admin via SQL (Supabase)

1. **Accéder au SQL Editor de Supabase** :

   - Allez sur https://kzogkberupkzpjdojvhn.supabase.co
   - Cliquez sur **SQL Editor** dans le menu de gauche

2. **Vérifier si l'utilisateur existe** :

```sql
SELECT id, email, "firstName", "lastName", role
FROM users
WHERE email = 'etibaliomecus@live.be';
```

3. **Si l'utilisateur existe, mettre à jour le rôle** :

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'etibaliomecus@live.be';
```

4. **Si l'utilisateur n'existe pas, le créer** :
   - **Option A** : S'inscrire via le site en production, puis mettre à jour le rôle
   - **Option B** : Créer directement en SQL (nécessite de hasher le mot de passe)

### Solution 3 : Utiliser le script Node.js depuis le VPS

1. **Se connecter au VPS OVH** :

```bash
ssh votre-utilisateur@votre-vps-ovh
```

2. **Aller dans le dossier du projet** :

```bash
cd /var/www/canopee
```

3. **Vérifier la configuration** :

   - Vérifiez que le fichier `.env` contient la bonne `DATABASE_URL` (Supabase)
   - Vérifiez que `NEXTAUTH_SECRET` et `NEXTAUTH_URL` sont corrects

4. **Vérifier l'utilisateur** :

```bash
node scripts/check-user-role.js etibaliomecus@live.be
```

5. **Créer/Mettre à jour l'admin** :

```bash
# Si l'utilisateur existe déjà (inscrit via le site)
node scripts/create-admin.js etibaliomecus@live.be

# Si vous devez créer l'utilisateur avec un mot de passe
node scripts/create-admin.js etibaliomecus@live.be VOTRE_MOT_DE_PASSE "Vincent" "Chauvaux"
```

### Solution 4 : Vérifier les variables d'environnement en production

Sur le VPS, vérifiez que le fichier `.env` contient :

```env
# Base de données Supabase (PRODUCTION)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public"

# NextAuth (PRODUCTION)
NEXTAUTH_URL="https://canopee.be"
NEXTAUTH_SECRET="votre-secret-nextauth-production"

# Environnement
NODE_ENV="production"
```

**Important** :

- `NEXTAUTH_URL` doit être `https://canopee.be` en production (pas `http://localhost:3000`)
- `NEXTAUTH_SECRET` doit être le même que celui utilisé pour générer les tokens

### Solution 5 : Régénérer la session

Après avoir mis à jour le rôle admin :

1. **Déconnectez-vous** du site en production
2. **Videz les cookies** du navigateur pour `canopee.be`
3. **Reconnectez-vous** avec `etibaliomecus@live.be`
4. **Vérifiez** que vous pouvez accéder à `/admin`

## 🔧 Script de Diagnostic Complet

Créez un fichier `scripts/diagnose-admin.js` sur le VPS :

```bash
cd /var/www/canopee
cat > scripts/diagnose-admin.js << 'EOF'
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function diagnose() {
  const email = process.argv[2] || 'etibaliomecus@live.be'

  console.log('\n🔍 Diagnostic Admin - Production\n')
  console.log('📋 Configuration:')
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configuré' : '❌ Manquant'}`)
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || '❌ Manquant'}`)
  console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ Configuré' : '❌ Manquant'}`)
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'non défini'}`)

  try {
    console.log(`\n👤 Recherche de l'utilisateur: ${email}`)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        authProvider: true,
        createdAt: true,
      },
    })

    if (!user) {
      console.log(`\n❌ Utilisateur ${email} NON TROUVÉ dans la base de données`)
      console.log(`\n💡 Solutions:`)
      console.log(`   1. Créer l'utilisateur via le site: https://canopee.be/auth/signin`)
      console.log(`   2. Puis exécuter: node scripts/create-admin.js ${email}`)
      process.exit(1)
    }

    console.log(`\n✅ Utilisateur trouvé:`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Nom: ${user.firstName || ''} ${user.lastName || ''}`)
    console.log(`   Rôle: ${user.role}`)
    console.log(`   Auth Provider: ${user.authProvider}`)
    console.log(`   Créé le: ${user.createdAt}`)

    if (user.role !== 'admin') {
      console.log(`\n⚠️  PROBLÈME: L'utilisateur n'est PAS admin`)
      console.log(`\n💡 Solution:`)
      console.log(`   node scripts/create-admin.js ${email}`)
      console.log(`\n   Ou via Supabase SQL Editor:`)
      console.log(`   UPDATE users SET role = 'admin' WHERE email = '${email}';`)
    } else {
      console.log(`\n✅ L'utilisateur est bien admin`)
      console.log(`\n💡 Si vous avez toujours des erreurs 403:`)
      console.log(`   1. Déconnectez-vous du site`)
      console.log(`   2. Videz les cookies du navigateur`)
      console.log(`   3. Reconnectez-vous`)
      console.log(`   4. Vérifiez NEXTAUTH_URL et NEXTAUTH_SECRET`)
    }
  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n💡 Problème de connexion à la base de données')
      console.log('   Vérifiez DATABASE_URL dans .env')
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

diagnose()
EOF

chmod +x scripts/diagnose-admin.js
```

Utilisation :

```bash
node scripts/diagnose-admin.js etibaliomecus@live.be
```

## 📝 Checklist de Vérification

- [ ] L'utilisateur existe dans Supabase (Table Editor → users)
- [ ] Le rôle est bien `admin` dans Supabase
- [ ] `DATABASE_URL` dans `.env` du VPS pointe vers Supabase
- [ ] `NEXTAUTH_URL` dans `.env` du VPS est `https://canopee.be`
- [ ] `NEXTAUTH_SECRET` est configuré et identique
- [ ] L'application a été redémarrée après modification du `.env`
- [ ] Les cookies du navigateur ont été vidés
- [ ] Nouvelle connexion effectuée après mise à jour du rôle

## 🚨 Problèmes Courants

### Erreur 403 "Non autorisé"

**Causes** :

- Le rôle n'est pas `admin` dans la base de données
- Le token JWT n'a pas été régénéré (déconnexion/reconnexion nécessaire)
- `NEXTAUTH_SECRET` différent entre local et production

**Solution** :

1. Vérifier le rôle dans Supabase
2. Déconnecter/reconnecter
3. Vérifier `NEXTAUTH_SECRET`

### L'utilisateur n'existe pas en production

**Cause** : Les bases de données locale et production sont séparées

**Solution** :

1. S'inscrire via https://canopee.be/auth/signin
2. Mettre à jour le rôle en admin via Supabase ou le script

### Problème de connexion à la base de données

**Causes** :

- `DATABASE_URL` incorrect
- IP du VPS bloquée dans Supabase
- Problème réseau

**Solution** :

1. Vérifier `DATABASE_URL` dans `.env`
2. Vérifier les paramètres de sécurité Supabase (Settings → Database)
3. Tester la connexion : `psql "$DATABASE_URL" -c "SELECT version();"`

## 📞 Support

Si le problème persiste :

1. Vérifier les logs de l'application : `pm2 logs canopee`
2. Vérifier les logs Supabase (Dashboard → Logs)
3. Exécuter le script de diagnostic : `node scripts/diagnose-admin.js etibaliomecus@live.be`



