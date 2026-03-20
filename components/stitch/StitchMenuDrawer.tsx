"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { X } from "lucide-react";

interface StitchMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function StitchMenuDrawer({
  open,
  onClose,
}: StitchMenuDrawerProps) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  if (!open) return null;

  const linkClass =
    "block py-3.5 text-base font-medium text-primary border-b border-outline-variant/10 hover:bg-surface-container-low/80 transition-colors px-1 -mx-1 rounded-lg";

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-on-surface/25 backdrop-blur-[2px]"
        aria-label="Fermer le menu"
        onClick={onClose}
      />
      <aside
        className="fixed top-0 left-0 z-[70] h-full w-[min(100%,20rem)] bg-surface shadow-canopee-deep overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/15">
          <span className="font-serif text-lg font-semibold tracking-wide italic text-primary">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-primary hover:bg-surface-container-low"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 font-sans" onClick={onClose}>
          <Link href="/mon-parcours" className={linkClass}>
            Mon parcours
          </Link>
          <Link href="/yin-yoga" className={linkClass}>
            Yin Yoga
          </Link>
          <Link href="/saisons-mtc" className={linkClass}>
            Saisons MTC
          </Link>
          <Link href="/faq" className={linkClass}>
            FAQ
          </Link>
          <Link href="/infos" className={linkClass}>
            Infos pratiques &amp; tarifs
          </Link>
          {isAdmin && (
            <Link href="/admin/classes" className={linkClass}>
              Gérer les cours
            </Link>
          )}
          <div className="pt-6 mt-4 border-t border-outline-variant/15">
            {session ? (
              <>
                <Link href="/profile" className={linkClass}>
                  Mon profil
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    signOut({ callbackUrl: "/" });
                  }}
                  className={`${linkClass} w-full text-left border-none`}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  signIn();
                }}
                className={`${linkClass} w-full text-left border-none`}
              >
                Connexion / Inscription
              </button>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
