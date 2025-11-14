import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/get-session'

// GET - Récupérer toutes les réservations (admin uniquement)
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)

    // Debug temporaire
    if (!session) {
      console.log('[admin/bookings] No session found')
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const userRole = (session.user as any)?.role
    console.log('[admin/bookings] Session user:', {
      id: session.user?.id,
      email: session.user?.email,
      role: userRole,
    })

    if (userRole !== 'admin') {
      console.log('[admin/bookings] User is not admin, role:', userRole)
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const bookings = await prisma.booking.findMany({
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        class: {
          select: {
            id: true,
            title: true,
            type: true,
            date: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: {
        bookedAt: 'desc',
      },
    })

    const total = await prisma.booking.count()

    return NextResponse.json({
      bookings,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    )
  }
}

