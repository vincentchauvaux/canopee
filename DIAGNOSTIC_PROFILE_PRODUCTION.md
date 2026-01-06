# 🔍 Diagnostic : Page profile ne fonctionne pas en production

## ❌ Problème

La page `/profile` fonctionne en local mais pas en production (redirection vers `/auth/signin`).

## 🔍 Diagnostic étape par étape

### Étape 1 : Vérifier que vous êtes connecté

**Dans le navigateur (sur https://canopée.be)** :

1. Ouvrez la console (F12)
2. Exécutez cette commande :
```javascript
fetch('/api/auth/session').then(r => r.json()).then(console.log)
```

**Résultats possibles :**
- Si cela retourne `{}` ou `null` → Vous n'êtes pas connecté
- Si cela retourne un objet avec `user` → Vous êtes connecté, le problème vient d'ailleurs

### Étape 2 : Vérifier NEXTAUTH_URL sur le VPS

```bash
# Sur le VPS
cd /var/www/canopee
cat .env | grep NEXTAUTH_URL
```

**Doit être** :
```
NEXTAUTH_URL="https://canopée.be"
```

**PAS** `canopee.be` (sans accent).

### Étape 3 : Vérifier que le rebuild a été fait

```bash
# Sur le VPS
cd /var/www/canopee

# Vérifier la date de modification du dossier .next
ls -la .next | head -5

# Si le dossier .next est ancien, il faut rebuild
```

### Étape 4 : Vérifier les logs d'authentification

```bash
# Sur le VPS
pm2 logs canopee | grep -E "AUTH|session|profile" | tail -20
```

Cherchez :
- `[AUTH] Connexion réussie` lors de la connexion
- `[getSessionFromRequest] Token found` lors de l'accès au profil
- `[getSessionFromRequest] No token or token.id` → Problème de session

### Étape 5 : Vérifier les cookies dans le navigateur

**Dans le navigateur (F12 → Application → Cookies → https://canopée.be)** :

Vérifiez qu'il y a un cookie `next-auth.session-token`.

**Si le cookie n'existe pas** :
- Vous n'êtes pas connecté
- Le cookie a été supprimé
- Le cookie est bloqué

### Étape 6 : Vérifier la requête API dans le navigateur

**Dans le navigateur (F12 → Network)** :

1. Rechargez la page `/profile`
2. Cherchez la requête vers `/api/profile`
3. Cliquez dessus
4. Allez dans l'onglet "Headers"
5. Vérifiez dans "Request Headers" qu'il y a un cookie `next-auth.session-token`

**Si le cookie n'est pas présent dans les headers** :
- Le cookie n'est pas envoyé avec la requête
- Problème de domaine ou de configuration des cookies

## ✅ Solutions selon le diagnostic

### Solution 1 : Vous n'êtes pas connecté

**Symptômes** : `fetch('/api/auth/session')` retourne `{}` ou `null`

**Actions** :
1. Videz tous les cookies (F12 → Application → Cookies → Supprimer)
2. Allez sur https://canopée.be/auth/signin
3. Connectez-vous
4. Vérifiez que la connexion réussit (vous voyez votre nom dans le header)
5. Essayez d'accéder à `/profile`

### Solution 2 : NEXTAUTH_URL incorrect

**Symptômes** : `NEXTAUTH_URL` n'est pas `https://canopée.be`

**Actions** :
```bash
# Sur le VPS
cd /var/www/canopee
nano .env
# Modifiez : NEXTAUTH_URL="https://canopée.be"
# Sauvegardez (Ctrl+O, puis Ctrl+X)

# Vider le cache et rebuild
rm -rf .next
npm run build
pm2 restart canopee
```

### Solution 3 : Le rebuild n'a pas été fait

**Symptômes** : Le dossier `.next` est ancien ou les erreurs persistent

**Actions** :
```bash
# Sur le VPS
cd /var/www/canopee

# Vider complètement le cache
rm -rf .next
rm -rf node_modules/.cache

# Rebuild complet
npm run build

# Redémarrer PM2
pm2 restart canopee

# Vérifier les logs
pm2 logs canopee --lines 20
```

### Solution 4 : Les cookies ne sont pas envoyés

**Symptômes** : Le cookie existe mais n'est pas dans les headers de la requête

**Actions** :
1. Vérifiez la configuration des cookies dans `lib/auth.ts` :
```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production', // Doit être true
    },
  },
},
```

2. Vérifiez que `NODE_ENV=production` dans `.env`

3. Videz les cookies et reconnectez-vous

### Solution 5 : Problème de base de données

**Symptômes** : Erreurs dans les logs liées à la base de données

**Actions** :
```bash
# Sur le VPS
cd /var/www/canopee

# Vérifier la connexion à la base de données
node scripts/check-database.js

# Vérifier que l'utilisateur existe
node scripts/check-user-role.js votre-email@example.com
```

## 🔄 Procédure complète de correction

Si rien ne fonctionne, suivez cette procédure complète :

```bash
# 1. Se connecter au VPS
ssh ubuntu@51.178.44.114

# 2. Aller dans le répertoire
cd /var/www/canopee

# 3. Vérifier NEXTAUTH_URL
cat .env | grep NEXTAUTH_URL
# Doit être : NEXTAUTH_URL="https://canopée.be"

# 4. Vérifier NEXTAUTH_SECRET
cat .env | grep NEXTAUTH_SECRET
# Doit être présent et non vide

# 5. Vérifier NODE_ENV
cat .env | grep NODE_ENV
# Doit être : NODE_ENV=production

# 6. Vider complètement le cache
rm -rf .next
rm -rf node_modules/.cache

# 7. Rebuild complet
npm run build

# 8. Redémarrer PM2
pm2 restart canopee

# 9. Vérifier les logs
pm2 logs canopee --lines 30
```

**Côté navigateur** :

1. Videz tous les cookies (F12 → Application → Cookies → Supprimer tout)
2. Fermez complètement le navigateur
3. Rouvrez le navigateur
4. Allez sur https://canopée.be/auth/signin
5. Connectez-vous
6. Vérifiez dans la console : `fetch('/api/auth/session').then(r => r.json()).then(console.log)`
7. Si cela retourne un objet avec `user`, essayez d'accéder à `/profile`

## 🧪 Test de la session dans la console

**Dans le navigateur (F12 → Console)** :

```javascript
// Test 1 : Vérifier la session
fetch('/api/auth/session')
  .then(r => r.json())
  .then(data => {
    console.log('Session:', data);
    if (data && data.user) {
      console.log('✅ Connecté:', data.user.email);
    } else {
      console.log('❌ Non connecté');
    }
  });

// Test 2 : Tester l'API profile directement
fetch('/api/profile', { credentials: 'include' })
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => {
    console.log('Profile:', data);
  });
```

## 📋 Checklist complète

- [ ] `NEXTAUTH_URL="https://canopée.be"` (avec accent) dans `.env`
- [ ] `NEXTAUTH_SECRET` est configuré et non vide
- [ ] `NODE_ENV=production` dans `.env`
- [ ] Le cache `.next` a été supprimé (`rm -rf .next`)
- [ ] L'application a été rebuildée (`npm run build`)
- [ ] PM2 a été redémarré (`pm2 restart canopee`)
- [ ] Les cookies ont été vidés dans le navigateur
- [ ] Vous vous êtes reconnecté après avoir vidé les cookies
- [ ] `fetch('/api/auth/session')` retourne un objet avec `user`
- [ ] Le cookie `next-auth.session-token` est présent dans les cookies
- [ ] Le cookie est envoyé dans les headers de la requête `/api/profile`

## 💡 Informations à collecter pour le diagnostic

Si le problème persiste, collectez ces informations :

1. **Résultat de** `fetch('/api/auth/session')` dans la console
2. **Status code** de la requête `/api/profile` (dans Network)
3. **Logs PM2** : `pm2 logs canopee --lines 50`
4. **Valeur de NEXTAUTH_URL** : `cat .env | grep NEXTAUTH_URL`
5. **Date du dernier build** : `ls -la .next | head -5`

