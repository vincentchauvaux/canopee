import MTCSeasonCardContent from "./MTCSeasonCardContent";
import type { MTCSeasonInfo } from "./mtc-season-utils";

export type { MTCSeasonInfo } from "./mtc-season-utils";

interface MTCSeasonCardProps {
  season: MTCSeasonInfo;
}

/** Carte saison autonome (hors accordéon scroll). */
export default function MTCSeasonCard({ season }: MTCSeasonCardProps) {
  return <MTCSeasonCardContent season={season} />;
}
