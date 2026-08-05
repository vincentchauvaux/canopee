import Link from "next/link";
import Footer from "@/components/Footer";

interface LegalPageShellProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageShell({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
    <main className="min-h-screen bg-accent overflow-x-hidden">
      <div className="pt-24 pb-16">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-primary font-medium mb-3">Informations légales</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-dark mb-4">
              {title}
            </h1>
            <p className="text-text-dark/70 text-lg mb-2">{description}</p>
            <p className="text-sm text-text-dark/50 mb-10">
              Dernière mise à jour : {lastUpdated}
            </p>

            <article className="bg-white rounded-2xl border border-primary/10 p-6 sm:p-10 shadow-canopee-soft space-y-8 text-text-dark/85 leading-relaxed">
              {children}
            </article>

            <nav className="mt-8 flex flex-wrap gap-4 text-sm">
              <Link
                href="/mentions-legales"
                className="text-primary hover:underline"
              >
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="text-primary hover:underline"
              >
                Politique de confidentialité
              </Link>
              <Link href="/cookies" className="text-primary hover:underline">
                Cookies
              </Link>
            </nav>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
