import { NextRequest, NextResponse } from 'next/server'

// GET - Récupérer les informations lunaires depuis lunopia.com
export async function GET(request: NextRequest) {
  try {
    // Récupérer la page de lunopia.com pour extraire les informations
    const response = await fetch('https://www.lunopia.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données lunaires')
    }

    const html = await response.text()

    // Extraire les informations de la page HTML
    // Format attendu : "Phase de la lune : dernier croissant"
    const phaseMatch = html.match(/Phase de la lune\s*:\s*([^<]+)/i)
    const illuminationMatch = html.match(/Illumination\s*:\s*(\d+)\s*%/i)
    const distanceMatch = html.match(/Distance à la terre\s*:\s*([\d\s]+)\s*km/i)
    const nextFullMoonMatch = html.match(/Prochaine pleine lune\s*:\s*(\d+)\s*jours/i)

    const phase = phaseMatch ? phaseMatch[1].trim() : null
    const illumination = illuminationMatch ? parseInt(illuminationMatch[1]) : null
    const distance = distanceMatch ? distanceMatch[1].replace(/\s/g, '') : null
    const nextFullMoon = nextFullMoonMatch ? parseInt(nextFullMoonMatch[1]) : null

    // URL de l'image de la lune depuis lunopia.com (sans date)
    const moonImageUrl = `https://www.lunopia.com/mod/moon.png?bg=transparent&fg=@ffffff&date=false&percent=true&phase=true&size=200`

    // Ne retourner que si on a au moins la phase
    if (!phase) {
      throw new Error('Phase lunaire non trouvée')
    }

    return NextResponse.json({
      phase,
      illumination,
      distance,
      nextFullMoon,
      imageUrl: moonImageUrl,
    })
  } catch (error) {
    console.error('Error fetching lunar data:', error)
    
    // En cas d'erreur, retourner des données par défaut basées sur le calcul
    const now = new Date()
    const referenceNewMoon = new Date('2024-01-11T00:00:00Z').getTime()
    const lunarCycle = 29.530588 * 24 * 60 * 60 * 1000
    const daysSinceNewMoon = (now.getTime() - referenceNewMoon) % lunarCycle
    const dayOfCycle = daysSinceNewMoon / (24 * 60 * 60 * 1000)
    
    let phase = 'Nouvelle Lune'
    let illumination = 0
    
    if (dayOfCycle < 1.84) {
      phase = 'Nouvelle Lune'
      illumination = Math.round((dayOfCycle / 1.84) * 5)
    } else if (dayOfCycle < 5.53) {
      phase = 'Premier Croissant'
      illumination = Math.round(5 + ((dayOfCycle - 1.84) / (5.53 - 1.84)) * 45)
    } else if (dayOfCycle < 9.22) {
      phase = 'Premier Quartier'
      illumination = Math.round(50 + ((dayOfCycle - 5.53) / (9.22 - 5.53)) * 25)
    } else if (dayOfCycle < 12.91) {
      phase = 'Gibbeuse Croissante'
      illumination = Math.round(75 + ((dayOfCycle - 9.22) / (12.91 - 9.22)) * 20)
    } else if (dayOfCycle < 16.61) {
      phase = 'Pleine Lune'
      illumination = Math.round(95 + ((dayOfCycle - 12.91) / (16.61 - 12.91)) * 5)
    } else if (dayOfCycle < 20.3) {
      phase = 'Gibbeuse Décroissante'
      illumination = Math.round(100 - ((dayOfCycle - 16.61) / (20.3 - 16.61)) * 20)
    } else if (dayOfCycle < 23.99) {
      phase = 'Dernier Quartier'
      illumination = Math.round(80 - ((dayOfCycle - 20.3) / (23.99 - 20.3)) * 25)
    } else {
      phase = 'Dernier Croissant'
      illumination = Math.round(55 - ((dayOfCycle - 23.99) / (29.53 - 23.99)) * 50)
    }

    const moonImageUrl = `https://www.lunopia.com/mod/moon.png?bg=transparent&fg=@ffffff&date=false&percent=true&phase=true&size=200`

    return NextResponse.json({
      phase,
      illumination,
      distance: null,
      nextFullMoon: null,
      imageUrl: moonImageUrl,
      fallback: true,
    })
  }
}

