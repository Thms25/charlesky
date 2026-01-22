"use client";

import { motion } from "framer-motion";
import { Headphones, Youtube, Radio } from "lucide-react";
import Link from "next/link";

const labItems = [
  { slug: "gear", title: "Studio Gear", icon: Headphones, desc: "My analog & digital chain", color: "bg-orange-500" },
  { slug: "tutorials", title: "Tutorials", icon: Youtube, desc: "Production tips & tricks", color: "bg-red-600" },
  { slug: "playlists", title: "Playlists", icon: Radio, desc: "What I'm listening to", color: "bg-blue-500" },
];

export function TheLab() {
  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center tracking-tighter">THE LAB</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {labItems.map((item, i) => (
                  <Link href={`/lab/${item.slug}`} key={i} className="block">
                      <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.2 }}
                          whileHover={{ y: -10 }}
                          className="group relative h-80 bg-neutral-900 rounded-2xl overflow-hidden cursor-pointer border border-white/5"
                      >
                           <div className={`absolute inset-0 ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                              <div className="mb-6 p-4 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors">
                                  <item.icon className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                              <p className="text-neutral-400">{item.desc}</p>
                           </div>
                      </motion.div>
                  </Link>
              ))}
          </div>
      </div>
    </section>
  );
}
