import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Politique de confidentialité - Canopée",
  description:
    "Politique de confidentialité et protection des données personnelles (RGPD) du site Canopée.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPageShell
      title="Politique de confidentialité"
      description="Comment Canopée collecte, utilise et protège vos données personnelles (RGPD)."
      lastUpdated="août 2026"
    >
      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          1. Responsable du traitement
        </h2>
        <p>
          Le responsable du traitement des données est{" "}
          <strong>Carol Nelissen</strong> (Canopée), Rue Jean Theys, 10, 1440
          Wauthier-Braine, Belgique. Site :{" "}
          <a href="https://canopee.be" className="text-primary hover:underline">
            canopee.be
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          2. Données collectées
        </h2>
        <p>Selon votre usage du site, nous pouvons traiter :</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>
            <strong>Compte</strong> : adresse e-mail, prénom, nom, mot de passe
            (stocké sous forme hashée), photo de profil, téléphone, date de
            naissance (si renseignés)
          </li>
          <li>
            <strong>Connexion OAuth</strong> : données fournies par Google ou
            Facebook (e-mail, nom, photo) lorsque vous choisissez ce mode de
            connexion
          </li>
          <li>
            <strong>Données techniques</strong> : cookies de session nécessaires
            à l&apos;authentification, journaux techniques limités (sécurité,
            diagnostic)
          </li>
        </ul>
        <p className="mt-3">
          Nous ne collectons pas de données de santé via le site. L&apos;agenda
          public est consultatif ; les réservations ne sont pas proposées depuis
          l&apos;interface publique actuelle.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          3. Finalités et bases légales
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Gestion du compte et authentification</strong> — exécution
            du contrat / mesures précontractuelles et intérêt légitime
          </li>
          <li>
            <strong>Affichage de l&apos;agenda et des actualités</strong> —
            intérêt légitime (information du public)
          </li>
          <li>
            <strong>Administration du site</strong> (comptes admin) — intérêt
            légitime
          </li>
          <li>
            <strong>Sécurité</strong> (prévention des abus) — intérêt légitime
          </li>
          <li>
            <strong>Cookies non essentiels</strong> — consentement (voir la{" "}
            <a href="/cookies" className="text-primary hover:underline">
              politique cookies
            </a>
            )
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          4. Destinataires et sous-traitants
        </h2>
        <p>
          Les données sont traitées par Canopée et, le cas échéant, par des
          prestataires techniques nécessaires au fonctionnement du service
          (hébergeur OVH, base de données, fournisseurs OAuth Google /
          Facebook). Ces prestataires agissent selon leurs conditions et
          obligations applicables.
        </p>
        <p className="mt-3">
          Les données ne sont pas vendues à des tiers à des fins commerciales.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          5. Durée de conservation
        </h2>
        <p>
          Les données de compte sont conservées tant que le compte est actif,
          puis pendant une durée raisonnable nécessaire aux obligations légales
          ou à la gestion des litiges. Les journaux techniques sont conservés
          pour une durée limitée adaptée à la sécurité.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          6. Vos droits (RGPD)
        </h2>
        <p>Conformément au RGPD, vous disposez notamment des droits suivants :</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>droit d&apos;accès, de rectification et d&apos;effacement</li>
          <li>droit à la limitation du traitement et à la portabilité</li>
          <li>droit d&apos;opposition (dans les cas prévus)</li>
          <li>droit de retirer votre consentement (cookies non essentiels)</li>
          <li>
            droit d&apos;introduire une réclamation auprès de l&apos;autorité
            de contrôle belge (Autorité de protection des données —{" "}
            <a
              href="https://www.autoriteprotectiondonnees.be"
              className="text-primary hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              autoriteprotectiondonnees.be
            </a>
            )
          </li>
        </ul>
        <p className="mt-3">
          Pour exercer vos droits, contactez Carol Nelissen via les coordonnées
          du site. Vous pouvez aussi mettre à jour certaines informations depuis
          votre page profil si vous disposez d&apos;un compte.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          7. Sécurité
        </h2>
        <p>
          Nous mettons en œuvre des mesures raisonnables pour protéger vos
          données (HTTPS, mots de passe hashés, cookies de session sécurisés,
          accès administrateur restreint). Aucun système n&apos;étant
          infaillible, nous vous invitons à utiliser un mot de passe unique et
          robuste.
        </p>
      </section>
    </LegalPageShell>
  );
}
