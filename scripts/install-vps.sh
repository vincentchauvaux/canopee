#!/bin/bash

# ============================================
# Script d'installation automatique - Canopée
# ============================================
# Ce script installe et configure automatiquement
# l'application Canopée sur un VPS OVH (Ubuntu 22.04)
#
# Usage: sudo bash install-vps.sh
# ============================================

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que le script est exécuté en root
if [ "$EUID" -ne 0 ]; then 
    error "Veuillez exécuter ce script en tant que root (sudo bash install-vps.sh)"
    exit 1
fi

info "🚀 Démarrage de l'installation de Canopée sur le VPS..."

# ============================================
# ÉTAPE 1 : Mise à jour du système
# ============================================
info "📦 Mise à jour du système..."
apt update && apt upgrade -y
success "Système mis à jour"

# ============================================
# ÉTAPE 2 : Installation de Node.js 18+
# ============================================
info "📦 Installation de Node.js 18..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        success "Node.js $(node -v) est déjà installé"
    else
        warning "Node.js version $NODE_VERSION détectée, installation de la version 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt install -y nodejs
    fi
else
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

# Vérification
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
success "Node.js $NODE_VERSION et npm $NPM_VERSION installés"

# ============================================
# ÉTAPE 3 : Installation de PM2
# ============================================
info "📦 Installation de PM2..."
if command -v pm2 &> /dev/null; then
    success "PM2 est déjà installé ($(pm2 -v))"
else
    npm install -g pm2
    success "PM2 installé"
fi

# ============================================
# ÉTAPE 4 : Installation de Nginx
# ============================================
info "📦 Installation de Nginx..."
if command -v nginx &> /dev/null; then
    success "Nginx est déjà installé"
else
    apt install -y nginx
    success "Nginx installé"
fi

# ============================================
# ÉTAPE 5 : Installation de Git
# ============================================
info "📦 Installation de Git..."
if command -v git &> /dev/null; then
    success "Git est déjà installé"
else
    apt install -y git
    success "Git installé"
fi

# ============================================
# ÉTAPE 6 : Création du répertoire de l'application
# ============================================
APP_DIR="/var/www/canopee"
info "📁 Création du répertoire $APP_DIR..."
mkdir -p $APP_DIR
success "Répertoire créé"

# ============================================
# ÉTAPE 7 : Clonage du repository (si pas déjà fait)
# ============================================
if [ -d "$APP_DIR/.git" ]; then
    warning "Le repository est déjà cloné dans $APP_DIR"
    info "Pour mettre à jour, exécutez: cd $APP_DIR && git pull"
else
    info "📥 Clonage du repository GitHub..."
    read -p "URL du repository GitHub (défaut: git@github.com:vincentchauvaux/canopee.git): " REPO_URL
    REPO_URL=${REPO_URL:-"git@github.com:vincentchauvaux/canopee.git"}
    
    cd $APP_DIR
    git clone $REPO_URL .
    success "Repository cloné"
fi

# ============================================
# ÉTAPE 8 : Installation des dépendances
# ============================================
info "📦 Installation des dépendances npm..."
cd $APP_DIR
npm install
success "Dépendances installées"

# ============================================
# ÉTAPE 9 : Configuration des variables d'environnement
# ============================================
info "⚙️  Configuration des variables d'environnement..."
if [ -f "$APP_DIR/.env" ]; then
    warning "Le fichier .env existe déjà"
    read -p "Voulez-vous le remplacer ? (o/N): " REPLACE_ENV
    if [[ ! $REPLACE_ENV =~ ^[Oo]$ ]]; then
        info "Conservation du fichier .env existant"
    else
        rm $APP_DIR/.env
    fi
fi

if [ ! -f "$APP_DIR/.env" ]; then
    info "Création du fichier .env..."
    
    # Générer NEXTAUTH_SECRET
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    echo ""
    info "Veuillez fournir les informations suivantes :"
    echo ""
    read -p "DATABASE_URL (Supabase) [postgresql://postgres:...@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public]: " DATABASE_URL
    read -p "NEXTAUTH_URL [https://canopee.be]: " NEXTAUTH_URL
    NEXTAUTH_URL=${NEXTAUTH_URL:-"https://canopee.be"}
    read -p "GOOGLE_CLIENT_ID (optionnel, laissez vide si non utilisé): " GOOGLE_CLIENT_ID
    read -p "GOOGLE_CLIENT_SECRET (optionnel): " GOOGLE_CLIENT_SECRET
    read -p "FACEBOOK_CLIENT_ID (optionnel, laissez vide si non utilisé): " FACEBOOK_CLIENT_ID
    read -p "FACEBOOK_CLIENT_SECRET (optionnel): " FACEBOOK_CLIENT_SECRET
    
    # Créer le fichier .env
    cat > $APP_DIR/.env << EOF
# Base de données Supabase
DATABASE_URL="$DATABASE_URL"

# NextAuth
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="$NEXTAUTH_URL"

# OAuth Google (optionnel)
GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET"

# OAuth Facebook (optionnel)
FACEBOOK_CLIENT_ID="$FACEBOOK_CLIENT_ID"
FACEBOOK_CLIENT_SECRET="$FACEBOOK_CLIENT_SECRET"

# Environnement
NODE_ENV="production"
NEXT_PUBLIC_DOMAIN="canopee.be"
EOF
    
    success "Fichier .env créé"
    info "NEXTAUTH_SECRET généré automatiquement: $NEXTAUTH_SECRET"
fi

# ============================================
# ÉTAPE 10 : Génération Prisma et migrations
# ============================================
info "🗄️  Génération du client Prisma..."
cd $APP_DIR
npx prisma generate
success "Client Prisma généré"

info "🗄️  Application des migrations de base de données..."
npx prisma migrate deploy
success "Migrations appliquées"

# ============================================
# ÉTAPE 11 : Build de l'application
# ============================================
info "🔨 Build de l'application Next.js..."
cd $APP_DIR
npm run build
success "Application buildée"

# ============================================
# ÉTAPE 12 : Configuration PM2
# ============================================
info "⚙️  Configuration de PM2..."
cd $APP_DIR

# Arrêter l'application si elle tourne déjà
pm2 delete canopee 2>/dev/null || true

# Démarrer l'application
pm2 start ecosystem.config.js
pm2 save
pm2 startup

success "Application démarrée avec PM2"
info "Pour voir les logs: pm2 logs canopee"
info "Pour voir le statut: pm2 status"

# ============================================
# ÉTAPE 13 : Configuration Nginx
# ============================================
info "⚙️  Configuration de Nginx..."

# Supprimer la config par défaut
rm -f /etc/nginx/sites-enabled/default

# Créer la configuration pour canopee.be
cat > /etc/nginx/sites-available/canopee << 'NGINX_CONFIG'
server {
    listen 80;
    server_name canopee.be www.canopee.be;

    # Redirection HTTPS (sera activée après installation SSL)
    # return 301 https://$server_name$request_uri;

    # Logs
    access_log /var/log/nginx/canopee-access.log;
    error_log /var/log/nginx/canopee-error.log;

    # Taille maximale des uploads
    client_max_body_size 10M;

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

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINX_CONFIG

# Activer le site
ln -sf /etc/nginx/sites-available/canopee /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Recharger Nginx
systemctl reload nginx

success "Nginx configuré"

# ============================================
# ÉTAPE 14 : Installation SSL (optionnel)
# ============================================
echo ""
read -p "Voulez-vous installer le certificat SSL avec Let's Encrypt maintenant ? (O/n): " INSTALL_SSL
INSTALL_SSL=${INSTALL_SSL:-"O"}

if [[ $INSTALL_SSL =~ ^[Oo]$ ]]; then
    info "🔐 Installation de Certbot..."
    apt install -y certbot python3-certbot-nginx
    
    info "🔐 Génération du certificat SSL..."
    certbot --nginx -d canopee.be -d www.canopee.be --non-interactive --agree-tos --email admin@canopee.be || {
        warning "L'installation SSL a échoué. Vous pouvez la faire manuellement plus tard avec:"
        info "sudo certbot --nginx -d canopee.be -d www.canopee.be"
    }
    
    # Tester le renouvellement automatique
    certbot renew --dry-run
    
    success "SSL configuré"
else
    info "Installation SSL ignorée. Pour l'installer plus tard:"
    info "sudo apt install -y certbot python3-certbot-nginx"
    info "sudo certbot --nginx -d canopee.be -d www.canopee.be"
fi

# ============================================
# RÉSUMÉ FINAL
# ============================================
echo ""
echo "============================================"
success "✅ Installation terminée avec succès !"
echo "============================================"
echo ""
info "📋 Prochaines étapes :"
echo ""
echo "1. 🌍 Configurer le DNS dans OVH :"
echo "   - Allez dans Domaines → canopee.be → Zone DNS"
echo "   - Modifiez l'enregistrement A pour pointer vers l'IP de ce VPS"
echo "   - IP actuelle du VPS: $(curl -s ifconfig.me 2>/dev/null || echo 'Non disponible')"
echo ""
echo "2. ✅ Vérifier que l'application tourne :"
echo "   - pm2 status"
echo "   - pm2 logs canopee"
echo ""
echo "3. 🌐 Tester l'application :"
echo "   - http://$(curl -s ifconfig.me 2>/dev/null || echo 'IP_DU_VPS'):3000 (direct)"
echo "   - https://canopee.be (après configuration DNS)"
echo ""
echo "4. 📊 Commandes utiles :"
echo "   - Voir les logs: pm2 logs canopee"
echo "   - Redémarrer: pm2 restart canopee"
echo "   - Arrêter: pm2 stop canopee"
echo "   - Voir le statut: pm2 status"
echo ""
echo "5. 🔄 Pour mettre à jour l'application :"
echo "   cd $APP_DIR"
echo "   git pull"
echo "   npm install"
echo "   npx prisma migrate deploy"
echo "   npm run build"
echo "   pm2 restart canopee"
echo ""
echo "============================================"
success "🎉 Installation complète !"
echo "============================================"


