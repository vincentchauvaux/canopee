#!/usr/bin/env node

/**
 * Script pour comparer les fichiers .env local et VPS
 * Aide à identifier les différences qui pourraient causer des problèmes
 */

const fs = require("fs");
const path = require("path");

// Variables critiques pour NextAuth
const CRITICAL_VARS = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "DATABASE_URL",
  "NODE_ENV",
  "NEXT_PUBLIC_DOMAIN",
];

// Variables optionnelles mais importantes
const OPTIONAL_VARS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FACEBOOK_CLIENT_ID",
  "FACEBOOK_CLIENT_SECRET",
  "PORT",
];

function parseEnvFile(content) {
  const vars = {};
  const lines = content.split("\n");

  for (const line of lines) {
    // Ignorer les commentaires et lignes vides
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Parser les variables
    const match = trimmed.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      const key = match[1];
      let value = match[2];

      // Retirer les guillemets si présents
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      vars[key] = value;
    }
  }

  return vars;
}

function compareEnvs(localEnv, vpsEnv) {
  console.log("\n🔍 Comparaison des fichiers .env\n");
  console.log("=".repeat(60));

  // Vérifier les variables critiques
  console.log("\n📋 Variables Critiques (NextAuth):");
  console.log("-".repeat(60));

  const issues = [];

  for (const varName of CRITICAL_VARS) {
    const local = localEnv[varName];
    const vps = vpsEnv[varName];

    if (!local && !vps) {
      console.log(`❌ ${varName}: MANQUANT dans les deux environnements`);
      issues.push(`${varName} manquant`);
    } else if (!local) {
      console.log(`⚠️  ${varName}: MANQUANT en local`);
      issues.push(`${varName} manquant en local`);
    } else if (!vps) {
      console.log(`⚠️  ${varName}: MANQUANT sur le VPS`);
      issues.push(`${varName} manquant sur VPS`);
    } else {
      // Comparer les valeurs (masquer les secrets)
      if (varName.includes("SECRET") || varName.includes("PASSWORD")) {
        const localShort = local.substring(0, 10) + "...";
        const vpsShort = vps.substring(0, 10) + "...";
        if (local === vps) {
          console.log(`✅ ${varName}: Identique (${localShort})`);
        } else {
          console.log(`⚠️  ${varName}: DIFFÉRENT`);
          console.log(`   Local:  ${localShort}`);
          console.log(`   VPS:    ${vpsShort}`);
          issues.push(`${varName} différent entre local et VPS`);
        }
      } else {
        if (local === vps) {
          console.log(`✅ ${varName}: Identique`);
          console.log(`   Valeur: ${local}`);
        } else {
          console.log(`⚠️  ${varName}: DIFFÉRENT`);
          console.log(`   Local:  ${local}`);
          console.log(`   VPS:   ${vps}`);

          // Vérifications spécifiques
          if (varName === "NEXTAUTH_URL") {
            if (vps.includes("localhost") || vps.includes("http://")) {
              issues.push(
                "NEXTAUTH_URL sur VPS ne doit pas contenir localhost ou http://"
              );
            }
            if (!vps.startsWith("https://")) {
              issues.push("NEXTAUTH_URL sur VPS doit commencer par https://");
            }
          }

          if (varName === "NODE_ENV") {
            if (vps !== "production") {
              issues.push('NODE_ENV sur VPS doit être "production"');
            }
          }
        }
      }
    }
  }

  // Vérifier les variables optionnelles
  console.log("\n📋 Variables Optionnelles (OAuth):");
  console.log("-".repeat(60));

  for (const varName of OPTIONAL_VARS) {
    const local = localEnv[varName];
    const vps = vpsEnv[varName];

    if (local && vps) {
      if (varName.includes("SECRET") || varName.includes("PASSWORD")) {
        const localShort = local.substring(0, 10) + "...";
        const vpsShort = vps.substring(0, 10) + "...";
        if (local === vps) {
          console.log(`✅ ${varName}: Identique (${localShort})`);
        } else {
          console.log(`⚠️  ${varName}: DIFFÉRENT`);
        }
      } else {
        if (local === vps) {
          console.log(`✅ ${varName}: Identique`);
        } else {
          console.log(`⚠️  ${varName}: DIFFÉRENT`);
        }
      }
    } else if (local && !vps) {
      console.log(`ℹ️  ${varName}: Présent en local, absent sur VPS`);
    } else if (!local && vps) {
      console.log(`ℹ️  ${varName}: Présent sur VPS, absent en local`);
    }
  }

  // Résumé
  console.log("\n📊 Résumé:");
  console.log("=".repeat(60));

  if (issues.length === 0) {
    console.log("✅ Aucun problème détecté dans les variables critiques");
  } else {
    console.log(`⚠️  ${issues.length} problème(s) détecté(s):`);
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }

  // Recommandations spécifiques pour le problème 404
  console.log(
    "\n🔧 Recommandations pour résoudre l'erreur 404 /api/auth/signin:"
  );
  console.log("-".repeat(60));

  if (!vpsEnv.NEXTAUTH_URL || vpsEnv.NEXTAUTH_URL.includes("localhost")) {
    console.log('❌ NEXTAUTH_URL sur VPS doit être "https://canopee.be"');
  }

  if (!vpsEnv.NEXTAUTH_SECRET) {
    console.log("❌ NEXTAUTH_SECRET manquant sur le VPS");
  }

  if (vpsEnv.NODE_ENV !== "production") {
    console.log('⚠️  NODE_ENV devrait être "production" sur le VPS');
  }

  console.log("\n💡 Commandes à exécuter sur le VPS:");
  console.log("   1. Vérifier .env: cat /var/www/canopee/.env | grep NEXTAUTH");
  console.log("   2. Rebuild: cd /var/www/canopee && npm run build");
  console.log("   3. Redémarrer: pm2 restart canopee");
  console.log("   4. Vérifier les logs: pm2 logs canopee --lines 50");

  console.log("\n");
}

// Point d'entrée
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: node compare-env.js <fichier-local> <fichier-vps>");
  console.log("\nExemple:");
  console.log("  node compare-env.js .env .env.vps");
  console.log("\nOu collez le contenu du .env VPS dans un fichier .env.vps");
  process.exit(1);
}

const localPath = path.resolve(args[0]);
const vpsPath = path.resolve(args[1]);

if (!fs.existsSync(localPath)) {
  console.error(`❌ Fichier local introuvable: ${localPath}`);
  process.exit(1);
}

if (!fs.existsSync(vpsPath)) {
  console.error(`❌ Fichier VPS introuvable: ${vpsPath}`);
  console.log("\n💡 Créez un fichier .env.vps avec le contenu du .env du VPS");
  process.exit(1);
}

const localContent = fs.readFileSync(localPath, "utf-8");
const vpsContent = fs.readFileSync(vpsPath, "utf-8");

const localEnv = parseEnvFile(localContent);
const vpsEnv = parseEnvFile(vpsContent);

compareEnvs(localEnv, vpsEnv);
