import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MTCSeasonInfo {
  season: string;
  element: string;
  dates: string;
  description: string;
  organ: string;
  viscera: string;
  color: string;
  emotion: string;
  orientation: string;
  taste: string;
  regenerationHours: string;
  climate: string;
}

const seasons: MTCSeasonInfo[] = [
  {
    season: "Printemps",
    element: "Bois",
    dates: "3 février – 15 avril 2025",
    description:
      "Période d&apos;épanouissement et de croissance. La nature sort de sa torpeur hivernale et s&apos;anime progressivement. Les forces vitales remontent depuis les profondeurs, marquant le début d&apos;un cycle énergétique ascendant de type Yin.",
    organ: "Foie",
    viscera: "Vésicule biliaire",
    color: "Verte",
    emotion: "La colère",
    orientation: "Est",
    taste: "Acide",
    regenerationHours:
      "23h – 3h du matin (23h – 1h : vésicule biliaire / 1h – 3h : foie)",
    climate: "Vent tiède",
  },
  {
    season: "Été",
    element: "Feu",
    dates: "5 mai – 18 juillet 2025",
    description:
      "Moment d&apos;expression et de rayonnement maximal. Les forces vitales culminent, la lumière domine avec des journées étendues, tandis que la température s&apos;élève. Le règne végétal déploie toute sa splendeur et sa floraison.",
    organ: "Cœur",
    viscera: "Intestin Grêle",
    color: "Rouge",
    emotion: "La joie",
    orientation: "Sud",
    taste: "Amer",
    regenerationHours:
      "11h – 15h (11h – 13h : cœur / 13h – 15h : intestin grêle)",
    climate: "Chaleur",
  },
  {
    season: "Intersaison",
    element: "Terre",
    dates:
      "16 janvier – 2 février, 16 avril – 4 mai, 19 juillet – 4 août, 19 octobre – 6 novembre 2025",
    description:
      "Temps de mutation et de réorganisation. L&apos;élément Terre joue un rôle central dans les processus de métamorphose énergétique. Il facilite la transition harmonieuse entre une période qui s&apos;achève et celle qui s&apos;annonce.",
    organ: "Rate",
    viscera: "Estomac",
    color: "Jaune",
    emotion: "Excès de réflexion",
    orientation: "Centre",
    taste: "Sucré",
    regenerationHours:
      "07h – 11h du matin (07h – 09h : estomac / 09h – 11h : rate)",
    climate: "Humidité",
  },
  {
    season: "Automne",
    element: "Métal",
    dates: "5 août – 18 octobre 2025",
    description:
      "Phase de changement et de ralentissement. Cette période s&apos;inscrit entre le pic énergétique estival et la quiétude hivernale. La durée du jour diminue, les conditions météorologiques se durcissent et le rythme naturel s&apos;apaise.",
    organ: "Poumon",
    viscera: "Gros intestin",
    color: "Blanc",
    emotion: "La tristesse",
    orientation: "Ouest",
    taste: "Piquant",
    regenerationHours:
      "3h – 7h du matin (3h – 5h : poumon / 5h – 7h : gros intestin)",
    climate: "Sècheresse",
  },
  {
    season: "Hiver",
    element: "Eau",
    dates: "7 novembre 2025 – 20 janvier 2026",
    description:
      "Temps de repli et de ressourcement. Le monde naturel et le corps humain entrent dans une phase de repos profond. Cette période favorise le retour sur soi, l&apos;exploration des sentiments refoulés tels que l&apos;appréhension, ainsi que le développement de capacités intérieures comme la détermination.",
    organ: "Rein",
    viscera: "Vessie",
    color: "Noir",
    emotion: "La peur",
    orientation: "Nord",
    taste: "Salé",
    regenerationHours: "15h – 19h (15h – 17h : vessie / 17h – 19h : rein)",
    climate: "Froid",
  },
];

const elementEmojis: Record<string, string> = {
  Bois: "🪵",
  Feu: "🔥",
  Terre: "🌍",
  Métal: "⚙️",
  Eau: "💧",
};

const seasonEmojis: Record<string, string> = {
  Printemps: "🍃",
  Été: "🌅",
  Intersaison: "🌾",
  Automne: "🍂",
  Hiver: "❄️",
};

export default function SaisonsMTCPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-text-dark mb-4">
            Les saisons en Énergétique Chinoise
          </h1>

          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-text-dark/80 mb-4">
              Le calendrier des saisons en Chine diffère sensiblement du nôtre.
              Contrairement à notre Nouvel An fixé au 1er janvier, le Nouvel An
              chinois varie chaque année 🎆
            </p>
            <p className="text-text-dark/80 mb-4">
              Le début du premier mois lunaire chinois se produit généralement
              entre la fin du mois de janvier et la mi-février, coïncidant avec
              l&apos;équinoxe printanier 🍃
            </p>
            <p className="text-text-dark/80 mb-4">
              Cette différence provient de l&apos;utilisation d&apos;un système
              calendaire luni-solaire combinant les cycles solaires ☀️ et lunaires
              🌕. Ce calendrier remonterait à l&apos;an 2697 avant notre ère,
              élaboré grâce à l&apos;observation minutieuse des astres, des
              variations climatiques, des cycles agricoles et de l&apos;alternance
              jour-nuit par les anciens Chinois.
            </p>
            <p className="text-text-dark/80 mb-4">
              La structure temporelle chinoise intègre donc simultanément les
              rythmes solaires et lunaires, créant une harmonie entre ces deux
              cycles célestes pour organiser le temps.
            </p>
            <p className="text-text-dark/80 mb-4">
              Chaque mois lunaire compte alternativement 29 ou 30 jours, suivant
              fidèlement les phases de notre satellite naturel.
            </p>

            <h2 className="text-2xl font-serif font-bold text-text-dark mt-8 mb-4">
              Le principe des 5 saisons en MTC
            </h2>
            <p className="text-text-dark/80 mb-4">
              Selon la médecine traditionnelle chinoise, le passage entre deux
              saisons ne peut s&apos;effectuer de manière abrupte en une seule
              journée, contrairement à ce que suggèrent nos calendriers
              conventionnels.
            </p>
            <p className="text-text-dark/80 mb-4">
              Pour cette raison, la tradition chinoise a introduit une cinquième
              période appelée <strong>Intersaison</strong>. Cette phase
              représente un état de mutation et de réorganisation. Elle assure
              l&apos;alignement avec ce qui émerge sans être encore pleinement
              manifesté. Elle constitue ainsi le pont permettant de sortir de
              l&apos;hiver pour accueillir le printemps, de quitter le printemps
              pour entrer dans l&apos;été, et ainsi de suite pour chaque
              transition saisonnière.
            </p>
            <p className="text-text-dark/80 mb-8">
              La vision chinoise des saisons s&apos;appuie sur la théorie des
              cinq éléments, également nommés cinq mouvements. Chaque élément
              (Bois, Feu, Terre, Métal et Eau) se rattache à une saison
              spécifique ainsi qu&apos;à une paire organe-viscère, déterminant
              ainsi une fonction et un mouvement énergétiques particuliers. Sur
              le plan thérapeutique, chaque période saisonnière entretient des
              liens avec des correspondances corporelles, sensorielles et
              affectives.
            </p>
          </div>

          <div className="space-y-12">
            {seasons.map((season, index) => (
              <div
                key={season.season}
                className="bg-accent/30 rounded-lg p-8 border-l-4 border-primary"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">
                    {seasonEmojis[season.season]}{" "}
                    {elementEmojis[season.element]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-serif font-bold text-text-dark mb-2">
                      {season.season === "Intersaison"
                        ? "L&apos;INTERSAISON"
                        : `LE ${season.season.toUpperCase()}`}{" "}
                      – période{" "}
                      {season.season === "Printemps"
                        ? "d&apos;épanouissement"
                        : season.season === "Été"
                        ? "de rayonnement"
                        : season.season === "Intersaison"
                        ? "de mutation"
                        : season.season === "Automne"
                        ? "de changement"
                        : "de repli"}
                    </h2>
                    <p className="text-lg text-text-dark/70 mb-2">
                      {season.season === "Intersaison"
                        ? "Durant l&apos;intersaison, l&apos;élément"
                        : `Pendant le ${season.season.toLowerCase()}, l&apos;élément`}{" "}
                      <strong>{season.element}</strong> prédomine
                    </p>
                    <p className="text-sm text-text-dark/60 font-medium">
                      {season.dates}
                    </p>
                  </div>
                </div>

                <p className="text-text-dark/80 mb-6 leading-relaxed">
                  {season.description}
                </p>

                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-text-dark mb-4">
                    Ce à quoi correspond{" "}
                    {season.season === "Intersaison"
                      ? "l&apos;intersaison"
                      : `le ${season.season.toLowerCase()}`}{" "}
                    en Médecine Traditionnelle Chinoise :
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Élément</p>
                      <p className="font-medium text-text-dark">
                        {elementEmojis[season.element]} {season.element}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Saison</p>
                      <p className="font-medium text-text-dark">
                        {season.season}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Organe</p>
                      <p className="font-medium text-text-dark">
                        {season.organ}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Viscère</p>
                      <p className="font-medium text-text-dark">
                        {season.viscera}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Couleur</p>
                      <p className="font-medium text-text-dark">
                        {season.color}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">
                        Heures de régénération
                      </p>
                      <p className="font-medium text-text-dark text-sm">
                        {season.regenerationHours}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Goût</p>
                      <p className="font-medium text-text-dark">
                        {season.taste}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Émotion</p>
                      <p className="font-medium text-text-dark">
                        {season.emotion}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">
                        Orientation
                      </p>
                      <p className="font-medium text-text-dark">
                        {season.orientation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">
                        Énergie climatique
                      </p>
                      <p className="font-medium text-text-dark">
                        {season.climate}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-text-dark/80 italic leading-relaxed">
                  Dans la Médecine Traditionnelle Chinoise,{" "}
                  {season.season === "Intersaison"
                    ? "l&apos;intersaison"
                    : `le ${season.season.toLowerCase()}`}{" "}
                  se rattache à la paire organe-viscère formée par {season.organ}{" "}
                  et {season.viscera.toLowerCase()}.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary/10 rounded-lg p-8">
            <p className="text-text-dark/80 leading-relaxed mb-4">
              L&apos;existence se caractérise par un mouvement perpétuel, et
              l&apos;être humain doit trouver son équilibre en s&apos;accordant
              avec le monde qui l&apos;entoure.
            </p>
            <p className="text-text-dark/80 leading-relaxed mb-4">
              Vous pourriez vous interroger : « Pourquoi cette attention si
              particulière portée à ces cycles par la culture chinoise ? »
            </p>
            <p className="text-text-dark/80 leading-relaxed">
              La réponse réside dans leur conception d&apos;un ordre universel
              auquel nous participons tous. Chacun de nous forme une partie
              intégrante d&apos;un ensemble plus vaste, tandis que l&apos;univers
              entier réside également en nous (c&apos;est le principe du tao).
              Cette interconnexion crée une dépendance mutuelle entre tous les
              êtres et toutes les choses. C&apos;est ce qui motive leur
              recherche constante de l&apos;équilibre et de
              l&apos;harmonie.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
