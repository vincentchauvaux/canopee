# Fix : Problème de session après connexion

## 🔍 Problème

L'erreur "Session not created after sign in" apparaît après la connexion. L'utilisateur ne peut pas se connecter.

## 🔧 Solution Appliquée

### Changement dans `app/auth/signin/page.tsx`

**Avant** : Vérification immédiate de la session après `signIn()`, ce qui échouait car le cookie n'était pas encore créé.

**Après** : Utilisation de `window.location.href = '/'` pour forcer un rechargement complet de la page après une connexion réussie. Cela permet à NextAuth de créer correctement le cookie de session.

### Code modifié

```typescript
// Avant (ne fonctionnait pas)
await updateSession();
const session = await getSession();
if (!session) {
  console.error("Session not created after sign in");
  setError("Erreur lors de la connexion. Veuillez réessayer.");
  return;
}
router.push("/");
router.refresh();

// Après (fonctionne)
// Si la connexion réussit, rediriger directement
// La session sera créée côté serveur via le cookie
window.location.href = "/";
```

## ⚠️ Vérification NEXTAUTH_SECRET

**Important** : Vérifiez que `NEXTAUTH_SECRET` dans `.env` n'est pas un placeholder.

Sur le VPS, vérifiez :

```bash
cd /var/www/canopee
cat .env | grep NEXTAUTH_SECRET
```

Si c'est `NEXTAUTH_SECRET="A_REMPLACER_PAR_UN_SECRET"`, générez un nouveau secret :

```bash
openssl rand -base64 32
```

Puis mettez à jour `.env` :

```bash
nano .env
# Remplacez NEXTAUTH_SECRET par le secret généré
```

Redémarrez l'application :

```bash
pm2 restart canopee
```

## ✅ Test

1. Allez sur https://canopee.be/auth/signin
2. Connectez-vous avec vos identifiants
3. Vous devriez être redirigé vers la page d'accueil et être connecté

## 📝 Notes

- `window.location.href` force un rechargement complet, ce qui permet à NextAuth de lire le cookie de session correctement
- Cette approche est plus fiable que `router.push()` + `router.refresh()` pour la création de session
- Le cookie est créé côté serveur par NextAuth, il faut juste laisser le temps au navigateur de le recevoir

