"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const quotes = [
  "Le yoga est la pratique de la tranquillité dans l'action, de la sérénité dans le chaos.",
  "Respirez. Laissez aller. Et rappelez-vous : ce moment est le seul que vous avez.",
  "Le yoga n'est pas de toucher vos orteils, c'est ce que vous apprenez en chemin.",
  "Dans le silence de votre esprit, vous trouverez la paix.",
  "Le yoga est un voyage de soi, à travers soi, vers soi.",
  "Acceptez qui vous êtes. Libérez qui vous avez été. Devenez qui vous êtes.",
  "Le corps atteint ce que l'esprit croit.",
  "Le yoga est la lumière qui, une fois allumée, ne s'éteint jamais.",
  "Pratiquez et tout viendra.",
  "Le yoga est l'union de la conscience individuelle avec la conscience universelle.",
];

// URLs des images locales depuis le dossier public/images/background
const heroImages = [
  "/images/background/emm.kayy_yoga_studio_with_warm_atmosphere_wooden_floor_and_soft_c838b1ef-a91b-43e8-85f2-37095cf211ef.png",
  "/images/background/little.puffy_A_serene_minimalist_indoor_meditation_space_with_s_ae53c4bc-42fd-44b7-a47d-24f8c250af01.png",
  "/images/background/happy_life50_83858_minimal_yoga_space_with_natural_wooden_floor_5af99ad7-3ccc-44d9-b419-0ab9d676885d.png",
  "/images/background/inston2_27158_A_woman_in_soft_activewear_doing_a_yoga_pose_on_a_9459735b-9ba7-4742-b8b0-88feab573046.png",
];

export default function Hero() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    new Array(heroImages.length).fill(false)
  );
  const [animatedImages, setAnimatedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Changer la citation à chaque visite
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
          const kenBurnsFinalClass = kenBurnsFinalClasses[index % kenBurnsFinalClasses.length];

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
        <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-card border border-white/20">
          <p className="text-lg md:text-xl italic font-serif">
            &ldquo;{currentQuote}&rdquo;
          </p>
        </div>

        {/* Call to action */}
        <div className="mt-12">
          <a
            href="#agenda"
            className="inline-block px-8 py-4 bg-primary text-white rounded-button hover:bg-primary-light transition-all transform hover:scale-105 shadow-lg"
          >
            Découvrir nos cours
          </a>
        </div>
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
