import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// Fonction utilitaire pour récupérer la session dans les API routes
// Utilise getToken qui est plus fiable dans les API routes Next.js 14
export async function getSessionFromRequest(request: NextRequest) {
  try {
    // Log des headers pour diagnostiquer
    const cookieHeader = request.headers.get('cookie');
    const hostHeader = request.headers.get('host');
    console.log("[getSessionFromRequest] Request info:", {
      host: hostHeader,
      hasCookie: !!cookieHeader,
      cookieLength: cookieHeader?.length || 0,
      hasNextAuthCookie: cookieHeader?.includes('next-auth.session-token') || false,
    });

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.id) {
      console.log("[getSessionFromRequest] No token or token.id");
      console.log("[getSessionFromRequest] Token value:", token ? "exists but no id" : "null");
      console.log("[getSessionFromRequest] NEXTAUTH_SECRET configured:", !!process.env.NEXTAUTH_SECRET);
      console.log("[getSessionFromRequest] NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "not set");
      
      // Log supplémentaire si le cookie est présent mais non lu
      if (cookieHeader?.includes('next-auth.session-token')) {
        console.log("[getSessionFromRequest] WARNING: Cookie present but token is null - possible domain mismatch");
        console.log("[getSessionFromRequest] Cookie domain might not match NEXTAUTH_URL");
      }
      
      return null;
    }

    console.log("[getSessionFromRequest] Token found:", {
      id: token.id,
      email: token.email,
      roleFromToken: token.role,
    });

    // Récupérer le rôle depuis la DB pour s'assurer qu'il est à jour
    let userRole = token.role as string;
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: { role: true },
      });
      if (dbUser) {
        console.log("[getSessionFromRequest] Role from DB:", dbUser.role);
        userRole = dbUser.role;
      } else {
        console.log(
          "[getSessionFromRequest] User not found in DB for id:",
          token.id
        );
      }
    } catch (error) {
      console.error("[getSessionFromRequest] Error fetching user role:", error);
      // Utiliser le rôle du token en fallback
    }

    console.log("[getSessionFromRequest] Final role:", userRole);

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
