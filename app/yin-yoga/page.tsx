import Image from "next/image";
import Link from "next/link";
import { Leaf, Clock, Heart, Target } from "lucide-react";

export default function YinYogaPage() {
  return (
    <main className="px-5 sm:px-6 max-w-2xl mx-auto space-y-16 md:space-y-20 pb-8">
      <header className="text-center space-y-4 pt-2">
        <span className="font-sans text-xs uppercase tracking-[0.28em] text-on-secondary-container">
          L&apos;art de la lenteur
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-primary leading-tight">
          Explorer la profondeur
        </h1>
        <div className="h-px w-12 bg-outline-variant mx-auto opacity-35 mt-6" />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 relative">
          <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm bg-surface-container-highest relative">
            <Image
              src="/images/Informations/Carol_Nelissen_Yoga.png"
              alt="Carol Nelissen"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
          <div className="absolute -bottom-3 -right-2 bg-surface-container-lowest p-3 md:p-4 rounded-xl shadow-sm hidden md:block border border-outline-variant/10">
            <span className="font-serif italic text-primary text-base md:text-lg">
              Carol Nelissen
            </span>
          </div>
        </div>
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-primary">L&apos;âme de Canopée</h2>
            <div className="h-0.5 w-8 bg-tertiary-fixed-dim rounded-full" />
          </div>
          <div className="space-y-4 text-on-surface-variant leading-relaxed font-sans text-sm md:text-base">
            <p>
              Fondatrice de Canopée, Carol accompagne une pratique du yoga comme
              une conversation intime avec soi-même — avec une attention
              particulière aux approches restoratives et au Yin Yoga.
            </p>
            <p>
              Bienveillance, écoute des tissus profonds et rythme posé : un
              cadre pour que corps et esprit lâchent les tensions du quotidien.
            </p>
          </div>
          <Link
            href="/mon-parcours"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:opacity-80 text-sm uppercase tracking-wider font-sans"
          >
            Son parcours
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </section>

      <section className="bg-surface-container-low rounded-xl p-8 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-5">
            <h2 className="font-serif text-3xl text-primary italic">Le Yin Yoga</h2>
            <p className="font-sans text-lg text-on-secondary-container leading-relaxed italic">
              &ldquo;Dans l&apos;immobilité, tout devient mouvement.&rdquo;
            </p>
            <div className="space-y-4 text-on-surface-variant font-sans text-sm leading-relaxed">
              <p>
                Discipline récente popularisée par Paul Grilley, inspirée du yoga
                taoïste et des méridiens : le Yin sollicite les tissus
                conjonctifs par des postures tenues longtemps (souvent 3 à 5
                minutes).
              </p>
              <p>
                Peu de muscle, beaucoup de gravité et d&apos;acceptation : une
                pratique profonde pour articulations, fascias et équilibre
                intérieur.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square max-w-[200px] bg-surface-container-highest rounded-full flex items-center justify-center border border-white/60 shadow-inner">
            <span className="material-symbols-outlined text-6xl text-primary/30">
              water_drop
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-serif text-2xl text-primary">Approfondir</h2>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/10 space-y-6 font-sans text-sm text-on-surface-variant leading-relaxed">
          <div className="flex gap-3">
            <Target className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-lg text-primary mb-2">Yin vs autres yogas</h3>
              <p>
                Le Yin travaille surtout la zone « yin » du corps (entre ombilic
                et genoux), sans chercher à renforcer les muscles : traction
                passive des fascias, ligaments et articulations.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-lg text-primary mb-2">La posture dans le temps</h3>
              <p>
                Installation soignée, aides si besoin, maintien au-delà d&apos;une
                minute pour laisser le corps descendre en profondeur — idéalement
                avec un enseignant pour rester dans la zone bénéfique, sans
                douleur excessive.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Heart className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-lg text-primary mb-2">Pour qui ?</h3>
              <p>
                Stress, tensions diffuse, recherche de souplesse et de calme,
                accompagnement des transitions… Les bienfaits dépassent souvent la
                seule souplesse. Plus de détails sur la page{" "}
                <Link href="/faq" className="text-primary font-semibold underline underline-offset-2">
                  FAQ
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl text-primary">La médecine chinoise</h2>
          <p className="font-sans text-sm text-outline uppercase tracking-widest">
            L&apos;équilibre des méridiens
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-xl space-y-3 border border-outline-variant/10">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
            </div>
            <h3 className="font-serif text-lg text-primary">Circulation du Qi</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed font-sans">
              Le Yin peut favoriser la libération des tensions le long des
              méridiens, comme une séance douce et prolongée.
            </p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl space-y-3 border border-outline-variant/10">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">balance</span>
            </div>
            <h3 className="font-serif text-lg text-primary">Harmonie saisonnière</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed font-sans">
              Les saisons et les cinq éléments rythment aussi la pratique — voir
              la page{" "}
              <Link href="/saisons-mtc" className="text-primary font-semibold underline underline-offset-2">
                Saisons MTC
              </Link>
              .
            </p>
          </div>
          <div className="md:col-span-2 bg-primary text-on-primary p-8 rounded-xl flex flex-col md:flex-row items-center gap-6">
            <div className="space-y-2 flex-1 font-sans text-sm">
              <h3 className="font-serif text-xl">Une approche holistique</h3>
              <p className="text-on-primary/85 leading-relaxed">
                Corps, souffle et conscience se rejoignent : la pratique invite à
                écouter les signaux du corps sans forcé.
              </p>
            </div>
            <span className="material-symbols-outlined text-5xl opacity-25 filled-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
              self_improvement
            </span>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 space-y-5">
        <p className="font-serif italic text-primary/55">Rejoignez la Canopée</p>
        <Link
          href="/#agenda"
          className="inline-flex items-center justify-center rounded-full bg-primary text-on-primary px-8 py-3.5 text-sm font-semibold font-sans hover:opacity-90 transition-opacity"
        >
          Voir le planning
        </Link>
        <div className="flex justify-center gap-3 pt-2">
          <span className="w-2 h-2 rounded-full bg-primary/25" />
          <span className="w-2 h-2 rounded-full bg-primary/45" />
          <span className="w-2 h-2 rounded-full bg-primary/25" />
        </div>
      </footer>
    </main>
  );
}
