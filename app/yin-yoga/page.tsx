import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import yinIntroImage from "@/images/background/happy_life50_83858_minimal_yoga_space_with_natural_wooden_floor_5af99ad7-3ccc-44d9-b419-0ab9d676885d.png";

export default function YinYogaPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <h1 className="text-4xl sm:text-5xl font-serif font-bold text-text-dark leading-tight">
                    Découverte du Yin Yoga
                  </h1>
                  <p className="mt-4 text-lg text-text-dark/80 leading-relaxed">
                    Une pratique douce, profonde et méditative, centrée sur les
                    tissus conjonctifs, la respiration et l'écoute du corps.
                  </p>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                      <p className="text-sm font-semibold text-text-dark">
                        Passif
                      </p>
                      <p className="mt-1 text-sm text-text-dark/70">
                        Postures tenues sans force.
                      </p>
                    </div>
                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                      <p className="text-sm font-semibold text-text-dark">
                        Long
                      </p>
                      <p className="mt-1 text-sm text-text-dark/70">
                        De 2 à 20 minutes.
                      </p>
                    </div>
                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                      <p className="text-sm font-semibold text-text-dark">
                        Profond
                      </p>
                      <p className="mt-1 text-sm text-text-dark/70">
                        Fascias, ligaments, articulations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5">
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={yinIntroImage}
                        alt="Ambiance calme et nature"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 420px, 100vw"
                        priority
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-text-dark/70 leading-relaxed">
                        Le Yin yoga invite à ralentir, à ressentir, et à laisser
                        l’espace intérieur se réorganiser.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section : Le Yin yoga, c&apos;est quoi ? */}
            <section className="mb-10 rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">
                Le Yin yoga, c&apos;est quoi ?
              </h2>
              <div className="mt-4">
                <p className="text-lg text-text-dark/80 leading-relaxed mb-6">
                  Le Yin yoga est une discipline assez récente développée par{" "}
                  <strong>Paul Grilley en 1989</strong>, qui s&apos;est inspiré
                  du yoga taoïste et de la théorie des méridiens.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="rounded-xl border border-primary/10 bg-white/70 p-6">
                    <h3 className="text-xl font-semibold text-text-dark mb-3">
                      Différence avec les autres yogas
                    </h3>
                    <p className="text-text-dark/70">
                      Le Yin yoga s'intéresse surtout a la partie du corps situé
                      entre l'ombilic et les genoux (Yin). Contrairement aux
                      yogas habituels, il{" "}
                      <strong>n&apos;affermit pas les muscles</strong>. Il vise
                      les tissus conjonctifs (articulations, ligaments, tendons,
                      fascias…) qu&apos;il met sous traction passive.
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/10 bg-white/70 p-6">
                    <h3 className="text-xl font-semibold text-text-dark mb-3">
                      Action sur les méridiens
                    </h3>
                    <p className="text-text-dark/70">
                      Le Yin yoga active également les{" "}
                      <strong>
                        méridiens où circule l&apos;énergie (le Chi)
                      </strong>
                      , favorisant un rééquilibrage profond de l&apos;organisme.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section : Le Yin yoga, comment ? */}
            <section className="mb-10 rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">
                Le Yin yoga, comment ?
              </h2>

              <div className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-text-dark mb-2">
                        Installation de la posture
                      </h3>
                      <p className="text-text-dark/80 leading-relaxed">
                        En Yin yoga, on prend le temps d&apos;installer
                        correctement la posture, en s&apos;aidant de{" "}
                        <strong>support(s), si nécessaire</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-text-dark mb-2">
                        Maintien de la posture
                      </h3>
                      <p className="text-text-dark/80 leading-relaxed">
                        La posture se tient pendant{" "}
                        <strong>plus d&apos;1 minute</strong> (entre 2 et 20').
                        C&apos;est le temps qu&apos;il faut à nos muscles pour
                        se détendre et permettre au &quot;stress&quot;
                        d&apos;aller plus loin, jusque dans nos tissus profonds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-text-dark mb-2">
                        L&apos;importance de l&apos;accompagnement
                      </h3>
                      <p className="text-text-dark/80 leading-relaxed mb-3">
                        Cela paraît simple, mais c&apos;est loin d&apos;être
                        facile car notre mental va tout faire pour nous sortir
                        de cette zone d&apos;inconfort.
                      </p>
                      <p className="text-text-dark/80 leading-relaxed">
                        C&apos;est pourquoi{" "}
                        <strong>
                          l&apos;accompagnement d&apos;un professeur est
                          conseillé
                        </strong>
                        , non seulement pour veiller à ce que l&apos;élève
                        recueille les bénéfices de la posture (zone orange), et
                        ce sans douleur (zone rouge), mais aussi pour
                        l&apos;aider à rester serein(e) pendant tout le maintien
                        de celle-ci.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white/70 rounded-xl border border-primary/10">
                  <p className="text-lg italic text-text-dark text-center font-serif">
                    &ldquo;Adapter sa pratique, poser ses limites, ce n&apos;est
                    pas une faiblesse, mais une force&rdquo;
                  </p>
                </div>
              </div>
            </section>

            {/* Section : Le Yin yoga, pourquoi ? */}
            <section className="mb-10 rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">
                Le Yin yoga, pourquoi ?
              </h2>

              <div className="mt-6">
                <p className="text-lg text-text-dark/80 leading-relaxed mb-8">
                  Au delà d&apos;un réel effet sur la souplesse via le travail
                  sur les articulations, ainsi qu'un rééquilibrage profond via
                  l&apos;activation des méridiens, le Yin yoga peut aider dans
                  de nombreuses situations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-primary/10 bg-white/70 p-6">
                    <h3 className="text-xl font-semibold text-text-dark mb-4">
                      Bienfaits physiques
                    </h3>
                    <ul className="space-y-2 text-text-dark/70">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Effet sur la souplesse</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Travail sur les articulations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Aide en cas de douleurs non définies</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Soutien en cas d&apos;arthrose</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-primary/10 bg-white/70 p-6">
                    <h3 className="text-xl font-semibold text-text-dark mb-4">
                      Bienfaits mentaux et émotionnels
                    </h3>
                    <ul className="space-y-2 text-text-dark/70">
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Réduction du stress</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Gestion de l&apos;anxiété</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Amélioration de la concentration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span>Aide à l&apos;endormissement</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
