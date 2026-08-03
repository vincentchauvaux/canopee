import { NextResponse } from "next/server";
import { computeLunarData, formatPhaseLabel } from "@/lib/lunar";

function parseLunopiaHtml(html: string) {
  // Lunopia enveloppe les libellés dans <strong>…:</strong> valeur
  const phaseMatch =
    html.match(/id=["']_phase["'][^>]*>[\s\S]*?<\/strong>\s*([^<]+)/i) ??
    html.match(/Phase de la lune\s*:\s*(?:<\/strong>)?\s*([^<]+)/i);

  const illuminationMatch =
    html.match(/id=["']_illumination["'][^>]*>[\s\S]*?<\/strong>\s*(\d+)\s*%/i) ??
    html.match(/Illumination\s*:\s*(?:<\/strong>)?\s*(\d+)\s*%/i);

  const distanceMatch =
    html.match(/id=["']_distance["'][^>]*>[\s\S]*?<\/strong>\s*([\d\s]+)\s*km/i) ??
    html.match(/Distance à la terre\s*:\s*(?:<\/strong>)?\s*([\d\s]+)\s*km/i);

  const nextFullMoonMatch =
    html.match(
      /id=["']_prochaine_pleine_lune["'][^>]*>[\s\S]*?<\/strong>\s*(\d+)\s*jours/i,
    ) ??
    html.match(/Prochaine pleine lune\s*:\s*(?:<\/strong>)?\s*(\d+)\s*jours/i);

  const phase = phaseMatch ? formatPhaseLabel(phaseMatch[1]) : null;
  const illumination = illuminationMatch ? parseInt(illuminationMatch[1], 10) : null;
  const distance = distanceMatch ? distanceMatch[1].replace(/\s/g, "") : null;
  const nextFullMoon = nextFullMoonMatch ? parseInt(nextFullMoonMatch[1], 10) : null;

  return { phase, illumination, distance, nextFullMoon };
}

// GET - Infos lunaires (lunopia.com + calcul local de secours)
export async function GET() {
  const computed = computeLunarData();

  try {
    const response = await fetch("https://www.lunopia.com/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      // Évite un cache Next/fetch qui figerait l’illumination plusieurs jours
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Lunopia HTTP ${response.status}`);
    }

    const html = await response.text();
    const scraped = parseLunopiaHtml(html);

    if (!scraped.phase) {
      throw new Error("Phase lunaire non trouvée dans la page lunopia");
    }

    // Illumination scrapée si fiable (0–100), sinon calcul local (= graphique)
    const illumination =
      scraped.illumination !== null &&
      Number.isFinite(scraped.illumination) &&
      scraped.illumination >= 0 &&
      scraped.illumination <= 100
        ? scraped.illumination
        : computed.illuminationPercent;

    return NextResponse.json({
      phase: scraped.phase,
      illumination,
      distance: scraped.distance,
      nextFullMoon: scraped.nextFullMoon,
      source: "lunopia",
    });
  } catch (error) {
    console.error("Error fetching lunar data:", error);

    return NextResponse.json({
      phase: computed.phase,
      illumination: computed.illuminationPercent,
      distance: null,
      nextFullMoon: null,
      fallback: true,
      source: "computed",
    });
  }
}
