'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, ChevronDown } from 'lucide-react'
import { format, parseISO, startOfToday } from 'date-fns'
import { fr } from 'date-fns/locale/fr'

interface UpcomingClass {
  id: string
  title: string
  description?: string | null
  type: string
  color: string
  date: string
  startTime: string
  endTime: string
  instructor: string
}

interface NewsItem {
  id: string
  title: string
  content: string
  coverImage?: string | null
  eventDate?: string | null
  createdAt: string
}

type TimelineItem =
  | { kind: 'class'; date: string; item: UpcomingClass }
  | { kind: 'news'; date: string; item: NewsItem }

export default function NewsFeed() {
  const [classes, setClasses] = useState<UpcomingClass[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const initialDisplayCount = 3

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fetchUpcomingClasses = async () => {
    try {
      const today = startOfToday()
      const response = await fetch(
        `/api/classes?startDate=${today.toISOString()}`,
        {
          credentials: 'include',
        }
      )
      
      if (!response.ok) throw new Error('Erreur lors du chargement des cours')

      const data = await response.json()

      // Filtrer uniquement les cours futurs (y compris aujourd'hui) et trier par date
      const upcomingClasses = data
        .filter((cls: UpcomingClass) => {
          const classDate = parseISO(cls.date)
          const classDateOnly = new Date(classDate.getFullYear(), classDate.getMonth(), classDate.getDate())
          const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
          return classDateOnly >= todayOnly
        })
        .sort((a: UpcomingClass, b: UpcomingClass) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        })

      setClasses(upcomingClasses)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchNews = async () => {
    try {
      const today = startOfToday()
      const response = await fetch('/api/news?limit=100', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des actualités')
      }

      const data = await response.json()

      const items = (data.news || []) as NewsItem[]

      // Utiliser eventDate si présente, sinon createdAt
      const upcomingNews = items
        .map((n) => {
          const rawDate = n.eventDate || n.createdAt
          const d = parseISO(rawDate)
          return { ...n, _dateObj: d }
        })
        .filter((n) => {
          const d = n._dateObj
          const newsDateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate())
          const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
          return newsDateOnly >= todayOnly
        })
        .sort((a, b) => a._dateObj.getTime() - b._dateObj.getTime())
        .map(({ _dateObj, ...rest }) => rest)

      setNews(upcomingNews)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const load = async () => {
      if (!isMounted) return
      setLoading(true)
      setError('')
      try {
        await Promise.all([fetchUpcomingClasses(), fetchNews()])
      } catch {
        setError('Erreur lors du chargement des cours et actualités')
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  // Construire une timeline fusionnée cours + actualités
  const timeline: TimelineItem[] = [
    ...classes.map((cls) => ({ kind: 'class' as const, date: cls.date, item: cls })),
    ...news.map((n) => ({
      kind: 'news' as const,
      date: n.eventDate || n.createdAt,
      item: n,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const displayedItems = showAll ? timeline : timeline.slice(0, initialDisplayCount)
  const hasMoreItems = timeline.length > initialDisplayCount

  if (!loading && !error && timeline.length === 0) {
    return null
  }

  return (
    <section id="actualites" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-text-dark mb-4">
            Fil d&apos;Actualité
          </h2>
          <p className="text-lg text-text-dark/80 max-w-2xl mx-auto">
            Découvrez les thèmes et descriptions des prochains cours
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-dark/60">Chargement des cours...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((entry) => {
                const entryDate = parseISO(entry.date)

                if (entry.kind === 'class') {
                  const classItem = entry.item
                  const startTime = parseISO(classItem.startTime)
                  const endTime = parseISO(classItem.endTime)

                  return (
                    <article
                      key={`class-${classItem.id}`}
                      className="bg-white border border-gray rounded-card overflow-hidden hover:shadow-lg transition-all"
                    >
                      {/* En-tête avec couleur du type */}
                      <div
                        className="h-2"
                        style={{ backgroundColor: classItem.color }}
                      />

                      <div className="p-6">
                        {/* Type et date */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: classItem.color }}
                          >
                            {classItem.type}
                          </span>
                          <div className="flex items-center text-xs text-text-dark/60">
                            <Calendar className="w-4 h-4 mr-1" />
                            {format(entryDate, 'd MMM yyyy', { locale: fr })}
                          </div>
                        </div>

                        {/* Titre */}
                        <h3 className="text-xl font-serif font-semibold mb-3 text-text-dark">
                          {classItem.title}
                        </h3>

                        {/* Horaires et instructeur */}
                        <div className="space-y-2 mb-4 text-sm text-text-dark/70">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            {format(startTime, 'HH:mm', { locale: fr })} - {format(endTime, 'HH:mm', { locale: fr })}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-primary" />
                            {classItem.instructor}
                          </div>
                        </div>

                        {/* Description */}
                        {classItem.description && (
                          <div className="pt-4 border-t border-gray">
                            <p className="text-text-dark/80 leading-relaxed whitespace-pre-line">
                              {classItem.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  )
                }

                const newsItem = entry.item

                return (
                  <article
                    key={`news-${newsItem.id}`}
                    className="bg-white border border-gray rounded-card overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="h-2 bg-primary" />

                    <div className="p-6">
                      {/* Type et date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-primary">
                          Actualité
                        </span>
                        <div className="flex items-center text-xs text-text-dark/60">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(entryDate, 'd MMM yyyy', { locale: fr })}
                        </div>
                      </div>

                      {/* Titre */}
                      <h3 className="text-xl font-serif font-semibold mb-3 text-text-dark">
                        {newsItem.title}
                      </h3>

                      {/* Contenu */}
                      <div className="pt-4 border-t border-gray text-sm text-text-dark/80 leading-relaxed">
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: newsItem.content }}
                        />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {/* Bouton "Voir plus" */}
            {hasMoreItems && !showAll && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors font-medium"
                >
                  Voir plus de cours
                  <ChevronDown className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}

            {/* Bouton "Voir moins" */}
            {showAll && hasMoreItems && (
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    setShowAll(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="inline-flex items-center px-6 py-3 bg-gray text-text-dark rounded-button hover:bg-gray/80 transition-colors font-medium"
                >
                  Voir moins
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
