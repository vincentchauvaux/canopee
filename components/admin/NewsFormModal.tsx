'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface News {
  id: string
  title: string
  content: string
  coverImage?: string | null
}

interface NewsFormModalProps {
  news: News | null
  isOpen: boolean
  onClose: () => void
}

export default function NewsFormModal({ news, isOpen, onClose }: NewsFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title,
        content: news.content,
        coverImage: news.coverImage || '',
      })
    } else {
      setFormData({
        title: '',
        content: '',
        coverImage: '',
      })
    }
    setError('')
  }, [news, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        coverImage: formData.coverImage || null,
      }

      const url = news ? `/api/news/${news.id}` : '/api/news'
      const method = news ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }

      onClose()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-card shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-serif font-bold text-text-dark">
              {news ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-button transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-button">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Image de couverture (URL)
              </label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
              />
              {formData.coverImage && (
                <img
                  src={formData.coverImage}
                  alt="Preview"
                  className="mt-2 w-full h-48 object-cover rounded-button"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Contenu * (HTML supporté)
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary resize-none font-mono text-sm"
                placeholder="<p>Votre contenu HTML ici...</p>"
              />
              <p className="mt-2 text-xs text-text-dark/60">
                Vous pouvez utiliser du HTML pour formater le contenu (balises &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.)
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors disabled:opacity-50"
              >
                {submitting ? 'Enregistrement...' : news ? 'Modifier' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray text-text-dark rounded-button hover:bg-gray/80 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

