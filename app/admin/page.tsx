'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import {
  Calendar,
  Newspaper,
  Users,
  BarChart3,
  PlusCircle,
  Megaphone,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { format, parseISO, startOfToday } from 'date-fns'
import { fr } from 'date-fns/locale/fr'
import ClassFormModal from '@/components/admin/ClassFormModal'

interface DashboardClass {
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

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    classes: 0,
    news: 0,
    users: 0,
    bookings: 0,
  })
  const [upcomingClasses, setUpcomingClasses] = useState<DashboardClass[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<DashboardClass | null>(null)

  const loadDashboard = useCallback(async () => {
    try {
      const [classesRes, newsRes, usersRes, bookingsRes] = await Promise.all([
        fetch('/api/classes', { credentials: 'include' }),
        fetch('/api/news', { credentials: 'include' }),
        fetch('/api/admin/users', { credentials: 'include' }),
        fetch('/api/admin/bookings', { credentials: 'include' }),
      ])

      const classesRaw = await classesRes.json()
      const news = await newsRes.json()

      let users = { users: [] as unknown[] }
      let bookings = { bookings: [] as unknown[] }

      if (usersRes.ok) {
        users = await usersRes.json()
      }
      if (bookingsRes.ok) {
        bookings = await bookingsRes.json()
      }

      const classes: DashboardClass[] = Array.isArray(classesRaw)
        ? classesRaw
        : []

      const today = startOfToday()
      const upcoming = classes
        .filter((c) => {
          const d = parseISO(c.date)
          return d >= today
        })
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        .slice(0, 12)

      setUpcomingClasses(upcoming)
      setStats({
        classes: classes.length,
        news: news.news ? news.news.length : 0,
        users: users.users ? users.users.length : 0,
        bookings: bookings.bookings ? bookings.bookings.length : 0,
      })
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    const userRole = (session.user as { role?: string })?.role
    if (userRole !== 'admin') {
      router.push('/')
      return
    }

    loadDashboard()
  }, [session, status, router, loadDashboard])

  const handleEdit = (c: DashboardClass) => {
    setEditingClass(c)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce cours ?')) return
    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) throw new Error()
      loadDashboard()
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingClass(null)
    loadDashboard()
  }

  const openNewClass = () => {
    setEditingClass(null)
    setIsFormOpen(true)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant">Chargement...</p>
      </div>
    )
  }

  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return null
  }

  const firstName =
    (session.user as { firstName?: string })?.firstName ||
    session.user?.name?.split(/\s+/)[0] ||
    'Administrateur'

  return (
    <div className="min-h-screen bg-surface py-8 md:py-10 pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-secondary-container mb-2">
          Espace enseignant
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-primary leading-tight mb-3">
          Bonjour,{' '}
          <span className="italic font-normal">{firstName}.</span>
        </h1>
        <p className="text-on-surface-variant font-sans text-base max-w-2xl mb-10">
          Prochains cours, actualités et membres — même esprit que vos maquettes
          Stitch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <button
            type="button"
            onClick={openNewClass}
            className="group flex flex-col justify-between rounded-xl bg-primary p-8 text-left text-on-primary shadow-ambient-float transition-transform hover:scale-[1.01] duration-300 w-full"
          >
            <PlusCircle
              className="w-10 h-10 mb-8 text-on-primary-container"
              strokeWidth={1.25}
            />
            <div>
              <h2 className="font-serif text-xl font-bold mb-1">Ajouter un cours</h2>
              <p className="text-sm text-on-primary/80 font-sans">
                Programmer une nouvelle séance
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-on-primary/70 group-hover:text-on-primary transition-colors">
                Créer <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>

          <Link
            href="/admin/news"
            className="group flex flex-col justify-between rounded-xl bg-surface-container-lowest p-8 text-left outline outline-1 outline-outline-variant/15 shadow-canopee-soft transition-transform hover:scale-[1.01] duration-300"
          >
            <Megaphone
              className="w-10 h-10 mb-8 text-primary"
              strokeWidth={1.25}
            />
            <div>
              <h2 className="font-serif text-xl font-bold text-on-surface mb-1">
                Publier une news
              </h2>
              <p className="text-sm text-on-surface-variant font-sans">
                Annonces et articles pour les membres
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary/60 group-hover:text-primary transition-colors">
                Rédiger <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          <div className="flex flex-col justify-between rounded-xl bg-secondary-container p-8 text-on-secondary-container shadow-canopee-soft">
            <Users className="w-10 h-10 mb-6 text-on-secondary-container opacity-90" />
            <div>
              <p className="font-serif text-4xl font-bold text-primary mb-1">
                {stats.users}
              </p>
              <p className="text-sm font-semibold font-sans">Membres inscrits</p>
              <p className="text-xs text-on-secondary-container/80 mt-2">
                {stats.bookings} réservation
                {stats.bookings !== 1 ? 's' : ''} en base
              </p>
            </div>
          </div>
        </div>

        <section className="mb-14">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-serif text-2xl font-bold text-primary">
              Mes cours
            </h2>
            <Link
              href="/admin/classes"
              className="text-sm font-bold text-primary flex items-center gap-1 group font-sans"
            >
              Voir tout
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="rounded-xl bg-surface-container-low p-10 text-center text-on-surface-variant text-sm font-sans">
              <p className="mb-4">Aucun cours à venir. Créez-en un pour qu&apos;il apparaisse ici.</p>
              <button
                type="button"
                onClick={openNewClass}
                className="rounded-full bg-primary text-on-primary px-6 py-2.5 text-sm font-semibold hover:opacity-90"
              >
                Nouveau cours
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingClasses.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors duration-200 gap-4"
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div
                      className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm relative ring-1 ring-outline-variant/15"
                      style={{
                        background: `linear-gradient(145deg, ${c.color}40 0%, ${c.color}95 100%)`,
                      }}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-tighter px-2 py-0.5 rounded font-sans inline-block mb-1.5"
                        style={{
                          backgroundColor: `${c.color}22`,
                          color: c.color,
                        }}
                      >
                        {c.type}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-on-surface mt-0.5 truncate">
                        {c.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1 font-sans">
                        <span className="material-symbols-outlined text-base text-primary/70">
                          schedule
                        </span>
                        {format(parseISO(c.date), 'EEE d MMM', { locale: fr })} ·{' '}
                        {format(parseISO(c.startTime), 'HH:mm', { locale: fr })} –{' '}
                        {format(parseISO(c.endTime), 'HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-8 md:gap-10 shrink-0">
                    <div className="text-center">
                      <p className="text-xl font-serif font-bold text-primary">
                        {c.currentParticipants}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-sans">
                        Inscrits
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        className="w-11 h-11 rounded-full flex items-center justify-center text-primary hover:bg-primary/8 transition-colors"
                        title="Modifier"
                      >
                        <span className="material-symbols-outlined text-[22px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="w-11 h-11 rounded-full flex items-center justify-center text-primary hover:bg-error-container/30 transition-colors"
                        title="Supprimer"
                      >
                        <span className="material-symbols-outlined text-[22px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <h2 className="font-serif text-2xl text-primary mb-6">Vue d&apos;ensemble</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-canopee-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wide mb-1">
                  Cours
                </p>
                <p className="text-3xl font-serif font-bold text-primary">
                  {stats.classes}
                </p>
              </div>
              <Calendar className="w-11 h-11 text-primary opacity-90" />
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-canopee-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wide mb-1">
                  Actualités
                </p>
                <p className="text-3xl font-serif font-bold text-primary">
                  {stats.news}
                </p>
              </div>
              <Newspaper className="w-11 h-11 text-secondary opacity-90" />
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-canopee-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wide mb-1">
                  Utilisateurs
                </p>
                <p className="text-3xl font-serif font-bold text-primary">
                  {stats.users}
                </p>
              </div>
              <Users className="w-11 h-11 text-primary opacity-90" />
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-lowest p-6 shadow-canopee-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wide mb-1">
                  Réservations
                </p>
                <p className="text-3xl font-serif font-bold text-primary">
                  {stats.bookings}
                </p>
              </div>
              <BarChart3 className="w-11 h-11 text-secondary opacity-90" />
            </div>
          </div>
        </div>

        <div className="mt-10 text-center md:text-left">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
          >
            Gérer les utilisateurs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <ClassFormModal
        classItem={editingClass}
        isOpen={isFormOpen}
        onClose={handleFormClose}
      />
    </div>
  )
}
