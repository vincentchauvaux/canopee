'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { X, Eye, Calendar, User, Send, Trash2, Edit2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'

interface NewsAuthor {
  id: string
  firstName?: string | null
  lastName?: string | null
  profilePic?: string | null
}

interface News {
  id: string
  title: string
  content: string
  coverImage?: string | null
  author: NewsAuthor
  viewCount: number
  createdAt: string
  updatedAt: string
}

interface NewsModalProps {
  news: News
  isOpen: boolean
  onClose: () => void
}

export default function NewsModal({ news, isOpen, onClose }: NewsModalProps) {
  const { data: session } = useSession()
  const [fullNews, setFullNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && news) {
      fetchFullNews()
    }
  }, [isOpen, news.id])

  const fetchFullNews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/news/${news.id}`, {
        credentials: 'include',
      })
      
      if (!response.ok) throw new Error('Erreur lors du chargement')

      const data = await response.json()
      setFullNews(data)
    } catch (err) {
      console.error(err)
      setFullNews(news) // Utiliser les données de base en cas d'erreur
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const displayNews = fullNews || news
  const isAuthor = session && (session.user as any).id === displayNews.author.id
  const isAdmin = session && (session.user as any).role === 'admin'

  const getAuthorName = (author: NewsAuthor) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`
    }
    if (author.firstName) {
      return author.firstName
    }
    return 'Admin'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-card shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray p-6 flex items-start justify-between z-10">
            <div className="flex-1">
              <h2 className="text-3xl font-serif font-bold text-text-dark mb-2">
                {displayNews.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-text-dark/60">
                <div className="flex items-center">
                  {displayNews.author.profilePic ? (
                    <img
                      src={displayNews.author.profilePic}
                      alt={getAuthorName(displayNews.author)}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary mr-2 flex items-center justify-center text-white text-xs font-semibold">
                      {getAuthorName(displayNews.author).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{getAuthorName(displayNews.author)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(displayNews.createdAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {displayNews.viewCount} vues
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-button transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Image de couverture */}
          {displayNews.coverImage && (
            <div className="w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url(${displayNews.coverImage})` }} />
          )}

          {/* Contenu */}
          <div className="p-6">
            {loading ? (
              <p className="text-text-dark/60">Chargement...</p>
            ) : (
              <div
                className="prose max-w-none text-text-dark"
                dangerouslySetInnerHTML={{ __html: displayNews.content }}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

