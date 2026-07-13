import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import carolPortrait from "@/images/Informations/Carol_Nelissen_Yoga.png";
import yogaPracticeImage from "@/images/Informations/IMG-20240822-WA0055.jpg";

export default function MonParcoursPage() {
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
                    Mon parcours
                  </h1>
                  <p className="mt-4 text-lg text-text-dark/80 leading-relaxed italic">
                    Professeure de yoga certifiée
                  </p>
                  <div className="mt-6 space-y-4 text-text-dark/80 leading-relaxed">
                    <p className="text-lg">
                      Je m&apos;appelle{" "}
                      <strong className="text-primary">Carol Nelissen</strong>.
                    </p>
                    <p>
                      Il y a presque 20 ans que je suis &quot;tombée en
                      yoga&quot;, mais ce n&apos;est qu&apos;après 10 ans de
                      pratique collective, en tant qu&apos;élève, que l&apos;envie
                      de transmettre s&apos;est imposée.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
                    <div className="flex flex-col items-center">
                      <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-md sm:h-56 sm:w-56">
                        <Image
                          src={carolPortrait}
                          alt="Carol Nelissen, professeure de yoga"
                          fill
                          className="object-cover object-top"
                          sizes="(min-width: 640px) 224px, 192px"
                          priority
                        />
                      </div>
                      <p className="mt-4 text-center text-sm text-text-dark/70 leading-relaxed">
                        Viniyoga et Yin Yoga — une transmission guidée par
                        l&apos;écoute, la bienveillance et l&apos;expérience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="mb-10 rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">
                Mon parcours
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-primary/10 bg-white/70 p-6">
                  <h3 className="text-xl font-serif font-semibold text-text-dark mb-3">
                    Formation Viniyoga
                  </h3>
                  <p className="text-text-dark/80 leading-relaxed mb-4">
                    J&apos;ai entamé une formation de{" "}
                    <strong>500 heures</strong>, suivie d&apos;une post
                    formation, à l&apos;école de{" "}
                    <strong>Claude Maréchal (E.T.Y.)</strong> afin
                    d&apos;obtenir le certificat de professeur de yoga.
                  </p>
                  <p className="text-text-dark/80 leading-relaxed">
                    Cela fait maintenant <strong>4 ans</strong> que
                    j&apos;enseigne le Viniyoga, pour mon plus grand plaisir.
                  </p>
                </div>

                <div className="rounded-xl border border-primary/10 bg-white/70 p-6">
                  <h3 className="text-xl font-serif font-semibold text-text-dark mb-3">
                    Découverte du Yin Yoga
                  </h3>
                  <p className="text-text-dark/80 leading-relaxed mb-4">
                    La découverte du Yin yoga est plus récente. Elle s&apos;est
                    faite, par hasard, sur les réseaux suite à des problèmes
                    articulaires.
                  </p>
                  <p className="text-text-dark/80 leading-relaxed mb-4">
                    Face au mieux-être éprouvé, j&apos;ai voulu me former à ce
                    type de yoga particulier dans l&apos;idée d&apos;en faire
                    bénéficier de futur(e)s élèves.
                  </p>
                  <p className="text-text-dark/80 leading-relaxed">
                    J&apos;ai ainsi repris une formation théorique et pratique de{" "}
                    <strong>50 heures, au Karma Yoga Institute</strong>, afin
                    d&apos;être qualifiée pour commencer à donner cours.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-10 rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark">
                Ma philosophie
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="space-y-4 text-text-dark/80 leading-relaxed">
                  <p className="text-lg">
                    Avant ma formation à l&apos;école E.T.Y. et la découverte
                    de la philosophie yogique (
                    <em>Yoga sutra de Patanjali</em>), je n&apos;étais pas
                    spécialement ouverte à la spiritualité.
                  </p>
                  <p>
                    Mais les nombreux échanges bienveillants, qui ont agrémenté
                    mes heures de formation, m&apos;ont fait découvrir un univers
                    qui m&apos;a passionnée, qui faisait sens avec mes
                    ressentis.
                  </p>
                  <div className="rounded-xl border border-primary/10 bg-white/70 p-6">
                    <p className="italic leading-relaxed">
                      Bref, j&apos;ai entre autre trouvé, dans le Yoga, une
                      philosophie de vie qui me correspondait depuis toujours :{" "}
                      <strong className="text-primary not-italic">
                        bienveillance, non jugement, simplicité
                      </strong>
                      …que l&apos;on retrouve dans les{" "}
                      <strong className="text-primary not-italic">
                        Yamas et Niyamas
                      </strong>{" "}
                      de l&apos;Ashtanga yoga décrits par Patanjali.
                    </p>
                  </div>
                </div>

                <div className="relative min-h-[320px] overflow-hidden rounded-xl border border-primary/10">
                  <Image
                    src={yogaPracticeImage}
                    alt="Pratique du yoga en extérieur"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </section>

            <section className="mb-10 rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-dark text-center">
                Certifications
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-primary/10 bg-white/70 p-6 text-center">
                  <h3 className="font-semibold text-text-dark mb-2">E.T.Y.</h3>
                  <p className="text-sm text-text-dark/70">
                    École de Claude Maréchal
                    <br />
                    Formation de 500 heures
                  </p>
                </div>
                <div className="rounded-xl border border-primary/10 bg-white/70 p-6 text-center">
                  <h3 className="font-semibold text-text-dark mb-2">
                    Karma Yoga Institute
                  </h3>
                  <p className="text-sm text-text-dark/70">
                    Formation Yin Yoga
                    <br />
                    50 heures théoriques et pratiques
                  </p>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-text-dark/70">
                Membre <strong>ABEFY</strong>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
