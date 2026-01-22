"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

function ParallaxImage({ src, alt, className, yOffset = 50 }: { src: string; alt: string; className?: string; yOffset?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Disable parallax on small screens (can be done via CSS or JS, here effectively JS logic could be added but simpler is CSS handling or just keeping it subtle)
  // For simplicity, we keep the effect as it usually works okay if container handles overflow
  const y = useTransform(scrollYProgress, [0, 1], [0, -yOffset]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={ref} 
      style={{ y, opacity }}
      className={`relative overflow-hidden rounded-lg ${className}`}
    >
      <Image 
        src={src} 
        alt={alt} 
        fill 
        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
      />
    </motion.div>
  );
}

function FloatingText({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Bio() {
  return (
    <div className="min-h-screen py-20 overflow-hidden">
      {/* Intro Section */}
      <div className="max-w-4xl mx-auto px-6 mb-32 flex flex-col md:flex-row gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 aspect-[3/4] bg-neutral-800 rounded-lg overflow-hidden relative"
        >
          <Image 
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop"
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
            BEHIND THE CONSOLE
          </h1>
          <div className="space-y-4 text-neutral-400 leading-relaxed text-lg">
            <p>
              Charlesky is a music producer and mixing engineer based in Brussels. 
              With a passion for analog warmth and digital precision, he crafts 
              soundscapes that resonate.
            </p>
            <p>
              Specializing in Synthwave, Electronic, and Pop, his approach 
              combines technical expertise with artistic intuition to bring every 
              artist's vision to life.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Parallax Gallery Section */}
      {/* Changed: Stacked layout on mobile, Absolute/Parallax on Desktop */}
      <div className="max-w-7xl mx-auto px-6 relative flex flex-col md:block gap-20 md:gap-0 min-h-auto md:min-h-[150vh]">
        
        {/* Item 1 */}
        <div className="relative md:absolute md:left-0 md:top-0 w-full md:w-96 aspect-[4/5] z-10">
             <ParallaxImage 
                src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=2070&auto=format&fit=crop"
                alt="Studio Gear"
                yOffset={100}
             />
             {/* Mobile Text */}
             <div className="block md:hidden mt-6 text-center">
                <h3 className="text-2xl font-bold mb-2 text-white">Analog Soul</h3>
                <p className="text-neutral-400">Where vintage hardware meets modern workflow.</p>
             </div>
        </div>

        {/* Desktop Text 1 */}
        <div className="hidden md:block absolute right-10 top-40 max-w-sm text-right z-20">
            <FloatingText delay={0.2}>
                <h3 className="text-3xl font-bold mb-2 text-white">Analog Soul</h3>
                <p className="text-neutral-400">Where vintage hardware meets modern workflow.</p>
            </FloatingText>
        </div>

        {/* Item 2 */}
        <div className="relative md:absolute md:right-20 md:top-[600px] w-full md:w-[500px] aspect-video z-10">
            <ParallaxImage 
                src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2079&auto=format&fit=crop"
                alt="Live Performance"
                yOffset={-50}
            />
            {/* Mobile Text */}
            <div className="block md:hidden mt-6 text-center">
                <h3 className="text-2xl font-bold mb-2 text-white">Live Energy</h3>
                <p className="text-neutral-400">Translating studio perfection to the stage.</p>
            </div>
        </div>

        {/* Desktop Text 2 */}
        <div className="hidden md:block absolute left-32 top-[500px] max-w-sm z-20">
             <FloatingText delay={0.3}>
                <h3 className="text-3xl font-bold mb-2 text-white">Live Energy</h3>
                <p className="text-neutral-400">Translating studio perfection to the stage.</p>
            </FloatingText>
        </div>

        {/* Item 3 */}
        <div className="relative md:absolute md:left-10 md:bottom-0 w-full md:w-80 aspect-square z-10">
             <ParallaxImage 
                src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop"
                alt="Mixing Console"
                yOffset={80}
             />
             {/* Mobile Text */}
             <div className="block md:hidden mt-6 text-center">
                <h3 className="text-2xl font-bold mb-2 text-white">Sonic Precision</h3>
                <p className="text-neutral-400">Every detail matters in the final mix.</p>
            </div>
        </div>
         
         {/* Desktop Text 3 */}
         <div className="hidden md:block absolute right-40 bottom-40 max-w-sm text-right z-20">
             <FloatingText delay={0.4}>
                <h3 className="text-3xl font-bold mb-2 text-white">Sonic Precision</h3>
                <p className="text-neutral-400">Every detail matters in the final mix.</p>
            </FloatingText>
        </div>

      </div>

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
