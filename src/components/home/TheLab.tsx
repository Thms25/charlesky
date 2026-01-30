"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSiteContent } from "@/lib/site/useSiteContent";
import Image from "next/image";

export function TheLab() {
  const { data } = useSiteContent();

  const visibleCards = data.lab.home.cards.filter(card => !card.hidden);

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center tracking-tighter uppercase">{data.lab.home.headline}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleCards.map((card, i) => (
                  <Link href={card.link} key={card.id} className="block">
                      <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.2 }}
                          whileHover={{ y: -10 }}
                          className="group relative h-80 bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5"
                      >
                           {/* Background Image with Overlay */}
                           {card.imageSrc && (
                             <div className="absolute inset-0">
                               <Image 
                                 src={card.imageSrc} 
                                 alt={card.title} 
                                 fill 
                                 className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105 transform"
                               />
                               <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                             </div>
                           )}
                           
                           {/* Content */}
                           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                              <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
                              <p className="text-neutral-400">{card.subtitle}</p>
                           </div>
                      </motion.div>
                  </Link>
              ))}
          </div>
      </div>
    </section>
  );
}
