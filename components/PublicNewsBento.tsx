"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NewsModal from "@/components/NewsModal";
import { Reveal } from "@/components/motion/Reveal";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale/fr";

interface NewsAuthor {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePic?: string | null;
}

export interface ListedNews {
  id: string;
  title: string;
  content: string;
  coverImage?: string | null;
  eventDate?: string | null;
  createdAt: string;
  viewCount?: number;
  author: NewsAuthor;
}

function stripHtml(html: string, max = 180) {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max)}…`;
}

function sortDate(n: ListedNews) {
  return n.eventDate || n.createdAt;
}

export default function PublicNewsBento() {
  const [items, setItems] = useState<ListedNews[]>([]);
  const [modalNews, setModalNews] = useState<ListedNews | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/news?limit=20");
        if (!res.ok) return;
        const data = await res.json();
        const raw = (data.news || []) as ListedNews[];
        const sorted = [...raw].sort(
          (a, b) =>
            new Date(sortDate(b)).getTime() - new Date(sortDate(a)).getTime()
        );
        setItems(sorted.slice(0, 5));
      } catch {
        setItems([]);
      }
    })();
  }, []);

  if (items.length === 0) {
    return (
      <Reveal variant="fade-up">
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-serif text-primary">Dernières nouvelles</h3>
          </div>
          <p className="text-sm text-on-surface-variant py-6">
            Les prochaines annonces apparaîtront ici.
          </p>
        </section>
      </Reveal>
    );
  }

  const [featured, ...rest] = items;

  return (
    <>
      <section className="space-y-8">
        <Reveal variant="slide-right" amount={0.25}>
          <div className="flex justify-between items-end gap-4">
            <h3 className="text-2xl font-serif text-primary">Dernières nouvelles</h3>
            <span className="text-sm text-primary/55 border-b border-primary/20 pb-1 font-sans shrink-0">
              À jour
            </span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal variant="fade-up" delay={0} amount={0.12}>
          <button
            type="button"
            onClick={() => setModalNews(featured)}
            className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col group transition-transform duration-300 hover:scale-[1.01] text-left w-full h-full will-change-transform"
          >
            <div className="h-48 w-full bg-surface-container overflow-hidden relative">
              {featured.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-secondary-container/40" />
              )}
            </div>
            <div className="p-6 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-on-secondary-container">
                Actualité
              </span>
              <h4 className="text-xl font-serif text-primary leading-snug">
                {featured.title}
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                {stripHtml(featured.content, 220)}
              </p>
              <p className="text-[10px] text-outline uppercase tracking-widest font-sans">
                {format(parseISO(sortDate(featured)), "d MMM yyyy", { locale: fr })}
              </p>
            </div>
          </button>
          </Reveal>
          <div className="space-y-6 flex flex-col">
            {rest.slice(0, 2).map((n, i) => (
              <Reveal key={n.id} variant="fade-up" delay={0.1 + i * 0.1} amount={0.12}>
                <button
                  type="button"
                  onClick={() => setModalNews(n)}
                  className="w-full bg-surface-container-low p-6 rounded-xl space-y-3 relative overflow-hidden text-left hover:bg-surface-container transition-colors will-change-transform"
                >
                  <div className="absolute -top-4 -right-4 opacity-[0.06] pointer-events-none">
                    <span className="material-symbols-outlined text-8xl">eco</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-on-secondary-container">
                    Nouvelle
                  </span>
                  <h4 className="text-lg font-serif text-primary">{n.title}</h4>
                  <p className="text-sm text-on-surface-variant line-clamp-2">
                    {stripHtml(n.content, 120)}
                  </p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {modalNews && (
        <NewsModal
          news={{
            ...modalNews,
            viewCount: modalNews.viewCount ?? 0,
            updatedAt: modalNews.createdAt,
            author: modalNews.author,
          }}
          isOpen={!!modalNews}
          onClose={() => setModalNews(null)}
        />
      )}
    </>
  );
}
