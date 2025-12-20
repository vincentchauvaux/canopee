"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import MoonPhase from "./MoonPhase";

interface LunarPhase {
  phase: string;
  illumination?: number | null;
  distance?: string | null;
  nextFullMoon?: number | null;
}

interface MTCSeason {
  season: string;
  element: string;
  description: string;
}

export default function Footer() {
  const [lunarPhase, setLunarPhase] = useState<LunarPhase | null>(null);
  const [quoteOfDay, setQuoteOfDay] = useState<string>("");
  const [mtcSeason, setMtcSeason] = useState<MTCSeason | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const dailyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour récupérer la phase lunaire depuis lunopia.com
  const fetchLunarPhase = async (): Promise<LunarPhase | null> => {
    try {
      const response = await fetch("/api/lunar", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données lunaires");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching lunar phase:", error);
      return null;
    }
  };

  // Fonction pour déterminer la saison MTC selon les dates 2025
  const getMTCSeason = (): MTCSeason => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();

    // Dates pour 2025
    // Intersaison : 16 janvier – 2 février, 16 avril – 4 mai, 19 juillet – 4 août, 19 octobre – 6 novembre
    if (
      (month === 1 && day >= 16) ||
      (month === 2 && day <= 2) ||
      (month === 4 && day >= 16) ||
      (month === 5 && day <= 4) ||
      (month === 7 && day >= 19) ||
      (month === 8 && day <= 4) ||
      (month === 10 && day >= 19) ||
      (month === 11 && day <= 6)
    ) {
      return {
        season: "Intersaison",
        element: "Terre",
        description: "Énergie de transformation et de stabilité",
      };
    }

    // Printemps (Bois) : 3 février – 15 avril 2025
    if (
      (month === 2 && day >= 3) ||
      month === 3 ||
      (month === 4 && day <= 15)
    ) {
      return {
        season: "Printemps",
        element: "Bois",
        description: "Énergie de croissance et de renouveau",
      };
    }

    // Été (Feu) : 5 mai – 18 juillet 2025
    if (
      (month === 5 && day >= 5) ||
      month === 6 ||
      (month === 7 && day <= 18)
    ) {
      return {
        season: "Été",
        element: "Feu",
        description: "Énergie d'expansion et de joie",
      };
    }

    // Automne (Métal) : 5 août – 18 octobre 2025
    if (
      (month === 8 && day >= 5) ||
      month === 9 ||
      (month === 10 && day <= 18)
    ) {
      return {
        season: "Automne",
        element: "Métal",
        description: "Énergie de récolte et de lâcher-prise",
      };
    }

    // Hiver (Eau) : 7 novembre 2025 – 20 janvier 2026
    // Note: après le 15 janvier, c'est l'intersaison jusqu'au 2 février
    if (
      (month === 11 && day >= 7) ||
      month === 12 ||
      (month === 1 && day <= 15)
    ) {
      return {
        season: "Hiver",
        element: "Eau",
        description: "Énergie de repos et de conservation",
      };
    }

    // Par défaut (ne devrait pas arriver)
    return {
      season: "Intersaison",
      element: "Terre",
      description: "Énergie de transformation et de stabilité",
    };
  };

  // Fonction pour mettre à jour toutes les informations
  const updateSpiritualInfo = useCallback(async () => {
    // Récupérer la phase lunaire depuis lunopia.com
    const lunarData = await fetchLunarPhase();
    if (lunarData) {
      setLunarPhase(lunarData);
    }

    setMtcSeason(getMTCSeason());

    // Citation du jour (basée sur la date pour qu'elle change chaque jour)
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    const quotes = [
      "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur.",
      "Respirez profondément et laissez la paix vous envahir.",
      "Le yoga est un cadeau que vous vous offrez chaque jour.",
      "Dans le silence, vous trouverez la réponse.",
      "Chaque respiration est une nouvelle opportunité.",
      "L'équilibre se trouve dans l'acceptation.",
      "Le présent est le seul moment qui existe vraiment.",
      "Laissez votre corps guider votre esprit.",
    ];
    setQuoteOfDay(quotes[dayOfYear % quotes.length]);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());
    // Mettre à jour les informations au chargement
    updateSpiritualInfo();

    // Mettre à jour toutes les heures pour la phase lunaire
    const hourlyInterval = setInterval(() => {
      updateSpiritualInfo();
    }, 60 * 60 * 1000); // 1 heure

    // Mettre à jour chaque jour à minuit pour la saison MTC et la citation
    const scheduleDailyUpdate = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      const dailyTimeout = setTimeout(() => {
        updateSpiritualInfo();
        // Ensuite, mettre à jour toutes les 24 heures
        dailyIntervalRef.current = setInterval(() => {
          updateSpiritualInfo();
        }, 24 * 60 * 60 * 1000);
      }, msUntilMidnight);

      return dailyTimeout;
    };

    const dailyTimeout = scheduleDailyUpdate();

    return () => {
      clearInterval(hourlyInterval);
      clearTimeout(dailyTimeout);
      if (dailyIntervalRef.current) {
        clearInterval(dailyIntervalRef.current);
      }
    };
  }, [updateSpiritualInfo]);

  return (
    <footer className="bg-text-dark text-text-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 ">
          {/* Colonne 1: Logo + Tagline */}
          <div className="flex flex-col h-full">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-4">🌿 Canopée</h3>
              <p className="text-text-light/80 mb-4">
                Votre espace de bien-être et de sérénité
              </p>
            </div>
            <div className="mt-auto">
              {quoteOfDay && (
                <div className="mb-4">
                  <p className="text-sm italic text-text-light/80">
                    &ldquo;{quoteOfDay}&rdquo;
                  </p>
                </div>
              )}
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          {/* Colonne 2: Navigation */}
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-text-light/80 hover:text-primary transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/mon-parcours"
                  className="text-text-light/80 hover:text-primary transition-colors"
                >
                  Mon parcours
                </Link>
              </li>
              <li>
                <Link
                  href="/yin-yoga"
                  className="text-text-light/80 hover:text-primary transition-colors"
                >
                  Yin Yoga
                </Link>
              </li>
              <li>
                <Link
                  href="/saisons-mtc"
                  className="text-text-light/80 hover:text-primary transition-colors"
                >
                  Saisons MTC
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3: Contact */}
          <div className="flex flex-col"></div>
          {/* Colonne 4: Infos Spirituelles */}
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold mb-4">Infos Spirituelles</h4>
            <div className="flex flex-col gap-4 flex-1">
              {/* Phase lunaire - toujours afficher avec le composant MoonPhase */}
              <div className="flex items-center gap-3">
                <MoonPhase size={60} className="flex-shrink-0" />
                <div className="flex flex-col">
                  {lunarPhase?.illumination !== null &&
                  lunarPhase?.illumination !== undefined ? (
                    <p className="text-2xl font-bold text-text-light">
                      {Math.round(lunarPhase.illumination)}%
                    </p>
                  ) : null}
                  {lunarPhase?.phase ? (
                    <p className="text-sm text-text-light/80 uppercase">
                      {lunarPhase.phase}
                    </p>
                  ) : (
                    <p className="text-sm text-text-light/80 uppercase">
                      Chargement...
                    </p>
                  )}
                </div>
              </div>
              {/* Saison MTC - toujours afficher */}
              {mtcSeason ? (
                <div>
                  <p className="font-medium text-sm">
                    {mtcSeason.season} ({mtcSeason.element})
                  </p>
                  <p className="text-xs text-text-light/60 italic mb-2">
                    {mtcSeason.description}
                  </p>
                  <Link
                    href="/saisons-mtc"
                    className="text-xs text-text-light/60 hover:text-primary transition-colors underline"
                  >
                    En savoir plus sur les saisons MTC
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-text-light/60">
                    Chargement de la saison...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-text-light/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-text-light/60">
            <p suppressHydrationWarning>
              ©{" "}
              {isMounted && currentYear
                ? currentYear
                : new Date().getFullYear()}{" "}
              Canopée. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-text-light transition-colors">
                Mentions légales
              </a>
              <a href="#" className="hover:text-text-light transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
