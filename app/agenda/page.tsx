import Link from "next/link";

export const metadata = {
  title: "Agenda — Canopée",
  description: "Planning des cours de Yin Yoga — consultation sur l'accueil",
};

export default function AgendaPage() {
  return (
    <main className="min-h-screen bg-surface px-5 pt-24 pb-32 max-w-lg mx-auto font-sans text-on-surface">
      <h1 className="font-serif text-3xl font-bold text-primary mb-4">
        Agenda
      </h1>
      <p className="text-on-surface-variant leading-relaxed mb-6">
        Le calendrier des cours s&apos;affiche sur la page d&apos;accueil lorsque
        vous êtes connecté. Les inscriptions aux séances ne se font pas sur ce
        site : contactez le studio pour réserver une place.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex justify-center rounded-full bg-primary text-on-primary px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/auth/signin"
          className="inline-flex justify-center rounded-full bg-surface-container-high text-primary px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Connexion
        </Link>
      </div>
    </main>
  );
}
