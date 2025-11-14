'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Eye, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import NewsFormModal from '@/components/admin/NewsFormModal'

interface News {
  id: string
  title: string
  content: string
  coverImage?: string | null
  viewCount: number
  commentsCount: number
  createdAt: string
  author: {
    firstName?: string | null
    lastName?: string | null
  }
}

export default function AdminNews() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any).role !== 'admin') {
      router.push('/')
      return
    }

    fetchNews()
  }, [session, status, router])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/news?limit=100', {
        credentials: 'include',
      })
      
      if (!response.ok) throw new Error('Erreur lors du chargement')

      const data = await response.json()
      setNews(data.news || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression')

      fetchNews()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingNews(null)
    fetchNews()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-dark/60">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-accent py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-text-dark mb-2">
              Gestion des Actualités
            </h1>
            <p className="text-text-dark/60">
              Créez, modifiez et supprimez les articles
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle actualité
          </button>
        </div>

        <div className="bg-white rounded-card shadow-lg overflow-hidden">
          {news.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-text-dark/60 mb-4">Aucune actualité pour le moment</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors"
              >
                Créer la première actualité
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Titre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Auteur</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Statistiques</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-accent/30">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text-dark">{item.title}</div>
                        <div className="text-sm text-text-dark/60 mt-1 line-clamp-2">
                          {item.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-dark">
                        {item.author.firstName || 'Admin'}
                      </td>
                      <td className="px-6 py-4 text-text-dark">
                        {format(new Date(item.createdAt), 'd MMM yyyy', { locale: fr })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-sm text-text-dark/60">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {item.viewCount}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {item.commentsCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 hover:bg-accent rounded-button transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4 text-text-dark/60" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-red-50 rounded-button transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <NewsFormModal
          news={editingNews}
          isOpen={isFormOpen}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

