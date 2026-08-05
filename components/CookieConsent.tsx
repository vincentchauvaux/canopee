"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "canopee-cookie-consent";

type ConsentValue = "accepted" | "essential";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const saveConsent = (value: ConsentValue) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
      // Miroir cookie (1 an) pour cohérence avec la politique cookies
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `${CONSENT_KEY}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-6 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-primary/15 bg-white shadow-canopee-deep p-4 sm:p-6">
        <h2
          id="cookie-consent-title"
          className="font-serif text-lg font-bold text-text-dark mb-2"
        >
          Cookies et confidentialité
        </h2>
        <p
          id="cookie-consent-desc"
          className="text-sm text-text-dark/75 leading-relaxed mb-4"
        >
          Canopée utilise des cookies essentiels pour sécuriser votre session de
          connexion. Aucun cookie publicitaire n&apos;est déposé. En savoir plus
          :{" "}
          <Link href="/cookies" className="text-primary underline">
            politique cookies
          </Link>{" "}
          et{" "}
          <Link
            href="/politique-confidentialite"
            className="text-primary underline"
          >
            confidentialité
          </Link>
          .
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => saveConsent("essential")}
            className="flex-1 px-4 py-2.5 rounded-button bg-gray text-text-dark hover:bg-gray/80 transition-colors text-sm font-medium"
          >
            Cookies essentiels uniquement
          </button>
          <button
            type="button"
            onClick={() => saveConsent("accepted")}
            className="flex-1 px-4 py-2.5 rounded-button bg-primary text-white hover:bg-primary-light transition-colors text-sm font-medium"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
