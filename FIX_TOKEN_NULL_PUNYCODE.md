# 🔧 Correction : Token null à cause du domaine Punycode

## ❌ Problème

Les logs montrent :
```
[getSessionFromRequest] Token value: null
[getSessionFromRequest] NEXTAUTH_URL: https://canopée.be
[getSessionFromRequest] No token or token.id
```

Le cookie n'est pas lu par `getToken`, probablement à cause d'un problème de domaine entre `canopée.be` et `xn--canope-fva.be` (Punycode).

## 🔍 Diagnostic

Avec les nouveaux logs, vérifiez :

```bash
# Sur le VPS
pm2 logs canopee | grep "getSessionFromRequest" | tail -20
```

Cherchez :
- `hasCookie: true` → Le cookie est présent dans les headers
- `hasNextAuthCookie: true` → Le cookie NextAuth est présent
- `hasCookie: false` → Le cookie n'est pas envoyé avec la requête

## ✅ Solutions

### Solution 1 : Utiliser le domaine Punycode dans NEXTAUTH_URL

Si le problème persiste, essayez d'utiliser le domaine Punycode dans `NEXTAUTH_URL` :

```bash
# Sur le VPS
cd /var/www/canopee
nano .env

# Modifiez NEXTAUTH_URL :
NEXTAUTH_URL="https://xn--canope-fva.be"

# Sauvegarder (Ctrl+O, puis Ctrl+X)

# Rebuild
rm -rf .next
npm run build
pm2 restart canopee
```

**Note** : Ce n'est pas idéal, mais cela peut résoudre le problème si NextAuth ne gère pas correctement la conversion automatique.

### Solution 2 : Vérifier la configuration des cookies

Le problème peut venir de la configuration `domain` des cookies. Modifiez `lib/auth.ts` :

```typescript
cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      // Ne pas spécifier de domaine pour que le cookie fonctionne avec les deux formats
      // domain: undefined,
    },
  },
},
```

**Important** : Ne pas spécifier de `domain` dans les options du cookie permet au navigateur de gérer automatiquement la conversion entre `canopée.be` et `xn--canope-fva.be`.

### Solution 3 : Vérifier dans le navigateur

**Dans le navigateur (F12 → Application → Cookies → https://canopée.be)** :

1. Vérifiez le cookie `next-auth.session-token`
2. Regardez la propriété **Domain** :
   - Si c'est `.canopée.be` → Le cookie devrait fonctionner
   - Si c'est `.xn--canope-fva.be` → Problème de domaine
   - Si c'est vide ou différent → Problème de configuration

**Dans le navigateur (F12 → Network)** :

1. Rechargez `/profile`
2. Cliquez sur la requête `/api/profile`
3. Allez dans "Headers" → "Request Headers"
4. Vérifiez si `Cookie: next-auth.session-token=...` est présent

### Solution 4 : Vider les cookies et se reconnecter

1. **Vider tous les cookies** :
   - F12 → Application → Cookies
   - Supprimer tous les cookies pour `canopée.be` ET `xn--canope-fva.be`

2. **Se reconnecter** :
   - Allez sur https://canopée.be/auth/signin
   - Connectez-vous
   - Vérifiez que le cookie est créé

3. **Vérifier le domaine du cookie** :
   - Le cookie doit être créé pour `.canopée.be` ou sans domaine spécifique

## 🧪 Test avec les nouveaux logs

Après avoir déployé les modifications avec les nouveaux logs :

1. Rechargez la page `/profile`
2. Vérifiez les logs sur le VPS :
```bash
pm2 logs canopee | grep "getSessionFromRequest" | tail -10
```

Vous devriez voir :
```
[getSessionFromRequest] Request info: {
  host: 'xn--canope-fva.be',
  hasCookie: true/false,
  cookieLength: ...,
  hasNextAuthCookie: true/false
}
```

Cela indiquera si le cookie est présent dans les headers.

## 📋 Checklist

- [ ] Les nouveaux logs sont déployés (modifications dans `lib/get-session.ts`)
- [ ] L'application a été rebuildée après les modifications
- [ ] PM2 a été redémarré
- [ ] Les logs montrent si le cookie est présent (`hasCookie`, `hasNextAuthCookie`)
- [ ] Si le cookie n'est pas présent, vérifier dans Network que le cookie est envoyé
- [ ] Si le cookie est présent mais non lu, essayer `NEXTAUTH_URL="https://xn--canope-fva.be"`
- [ ] Les cookies ont été vidés et vous vous êtes reconnecté

## 💡 Solution recommandée

Si le problème persiste après avoir vérifié les logs, essayez cette configuration :

1. **Utiliser le domaine Punycode dans NEXTAUTH_URL** :
   ```env
   NEXTAUTH_URL="https://xn--canope-fva.be"
   ```

2. **Ne pas spécifier de domaine dans les cookies** (déjà le cas dans votre config)

3. **Rebuild et redémarrer** :
   ```bash
   rm -rf .next
   npm run build
   pm2 restart canopee
   ```

4. **Vider les cookies et se reconnecter**

