"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** Ressort un peu plus souple = glissement bien lisible */
const pillSpring = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.85,
};

type Metrics = { left: number; top: number; width: number; height: number };

export default function StitchBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  const navRef = useRef<HTMLElement>(null);
  const refHome = useRef<HTMLAnchorElement>(null);
  const refAgenda = useRef<HTMLAnchorElement>(null);
  const refAdmin = useRef<HTMLAnchorElement>(null);

  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const activeIndex: number | null =
    pathname === "/"
      ? 0
      : pathname === "/agenda"
        ? 1
        : pathname?.startsWith("/admin")
          ? 2
          : null;

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (activeIndex === null) {
      setMetrics(null);
      return;
    }

    const links = [refHome, refAgenda, refAdmin];
    const link = links[activeIndex]?.current;
    if (!link) return;

    const nr = nav.getBoundingClientRect();
    const lr = link.getBoundingClientRect();

    setMetrics({
      left: lr.left - nr.left,
      top: lr.top - nr.top,
      width: lr.width,
      height: lr.height,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    measure();
    const t = requestAnimationFrame(() => measure());
    return () => cancelAnimationFrame(t);
  }, [measure, pathname]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(nav);
    const refs = [refHome, refAgenda, refAdmin];
    refs.forEach((r) => {
      if (r.current) ro.observe(r.current);
    });

    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [measure]);

  if (pathname?.startsWith("/auth")) {
    return null;
  }

  const adminHref = isAdmin ? "/admin" : "/auth/signin?callbackUrl=/admin";

  const iconClass = (active: boolean) =>
    `material-symbols-outlined relative z-[1] text-[22px] sm:text-2xl transition-colors duration-200 ${
      active
        ? "filled-icon text-on-primary"
        : "text-primary/50 group-hover:text-primary"
    }`;

  const labelClass = (active: boolean) =>
    `relative z-[1] mt-0.5 text-[10px] uppercase tracking-tighter transition-colors duration-200 ${
      active
        ? "text-on-primary font-semibold"
        : "text-primary/50 font-medium group-hover:text-primary"
    }`;

  const itemShell = (active: boolean) =>
    `group relative z-[1] flex min-h-[3.35rem] flex-col items-center justify-center rounded-full px-2 sm:px-4 py-1.5 font-sans outline-none ring-primary/25 focus-visible:ring-2 ${
      active ? "" : ""
    }`;

  const showPill = metrics !== null && activeIndex !== null;

  return (
    <nav
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 z-50 px-2 sm:px-4 pb-safe pt-3 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/10 rounded-t-[2rem] shadow-[0_-4px_24px_rgba(26,28,21,0.06)]"
      aria-label="Navigation principale"
    >
      {showPill && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full bg-primary shadow-[0_6px_20px_rgba(51,69,55,0.35)]"
          initial={false}
          animate={{
            left: metrics.left,
            top: metrics.top,
            width: metrics.width,
            height: metrics.height,
            opacity: 1,
          }}
          transition={pillSpring}
        />
      )}

      <div className="relative z-[1] grid w-full grid-cols-3 items-stretch gap-1">
        <Link
          ref={refHome}
          href="/"
          className={`${itemShell(pathname === "/")} justify-self-center w-full max-w-[7.5rem] sm:max-w-none`}
        >
          <span className={iconClass(pathname === "/")}>home</span>
          <span className={labelClass(pathname === "/")}>Accueil</span>
        </Link>
        <Link
          ref={refAgenda}
          href="/agenda"
          className={`${itemShell(pathname === "/agenda")} justify-self-center w-full max-w-[7.5rem] sm:max-w-none`}
        >
          <span className={iconClass(pathname === "/agenda")}>event_note</span>
          <span className={labelClass(pathname === "/agenda")}>Agenda</span>
        </Link>
        <Link
          ref={refAdmin}
          href={adminHref}
          className={`${itemShell(pathname?.startsWith("/admin") ?? false)} justify-self-center w-full max-w-[7.5rem] sm:max-w-none`}
        >
          <span className={iconClass(pathname?.startsWith("/admin") ?? false)}>
            admin_panel_settings
          </span>
          <span className={labelClass(pathname?.startsWith("/admin") ?? false)}>
            Admin
          </span>
        </Link>
      </div>
    </nav>
  );
}
