#!/bin/bash

# Script de configuration de la base de données PostgreSQL

echo "🚀 Configuration de PostgreSQL pour Canopée"
echo ""

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "📦 Installation de PostgreSQL via Homebrew..."
    brew install postgresql@14
    
    echo "🔧 Démarrage du service PostgreSQL..."
    brew services start postgresql@14
    
    # Attendre que PostgreSQL soit prêt
    sleep 3
fi

# Vérifier si la base de données existe
DB_NAME="yoga_studio"
DB_USER=$(whoami)

echo "📊 Vérification de la base de données..."

# Créer la base de données si elle n'existe pas
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "✅ La base de données '$DB_NAME' existe déjà"
else
    echo "📝 Création de la base de données '$DB_NAME'..."
    createdb $DB_NAME
    echo "✅ Base de données créée avec succès"
fi

# Afficher la connexion string
echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📋 URL de connexion à ajouter dans votre fichier .env :"
echo "DATABASE_URL=\"postgresql://$DB_USER@localhost:5432/$DB_NAME?schema=public\""
echo ""
echo "🔧 Prochaines étapes :"
echo "1. Créez un fichier .env à la racine du projet"
echo "2. Ajoutez la DATABASE_URL ci-dessus"
echo "3. Exécutez : npx prisma generate"
echo "4. Exécutez : npx prisma migrate dev --name init"

