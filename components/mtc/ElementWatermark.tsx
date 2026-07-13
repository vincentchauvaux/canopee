import {
  Anvil,
  Droplets,
  Flame,
  Mountain,
  TreePine,
  type LucideIcon,
} from "lucide-react";

type ElementType = "Bois" | "Feu" | "Terre" | "Métal" | "Eau";

interface ElementWatermarkProps {
  element: ElementType;
  className?: string;
}

const elementIcons: Record<ElementType, LucideIcon> = {
  Bois: TreePine,
  Feu: Flame,
  Terre: Mountain,
  Métal: Anvil,
  Eau: Droplets,
};

export function ElementWatermark({ element, className = "" }: ElementWatermarkProps) {
  const Icon = elementIcons[element];
  if (!Icon) return null;

  return (
    <Icon
      className={className}
      strokeWidth={1.25}
      aria-hidden="true"
    />
  );
}
