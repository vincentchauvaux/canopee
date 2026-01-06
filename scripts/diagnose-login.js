const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const prisma = new PrismaClient();

async function diagnoseLogin() {
  const email = process.argv[2] || "etibaliomecus@live.be";

  console.log("\n" + "═".repeat(60));
  console.log("🔍 DIAGNOSTIC DE CONNEXION");
  console.log("═".repeat(60));

  console.log("\n📋 Configuration:");
  console.log(
    `   DATABASE_URL: ${
      process.env.DATABASE_URL ? "✅ Configuré" : "❌ Manquant"
    }`
  );
  console.log(
    `   NEXTAUTH_SECRET: ${
      process.env.NEXTAUTH_SECRET ? "✅ Configuré" : "❌ Manquant"
    }`
  );
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || "❌ Manquant"}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || "non défini"}`);

  try {
    console.log("\n" + "═".repeat(60));
    console.log(`👤 Recherche de l'utilisateur: ${email}`);

    // Test de connexion
    await prisma.$connect();
    console.log("✅ Connexion à la base de données réussie");

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        authProvider: true,
        passwordHash: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      console.log(
        `\n❌ Utilisateur ${email} NON TROUVÉ dans la base de données`
      );
      console.log("\n" + "═".repeat(60));
      console.log("💡 Solutions:");
      console.log("   1. Créer l'utilisateur via le site:");
      console.log(
        `      - Aller sur ${
          process.env.NEXTAUTH_URL || "https://canopee.be"
        }/auth/signin`
      );
      console.log("      - S'inscrire avec cet email");
      process.exit(1);
    }

    console.log("\n✅ Utilisateur trouvé:");
    console.log("   ID:", user.id);
    console.log("   Email:", user.email);
    console.log(
      "   Nom:",
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Non défini"
    );
    console.log("   Rôle:", user.role);
    console.log("   Auth Provider:", user.authProvider);
    console.log("   Créé le:", user.createdAt.toISOString());
    console.log(
      "   Dernière connexion:",
      user.lastLogin ? user.lastLogin.toISOString() : "Jamais"
    );

    // Vérifier le passwordHash
    console.log("\n" + "═".repeat(60));
    console.log("🔐 Vérification du mot de passe:");
    if (!user.passwordHash) {
      console.log(
        "❌ PROBLÈME: L'utilisateur n'a PAS de passwordHash"
      );
      console.log(
        "   Cela signifie qu'il a été créé via OAuth (Google/Facebook)"
      );
      console.log("\n💡 Solutions:");
      console.log("   1. Réinitialiser le mot de passe:");
      console.log("      node scripts/reset-password.js " + email);
      console.log("   2. Ou se connecter via Google/Facebook");
      process.exit(1);
    } else {
      console.log("✅ L'utilisateur a un passwordHash");
      console.log("   Longueur du hash:", user.passwordHash.length);
    }

    // Vérifier NEXTAUTH_SECRET
    console.log("\n" + "═".repeat(60));
    console.log("🔑 Vérification NEXTAUTH_SECRET:");
    if (!process.env.NEXTAUTH_SECRET) {
      console.log("❌ PROBLÈME: NEXTAUTH_SECRET n'est pas défini");
      console.log("\n💡 Solution:");
      console.log("   Générer un secret: openssl rand -base64 32");
      console.log("   Ajouter dans .env: NEXTAUTH_SECRET=\"...\"");
      process.exit(1);
    } else {
      console.log("✅ NEXTAUTH_SECRET est configuré");
      console.log("   Longueur:", process.env.NEXTAUTH_SECRET.length);
    }

    console.log("\n" + "═".repeat(60));
    console.log("✅ DIAGNOSTIC TERMINÉ");
    console.log("═".repeat(60));
    console.log("\n💡 Si vous avez toujours des erreurs 401:");
    console.log("   1. Vérifiez que le mot de passe est correct");
    console.log("   2. Vérifiez les logs serveur pour plus de détails");
    console.log("   3. Vérifiez que NEXTAUTH_URL correspond à votre domaine");
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    if (error.code === "P1001") {
      console.error("   Problème de connexion à la base de données");
      console.error("   Vérifiez DATABASE_URL");
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseLogin();

