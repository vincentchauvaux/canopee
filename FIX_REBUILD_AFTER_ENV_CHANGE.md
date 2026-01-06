# 🔧 Correction : Rebuild nécessaire après changement de NEXTAUTH_URL

## ❌ Problème

Après avoir modifié `NEXTAUTH_URL` dans `.env`, l'application redirige toujours vers `/auth/signin` même si vous êtes connecté.

**Erreurs dans les logs** :
- `TypeError: Cannot read properties of null (reading 'digest')`
- `Error: Failed to find Server Action "x". This request might be from an older or newer deployment`

## 🔍 Cause

Next.js compile certaines variables d'environnement au moment du build. Après avoir modifié `NEXTAUTH_URL`, il faut **rebuild l'application** pour que les changements soient pris en compte.

## ✅ Solution : Rebuild complet

### Étape 1 : Vider le cache Next.js

```bash
# Sur le VPS
cd /var/www/canopee

# Supprimer le dossier .next (cache Next.js)
rm -rf .next
```

### Étape 2 : Vérifier que NEXTAUTH_URL est correct

```bash
# Vérifier la valeur
cat .env | grep NEXTAUTH_URL
```

Vous devriez voir :
```
NEXTAUTH_URL="https://canopee.be"
```

**Pas** `canopée.be` avec un accent.

### Étape 3 : Rebuild l'application

```bash
# Rebuild complet
npm run build
```

Cela peut prendre quelques minutes. Attendez que le build se termine sans erreur.

### Étape 4 : Redémarrer PM2

```bash
# Arrêter l'application
pm2 stop canopee

# Redémarrer l'application
pm2 start canopee

# Ou simplement redémarrer
pm2 restart canopee
```

### Étape 5 : Vérifier les logs

```bash
# Vérifier que tout démarre correctement
pm2 logs canopee --lines 20
```

Vous ne devriez plus voir les erreurs `Cannot read properties of null`.

## 🔄 Commandes complètes (copier-coller)

```bash
# Se connecter au VPS
ssh ubuntu@51.178.44.114

# Aller dans le répertoire
cd /var/www/canopee

# Vérifier NEXTAUTH_URL
cat .env | grep NEXTAUTH_URL

# Vider le cache Next.js
rm -rf .next

# Rebuild l'application
npm run build

# Redémarrer PM2
pm2 restart canopee

# Vérifier les logs
pm2 logs canopee --lines 20
```

## 🧪 Test après rebuild

1. **Vider les cookies du navigateur** :
   - F12 → Application → Cookies → Supprimer tous les cookies pour `canopee.be`

2. **Se reconnecter** :
   - Allez sur https://canopee.be/auth/signin
   - Connectez-vous avec vos identifiants

3. **Tester la page profil** :
   - Allez sur https://canopee.be/profile
   - Vous devriez voir votre profil (et non une redirection vers signin)

## 💡 Pourquoi c'est nécessaire

- Next.js compile certaines variables d'environnement au moment du build
- `NEXTAUTH_URL` est utilisé par NextAuth pour valider les cookies
- Si le build a été fait avec l'ancienne valeur, les cookies ne seront pas validés correctement
- Un rebuild est nécessaire pour que la nouvelle valeur soit prise en compte

## ⚠️ Important

Après chaque modification de variables d'environnement importantes (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `DATABASE_URL`), il est recommandé de :

1. Vérifier que la valeur est correcte dans `.env`
2. Vider le cache : `rm -rf .next`
3. Rebuild : `npm run build`
4. Redémarrer : `pm2 restart canopee`

## 📋 Checklist

- [ ] `NEXTAUTH_URL` est correct dans `.env` (`https://canopee.be` sans accent)
- [ ] Le cache `.next` a été supprimé
- [ ] L'application a été rebuildée (`npm run build`)
- [ ] PM2 a été redémarré (`pm2 restart canopee`)
- [ ] Les logs ne montrent plus d'erreurs
- [ ] Les cookies ont été vidés dans le navigateur
- [ ] Vous vous êtes reconnecté
- [ ] La page `/profile` fonctionne maintenant

