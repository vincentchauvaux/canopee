# 🔧 Correction : Problème de domaine avec accent (Punycode)

## ❌ Problème

Les erreurs montrent que le navigateur utilise `xn--canope-fva.be` (encodage Punycode de `canopée.be` avec accent) au lieu de `canopee.be` :

```
GET https://xn--canope-fva.be/api/profile 401 (Unauthorized)
GET https://xn--canope-fva.be/api/classes 500 (Internal Server Error)
```

**Causes :**

- Vous accédez au site via `canopée.be` (avec accent) dans votre navigateur
- Le navigateur encode automatiquement cela en `xn--canope-fva.be` (Punycode)
- Mais `NEXTAUTH_URL` est configuré avec `canopee.be` (sans accent)
- Les cookies ne fonctionnent pas car le domaine ne correspond pas

## ✅ Solution : Configurer NEXTAUTH_URL avec le domaine réel

Puisque votre domaine réel est `canopée.be` (avec accent), vous devez configurer `NEXTAUTH_URL` avec ce domaine.

### Solution : Mettre à jour NEXTAUTH_URL

Sur le VPS, modifiez `.env` pour utiliser le domaine avec accent :

```bash
# Sur le VPS
cd /var/www/canopee
nano .env

# Modifiez NEXTAUTH_URL :
NEXTAUTH_URL="https://canopée.be"

# Sauvegarder (Ctrl+O, puis Ctrl+X)
```

**Important** : Utilisez `canopée.be` (avec accent), pas `canopee.be` (sans accent), car c'est votre domaine réel.

### Solution 2 : Rebuild après modification

Après avoir modifié `NEXTAUTH_URL`, il faut rebuild l'application :

```bash
# Vider le cache Next.js
rm -rf .next

# Rebuild
npm run build

# Redémarrer PM2
pm2 restart canopee
```

### Solution 3 : Vérifier la configuration DNS

Vérifiez que votre domaine pointe bien vers le VPS :

1. Allez dans votre espace client OVH
2. **Domaines** → **canopee.be** → **Zone DNS**
3. Vérifiez que les enregistrements A pointent vers l'IP du VPS :
   ```
   Type    Nom          Valeur           TTL
   A       @            IP_DU_VPS         3600
   A       www          IP_DU_VPS         3600
   ```

### Solution 4 : Vérifier la configuration Nginx

Sur le VPS, vérifiez que Nginx accepte bien `canopee.be` :

```bash
# Sur le VPS
cat /etc/nginx/sites-available/canopee
```

Vous devriez voir :

```nginx
server_name canopee.be www.canopee.be;
```

### Solution 5 : Vider les cookies et se reconnecter

1. **Vider tous les cookies** :

   - F12 → Application → Cookies
   - Supprimer tous les cookies pour `canopee.be` ET `xn--canope-fva.be`

2. **Se reconnecter** :

   - Allez sur https://canopée.be/auth/signin
   - Connectez-vous avec vos identifiants

3. **Tester** :
   - Allez sur https://canopée.be/profile
   - Cela devrait fonctionner maintenant

## 🔍 Pourquoi c'est important

- Les URLs avec accents (`canopée.be`) sont automatiquement encodées en Punycode (`xn--canope-fva.be`) par le navigateur
- NextAuth valide les cookies en comparant le domaine
- Si votre domaine réel est `canopée.be` (avec accent), `NEXTAUTH_URL` doit être `https://canopée.be` (avec accent)
- NextAuth et le navigateur gèrent automatiquement la conversion entre `canopée.be` et `xn--canope-fva.be`
- **Important :** `NEXTAUTH_URL` doit correspondre au domaine tel qu'il apparaît dans l'URL du navigateur

## 📋 Checklist

- [ ] `NEXTAUTH_URL` est configuré avec `https://canopée.be` (avec accent, votre domaine réel)
- [ ] Le cache `.next` a été supprimé (`rm -rf .next`)
- [ ] L'application a été rebuildée (`npm run build`)
- [ ] PM2 a été redémarré (`pm2 restart canopee`)
- [ ] Les cookies ont été vidés pour `canopée.be` et `xn--canope-fva.be`
- [ ] Vous vous êtes reconnecté après avoir vidé les cookies
- [ ] Nginx est configuré pour accepter `canopée.be` (vérifiez avec `cat /etc/nginx/sites-available/canopee`)

## 💡 Notes importantes

- **Votre domaine réel est `canopée.be`** (avec accent), comme configuré dans DNS
- Le navigateur encode automatiquement `canopée.be` en `xn--canope-fva.be` (Punycode)
- NextAuth accepte les deux formats, mais `NEXTAUTH_URL` doit correspondre au domaine tel qu'il apparaît dans l'URL
- Utilisez `https://canopée.be` (avec accent) dans `NEXTAUTH_URL` car c'est votre domaine réel

## ⚠️ Vérification de Nginx

Vérifiez que Nginx accepte bien `canopée.be` :

```bash
# Sur le VPS
cat /etc/nginx/sites-available/canopee | grep server_name
```

Si nécessaire, modifiez la configuration pour inclure `canopée.be` :

```nginx
server_name canopée.be www.canopée.be;
```

Puis rechargez Nginx :

```bash
sudo nginx -t
sudo systemctl reload nginx
```
