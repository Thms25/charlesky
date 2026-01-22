"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { SiteContent } from "@/lib/site/content";

import { ParallaxGallery } from "@/components/bio/ParallaxGallery";

export function BioContent({ data }: { data: SiteContent }) {
  return (
    <div className="min-h-screen py-20 overflow-hidden">
      {/* Intro Section */}
      <div className="max-w-4xl mx-auto px-6 mb-32 flex flex-col md:flex-row gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 aspect-3/4 bg-neutral-800 rounded-lg overflow-hidden relative"
        >
          <Image 
            src={data.bio.headerImage || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop"}
            alt="Charlesky Portrait"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            {data.bio.headline}
          </h1>
          <div className="space-y-4 text-neutral-400 leading-relaxed text-lg">
            {data.bio.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>
      </div>

      <ParallaxGallery gallery={data.bio.gallery} />

      {/* Services Grid */}
      <div className="max-w-4xl mx-auto px-6 mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-neutral-800 pt-12">
            <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-xl">Services</h3>
                <ul className="text-neutral-500 space-y-3">
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        Music Production
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        Mixing & Mastering
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        Vocal Production
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        Sound Design
                    </li>
                </ul>
            </div>
            <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-6 text-xl">Selected Clients</h3>
                <ul className="text-neutral-500 space-y-3">
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        Universal Music
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        Sony Music
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        Indie Label X
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        Artist Y
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
