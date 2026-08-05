import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Politique cookies - Canopée",
  description:
    "Informations sur les cookies utilisés par le site Canopée et gestion de votre consentement.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Politique cookies"
      description="Quels cookies sont utilisés sur canopee.be et comment gérer votre choix."
      lastUpdated="août 2026"
    >
      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          1. Qu&apos;est-ce qu&apos;un cookie ?
        </h2>
        <p>
          Un cookie est un petit fichier déposé sur votre appareil lors de la
          visite d&apos;un site. Il permet notamment de mémoriser une session
          de connexion ou vos préférences (par exemple votre choix relatif aux
          cookies).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          2. Cookies utilisés sur Canopée
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-primary/15 text-left">
                <th className="py-2 pr-3 font-semibold">Cookie / usage</th>
                <th className="py-2 pr-3 font-semibold">Finalité</th>
                <th className="py-2 font-semibold">Base</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-primary/10 align-top">
                <td className="py-3 pr-3">
                  Session NextAuth
                  <br />
                  <span className="text-text-dark/50">
                    next-auth.session-token
                  </span>
                </td>
                <td className="py-3 pr-3">
                  Maintenir votre connexion sécurisée au site
                </td>
                <td className="py-3">Nécessaire</td>
              </tr>
              <tr className="border-b border-primary/10 align-top">
                <td className="py-3 pr-3">
                  Consentement cookies
                  <br />
                  <span className="text-text-dark/50">canopee-cookie-consent</span>
                </td>
                <td className="py-3 pr-3">
                  Mémoriser votre choix (accepter / essentiels uniquement)
                </td>
                <td className="py-3">Nécessaire</td>
              </tr>
              <tr className="align-top">
                <td className="py-3 pr-3">Préférences outils admin</td>
                <td className="py-3 pr-3">
                  Ex. mode d&apos;alerte du minuteur (localStorage), uniquement
                  pour les administrateurs utilisant les outils cours
                </td>
                <td className="py-3">Nécessaire / fonctionnel</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          À ce jour, Canopée n&apos;utilise pas de cookies publicitaires ni
          d&apos;outil d&apos;analytics tiers déposant des cookies de mesure
          d&apos;audience sur le site.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          3. Services tiers
        </h2>
        <p>
          Certaines fonctionnalités peuvent faire appel à des services externes
          (affichage d&apos;informations lunaires, connexion Google / Facebook).
          Ces services peuvent déposer leurs propres cookies selon leurs
          politiques. La connexion OAuth n&apos;est initiée que si vous
          cliquez sur le bouton correspondant.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          4. Gérer votre choix
        </h2>
        <p>
          Lors de votre première visite, une bannière vous permet d&apos;accepter
          les cookies ou de limiter aux cookies essentiels. Vous pouvez modifier
          votre choix à tout moment en effaçant les données du site dans votre
          navigateur, ou en visitant à nouveau cette page après suppression du
          cookie <code className="text-sm bg-accent px-1 rounded">canopee-cookie-consent</code>.
        </p>
        <p className="mt-3">
          Pour plus d&apos;informations sur vos données personnelles, consultez
          la{" "}
          <a
            href="/politique-confidentialite"
            className="text-primary hover:underline"
          >
            politique de confidentialité
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
