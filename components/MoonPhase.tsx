"use client";

interface MoonPhaseProps {
  size?: number;
  className?: string;
}

export default function MoonPhase({ size = 80, className = "" }: MoonPhaseProps) {
  // Calcul de la phase lunaire en temps réel
  const calculateMoonPhase = () => {
    const now = new Date();
    const referenceNewMoon = new Date("2024-01-11T00:00:00Z").getTime();
    const lunarCycle = 29.530588 * 24 * 60 * 60 * 1000;
    const daysSinceNewMoon = (now.getTime() - referenceNewMoon) % lunarCycle;
    const dayOfCycle = daysSinceNewMoon / (24 * 60 * 60 * 1000);
    
    // Calcul de l'illumination (0 = nouvelle lune, 1 = pleine lune)
    // Utiliser une formule plus précise basée sur l'angle de phase
    const phaseAngle = (2 * Math.PI * dayOfCycle) / 29.530588;
    const illumination = 0.5 - 0.5 * Math.cos(phaseAngle);
    
    return {
      illumination: Math.max(0, Math.min(1, illumination)),
      dayOfCycle,
      phaseAngle,
    };
  };

  const { illumination, dayOfCycle } = calculateMoonPhase();
  const radius = size / 2;
  const center = size / 2;

  // Déterminer si la lune est croissante (waxing) ou décroissante (waning)
  const isWaxing = dayOfCycle < 14.765; // Moitié du cycle

  // Calculer la position de l'ombre pour créer l'effet de phase
  // L'illumination va de 0 (nouvelle lune) à 1 (pleine lune)
  // On calcule la largeur de l'ombre en fonction de l'illumination
  const shadowRatio = Math.abs(illumination * 2 - 1); // 0 à pleine lune, 1 à nouvelle lune
  const shadowWidth = radius * shadowRatio;
  
  // Position de l'ombre : à gauche pour croissante, à droite pour décroissante
  const shadowX = isWaxing 
    ? center - radius + shadowWidth
    : center + radius - shadowWidth;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      <defs>
        <clipPath id={`moonClip-${size}`}>
          <circle cx={center} cy={center} r={radius} />
        </clipPath>
      </defs>
      
      {/* Cercle de la lune (blanc) */}
      <g clipPath={`url(#moonClip-${size})`}>
        <circle cx={center} cy={center} r={radius} fill="#ffffff" />
        
        {/* Ombre pour créer l'effet de phase */}
        {illumination < 0.5 ? (
          // Moins de la moitié : ombre à gauche (croissante) ou droite (décroissante)
          <ellipse
            cx={shadowX}
            cy={center}
            rx={shadowWidth}
            ry={radius}
            fill="#2e332b"
          />
        ) : (
          // Plus de la moitié : on dessine l'ombre sur le côté opposé
          <>
            <circle cx={center} cy={center} r={radius} fill="#ffffff" />
            <ellipse
              cx={isWaxing ? center + radius - shadowWidth : center - radius + shadowWidth}
              cy={center}
              rx={shadowWidth}
              ry={radius}
              fill="#2e332b"
            />
          </>
        )}
      </g>
    </svg>
  );
}

