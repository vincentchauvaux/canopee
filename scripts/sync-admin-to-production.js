const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function syncAdmin() {
  const email = process.argv[2] || "etibaliomecus@live.be";
  const firstName = process.argv[3] || "Vincent";
  const lastName = process.argv[4] || "Chauvaux";

  console.log("\n🔄 Synchronisation Admin vers Production\n");
  console.log("═".repeat(60));
  console.log("📋 Configuration:");
  console.log(
    `   DATABASE_URL: ${
      process.env.DATABASE_URL ? "✅ Configuré" : "❌ Manquant"
    }`
  );

  if (!process.env.DATABASE_URL) {
    console.error("\n❌ DATABASE_URL non configuré dans .env");
    console.log(
      "   Configurez DATABASE_URL pour pointer vers Supabase (production)"
    );
    process.exit(1);
  }

  const isSupabase = process.env.DATABASE_URL.includes("supabase.co");
  console.log(
    `   Type: ${isSupabase ? "Supabase (Production)" : "PostgreSQL"}`
  );
  console.log(`   Email: ${email}`);
  console.log(`   Nom: ${firstName} ${lastName}`);

  try {
    console.log("\n" + "═".repeat(60));
    console.log(`🔍 Recherche de l'utilisateur: ${email}`);

    await prisma.$connect();
    console.log("✅ Connexion à la base de données réussie");

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        passwordHash: true,
      },
    });

    if (existingUser) {
      console.log("\n✅ Utilisateur trouvé:");
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(
        `   Nom: ${existingUser.firstName || ""} ${existingUser.lastName || ""}`
      );
      console.log(`   Rôle actuel: ${existingUser.role}`);

      if (existingUser.role === "admin") {
        console.log("\n✅ L'utilisateur est déjà admin");
        console.log("   Aucune action nécessaire");
      } else {
        console.log("\n🔄 Mise à jour du rôle en admin...");
        await prisma.user.update({
          where: { email },
          data: {
            role: "admin",
            firstName: firstName || existingUser.firstName,
            lastName: lastName || existingUser.lastName,
          },
        });
        console.log("✅ Utilisateur mis à jour en admin");
        console.log("\n💡 Actions suivantes:");
        console.log("   1. Déconnectez-vous du site");
        console.log("   2. Videz les cookies du navigateur");
        console.log("   3. Reconnectez-vous pour régénérer le token JWT");
      }
    } else {
      console.log("\n⚠️  Utilisateur non trouvé");
      console.log("\n💡 L'utilisateur doit d'abord être créé via le site:");
      console.log(
        `   1. Aller sur ${
          process.env.NEXTAUTH_URL || "https://canopee.be"
        }/auth/signin`
      );
      console.log(`   2. S'inscrire avec l'email: ${email}`);
      console.log(
        `   3. Puis réexécuter ce script: node scripts/sync-admin-to-production.js ${email} ${firstName} ${lastName}`
      );
      console.log("\n   Ou créer directement avec un mot de passe:");
      console.log(
        `   node scripts/create-admin.js ${email} VOTRE_MOT_DE_PASSE "${firstName}" "${lastName}"`
      );
    }
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    if (
      error.code === "P1001" ||
      error.message.includes("Can't reach database server")
    ) {
      console.log("\n💡 Problème de connexion à la base de données");
      console.log("   Vérifiez DATABASE_URL dans .env");
      console.log("   Vérifiez que l'IP n'est pas bloquée dans Supabase");
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n" + "═".repeat(60));
  console.log("✅ Synchronisation terminée\n");
}

syncAdmin();


