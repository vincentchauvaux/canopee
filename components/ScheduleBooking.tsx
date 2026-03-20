"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, useReducedMotion } from "framer-motion";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { easeCanopy } from "@/components/motion/easings";

interface ClassItem {
  id: string;
  title: string;
  type: string;
  color: string;
  startTime: string;
  endTime: string;
  date: string;
  instructor: string;
  maxParticipants: number;
  currentParticipants: number;
  isBooked?: boolean;
}

const STUDIO = "Rue Jean Theys, 10 — 1440 Wauthier-Braine";

export default function ScheduleBooking() {
  const { data: session } = useSession();
  const reduce = useReducedMotion();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<Record<string, "loading" | "success" | "error">>({});

  const weekStart = startOfWeek(weekAnchor, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekAnchor, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/classes?startDate=${weekStart.toISOString()}&endDate=${weekEnd.toISOString()}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("fetch");
      let data: ClassItem[] = await response.json();

      if (session?.user) {
        try {
          const bookingsResponse = await fetch("/api/bookings", {
            credentials: "include",
          });
          if (bookingsResponse.ok) {
            const bookings: { classId: string }[] = await bookingsResponse.json();
            if (Array.isArray(bookings)) {
              const booked = new Set(bookings.map((b) => b.classId));
              data = data.map((c) => ({
                ...c,
                isBooked: booked.has(c.id),
              }));
            }
          }
        } catch {
          /* ignore */
        }
      }

      setClasses(data);
    } catch {
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart.getTime(), session?.user?.email]);

  const dayClasses = classes
    .filter((c) => isSameDay(parseISO(c.date), selectedDate))
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const handleBooking = async (classId: string) => {
    if (!session) {
      alert("Connectez-vous pour réserver un cours.");
      return;
    }
    setBookingStatus((s) => ({ ...s, [classId]: "loading" }));
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ classId }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Réservation impossible");
      }
      setBookingStatus((s) => ({ ...s, [classId]: "success" }));
      fetchClasses();
    } catch (e: unknown) {
      setBookingStatus((s) => ({ ...s, [classId]: "error" }));
      alert(e instanceof Error ? e.message : "Erreur");
    }
  };

  const handleCancel = async (classId: string) => {
    if (!session) return;
    const bookingsResponse = await fetch("/api/bookings", {
      credentials: "include",
    });
    if (!bookingsResponse.ok) return;
    const bookings = await bookingsResponse.json();
    const booking = bookings.find((b: { classId: string }) => b.classId === classId);
    if (!booking) return;

    setBookingStatus((s) => ({ ...s, [classId]: "loading" }));
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error();
      fetchClasses();
    } catch {
      alert("Annulation impossible.");
    } finally {
      setBookingStatus((s) => ({ ...s, [classId]: "success" }));
    }
  };

  const spotsLeft = (c: ClassItem) => c.maxParticipants - c.currentParticipants;

  const badgeFor = (c: ClassItem) => {
    const left = spotsLeft(c);
    if (left <= 0) {
      return (
        <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          Complet
        </span>
      );
    }
    if (left === 1) {
      return (
        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          1 place sur {c.maxParticipants}
        </span>
      );
    }
    return (
      <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
        {left} places sur {c.maxParticipants}
      </span>
    );
  };

  return (
    <main className="px-5 sm:px-6 max-w-2xl mx-auto">
      <Reveal variant="fade-up" amount={0.15}>
      <section className="mb-10">
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-3xl font-serif italic text-primary leading-tight">
            Réserver un cours
          </h1>
          <span className="text-sm text-outline shrink-0 capitalize">
            {format(weekAnchor, "MMMM yyyy", { locale: fr })}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              const d = new Date(weekAnchor);
              d.setDate(d.getDate() - 7);
              setWeekAnchor(d);
              setSelectedDate((prev) => {
                const n = new Date(prev);
                n.setDate(n.getDate() - 7);
                return n;
              });
            }}
            className="p-2 rounded-full text-primary hover:bg-surface-container-low transition-colors"
            aria-label="Semaine précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const t = new Date();
              setWeekAnchor(t);
              setSelectedDate(t);
            }}
            className="text-xs font-semibold uppercase tracking-wide text-primary/70 hover:text-primary"
          >
            Aujourd&apos;hui
          </button>
          <button
            type="button"
            onClick={() => {
              const d = new Date(weekAnchor);
              d.setDate(d.getDate() + 7);
              setWeekAnchor(d);
              setSelectedDate((prev) => {
                const n = new Date(prev);
                n.setDate(n.getDate() + 7);
                return n;
              });
            }}
            className="p-2 rounded-full text-primary hover:bg-surface-container-low transition-colors"
            aria-label="Semaine suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-center py-3 bg-surface-container-low rounded-full px-1 sm:px-2 gap-0.5 overflow-x-auto">
          {weekDays.map((day) => {
            const active = isSameDay(day, selectedDate);
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center justify-center min-w-[2.65rem] h-12 sm:w-14 sm:h-14 rounded-full transition-all shrink-0 ${
                  active
                    ? "bg-primary text-on-primary shadow-lg scale-110"
                    : "text-on-surface-variant/55 hover:text-primary"
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-tighter">
                  {format(day, "EEE", { locale: fr }).slice(0, 3)}
                </span>
                <span className={`text-sm font-bold ${active ? "" : ""}`}>
                  {format(day, "d")}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      </Reveal>

      <section className="space-y-6 pb-8">
        <Reveal variant="slide-right" amount={0.3} delay={0.04}>
          <h2 className="text-lg font-serif text-primary/85 border-b border-outline-variant/20 pb-2">
            Séances du {format(selectedDate, "EEEE d MMMM", { locale: fr })}
          </h2>
        </Reveal>

        {loading ? (
          <p className="text-on-surface-variant text-sm py-8">Chargement…</p>
        ) : dayClasses.length === 0 ? (
          <div className="rounded-xl bg-surface-container-low p-8 text-center text-on-surface-variant text-sm">
            Aucun cours prévu ce jour-là.
          </div>
        ) : (
          dayClasses.map((c, idx) => {
            const left = spotsLeft(c);
            const muted =
              left <= 0 ? "opacity-80 bg-surface-container-low/40" : "bg-surface-container-lowest";
            const border =
              idx % 2 === 1 ? "border border-outline-variant/10 bg-surface-container-low/40" : "";

            return (
              <motion.div
                key={`${c.id}-${format(selectedDate, "yyyy-MM-dd")}`}
                className={`p-6 rounded-xl transition-shadow hover:shadow-sm ${muted} ${border}`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduce ? 0 : idx * 0.07,
                  ease: easeCanopy,
                }}
              >
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div>
                    <p className="text-primary font-serif text-xl leading-snug">{c.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-on-secondary-container/80 text-sm">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      <span>
                        {format(parseISO(c.startTime), "HH:mm")} —{" "}
                        {format(parseISO(c.endTime), "HH:mm")}
                      </span>
                      <span className="text-xs text-outline">· {c.type}</span>
                    </div>
                  </div>
                  {badgeFor(c)}
                </div>
                <div className="flex items-center gap-2 mb-6 text-outline text-sm">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span>{STUDIO}</span>
                </div>
                {session ? (
                  c.isBooked ? (
                    <button
                      type="button"
                      onClick={() => handleCancel(c.id)}
                      className="w-full bg-error-container/90 text-on-error-container py-3.5 rounded-full font-semibold tracking-wide text-sm hover:opacity-90 transition-all"
                    >
                      Annuler ma réservation
                    </button>
                  ) : left <= 0 ? (
                    <button
                      type="button"
                      disabled
                      className="w-full bg-surface-container-highest text-on-surface-variant py-3.5 rounded-full font-semibold text-sm cursor-not-allowed"
                    >
                      Complet
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBooking(c.id)}
                      disabled={bookingStatus[c.id] === "loading"}
                      className="w-full bg-primary text-on-primary py-3.5 rounded-full font-semibold tracking-wide text-sm hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
                    >
                      {bookingStatus[c.id] === "loading"
                        ? "Réservation…"
                        : "Réserver cette séance"}
                    </button>
                  )
                ) : (
                  <p className="text-center text-sm text-on-surface-variant">
                    <a href="/auth/signin" className="text-primary font-semibold underline underline-offset-2">
                      Connectez-vous
                    </a>{" "}
                    pour réserver.
                  </p>
                )}
              </motion.div>
            );
          })
        )}

        <div className="mt-12 flex justify-center opacity-[0.12] pointer-events-none">
          <span className="material-symbols-outlined text-8xl text-primary">eco</span>
        </div>
      </section>
    </main>
  );
}
