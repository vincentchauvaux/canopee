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
    <div className="min-h-screen flex items-center justify-center bg-accent py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-card shadow-lg text-center">
        <h1 className="text-2xl font-serif font-bold text-text-dark mb-4">
          Connexion impossible
        </h1>
        <p className="text-text-dark/80 mb-6">{message}</p>
        <Link
          href="/auth/signin"
          className="inline-block w-full py-3 px-4 rounded-button bg-primary text-white hover:bg-primary-light transition-colors"
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
      <div className="min-h-screen flex items-center justify-center bg-accent py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-card shadow-lg text-center">
          <p className="text-text-dark/80">Chargement...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
