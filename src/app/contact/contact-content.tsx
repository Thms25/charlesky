"use client";

import { motion } from "framer-motion";
import { Mail, Instagram, Music, Youtube, Twitter, CloudLightning, type LucideIcon } from "lucide-react";
import { SiteContent } from "@/lib/site/content";

export function ContactContent({ data }: { data: SiteContent }) {
  const socials = [
    data.contact.socials.instagram && { icon: Instagram, href: data.contact.socials.instagram },
    data.contact.socials.youtube && { icon: Youtube, href: data.contact.socials.youtube },
    data.contact.socials.spotify && { icon: Music, href: data.contact.socials.spotify },
    data.contact.socials.twitter && { icon: Twitter, href: data.contact.socials.twitter },
    data.contact.socials.soundcloud && { icon: CloudLightning, href: data.contact.socials.soundcloud },
    // Always show email icon if email exists
    data.contact.email && { icon: Mail, href: `mailto:${data.contact.email}` },
  ].filter((s): s is { icon: LucideIcon; href: string } => Boolean(s));

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-12"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          {data.contact.headline}
        </h1>
        
        <a 
            href={`mailto:${data.contact.email}`}
            className="inline-block text-2xl md:text-4xl text-neutral-400 hover:text-white transition-colors border-b-2 border-neutral-800 hover:border-white pb-2"
        >
            {data.contact.email}
        </a>

        <div className="flex justify-center gap-8 pt-12">
            {socials.map((social, index) => (
                <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
