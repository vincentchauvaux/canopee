import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/get-session'

// GET - Récupérer une actualité spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
    })

    if (!news) {
      return NextResponse.json(
        { error: 'Actualité non trouvée' },
        { status: 404 }
      )
    }

    // Incrémenter le compteur de vues
    await prisma.news.update({
      where: { id: params.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({
      ...news,
      viewCount: news.viewCount + 1,
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'actualité' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour une actualité (admin uniquement)
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
    if (body.content) updateData.content = body.content
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage

    const updatedNews = await prisma.news.update({
      where: { id: params.id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
    })

    return NextResponse.json(updatedNews)
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'actualité' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une actualité (admin uniquement)
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

    await prisma.news.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Actualité supprimée avec succès' })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'actualité' },
      { status: 500 }
    )
  }
}

