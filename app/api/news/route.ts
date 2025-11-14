import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/get-session'

// GET - Récupérer toutes les actualités
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const news = await prisma.news.findMany({
      take: limit,
      skip: offset,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Formater les données
    const formattedNews = news.map((item) => ({
      ...item,
      commentsCount: item.comments.length,
    }))

    // Compter le total pour la pagination
    const total = await prisma.news.count()

    return NextResponse.json({
      news: formattedNews,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des actualités' },
      { status: 500 }
    )
  }
}

// POST - Créer une actualité (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)

    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, coverImage } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Titre et contenu requis' },
        { status: 400 }
      )
    }

    const userId = (session.user as any).id

    const news = await prisma.news.create({
      data: {
        title,
        content,
        coverImage: coverImage || null,
        authorId: userId,
        viewCount: 0,
      },
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

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'actualité' },
      { status: 500 }
    )
  }
}

