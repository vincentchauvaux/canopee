# 🔧 Correction : Redirection vers signin lors de l'accès au profil

## ❌ Problème

Lorsque vous cliquez sur la page `/profile`, vous êtes automatiquement redirigé vers `/auth/signin`, même si vous êtes connecté.

## 🔍 Causes possibles

1. **NEXTAUTH_URL non configuré** ou incorrect
2. **Cookie de session non lu** par NextAuth côté client
3. **Session expirée** ou invalide
4. **Problème de configuration du SessionProvider**
5. **Cookie bloqué** par le navigateur ou les paramètres de sécurité

## ✅ Solutions

### Solution 1 : Vérifier NEXTAUTH_URL

Le `NEXTAUTH_URL` est **crucial** pour que NextAuth fonctionne correctement en production.

```bash
# Sur le VPS
cd /var/www/canopee
cat .env | grep NEXTAUTH_URL
```

Il **doit** être :

```env
NEXTAUTH_URL="https://canopee.be"
```

**⚠️ Important** :

- Ne pas utiliser `http://` en production
- Ne pas utiliser `localhost` en production
- L'URL doit correspondre exactement au domaine (avec ou sans `www` selon votre configuration)
- **Ne pas utiliser d'accents dans l'URL** (pas `canopée.be` mais `canopee.be`)
- L'URL doit correspondre exactement au domaine réel utilisé par votre site

Si `NEXTAUTH_URL` est manquant ou incorrect :

```bash
# Éditer .env
nano .env

# Ajouter ou modifier :
NEXTAUTH_URL="https://canopee.be"

# Sauvegarder (Ctrl+O, puis Ctrl+X)

# Redémarrer l'application
pm2 restart canopee
```

### Solution 2 : Vérifier que vous êtes bien connecté

1. Allez sur https://canopee.be
2. Vérifiez dans le header si vous voyez votre nom/email ou un bouton "Se connecter"
3. Si vous voyez "Se connecter", vous n'êtes pas connecté

**Pour vous connecter** :

1. Allez sur https://canopee.be/auth/signin
2. Connectez-vous avec vos identifiants
3. Après la connexion, vous devriez être redirigé vers la page d'accueil
4. Vérifiez que vous voyez maintenant votre nom dans le header

### Solution 3 : Vider les cookies et se reconnecter

Le cookie de session peut être corrompu ou expiré.

1. **Dans le navigateur** :

   - Ouvrez les outils de développement (F12)
   - Allez dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)
   - Dans "Cookies", sélectionnez `https://canopee.be`
   - Supprimez tous les cookies (notamment `next-auth.session-token`)
   - Rechargez la page
   - Reconnectez-vous

2. **Ou utiliser le mode navigation privée** :
   - Ouvrez une fenêtre de navigation privée
   - Allez sur https://canopee.be/auth/signin
   - Connectez-vous
   - Essayez d'accéder à `/profile`

### Solution 4 : Vérifier les cookies dans les requêtes

Pour vérifier que le cookie est bien envoyé :

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Network" (Réseau)
3. Rechargez la page `/profile`
4. Cliquez sur la requête vers `/api/auth/session` (c'est celle que NextAuth utilise)
5. Allez dans l'onglet "Headers"
6. Vérifiez dans "Request Headers" qu'il y a un cookie `next-auth.session-token`

**Si le cookie n'est pas présent** :

- Vous n'êtes pas connecté
- Le cookie a été supprimé
- Le cookie est bloqué par le navigateur

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

### Solution 6 : Vérifier les logs

Regardez les logs pour voir ce qui se passe :

```bash
# Sur le VPS
pm2 logs canopee | grep -E "AUTH|session|profile"
```

Vous devriez voir :

- `[AUTH] Connexion réussie pour: votre-email@example.com` lors de la connexion
- `[getSessionFromRequest] Token found` lors de l'accès au profil

Si vous voyez `[getSessionFromRequest] No token or token.id`, c'est que la session n'est pas trouvée.

### Solution 7 : Tester l'API de session directement

Testez si l'API NextAuth retourne une session :

```bash
# Depuis votre navigateur, ouvrez la console (F12)
# Exécutez :
fetch('/api/auth/session')
  .then(r => r.json())
  .then(console.log)
```

**Si cela retourne `{}` ou `null`** :

- Vous n'êtes pas connecté
- Le cookie n'est pas envoyé
- `NEXTAUTH_URL` est incorrect

**Si cela retourne un objet avec `user`** :

- Vous êtes connecté
- Le problème vient peut-être de la page de profil elle-même

## 🧪 Diagnostic complet

### Vérification des variables d'environnement

```bash
# Sur le VPS
cd /var/www/canopee

# Vérifier toutes les variables NextAuth
cat .env | grep -E "NEXTAUTH|NODE_ENV"
```

Vous devriez voir :

```env
NEXTAUTH_SECRET="909Q8x2O3xSVblbwq94Nn26bE8JC8tAIlWggk+O7zVk="
NEXTAUTH_URL="https://canopee.be"
NODE_ENV="production"
```

### Test de connexion

1. Allez sur https://canopee.be/auth/signin
2. Connectez-vous
3. Vérifiez que vous êtes redirigé vers la page d'accueil
4. Vérifiez que vous voyez votre nom dans le header
5. Essayez d'accéder à `/profile`

### Vérification dans la console du navigateur

1. Ouvrez la console (F12)
2. Allez sur `/profile`
3. Vérifiez s'il y a des erreurs
4. Vérifiez les requêtes réseau vers `/api/auth/session`

## 📋 Checklist de vérification

- [ ] `NEXTAUTH_URL` est configuré et vaut `https://canopee.be`
- [ ] `NEXTAUTH_SECRET` est configuré (vous l'avez vérifié ✅)
- [ ] `NODE_ENV` est `production` en production
- [ ] Vous êtes connecté (vous voyez votre nom dans le header)
- [ ] Le cookie `next-auth.session-token` est présent dans les requêtes
- [ ] L'application a été redémarrée après modification de `.env`
- [ ] Les cookies ne sont pas bloqués dans le navigateur
- [ ] Vous avez testé dans un navigateur différent ou en navigation privée

## 🔄 Commandes complètes de correction

```bash
# 1. Se connecter au VPS
ssh ubuntu@51.178.44.114

# 2. Aller dans le répertoire
cd /var/www/canopee

# 3. Vérifier NEXTAUTH_URL
cat .env | grep NEXTAUTH_URL

# 4. Si manquant ou incorrect, éditer .env
nano .env
# → Vérifiez/modifiez NEXTAUTH_URL="https://canopee.be"
# → Sauvegardez (Ctrl+O, puis Ctrl+X)

# 5. Redémarrer l'application
pm2 restart canopee

# 6. Vérifier les logs
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
   - Vérifiez que le profil se charge (et non une redirection vers signin)

4. **Vérifier la session dans la console** :
   - F12 → Console
   - Exécutez : `fetch('/api/auth/session').then(r => r.json()).then(console.log)`
   - Vérifiez que cela retourne un objet avec `user`

## 📞 Support

Si le problème persiste après avoir essayé toutes les solutions :

1. Vérifiez les logs complets : `pm2 logs canopee --lines 100`
2. Vérifiez les cookies dans les outils de développement
3. Testez dans un navigateur différent ou en navigation privée
4. Vérifiez que le domaine `canopee.be` est correctement configuré dans Nginx
5. Vérifiez que HTTPS fonctionne correctement (certificat SSL valide)

## 🔗 Liens utiles

- [Guide de configuration NextAuth](./FIX_SESSION_CONNEXION.md)
- [Guide de configuration des variables d'environnement](./ENV_SETUP.md)
- [Guide pour voir les logs](./VOIR_LOGS.md)
