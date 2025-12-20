import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Heart, BookOpen, Sparkles, Leaf, Award } from "lucide-react";

export default function MonParcoursPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-16 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-text-dark mb-6">
                Mon parcours
              </h1>
              <p className="text-xl text-text-dark/70 italic max-w-2xl mx-auto">
                Professeure de yoga certifiée
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <section className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="p-8">
                  <p className="text-lg text-text-dark/80 leading-relaxed mb-4">
                    Je m&apos;appelle{" "}
                    <strong className="text-primary">Carol Nelissen</strong>.
                  </p>
                  <p className="text-lg text-text-dark/80 leading-relaxed">
                    Il y a presque 20 ans que je suis &quot;tombée en
                    yoga&quot;, mais ce n&apos;est qu&apos;après 10 ans de
                    pratique collective, en tant qu&apos;élève, que l&apos;envie
                    de transmettre s&apos;est imposée.
                  </p>
                </div>
                <div className="relative w-full aspect-square max-w-md mx-auto md:max-w-none rounded-full overflow-hidden shadow-lg">
                  <Image
                    src="/images/Informations/Carol_Nelissen_Yoga.png"
                    alt="Carol Nelissen"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </section>

            {/* Parcours de formation */}
            <section className="mb-16">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-text-dark">
                  Mon Parcours
                </h2>
              </div>

              <div className="space-y-6">
                {/* Formation Viniyoga */}
                <div className="p-8">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                      <Award className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-semibold text-text-dark mb-3">
                        Formation Viniyoga
                      </h3>
                      <p className="text-text-dark/80 leading-relaxed mb-4">
                        J&apos;ai entamé une formation de{" "}
                        <strong>500 heures</strong>, suivie d&apos;une post
                        formation à l&apos;école de{" "}
                        <strong>Claude Maréchal (E.T.Y.)</strong> afin
                        d&apos;obtenir le certificat de professeur de yoga.
                      </p>
                      <p className="text-text-dark/80 leading-relaxed">
                        Cela fait maintenant <strong>4 ans</strong> que
                        j&apos;enseigne le Viniyoga, pour mon plus grand
                        plaisir.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Découverte du Yin Yoga */}
                <div className="p-8">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                      <Leaf className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-semibold text-text-dark mb-3">
                        Découverte du Yin Yoga
                      </h3>
                      <p className="text-text-dark/80 leading-relaxed mb-4">
                        La découverte du Yin yoga est plus récente. Elle
                        s&apos;est faite, par hasard, sur les réseaux suite à
                        des problèmes articulaires.
                      </p>
                      <p className="text-text-dark/80 leading-relaxed mb-4">
                        Face au mieux-être éprouvé, j&apos;ai voulu me former à
                        ce type de yoga particulier dans l&apos;idée d&apos;en
                        faire bénéficier de futur(e)s élèves.
                      </p>
                      <p className="text-text-dark/80 leading-relaxed">
                        J&apos;ai ainsi repris une formation théorique et
                        pratique de{" "}
                        <strong>50 heures, au Karma Yoga Institute</strong>,
                        afin d&apos;être qualifiée pour commencer à donner
                        cours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Ma philosophie */}
            <section className="mb-16">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-text-dark">
                  Ma Philosophie
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="p-8">
                  <div className="space-y-6">
                    <p className="text-lg text-text-dark/80 leading-relaxed">
                      Avant ma formation à l&apos;école E.T.Y. et la découverte
                      de la philosophie yogique (
                      <em>Yoga sutra de Patanjali</em>), je n&apos;étais pas
                      spécialement ouverte à la spiritualité.
                    </p>
                    <p className="text-lg text-text-dark/80 leading-relaxed">
                      Mais les nombreux échanges bienveillants, qui ont
                      agrémenté mes heures de formation, m&apos;ont fait
                      découvrir un univers qui m&apos;a passionnée, qui faisait
                      sens avec mes ressentis.
                    </p>
                    <div className="p-6 mt-6">
                      <p className="text-lg text-text-dark/80 leading-relaxed italic">
                        Bref, j&apos;ai, entre autres, trouvé, dans le Yoga, une
                        philosophie de vie qui me correspondait depuis toujours
                        :{" "}
                        <strong className="text-primary">
                          bienveillance, non jugement, simplicité
                        </strong>
                        …que l&apos;on retrouve dans les{" "}
                        <strong className="text-primary">
                          Yamas et Niyamas
                        </strong>{" "}
                        de l&apos;Ashtanga yoga décrits par Patanjali.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative h-full rounded-card overflow-hidden shadow-lg">
                  <Image
                    src="/images/Informations/IMG-20240822-WA0055.jpg"
                    alt="Pratique du yoga en extérieur"
                    fill
                    className="object-cover scale-[2]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </section>

            {/* Certifications */}
            <section className="mb-16">
              <div className="p-8">
                <h3 className="text-2xl font-serif font-semibold text-text-dark mb-6 text-center">
                  Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 text-center">
                    <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h4 className="font-semibold text-text-dark mb-2">
                      E.T.Y.
                    </h4>
                    <p className="text-sm text-text-dark/70">
                      École de Claude Maréchal
                      <br />
                      Formation de 500 heures
                    </p>
                  </div>
                  <div className="p-6 text-center">
                    <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h4 className="font-semibold text-text-dark mb-2">
                      Karma Yoga Institute
                    </h4>
                    <p className="text-sm text-text-dark/70">
                      Formation Yin Yoga
                      <br />
                      50 heures théoriques et pratiques
                    </p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-text-dark/70">
                    Membre <strong>ABEFY</strong>
                  </p>
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
