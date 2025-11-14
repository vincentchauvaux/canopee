import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/get-session'

// GET - Récupérer un cours spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (!classItem) {
      return NextResponse.json(
        { error: 'Cours non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...classItem,
      currentParticipants: classItem.bookings.length,
    })
  } catch (error) {
    console.error('Error fetching class:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du cours' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un cours (admin uniquement)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request)

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    await prisma.class.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Cours supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting class:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du cours' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour un cours (admin uniquement)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request)

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updateData: any = {}

    if (body.title) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.type) updateData.type = body.type
    if (body.color) updateData.color = body.color
    if (body.startTime) updateData.startTime = new Date(body.startTime)
    if (body.endTime) updateData.endTime = new Date(body.endTime)
    if (body.date) updateData.date = new Date(body.date)
    if (body.instructor) updateData.instructor = body.instructor
    if (body.maxParticipants) updateData.maxParticipants = body.maxParticipants

    const updatedClass = await prisma.class.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(updatedClass)
  } catch (error) {
    console.error('Error updating class:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du cours' },
      { status: 500 }
    )
  }
}

