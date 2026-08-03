#!/bin/bash

# Script pour corriger les problèmes en production sur le VPS
# Usage: ssh ubuntu@51.178.44.114 'bash -s' < scripts/fix-production-vps.sh

set -e  # Arrêter en cas d'erreur

echo "🔧 Correction des problèmes en production"
echo "========================================"
echo ""

# Aller dans le dossier du projet
cd /var/www/canopee || {
    echo "❌ Erreur: Le dossier /var/www/canopee n'existe pas"
    exit 1
}

echo "✅ Dossier du projet trouvé: $(pwd)"
echo ""

# Vérifier que .env existe
if [ ! -f .env ]; then
    echo "❌ Erreur: Le fichier .env n'existe pas"
    exit 1
fi

echo "✅ Fichier .env trouvé"
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Erreur: Node.js n'est pas installé"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Vérifier Prisma
if ! command -v npx &> /dev/null; then
    echo "❌ Erreur: npx n'est pas disponible"
    exit 1
fi

echo "✅ npx disponible"
echo ""

# Étape 1: Vérifier le statut des migrations
echo "📋 Étape 1: Vérification du statut des migrations Prisma"
echo "--------------------------------------------------------"
npx prisma migrate status || {
    echo "⚠️  Avertissement: Erreur lors de la vérification du statut"
    echo "   Continuons quand même..."
}
echo ""

# Étape 2: Appliquer les migrations
echo "📋 Étape 2: Application des migrations Prisma"
echo "---------------------------------------------"
npx prisma migrate deploy || {
    echo "❌ Erreur lors de l'application des migrations"
    echo "   Vérifiez les logs ci-dessus"
    exit 1
}
echo "✅ Migrations appliquées avec succès"
echo ""

# Étape 3: Générer le client Prisma
echo "📋 Étape 3: Génération du client Prisma"
echo "---------------------------------------"
npx prisma generate || {
    echo "❌ Erreur lors de la génération du client Prisma"
    exit 1
}
echo "✅ Client Prisma généré avec succès"
echo ""

# Étape 4: Vérifier la base de données
echo "📋 Étape 4: Vérification de la base de données"
echo "----------------------------------------------"
node scripts/check-database.js || {
    echo "⚠️  Avertissement: Erreur lors de la vérification"
    echo "   Mais continuons..."
}
echo ""

# Étape 5: Redémarrer l'application PM2 (ubuntu uniquement)
echo "📋 Étape 5: Redémarrage de l'application"
echo "---------------------------------------"
if command -v pm2 &> /dev/null; then
    if sudo pm2 list 2>/dev/null | grep -q canopee; then
        echo "⚠️  canopee détecté dans PM2 root — suppression pour éviter conflit port 3000"
        sudo pm2 delete canopee 2>/dev/null || true
        sudo pm2 save 2>/dev/null || true
    fi

    pm2 restart canopee || pm2 start ecosystem.config.js
    pm2 save
    echo "✅ Application redémarrée (PM2 ubuntu)"
    echo ""

    echo "📊 Statut de l'application:"
    pm2 status canopee || true
else
    echo "⚠️  PM2 n'est pas installé ou l'application n'est pas gérée par PM2"
    echo "   Redémarrez manuellement l'application"
fi
echo ""

# Étape 6: Vérifier les logs récents
echo "📋 Étape 6: Vérification des logs récents"
echo "----------------------------------------"
if command -v pm2 &> /dev/null; then
    echo "Dernières lignes des logs:"
    pm2 logs canopee --lines 20 --nostream || true
fi
echo ""

echo "✅ Correction terminée!"
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Vérifiez que l'API fonctionne: curl https://canopee.be/api/classes"
echo "   2. Vérifiez les logs: pm2 logs canopee"
echo "   3. Testez l'application dans le navigateur"



