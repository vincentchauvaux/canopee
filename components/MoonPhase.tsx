"use client";

import { useState, useEffect } from "react";
import { computeLunarData } from "@/lib/lunar";

interface MoonPhaseProps {
  size?: number;
  className?: string;
  /** Illumination 0–1 fournie par le parent (sinon calcul local) */
  illumination?: number;
  /** Jour du cycle 0–29.53 fourni par le parent (sinon calcul local) */
  dayOfCycle?: number;
}

export default function MoonPhase({
  size = 80,
  className = "",
  illumination: illuminationProp,
  dayOfCycle: dayOfCycleProp,
}: MoonPhaseProps) {
  const [moonData, setMoonData] = useState<{
    illumination: number;
    dayOfCycle: number;
  } | null>(null);

  useEffect(() => {
    if (illuminationProp !== undefined && dayOfCycleProp !== undefined) {
      setMoonData({
        illumination: illuminationProp,
        dayOfCycle: dayOfCycleProp,
      });
      return;
    }
    const computed = computeLunarData();
    setMoonData({
      illumination: computed.illumination,
      dayOfCycle: computed.dayOfCycle,
    });
  }, [illuminationProp, dayOfCycleProp]);

  // Valeurs par défaut pour le rendu serveur
  const illumination = moonData?.illumination ?? 0.5;
  const dayOfCycle = moonData?.dayOfCycle ?? 14.765;
  const radius = size / 2;
  const center = size / 2;

  const isWaxing = dayOfCycle < 14.765;
  const shadowRatio = Math.abs(illumination * 2 - 1);
  const shadowWidth = radius * shadowRatio;
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

      <g clipPath={`url(#moonClip-${size})`}>
        <circle cx={center} cy={center} r={radius} fill="#ffffff" />

        {illumination < 0.5 ? (
          <ellipse
            cx={shadowX}
            cy={center}
            rx={shadowWidth}
            ry={radius}
            fill="#2e332b"
          />
        ) : (
          <>
            <circle cx={center} cy={center} r={radius} fill="#ffffff" />
            <ellipse
              cx={
                isWaxing
                  ? center + radius - shadowWidth
                  : center - radius + shadowWidth
              }
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
