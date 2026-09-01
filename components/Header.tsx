"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pages contenu / légales : fond blanc dès le départ
  const forceWhiteHeader =
    pathname === "/profile" ||
    pathname === "/mon-parcours" ||
    pathname === "/yin-yoga" ||
    pathname === "/faq" ||
    pathname === "/saisons-mtc" ||
    pathname === "/mentions-legales" ||
    pathname === "/politique-confidentialite" ||
    pathname === "/cookies";
  const shouldHaveWhiteBackground = forceWhiteHeader || isScrolled;

  const isHome = pathname === "/";
  const showWordmark = !isHome || isScrolled;
  const wordmark = "Canopée";

  useEffect(() => {
    if (forceWhiteHeader) {
      setIsScrolled(true);
      return;
    }

    const updateFromScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    if (pathname !== "/") {
      updateFromScroll();
      window.addEventListener("scroll", updateFromScroll, { passive: true });
      return () => window.removeEventListener("scroll", updateFromScroll);
    }

    const hero = document.getElementById("hero");
    if (!hero) {
      updateFromScroll();
      window.addEventListener("scroll", updateFromScroll, { passive: true });
      return () => window.removeEventListener("scroll", updateFromScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0.45, rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [forceWhiteHeader, pathname]);

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
          <Link href="/" className="flex items-center">
            <BrandMark
              size={64}
              className={`origin-center transition-all duration-500 ease-out ${
                isHome && !isScrolled
                  ? "h-10 w-10 sm:h-11 sm:w-11 -rotate-180"
                  : "h-8 w-8 sm:h-9 sm:w-9 rotate-0"
              } ${
                shouldHaveWhiteBackground ? "opacity-100" : "opacity-50"
              }`}
              priority
            />
            <span className="sr-only">Canopée</span>
            <span
              aria-hidden="true"
              className={`header-wordmark text-2xl font-serif font-bold ${
                showWordmark ? "is-visible" : ""
              } ${
                shouldHaveWhiteBackground ? "text-primary" : "text-white"
              }`}
            >
              {wordmark.split("").map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className="header-wordmark-letter"
                  style={{
                    transitionDelay: showWordmark
                      ? `${index * 55}ms`
                      : `${(wordmark.length - 1 - index) * 35}ms`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/mon-parcours"
              className={`transition-colors font-medium ${
                shouldHaveWhiteBackground
                  ? "text-text-dark hover:text-primary"
                  : "text-white hover:text-accent"
              }`}
            >
              Mon parcours
            </Link>
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
                  onClick={() => {
                    signOut({ redirect: false }).then(() => {
                      window.location.href = "/";
                    });
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors"
              >
                Se connecter
              </button>
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
            <Link
              href="/mon-parcours"
              className={`transition-colors block mb-3 ${
                shouldHaveWhiteBackground
                  ? "text-text-dark hover:text-primary"
                  : "text-white hover:text-accent"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mon parcours
            </Link>
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
                    signOut({ redirect: false }).then(() => {
                      window.location.href = "/";
                    });
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors text-left"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signIn();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors text-left w-full"
              >
                Se connecter
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
