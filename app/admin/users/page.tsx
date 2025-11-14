'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, Calendar, User as UserIcon, Shield } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale/fr'

interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  profilePic?: string | null
  authProvider: string
  role: string
  createdAt: string
  lastLogin?: string | null
  _count: {
    bookings: number
    comments: number
  }
}

export default function AdminUsers() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || (session.user as any).role !== 'admin') {
      router.push('/')
      return
    }

    fetchUsers()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users', {
        credentials: 'include',
      })
      
      if (!response.ok) throw new Error('Erreur lors du chargement')

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getUserName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.firstName) {
      return user.firstName
    }
    return user.email.split('@')[0]
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
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-text-dark mb-2">
            Gestion des Utilisateurs
          </h1>
          <p className="text-text-dark/60">
            Consultez la liste des membres et leurs statistiques
          </p>
        </div>

        <div className="bg-white rounded-card shadow-lg overflow-hidden">
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-text-dark/60">Aucun utilisateur pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Connexion</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Inscription</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Statistiques</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Rôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-accent/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={getUserName(user)}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                              {getUserName(user).charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-text-dark">{getUserName(user)}</div>
                            <div className="text-xs text-text-dark/60 capitalize">{user.authProvider}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-dark">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-text-dark/60" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-dark">
                        {user.lastLogin ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-text-dark/60" />
                            {format(new Date(user.lastLogin), 'd MMM yyyy', { locale: fr })}
                          </div>
                        ) : (
                          <span className="text-text-dark/60">Jamais</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-text-dark">
                        {format(new Date(user.createdAt), 'd MMM yyyy', { locale: fr })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-dark/60">
                          <div>{user._count.bookings} réservations</div>
                          <div>{user._count.comments} commentaires</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === 'admin'
                              ? 'bg-primary text-white'
                              : 'bg-gray text-text-dark'
                          }`}
                        >
                          <Shield className="w-4 h-4 inline mr-1" />
                          {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

