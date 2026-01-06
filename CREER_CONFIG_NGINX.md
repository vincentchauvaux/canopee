# 🔧 Créer la configuration Nginx pour canopée.be

## ❌ Problème

Le fichier de configuration Nginx n'existe pas :
```
cat: /etc/nginx/sites-available/canopee: No such file or directory
```

## ✅ Solution : Créer la configuration Nginx

### Étape 1 : Vérifier les fichiers existants

```bash
# Sur le VPS
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/
```

### Étape 2 : Créer la configuration Nginx

Créez le fichier de configuration avec le domaine réel `canopée.be` (avec accent) :

```bash
# Sur le VPS
sudo nano /etc/nginx/sites-available/canopee
```

Collez cette configuration :

```nginx
server {
    listen 80;
    server_name canopée.be www.canopée.be;

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
```

**Important** : Utilisez `canopée.be` (avec accent) car c'est votre domaine réel.

Sauvegardez avec `Ctrl+O`, puis `Ctrl+X`.

### Étape 3 : Activer le site

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/canopee /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t
```

Si la configuration est valide, vous verrez :
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Étape 4 : Recharger Nginx

```bash
# Recharger Nginx
sudo systemctl reload nginx

# Ou redémarrer si nécessaire
sudo systemctl restart nginx
```

### Étape 5 : Vérifier que Nginx fonctionne

```bash
# Vérifier le statut
sudo systemctl status nginx

# Vérifier que le site est actif
sudo nginx -T | grep "server_name"
```

Vous devriez voir `canopée.be` dans la sortie.

## 🔒 Configuration SSL (optionnel, mais recommandé)

Si vous avez déjà un certificat SSL, ajoutez la configuration HTTPS :

```bash
# Vérifier si le certificat existe
ls -la /etc/letsencrypt/live/canopée.be/
```

Si le certificat existe, modifiez la configuration :

```bash
sudo nano /etc/nginx/sites-available/canopee
```

Ajoutez un bloc `server` pour HTTPS :

```nginx
server {
    listen 80;
    server_name canopée.be www.canopée.be;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name canopée.be www.canopée.be;

    ssl_certificate /etc/letsencrypt/live/canopée.be/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/canopée.be/privkey.pem;

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
```

Puis testez et rechargez :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 📋 Commandes complètes (copier-coller)

```bash
# 1. Créer le fichier de configuration
sudo nano /etc/nginx/sites-available/canopee
# → Collez la configuration ci-dessus
# → Sauvegardez (Ctrl+O, puis Ctrl+X)

# 2. Activer le site
sudo ln -s /etc/nginx/sites-available/canopee /etc/nginx/sites-enabled/

# 3. Tester la configuration
sudo nginx -t

# 4. Recharger Nginx
sudo systemctl reload nginx

# 5. Vérifier
sudo systemctl status nginx
```

## ⚠️ Important

- Utilisez `canopée.be` (avec accent) dans `server_name` car c'est votre domaine réel
- Nginx gère automatiquement la conversion entre `canopée.be` et `xn--canope-fva.be` (Punycode)
- Après avoir créé/modifié la configuration, testez toujours avec `sudo nginx -t` avant de recharger

