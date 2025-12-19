import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Fonction pour créer une nouvelle instance Prisma avec gestion d'erreurs
function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Fonction helper pour réessayer les requêtes en cas d'erreur de connexion
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Vérifier si c'est une erreur de connexion
      const isConnectionError =
        error?.code === "P1001" || // Cannot reach database server
        error?.code === "P1008" || // Operations timed out
        error?.code === "26000" || // prepared statement does not exist
        error?.message?.includes("prepared statement") ||
        error?.message?.includes("connection");

      if (isConnectionError && attempt < maxRetries) {
        console.warn(
          `Database connection error (attempt ${attempt}/${maxRetries}), retrying...`
        );

        // Attendre un peu avant de réessayer
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));

        // Tenter de reconnecter
        try {
          await prisma.$disconnect();
        } catch (e) {
          // Ignorer les erreurs de déconnexion
        }

        // Recréer le client si nécessaire
        if (globalForPrisma.prisma) {
          globalForPrisma.prisma = createPrismaClient();
        }

        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Fermer proprement la connexion à l'arrêt
if (process.env.NODE_ENV === "production") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });

  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
