#!/usr/bin/env python3
"""
Script pour se connecter au VPS et corriger les problèmes automatiquement
"""

import subprocess
import sys
import os

VPS_HOST = "ubuntu@51.178.44.114"
VPS_PASSWORD = "H2usmpssneaky"
VPS_COMMANDS = """
cd /var/www/canopee && \
echo "📋 Étape 1: Vérification du statut des migrations" && \
npx prisma migrate status || echo "⚠️  Continuer quand même..." && \
echo "" && \
echo "📋 Étape 2: Application des migrations" && \
npx prisma migrate deploy && \
echo "" && \
echo "📋 Étape 3: Génération du client Prisma" && \
npx prisma generate && \
echo "" && \
echo "📋 Étape 4: Vérification de la base de données" && \
node scripts/check-database.js || echo "⚠️  Vérification échouée" && \
echo "" && \
echo "📋 Étape 5: Redémarrage de l'application" && \
pm2 restart canopee || echo "⚠️  PM2 non disponible" && \
echo "" && \
echo "✅ Correction terminée!"
"""

def main():
    print("🔧 Connexion au VPS et correction automatique...")
    print("=" * 60)
    print()
    
    # Vérifier si sshpass est disponible
    try:
        subprocess.run(["which", "sshpass"], check=True, capture_output=True)
        use_sshpass = True
    except subprocess.CalledProcessError:
        use_sshpass = False
        print("⚠️  sshpass n'est pas installé")
        print("   Installation de sshpass...")
        try:
            # Essayer d'installer sshpass (nécessite sudo)
            subprocess.run(["brew", "install", "sshpass"], check=True)
            use_sshpass = True
            print("✅ sshpass installé")
        except:
            print("❌ Impossible d'installer sshpass automatiquement")
            print()
            print("📝 Alternative: Exécutez manuellement ces commandes:")
            print()
            print(f"ssh {VPS_HOST}")
            print("# Mot de passe: {VPS_PASSWORD}")
            print()
            print("Puis exécutez:")
            print(VPS_COMMANDS)
            return
    
    if use_sshpass:
        print(f"🔌 Connexion à {VPS_HOST}...")
        print()
        
        # Construire la commande ssh avec sshpass
        ssh_command = [
            "sshpass", "-p", VPS_PASSWORD,
            "ssh", "-o", "StrictHostKeyChecking=no",
            "-o", "UserKnownHostsFile=/dev/null",
            VPS_HOST,
            VPS_COMMANDS
        ]
        
        try:
            result = subprocess.run(
                ssh_command,
                check=True,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            print(result.stdout)
            if result.stderr:
                print("Erreurs:", result.stderr)
        except subprocess.CalledProcessError as e:
            print(f"❌ Erreur lors de l'exécution: {e}")
            print(f"Stdout: {e.stdout}")
            print(f"Stderr: {e.stderr}")
            sys.exit(1)

if __name__ == "__main__":
    main()

