'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Calendar, Clock, Users, User, Calendar as CalendarIcon } from 'lucide-react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, startOfMonth, endOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale/fr'

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
  isBooked?: boolean
}

export default function Agenda() {
  const { data: session } = useSession()
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'week' | 'month'>('week')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingStatus, setBookingStatus] = useState<Record<string, 'loading' | 'success' | 'error'>>({})

  // Calculer les dates de la semaine/mois
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Calculer les dates du mois
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const monthStartWeek = startOfWeek(monthStart, { weekStartsOn: 1 })
  const monthEndWeek = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const monthDays = eachDayOfInterval({ start: monthStartWeek, end: monthEndWeek })

  useEffect(() => {
    fetchClasses()
  }, [selectedDate, view, session])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const start = view === 'week' ? weekStart : monthStartWeek
      const end = view === 'week' ? weekEnd : monthEndWeek

      const response = await fetch(
        `/api/classes?startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
        {
          credentials: 'include',
        }
      )
      
      if (!response.ok) throw new Error('Erreur lors du chargement des cours')

      let data = await response.json()

      // Si l'utilisateur est connecté, récupérer ses réservations
      if (session && session.user) {
        try {
          const bookingsResponse = await fetch('/api/bookings', {
            credentials: 'include',
          })
          if (bookingsResponse.ok) {
            const bookings = await bookingsResponse.json()
            // Vérifier que c'est bien un tableau
            if (Array.isArray(bookings)) {
              const bookedClassIds = new Set(bookings.map((b: any) => b.classId))
              data = data.map((cls: Class) => ({
                ...cls,
                isBooked: bookedClassIds.has(cls.id),
              }))
            }
          }
        } catch (err) {
          // Ignorer les erreurs d'authentification pour les utilisateurs non connectés
        }
      }

      setClasses(data)
      setError('')
    } catch (err) {
      setError('Erreur lors du chargement des cours')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (classId: string) => {
    if (!session) {
      alert('Veuillez vous connecter pour réserver un cours')
      return
    }

    setBookingStatus({ ...bookingStatus, [classId]: 'loading' })

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ classId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la réservation')
      }

      setBookingStatus({ ...bookingStatus, [classId]: 'success' })
      fetchClasses() // Recharger les cours
    } catch (err: any) {
      setBookingStatus({ ...bookingStatus, [classId]: 'error' })
      alert(err.message || 'Erreur lors de la réservation')
    }
  }

  const handleCancelBooking = async (classId: string) => {
    if (!session) return

    // Trouver la réservation
    const bookingsResponse = await fetch('/api/bookings', {
      credentials: 'include',
    })
    if (!bookingsResponse.ok) return

    const bookings = await bookingsResponse.json()
    const booking = bookings.find((b: any) => b.classId === classId)

    if (!booking) return

    setBookingStatus({ ...bookingStatus, [classId]: 'loading' })

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Erreur lors de l\'annulation')

      setBookingStatus({ ...bookingStatus, [classId]: 'success' })
      fetchClasses()
    } catch (err) {
      setBookingStatus({ ...bookingStatus, [classId]: 'error' })
      alert('Erreur lors de l\'annulation')
    }
  }

  const getClassesForDay = (day: Date) => {
    return classes.filter((cls) => {
      const classDate = parseISO(cls.date)
      return isSameDay(classDate, day)
    })
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    setSelectedDate(newDate)
  }

  const classTypes = Array.from(new Set(classes.map((c) => c.type)))
  const classTypeColors: Record<string, string> = {}
  classes.forEach((c) => {
    if (!classTypeColors[c.type]) {
      classTypeColors[c.type] = c.color
    }
  })

  return (
    <section id="agenda" className="py-20 bg-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-text-dark mb-4">
            Notre Agenda
          </h2>
          <p className="text-lg text-text-dark/80 max-w-2xl mx-auto">
            Découvrez nos cours et réservez votre place
          </p>
        </div>

        {/* Contrôles */}
        <div className="bg-white rounded-card p-6 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 bg-secondary text-white rounded-button hover:bg-secondary-light transition-colors"
              >
                Aujourd'hui
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="p-2 hover:bg-accent rounded-button"
                >
                  ←
                </button>
                <span className="font-semibold min-w-[200px] text-center">
                  {view === 'week' 
                    ? `${format(weekStart, 'd MMM', { locale: fr })} - ${format(weekEnd, 'd MMM yyyy', { locale: fr })}`
                    : format(selectedDate, 'MMMM yyyy', { locale: fr })
                  }
                </span>
                <button
                  onClick={() => navigateWeek('next')}
                  className="p-2 hover:bg-accent rounded-button"
                >
                  →
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-button transition-colors ${
                  view === 'week'
                    ? 'bg-primary text-white'
                    : 'bg-gray text-text-dark hover:bg-gray/80'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-button transition-colors ${
                  view === 'month'
                    ? 'bg-primary text-white'
                    : 'bg-gray text-text-dark hover:bg-gray/80'
                }`}
              >
                Mois
              </button>
            </div>
          </div>

          {/* Légende des types de cours */}
          {classTypes.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {classTypes.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: classTypeColors[type] || '#264E36' }}
                  />
                  <span className="text-sm text-text-dark/70">{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendrier */}
        {loading ? (
          <div className="bg-white rounded-card p-12 shadow-lg text-center">
            <p className="text-text-dark/60">Chargement des cours...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-card p-12 shadow-lg text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-card p-6 shadow-lg">
            {view === 'week' ? (
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weekDays.map((day, index) => {
                  const dayClasses = getClassesForDay(day)
                  const isToday = isSameDay(day, new Date())

                  return (
                    <div
                      key={index}
                      className={`border rounded-card p-3 min-h-[200px] ${
                        isToday ? 'border-primary border-2 bg-accent/30' : 'border-gray'
                      }`}
                    >
                      <div className="mb-3">
                        <div className="text-xs text-text-dark/60 uppercase">
                          {format(day, 'EEE', { locale: fr })}
                        </div>
                        <div
                          className={`text-lg font-semibold ${
                            isToday ? 'text-primary' : 'text-text-dark'
                          }`}
                        >
                          {format(day, 'd')}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {dayClasses.map((cls) => (
                          <div
                            key={cls.id}
                            className="p-2 rounded text-xs"
                            style={{
                              backgroundColor: `${cls.color}20`,
                              borderLeft: `3px solid ${cls.color}`,
                            }}
                          >
                            <div className="font-semibold mb-1">{cls.title}</div>
                            <div className="flex items-center gap-1 text-text-dark/60 mb-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {format(parseISO(cls.startTime), 'HH:mm')} -{' '}
                                {format(parseISO(cls.endTime), 'HH:mm')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-text-dark/60 mb-1">
                              <User className="w-3 h-3" />
                              <span>{cls.instructor}</span>
                            </div>
                            <div className="flex items-center gap-1 text-text-dark/60 mb-2">
                              <Users className="w-3 h-3" />
                              <span>
                                {cls.currentParticipants}/{cls.maxParticipants}
                              </span>
                            </div>
                            {session ? (
                              cls.isBooked ? (
                                <button
                                  onClick={() => handleCancelBooking(cls.id)}
                                  disabled={bookingStatus[cls.id] === 'loading'}
                                  className="w-full px-2 py-1 bg-red-100 text-red-700 rounded-button text-xs hover:bg-red-200 transition-colors disabled:opacity-50"
                                >
                                  {bookingStatus[cls.id] === 'loading'
                                    ? 'Annulation...'
                                    : 'Annuler'}
                                </button>
                              ) : cls.currentParticipants < cls.maxParticipants ? (
                                <button
                                  onClick={() => handleBooking(cls.id)}
                                  disabled={bookingStatus[cls.id] === 'loading'}
                                  className="w-full px-2 py-1 bg-primary text-white rounded-button text-xs hover:bg-primary-light transition-colors disabled:opacity-50"
                                >
                                  {bookingStatus[cls.id] === 'loading'
                                    ? 'Réservation...'
                                    : 'Réserver'}
                                </button>
                              ) : (
                                <div className="w-full px-2 py-1 bg-gray text-text-dark/60 rounded-button text-xs text-center">
                                  Complet
                                </div>
                              )
                            ) : (
                              <div className="w-full px-2 py-1 bg-gray text-text-dark/60 rounded-button text-xs text-center">
                                Connectez-vous
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div>
                {/* En-têtes des jours de la semaine */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((dayName) => (
                    <div key={dayName} className="text-center text-sm font-semibold text-text-dark/70 py-2">
                      {dayName}
                    </div>
                  ))}
                </div>
                {/* Grille du mois */}
                <div className="grid grid-cols-7 gap-2">
                  {monthDays.map((day, index) => {
                    const dayClasses = getClassesForDay(day)
                    const isToday = isSameDay(day, new Date())
                    const isCurrentMonth = day.getMonth() === selectedDate.getMonth()

                    return (
                      <div
                        key={index}
                        className={`border rounded-card p-2 min-h-[120px] ${
                          isToday 
                            ? 'border-primary border-2 bg-accent/30' 
                            : isCurrentMonth 
                            ? 'border-gray' 
                            : 'border-gray/30 bg-gray/10'
                        }`}
                      >
                        <div className="mb-2">
                          <div
                            className={`text-sm font-semibold ${
                              isToday 
                                ? 'text-primary' 
                                : isCurrentMonth 
                                ? 'text-text-dark' 
                                : 'text-text-dark/40'
                            }`}
                          >
                            {format(day, 'd')}
                          </div>
                        </div>

                        <div className="space-y-1">
                          {dayClasses.slice(0, 2).map((cls) => (
                            <div
                              key={cls.id}
                              className="p-1.5 rounded text-xs"
                              style={{
                                backgroundColor: `${cls.color}20`,
                                borderLeft: `2px solid ${cls.color}`,
                              }}
                            >
                              <div className="font-semibold truncate">{cls.title}</div>
                              <div className="text-text-dark/60 text-[10px]">
                                {format(parseISO(cls.startTime), 'HH:mm')}
                              </div>
                            </div>
                          ))}
                          {dayClasses.length > 2 && (
                            <div className="text-xs text-text-dark/60 text-center pt-1">
                              +{dayClasses.length - 2} autre{dayClasses.length - 2 > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
