"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import NewsFormModal from "@/components/admin/NewsFormModal";

interface News {
  id: string;
  title: string;
  content: string;
  coverImage?: string | null;
  eventDate?: string | null;
  viewCount: number;
  createdAt: string;
  author: {
    firstName?: string | null;
    lastName?: string | null;
  };
}

function stripPreview(html: string, max = 140) {
  const t = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

export default function AdminNews() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as { role?: string }).role !== "admin") {
      router.push("/");
      return;
    }

    fetchNews();
  }, [session, status, router]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/news?limit=100", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors du chargement");

      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette actualité ?")) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      fetchNews();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingNews(null);
    fetchNews();
  };

  const openNew = () => {
    setEditingNews(null);
    setIsFormOpen(true);
  };

  const authorLabel = (n: News) => {
    const { firstName, lastName } = n.author;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return "Équipe";
  };

  const displayDate = (n: News) =>
    n.eventDate
      ? format(new Date(n.eventDate), "d MMM yyyy", { locale: fr })
      : format(new Date(n.createdAt), "d MMM yyyy", { locale: fr });

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 md:py-10 pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 mb-8 font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-secondary-container mb-2">
              Administration
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary leading-tight mb-2">
              Actualités
            </h1>
            <p className="text-on-surface-variant font-sans text-sm md:text-base max-w-xl">
              Rédigez des annonces pour l&apos;accueil et les membres.
            </p>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-on-primary px-6 py-3 text-sm font-semibold font-sans hover:opacity-90 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Nouvelle actualité
          </button>
        </div>

        {news.length === 0 ? (
          <div className="rounded-xl bg-surface-container-low p-12 text-center">
            <p className="text-on-surface-variant mb-6 font-sans">
              Aucune actualité pour le moment.
            </p>
            <button
              type="button"
              onClick={openNew}
              className="rounded-full bg-primary text-on-primary px-8 py-3 text-sm font-semibold font-sans hover:opacity-90"
            >
              Créer la première actualité
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <article
                key={item.id}
                className="flex flex-col md:flex-row md:items-stretch gap-5 p-5 md:p-6 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors border border-outline-variant/10"
              >
                <div className="w-full md:w-40 h-40 md:h-auto md:min-h-[7rem] rounded-xl overflow-hidden bg-surface-container flex-shrink-0 relative ring-1 ring-outline-variant/15">
                  {item.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.coverImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary-container/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-on-secondary-container font-sans">
                      Article
                    </span>
                    <span className="text-xs text-outline font-sans">
                      {displayDate(item)}
                    </span>
                    <span className="text-xs text-on-surface-variant font-sans">
                      · {authorLabel(item)}
                    </span>
                    <span className="text-xs text-primary/80 font-sans inline-flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      {item.viewCount}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-on-surface mb-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-on-surface-variant font-sans leading-relaxed line-clamp-3 mb-4 flex-1">
                    {stripPreview(item.content)}
                  </p>
                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-outline-variant/10 md:border-0 md:pt-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="w-11 h-11 rounded-full flex items-center justify-center text-primary hover:bg-primary/8 transition-colors"
                      title="Modifier"
                    >
                      <span className="material-symbols-outlined text-[22px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="w-11 h-11 rounded-full flex items-center justify-center text-primary hover:bg-error-container/30 transition-colors"
                      title="Supprimer"
                    >
                      <span className="material-symbols-outlined text-[22px]">delete</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <NewsFormModal
        news={editingNews}
        isOpen={isFormOpen}
        onClose={handleFormClose}
      />
    </div>
  );
}
