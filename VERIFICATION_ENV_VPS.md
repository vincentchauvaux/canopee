# Vérification du fichier .env sur le VPS

## 📋 Analyse du .env VPS (lignes 81-114)

D'après le contenu fourni, voici l'analyse de votre configuration :

### ✅ Variables Correctement Configurées

```env
NEXTAUTH_URL="https://canopee.be"          ✅ Correct
NEXTAUTH_SECRET="wdu9SfsEOeMx44gJuOZyUgSrJYiTB40ZfmMU4Lu0IJ8="  ✅ Défini
NODE_ENV="production"                      ✅ Correct
NEXT_PUBLIC_DOMAIN="canopee.be"            ✅ Correct
DATABASE_URL="postgresql://..."            ✅ Configuré
GOOGLE_CLIENT_ID="..."                     ✅ Configuré
GOOGLE_CLIENT_SECRET="..."                 ✅ Configuré
```

### ⚠️ Points à Vérifier

1. **Format DATABASE_URL** : Le format utilisé est le pooler Supabase :

   ```
   postgresql://postgres.kzogkberupkzpjdojvhn:h2usmpssneaky%3F0@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?schema=public
   ```

   - ✅ Port 6543 (pooler) - Correct pour la production
   - ✅ `?schema=public` présent - Correct
   - ⚠️ Le mot de passe contient `%3F` (encodage URL pour `?`) - Vérifier si c'est correct

2. **Variables Manquantes Potentielles** :
   - `PORT=3000` - Optionnel mais recommandé
   - Variables de connexion Prisma (optionnel) :
     - `DATABASE_URL` pourrait inclure des paramètres de pool : `?schema=public&connection_limit=10&pool_timeout=20`

## 🔍 Comparaison avec le .env Local

Pour comparer votre `.env` local avec celui du VPS, vous avez deux options :

### Option 1 : Utiliser le script de comparaison

1. Créez un fichier `.env.vps` avec le contenu du `.env` du VPS :

   ```bash
   # Dans votre projet local
   nano .env.vps
   # Collez le contenu du .env VPS
   ```

2. Exécutez le script de comparaison :
   ```bash
   node scripts/compare-env.js .env .env.vps
   ```

### Option 2 : Comparaison manuelle

Comparez ces variables critiques :

| Variable             | Local (dev)             | VPS (prod)                                     | Statut                 |
| -------------------- | ----------------------- | ---------------------------------------------- | ---------------------- |
| `NEXTAUTH_URL`       | `http://localhost:3000` | `https://canopee.be`                           | ✅ Différent (normal)  |
| `NEXTAUTH_SECRET`    | `votre-secret`          | `wdu9SfsEOeMx44gJuOZyUgSrJYiTB40ZfmMU4Lu0IJ8=` | ⚠️ Doit être différent |
| `NODE_ENV`           | `development`           | `production`                                   | ✅ Différent (normal)  |
| `DATABASE_URL`       | Format local            | Format Supabase pooler                         | ✅ Différent (normal)  |
| `NEXT_PUBLIC_DOMAIN` | `localhost:3000`        | `canopee.be`                                   | ✅ Différent (normal)  |

## 🔧 Vérifications Spécifiques pour l'Erreur 404

### 1. Vérifier que NEXTAUTH_URL est correct

Sur le VPS :

```bash
cd /var/www/canopee
cat .env | grep NEXTAUTH_URL
```

**Doit afficher** :

```
NEXTAUTH_URL="https://canopee.be"
```

**⚠️ Ne doit PAS contenir** :

- `http://` (doit être `https://`)
- `localhost`
- `127.0.0.1`
- Port explicite (`:3000`)

### 2. Vérifier que NEXTAUTH_SECRET est défini

```bash
cat .env | grep NEXTAUTH_SECRET
```

**Doit afficher** :

```
NEXTAUTH_SECRET="wdu9SfsEOeMx44gJuOZyUgSrJYiTB40ZfmMU4Lu0IJ8="
```

**⚠️ Ne doit PAS être** :

- Vide
- `"A_REMPLACER_PAR_UN_SECRET"`
- Un placeholder

### 3. Vérifier que les variables sont chargées

```bash
cd /var/www/canopee
node -e "require('dotenv').config(); console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL)"
```

Si cela ne fonctionne pas, installez dotenv :

```bash
npm install dotenv
```

### 4. Vérifier le build

```bash
cd /var/www/canopee
ls -la .next/server/app/api/auth/
```

**Doit contenir** :

- Un dossier `[...nextauth]` ou similaire
- Des fichiers de route compilés

Si le dossier n'existe pas, rebuilder :

```bash
npm run build
```

## 🚀 Actions Correctives

### Si NEXTAUTH_URL est incorrect

```bash
cd /var/www/canopee
nano .env
# Modifier NEXTAUTH_URL="https://canopee.be"
# Sauvegarder (Ctrl+O, Enter, Ctrl+X)
pm2 restart canopee
```

### Si le build est obsolète

```bash
cd /var/www/canopee
npm run build
pm2 restart canopee
```

### Si les variables ne sont pas chargées

Vérifier que PM2 charge le `.env` :

```bash
# Vérifier la configuration PM2
pm2 show canopee

# Si nécessaire, redémarrer avec chargement explicite du .env
cd /var/www/canopee
pm2 restart canopee --update-env
```

## 📝 Checklist de Vérification

- [ ] `NEXTAUTH_URL="https://canopee.be"` (pas `http://` ou `localhost`)
- [ ] `NEXTAUTH_SECRET` est défini et n'est pas un placeholder
- [ ] `NODE_ENV="production"`
- [ ] `DATABASE_URL` est correct et accessible
- [ ] Le build a été fait avec `npm run build`
- [ ] PM2 a redémarré après les modifications
- [ ] Les logs ne montrent pas d'erreurs de configuration

## 🔍 Commandes de Diagnostic

```bash
# 1. Vérifier les variables d'environnement
cd /var/www/canopee
cat .env | grep -E "NEXTAUTH|NODE_ENV|DATABASE"

# 2. Vérifier que PM2 charge les variables
pm2 show canopee | grep -A 10 "env"

# 3. Tester la route NextAuth directement
curl -I http://localhost:3000/api/auth/signin

# 4. Vérifier les logs
pm2 logs canopee --lines 50

# 5. Vérifier Nginx
sudo tail -f /var/log/nginx/error.log
```

## 📖 Références

- [FIX_NEXTAUTH_404.md](./FIX_NEXTAUTH_404.md) - Guide complet pour résoudre l'erreur 404
- [ENV_SETUP.md](./ENV_SETUP.md) - Guide de configuration des variables d'environnement
- [CONFIG_ENV_PRODUCTION.md](./CONFIG_ENV_PRODUCTION.md) - Configuration .env pour la production
