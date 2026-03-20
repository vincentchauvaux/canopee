"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerChildren, StaggerItem } from "@/components/motion/Stagger";
import {
  Info,
  ShoppingBag,
  Package,
  Heart,
  Leaf,
  Clock,
  MapPin,
  User,
  Moon,
  ArrowRight,
} from "lucide-react";

export default function PracticalInfo() {
  return (
    <section id="infos" className="py-20 md:py-24 bg-surface-container-low">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <Reveal variant="soft-zoom" amount={0.15}>
        <section className="relative mb-16 md:mb-20 overflow-hidden rounded-xl bg-primary px-8 py-10 md:px-12 md:py-14 text-on-primary shadow-ambient-float">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-container/30 blur-3xl" />
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="flex items-center gap-3">
              <Moon className="h-6 w-6 text-tertiary-fixed" strokeWidth={1.5} />
              <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-on-primary/70">
                Focus pratique
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl italic leading-tight">
              L&apos;art du Yin Yoga
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-on-primary/85 font-sans">
              À l&apos;opposé des pratiques dynamiques, le Yin Yoga invite à
              l&apos;immobilité et au lâcher-prise. Postures tenues longuement
              pour atteindre les tissus profonds et libérer les tensions.
            </p>
            <div className="pt-2">
              <Link
                href="/yin-yoga"
                className="inline-flex items-center gap-2 rounded-full bg-surface-container-lowest px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white font-sans"
              >
                En savoir plus
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal variant="fade-up" delay={0.05}>
          <div className="mb-12 text-center md:text-left">
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-3">
              Cours de Yin Yoga
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto md:mx-0 italic font-sans text-base">
              Inspiré du yoga taoïste et de la médecine traditionnelle chinoise
            </p>
          </div>
        </Reveal>

        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-16"
          stagger={0.14}
        >
          <StaggerItem>
          <div className="space-y-8 rounded-xl bg-surface-container-lowest p-8 shadow-canopee-soft">
            <div>
              <h3 className="font-serif text-xl text-primary mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" strokeWidth={1.75} />
                Son action sur
              </h3>
              <ul className="space-y-3 text-on-surface-variant font-sans text-sm leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Les tissus profonds (articulations, fascias…)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>
                    La pleine conscience de ses sensations physiques et
                    mentales
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Les méridiens</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl text-primary mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-secondary" strokeWidth={1.75} />
                Peut répondre à
              </h3>
              <ul className="space-y-3 text-on-surface-variant font-sans text-sm leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Une vie trop stressante → trop yang</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Des tensions dans le corps</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">•</span>
                  <span>Un sentiment de déséquilibre généralisé</span>
                </li>
              </ul>
            </div>
          </div>
          </StaggerItem>

          <StaggerItem>
          <div className="rounded-xl bg-surface-container-lowest p-8 shadow-canopee-soft outline outline-1 outline-outline-variant/10">
            <h3 className="font-serif text-2xl text-primary mb-6">
              Infos pratiques
            </h3>
            <div className="space-y-5 font-sans text-sm">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-on-surface">Horaires</p>
                  <p className="text-on-surface-variant mt-0.5">
                    Le vendredi de 18h à 19h
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-on-surface">Adresse</p>
                  <p className="text-on-surface-variant mt-0.5">
                    Rue Jean Theys, 10 — 1440 Wauthier-Braine
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <User className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-on-surface">Professeure</p>
                  <p className="text-on-surface-variant mt-0.5">
                    Carol Nelissen
                    <br />
                    <span className="text-xs italic">
                      Certifiée E.T.Y. et Karma Yoga Institute — Membre ABEFY
                    </span>
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href="/yin-yoga"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity text-sm"
                >
                  Page dédiée au Yin Yoga
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          </StaggerItem>
        </StaggerChildren>

        <Reveal variant="fade" delay={0.04}>
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-primary">
              Informations pratiques
            </h2>
          </div>
        </Reveal>

        <StaggerChildren
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          stagger={0.11}
        >
          <StaggerItem>
          <div className="rounded-xl bg-surface-container-lowest p-8 shadow-canopee-soft hover:shadow-ambient-float transition-shadow">
            <ShoppingBag className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-serif text-xl text-primary mb-3">Tarifs</h3>
            <ul className="text-on-surface-variant space-y-2 text-sm font-sans leading-relaxed">
              <li>
                <strong className="text-on-surface">Individuel :</strong> 15 € /
                séance
              </li>
              <li>
                <strong className="text-on-surface">Collectif :</strong> 12 € /
                séance
              </li>
            </ul>
          </div>
          </StaggerItem>
          <StaggerItem>
          <div className="rounded-xl bg-surface-container-lowest p-8 shadow-canopee-soft hover:shadow-ambient-float transition-shadow">
            <Package className="w-10 h-10 text-secondary mb-4" />
            <h3 className="font-serif text-xl text-primary mb-3">Matériel</h3>
            <p className="text-on-surface-variant text-sm font-sans leading-relaxed">
              Tapis et accessoires fournis. Une tenue confortable suffit.
            </p>
          </div>
          </StaggerItem>
          <StaggerItem>
          <div className="rounded-xl bg-surface-container-lowest p-8 shadow-canopee-soft hover:shadow-ambient-float transition-shadow">
            <Info className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-serif text-xl text-primary mb-3">Pour débuter</h3>
            <p className="text-on-surface-variant text-sm font-sans leading-relaxed">
              Cours adaptés aux débutants, encadrement bienveillant pas à pas.
            </p>
          </div>
          </StaggerItem>
        </StaggerChildren>
      </div>
    </section>
  );
}
