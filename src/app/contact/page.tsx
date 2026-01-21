"use client";

import { motion } from "framer-motion";
import { Mail, Instagram, Twitter, Music } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-12"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          LET'S WORK TOGETHER
        </h1>
        
        <a 
            href="mailto:contact@charlesky.com"
            className="inline-block text-2xl md:text-4xl text-neutral-400 hover:text-white transition-colors border-b-2 border-neutral-800 hover:border-white pb-2"
        >
            contact@charlesky.com
        </a>

        <div className="flex justify-center gap-8 pt-12">
            {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Music, href: "#" }, // Spotify/Soundcloud
                { icon: Mail, href: "mailto:contact@charlesky.com" },
            ].map((social, index) => (
                <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-neutral-900 rounded-full hover:bg-white hover:text-black transition-colors"
                >
                    <social.icon className="w-6 h-6" />
                </motion.a>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
