"use client";

import { motion } from "framer-motion";

export default function Bio() {
  return (
    <div className="max-w-4xl mx-auto py-12 flex flex-col md:flex-row gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 aspect-[3/4] bg-neutral-800 rounded-lg overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 to-neutral-700" />
        {/* Placeholder for Image */}
        <div className="absolute inset-0 flex items-center justify-center text-neutral-500 font-mono text-sm">
          [PORTRAIT IMAGE]
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full md:w-1/2 space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          BEHIND THE CONSOLE
        </h1>
        <div className="space-y-4 text-neutral-400 leading-relaxed text-lg">
          <p>
            Charlesky is a music producer and mixing engineer based in [City]. 
            With a passion for analog warmth and digital precision, he crafts 
            soundscapes that resonate.
          </p>
          <p>
            Specializing in [Genre 1], [Genre 2], and [Genre 3], his approach 
            combines technical expertise with artistic intuition to bring every 
            artist's vision to life.
          </p>
        </div>

        <div className="pt-8 grid grid-cols-2 gap-4">
            <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-2">Services</h3>
                <ul className="text-sm text-neutral-500 space-y-1">
                    <li>Music Production</li>
                    <li>Mixing & Mastering</li>
                    <li>Vocal Production</li>
                    <li>Sound Design</li>
                </ul>
            </div>
            <div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-2">Selected Clients</h3>
                <ul className="text-sm text-neutral-500 space-y-1">
                    <li>Universal Music</li>
                    <li>Sony Music</li>
                    <li>Indie Label X</li>
                    <li>Artist Y</li>
                </ul>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
