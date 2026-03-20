"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePic?: string | null;
  authProvider: string;
  role: string;
  createdAt: string;
  lastLogin?: string | null;
  _count?: {
    bookings?: number;
  };
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as { role?: string }).role !== "admin") {
      router.push("/");
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur lors du chargement");

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return user.email.split("@")[0];
  };

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

        <div className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-secondary-container mb-2">
            Administration
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary leading-tight mb-2">
            Membres
          </h1>
          <p className="text-on-surface-variant font-sans text-sm md:text-base max-w-xl">
            Liste des comptes et des rôles.
          </p>
        </div>

        {users.length === 0 ? (
          <div className="rounded-xl bg-surface-container-low p-12 text-center text-on-surface-variant font-sans">
            Aucun utilisateur pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-outline-variant/20 bg-secondary-container">
                    {user.profilePic ? (
                      <Image
                        src={user.profilePic}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-serif text-lg font-bold text-primary">
                        {getUserName(user).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-lg font-bold text-on-surface truncate">
                      {getUserName(user)}
                    </h2>
                    <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5 font-sans truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-primary/70" />
                      {user.email}
                    </p>
                    <p className="text-xs text-outline capitalize mt-1 font-sans">
                      {user.authProvider}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 sm:gap-8 items-center justify-between sm:justify-end font-sans text-sm">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Inscrit
                      </p>
                      <p className="text-on-surface text-sm flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-primary/70" />
                        {format(new Date(user.createdAt), "d MMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Dernière connexion
                      </p>
                      <p className="text-on-surface text-sm mt-0.5">
                        {user.lastLogin
                          ? format(new Date(user.lastLogin), "d MMM yyyy", {
                              locale: fr,
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                      user.role === "admin"
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-highest text-on-surface-variant"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    {user.role === "admin" ? "Admin" : "Membre"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
