"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Title3D } from "./Title3D";
import { SiteContent } from "@/lib/site/content";

export function Hero({ data }: { data: SiteContent }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 w-full"
      >
        {/* Replaced H1 with Title3D */}
        <div className="mb-[-50px] md:mb-[-100px] mt-[-50px]">
            <Title3D />
        </div>

        <p className="text-xl md:text-2xl font-light tracking-widest text-white/70 mb-12 uppercase">
          {data.home.tagline}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold tracking-wider uppercase hover:bg-white/90 transition-colors rounded-full"
          >
            Listen to Work
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
      >
          <ArrowRight className="w-6 h-6 rotate-90" />
      </motion.div>
    </div>
  );
}
