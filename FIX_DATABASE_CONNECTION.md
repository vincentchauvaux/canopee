# Fix: Erreur "prepared statement does not exist"

## Problème

L'erreur `prepared statement "s36" does not exist` (code 26000) indique que Prisma essaie d'utiliser une connexion PostgreSQL qui a été fermée ou qui a expiré.

## Causes possibles

1. **Connexions Supabase qui expirent** - Supabase ferme les connexions inactives après un certain temps
2. **Pool de connexions mal configuré** - Pas assez de connexions ou timeout trop court
3. **Connexions persistantes** - Les connexions restent ouvertes trop longtemps

## Solutions

### Solution 1 : Améliorer la DATABASE_URL (Recommandé)

Ajoutez des paramètres de connexion à votre `DATABASE_URL` dans le fichier `.env` :

```bash
# Avant
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public"

# Après (avec paramètres de connexion)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public&connection_limit=10&pool_timeout=20&connect_timeout=10"
```

**Paramètres expliqués :**

- `connection_limit=10` - Nombre maximum de connexions dans le pool
- `pool_timeout=20` - Timeout en secondes pour obtenir une connexion du pool
- `connect_timeout=10` - Timeout en secondes pour établir une connexion

### Solution 2 : Vérifier la configuration Supabase

1. Allez sur votre dashboard Supabase
2. Vérifiez les paramètres de connexion
3. Assurez-vous que les connexions persistantes sont activées si nécessaire

### Solution 3 : Redémarrer l'application

Parfois, un simple redémarrage résout le problème :

```bash
# Sur le VPS
cd /var/www/canopee
pm2 restart canopee
```

### Solution 4 : Vérifier les logs

Surveillez les logs pour voir quand l'erreur se produit :

```bash
# Voir les logs en temps réel
pm2 logs canopee --err

# Voir les dernières erreurs
pm2 logs canopee --err --lines 50
```

## Modifications apportées

Le fichier `lib/prisma.ts` a été amélioré pour :

1. **Gérer automatiquement les erreurs de connexion** - Détecte les erreurs de connexion et réessaie automatiquement
2. **Fonction `withRetry`** - Permet de réessayer les requêtes en cas d'erreur
3. **Fermeture propre** - Ferme les connexions proprement à l'arrêt de l'application

## Utilisation de withRetry (optionnel)

Si vous voulez utiliser la fonction `withRetry` dans vos routes API pour plus de robustesse :

```typescript
import { prisma, withRetry } from '@/lib/prisma'

// Au lieu de :
const classes = await prisma.class.findMany({...})

// Utilisez :
const classes = await withRetry(() =>
  prisma.class.findMany({...})
)
```

## Vérification

Après avoir appliqué les corrections :

1. **Redémarrer l'application** :

   ```bash
   pm2 restart canopee
   ```

2. **Surveiller les logs** :

   ```bash
   pm2 logs canopee --err
   ```

3. **Tester l'application** - Vérifiez que les requêtes fonctionnent correctement

## Si le problème persiste

1. Vérifiez que votre `DATABASE_URL` est correcte
2. Vérifiez les limites de connexion Supabase
3. Augmentez `connection_limit` dans la DATABASE_URL
4. Contactez le support Supabase si nécessaire
