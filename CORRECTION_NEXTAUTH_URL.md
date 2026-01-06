# 🔧 Correction : NEXTAUTH_URL avec accent

## ❌ Problème identifié

Votre `NEXTAUTH_URL` est configuré avec un accent :
```env
NEXTAUTH_URL="https://canopée.be"
```

**C'est incorrect !** Les URLs ne doivent **jamais** contenir d'accents.

## ✅ Solution

Corrigez `NEXTAUTH_URL` pour utiliser le domaine sans accent :

```env
NEXTAUTH_URL="https://canopee.be"
```

## 🔄 Commandes pour corriger

```bash
# Se connecter au VPS
ssh ubuntu@51.178.44.114

# Aller dans le répertoire
cd /var/www/canopee

# Éditer le fichier .env
nano .env

# Trouvez la ligne :
# NEXTAUTH_URL="https://canopée.be"
# Et remplacez-la par :
NEXTAUTH_URL="https://canopee.be"

# Sauvegarder (Ctrl+O, puis Ctrl+X)

# Redémarrer l'application
pm2 restart canopee

# Vérifier que c'est bien corrigé
cat .env | grep NEXTAUTH_URL
```

## 📋 Vérification

Après la correction, vérifiez :

```bash
cat .env | grep NEXTAUTH_URL
```

Vous devriez voir :
```
NEXTAUTH_URL="https://canopee.be"
```

**Pas** `canopée.be` avec un accent.

## 🧪 Test

1. Redémarrez l'application : `pm2 restart canopee`
2. Videz les cookies de votre navigateur
3. Reconnectez-vous sur https://canopee.be/auth/signin
4. Essayez d'accéder à `/profile`

Cela devrait maintenant fonctionner !

## 💡 Pourquoi c'est important

- Les URLs ne peuvent pas contenir d'accents (caractères non-ASCII)
- NextAuth utilise `NEXTAUTH_URL` pour valider les cookies et les sessions
- Si l'URL ne correspond pas exactement au domaine réel, les cookies ne fonctionnent pas
- Le domaine réel de votre site est `canopee.be` (sans accent)

