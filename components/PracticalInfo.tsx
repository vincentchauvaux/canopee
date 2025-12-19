"use client";

import Link from "next/link";
import {
  Info,
  ShoppingBag,
  Package,
  HelpCircle,
  Heart,
  Leaf,
  Clock,
  MapPin,
  User,
} from "lucide-react";

export default function PracticalInfo() {
  return (
    <section id="infos" className="py-20 bg-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Yin Yoga */}
        <div className="mt-16 mb-12">
          <div className="rounded-card p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-4">
                Cours de Yin Yoga
              </h2>
              <p className="text-lg text-text-dark/70 max-w-2xl mx-auto italic">
                Inspiré du yoga taoïste et de la médecine traditionnelle
                chinoise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Colonne gauche : Bienfaits */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-primary mb-4 flex items-center">
                    <Heart className="w-6 h-6 mr-2" />
                    Son action sur
                  </h3>
                  <ul className="space-y-3 text-text-dark/80">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Les tissus profonds (articulations, fascias…)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>
                        La pleine conscience de ses sensations physiques et
                        mentales
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Les méridiens</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-semibold text-primary mb-4 flex items-center">
                    <Leaf className="w-6 h-6 mr-2" />
                    Peut répondre à
                  </h3>
                  <ul className="space-y-3 text-text-dark/80">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Une vie trop stressante → trop yang</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Des tensions dans le corps</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Un sentiment de déséquilibre généralisé</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Colonne droite : Infos pratiques */}
              <div className="bg-white/60 rounded-card p-6 shadow-md">
                <h3 className="text-2xl font-serif font-semibold text-text-dark mb-6">
                  Infos pratiques
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-text-dark">Horaires</p>
                      <p className="text-text-dark/70">
                        Le vendredi de 18h à 19h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-text-dark">
                        Localisation
                      </p>
                      <p className="text-text-dark/70">Wauthier-Braine</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-text-dark">
                        Professeure
                      </p>
                      <p className="text-text-dark/70">
                        Carol Nelissen
                        <br />
                        <span className="text-sm italic">
                          Certifiée E.T.Y. et Karma Yoga Institute
                          <br />
                          Membre ABEFY
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-primary/20">
                    <Link
                      href="/yin-yoga"
                      className="inline-flex items-center text-primary hover:text-primary-light font-medium transition-colors"
                    >
                      En savoir plus sur le Yin Yoga
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-text-dark mb-4">
            Informations Pratiques
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tarifs */}
          <div className="bg-white rounded-card p-6 shadow-md hover:shadow-lg transition-shadow">
            <ShoppingBag className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-3">Tarifs</h3>
            <ul className="text-text-dark/70 space-y-2">
              <li>
                <strong>Cours individuel :</strong> 15 euros / séance
              </li>
              <li>
                <strong>Cours collectif :</strong> 12 euros / séance
              </li>
            </ul>
          </div>

          {/* Matériel */}
          <div className="bg-white rounded-card p-6 shadow-md hover:shadow-lg transition-shadow">
            <Package className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-3">Matériel</h3>
            <p className="text-text-dark/70">
              Tapis et accessoires fournis. Apportez simplement une tenue
              confortable.
            </p>
          </div>

          {/* Débutants */}
          <div className="bg-white rounded-card p-6 shadow-md hover:shadow-lg transition-shadow">
            <Info className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-3">
              Pour débuter
            </h3>
            <p className="text-text-dark/70">
              Tous les cours sont adaptés aux débutants. Votre professeur vous
              guidera pas à pas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
