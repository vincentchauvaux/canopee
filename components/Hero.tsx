"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const quotes = [
  "Le yoga est la pratique de la tranquillité dans l'action, de la sérénité dans le chaos.",
  "Respirez. Laissez aller. Et rappelez-vous : ce moment est le seul que vous avez.",
  "Dans le silence de votre esprit, vous trouverez la paix.",
  "Le yoga est un voyage de soi, à travers soi, vers soi.",
  "Acceptez qui vous êtes. Libérez qui vous avez été.",
  "Le corps atteint ce que l'esprit croit.",
  "Le yoga est la lumière qui, une fois allumée, ne s'éteint jamais.",
  "Pratiquez et tout viendra.",
  "Le yoga est l'union de la conscience individuelle avec la conscience universelle.",
];

// URLs des images locales depuis le dossier public/images/background
const heroImages = [
  "/images/background/bg_01.jpeg",
  "/images/background/bg_02.jpeg",
];

export default function Hero() {
  const [currentQuote, setCurrentQuote] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    new Array(heroImages.length).fill(false)
  );
  const [animatedImages, setAnimatedImages] = useState<Set<number>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Changer la citation à chaque visite (uniquement côté client)
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  }, []);

  useEffect(() => {
    // Défilement automatique des images toutes les 10 secondes (augmenté pour laisser plus de temps)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % heroImages.length;
        // Marquer l'image précédente comme ayant été animée et réinitialiser la nouvelle
        setAnimatedImages((prev) => {
          const newSet = new Set(prev);
          newSet.add(prevIndex); // Marquer l'ancienne comme animée
          newSet.delete(nextIndex); // Retirer la nouvelle pour permettre la réanimation
          return newSet;
        });
        return nextIndex;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleImageError = (index: number) => {
    console.error(`Erreur de chargement de l'image ${index + 1}`);
    // Marquer l'image comme chargée pour éviter l'écran blanc
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-accent">
      {/* Images de fond avec carrousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => {
          const isActive = index === currentImageIndex && imagesLoaded[index];
          const hasBeenAnimated = animatedImages.has(index);
          // Classes d'animation Ken Burns pour chaque image
          const kenBurnsClasses = [
            "ken-burns-1",
            "ken-burns-2",
            "ken-burns-3",
            "ken-burns-4",
          ];
          const kenBurnsFinalClasses = [
            "ken-burns-final-1",
            "ken-burns-final-2",
            "ken-burns-final-3",
            "ken-burns-final-4",
          ];
          const kenBurnsClass = kenBurnsClasses[index % kenBurnsClasses.length];
          const kenBurnsFinalClass =
            kenBurnsFinalClasses[index % kenBurnsFinalClasses.length];

          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-[5000ms] ease-out ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className={`absolute inset-0 w-full h-full ${
                  isActive
                    ? kenBurnsClass
                    : hasBeenAnimated
                    ? kenBurnsFinalClass
                    : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`Image hero ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  sizes="100vw"
                  unoptimized={false}
                />
              </div>
              <div className="absolute inset-0 bg-black/40" />
            </div>
          );
        })}
        {/* Fond de secours pendant le chargement */}
        {!imagesLoaded[currentImageIndex] && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent" />
        )}
      </div>

      {/* Contenu */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animate-fade-in">
          Bienvenue à Canopée
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">
          Trouvez votre équilibre, votre paix intérieure
        </p>

        {/* Citation */}
        {isMounted && currentQuote && (
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-card border border-white/20">
            <p className="text-lg md:text-xl italic font-serif">
              &ldquo;{currentQuote}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}
