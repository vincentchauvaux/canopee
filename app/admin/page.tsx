'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Calendar, Newspaper, Users, BarChart3, Plus } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    classes: 0,
    news: 0,
    users: 0,
    bookings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    const userRole = (session.user as any)?.role
    if (userRole !== 'admin') {
      router.push('/')
      return
    }

    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const [classesRes, newsRes, usersRes, bookingsRes] = await Promise.all([
        fetch('/api/classes', { credentials: 'include' }),
        fetch('/api/news', { credentials: 'include' }),
        fetch('/api/admin/users', { credentials: 'include' }),
        fetch('/api/admin/bookings', { credentials: 'include' }),
      ])

      const classes = await classesRes.json()
      const news = await newsRes.json()
      
      // Gérer les erreurs 403 pour les routes admin
      let users = { users: [] }
      let bookings = { bookings: [] }
      
      if (usersRes.ok) {
        users = await usersRes.json()
      } else if (usersRes.status === 403) {
        // Utilisateur non admin, ignorer silencieusement
        console.debug('Accès admin refusé pour les utilisateurs')
      }
      
      if (bookingsRes.ok) {
        bookings = await bookingsRes.json()
      } else if (bookingsRes.status === 403) {
        // Utilisateur non admin, ignorer silencieusement
        console.debug('Accès admin refusé pour les réservations')
      }

      setStats({
        classes: Array.isArray(classes) ? classes.length : 0,
        news: news.news ? news.news.length : 0,
        users: users.users ? users.users.length : 0,
        bookings: bookings.bookings ? bookings.bookings.length : 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-dark/60">Chargement...</p>
      </div>
    )
  }

  if (!session || (session.user as any).role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-accent py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-text-dark mb-2">
            Panel Administrateur
          </h1>
          <p className="text-text-dark/60">
            Gérez les cours, actualités et utilisateurs
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-dark/60 text-sm mb-1">Cours</p>
                <p className="text-3xl font-bold text-text-dark">{stats.classes}</p>
              </div>
              <Calendar className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="bg-white rounded-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-dark/60 text-sm mb-1">Actualités</p>
                <p className="text-3xl font-bold text-text-dark">{stats.news}</p>
              </div>
              <Newspaper className="w-12 h-12 text-secondary" />
            </div>
          </div>

          <div className="bg-white rounded-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-dark/60 text-sm mb-1">Utilisateurs</p>
                <p className="text-3xl font-bold text-text-dark">{stats.users}</p>
              </div>
              <Users className="w-12 h-12 text-primary" />
            </div>
          </div>

          <div className="bg-white rounded-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-dark/60 text-sm mb-1">Réservations</p>
                <p className="text-3xl font-bold text-text-dark">{stats.bookings}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-secondary" />
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/classes"
            className="bg-white rounded-card p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-xl font-serif font-semibold text-text-dark mb-1">
                  Gérer les Cours
                </h3>
                <p className="text-text-dark/60 text-sm">
                  Créer, modifier et supprimer des cours
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/news"
            className="bg-white rounded-card p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <Newspaper className="w-8 h-8 text-secondary" />
              <div>
                <h3 className="text-xl font-serif font-semibold text-text-dark mb-1">
                  Gérer les Actualités
                </h3>
                <p className="text-text-dark/60 text-sm">
                  Publier et modifier des articles
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-card p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-xl font-serif font-semibold text-text-dark mb-1">
                  Gérer les Utilisateurs
                </h3>
                <p className="text-text-dark/60 text-sm">
                  Voir et gérer les membres
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

