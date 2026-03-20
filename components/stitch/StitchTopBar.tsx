"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import StitchMenuDrawer from "./StitchMenuDrawer";

export default function StitchTopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith("/auth")) {
    return null;
  }

  const profilePic = (session?.user as { image?: string; profilePic?: string })
    ?.profilePic;
  const image = session?.user?.image || profilePic;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-6 py-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity rounded-full p-1 -ml-1"
          aria-label="Ouvrir le menu"
        >
          <span className="material-symbols-outlined text-2xl text-primary">
            spa
          </span>
        </button>
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-xl sm:text-2xl font-semibold tracking-[0.14em] italic text-primary hover:opacity-90 transition-opacity"
        >
          Canopée
        </Link>
        <div className="w-10 h-10 flex items-center justify-end shrink-0">
          {session ? (
            <Link
              href="/profile"
              className="relative w-10 h-10 rounded-full overflow-hidden bg-secondary-container ring-2 ring-outline-variant/20 hover:ring-primary/30 transition-all"
              aria-label="Profil"
            >
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-primary">
                  {(session.user?.name || session.user?.email || "?")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </Link>
          ) : (
            <span className="w-6" aria-hidden />
          )}
        </div>
      </header>
      <StitchMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
