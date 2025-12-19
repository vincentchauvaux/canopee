# Comment Modifier le fichier .env sur le VPS

## 🔐 Connexion au VPS

### Étape 1 : Se connecter au VPS via SSH

```bash
ssh ubuntu@vps-e09ed6db  # ou votre adresse IP
# ou
ssh ubuntu@[IP_DU_VPS]
```

## 📝 Méthodes pour Modifier le .env

### Méthode 1 : Éditeur Nano (Recommandé - Simple)

```bash
# Se placer dans le dossier du projet
cd /var/www/canopee

# Ouvrir le fichier .env avec nano
nano .env
```

**Commandes Nano :**
- `Ctrl + O` : Sauvegarder (puis appuyer sur `Enter`)
- `Ctrl + X` : Quitter
- `Ctrl + K` : Couper une ligne
- `Ctrl + U` : Coller
- `Ctrl + W` : Rechercher

**Exemple de modification :**
1. Ouvrir `nano .env`
2. Naviguer avec les flèches jusqu'à la ligne à modifier
3. Modifier la valeur
4. `Ctrl + O` pour sauvegarder
5. `Enter` pour confirmer
6. `Ctrl + X` pour quitter

### Méthode 2 : Éditeur Vim (Avancé)

```bash
cd /var/www/canopee
vim .env
```

**Commandes Vim :**
- `i` : Mode insertion (pour éditer)
- `Esc` : Sortir du mode insertion
- `:w` : Sauvegarder
- `:q` : Quitter
- `:wq` : Sauvegarder et quitter
- `:q!` : Quitter sans sauvegarder

### Méthode 3 : Éditeur Vi (Basique)

```bash
cd /var/www/canopee
vi .env
```

Mêmes commandes que Vim.

### Méthode 4 : Éditeur depuis le terminal local (VS Code)

Si vous avez VS Code avec l'extension Remote-SSH :

```bash
# Depuis votre machine locale
code --remote ssh-remote+ubuntu@vps-e09ed6db /var/www/canopee/.env
```

## 🔧 Modifications Courantes

### Modifier NEXTAUTH_URL

```bash
cd /var/www/canopee
nano .env

# Chercher la ligne :
# NEXTAUTH_URL="https://canopee.be"

# Modifier si nécessaire, puis sauvegarder
```

### Modifier NEXTAUTH_SECRET

```bash
cd /var/www/canopee
nano .env

# Chercher la ligne :
# NEXTAUTH_SECRET="..."

# Remplacer par un nouveau secret (généré avec openssl rand -base64 32)
```

### Ajouter une Variable

```bash
cd /var/www/canopee
nano .env

# Ajouter à la fin du fichier :
# NOUVELLE_VARIABLE="valeur"
```

### Modifier DATABASE_URL

```bash
cd /var/www/canopee
nano .env

# Chercher la ligne DATABASE_URL et modifier
# Attention : Échapper les caractères spéciaux dans le mot de passe
```

## ⚠️ Commandes Utiles Avant/Après Modification

### Avant de Modifier : Faire une Sauvegarde

```bash
cd /var/www/canopee

# Créer une copie de sauvegarde
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Ou simplement
cp .env .env.backup
```

### Vérifier le Contenu Actuel

```bash
# Afficher tout le fichier
cat .env

# Afficher seulement les variables NextAuth
cat .env | grep NEXTAUTH

# Afficher sans les commentaires
cat .env | grep -v "^#"
```

### Vérifier les Modifications

```bash
# Vérifier qu'une variable est correcte
cat .env | grep NEXTAUTH_URL

# Vérifier le format (doit afficher la valeur)
echo $NEXTAUTH_URL  # Ne fonctionnera pas, les variables ne sont pas chargées automatiquement
```

### Après Modification : Redémarrer l'Application

```bash
# Redémarrer PM2 pour charger les nouvelles variables
cd /var/www/canopee
pm2 restart canopee --update-env

# Ou simplement
pm2 restart canopee
```

### Vérifier que les Variables sont Chargées

```bash
# Vérifier les variables chargées par PM2
pm2 show canopee | grep -A 20 "env"

# Ou vérifier dans les logs
pm2 logs canopee --lines 10
```

## 🔒 Sécurité

### Permissions du Fichier .env

Le fichier `.env` doit être protégé :

```bash
cd /var/www/canopee

# Vérifier les permissions actuelles
ls -la .env

# Définir les bonnes permissions (lecture/écriture uniquement pour le propriétaire)
chmod 600 .env

# Vérifier
ls -la .env
# Doit afficher : -rw------- (600)
```

### Ne Jamais Commiter le .env

Vérifier que `.env` est dans `.gitignore` :

```bash
cd /var/www/canopee
cat .gitignore | grep .env
```

## 📋 Exemple Complet : Modifier NEXTAUTH_URL

```bash
# 1. Se connecter au VPS
ssh ubuntu@vps-e09ed6db

# 2. Aller dans le dossier du projet
cd /var/www/canopee

# 3. Faire une sauvegarde
cp .env .env.backup

# 4. Ouvrir le fichier
nano .env

# 5. Chercher la ligne NEXTAUTH_URL (Ctrl+W pour rechercher)
# 6. Modifier la valeur si nécessaire
# 7. Sauvegarder (Ctrl+O, Enter)
# 8. Quitter (Ctrl+X)

# 9. Vérifier la modification
cat .env | grep NEXTAUTH_URL

# 10. Redémarrer l'application
pm2 restart canopee --update-env

# 11. Vérifier les logs
pm2 logs canopee --lines 20
```

## 🚨 Problèmes Courants

### Problème : "Permission denied"

```bash
# Vérifier les permissions
ls -la .env

# Si nécessaire, changer le propriétaire
sudo chown ubuntu:ubuntu .env
chmod 600 .env
```

### Problème : "No such file or directory"

```bash
# Vérifier que vous êtes dans le bon dossier
pwd
# Doit afficher : /var/www/canopee

# Vérifier que le fichier existe
ls -la .env
```

### Problème : Les modifications ne sont pas prises en compte

```bash
# 1. Vérifier que le fichier est sauvegardé
cat .env | grep NEXTAUTH_URL

# 2. Redémarrer PM2 avec --update-env
pm2 restart canopee --update-env

# 3. Vérifier les logs pour voir si les variables sont chargées
pm2 logs canopee
```

## 💡 Astuces

### Rechercher une Variable Spécifique

```bash
# Rechercher NEXTAUTH_URL
grep "NEXTAUTH_URL" .env

# Rechercher toutes les variables NextAuth
grep "NEXTAUTH" .env
```

### Afficher Seulement les Variables (sans commentaires)

```bash
cat .env | grep -v "^#" | grep -v "^$"
```

### Copier le .env Local vers le VPS

```bash
# Depuis votre machine locale
scp .env ubuntu@vps-e09ed6db:/var/www/canopee/.env

# Puis sur le VPS, adapter les valeurs pour la production
```

### Exporter les Variables pour un Test

```bash
# Charger les variables dans la session actuelle
export $(cat .env | grep -v '^#' | xargs)

# Vérifier
echo $NEXTAUTH_URL
```

## 📖 Références

- [FIX_NEXTAUTH_404.md](./FIX_NEXTAUTH_404.md) - Résoudre l'erreur 404 NextAuth
- [VERIFICATION_ENV_VPS.md](./VERIFICATION_ENV_VPS.md) - Vérifier le .env VPS
- [ENV_SETUP.md](./ENV_SETUP.md) - Configuration des variables d'environnement


