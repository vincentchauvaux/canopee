# 🔧 Correction : Cookie non envoyé avec la requête API

## ❌ Problème

La session est détectée côté client (`[Profile] Session found`), mais l'API `/api/profile` retourne 401 (Unauthorized).

**Symptômes :**
- ✅ `fetch('/api/auth/session')` retourne bien la session
- ✅ `useSession()` détecte la session côté client
- ❌ Mais `/api/profile` retourne 401
- ❌ L'URL utilisée est `https://xn--canope-fva.be/api/profile` (Punycode)

## 🔍 Cause

Le cookie `next-auth.session-token` n'est pas envoyé avec la requête vers `/api/profile`, ou `getToken` ne peut pas le lire à cause d'un problème de domaine.

**Causes possibles :**
1. Le cookie est créé pour `canopée.be` mais la requête est faite vers `xn--canope-fva.be`
2. `NEXTAUTH_URL` ne correspond pas au domaine utilisé
3. Le cookie n'est pas envoyé à cause de la configuration `sameSite` ou `secure`

## ✅ Solutions

### Solution 1 : Vérifier les logs sur le VPS

```bash
# Sur le VPS
pm2 logs canopee | grep -E "API Profile|getSessionFromRequest" | tail -30
```

Cherchez :
- `[API Profile] Request headers` → Vérifiez si le cookie est présent
- `[getSessionFromRequest] No token or token.id` → Le cookie n'est pas lu
- `[getSessionFromRequest] Token found` → Le cookie est lu correctement

### Solution 2 : Vérifier NEXTAUTH_URL

```bash
# Sur le VPS
cd /var/www/canopee
cat .env | grep NEXTAUTH_URL
```

**Doit être** : `NEXTAUTH_URL="https://canopée.be"` (avec accent)

Si ce n'est pas le cas :
```bash
nano .env
# Modifiez : NEXTAUTH_URL="https://canopée.be"
# Sauvegardez (Ctrl+O, puis Ctrl+X)

# Rebuild
rm -rf .next
npm run build
pm2 restart canopee
```

### Solution 3 : Vérifier les cookies dans le navigateur

**Dans le navigateur (F12 → Network)** :

1. Rechargez la page `/profile`
2. Cliquez sur la requête vers `/api/profile`
3. Allez dans l'onglet "Headers"
4. Vérifiez dans "Request Headers" :
   - Y a-t-il un header `Cookie: next-auth.session-token=...` ?
   - Si non, le cookie n'est pas envoyé

**Dans le navigateur (F12 → Application → Cookies → https://canopée.be)** :

1. Vérifiez qu'il y a un cookie `next-auth.session-token`
2. Vérifiez les propriétés du cookie :
   - **Domain** : Doit être `.canopée.be` ou `canopée.be`
   - **Path** : Doit être `/`
   - **Secure** : Doit être coché (HTTPS)
   - **SameSite** : Doit être `Lax`

### Solution 4 : Vérifier la configuration des cookies

Vérifiez dans `lib/auth.ts` que la configuration est correcte :

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

**Important** : `secure: true` est nécessaire en production (HTTPS).

### Solution 5 : Vider les cookies et se reconnecter

1. **Vider tous les cookies** :
   - F12 → Application → Cookies
   - Supprimer tous les cookies pour `canopée.be` ET `xn--canope-fva.be`

2. **Se reconnecter** :
   - Allez sur https://canopée.be/auth/signin
   - Connectez-vous avec vos identifiants
   - Vérifiez que le cookie est créé après la connexion

3. **Tester** :
   - Allez sur https://canopée.be/profile
   - Vérifiez dans Network que le cookie est envoyé avec la requête `/api/profile`

## 🧪 Test dans la console

**Dans le navigateur (F12 → Console)** :

```javascript
// Test 1 : Vérifier que le cookie existe
document.cookie.split(';').find(c => c.includes('next-auth.session-token'))

// Test 2 : Tester l'API profile avec les cookies
fetch('/api/profile', { 
  credentials: 'include',
  headers: {
    'Cookie': document.cookie
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => console.log('Response:', data));
```

## 📋 Checklist

- [ ] `NEXTAUTH_URL="https://canopée.be"` (avec accent) dans `.env`
- [ ] Le cache `.next` a été supprimé et l'application rebuildée
- [ ] PM2 a été redémarré après les modifications
- [ ] Le cookie `next-auth.session-token` existe dans les cookies du navigateur
- [ ] Le cookie est envoyé dans les headers de la requête `/api/profile` (vérifier dans Network)
- [ ] Les logs sur le VPS montrent `[getSessionFromRequest] Token found` ou `[getSessionFromRequest] No token`
- [ ] Les cookies ont été vidés et vous vous êtes reconnecté

## 💡 Notes importantes

- Le navigateur encode automatiquement `canopée.be` en `xn--canope-fva.be` (Punycode)
- NextAuth doit gérer cette conversion automatiquement
- Si le cookie n'est pas envoyé, c'est souvent un problème de domaine ou de configuration `sameSite`/`secure`
- Les logs ajoutés dans `/api/profile` aident à identifier si le cookie est présent dans les headers

