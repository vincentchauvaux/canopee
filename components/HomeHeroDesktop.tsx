"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_MS = 6500;

const SLIDES = [
  {
    src: "/images/background/bg_01.jpeg",
    alt: "Espace de yoga chaleureux, lumière douce",
    kicker: "Canopée",
    title: "Votre studio de Yin Yoga",
    subtitle:
      "Un tempo lent, une écoute bienveillante, une communauté au cœur de Wauthier-Braine.",
    cta: { href: "/auth/signin", label: "S'inscrire" },
  },
  {
    src: "/images/background/bg_02.jpeg",
    alt: "Salle de cours, planchers bois et atmosphère zen",
    kicker: "Planning",
    title: "Réservez votre séance",
    subtitle:
      "Cours individuels ou petits groupes : consultez les créneaux et choisissez votre moment.",
    cta: { href: "/agenda", label: "Voir l'agenda" },
  },
];

const slideSpring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.9,
};

/** = Tailwind `rounded-b-3xl` : clip-path tient pendant les `transform` du rail (Chrome / Safari). */
const MASK_CLIP = "inset(0 round 0 0 1.5rem 1.5rem)" as const;

export default function HomeHeroDesktop() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const len = SLIDES.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + len) % len);
    },
    [len]
  );

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [go, reduce]);

  /** % de la largeur du rail ( = len × largeur du masque ) : une vitrine = 100% / len du rail */
  const xPercent = -(index * 100) / len;

  return (
    <section
      className="hidden lg:block relative w-full mb-12 md:mb-14 rounded-b-3xl shadow-[0_24px_48px_rgba(26,28,21,0.08)]"
      aria-label="Présentation Canopée"
    >
      {/*
        Masque fixe : clip-path + overflow sur le conteneur qui ne bouge pas.
        Seul l’enfant translate : sans clip-path, certains moteurs « perdent » le radius pendant la transition.
      */}
      <div
        className="relative isolate h-[min(52vh,480px)] min-h-[320px] w-full overflow-hidden rounded-b-3xl bg-primary [contain:paint]"
        style={{
          clipPath: MASK_CLIP,
          WebkitClipPath: MASK_CLIP,
        }}
      >
        <div className="h-full w-full overflow-hidden rounded-b-3xl">
        <motion.div
          className="flex h-full will-change-transform"
          style={{ width: `${len * 100}%` }}
          initial={false}
          animate={{ x: `${xPercent}%` }}
          transition={reduce ? { duration: 0 } : slideSpring}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className="relative h-full shrink-0 overflow-hidden"
              style={{ width: `${100 / len}%` }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={i === 0}
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-primary/88 via-primary/55 to-primary/20 pointer-events-none"
                aria-hidden
              />
              <div className="absolute inset-0 flex items-end sm:items-center pointer-events-none">
                <div className="w-full px-8 xl:px-14 pb-12 sm:pb-0 max-w-6xl mx-auto pointer-events-auto">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-on-primary/70 mb-3">
                    {slide.kicker}
                  </p>
                  <h2 className="font-serif text-4xl xl:text-5xl text-on-primary leading-[1.08] max-w-xl mb-4">
                    {slide.title}
                  </h2>
                  <p className="font-sans text-on-primary/90 text-sm xl:text-base max-w-md leading-relaxed mb-8">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.cta.href}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-surface-container-lowest px-8 py-3.5 font-sans text-sm font-semibold text-primary shadow-md hover:bg-white transition-colors"
                  >
                    {slide.cta.label}
                    <span className="material-symbols-outlined text-lg">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-t from-surface/40 to-transparent"
          aria-hidden
        />

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 z-[2] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-on-primary/10 text-on-primary backdrop-blur-md transition-colors hover:bg-on-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-primary/60"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 z-[2] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-on-primary/10 text-on-primary backdrop-blur-md transition-colors hover:bg-on-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-primary/60"
          aria-label="Slide suivant"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>

        <div
          className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 gap-2"
          role="tablist"
          aria-label="Choisir une diapositive"
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Diapositive ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-on-primary"
                  : "w-2 bg-on-primary/40 hover:bg-on-primary/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
