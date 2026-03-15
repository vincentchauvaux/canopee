# Fix : Erreur "prepared statement already exists" et déconnexion impossible

## Symptômes

- Dans les logs PM2 : `ConnectorError ... PostgresError { code: "42P05", message: "prepared statement \"s2\" already exists" }`
- Erreur lors du callback JWT : `Error fetching user role in JWT callback`
- **Impossible de se déconnecter** : après avoir cliqué sur "Déconnexion", on semble rester connecté ou être "reconnecté" automatiquement

## Cause

1. **Prisma et le pooler Supabase (PgBouncer)** : en mode transaction, le pooler ne gère pas correctement les prepared statements de Prisma, ce qui déclenche l’erreur 42P05.
2. **Callback JWT** : le code appelait la base à **chaque requête** pour rafraîchir le rôle. En cas d’erreur Prisma, la session devenait incohérente et la déconnexion ne se faisait pas correctement.

## Corrections appliquées dans le code

- **`lib/auth.ts`** : suppression de l’appel Prisma à chaque requête dans le callback JWT. Le rôle est désormais pris depuis le token (mis à jour à la connexion) ; plus d’appel DB à chaque chargement de page, donc plus d’erreur 42P05 sur la session et déconnexion qui fonctionne.

## À faire sur le VPS (recommandé)

Pour éviter toute erreur "prepared statement" sur les **autres** appels Prisma (connexion, OAuth, etc.), ajoutez `pgbouncer=true` à votre `DATABASE_URL` dans le `.env` du VPS.

### Si vous utilisez le pooler Supabase (port 6543)

Ajoutez `&pgbouncer=true` à la fin de l’URL (avant, après ou à la place d’autres paramètres) :

```env
# Avant (exemple)
DATABASE_URL="postgresql://postgres.xxx:xxx@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?schema=public"

# Après
DATABASE_URL="postgresql://postgres.xxx:xxx@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?schema=public&pgbouncer=true"
```

### Si vous utilisez la connexion directe (port 5432)

Avec une URL du type `db.xxx.supabase.co:5432`, le paramètre `pgbouncer=true` n’est en général **pas** nécessaire. Si l’erreur 42P05 apparaît quand même, vous pouvez tester en ajoutant `&pgbouncer=true`.

### Après modification du .env sur le VPS

```bash
cd /var/www/canopee
# Éditer .env puis :
pm2 restart canopee
pm2 logs canopee --lines 20
```

## Vérification

1. Se connecter au site, puis cliquer sur "Déconnexion" → vous devez être redirigé et ne plus être connecté.
2. Les logs ne doivent plus afficher `prepared statement "s2" already exists` ni `Error fetching user role in JWT callback`.

## Références

- [Supabase – Error: prepared statement "XXX" already exists](https://supabase.com/docs/guides/troubleshooting/error-prepared-statement-xxx-already-exists-3laqeM)
- [Prisma – Configure Prisma Client with PgBouncer](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer)
