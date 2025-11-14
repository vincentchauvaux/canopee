import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HelpCircle, Users, Clock, Euro, BookOpen } from 'lucide-react'

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-16 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-6">
                <HelpCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-text-dark mb-6">
                Questions Fréquentes
              </h1>
              <p className="text-xl text-text-dark/70 italic max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur nos cours de Yin Yoga
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Section Cours de Yin Yoga */}
            <section className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-4xl font-serif font-bold text-text-dark">
                  Cours de Yin Yoga
                </h2>
              </div>

              <div className="space-y-8">
                {/* Type de cours */}
                <div className="p-8">
                  <div className="flex items-start mb-4">
                    <Users className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-semibold text-text-dark mb-3">
                        Types de cours
                      </h3>
                      <p className="text-lg text-text-dark/80 leading-relaxed">
                        Les cours de Yin Yoga sont proposés <strong>en individuel ou en collectif</strong> (maximum 3 personnes par séance).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quand */}
                <div className="p-8">
                  <div className="flex items-start mb-4">
                    <Clock className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-semibold text-text-dark mb-3">
                        Quand ?
                      </h3>
                      <ul className="text-lg text-text-dark/80 leading-relaxed space-y-3">
                        <li>
                          <strong>Cours individuel :</strong> selon convenance des deux parties
                        </li>
                        <li>
                          <strong>Cours collectif :</strong> vendredi de 18h à 19h
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Prix */}
                <div className="p-8">
                  <div className="flex items-start mb-4">
                    <Euro className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-semibold text-text-dark mb-3">
                        Prix ?
                      </h3>
                      <ul className="text-lg text-text-dark/80 leading-relaxed space-y-3">
                        <li>
                          <strong>Cours individuel :</strong> 15 euros / séance
                        </li>
                        <li>
                          <strong>Cours collectif :</strong> 12 euros / séance
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="p-8">
                  <div className="flex items-start mb-4">
                    <BookOpen className="w-6 h-6 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif font-semibold text-text-dark mb-3">
                        Comment ?
                      </h3>
                      <ul className="text-lg text-text-dark/80 leading-relaxed space-y-3">
                        <li>
                          <strong>Cours individuel :</strong> séance adaptée aux besoins formulés
                        </li>
                        <li>
                          <strong>Cours collectif :</strong> séances thématiques annoncées sur le site
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

