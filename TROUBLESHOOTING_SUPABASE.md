# Dépannage Connexion Supabase

## ❌ Erreur : "Can't reach database server"

### Causes possibles

1. **Projet Supabase en pause**
   - Vérifiez dans votre dashboard Supabase si le projet est actif
   - Si le projet est en pause, cliquez sur "Resume project"

2. **Utilisation du port direct au lieu du connection pooling**
   - Le port 5432 peut être bloqué ou non disponible
   - Utilisez le **connection pooling** (port 6543) qui est plus fiable

3. **IP non autorisée**
   - Vérifiez dans Settings → Database → Connection Pooling
   - Assurez-vous que votre IP n'est pas bloquée

## ✅ Solution : Utiliser le Connection Pooling

### Étape 1 : Récupérer l'URL avec Connection Pooling

1. Allez dans **Settings → Database**
2. Dans la section **"Connection string"**, cherchez l'option **"Connection Pooling"**
3. Sélectionnez l'onglet **"URI"**
4. L'URL ressemblera à :
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### Étape 2 : Formater pour Prisma

Ajoutez `?schema=public` et remplacez `[PASSWORD]` par votre mot de passe encodé :

```env
DATABASE_URL="postgresql://postgres.kzogkberupkzpjdojvhn:2%24xsMyC%25%2B_%24H66n@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?schema=public"
```

**Note** : 
- Le format avec connection pooling utilise `postgres.[PROJECT_REF]` au lieu de `postgres`
- Le port est `6543` au lieu de `5432`
- L'hostname est `aws-0-[REGION].pooler.supabase.com` au lieu de `db.[PROJECT].supabase.co`

### Étape 3 : Vérifier la région

La région dans l'URL dépend de votre projet. Vérifiez dans Settings → General → Region.

Régions courantes :
- `eu-central-1` (Europe centrale)
- `us-east-1` (US East)
- `ap-southeast-1` (Asie-Pacifique)

## 🔍 Vérifier l'état du projet

1. Allez sur https://kzogkberupkzpjdojvhn.supabase.co
2. Vérifiez si vous voyez un message "Project paused"
3. Si oui, cliquez sur "Resume project"

## 🧪 Tester la connexion

Après avoir mis à jour le `.env` avec l'URL de connection pooling :

```bash
# Tester avec psql
psql "postgresql://postgres.kzogkberupkzpjdojvhn:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres" -c "SELECT version();"

# Tester avec Prisma
npx prisma db pull
```

## 📝 Format complet recommandé

```env
# Connection Pooling (recommandé)
DATABASE_URL="postgresql://postgres.kzogkberupkzpjdojvhn:2%24xsMyC%25%2B_%24H66n@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?schema=public"

# OU Port direct (si le pooling ne fonctionne pas)
DATABASE_URL="postgresql://postgres:2%24xsMyC%25%2B_%24H66n@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public"
```

---

**Important** : Remplacez `[REGION]` par la vraie région de votre projet Supabase.

