'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface News {
  id: string
  title: string
  content: string
  coverImage?: string | null
  eventDate?: string | null
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
    eventDate: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (news) {
      const eventDate =
        news.eventDate && news.eventDate !== ''
          ? new Date(news.eventDate).toISOString().split('T')[0]
          : ''
      setFormData({
        title: news.title,
        content: news.content,
        coverImage: news.coverImage || '',
        eventDate,
      })
    } else {
      setFormData({
        title: '',
        content: '',
        coverImage: '',
        eventDate: '',
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
        eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null,
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
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}`
          : data.error || 'Erreur lors de la sauvegarde'
        throw new Error(errorMessage)
      }

      onClose()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const fieldClass =
    'w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50'

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-surface-container-lowest rounded-xl shadow-lg ring-1 ring-outline-variant/15 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant/30 p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-serif font-bold text-primary">
              {news ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container-low text-on-surface transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-sans text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2 font-sans">
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={fieldClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2 font-sans">
                Image de couverture (URL)
              </label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className={fieldClass}
              />
              {formData.coverImage && (
                <img
                  src={formData.coverImage}
                  alt="Preview"
                  className="mt-2 w-full h-48 object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2 font-sans">
                Date de l&apos;actualité / de l&apos;événement
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                className={fieldClass}
              />
              <p className="mt-2 text-xs text-on-surface-variant font-sans">
                Par exemple, la date d&apos;un cours annulé ou d&apos;un événement à venir. Si vous ne renseignez rien, la date de création sera utilisée.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2 font-sans">
                Contenu * (HTML supporté)
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className={`${fieldClass} resize-none font-mono text-sm`}
                placeholder="<p>Votre contenu HTML ici...</p>"
              />
              <p className="mt-2 text-xs text-on-surface-variant font-sans">
                Vous pouvez utiliser du HTML pour formater le contenu (balises &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.)
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-surface-container-high text-on-surface rounded-full font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-primary text-on-primary rounded-full font-sans font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? 'Enregistrement...' : news ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

