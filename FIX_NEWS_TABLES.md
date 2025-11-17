# Correction du problème des actualités

## Problème

Les erreurs 500 lors de la création/récupération des actualités sont causées par l'absence des tables `news` et `comments` dans la base de données Supabase.

## Solution

### Option 1 : Exécuter le script SQL dans Supabase (Recommandé)

1. **Accéder au SQL Editor de Supabase** :
   - Allez sur https://kzogkberupkzpjdojvhn.supabase.co
   - Connectez-vous
   - Cliquez sur **SQL Editor** dans le menu de gauche

2. **Copier et exécuter le script** :
   - Ouvrez le fichier `prisma/create_news_tables.sql`
   - Copiez tout le contenu
   - Collez-le dans l'éditeur SQL de Supabase
   - Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

3. **Vérifier que les tables sont créées** :
   - Dans Supabase, allez dans **Table Editor**
   - Vous devriez voir les tables `news` et `comments`

### Option 2 : Utiliser Prisma Studio (Alternative)

Si le script SQL ne fonctionne pas, vous pouvez essayer :

```bash
# Arrêter le serveur de développement
# Puis exécuter :
npx prisma studio
```

Dans Prisma Studio, vous pouvez voir si les tables existent et créer manuellement les enregistrements si nécessaire.

### Option 3 : Réessayer la migration

Parfois, réessayer la migration après quelques secondes fonctionne :

```bash
npx prisma migrate dev --name add_news_and_comments
```

Ou avec `db push` :

```bash
npx prisma db push --accept-data-loss
```

## Vérification

Après avoir créé les tables, redémarrez votre serveur de développement :

```bash
npm run dev
```

Puis essayez de créer une actualité depuis le panel admin. L'erreur devrait être résolue.

## Note

Le problème vient du fait que le schéma Prisma a été mis à jour pour inclure les modèles `News` et `Comment`, mais les tables correspondantes n'existent pas encore dans la base de données Supabase. Une fois les tables créées, tout devrait fonctionner correctement.

