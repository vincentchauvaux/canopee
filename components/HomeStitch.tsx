"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import HomeHeroDesktop from "@/components/HomeHeroDesktop";
import PublicNewsBento from "@/components/PublicNewsBento";
import { Reveal } from "@/components/motion/Reveal";
import { easeCanopy } from "@/components/motion/easings";

const quotes = [
  "Dans le silence de la Canopée, on apprend à écouter son propre rythme.",
  "La lenteur n'est pas une faiblesse : c'est une forme d'attention.",
  "Chaque expiration est une petite confiance rendue au corps.",
];

export default function HomeStitch() {
  const [quote, setQuote] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <>
      <HomeHeroDesktop />
      <main className="px-5 sm:px-6 max-w-2xl mx-auto space-y-14 md:space-y-16 pb-8">
      <motion.section
        className="space-y-4 pt-2 will-change-transform"
        initial={reduce ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: easeCanopy, delay: reduce ? 0 : 0.06 }}
      >
        <span className="font-sans text-on-secondary-container uppercase tracking-[0.22em] text-[10px] font-bold">
          Bienvenue au sanctuaire
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-primary leading-[1.1]">
          Retrouvez votre équilibre intérieur.
        </h1>
        <motion.div
          className="h-1 w-12 bg-primary/20 rounded-full origin-left"
          initial={reduce ? false : { scaleX: 0.2, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: easeCanopy, delay: reduce ? 0 : 0.28 }}
        />
      </motion.section>

      <PublicNewsBento />

      <Reveal variant="soft-zoom" amount={0.2}>
      <section className="relative bg-primary text-on-primary rounded-xl p-8 md:p-12 overflow-x-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:gap-10 lg:gap-12">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-tertiary-fixed text-2xl filled-icon"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dark_mode
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-primary/70">
                Focus pratique
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif italic leading-tight">
              L&apos;art du Yin Yoga
            </h2>
            <p className="text-on-primary/85 font-sans leading-relaxed text-sm md:text-base max-w-prose">
              À l&apos;opposé des pratiques dynamiques, le Yin Yoga invite à
              l&apos;immobilité et au lâcher-prise. Postures tenues longuement
              pour les tissus profonds et la détente des tensions.
            </p>
            <div className="flex flex-row flex-nowrap items-center gap-3 sm:gap-4 pt-2 overflow-x-auto min-h-[3rem] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link
                href="/#agenda"
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-surface-container-lowest text-primary px-5 sm:px-8 py-3 rounded-full font-sans text-xs sm:text-sm font-semibold hover:bg-white transition-colors"
              >
                Voir l&apos;agenda
                <span className="material-symbols-outlined text-lg shrink-0">arrow_forward</span>
              </Link>
              <Link
                href="/yin-yoga"
                className="inline-flex shrink-0 items-center whitespace-nowrap text-on-primary/90 text-xs sm:text-sm font-semibold underline underline-offset-4 hover:text-white"
              >
                En savoir plus
              </Link>
            </div>
          </div>
          <div className="hidden shrink-0 md:flex w-full max-w-[11rem] md:w-44 h-48 flex-col justify-between rounded-xl border border-white/10 bg-white/10 p-4 text-on-primary backdrop-blur-md">
            <div className="flex items-start justify-between gap-2">
              <span className="material-symbols-outlined shrink-0">timer</span>
              <span className="text-xs font-sans tabular-nums">60 min</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider opacity-60 font-sans">
                Rythme
              </p>
              <p className="text-sm font-serif leading-snug">Collectif vendredi</p>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {quote && (
        <Reveal variant="fade" delay={0.06}>
          <section className="text-center py-6">
            <span className="material-symbols-outlined text-primary/20 text-4xl mb-3 block">
              format_quote
            </span>
            <blockquote className="font-serif italic text-lg md:text-xl text-primary/85 max-w-md mx-auto leading-relaxed">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <cite className="block mt-4 font-sans text-[10px] uppercase tracking-widest text-on-surface-variant not-italic">
              — L&apos;esprit Canopée
            </cite>
          </section>
        </Reveal>
      )}
    </main>
    </>
  );
}
