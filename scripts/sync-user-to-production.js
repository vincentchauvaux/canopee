const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function syncUserToProduction() {
  const email = process.argv[2] || "etibaliomecus@live.be";
  const localDbUrl = process.argv[3] || process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL;
  const prodDbUrl = process.env.DATABASE_URL;

  console.log("\n" + "═".repeat(60));
  console.log("🔄 SYNCHRONISATION UTILISATEUR VERS PRODUCTION");
  console.log("═".repeat(60));

  console.log("\n📋 Configuration:");
  console.log(
    `   DATABASE_URL_LOCAL: ${
      localDbUrl ? "✅ Configuré" : "❌ Manquant"
    }`
  );
  console.log(
    `   DATABASE_URL (Production): ${
      prodDbUrl ? "✅ Configuré" : "❌ Manquant"
    }`
  );

  if (!localDbUrl || !prodDbUrl) {
    console.error("\n❌ Configuration manquante");
    if (!localDbUrl) {
      console.error("   DATABASE_URL_LOCAL ou DATABASE_URL non configuré");
    }
    if (!prodDbUrl) {
      console.error("   DATABASE_URL (production) non configuré");
    }
    console.error("\n💡 Usage:");
    console.error("   node scripts/sync-user-to-production.js <email> [DATABASE_URL_LOCAL]");
    console.error("\n   Ou configurez dans .env:");
    console.error("   DATABASE_URL_LOCAL=\"postgresql://...\" (base locale)");
    console.error("   DATABASE_URL=\"postgresql://...\" (Supabase production)");
    process.exit(1);
  }

  if (localDbUrl === prodDbUrl) {
    console.warn("\n⚠️  ATTENTION: DATABASE_URL_LOCAL et DATABASE_URL sont identiques");
    console.warn("   Assurez-vous que DATABASE_URL_LOCAL pointe vers votre base locale");
    console.warn("   et que DATABASE_URL pointe vers Supabase (production)");
  }

  const isSupabase = prodDbUrl.includes("supabase.co");
  console.log(
    `   Type Production: ${isSupabase ? "Supabase" : "PostgreSQL"}`
  );
  console.log(`   Email: ${email}`);

  // Créer les clients Prisma avec les URLs spécifiques
  const prismaLocal = new PrismaClient({
    datasources: {
      db: {
        url: localDbUrl,
      },
    },
  });

  const prismaProd = new PrismaClient({
    datasources: {
      db: {
        url: prodDbUrl,
      },
    },
  });

  try {
    // 1. Récupérer l'utilisateur depuis la base locale
    console.log("\n" + "═".repeat(60));
    console.log("📥 Récupération depuis la base locale...");

    await prismaLocal.$connect();
    console.log("✅ Connexion à la base locale réussie");

    const localUser = await prismaLocal.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        profilePic: true,
        authProvider: true,
        phone: true,
        dateOfBirth: true,
      },
    });

    if (!localUser) {
      console.error(`\n❌ Utilisateur ${email} non trouvé dans la base locale`);
      console.error("\n💡 Solutions:");
      console.error("   1. Vérifiez que vous êtes connecté en local");
      console.error("   2. Vérifiez l'email dans la base locale");
      console.error("   3. Vérifiez que DATABASE_URL_LOCAL pointe vers votre base locale");
      process.exit(1);
    }

    if (!localUser.passwordHash) {
      console.error(`\n❌ L'utilisateur local n'a pas de passwordHash`);
      console.error("   Impossible de synchroniser sans mot de passe");
      console.error("\n💡 Solutions:");
      console.error("   1. Réinitialisez le mot de passe en local");
      console.error("   2. Ou créez l'utilisateur directement en production via le site");
      process.exit(1);
    }

    console.log("\n✅ Utilisateur trouvé dans la base locale:");
    console.log(`   ID: ${localUser.id}`);
    console.log(`   Email: ${localUser.email}`);
    console.log(
      `   Nom: ${localUser.firstName || ""} ${localUser.lastName || ""}`
    );
    console.log(`   Rôle: ${localUser.role}`);
    console.log(`   Auth Provider: ${localUser.authProvider}`);
    console.log(`   PasswordHash: ${localUser.passwordHash ? "✅ Présent" : "❌ Absent"}`);

    // 2. Vérifier/Créer l'utilisateur dans la base de production
    console.log("\n" + "═".repeat(60));
    console.log("📤 Synchronisation vers la production...");

    await prismaProd.$connect();
    console.log("✅ Connexion à la base de production réussie");

    const prodUser = await prismaProd.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        authProvider: true,
      },
    });

    if (prodUser) {
      console.log("\n⚠️  Utilisateur existe déjà en production:");
      console.log(`   ID: ${prodUser.id}`);
      console.log(`   Rôle actuel: ${prodUser.role}`);
      console.log(`   Auth Provider: ${prodUser.authProvider}`);
      console.log(
        `   PasswordHash: ${prodUser.passwordHash ? "✅ Présent" : "❌ Absent"}`
      );

      console.log("\n🔄 Mise à jour de l'utilisateur en production...");
      await prismaProd.user.update({
        where: { email },
        data: {
          passwordHash: localUser.passwordHash,
          firstName: localUser.firstName,
          lastName: localUser.lastName,
          role: localUser.role,
          authProvider: localUser.authProvider,
          profilePic: localUser.profilePic,
          phone: localUser.phone,
          dateOfBirth: localUser.dateOfBirth,
        },
      });
      console.log("✅ Utilisateur mis à jour en production");
    } else {
      console.log("\n📝 Création de l'utilisateur en production...");
      await prismaProd.user.create({
        data: {
          email: localUser.email,
          passwordHash: localUser.passwordHash,
          firstName: localUser.firstName,
          lastName: localUser.lastName,
          role: localUser.role,
          authProvider: localUser.authProvider,
          profilePic: localUser.profilePic,
          phone: localUser.phone,
          dateOfBirth: localUser.dateOfBirth,
        },
      });
      console.log("✅ Utilisateur créé en production");
    }

    console.log("\n" + "═".repeat(60));
    console.log("✅ SYNCHRONISATION TERMINÉE");
    console.log("═".repeat(60));
    console.log("\n💡 Actions suivantes:");
    console.log("   1. Testez la connexion sur https://canopee.be/auth/signin");
    console.log("   2. Si l'erreur persiste, vérifiez les logs:");
    console.log("      pm2 logs canopee --err --lines 50");
    console.log("   3. Vérifiez NEXTAUTH_SECRET et NEXTAUTH_URL sur le VPS");
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    if (error.code === "P1001") {
      console.error("   Problème de connexion à la base de données");
      console.error("   Vérifiez DATABASE_URL dans .env");
      console.error("   Vérifiez que l'IP n'est pas bloquée dans Supabase");
    }
    process.exit(1);
  } finally {
    await prismaLocal.$disconnect();
    await prismaProd.$disconnect();
  }
}

syncUserToProduction();
