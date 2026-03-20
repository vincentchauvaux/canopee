'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Calendar, Clock, User, Users } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import ClassFormModal from '@/components/admin/ClassFormModal'

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
  currentParticipants: number
}

export default function AdminClasses() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any).role !== 'admin') {
      router.push('/')
      return
    }

    fetchClasses()
  }, [session, status, router])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/classes', {
        credentials: 'include',
      })
      
      if (!response.ok) throw new Error('Erreur lors du chargement')

      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return

    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression')

      fetchClasses()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingClass(null)
    fetchClasses()
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
              Gestion des Cours
            </h1>
            <p className="text-text-dark/60">
              Créez, modifiez et supprimez les cours de yoga
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau cours
          </button>
        </div>

        <div className="bg-white rounded-card shadow-lg overflow-hidden">
          {classes.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-text-dark/60 mb-4">Aucun cours pour le moment</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors"
              >
                Créer le premier cours
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Titre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Heure</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Professeur</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Places</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray">
                  {classes.map((classItem) => (
                    <tr key={classItem.id} className="hover:bg-accent/30">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text-dark">{classItem.title}</div>
                        {classItem.description && (
                          <div className="text-sm text-text-dark/60 mt-1 line-clamp-1">
                            {classItem.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                          style={{ backgroundColor: classItem.color }}
                        >
                          {classItem.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-dark">
                        {format(new Date(classItem.date), 'd MMM yyyy', { locale: fr })}
                      </td>
                      <td className="px-6 py-4 text-text-dark">
                        {format(new Date(classItem.startTime), 'HH:mm', { locale: fr })} -{' '}
                        {format(new Date(classItem.endTime), 'HH:mm', { locale: fr })}
                      </td>
                      <td className="px-6 py-4 text-text-dark">{classItem.instructor}</td>
                      <td className="px-6 py-4">
                        <span className="text-text-dark">
                          {classItem.currentParticipants}/{classItem.maxParticipants}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(classItem)}
                            className="p-2 hover:bg-accent rounded-button transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4 text-text-dark/60" />
                          </button>
                          <button
                            onClick={() => handleDelete(classItem.id)}
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
        <ClassFormModal
          classItem={editingClass}
          isOpen={isFormOpen}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

