# 🔧 Correction : Erreur "No token or token.id" sur la page profil

## ❌ Problème

Lors de l'accès à la page `/profile`, les logs affichent :

```
[getSessionFromRequest] No token or token.id
```

L'API `/api/profile` retourne une erreur 401 (Non authentifié), empêchant l'affichage du profil.

## 🔍 Causes possibles

1. **L'utilisateur n'est pas connecté** (pas de session active)
2. **Le cookie de session n'est pas envoyé** avec la requête
3. **NEXTAUTH_SECRET incorrect** ou différent entre les environnements
4. **Cookie expiré ou invalide**
5. **Problème de configuration des cookies** (secure, sameSite, domaine)
6. **Problème de domaine** (cookie créé pour un domaine différent)

## ✅ Solutions

### Solution 1 : Vérifier que vous êtes connecté

1. Allez sur https://canopee.be
2. Vérifiez si vous voyez un bouton "Se connecter" ou votre nom/email
3. Si vous n'êtes pas connecté, connectez-vous d'abord sur `/auth/signin`

### Solution 2 : Vérifier NEXTAUTH_SECRET

Le `NEXTAUTH_SECRET` doit être identique partout et correctement configuré.

```bash
# Sur le VPS
cd /var/www/canopee

# Vérifier que NEXTAUTH_SECRET est présent
cat .env | grep NEXTAUTH_SECRET

# Vérifier qu'il n'est pas un placeholder
# Il doit être une longue chaîne générée avec openssl
```

Si `NEXTAUTH_SECRET` est manquant ou incorrect :

```bash
# Générer un nouveau secret
openssl rand -base64 32

# Éditer .env
nano .env
# Remplacez NEXTAUTH_SECRET par le secret généré

# Redémarrer l'application
pm2 restart canopee
```

### Solution 3 : Vérifier NEXTAUTH_URL

Le `NEXTAUTH_URL` doit correspondre exactement à l'URL de production.

```bash
# Sur le VPS
cd /var/www/canopee
cat .env | grep NEXTAUTH_URL
```

Il doit être :
```env
NEXTAUTH_URL="https://canopee.be"
```

**⚠️ Important** :
- Ne pas utiliser `http://` en production
- Ne pas utiliser `localhost` en production
- L'URL doit correspondre exactement au domaine (avec ou sans `www` selon votre configuration)

### Solution 4 : Vider les cookies et se reconnecter

Le cookie de session peut être corrompu ou expiré.

1. **Dans le navigateur** :
   - Ouvrez les outils de développement (F12)
   - Allez dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)
   - Supprimez tous les cookies pour `canopee.be`
   - Rechargez la page
   - Reconnectez-vous

2. **Ou utiliser le mode navigation privée** :
   - Ouvrez une fenêtre de navigation privée
   - Allez sur https://canopee.be/auth/signin
   - Connectez-vous
   - Essayez d'accéder à `/profile`

### Solution 5 : Vérifier la configuration des cookies

Les cookies NextAuth doivent être correctement configurés pour HTTPS.

Vérifiez dans `lib/auth.ts` que la configuration est :

```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production', // Doit être true en production
    },
  },
},
```

**Important** : `secure: true` est nécessaire en production (HTTPS) pour que les cookies fonctionnent.

### Solution 6 : Vérifier les logs d'authentification

Regardez les logs lors de la connexion :

```bash
# Sur le VPS
pm2 logs canopee | grep "AUTH"
```

Vous devriez voir :
- `[AUTH] Connexion réussie pour: votre-email@example.com`

Si vous ne voyez pas ce message, la connexion a échoué.

### Solution 7 : Tester la session côté client

La page de profil utilise `useSession()` côté client. Vérifiez que la session est bien chargée :

1. Ouvrez la console du navigateur (F12)
2. Allez sur `/profile`
3. Vérifiez s'il y a des erreurs dans la console
4. Vérifiez que `useSession()` retourne une session valide

### Solution 8 : Vérifier que le cookie est envoyé

Dans les outils de développement du navigateur :

1. Allez dans l'onglet "Network" (Réseau)
2. Rechargez la page `/profile`
3. Cliquez sur la requête vers `/api/profile`
4. Allez dans l'onglet "Headers"
5. Vérifiez dans "Request Headers" qu'il y a un cookie `next-auth.session-token`

Si le cookie n'est pas présent, c'est que :
- Vous n'êtes pas connecté
- Le cookie a été supprimé
- Le cookie est bloqué par le navigateur

## 🧪 Diagnostic complet

### Script de diagnostic

Créez un script pour tester la session :

```bash
# Sur le VPS
cd /var/www/canopee
node -e "
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Configuré' : '❌ Manquant');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '❌ Manquant');
console.log('NODE_ENV:', process.env.NODE_ENV || 'non défini');
"
```

### Vérification des variables d'environnement

```bash
# Sur le VPS
cd /var/www/canopee

# Vérifier toutes les variables NextAuth
cat .env | grep -E "NEXTAUTH|NODE_ENV"
```

## 📋 Checklist de vérification

- [ ] Vous êtes connecté (vous voyez votre nom/email sur le site)
- [ ] `NEXTAUTH_SECRET` est configuré et n'est pas un placeholder
- [ ] `NEXTAUTH_URL` est `https://canopee.be` (pas `http://` ou `localhost`)
- [ ] `NODE_ENV` est `production` en production
- [ ] Les cookies ne sont pas bloqués dans le navigateur
- [ ] Le cookie `next-auth.session-token` est présent dans les requêtes
- [ ] L'application a été redémarrée après modification de `.env`
- [ ] Les logs montrent `[AUTH] Connexion réussie` lors de la connexion

## 🔄 Commandes complètes de correction

```bash
# 1. Se connecter au VPS
ssh ubuntu@51.178.44.114

# 2. Aller dans le répertoire
cd /var/www/canopee

# 3. Vérifier NEXTAUTH_SECRET
cat .env | grep NEXTAUTH_SECRET

# 4. Si manquant ou incorrect, générer un nouveau secret
openssl rand -base64 32

# 5. Éditer .env
nano .env
# → Vérifiez/modifiez NEXTAUTH_SECRET
# → Vérifiez que NEXTAUTH_URL="https://canopee.be"
# → Sauvegardez (Ctrl+O, puis Ctrl+X)

# 6. Redémarrer l'application
pm2 restart canopee

# 7. Vérifier les logs
pm2 logs canopee --lines 20
```

## 💡 Actions côté navigateur

1. **Vider les cookies** :
   - F12 → Application → Cookies → Supprimer tous les cookies pour `canopee.be`

2. **Se reconnecter** :
   - Allez sur https://canopee.be/auth/signin
   - Connectez-vous avec vos identifiants
   - Vérifiez que la connexion réussit

3. **Tester la page profil** :
   - Allez sur https://canopee.be/profile
   - Vérifiez que le profil se charge

## 📞 Support

Si le problème persiste après avoir essayé toutes les solutions :

1. Vérifiez les logs complets : `pm2 logs canopee --lines 100`
2. Vérifiez les cookies dans les outils de développement
3. Testez dans un navigateur différent ou en navigation privée
4. Vérifiez que le domaine `canopee.be` est correctement configuré dans Nginx

## 🔗 Liens utiles

- [Guide de configuration NextAuth](./FIX_SESSION_CONNEXION.md)
- [Guide de configuration des variables d'environnement](./ENV_SETUP.md)
- [Guide de vérification de la base de données](./FIX_DATABASE_CONNECTION.md)

