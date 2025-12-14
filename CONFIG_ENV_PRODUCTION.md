# Configuration .env pour Production (VPS)

## 📝 Commande complète pour créer le fichier .env

```bash
# Créer le fichier .env avec toutes les variables nécessaires
cat > /var/www/canopee/.env <<'EOF'
# ============================================
# ENVIRONNEMENT
# ============================================
NODE_ENV=production
PORT=3000

# ============================================
# BASE DE DONNÉES (OBLIGATOIRE)
# ============================================
# Format Supabase : postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?schema=public
# Exemple : postgresql://postgres:monmotdepasse@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public"

# ============================================
# NEXTAUTH (OBLIGATOIRE)
# ============================================
# Générer avec : openssl rand -base64 32
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl"
NEXTAUTH_URL="https://canopee.be"

# ============================================
# DOMAINE PUBLIC (OBLIGATOIRE)
# ============================================
NEXT_PUBLIC_DOMAIN="canopee.be"

# ============================================
# OAUTH GOOGLE (OPTIONNEL)
# ============================================
# Si vous n'utilisez pas Google OAuth, laissez vide ou supprimez ces lignes
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ============================================
# OAUTH FACEBOOK (OPTIONNEL)
# ============================================
# Si vous n'utilisez pas Facebook OAuth, laissez vide ou supprimez ces lignes
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
EOF

# Sécuriser le fichier (lecture/écriture uniquement pour le propriétaire)
chmod 600 /var/www/canopee/.env
```

## ⚠️ Variables à remplacer

Avant d'exécuter la commande, remplacez :

1. **`[PASSWORD]`** dans `DATABASE_URL` par votre mot de passe Supabase
2. **`votre-secret-genere-avec-openssl`** par un secret généré avec :
   ```bash
   openssl rand -base64 32
   ```
3. Les valeurs OAuth si vous les utilisez

## ✅ Vérification après création

```bash
# Vérifier que le fichier existe et a les bonnes permissions
ls -la /var/www/canopee/.env
# Doit afficher : -rw------- (600)

# Vérifier le contenu (sans afficher les secrets complets)
cat /var/www/canopee/.env | grep -E "^[A-Z_]+=" | cut -d'=' -f1
```

## 🔒 Sécurité

- ✅ `chmod 600` : Seul le propriétaire peut lire/écrire
- ✅ Le fichier `.env` est dans `.gitignore` (ne sera jamais commité)
- ⚠️ Ne jamais partager le contenu du fichier `.env`
- ⚠️ Utiliser des secrets différents pour dev et production

## 📋 Checklist avant déploiement

- [ ] `DATABASE_URL` configuré avec le bon mot de passe Supabase
- [ ] `NEXTAUTH_SECRET` généré et configuré
- [ ] `NEXTAUTH_URL` pointe vers `https://canopee.be`
- [ ] `NEXT_PUBLIC_DOMAIN` configuré à `canopee.be`
- [ ] `NODE_ENV` défini à `production`
- [ ] `PORT` défini à `3000` (ou autre si nécessaire)
- [ ] OAuth configuré si nécessaire (Google/Facebook)
- [ ] Permissions du fichier : `chmod 600`


