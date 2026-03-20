"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft, User } from "lucide-react";
import { format, parseISO, startOfToday } from "date-fns";
import { fr } from "date-fns/locale/fr";
import ClassFormModal from "@/components/admin/ClassFormModal";

interface Class {
  id: string;
  title: string;
  description?: string;
  type: string;
  color: string;
  startTime: string;
  endTime: string;
  date: string;
  instructor: string;
  maxParticipants: number;
  currentParticipants: number;
}

export default function AdminClasses() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as { role?: string }).role !== "admin") {
      router.push("/");
      return;
    }

    fetchClasses();
  }, [session, status, router]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/classes", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors du chargement");

      const data = await response.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;

    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      fetchClasses();
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingClass(null);
    fetchClasses();
  };

  const openNew = () => {
    setEditingClass(null);
    setIsFormOpen(true);
  };

  const today = startOfToday();
  const dayOnly = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const sorted = [...classes].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcoming = sorted.filter(
    (c) => dayOnly(parseISO(c.date)) >= dayOnly(today)
  );
  const past = sorted.filter((c) => dayOnly(parseISO(c.date)) < dayOnly(today));

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
              Tous les cours
            </h1>
            <p className="text-on-surface-variant font-sans text-sm md:text-base max-w-xl">
              Créez, modifiez ou supprimez des séances — même présentation que
              sur le dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-on-primary px-6 py-3 text-sm font-semibold font-sans hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-5 h-5" />
            Nouveau cours
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="rounded-xl bg-surface-container-low p-12 text-center">
            <p className="text-on-surface-variant mb-6 font-sans">
              Aucun cours pour le moment.
            </p>
            <button
              type="button"
              onClick={openNew}
              className="rounded-full bg-primary text-on-primary px-8 py-3 text-sm font-semibold font-sans hover:opacity-90"
            >
              Créer le premier cours
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {upcoming.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-primary mb-4 font-sans tracking-tight">
                  À venir
                </h2>
                <div className="space-y-4">
                  {upcoming.map((c) => (
                    <ClassAdminCard
                      key={c.id}
                      classItem={c}
                      onEdit={() => handleEdit(c)}
                      onDelete={() => handleDelete(c.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-primary/70 mb-4 font-sans tracking-tight">
                  Passés
                </h2>
                <div className="space-y-4 opacity-90">
                  {[...past].reverse().map((c) => (
                    <ClassAdminCard
                      key={c.id}
                      classItem={c}
                      onEdit={() => handleEdit(c)}
                      onDelete={() => handleDelete(c.id)}
                      muted
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <ClassFormModal
        classItem={editingClass}
        isOpen={isFormOpen}
        onClose={handleFormClose}
      />
    </div>
  );
}

function ClassAdminCard({
  classItem: c,
  onEdit,
  onDelete,
  muted = false,
}: {
  classItem: Class;
  onEdit: () => void;
  onDelete: () => void;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-xl transition-colors duration-200 gap-4 ${
        muted
          ? "bg-surface-container-high/80 hover:bg-surface-container-high"
          : "bg-surface-container-low hover:bg-surface-container"
      }`}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div
          className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm ring-1 ring-outline-variant/15"
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
          <h3 className="text-lg font-serif font-bold text-on-surface mt-0.5 break-words">
            {c.title}
          </h3>
          {c.description ? (
            <p className="text-sm text-on-surface-variant mt-1 line-clamp-2 font-sans leading-relaxed">
              {c.description.replace(/<[^>]+>/g, " ").trim()}
            </p>
          ) : null}
          <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-2 font-sans">
            <span className="material-symbols-outlined text-base text-primary/70 shrink-0">
              schedule
            </span>
            {format(parseISO(c.date), "EEEE d MMMM yyyy", { locale: fr })} ·{" "}
            {format(parseISO(c.startTime), "HH:mm", { locale: fr })} –{" "}
            {format(parseISO(c.endTime), "HH:mm", { locale: fr })}
          </p>
          <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1 font-sans">
            <User className="w-4 h-4 text-primary/70 shrink-0" />
            {c.instructor} · {c.currentParticipants}/{c.maxParticipants}{" "}
            inscrits
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 shrink-0 border-t border-outline-variant/10 md:border-0 pt-4 md:pt-0 w-full md:w-auto">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="w-11 h-11 rounded-full flex items-center justify-center text-primary hover:bg-primary/8 transition-colors"
            title="Modifier"
          >
            <span className="material-symbols-outlined text-[22px]">edit</span>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-11 h-11 rounded-full flex items-center justify-center text-primary hover:bg-error-container/30 transition-colors"
            title="Supprimer"
          >
            <span className="material-symbols-outlined text-[22px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
