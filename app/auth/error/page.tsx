"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const messages: Record<string, string> = {
  AccessDenied: "Email ou mot de passe incorrect. Vérifiez vos identifiants et réessayez.",
  Configuration: "Une erreur de configuration du serveur s'est produite.",
  Verification: "Le lien de connexion a expiré ou a déjà été utilisé.",
  Default: "Une erreur est survenue lors de la connexion.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const message = messages[error] || messages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-xl shadow-lg ring-1 ring-outline-variant/15 text-center">
        <h1 className="text-2xl font-serif font-bold text-primary mb-4">
          Connexion impossible
        </h1>
        <p className="text-on-surface-variant font-sans mb-6">{message}</p>
        <Link
          href="/auth/signin"
          className="inline-block w-full py-3 px-4 rounded-full bg-primary text-on-primary font-sans font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Réessayer
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface py-12 px-4">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-xl ring-1 ring-outline-variant/15 text-center">
          <p className="text-on-surface-variant font-sans">Chargement...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
