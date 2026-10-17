import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session";
import { isSafeImageUrl } from "@/lib/sanitize-html";

// GET - Récupérer le profil de l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePic: true,
        phone: true,
        dateOfBirth: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        authProvider: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 },
    );
  }
}

// PATCH - Mettre à jour le profil de l'utilisateur connecté
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (body.firstName !== undefined) {
      updateData.firstName =
        typeof body.firstName === "string"
          ? body.firstName.slice(0, 80) || null
          : null;
    }
    if (body.lastName !== undefined) {
      updateData.lastName =
        typeof body.lastName === "string"
          ? body.lastName.slice(0, 80) || null
          : null;
    }
    if (body.phone !== undefined) {
      updateData.phone =
        typeof body.phone === "string" ? body.phone.slice(0, 40) || null : null;
    }
    if (body.dateOfBirth !== undefined) {
      updateData.dateOfBirth = body.dateOfBirth
        ? new Date(body.dateOfBirth)
        : null;
    }
    if (body.profilePic !== undefined) {
      if (body.profilePic && !isSafeImageUrl(body.profilePic)) {
        return NextResponse.json(
          {
            error:
              "Photo de profil invalide (formats acceptés : URL https ou image JPEG/PNG/WebP/GIF ≤ ~500 Ko)",
          },
          { status: 400 },
        );
      }
      updateData.profilePic = body.profilePic || null;
    }

    // Jamais autoriser l'élévation de rôle via cette route
    delete (updateData as { role?: unknown }).role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePic: true,
        phone: true,
        dateOfBirth: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        authProvider: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 },
    );
  }
}
