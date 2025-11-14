import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/get-session'

// GET - Récupérer les réservations de l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)

    // Si l'utilisateur n'est pas connecté, retourner un tableau vide
    // au lieu d'une erreur 401 pour éviter les erreurs dans la console
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json([])
    }

    const userId = (session.user as any).id

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        class: true,
      },
      orderBy: {
        bookedAt: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    )
  }
}

// POST - Créer une réservation
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { classId } = body

    if (!classId) {
      return NextResponse.json(
        { error: 'ID du cours requis' },
        { status: 400 }
      )
    }

    // Vérifier si le cours existe et s'il y a de la place
    const classItem = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        bookings: true,
      },
    })

    if (!classItem) {
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier s'il y a de la place
    if (classItem.bookings.length >= classItem.maxParticipants) {
      return NextResponse.json(
        { error: 'Le cours est complet' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur a déjà réservé ce cours
    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Vous avez déjà réservé ce cours' },
        { status: 400 }
      )
    }

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        userId,
        classId,
      },
      include: {
        class: true,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    
    // Gérer l'erreur de contrainte unique
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Vous avez déjà réservé ce cours' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la réservation' },
      { status: 500 }
    )
  }
}

