# Guide Étape par Étape : Fix Admin en Production

## 🎯 Objectif

Mettre à jour l'utilisateur `etibaliomecus@live.be` (Vincent Chauvaux) en admin dans la base de données Supabase de production.

## 📋 Étape 1 : Vérifier dans Supabase

### Option A : Via l'interface Supabase (Le plus simple)

1. **Accéder au dashboard Supabase** :

   - Ouvrez : https://kzogkberupkzpjdojvhn.supabase.co
   - Connectez-vous à votre compte

2. **Aller dans Table Editor** :

   - Cliquez sur **Table Editor** dans le menu de gauche
   - Sélectionnez la table **users**

3. **Chercher l'utilisateur** :

   - Utilisez la barre de recherche en haut
   - Tapez : `etibaliomecus@live.be`
   - Ou parcourez la liste

4. **Vérifier le rôle** :
   - Si l'utilisateur existe : regardez la colonne `role`
   - Si `role = 'user'` → **PASSEZ À L'ÉTAPE 2**
   - Si `role = 'admin'` → **PASSEZ À L'ÉTAPE 4** (vérification)
   - Si l'utilisateur n'existe pas → **PASSEZ À L'ÉTAPE 3**

---

## 🔧 Étape 2 : Mettre à jour le rôle en admin (via Supabase)

1. **Dans Table Editor** :

   - Cliquez sur la ligne de l'utilisateur `etibaliomecus@live.be`
   - Cliquez sur le champ `role`
   - Changez `user` en `admin`
   - Cliquez sur **Save** (ou appuyez sur Entrée)

2. **Vérification** :
   - Le champ `role` doit maintenant afficher `admin`
   - ✅ **PASSEZ À L'ÉTAPE 4**

---

## ➕ Étape 3 : Créer l'utilisateur (si il n'existe pas)

### Option A : Via le site web (Recommandé)

1. **S'inscrire sur le site** :

   - Allez sur : https://canopee.be/auth/signin
   - Cliquez sur "S'inscrire" ou "Créer un compte"
   - Utilisez l'email : `etibaliomecus@live.be`
   - Créez un mot de passe
   - Remplissez le formulaire (prénom : Vincent, nom : Chauvaux)

2. **Mettre à jour le rôle** :
   - Retournez dans Supabase Table Editor
   - Cherchez l'utilisateur que vous venez de créer
   - Changez `role` de `user` à `admin`
   - ✅ **PASSEZ À L'ÉTAPE 4**

### Option B : Via SQL (Si vous préférez)

1. **Dans Supabase** :

   - Allez dans **SQL Editor**
   - Créez une nouvelle requête

2. **Exécuter cette requête** :

   ```sql
   -- D'abord, vérifier si l'utilisateur existe
   SELECT id, email, "firstName", "lastName", role
   FROM users
   WHERE email = 'etibaliomecus@live.be';
   ```

3. **Si l'utilisateur n'existe pas** :
   - Vous devez d'abord vous inscrire via le site (Option A ci-dessus)
   - Puis mettre à jour le rôle

---

## ✅ Étape 4 : Vérifier et tester

### 4.1 Vérification dans Supabase

1. **Dans Table Editor** :
   - Vérifiez que l'utilisateur `etibaliomecus@live.be` existe
   - Vérifiez que `role = 'admin'`
   - Vérifiez que `email = 'etibaliomecus@live.be'`

### 4.2 Tester la connexion

1. **Déconnectez-vous du site** :

   - Allez sur https://canopee.be
   - Cliquez sur "Déconnexion" (si vous êtes connecté)

2. **Videz les cookies** :

   - Ouvrez les outils de développement (F12)
   - Allez dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)
   - Cliquez sur "Cookies" → `https://canopee.be`
   - Supprimez tous les cookies (ou juste `next-auth.session-token`)

3. **Reconnectez-vous** :

   - Allez sur https://canopee.be/auth/signin
   - Connectez-vous avec :
     - Email : `etibaliomecus@live.be`
     - Mot de passe : (votre mot de passe)

4. **Vérifier l'accès admin** :
   - Après connexion, vous devriez voir un lien "Admin" dans le header
   - Cliquez dessus ou allez sur : https://canopee.be/admin
   - Vous devriez voir le dashboard admin

---

## 🚨 Si ça ne fonctionne toujours pas

### Vérification 1 : Variables d'environnement sur le VPS

1. **Se connecter au VPS** :

   ```bash
   ssh votre-utilisateur@votre-vps-ovh
   ```

2. **Vérifier le fichier .env** :

   ```bash
   cd /var/www/canopee
   cat .env | grep NEXTAUTH
   ```

3. **Vérifier que** :
   - `NEXTAUTH_URL=https://canopee.be` (pas `http://localhost:3000`)
   - `NEXTAUTH_SECRET` est configuré

### Vérification 2 : Script de diagnostic

1. **Sur le VPS** :

   ```bash
   cd /var/www/canopee
   node scripts/diagnose-admin.js etibaliomecus@live.be
   ```

2. **Lire le résultat** :
   - Si l'utilisateur n'est pas trouvé → Retour à l'Étape 3
   - Si le rôle n'est pas admin → Retour à l'Étape 2
   - Si tout est OK → Vérifiez les variables d'environnement

### Vérification 3 : Redémarrer l'application

1. **Sur le VPS** :

   ```bash
   cd /var/www/canopee
   pm2 restart canopee
   pm2 logs canopee --lines 50
   ```

2. **Vérifier les logs** :
   - Cherchez des erreurs liées à l'authentification
   - Cherchez des erreurs de connexion à la base de données

---

## 📞 Résumé des Actions

✅ **Actions à faire maintenant** :

1. [ ] Aller sur https://kzogkberupkzpjdojvhn.supabase.co
2. [ ] Table Editor → users
3. [ ] Chercher `etibaliomecus@live.be`
4. [ ] Si existe : changer `role` de `user` à `admin`
5. [ ] Si n'existe pas : s'inscrire sur https://canopee.be/auth/signin puis mettre à jour le rôle
6. [ ] Déconnecter/reconnecter sur le site
7. [ ] Tester l'accès à https://canopee.be/admin

---

## 💡 Astuce

Si vous préférez utiliser SQL directement dans Supabase :

1. Allez dans **SQL Editor**
2. Exécutez :

   ```sql
   -- Vérifier
   SELECT id, email, "firstName", "lastName", role
   FROM users
   WHERE email = 'etibaliomecus@live.be';

   -- Mettre à jour
   UPDATE users
   SET role = 'admin'
   WHERE email = 'etibaliomecus@live.be';

   -- Vérifier après
   SELECT id, email, role
   FROM users
   WHERE email = 'etibaliomecus@live.be';
   ```

---

**Besoin d'aide ?** Dites-moi à quelle étape vous êtes bloqué ! 🚀



