import { NextRequest, NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session";

// GET - Récupérer tous les cours (avec filtres optionnels)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");

    const where: any = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        try {
          where.date.gte = new Date(startDate);
        } catch (e) {
          console.error("Invalid startDate:", startDate, e);
          return NextResponse.json(
            { error: "Date de début invalide" },
            { status: 400 }
          );
        }
      }
      if (endDate) {
        try {
          where.date.lte = new Date(endDate);
        } catch (e) {
          console.error("Invalid endDate:", endDate, e);
          return NextResponse.json(
            { error: "Date de fin invalide" },
            { status: 400 }
          );
        }
      }
    }

    if (type) {
      where.type = type;
    }

    // Utiliser withRetry pour gérer les problèmes de connexion
    const classes = await withRetry(async () => {
      return await prisma.class.findMany({
        where,
        include: {
          bookings: {
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    });

    // Formater les données pour inclure le nombre de réservations
    const formattedClasses = classes.map((cls) => ({
      ...cls,
      currentParticipants: cls.bookings.length,
      isBooked: false, // Sera déterminé côté client si l'utilisateur est connecté
    }));

    return NextResponse.json(formattedClasses);
  } catch (error: any) {
    console.error("Error fetching classes:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });

    // Retourner un message d'erreur plus détaillé en développement
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Erreur lors de la récupération des cours: ${
            error?.message || "Erreur inconnue"
          }`
        : "Erreur lors de la récupération des cours";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - Créer un nouveau cours (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json(
        {
          error:
            "Non autorisé. Vous devez être administrateur pour créer un cours.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      color,
      startTime,
      endTime,
      date,
      instructor,
      maxParticipants,
    } = body;

    // Validation basique
    if (!title || !type || !startTime || !endTime || !date || !instructor) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        title,
        description: description || null,
        type,
        color: color || "#264E36",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        date: new Date(date),
        instructor,
        maxParticipants: maxParticipants || 20,
        currentParticipants: 0,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du cours" },
      { status: 500 }
    );
  }
}
