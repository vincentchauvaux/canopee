'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Calendar,
  Clock,
  User,
  Users,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
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
  maxParticipants: number
  currentParticipants: number
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
  const { data: session } = useSession()
  const [classes, setClasses] = useState<UpcomingClass[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const initialDisplayCount = 3

  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fetchUpcomingClasses = async () => {
    if (!isAdmin) return

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

      const upcomingClasses = data
        .filter((cls: UpcomingClass) => {
          const classDate = parseISO(cls.date)
          const classDateOnly = new Date(
            classDate.getFullYear(),
            classDate.getMonth(),
            classDate.getDate()
          )
          const todayOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          )
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
    if (!isAdmin) return

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

      const upcomingNews = items
        .map((n) => {
          const rawDate = n.eventDate || n.createdAt
          const d = parseISO(rawDate)
          return { ...n, _dateObj: d }
        })
        .filter((n) => {
          const d = n._dateObj
          const newsDateOnly = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
          )
          const todayOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          )
          return newsDateOnly >= todayOnly
        })
        .sort((a, b) => a._dateObj.getTime() - b._dateObj.getTime())
        .map(({ _dateObj, ...rest }) => rest)

      if (upcomingNews.length === 0) {
        const todayIso = today.toISOString()
        setNews([
          {
            id: 'default-news',
            title: 'Actualités Canopée',
            content:
              "Aucune actualité spécifique pour le moment. Revenez bientôt pour découvrir les prochaines informations importantes concernant les cours et les événements.",
            coverImage: null,
            eventDate: todayIso,
            createdAt: todayIso,
          },
        ])
      } else {
        setNews(upcomingNews)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const load = async () => {
      if (!isAdmin || !isMounted) return
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
  }, [isMounted, isAdmin])

  if (!isAdmin) {
    return null
  }

  const timeline: TimelineItem[] = [
    ...classes.map((cls) => ({
      kind: 'class' as const,
      date: cls.date,
      item: cls,
    })),
    ...news.map((n) => ({
      kind: 'news' as const,
      date: n.eventDate || n.createdAt,
      item: n,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const displayedItems = showAll
    ? timeline
    : timeline.slice(0, initialDisplayCount)
  const hasMoreItems = timeline.length > initialDisplayCount

  const renderEntry = (entry: TimelineItem, featured: boolean) => {
    const entryDate = parseISO(entry.date)

    if (entry.kind === 'class') {
      const classItem = entry.item
      const startTime = parseISO(classItem.startTime)
      const endTime = parseISO(classItem.endTime)
      const tint = `${classItem.color}18`

      return (
        <article
          key={`class-${classItem.id}`}
          className={`group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-canopee-soft transition-transform duration-300 hover:-translate-y-0.5 ${
            featured ? 'min-h-[320px] md:min-h-[380px]' : ''
          }`}
        >
          <div
            className="h-2 w-full shrink-0"
            style={{ backgroundColor: classItem.color }}
          />
          <div
            className="flex flex-1 flex-col p-6 md:p-8"
            style={{ backgroundColor: featured ? undefined : tint }}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-on-primary"
                style={{ backgroundColor: classItem.color }}
              >
                {classItem.type}
              </span>
              <div className="flex items-center text-xs text-on-surface-variant">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                {format(entryDate, 'd MMM yyyy', { locale: fr })}
              </div>
            </div>
            <h3
              className={`font-serif font-semibold text-primary mb-3 ${
                featured ? 'text-2xl md:text-3xl' : 'text-xl'
              }`}
            >
              {classItem.title}
            </h3>
            <div className="space-y-2 mb-4 text-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary/80" />
                {format(startTime, 'HH:mm', { locale: fr })} —{' '}
                {format(endTime, 'HH:mm', { locale: fr })}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary/80" />
                {classItem.instructor}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary/80" />
                {classItem.currentParticipants}/{classItem.maxParticipants}{' '}
                participants
              </div>
            </div>
            {classItem.description ? (
              <p className="text-on-surface-variant leading-relaxed text-sm border-t border-outline-variant/10 pt-4 mt-auto line-clamp-4">
                {classItem.description}
              </p>
            ) : null}
          </div>
        </article>
      )
    }

    const newsItem = entry.item

    return (
      <article
        key={`news-${newsItem.id}`}
        className={`group flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-canopee-soft transition-transform duration-300 hover:-translate-y-0.5 ${
          featured ? 'min-h-[280px]' : ''
        }`}
      >
        {newsItem.coverImage ? (
          <div
            className={`relative w-full overflow-hidden bg-surface-container ${
              featured ? 'h-52 md:h-64' : 'h-40'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={newsItem.coverImage}
              alt=""
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-2 w-full bg-primary" />
        )}
        <div className="flex flex-1 flex-col p-6 md:p-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
              Actualité
            </span>
            <div className="flex items-center text-xs text-on-surface-variant">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {format(entryDate, 'd MMM yyyy', { locale: fr })}
            </div>
          </div>
          <h3
            className={`font-serif font-semibold text-primary mb-3 ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {newsItem.title}
          </h3>
          <div
            className="prose prose-sm max-w-none text-sm leading-relaxed text-on-surface-variant line-clamp-4"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
        </div>
      </article>
    )
  }

  const featured = displayedItems[0]
  const rest = displayedItems.slice(1)

  return (
    <section id="actualites" className="py-20 md:py-24 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="mb-12 md:mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">
            Espace membres
          </span>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-3xl md:text-4xl text-primary leading-tight">
              Dernières nouvelles
            </h2>
            <span className="text-sm text-primary/50 border-b border-primary/15 pb-1 font-sans">
              Cours &amp; annonces à venir
            </span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl bg-surface-container-low py-16 text-center text-on-surface-variant">
            Chargement…
          </div>
        ) : error ? (
          <div className="rounded-xl bg-error-container/40 py-12 text-center text-on-error-container">
            {error}
          </div>
        ) : timeline.length === 0 ? (
          <div className="rounded-xl bg-surface-container-low py-12 text-center text-on-surface-variant">
            Aucun élément à afficher pour le moment.
          </div>
        ) : (
          <>
            {featured && displayedItems.length === 1 ? (
              <div className="mb-8">{renderEntry(featured, true)}</div>
            ) : featured ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 mb-8">
                <div className="md:row-span-2">{renderEntry(featured, true)}</div>
                <div className="flex flex-col gap-6">
                  {rest.slice(0, 2).map((e) => (
                    <div
                      key={`${e.kind}-${
                        e.kind === 'class' ? e.item.id : e.item.id
                      }`}
                    >
                      {renderEntry(e, false)}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {rest.length > 2 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.slice(2).map((e) => (
                  <div key={`${e.kind}-${e.kind === 'class' ? e.item.id : e.item.id}`}>
                    {renderEntry(e, false)}
                  </div>
                ))}
              </div>
            )}

            {hasMoreItems && !showAll && (
              <div className="text-center mt-12">
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity"
                >
                  Voir plus
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}

            {showAll && hasMoreItems && (
              <div className="text-center mt-10">
                <button
                  type="button"
                  onClick={() => {
                    setShowAll(false)
                    document
                      .getElementById('actualites')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 px-6 py-3 text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
                >
                  Voir moins
                  <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
