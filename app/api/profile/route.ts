import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/get-session'

// GET - Récupérer le profil de l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    // Log pour diagnostiquer
    console.log('[API Profile] Request headers:', {
      host: request.headers.get('host'),
      cookie: request.headers.get('cookie') ? 'present' : 'missing',
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
    });

    const session = await getSessionFromRequest(request)

    if (!session) {
      console.log('[API Profile] No session found, returning 401');
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    console.log('[API Profile] Session found:', { userId: session.user.id, email: session.user.email });

    const userId = (session.user as any).id

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
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour le profil de l'utilisateur connecté
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const body = await request.json()

    const updateData: any = {}

    if (body.firstName !== undefined) updateData.firstName = body.firstName || null
    if (body.lastName !== undefined) updateData.lastName = body.lastName || null
    if (body.phone !== undefined) updateData.phone = body.phone || null
    if (body.dateOfBirth !== undefined) {
      updateData.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null
    }
    if (body.profilePic !== undefined) updateData.profilePic = body.profilePic || null

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
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}

