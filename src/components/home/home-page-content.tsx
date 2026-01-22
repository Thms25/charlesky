"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Hero } from "@/components/home/Hero";
import { LatestRelease } from "@/components/home/LatestRelease";
import { TheLab } from "@/components/home/TheLab";
import { SiteContent } from "@/lib/site/content";

export function HomePageContent({ data }: { data: SiteContent }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50 mix-blend-difference"
        style={{ scaleX }}
      />

      <Hero data={data} />
      <LatestRelease data={data} />
      <TheLab />
    </div>
  );
}
