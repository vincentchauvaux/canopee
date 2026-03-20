"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StitchAuxFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/auth")) return null;

  return (
    <footer className="border-t border-outline-variant/15 bg-surface-container-low/50">
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-[calc(6.75rem+env(safe-area-inset-bottom,0px))] text-center">
        <p className="font-serif italic text-primary/70 text-sm mb-4">
          Canopée — Yin Yoga à Wauthier-Braine
        </p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-sans text-on-surface-variant uppercase tracking-wider">
          <Link href="/mon-parcours" className="hover:text-primary transition-colors">
            Parcours
          </Link>
          <Link href="/yin-yoga" className="hover:text-primary transition-colors">
            Yin Yoga
          </Link>
          <Link href="/infos" className="hover:text-primary transition-colors">
            Infos
          </Link>
          <Link href="/saisons-mtc" className="hover:text-primary transition-colors">
            MTC
          </Link>
        </div>
      </div>
    </footer>
  );
}
