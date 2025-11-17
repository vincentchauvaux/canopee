import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/get-session'

// GET - Récupérer tous les utilisateurs (admin uniquement)
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)

    // Debug temporaire
    if (!session) {
      console.log('[admin/users] No session found')
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const userRole = (session.user as any)?.role
    console.log('[admin/users] Session user:', {
      id: session.user?.id,
      email: session.user?.email,
      role: userRole,
    })

    if (userRole !== 'admin') {
      console.log('[admin/users] User is not admin, role:', userRole)
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePic: true,
        authProvider: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = await prisma.user.count()

    return NextResponse.json({
      users,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}

