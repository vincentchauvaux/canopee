const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function diagnoseTenantError() {
  console.log("\n" + "═".repeat(60));
  console.log("🔍 DIAGNOSTIC : Erreur 'Tenant or user not found'");
  console.log("═".repeat(60));

  // Vérifier DATABASE_URL
  console.log("\n📋 Vérification de la configuration:");
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL non configuré dans .env");
    console.log("\n💡 Solution:");
    console.log("   1. Créez un fichier .env à la racine du projet");
    console.log("   2. Ajoutez DATABASE_URL avec votre connection string Supabase");
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;
  console.log(`   ✅ DATABASE_URL: Configuré`);

  // Vérifier le format
  const isSupabase = dbUrl.includes("supabase.co");
  console.log(`   Type: ${isSupabase ? "Supabase" : "PostgreSQL"}`);

  if (isSupabase) {
    // Extraire des informations de l'URL
    try {
      const urlMatch = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
      if (urlMatch) {
        const [, user, password, host, port, database] = urlMatch;
        console.log(`   Host: ${host}`);
        console.log(`   User: ${user}`);
        console.log(`   Password: ${password ? "***" + password.slice(-3) : "❌ Manquant"}`);
        console.log(`   Database: ${database.split("?")[0]}`);
      }
    } catch (e) {
      // Ignorer les erreurs d'extraction
    }
  }

  // Tester la connexion
  console.log("\n" + "═".repeat(60));
  console.log("🔌 Test de connexion...");

  try {
    await prisma.$connect();
    console.log("✅ Connexion réussie !");
    console.log("\n💡 Si vous voyez cette erreur ailleurs, le problème peut être:");
    console.log("   - Cache de connexion Prisma");
    console.log("   - Redémarrez l'application: pm2 restart canopee");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur de connexion:", error.message);

    if (
      error.message.includes("Tenant or user not found") ||
      error.message.includes("FATAL: Tenant or user not found")
    ) {
      console.log("\n" + "═".repeat(60));
      console.log("🔴 PROBLÈME IDENTIFIÉ : Tenant or user not found");
      console.log("═".repeat(60));

      console.log("\n📝 Causes possibles:");
      console.log("   1. ❌ Mot de passe incorrect dans DATABASE_URL");
      console.log("   2. ❌ Mot de passe Supabase changé sans mise à jour .env");
      console.log("   3. ❌ Caractères spéciaux dans le mot de passe non encodés");
      console.log("   4. ❌ Format incorrect de DATABASE_URL");

      console.log("\n✅ Solutions:");
      console.log("\n   1. Récupérer la connection string depuis Supabase:");
      console.log("      → https://kzogkberupkzpjdojvhn.supabase.co");
      console.log("      → Settings → Database → Connection string (URI)");
      console.log("      → Copiez l'URL complète");

      console.log("\n   2. Vérifier le format:");
      console.log("      postgresql://postgres:[PASSWORD]@db.kzogkberupkzpjdojvhn.supabase.co:5432/postgres?schema=public");

      console.log("\n   3. Si le mot de passe contient des caractères spéciaux:");
      console.log("      @ → %40");
      console.log("      # → %23");
      console.log("      % → %25");
      console.log("      & → %26");
      console.log("      ? → %3F");

      console.log("\n   4. Mettre à jour .env sur le VPS:");
      console.log("      cd /var/www/canopee");
      console.log("      nano .env");
      console.log("      # Modifiez DATABASE_URL avec le bon mot de passe");
      console.log("      # Sauvegardez: Ctrl+O, puis Ctrl+X");

      console.log("\n   5. Tester la connexion:");
      console.log('      psql "$DATABASE_URL" -c "SELECT version();"');

      console.log("\n   6. Redémarrer l'application:");
      console.log("      pm2 restart canopee");

      console.log("\n   7. Vérifier les logs:");
      console.log("      pm2 logs canopee --lines 20");

      console.log("\n📖 Guide complet: Voir FIX_TENANT_NOT_FOUND.md");
    } else if (error.code === "P1001") {
      console.log("\n💡 Problème de connexion réseau");
      console.log("   - Vérifiez que l'IP du VPS n'est pas bloquée dans Supabase");
      console.log("   - Vérifiez votre connexion internet");
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

diagnoseTenantError();

