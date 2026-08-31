"use client";

import { useState, useEffect, useId } from "react";
import { computeLunarData, LUNAR_CYCLE_DAYS } from "@/lib/lunar";

interface MoonPhaseProps {
  size?: number;
  className?: string;
  /** Illumination 0–1 fournie par le parent (sinon calcul local) */
  illumination?: number;
  /** Jour du cycle 0–29.53 fourni par le parent (sinon calcul local) */
  dayOfCycle?: number;
}

const UNLIT = "#2e332b";
const LIT = "#ffffff";

export default function MoonPhase({
  size = 80,
  className = "",
  illumination: illuminationProp,
  dayOfCycle: dayOfCycleProp,
}: MoonPhaseProps) {
  const clipId = `moonClip${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
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

  const illumination = moonData?.illumination ?? 0.5;
  const dayOfCycle = moonData?.dayOfCycle ?? LUNAR_CYCLE_DAYS / 2;
  const radius = size / 2;
  const center = size / 2;
  // Croissante : lumière à droite. Décroissante : lumière à gauche (hémisphère nord).
  const isWaxing = dayOfCycle < LUNAR_CYCLE_DAYS / 2;
  const isGibbous = illumination >= 0.5;
  // Largeur du terminateur (ellipse) : 0 au quartier, r à la nouvelle / pleine lune.
  const terminatorRx = radius * Math.abs(illumination * 2 - 1);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={center} cy={center} r={radius} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <circle cx={center} cy={center} r={radius} fill={UNLIT} />
        <rect
          x={isWaxing ? center : 0}
          y={0}
          width={radius}
          height={size}
          fill={LIT}
        />
        <ellipse
          cx={center}
          cy={center}
          rx={Math.max(terminatorRx, 0.001)}
          ry={radius}
          fill={isGibbous ? LIT : UNLIT}
        />
      </g>
      <circle
        cx={center}
        cy={center}
        r={Math.max(radius - 0.5, 0)}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
      />
    </svg>
  );
}
