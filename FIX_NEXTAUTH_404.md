# Fix : Erreur 404 sur /api/auth/signin?csrf=true

## 🔍 Problème

L'erreur `GET https://canopee.be/api/auth/signin?csrf=true 404 (Not Found)` apparaît lors de la tentative de connexion. NextAuth ne peut pas accéder à la route de connexion.

## 🔧 Causes Possibles

### 1. Route NextAuth non correctement configurée

La route catch-all `[...nextauth]` devrait capturer toutes les routes sous `/api/auth/*`, mais cela peut ne pas fonctionner correctement en production.

### 2. Problème de build

Le build de production peut ne pas avoir correctement généré les routes NextAuth.

### 3. Configuration NEXTAUTH_URL incorrecte

Si `NEXTAUTH_URL` n'est pas correctement configuré, NextAuth peut essayer d'accéder à une mauvaise URL.

### 4. Problème avec le serveur (Nginx)

Le reverse proxy Nginx peut ne pas router correctement les requêtes vers `/api/auth/*`.

## ✅ Solutions

### Solution 1 : Vérifier la configuration de la route

Assurez-vous que le fichier `app/api/auth/[...nextauth]/route.ts` est correctement configuré :

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export const dynamic = 'force-dynamic'
```

### Solution 2 : Vérifier NEXTAUTH_URL

Sur le VPS, vérifiez que `NEXTAUTH_URL` est correctement configuré :

```bash
cd /var/www/canopee
cat .env | grep NEXTAUTH_URL
```

Il doit être :
```env
NEXTAUTH_URL="https://canopee.be"
```

**⚠️ Important** : Ne pas utiliser `http://` ou `localhost` en production.

### Solution 3 : Rebuild l'application

Si le problème persiste, reconstruisez l'application :

```bash
cd /var/www/canopee
npm run build
pm2 restart canopee
```

### Solution 4 : Vérifier la configuration Nginx

Vérifiez que Nginx route correctement toutes les requêtes vers Next.js :

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

**Important** : Assurez-vous que toutes les routes `/api/*` sont bien proxifiées vers Next.js.

### Solution 5 : Vérifier les logs

Consultez les logs de l'application pour voir les erreurs détaillées :

```bash
# Logs PM2
pm2 logs canopee

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Solution 6 : Vérifier que le build contient les routes API

Vérifiez que le dossier `.next/server/app/api/auth/[...nextauth]` existe après le build :

```bash
cd /var/www/canopee
ls -la .next/server/app/api/auth/
```

Si le dossier n'existe pas, le build n'a pas correctement généré les routes.

## 🔍 Diagnostic

### Test 0 : Comparer les fichiers .env

Avant tout, comparez votre `.env` local avec celui du VPS :

1. Créez un fichier `.env.vps` avec le contenu du `.env` du VPS
2. Exécutez le script de comparaison :
   ```bash
   node scripts/compare-env.js .env .env.vps
   ```

Ou consultez [VERIFICATION_ENV_VPS.md](./VERIFICATION_ENV_VPS.md) pour une vérification manuelle.

### Test 1 : Vérifier que la route existe

Testez directement la route depuis le serveur :

```bash
curl -I http://localhost:3000/api/auth/signin
```

Si cela retourne 404, le problème vient de Next.js/NextAuth.
Si cela retourne 200 ou 302, le problème vient de Nginx ou de la configuration.

### Test 2 : Vérifier les variables d'environnement

```bash
cd /var/www/canopee
node -e "console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)"
```

### Test 3 : Vérifier la configuration NextAuth

Créez un script de test :

```bash
cd /var/www/canopee
node -e "
const { authOptions } = require('./lib/auth.ts');
console.log('Auth options:', JSON.stringify(authOptions, null, 2));
"
```

## 📝 Checklist de Vérification

- [ ] La route `app/api/auth/[...nextauth]/route.ts` existe et exporte GET et POST
- [ ] `NEXTAUTH_URL` est configuré à `https://canopee.be` (pas `http://` ou `localhost`)
- [ ] `NEXTAUTH_SECRET` est défini et n'est pas un placeholder
- [ ] Le build a été fait avec `npm run build`
- [ ] Nginx route correctement toutes les requêtes `/api/*` vers Next.js
- [ ] Les logs ne montrent pas d'erreurs de configuration
- [ ] Le dossier `.next/server/app/api/auth/[...nextauth]` existe après le build

## 🚀 Commandes de Correction Rapide

```bash
# 1. Vérifier la configuration
cd /var/www/canopee
cat .env | grep NEXTAUTH

# 2. Rebuild
npm run build

# 3. Redémarrer
pm2 restart canopee

# 4. Vérifier les logs
pm2 logs canopee --lines 50
```

## 📖 Références

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js 14 App Router - Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [FIX_SESSION_CONNEXION.md](./FIX_SESSION_CONNEXION.md) - Problème de session après connexion
- [VERIFICATION_ENV_VPS.md](./VERIFICATION_ENV_VPS.md) - Vérification du fichier .env sur le VPS

