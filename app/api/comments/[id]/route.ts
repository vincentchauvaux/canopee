import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/get-session'

// DELETE - Supprimer un commentaire (utilisateur ou admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request)

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    // Vérifier que le commentaire existe
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier les permissions (propriétaire ou admin)
    if (comment.userId !== userId && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Commentaire supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du commentaire' },
      { status: 500 }
    )
  }
}

// PATCH - Modifier un commentaire (propriétaire uniquement)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le contenu du commentaire est requis' },
        { status: 400 }
      )
    }

    // Vérifier que le commentaire existe et appartient à l'utilisateur
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      )
    }

    if (comment.userId !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const updatedComment = await prisma.comment.update({
      where: { id: params.id },
      data: {
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
    })

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du commentaire' },
      { status: 500 }
    )
  }
}

