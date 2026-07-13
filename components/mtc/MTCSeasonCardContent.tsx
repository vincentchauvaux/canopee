import { ElementWatermark } from "./ElementWatermark";
import {
  correspondenceFields,
  getCorrespondenceLabel,
  getElementIntro,
  getSeasonPeriod,
  getSeasonTitle,
  type ElementType,
  type MTCSeasonInfo,
} from "./mtc-season-utils";

interface MTCSeasonCardContentProps {
  season: MTCSeasonInfo;
}

export default function MTCSeasonCardContent({ season }: MTCSeasonCardContentProps) {
  const element = season.element as ElementType;

  return (
    <article className="group relative mb-8 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.06] via-accent/40 to-secondary/10 shadow-canopee-soft">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(38, 78, 54, 0.08) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(125, 170, 106, 0.1) 0%, transparent 40%)",
        }}
      />

      <ElementWatermark
        element={element}
        className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-[15%] -translate-y-[10%] text-primary opacity-[0.24] sm:h-48 sm:w-48 lg:h-56 lg:w-56"
      />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-30">
        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          className="h-full w-[200%] animate-mtc-wave text-primary/40"
          aria-hidden="true"
        >
          <path
            d="M0 40 Q150 10 300 40 T600 40 T900 40 T1200 40 V80 H0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <header className="mb-8 max-w-2xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
              Élément {season.element}
            </span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-text-dark/70">
              {season.dates}
            </span>
          </div>

          <h2 className="mb-3 font-serif text-3xl font-bold leading-tight text-text-dark sm:text-4xl">
            {getSeasonTitle(season.season)}
            <span className="mt-1 block text-xl font-normal text-primary sm:text-2xl">
              — période {getSeasonPeriod(season.season)}
            </span>
          </h2>

          <p className="text-lg text-text-dark/75">
            {getElementIntro(season.season)}{" "}
            <strong className="font-semibold text-primary">{season.element}</strong>{" "}
            prédomine
          </p>
        </header>

        <p className="mb-8 max-w-3xl text-base leading-relaxed text-text-dark/80 sm:text-lg">
          {season.description}
        </p>

        <div className="mb-8 rounded-2xl border border-white/60 bg-white/55 p-5 backdrop-blur-sm sm:p-6">
          <h3 className="mb-5 font-serif text-xl font-semibold text-text-dark sm:text-2xl">
            Correspondances en Médecine Traditionnelle Chinoise
          </h3>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {correspondenceFields.map(({ key, label }) => (
              <div
                key={key}
                className="rounded-xl border border-primary/8 bg-white/80 px-4 py-3"
              >
                <dt className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-primary/65">
                  {label}
                </dt>
                <dd className="text-sm font-medium leading-snug text-text-dark sm:text-base">
                  {season[key]}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="max-w-3xl border-l-2 border-secondary/50 pl-4 text-sm italic leading-relaxed text-text-dark/75 sm:text-base">
          Dans la Médecine Traditionnelle Chinoise, {getCorrespondenceLabel(season.season)}{" "}
          se rattache à la paire organe-viscère formée par {season.organ} et{" "}
          {season.viscera.toLowerCase()}.
        </p>
      </div>
    </article>
  );
}
