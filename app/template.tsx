"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { easeCanopy } from "@/components/motion/easings";

export default function RouteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const reduce = useReducedMotion();
  const isAuth = pathname.startsWith("/auth");

  if (reduce) {
    return <>{children}</>;
  }

  return (
    <motion.div
      className="min-h-0"
      initial={
        isAuth
          ? { opacity: 0.85, y: 8 }
          : { opacity: 0, y: 20 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: isAuth ? 0.22 : 0.46,
        ease: easeCanopy,
      }}
    >
      {children}
    </motion.div>
  );
}
