"use client";

import {
  motion,
  useReducedMotion,
  type Variant,
} from "framer-motion";
import type { ReactNode } from "react";
import { easeCanopy } from "./easings";

type VariantKey = "fade-up" | "fade" | "soft-zoom" | "slide-right";

const presets: Record<VariantKey, { hidden: Variant; show: Variant }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  "soft-zoom": {
    hidden: { opacity: 0, scale: 0.97 },
    show: { opacity: 1, scale: 1 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -18 },
    show: { opacity: 1, x: 0 },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Délai après entrée dans le viewport (s) */
  delay?: number;
  once?: boolean;
  /** Partie de l’élément visible pour déclencher (0–1) */
  amount?: number | "some" | "all";
  variant?: VariantKey;
};

export function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  amount = 0.15,
  variant = "fade-up",
}: RevealProps) {
  const reduce = useReducedMotion();
  const { hidden, show } = presets[variant];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: "0px 0px -8% 0px" }}
      variants={{
        hidden,
        show: {
          ...show,
          transition: {
            duration: 0.48,
            ease: easeCanopy,
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
