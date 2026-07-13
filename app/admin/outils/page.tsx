"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import YogaTimer from "@/components/admin/YogaTimer";
import MusicPlayer from "@/components/admin/MusicPlayer";

export default function AdminOutilsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const userRole = (session.user as { role?: string })?.role;
    if (userRole !== "admin") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-dark/60">Chargement...</p>
      </div>
    );
  }

  if (!session || (session.user as { role?: string }).role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-accent py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary-light"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au panel admin
          </Link>
          <h1 className="mb-2 font-serif text-4xl font-bold text-text-dark">
            Outils cours
          </h1>
          <p className="text-text-dark/60">
            Minuteur circulaire et musique zen pour accompagner vos séances.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <YogaTimer />
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
