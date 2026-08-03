#!/bin/bash

# Vérifie et corrige la séparation PM2 Canopée (ubuntu) / streamtv (root) sur le VPS.
# Usage: ssh ubuntu@51.178.44.114 'bash -s' < scripts/fix-pm2-vps.sh

set -e

CANOPEE_DIR="/var/www/canopee"

echo "🔍 Diagnostic PM2 Canopée / streamtv"
echo "===================================="

echo ""
echo "1. PM2 ubuntu (Canopée attendu)"
pm2 list || true

echo ""
echo "2. PM2 root (streamtv attendu, pas canopee)"
ROOT_HAS_CANOPEE=0
if sudo pm2 list 2>/dev/null | grep -q canopee; then
  echo "❌ canopee détecté dans PM2 root"
  ROOT_HAS_CANOPEE=1
else
  echo "✅ canopee absent du PM2 root"
fi
sudo pm2 list || true

echo ""
echo "3. Ports 3000 / 3001"
sudo ss -tlnp | grep -E ':3000|:3001' || echo "(aucun listener)"

if [ "$ROOT_HAS_CANOPEE" -eq 1 ]; then
  echo ""
  echo "🔧 Suppression de canopee du PM2 root..."
  sudo pm2 delete canopee 2>/dev/null || true
  sudo pm2 save
fi

if ! pm2 list 2>/dev/null | grep -q canopee; then
  echo ""
  echo "🔧 Démarrage de canopee sous PM2 ubuntu..."
  if [ -f "$CANOPEE_DIR/ecosystem.config.js" ]; then
    cd "$CANOPEE_DIR"
    pm2 start ecosystem.config.js
    pm2 save
  else
    echo "❌ $CANOPEE_DIR/ecosystem.config.js introuvable"
    exit 1
  fi
fi

if ! sudo pm2 list 2>/dev/null | grep -q streamtv; then
  echo ""
  echo "⚠️  streamtv absent du PM2 root — tentative de démarrage"
  if sudo test -f /root/streamtv/ecosystem.config.js; then
    sudo bash -c 'cd /root/streamtv && pm2 start ecosystem.config.js'
    sudo pm2 save
  else
    echo "   /root/streamtv/ecosystem.config.js introuvable — action manuelle requise"
  fi
fi

echo ""
echo "📊 État final"
pm2 list || true
sudo pm2 list || true
sudo ss -tlnp | grep -E ':3000|:3001' || true

echo ""
echo "✅ Diagnostic terminé"
echo "   Canopée  → PM2 ubuntu, port 3000"
echo "   streamtv → PM2 root,   port 3001"
echo "   Déploiements Canopée : SSH ubuntu, jamais sudo pm2 pour canopee"
