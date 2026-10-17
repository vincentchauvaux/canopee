import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const isDev = process.env.NODE_ENV === "development";

// Fonction utilitaire pour récupérer la session dans les API routes
export async function getSessionFromRequest(request: NextRequest) {
  try {
    // Même nom de cookie que lib/auth.ts
    const cookieName = "next-auth.session-token";

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
      cookieName,
    });

    if (!token || !token.id) {
      return null;
    }

    // Rôle relu en DB (révocation admin sans attendre la reconnexion)
    let userRole = token.role as string;
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: { role: true },
      });
      if (dbUser) {
        userRole = dbUser.role;
      }
    } catch (error) {
      if (isDev) {
        console.error("[getSessionFromRequest] Error fetching user role:", error);
      }
    }

    return {
      user: {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: userRole,
      },
      expires:
        token.exp && typeof token.exp === "number"
          ? new Date(token.exp * 1000).toISOString()
          : "",
    };
  } catch (error) {
    console.error("[getSessionFromRequest] Error getting session:", error);
    return null;
  }
}
