import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Mentions légales - Canopée",
  description:
    "Mentions légales du site Canopée – Yin Yoga à Wauthier-Braine (Belgique).",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPageShell
      title="Mentions légales"
      description="Informations relatives à l'éditeur et à l'hébergement du site canopee.be."
      lastUpdated="août 2026"
    >
      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          1. Éditeur du site
        </h2>
        <p>
          Le site <strong>canopee.be</strong> (également accessible via
          canopée.be) est édité par :
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>
            <strong>Responsable</strong> : Carol Nelissen
          </li>
          <li>
            <strong>Activité</strong> : cours de Yin Yoga
          </li>
          <li>
            <strong>Adresse</strong> : Rue Jean Theys, 10, 1440 Wauthier-Braine,
            Belgique
          </li>
          <li>
            <strong>Site</strong> :{" "}
            <a
              href="https://canopee.be"
              className="text-primary hover:underline"
            >
              https://canopee.be
            </a>
          </li>
        </ul>
        <p className="mt-3 text-sm text-text-dark/60">
          Pour toute question relative au site ou à l&apos;activité, utilisez les
          coordonnées indiquées sur le site ou via la page de profil / contact
          communiquée par l&apos;enseignante.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          2. Hébergement
        </h2>
        <p>Le site est hébergé auprès de :</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>
            <strong>OVH SAS</strong>
          </li>
          <li>2 rue Kellermann, 59100 Roubaix, France</li>
          <li>
            Site :{" "}
            <a
              href="https://www.ovhcloud.com"
              className="text-primary hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              ovhcloud.com
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          3. Propriété intellectuelle
        </h2>
        <p>
          L&apos;ensemble des contenus présents sur ce site (textes, images,
          graphismes, logo, structure) est protégé par le droit d&apos;auteur et
          appartient à Canopée / Carol Nelissen, sauf mention contraire.
          Toute reproduction, représentation ou diffusion non autorisée est
          interdite.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          4. Limitation de responsabilité
        </h2>
        <p>
          Les informations publiées sur le site le sont à titre informatif
          (agenda, actualités, présentation des cours). Canopée s&apos;efforce
          d&apos;en assurer l&apos;exactitude, sans garantie d&apos;exhaustivité
          ou d&apos;absence d&apos;erreur. L&apos;utilisation du site se fait
          sous la responsabilité de l&apos;utilisateur.
        </p>
        <p className="mt-3">
          La pratique du yoga implique une responsabilité individuelle ;
          consultez un professionnel de santé en cas de doute médical.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-serif font-bold text-text-dark mb-3">
          5. Liens externes
        </h2>
        <p>
          Le site peut contenir des liens vers des sites tiers (par ex. phase
          lunaire, réseaux sociaux). Canopée n&apos;exerce aucun contrôle sur
          ces sites et décline toute responsabilité quant à leur contenu ou
          leurs pratiques.
        </p>
      </section>
    </LegalPageShell>
  );
}
