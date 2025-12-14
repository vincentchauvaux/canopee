const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function diagnose() {
  const email = process.argv[2] || "etibaliomecus@live.be";

  console.log("\n🔍 Diagnostic Admin - Production\n");
  console.log("═".repeat(60));
  console.log("📋 Configuration:");
  console.log(
    `   DATABASE_URL: ${
      process.env.DATABASE_URL ? "✅ Configuré" : "❌ Manquant"
    }`
  );
  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL;
    const isSupabase = dbUrl.includes("supabase.co");
    console.log(`   Type: ${isSupabase ? "Supabase" : "PostgreSQL"}`);
  }
  console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || "❌ Manquant"}`);
  console.log(
    `   NEXTAUTH_SECRET: ${
      process.env.NEXTAUTH_SECRET ? "✅ Configuré" : "❌ Manquant"
    }`
  );
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
      console.log(`   2. Puis exécuter: node scripts/create-admin.js ${email}`);
      console.log("\n   Ou via Supabase SQL Editor:");
      console.log(
        `   UPDATE users SET role = 'admin' WHERE email = '${email}';`
      );
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

    console.log("\n" + "═".repeat(60));
    if (user.role !== "admin") {
      console.log("⚠️  PROBLÈME: L'utilisateur n'est PAS admin");
      console.log("\n💡 Solution:");
      console.log(`   node scripts/create-admin.js ${email}`);
      console.log("\n   Ou via Supabase SQL Editor:");
      console.log(
        `   UPDATE users SET role = 'admin' WHERE email = '${email}';`
      );
      console.log("\n   Après la mise à jour:");
      console.log("   1. Déconnectez-vous du site");
      console.log("   2. Videz les cookies du navigateur");
      console.log("   3. Reconnectez-vous");
    } else {
      console.log("✅ L'utilisateur est bien admin");
      console.log("\n💡 Si vous avez toujours des erreurs 403:");
      console.log("   1. Déconnectez-vous du site");
      console.log("   2. Videz les cookies du navigateur");
      console.log("   3. Reconnectez-vous");
      console.log(
        "   4. Vérifiez que NEXTAUTH_URL est correct (https://canopee.be)"
      );
      console.log("   5. Vérifiez que NEXTAUTH_SECRET est identique");
    }

    // Vérifier les autres admins
    console.log("\n" + "═".repeat(60));
    console.log("👥 Autres administrateurs:");
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (admins.length === 0) {
      console.log("   ⚠️  Aucun administrateur trouvé dans la base de données");
    } else {
      admins.forEach((admin) => {
        console.log(
          `   - ${admin.email} (${admin.firstName || ""} ${
            admin.lastName || ""
          })`.trim()
        );
      });
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
      console.log('   Testez: psql "$DATABASE_URL" -c "SELECT version();"');
    } else if (error.code === "P1008" || error.message.includes("timeout")) {
      console.log("\n💡 Timeout de connexion");
      console.log("   Vérifiez les paramètres de connexion dans DATABASE_URL");
      console.log(
        "   Ajoutez: &connection_limit=10&pool_timeout=20&connect_timeout=10"
      );
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n" + "═".repeat(60));
  console.log("✅ Diagnostic terminé\n");
}

diagnose();
