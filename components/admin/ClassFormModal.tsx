'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Class {
  id: string
  title: string
  description?: string
  type: string
  color: string
  startTime: string
  endTime: string
  date: string
  instructor: string
  maxParticipants: number
}

interface ClassFormModalProps {
  classItem: Class | null
  isOpen: boolean
  onClose: () => void
}

const CLASS_TYPES = ['Hatha', 'Vinyasa', 'Yin', 'Ashtanga', 'Bikram', 'Power', 'Restorative']
const CLASS_COLORS: Record<string, string> = {
  Hatha: '#264E36',      // Vert Canopée
  Vinyasa: '#7DAA6A',    // Mousse douce
  Yin: '#4F7F5A',        // Vert feuille tendre
  Ashtanga: '#AFCFA1',   // Lichen
  Bikram: '#3A644B',     // Vert Canopée hover
  Power: '#1E3D2B',      // Vert Canopée press
  Restorative: '#F2E8C9', // Lumière forestière
}

export default function ClassFormModal({ classItem, isOpen, onClose }: ClassFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Hatha',
    color: CLASS_COLORS.Hatha,
    date: '',
    startTime: '',
    endTime: '',
    instructor: '',
    maxParticipants: 20,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (classItem) {
      const date = new Date(classItem.date).toISOString().split('T')[0]
      const startTime = new Date(classItem.startTime).toTimeString().slice(0, 5)
      const endTime = new Date(classItem.endTime).toTimeString().slice(0, 5)

      setFormData({
        title: classItem.title,
        description: classItem.description || '',
        type: classItem.type,
        color: classItem.color,
        date,
        startTime,
        endTime,
        instructor: classItem.instructor,
        maxParticipants: classItem.maxParticipants,
      })
    } else {
      // Réinitialiser le formulaire avec valeurs par défaut pour Yin Yoga
      const today = new Date()
      // Trouver le prochain vendredi (5 = vendredi en JavaScript, 0 = dimanche)
      const currentDay = today.getDay() // 0 = dimanche, 5 = vendredi
      let daysUntilFriday = 5 - currentDay
      if (daysUntilFriday <= 0) {
        daysUntilFriday += 7 // Si on est déjà vendredi ou après, prendre le vendredi suivant
      }
      const nextFriday = new Date(today)
      nextFriday.setDate(today.getDate() + daysUntilFriday)
      
      setFormData({
        title: 'Yin Yoga',
        description: '',
        type: 'Yin',
        color: CLASS_COLORS.Yin || '#4F7F5A',
        date: nextFriday.toISOString().split('T')[0],
        startTime: '18:00',
        endTime: '19:00',
        instructor: 'Carole Nelissen',
        maxParticipants: 3,
      })
    }
    setError('')
  }, [classItem, isOpen])

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      type,
      color: CLASS_COLORS[type] || CLASS_COLORS.Hatha,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // Construire les dates complètes
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`)
      const classDate = new Date(formData.date)

      const payload = {
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        color: formData.color,
        date: classDate.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        instructor: formData.instructor,
        maxParticipants: formData.maxParticipants,
      }

      const url = classItem ? `/api/classes/${classItem.id}` : '/api/classes'
      const method = classItem ? 'PATCH' : 'POST'

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
        <div className="relative bg-white rounded-card shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-serif font-bold text-text-dark">
              {classItem ? 'Modifier le cours' : 'Nouveau cours'}
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
                Description
                <span className="text-xs text-text-dark/60 ml-2 font-normal">
                  (Thème du cours, exercices, lien avec la MTC, etc. - Visible dans le fil d&apos;actualité)
                </span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                placeholder="Décrivez le thème du cours, les exercices prévus, le lien avec la médecine traditionnelle chinoise, ou toute autre information pertinente..."
                className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Type de cours *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                >
                  {CLASS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Couleur
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-12 border border-gray rounded-button cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Heure début *
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Heure fin *
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Professeur *
                </label>
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Places maximum *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors disabled:opacity-50"
              >
                {submitting ? 'Enregistrement...' : classItem ? 'Modifier' : 'Créer'}
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

