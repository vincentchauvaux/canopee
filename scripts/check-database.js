const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log("\n🔍 Vérification de la base de données\n");
  console.log("═".repeat(60));
  console.log("📋 Configuration:");
  console.log(
    `   DATABASE_URL: ${
      process.env.DATABASE_URL ? "✅ Configuré" : "❌ Manquant"
    }`
  );

  if (!process.env.DATABASE_URL) {
    console.error("\n❌ DATABASE_URL non configuré dans .env");
    process.exit(1);
  }

  const isSupabase = process.env.DATABASE_URL.includes("supabase.co");
  console.log(`   Type: ${isSupabase ? "Supabase" : "PostgreSQL"}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || "non défini"}`);

  try {
    console.log("\n" + "═".repeat(60));
    console.log("🔌 Test de connexion...");

    // Test de connexion basique
    await prisma.$connect();
    console.log("✅ Connexion à la base de données réussie");

    console.log("\n" + "═".repeat(60));
    console.log("📊 Vérification des tables...");

    // Vérifier chaque table
    const tables = [
      { name: "users", model: prisma.user },
      { name: "classes", model: prisma.class },
      { name: "bookings", model: prisma.booking },
      { name: "news", model: prisma.news },
      { name: "comments", model: prisma.comment },
    ];

    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`   ✅ ${table.name}: ${count} enregistrement(s)`);
      } catch (error) {
        console.log(`   ❌ ${table.name}: ERREUR - ${error.message}`);
        if (
          error.code === "P2021" ||
          error.message.includes("does not exist")
        ) {
          console.log(`      → La table n'existe pas dans la base de données`);
          console.log(`      → Exécutez: npx prisma migrate deploy`);
        }
      }
    }

    console.log("\n" + "═".repeat(60));
    console.log("🧪 Test de requête sur classes...");

    try {
      const classes = await prisma.class.findMany({
        take: 5,
        include: {
          bookings: {
            select: {
              userId: true,
            },
          },
        },
      });
      console.log(`   ✅ Requête réussie: ${classes.length} cours trouvé(s)`);
    } catch (error) {
      console.log(`   ❌ Erreur lors de la requête: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      if (error.code === "P2021") {
        console.log("\n💡 Solution:");
        console.log("   La table 'classes' n'existe pas.");
        console.log("   Exécutez sur le VPS:");
        console.log("   cd /var/www/canopee");
        console.log("   npx prisma migrate deploy");
      } else if (error.code === "P1001") {
        console.log("\n💡 Problème de connexion:");
        console.log("   - Vérifiez DATABASE_URL dans .env");
        console.log("   - Vérifiez que l'IP n'est pas bloquée dans Supabase");
      }
    }

    console.log("\n" + "═".repeat(60));
    console.log("✅ Vérification terminée\n");
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    console.error("Code:", error.code);

    if (error.code === "P1001") {
      console.log("\n💡 Problème de connexion à la base de données");
      console.log("   - Vérifiez DATABASE_URL dans .env");
      console.log("   - Vérifiez que l'IP n'est pas bloquée dans Supabase");
      console.log('   - Testez: psql "$DATABASE_URL" -c "SELECT version();"');
    } else if (error.code === "P1008") {
      console.log("\n💡 Timeout de connexion");
      console.log("   - Ajoutez des paramètres à DATABASE_URL:");
      console.log("   &connection_limit=10&pool_timeout=20&connect_timeout=10");
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

