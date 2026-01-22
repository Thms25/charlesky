"use client";

import { motion } from "framer-motion";
import { SiteContent } from "@/lib/site/content";
import { AudioPlayer } from "@/components/AudioPlayer";

export function LatestRelease({ data }: { data: SiteContent }) {
  return (
    <section className="min-h-screen flex flex-col justify-center py-20 relative">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black via-purple-900/10 to-black" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase mb-4 block">
            Latest Release
          </span>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
            {data.home.latestRelease.title}
          </h2>
          <p className="text-xl text-neutral-400 mb-8 leading-relaxed max-w-2xl">
            {data.home.latestRelease.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          {data.home.latestRelease.audioSrc ? (
            <AudioPlayer
              src={data.home.latestRelease.audioSrc}
              artwork={data.home.latestRelease.artworkSrc}
              title={data.home.latestRelease.title}
              artist="Charlesky"
            />
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/50">
              No audio uploaded for the latest release yet.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
