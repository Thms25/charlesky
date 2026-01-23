"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { SiteContent } from "@/lib/site/content";

type GalleryItem = SiteContent["bio"]["gallery"][0];

function ScatteredImage({ 
    item, 
    index, 
    className 
}: { 
    item: GalleryItem; 
    index: number;
    className?: string; 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  // Parallax Y: slower moves
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  // Scale: subtly grows when in center view
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);
  
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  return (
    <div 
      ref={ref} 
      className={`relative ${className} flex items-center justify-center`}
    >
      <motion.div 
        style={{ y: springY, scale, opacity }}
        className="relative w-full h-full group z-10"
      >
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
            <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover transition-all duration-1000 grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110"
            />
            
            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
            />
        </div>
      </motion.div>

      {/* Pin-and-scroll Text Label */}
      <motion.div 
          className={`absolute z-20 hidden md:block w-72 pointer-events-none
            ${index % 2 === 0 ? '-left-[20%] text-right' : '-right-[20%] text-left'}
          `}
          style={{ 
              opacity,
              y: useTransform(scrollYProgress, [0.3, 0.7], [20, -20]), // Minimal movement to feel almost fixed
          }}
      >
          <h3 className="text-4xl font-bold text-white/90 mb-2 leading-none">{item.phraseTitle}</h3>
          <p className="text-neutral-500 text-sm tracking-widest uppercase font-mono">{item.phraseBody}</p>
          <div className={`h-px w-12 bg-white/20 mt-4 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`} />
      </motion.div>

      {/* Mobile Text (Simple Overlay) */}
      <div className="absolute bottom-4 left-4 right-4 md:hidden z-20">
         <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-3 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-0.5">{item.phraseTitle}</h3>
            <p className="text-neutral-400 text-[10px] uppercase">{item.phraseBody}</p>
         </div>
      </div>
    </div>
  );
}

export function ParallaxGallery({ gallery }: { gallery: SiteContent["bio"]["gallery"] }) {
  // artificially expand gallery to have more "chaos" if needed, or just map carefully
  // Let's use the provided 3 items but arrange them in a "Big Chaos" layout
  // We can duplicate them for effect if only 3 exist to fill the space
  const items = gallery.length < 4 ? [...gallery, ...gallery] : gallery;

  return (
    <section className="py-32 w-full bg-neutral-950 overflow-hidden relative">
        {/* Background Ambient Light */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-9xl md:text-[12rem] font-bold text-white/5 absolute top-0 left-0 -translate-y-1/2 select-none pointer-events-none tracking-tighter">
                GALLERY
            </h2>
            
            <div className="flex flex-col gap-0 mt-20 relative">
                
                {/* Row 1: Big Hero Image */}
                <div className="flex justify-start sticky top-20 z-10 pointer-events-none min-h-[100vh]">
                    {items[0] && (
                        <div className="pointer-events-auto md:ml-10 w-full md:w-[70vw] aspect-video">
                            <ScatteredImage 
                                item={items[0]} 
                                index={0} 
                                className="w-full h-full"
                            />
                        </div>
                    )}
                </div>

                {/* Row 2: Overlapping Tall Image */}
                <div className="flex justify-end sticky top-40 z-20 pointer-events-none min-h-[100vh] -mt-[40vh]">
                    {items[1] && (
                        <div className="pointer-events-auto md:mr-20 w-full md:w-[40vw] aspect-[3/4]">
                             <ScatteredImage 
                                item={items[1]} 
                                index={1} 
                                className="w-full h-full"
                            />
                        </div>
                    )}
                </div>

                {/* Row 3: Square */}
                <div className="flex justify-start sticky top-32 z-30 pointer-events-none min-h-[100vh] -mt-[30vh]">
                    {items[2] && (
                        <div className="pointer-events-auto md:ml-32 w-full md:w-[45vw] aspect-square">
                             <ScatteredImage 
                                item={items[2]} 
                                index={2} 
                                className="w-full h-full"
                            />
                        </div>
                    )}
                </div>

                {/* Row 4: Wide Cinematic */}
                <div className="flex justify-center sticky top-20 z-40 pointer-events-none min-h-[100vh] -mt-[40vh]">
                    {items[3] && (
                        <div className="pointer-events-auto w-full md:w-[85vw] aspect-[21/9]">
                             <ScatteredImage 
                                item={items[3]} 
                                index={3} 
                                className="w-full h-full"
                            />
                        </div>
                    )}
                </div>

                {/* Row 5: Final Impact */}
                <div className="flex justify-end sticky top-40 z-50 pointer-events-none min-h-[80vh] -mt-[30vh] pb-40">
                    {items[4] && (
                        <div className="pointer-events-auto md:mr-10 w-full md:w-[50vw] aspect-[4/5]">
                         <ScatteredImage 
                            item={items[4]} 
                            index={4} 
                            className="w-full h-full"
                        />
                        </div>
                    )}
                </div>

            </div>
        </div>
    </section>
  );
}
