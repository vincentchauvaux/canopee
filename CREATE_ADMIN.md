# Comment créer un utilisateur admin

## Méthode 1 : Via Prisma Studio (Le plus simple)

1. **Lancer Prisma Studio** :

```bash
npx prisma studio
```

2. **Ouvrir dans le navigateur** : http://localhost:5555

3. **Créer ou modifier un utilisateur** :
   - Si vous avez déjà un compte : Cliquez sur la table `users`, trouvez votre utilisateur, et changez le champ `role` de `user` à `admin`
   - Pour créer un nouvel admin : Cliquez sur "Add record", remplissez les champs et mettez `role` à `admin`

---

## Méthode 2 : Via SQL direct (psql)

1. **Se connecter à PostgreSQL** :

```bash
psql yoga_studio
```

2. **Mettre à jour un utilisateur existant** :

```sql
-- Remplacer 'votre-email@example.com' par votre email
UPDATE users
SET role = 'admin'
WHERE email = 'votre-email@example.com';
```

3. **Ou créer un nouvel utilisateur admin** :

```sql
-- Note: Vous devrez d'abord créer l'utilisateur via l'inscription sur le site
-- puis mettre à jour son rôle comme ci-dessus
```

---

## Méthode 3 : Via l'interface web puis SQL

1. **S'inscrire sur le site** : http://localhost:3000/auth/signin

   - Créez un compte normal avec email/mot de passe

2. **Mettre à jour le rôle en admin** :

```bash
psql yoga_studio
```

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'votre-email@example.com';
```

---

## Méthode 4 : Script Node.js (pour automatisation)

Créez un fichier `scripts/create-admin.js` :

```javascript
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2] || "admin@yogastudio.fr";
  const password = process.argv[3] || "admin123";
  const firstName = process.argv[4] || "Admin";
  const lastName = process.argv[5] || "User";

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Mettre à jour le rôle
      await prisma.user.update({
        where: { email },
        data: { role: "admin" },
      });
      console.log(`✅ Utilisateur ${email} mis à jour en admin`);
    } else {
      // Créer un nouvel utilisateur admin
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: "admin",
          authProvider: "local",
        },
      });
      console.log(`✅ Admin créé : ${email}`);
      console.log(`   Mot de passe : ${password}`);
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
```

Utilisation :

```bash
node scripts/create-admin.js admin@yogastudio.fr motdepasse123
```

---

## Vérification

Après avoir créé/mis à jour l'utilisateur admin :

1. **Déconnectez-vous** du site si vous êtes connecté
2. **Reconnectez-vous** avec l'email admin
3. **Vérifiez** que le lien "Admin" apparaît dans le header
4. **Accédez** à http://localhost:3000/admin

---

## Note importante

- Le mot de passe doit être hashé avec bcrypt (fait automatiquement lors de l'inscription)
- Si vous créez directement en SQL, vous devrez hasher le mot de passe manuellement
- La méthode Prisma Studio est la plus simple et la plus sûre
