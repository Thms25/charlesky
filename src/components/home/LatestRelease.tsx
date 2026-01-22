"use client";

import { motion } from "framer-motion";
import { SiteContent } from "@/lib/site/content";

export function LatestRelease({ data }: { data: SiteContent }) {


  return (
    <section className="min-h-screen flex flex-col justify-center py-20 relative">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black via-purple-900/10 to-black" />
      <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                  <motion.span 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="text-purple-400 font-mono text-sm tracking-widest uppercase mb-4 block"
                  >
                      Latest Release
                  </motion.span>
                  <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter"
                  >
                      {data.home.latestRelease.title}
                  </motion.h2>
                  <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="text-xl text-neutral-400 mb-8 leading-relaxed"
                  >
                      {data.home.latestRelease.description}
                  </motion.p>
                  
                  {/* Additional info or buttons could go here, but the player is the focus */}
              </div>
              
              <div className="w-full md:w-1/2 flex justify-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden"
                  >
                    <iframe 
                      style={{ borderRadius: "12px" }} 
                      src={data.home.latestRelease.spotifyEmbedUrl}
                      width="100%" 
                      height="352" 
                      frameBorder="0" 
                      allowFullScreen 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                    />
                  </motion.div>
              </div>
          </div>
      </div>
    </section>
  );
}
