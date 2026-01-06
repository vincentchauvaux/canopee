const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error(
      "\n❌ Usage: node scripts/reset-password.js <email> <new-password>"
    );
    console.error("\nExemple:");
    console.error(
      '  node scripts/reset-password.js etibaliomecus@live.be "mon-nouveau-mot-de-passe"'
    );
    process.exit(1);
  }

  console.log("\n" + "═".repeat(60));
  console.log("🔐 RÉINITIALISATION DU MOT DE PASSE");
  console.log("═".repeat(60));

  try {
    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, authProvider: true },
    });

    if (!user) {
      console.error(
        `\n❌ Utilisateur ${email} non trouvé dans la base de données`
      );
      console.error("\n💡 Solutions:");
      console.error("   1. Créer l'utilisateur via l'inscription sur le site");
      console.error("   2. Vérifier l'email dans Supabase");
      process.exit(1);
    }

    console.log(`\n✅ Utilisateur trouvé: ${user.email}`);
    console.log(`   Auth Provider actuel: ${user.authProvider}`);

    // Hasher le nouveau mot de passe
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        authProvider: "local",
      },
    });

    console.log("\n✅ Mot de passe réinitialisé avec succès");
    console.log("   Auth Provider mis à jour: local");
    console.log("\n💡 Vous pouvez maintenant vous connecter avec:");
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: (celui que vous venez de définir)`);
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    if (error.code === "P1001") {
      console.error("   Problème de connexion à la base de données");
      console.error("   Vérifiez DATABASE_URL dans .env");
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
