const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function checkUserRole() {
  const email = process.argv[2] || "etibaliomecus@live.be";

  console.log("\n🔍 Vérification du rôle utilisateur\n");
  console.log("📋 Configuration:");
  console.log(
    `   DATABASE_URL: ${
      process.env.DATABASE_URL ? "✅ Configuré" : "❌ Manquant"
    }`
  );
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || "❌ Manquant"}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || "non défini"}`);

  try {
    console.log(`\n👤 Recherche de l'utilisateur: ${email}`);
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        authProvider: true,
        createdAt: true,
      },
    });

    if (!user) {
      console.log(
        `\n❌ Utilisateur ${email} NON TROUVÉ dans la base de données`
      );
      console.log(`\n💡 Solutions:`);
      console.log(`   1. Créer l'utilisateur via le site (inscription)`);
      console.log(`   2. Puis exécuter: node scripts/create-admin.js ${email}`);
      console.log(`\n   Ou via Supabase SQL Editor:`);
      console.log(
        `   UPDATE users SET role = 'admin' WHERE email = '${email}';`
      );
      process.exit(1);
    }

    console.log(`\n✅ Utilisateur trouvé:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nom: ${user.firstName || ""} ${user.lastName || ""}`);
    console.log(`   Rôle: ${user.role}`);
    console.log(`   Auth Provider: ${user.authProvider}`);
    console.log(`   Créé le: ${user.createdAt}`);

    if (user.role !== "admin") {
      console.log(`\n⚠️  PROBLÈME: L'utilisateur n'est PAS admin`);
      console.log(`\n💡 Solution:`);
      console.log(`   node scripts/create-admin.js ${email}`);
      console.log(`\n   Ou via Supabase SQL Editor:`);
      console.log(
        `   UPDATE users SET role = 'admin' WHERE email = '${email}';`
      );
    } else {
      console.log(`\n✅ L'utilisateur est bien admin`);
      console.log(`\n💡 Si vous avez toujours des erreurs 403:`);
      console.log(`   1. Déconnectez-vous du site`);
      console.log(`   2. Videz les cookies du navigateur`);
      console.log(`   3. Reconnectez-vous pour régénérer le token JWT`);
      console.log(
        `   4. Vérifiez que NEXTAUTH_URL et NEXTAUTH_SECRET sont corrects`
      );
    }
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    if (
      error.message.includes("Can't reach database server") ||
      error.code === "P1001"
    ) {
      console.log("\n💡 Problème de connexion à la base de données");
      console.log("   Vérifiez DATABASE_URL dans .env");
      console.log("   Vérifiez que l'IP n'est pas bloquée dans Supabase");
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRole();
