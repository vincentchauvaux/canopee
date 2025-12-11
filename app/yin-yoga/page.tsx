import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Leaf, Clock, Heart, Target, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function YinYogaPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-16 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
                <Leaf className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-text-dark mb-6">
                Découverte du Yin Yoga
              </h1>
              <p className="text-xl text-text-dark/70 italic max-w-2xl mx-auto">
                Une pratique douce et profonde inspirée du yoga taoïste et de la médecine traditionnelle chinoise
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Section : Le Yin yoga, c&apos;est quoi ? */}
            <section className="mb-16">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-text-dark">
                  Le Yin yoga, c&apos;est quoi ?
                </h2>
              </div>
              
              <div className="bg-white rounded-card p-8 shadow-md border-l-4 border-primary">
                <p className="text-lg text-text-dark/80 leading-relaxed mb-6">
                  Le Yin yoga est une discipline assez récente développée par <strong>Paul Grilley en 1989</strong>.
                </p>
                <p className="text-lg text-text-dark/80 leading-relaxed mb-6">
                  Il s&apos;est inspiré du yoga taoïste et de la théorie des méridiens pour le créer, avec <strong>Sarah Powers</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-accent/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-text-dark mb-3 flex items-center">
                      <Target className="w-5 h-5 text-primary mr-2" />
                      Différence avec les yogas yang
                    </h3>
                    <p className="text-text-dark/70">
                      Le Yin yoga, contrairement aux yogas habituels, plutôt de type yang, <strong>n&apos;affermit pas les muscles</strong>. Il vise les articulations (ligaments, tendons, fascias…) qu&apos;il met sous traction passive.
                    </p>
                  </div>
                  <div className="bg-accent/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-text-dark mb-3 flex items-center">
                      <Heart className="w-5 h-5 text-primary mr-2" />
                      Action sur les méridiens
                    </h3>
                    <p className="text-text-dark/70">
                      Le Yin yoga active également les <strong>méridiens où circule l&apos;énergie (le Chi)</strong>, favorisant un rééquilibrage profond de l&apos;organisme.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section : Le Yin yoga, comment ? */}
            <section className="mb-16">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-text-dark">
                  Le Yin yoga, comment ?
                </h2>
              </div>
              
              <div className="bg-white rounded-card p-8 shadow-md border-l-4 border-secondary">
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
                        En Yin yoga, on prend le temps d&apos;installer correctement la posture, en s&apos;aidant de <strong>support(s), si nécessaire</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-text-dark mb-2">
                        Maintien prolongé
                      </h3>
                      <p className="text-text-dark/80 leading-relaxed">
                        Ensuite, on maintient celle-ci pendant <strong>plus d&apos;1 minute</strong>. C&apos;est le temps qu&apos;il faut à nos muscles pour se détendre et permettre au &quot;stress&quot; d&apos;aller plus loin, jusque dans nos tissus profonds.
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
                        Cela paraît simple, mais c&apos;est loin d&apos;être facile car notre mental va tout faire pour nous sortir de cette zone d&apos;inconfort.
                      </p>
                      <p className="text-text-dark/80 leading-relaxed">
                        C&apos;est pourquoi <strong>l&apos;accompagnement d&apos;un professeur est conseillé</strong>, non seulement pour veiller à ce que l&apos;élève recueille les bénéfices de la posture (zone orange), et ce sans douleur (zone rouge), mais aussi pour l&apos;aider à rester serein(e) pendant tout le maintien de celle-ci.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-lg italic text-text-dark text-center font-serif">
                    &ldquo;Adapter sa pratique, poser ses limites, ce n&apos;est pas une faiblesse, mais une force&rdquo;
                  </p>
                </div>
              </div>
            </section>

            {/* Section : Le Yin yoga, pourquoi ? */}
            <section className="mb-16">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-text-dark">
                  Le Yin yoga, pourquoi ?
                </h2>
              </div>
              
              <div className="bg-white rounded-card p-8 shadow-md border-l-4 border-primary">
                <p className="text-lg text-text-dark/80 leading-relaxed mb-8">
                  Au delà d&apos;un réel effet sur la souplesse, via le travail sur les articulations, et le rééquilibrage profond qu&apos;amène l&apos;activation des méridiens, le Yin yoga peut aider dans de nombreuses situations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-accent/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-text-dark mb-4 flex items-center">
                      <Target className="w-5 h-5 text-primary mr-2" />
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

                  <div className="bg-accent/30 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-text-dark mb-4 flex items-center">
                      <Heart className="w-5 h-5 text-primary mr-2" />
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

            {/* Section : Informations pratiques */}
            <section className="mb-16">
              <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent rounded-card p-8 shadow-lg border border-primary/20">
                <h2 className="text-3xl font-serif font-bold text-text-dark mb-6 text-center">
                  Informations pratiques
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-text-dark mb-2">Horaires</h3>
                    <p className="text-text-dark/70">Le vendredi de 18h à 19h</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-text-dark mb-2">Professeure</h3>
                    <p className="text-text-dark/70">
                      Carol Nelissen<br />
                      <span className="text-sm italic">
                        Certifiée E.T.Y. et Karma Yoga Institute<br />
                        Membre ABEFY
                      </span>
                    </p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-text-dark mb-2">Adresse</h3>
                    <p className="text-text-dark/70">
                      Rue Jean Theys, 10<br />
                      1440 Wauthier-Braine
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Call to action */}
            <div className="text-center">
              <Link
                href="/#agenda"
                className="inline-block px-8 py-4 bg-primary text-white rounded-button hover:bg-primary-light transition-all transform hover:scale-105 shadow-lg font-medium"
              >
                Voir les cours disponibles
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

