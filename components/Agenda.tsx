"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Clock, User } from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
} from "date-fns";
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

export default function Agenda() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [today, setToday] = useState<Date | null>(null);
  const [classFormOpen, setClassFormOpen] = useState(false);
  const [classFormInitialDate, setClassFormInitialDate] = useState<
    string | null
  >(null);

  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  useEffect(() => {
    setToday(new Date());
  }, []);

  // Calculer les dates de la semaine/mois
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Calculer les dates du mois
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthStartWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthEndWeek = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({
    start: monthStartWeek,
    end: monthEndWeek,
  });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const start = view === "week" ? weekStart : monthStartWeek;
      const end = view === "week" ? weekEnd : monthEndWeek;

      const response = await fetch(
        `/api/classes?startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("Erreur lors du chargement des cours");

      const data = await response.json();

      setClasses(data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des cours");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, view]);

  const handleClassFormClose = () => {
    setClassFormOpen(false);
    setClassFormInitialDate(null);
    fetchClasses();
  };

  const openCreateClassForDay = (day: Date) => {
    setClassFormInitialDate(format(day, "yyyy-MM-dd"));
    setClassFormOpen(true);
  };

  const getClassesForDay = (day: Date) => {
    return classes.filter((cls) => {
      const classDate = parseISO(cls.date);
      return isSameDay(classDate, day);
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const classTypes = Array.from(new Set(classes.map((c) => c.type)));
  const classTypeColors: Record<string, string> = {};
  classes.forEach((c) => {
    if (!classTypeColors[c.type]) {
      classTypeColors[c.type] = c.color;
    }
  });

  return (
    <section id="agenda" className="py-20 bg-accent overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-dark mb-4">
            Notre Agenda
          </h2>
          <p className="text-lg text-text-dark/80 max-w-2xl mx-auto">
            Découvrez les cours
          </p>
          {isAdmin && (
            <p className="text-sm text-primary mt-3 max-w-2xl mx-auto">
              En tant qu&apos;administrateur, cliquez sur un jour du calendrier
              pour créer un cours à cette date.
            </p>
          )}
        </div>

        {/* Contrôles */}
        <div className="bg-white rounded-card p-4 sm:p-6 shadow-lg mb-6 overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 w-full min-w-0">
              <button
                type="button"
                onClick={() => navigateWeek("prev")}
                className="shrink-0 p-2 hover:bg-accent rounded-button"
                aria-label="Période précédente"
              >
                ←
              </button>
              <span className="flex-1 min-w-0 text-center font-semibold text-sm sm:text-base leading-snug px-1">
                {view === "week"
                  ? `${format(weekStart, "d MMM", { locale: fr })} - ${format(weekEnd, "d MMM yyyy", { locale: fr })}`
                  : format(selectedDate, "MMMM yyyy", { locale: fr })}
              </span>
              <button
                type="button"
                onClick={() => navigateWeek("next")}
                className="shrink-0 p-2 hover:bg-accent rounded-button"
                aria-label="Période suivante"
              >
                →
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedDate(new Date())}
                className="w-full sm:w-auto px-4 py-2 bg-secondary text-white rounded-button hover:bg-secondary-light transition-colors text-center"
              >
                Aujourd&apos;hui
              </button>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setView("week")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-button transition-colors ${
                    view === "week"
                      ? "bg-primary text-white"
                      : "bg-gray text-text-dark hover:bg-gray/80"
                  }`}
                >
                  Semaine
                </button>
                <button
                  type="button"
                  onClick={() => setView("month")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-button transition-colors ${
                    view === "month"
                      ? "bg-primary text-white"
                      : "bg-gray text-text-dark hover:bg-gray/80"
                  }`}
                >
                  Mois
                </button>
              </div>
            </div>
          </div>

          {/* Légende des types de cours */}
          {classTypes.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {classTypes.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: classTypeColors[type] || "#264E36",
                    }}
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
          <div className="bg-white rounded-card p-3 sm:p-6 shadow-lg overflow-hidden">
            {view === "week" ? (
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weekDays.map((day, index) => {
                  const dayClasses = getClassesForDay(day);
                  const isToday = today ? isSameDay(day, today) : false;

                  return (
                    <div
                      key={index}
                      role={isAdmin ? "button" : undefined}
                      tabIndex={isAdmin ? 0 : undefined}
                      onClick={
                        isAdmin ? () => openCreateClassForDay(day) : undefined
                      }
                      onKeyDown={
                        isAdmin
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openCreateClassForDay(day);
                              }
                            }
                          : undefined
                      }
                      title={
                        isAdmin
                          ? "Ajouter un cours à cette date"
                          : undefined
                      }
                      className={`border rounded-card p-3 min-h-[200px] ${
                        isToday
                          ? "border-primary border-2 bg-accent/30"
                          : "border-gray"
                      } ${
                        isAdmin
                          ? "cursor-pointer hover:ring-2 hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                          : ""
                      }`}
                    >
                      <div className="mb-3">
                        <div className="text-xs text-text-dark/60 uppercase">
                          {format(day, "EEE", { locale: fr })}
                        </div>
                        <div
                          className={`text-lg font-semibold ${
                            isToday ? "text-primary" : "text-text-dark"
                          }`}
                        >
                          {format(day, "d")}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {dayClasses.map((cls) => (
                          <div
                            key={cls.id}
                            role="presentation"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded text-xs"
                            style={{
                              backgroundColor: `${cls.color}20`,
                              borderLeft: `3px solid ${cls.color}`,
                            }}
                          >
                            <div className="font-semibold mb-1">
                              {cls.title}
                            </div>
                            <div className="flex items-center gap-1 text-text-dark/60 mb-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {format(parseISO(cls.startTime), "HH:mm")} -{" "}
                                {format(parseISO(cls.endTime), "HH:mm")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-text-dark/60">
                              <User className="w-3 h-3" />
                              <span>{cls.instructor}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="min-w-0">
                {/* En-têtes des jours de la semaine */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                    (dayName) => (
                      <div
                        key={dayName}
                        className="text-center text-[10px] sm:text-sm font-semibold text-text-dark/70 py-1 sm:py-2"
                      >
                        {dayName}
                      </div>
                    ),
                  )}
                </div>
                {/* Grille du mois */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {monthDays.map((day, index) => {
                    const dayClasses = getClassesForDay(day);
                    const isToday = today ? isSameDay(day, today) : false;
                    const isCurrentMonth =
                      day.getMonth() === selectedDate.getMonth();

                    return (
                      <div
                        key={index}
                        role={isAdmin ? "button" : undefined}
                        tabIndex={isAdmin ? 0 : undefined}
                        onClick={
                          isAdmin ? () => openCreateClassForDay(day) : undefined
                        }
                        onKeyDown={
                          isAdmin
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  openCreateClassForDay(day);
                                }
                              }
                            : undefined
                        }
                        title={
                          isAdmin
                            ? "Ajouter un cours à cette date"
                            : undefined
                        }
                        className={`border rounded-card p-1 sm:p-2 min-h-[72px] sm:min-h-[120px] ${
                          isToday
                            ? "border-primary border-2 bg-accent/30"
                            : isCurrentMonth
                              ? "border-gray"
                              : "border-gray/30 bg-gray/10"
                        } ${
                          isAdmin
                            ? "cursor-pointer hover:ring-2 hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary"
                            : ""
                        }`}
                      >
                        <div className="mb-2">
                          <div
                            className={`text-xs sm:text-sm font-semibold ${
                              isToday
                                ? "text-primary"
                                : isCurrentMonth
                                  ? "text-text-dark"
                                  : "text-text-dark/40"
                            }`}
                          >
                            {format(day, "d")}
                          </div>
                        </div>

                        <div className="space-y-1">
                          {dayClasses.slice(0, 2).map((cls) => (
                            <div
                              key={cls.id}
                              role="presentation"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded text-xs"
                              style={{
                                backgroundColor: `${cls.color}20`,
                                borderLeft: `2px solid ${cls.color}`,
                              }}
                            >
                              <div className="font-semibold truncate">
                                {cls.title}
                              </div>
                              <div className="text-text-dark/60 text-[10px]">
                                {format(parseISO(cls.startTime), "HH:mm")}
                              </div>
                            </div>
                          ))}
                          {dayClasses.length > 2 && (
                            <div className="text-xs text-text-dark/60 text-center pt-1">
                              +{dayClasses.length - 2} autre
                              {dayClasses.length - 2 > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {isAdmin && classFormOpen && (
          <ClassFormModal
            classItem={null}
            isOpen={classFormOpen}
            onClose={handleClassFormClose}
            initialDate={classFormInitialDate}
          />
        )}
      </div>
    </section>
  );
}
