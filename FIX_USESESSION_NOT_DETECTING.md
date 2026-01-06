# 🔧 Correction : useSession() ne détecte pas la session côté client

## ❌ Problème

La session API fonctionne (`/api/auth/session` retourne bien la session), mais `useSession()` côté client dans la page profile retourne `null`, causant une redirection vers `/auth/signin`.

**Symptômes :**
- `fetch('/api/auth/session')` retourne bien la session ✅
- Mais `useSession()` dans le composant retourne `null` ❌
- La page profile redirige vers `/auth/signin` même si vous êtes connecté

## 🔍 Cause

Le `SessionProvider` de NextAuth ne charge pas correctement la session côté client, ou il y a un problème de timing où `useSession()` est appelé avant que la session soit chargée.

## ✅ Solution appliquée

### 1. Amélioration du SessionProvider

**Fichier** : `app/providers.tsx`

**Changements :**
- Ajout de `basePath="/api/auth"` pour s'assurer que le SessionProvider utilise le bon chemin
- Configuration de `refetchOnWindowFocus={true}` pour recharger la session au focus
- Configuration de `refetchInterval={5 * 60}` pour recharger la session toutes les 5 minutes

### 2. Amélioration de la page profile

**Fichier** : `app/profile/page.tsx`

**Changements :**
- Meilleure gestion du statut `loading` vs `unauthenticated`
- Logs de débogage pour identifier le problème
- Vérification explicite du statut `authenticated` avant de charger le profil

## 🔄 Déploiement

Après ces modifications, il faut rebuild et redéployer :

```bash
# Sur le VPS
cd /var/www/canopee

# Vider le cache
rm -rf .next

# Rebuild
npm run build

# Redémarrer PM2
pm2 restart canopee
```

**Côté navigateur :**
1. Videz les cookies (F12 → Application → Cookies → Supprimer)
2. Rechargez complètement la page (Ctrl+Shift+R ou Cmd+Shift+R)
3. Reconnectez-vous si nécessaire
4. Essayez d'accéder à `/profile`

## 🧪 Test

**Dans la console du navigateur (F12)** :

```javascript
// Test 1 : Vérifier que la session API fonctionne
fetch('/api/auth/session').then(r => r.json()).then(console.log)
// Doit retourner un objet avec user

// Test 2 : Vérifier que useSession() fonctionne maintenant
// Ouvrez la console et allez sur /profile
// Vous devriez voir dans les logs : "[Profile] Session found, loading profile"
```

## 📋 Checklist

- [ ] Les modifications ont été faites dans `app/providers.tsx` et `app/profile/page.tsx`
- [ ] Le code a été commité et poussé sur Git
- [ ] Sur le VPS : `git pull` pour récupérer les modifications
- [ ] Sur le VPS : `rm -rf .next && npm run build`
- [ ] Sur le VPS : `pm2 restart canopee`
- [ ] Les cookies ont été vidés dans le navigateur
- [ ] La page a été rechargée complètement (Ctrl+Shift+R)
- [ ] Vous vous êtes reconnecté si nécessaire
- [ ] La page `/profile` fonctionne maintenant

## 💡 Notes

- Le problème venait du fait que `useSession()` côté client ne synchronisait pas correctement avec `/api/auth/session`
- L'ajout de `basePath` dans le `SessionProvider` aide NextAuth à trouver correctement l'API de session
- Les logs dans la page profile aident à identifier si le problème persiste

## 🔗 Voir aussi

- [Guide de diagnostic complet](./DIAGNOSTIC_PROFILE_PRODUCTION.md)
- [Guide de correction de la redirection](./FIX_REDIRECT_SIGNIN_PROFILE.md)

