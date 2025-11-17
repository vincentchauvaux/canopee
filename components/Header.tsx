"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sur les pages profile, mon-parcours, yin-yoga et faq, le header doit avoir un fond blanc dès le départ
  const isProfilePage = pathname === "/profile";
  const isMonParcoursPage = pathname === "/mon-parcours";
  const isYinYogaPage = pathname === "/yin-yoga";
  const isFAQPage = pathname === "/faq";
  const shouldHaveWhiteBackground =
    isProfilePage ||
    isMonParcoursPage ||
    isYinYogaPage ||
    isFAQPage ||
    isScrolled;

  useEffect(() => {
    if (isProfilePage || isMonParcoursPage || isYinYogaPage || isFAQPage) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProfilePage, isMonParcoursPage, isYinYogaPage, isFAQPage]);

  const displayName =
    session?.user?.name || (session?.user as any)?.firstName || "Utilisateur";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldHaveWhiteBackground
          ? "bg-white shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div
              className={`text-2xl font-serif font-bold transition-colors ${
                shouldHaveWhiteBackground ? "text-primary" : "text-white"
              }`}
            >
              🌿 Canopée
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                {(session.user as any)?.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`transition-colors font-medium ${
                      shouldHaveWhiteBackground
                        ? "text-text-dark hover:text-primary"
                        : "text-white hover:text-accent"
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className={`transition-colors font-medium ${
                    shouldHaveWhiteBackground
                      ? "text-text-dark hover:text-primary"
                      : "text-white hover:text-accent"
                  }`}
                >
                  {displayName}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => signIn()}
                  className={`px-4 py-2 transition-colors font-medium ${
                    shouldHaveWhiteBackground
                      ? "text-text-dark hover:text-primary"
                      : "text-white hover:text-accent"
                  }`}
                >
                  Se connecter
                </button>
                <button
                  onClick={() => signIn()}
                  className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors"
                >
                  S&apos;inscrire
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden transition-colors ${
              shouldHaveWhiteBackground ? "text-text-dark" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden mt-4 pb-4 border-t pt-4 transition-colors ${
              shouldHaveWhiteBackground ? "border-gray" : "border-white/30"
            }`}
          >
            {session ? (
              <div className="flex flex-col space-y-3">
                {(session.user as any)?.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`transition-colors ${
                      shouldHaveWhiteBackground
                        ? "text-text-dark hover:text-primary"
                        : "text-white hover:text-accent"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className={`transition-colors ${
                    shouldHaveWhiteBackground
                      ? "text-text-dark hover:text-primary"
                      : "text-white hover:text-accent"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {displayName}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors text-left"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    signIn();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 transition-colors text-left ${
                    shouldHaveWhiteBackground
                      ? "text-text-dark hover:text-primary"
                      : "text-white hover:text-accent"
                  }`}
                >
                  Se connecter
                </button>
                <button
                  onClick={() => {
                    signIn();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors text-left"
                >
                  S&apos;inscrire
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
