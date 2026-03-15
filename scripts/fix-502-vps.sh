#!/bin/bash
# À exécuter sur le VPS en cas de 502 Bad Gateway
# Usage: cd /var/www/canopee && bash scripts/fix-502-vps.sh

set -e
cd /var/www/canopee || { echo "Erreur: exécute depuis /var/www/canopee"; exit 1; }

echo "=== Correction 502 Bad Gateway ==="
echo ""

echo "[1/5] Arrêt de l'application..."
pm2 delete canopee 2>/dev/null || true
sleep 2

echo "[2/5] Build Next.js (peut prendre 1-2 min)..."
npm run build
if [ ! -f .next/prerender-manifest.json ]; then
  echo "Erreur: le build n'a pas créé .next/prerender-manifest.json"
  exit 1
fi

echo "[3/5] Démarrage avec PM2..."
pm2 start ecosystem.config.js
sleep 3

echo "[4/5] Vérification..."
if ! pm2 describe canopee >/dev/null 2>&1; then
  echo "Erreur: canopee n'est pas démarré"
  pm2 logs canopee --lines 20 --nostream
  exit 1
fi

# Vérifier que le port 3000 répond
if command -v curl &>/dev/null; then
  if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>/dev/null | grep -q "200\|301\|302"; then
    echo "    OK: l'app répond sur http://127.0.0.1:3000"
  else
    echo "    Attention: curl vers localhost:3000 n'a pas renvoyé 200. Vérifiez: pm2 logs canopee"
  fi
fi

echo "[5/5] Sauvegarde PM2..."
pm2 save 2>/dev/null || true

echo ""
echo "=== Terminé ==="
echo "  Site: https://canopee.be (ou xn--canope-fva.be)"
echo "  Logs: pm2 logs canopee"
echo "  Si 502 persiste: sudo nginx -t && sudo systemctl reload nginx"
echo ""
