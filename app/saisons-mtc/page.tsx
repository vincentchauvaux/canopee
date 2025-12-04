import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface MTCSeasonInfo {
  season: string
  element: string
  dates: string
  description: string
  organ: string
  viscera: string
  color: string
  emotion: string
  orientation: string
  taste: string
  regenerationHours: string
  climate: string
}

const seasons: MTCSeasonInfo[] = [
  {
    season: 'Printemps',
    element: 'Bois',
    dates: '3 février – 15 avril 2025',
    description: 'La saison de l\'expansion. L\'éveil de la nature, après le long silence froid de l\'hiver. L\'énergie remonte du sol, nous sommes en énergie Yin, la phase ascendante.',
    organ: 'Foie',
    viscera: 'Vésicule biliaire',
    color: 'Verte',
    emotion: 'La colère',
    orientation: 'Est',
    taste: 'Acide',
    regenerationHours: '23h – 3h du matin (23h – 1h : vésicule biliaire / 1h – 3h : foie)',
    climate: 'Vent tiède'
  },
  {
    season: 'Été',
    element: 'Feu',
    dates: '5 mai – 18 juillet 2025',
    description: 'La saison de l\'extériorisation. L\'énergie atteint son activité maximale, les jours sont longs, la chaleur est puissante, les végétaux s\'épanouissent et fleurissent.',
    organ: 'Cœur',
    viscera: 'Intestin Grêle',
    color: 'Rouge',
    emotion: 'La joie',
    orientation: 'Sud',
    taste: 'Amer',
    regenerationHours: '11h – 15h (11h – 13h : cœur / 13h – 15h : intestin grêle)',
    climate: 'Chaleur'
  },
  {
    season: 'Intersaison',
    element: 'Terre',
    dates: '16 janvier – 2 février, 16 avril – 4 mai, 19 juillet – 4 août, 19 octobre – 6 novembre 2025',
    description: 'La saison de la transformation. Une fonction énergétique importante de la Terre est la transformation. C\'est elle qui va nous permettre de passer correctement de la saison mourante à la saison naissante.',
    organ: 'Rate',
    viscera: 'Estomac',
    color: 'Jaune',
    emotion: 'Excès de réflexion',
    orientation: 'Centre',
    taste: 'Sucré',
    regenerationHours: '07h – 11h du matin (07h – 09h : estomac / 09h – 11h : rate)',
    climate: 'Humidité'
  },
  {
    season: 'Automne',
    element: 'Métal',
    dates: '5 août – 18 octobre 2025',
    description: 'La saison de la transition. Entre l\'apogée de l\'énergie et celle du repos, l\'hiver. Les journées sont plus courtes, le temps moins clément et la nature ralentit.',
    organ: 'Poumon',
    viscera: 'Gros intestin',
    color: 'Blanc',
    emotion: 'La tristesse',
    orientation: 'Ouest',
    taste: 'Piquant',
    regenerationHours: '3h – 7h du matin (3h – 5h : poumon / 5h – 7h : gros intestin)',
    climate: 'Sècheresse'
  },
  {
    season: 'Hiver',
    element: 'Eau',
    dates: '7 novembre 2025 – 20 janvier 2026',
    description: 'La saison de l\'introspection. La nature et l\'organisme se mettent au repos. C\'est aussi le temps de l\'introspection et des émotions enfouies au fond de soi, comme la peur, ou de facultés comme la volonté.',
    organ: 'Rein',
    viscera: 'Vessie',
    color: 'Noir',
    emotion: 'La peur',
    orientation: 'Nord',
    taste: 'Salé',
    regenerationHours: '15h – 19h (15h – 17h : vessie / 17h – 19h : rein)',
    climate: 'Froid'
  }
]

const elementEmojis: Record<string, string> = {
  'Bois': '🪵',
  'Feu': '🔥',
  'Terre': '🌍',
  'Métal': '⚙️',
  'Eau': '💧'
}

const seasonEmojis: Record<string, string> = {
  'Printemps': '🍃',
  'Été': '🌅',
  'Intersaison': '🌾',
  'Automne': '🍂',
  'Hiver': '❄️'
}

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
              Saviez-vous que les saisons chinoises ne correspondent pas tout à fait à celles de notre calendrier grégorien, et que le Nouvel An chinois ne débute jamais le 1er janvier ? 🎆
            </p>
            <p className="text-text-dark/80 mb-4">
              En Chine le premier jour du premier mois du calendrier lunaire se situe entre fin janvier et mi-février, à l&apos;équinoxe de printemps 🍃
            </p>
            <p className="text-text-dark/80 mb-4">
              En effet, le calendrier énergétique des saisons chinoises est un calendrier luni-solaire (qui utilise à la fois le calendrier solaire et lunaire ☀️🌕). Il aurait été créé en 2697 avant Jésus-Christ selon de précises observations des Chinois des mouvements de la lune, du soleil, phénomènes climatiques et agricoles, durée relative des jours et des nuits, …
            </p>
            <p className="text-text-dark/80 mb-4">
              Cette particularité s&apos;explique par l&apos;utilisation d&apos;un calendrier luni-solaire, qui associe les cycles du soleil ☀️ et de la lune 🌕 pour structurer le temps.
            </p>
            <p className="text-text-dark/80 mb-4">
              Les mois chinois ont 29 jours ou 30 jours reflétant ainsi les révolutions lunaires.
            </p>
            
            <h2 className="text-2xl font-serif font-bold text-text-dark mt-8 mb-4">
              Le principe des 5 saisons en MTC
            </h2>
            <p className="text-text-dark/80 mb-4">
              Pour la médecine chinoise, on ne peut pas passer brutalement d&apos;une saison à une autre en une seule journée comme l&apos;indique le calendrier.
            </p>
            <p className="text-text-dark/80 mb-4">
              C&apos;est pourquoi les Chinois ont intégré une 5ᵉ saison nommée <strong>Intersaison</strong>. Celle-ci correspond à un changement d&apos;état, une transformation. Elle permet la synchronisation à ce « qui vient » mais « qui n&apos;est pas encore ». Ainsi elle représente le passage qui nous permet de quitter l&apos;hiver et de nous préparer au printemps, mais aussi de quitter le printemps et de nous préparer à l&apos;été, ainsi de suite…
            </p>
            <p className="text-text-dark/80 mb-8">
              Dans la pensée chinoise, le cycle des saisons repose sur la théorie des 5 éléments ou cinq mouvements. Chacun est représenté par un « élément » (Bois, Feu, Terre, Métal et Eau) qui, est associé à une saison et à un couple organe/entrailles et de ce fait à une fonction énergétique et un mouvement énergétique. Au niveau thérapeutique, chaque saison est donc en relation avec des correspondances somatiques, sensorielles et émotionnelles.
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
                    {seasonEmojis[season.season]} {elementEmojis[season.element]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-serif font-bold text-text-dark mb-2">
                      {season.season === 'Intersaison' ? 'L\'INTERSAISON' : `LE ${season.season.toUpperCase()}`} – la saison {season.season === 'Printemps' ? 'de l\'expansion' : season.season === 'Été' ? 'de l\'extériorisation' : season.season === 'Intersaison' ? 'de la transformation' : season.season === 'Automne' ? 'de la transition' : 'de l\'introspection'}
                    </h2>
                    <p className="text-lg text-text-dark/70 mb-2">
                      {season.season === 'Intersaison' ? 'L\'intersaison, l\'élément' : `Au ${season.season.toLowerCase()}, l'élément`} <strong>{season.element}</strong> domine
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
                    Ce à quoi correspond {season.season === 'Intersaison' ? 'l\'intersaison' : `le ${season.season.toLowerCase()}`} en Médecine Traditionnelle Chinoise :
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Élément</p>
                      <p className="font-medium text-text-dark">{elementEmojis[season.element]} {season.element}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Saison</p>
                      <p className="font-medium text-text-dark">{season.season}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Organe</p>
                      <p className="font-medium text-text-dark">{season.organ}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Viscère</p>
                      <p className="font-medium text-text-dark">{season.viscera}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Couleur</p>
                      <p className="font-medium text-text-dark">{season.color}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Heures de régénération</p>
                      <p className="font-medium text-text-dark text-sm">{season.regenerationHours}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Goût</p>
                      <p className="font-medium text-text-dark">{season.taste}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Émotion</p>
                      <p className="font-medium text-text-dark">{season.emotion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Orientation</p>
                      <p className="font-medium text-text-dark">{season.orientation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-dark/60 mb-1">Énergie climatique</p>
                      <p className="font-medium text-text-dark">{season.climate}</p>
                    </div>
                  </div>
                </div>

                <p className="text-text-dark/80 italic leading-relaxed">
                  En Médecine Traditionnelle Chinoise, la saison {season.season === 'Intersaison' ? 'de l&apos;intersaison' : `du ${season.season.toLowerCase()}`} est associée au couple d&apos;organes viscères {season.organ}/{season.viscera.toLowerCase()}.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary/10 rounded-lg p-8">
            <p className="text-text-dark/80 leading-relaxed mb-4">
              La vie est en continuel mouvement où l&apos;homme doit s&apos;harmoniser avec son environnement.
            </p>
            <p className="text-text-dark/80 leading-relaxed mb-4">
              Peut-être vous demandez vous « pourquoi les Chinois se soucient-ils autant de tout ceci ? »
            </p>
            <p className="text-text-dark/80 leading-relaxed">
              C&apos;est parce que pour eux, il existe une hiérarchie à laquelle nous sommes tous reliés. Nous sommes tous une partie d&apos;un grand tout et dans le même temps, tout l&apos;univers est en nous (c&apos;est le tao). Cela nous rend interdépendant de tout et de tous. D&apos;où cette quête permanente de l&apos;harmonie.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

