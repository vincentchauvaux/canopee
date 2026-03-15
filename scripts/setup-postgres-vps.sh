#!/bin/bash
# Script à exécuter sur le VPS (en SSH) pour passer à PostgreSQL local (sans Supabase).
# Usage: cd /var/www/canopee && bash scripts/setup-postgres-vps.sh
# Il te demandera le mot de passe pour l'utilisateur PostgreSQL "canopee".

set -e
cd /var/www/canopee || { echo "Erreur: exécute ce script depuis /var/www/canopee"; exit 1; }

echo "=============================================="
echo "  Configuration PostgreSQL sur le VPS"
echo "=============================================="
echo ""

# 1. Installer PostgreSQL si besoin
if ! command -v psql &> /dev/null; then
  echo "[1/6] Installation de PostgreSQL..."
  sudo apt update
  sudo apt install -y postgresql postgresql-contrib
  sudo systemctl enable postgresql
  sudo systemctl start postgresql
else
  echo "[1/6] PostgreSQL déjà installé."
fi

# 2. Demander le mot de passe pour l'utilisateur canopee
echo ""
read -sp "Mot de passe pour l'utilisateur PostgreSQL 'canopee' (à retenir pour le .env): " DB_PASS
echo ""
if [ -z "$DB_PASS" ]; then
  echo "Erreur: le mot de passe ne peut pas être vide."
  exit 1
fi

# 3. Créer l'utilisateur et la base (idempotent)
echo "[2/6] Création de l'utilisateur et de la base canopee..."
# Échapper les simples quotes pour PostgreSQL
DB_PASS_ESC=$(echo "$DB_PASS" | sed "s/'/''/g")
sudo -u postgres psql -v ON_ERROR_STOP=1 <<EOSQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'canopee') THEN
    CREATE USER canopee WITH ENCRYPTED PASSWORD '$DB_PASS_ESC';
  ELSE
    ALTER USER canopee WITH PASSWORD '$DB_PASS_ESC';
  END IF;
END
\$\$;
EOSQL
sudo -u postgres psql -c "CREATE DATABASE canopee OWNER canopee" 2>/dev/null || true
sudo -u postgres psql -d canopee -v ON_ERROR_STOP=1 -c "GRANT ALL ON SCHEMA public TO canopee; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO canopee;"

# 4. Mettre à jour le .env (remplacer uniquement DATABASE_URL)
echo "[3/6] Mise à jour du .env..."
if [ ! -f .env ]; then
  echo "Erreur: .env introuvable dans $(pwd)"
  exit 1
fi
# Encoder le mot de passe pour l'URL (caractères spéciaux)
ENCODED_PASS=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$DB_PASS''', safe=''))")
NEW_URL="DATABASE_URL=\"postgresql://canopee:${ENCODED_PASS}@localhost:5432/canopee?schema=public\""
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
(grep -v '^DATABASE_URL=' .env; echo "$NEW_URL") > .env.tmp && mv .env.tmp .env
echo "    DATABASE_URL mise à jour (sauvegarde .env.backup.* créée)."

# 5. Migrations Prisma
echo "[4/6] Application des migrations Prisma..."
npx prisma migrate deploy

# 6. Créer l'admin (email admin@canopee.be, mot de passe admin)
echo "[5/6] Création du compte admin (admin@canopee.be / admin)..."
node scripts/create-admin.js admin@canopee.be admin Admin Admin || true

# 7. Build et redémarrage PM2
echo "[6/6] Build et redémarrage de l'application..."
npm run build
pm2 restart canopee || pm2 start ecosystem.config.js
pm2 save 2>/dev/null || true

echo ""
echo "=============================================="
echo "  Terminé."
echo "=============================================="
echo "  Connexion : admin@canopee.be / admin"
echo "  Logs      : pm2 logs canopee"
echo "=============================================="
