'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Send, Trash2, Edit2, User } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'

interface CommentUser {
  id: string
  firstName?: string | null
  lastName?: string | null
  profilePic?: string | null
}

interface Comment {
  id: string
  content: string
  user: CommentUser
  createdAt: string
  updatedAt: string
}

interface CommentSectionProps {
  newsId: string
}

export default function CommentSection({ newsId }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetchComments()
  }, [newsId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/news/${newsId}/comments`, {
        credentials: 'include',
      })
      
      if (!response.ok) throw new Error('Erreur lors du chargement')

      const data = await response.json()
      setComments(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/news/${newsId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }

      setNewComment('')
      fetchComments()
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'envoi du commentaire')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression')

      fetchComments()
    } catch (err) {
      alert('Erreur lors de la suppression')
    }
  }

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: editContent }),
      })

      if (!response.ok) throw new Error('Erreur lors de la modification')

      setEditingId(null)
      setEditContent('')
      fetchComments()
    } catch (err) {
      alert('Erreur lors de la modification')
    }
  }

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const getUserName = (user: CommentUser) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.firstName) {
      return user.firstName
    }
    return 'Utilisateur'
  }

  const canModify = (comment: Comment) => {
    if (!session) return false
    const userId = (session.user as any).id
    const userRole = (session.user as any).role
    return comment.user.id === userId || userRole === 'admin'
  }

  return (
    <div>
      {/* Formulaire de commentaire */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrivez un commentaire..."
              rows={3}
              className="flex-1 px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary resize-none"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-accent rounded-card text-center text-text-dark/60">
          <p>Connectez-vous pour laisser un commentaire</p>
        </div>
      )}

      {/* Liste des commentaires */}
      {loading ? (
        <p className="text-text-dark/60 text-center py-4">Chargement des commentaires...</p>
      ) : comments.length === 0 ? (
        <p className="text-text-dark/60 text-center py-4">Aucun commentaire pour le moment</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray rounded-card p-4 hover:shadow-md transition-shadow"
            >
              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray rounded-button focus:outline-none focus:border-primary resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors text-sm"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray text-text-dark rounded-button hover:bg-gray/80 transition-colors text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {comment.user.profilePic ? (
                        <img
                          src={comment.user.profilePic}
                          alt={getUserName(comment.user)}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                          {getUserName(comment.user).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-text-dark">
                          {getUserName(comment.user)}
                        </p>
                        <p className="text-xs text-text-dark/60">
                          {format(new Date(comment.createdAt), 'd MMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    {canModify(comment) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-2 hover:bg-accent rounded-button transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4 text-text-dark/60" />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-2 hover:bg-red-50 rounded-button transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-text-dark/80 whitespace-pre-wrap">{comment.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

