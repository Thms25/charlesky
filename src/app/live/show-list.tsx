"use client";

import { motion } from "framer-motion";
import { MapPin, Ticket } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SiteContent } from "@/lib/site/content";

export function ShowList({ data }: { data: SiteContent }) {
  const [hoveredShow, setHoveredShow] = useState<string | null>(null);
  const shows = data.live.shows;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-2">
            {data.live.headline}
          </h1>
          <p className="text-xl text-neutral-400 font-light tracking-widest uppercase">
            {data.live.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm font-mono text-neutral-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          LIVE UPDATES
        </div>
      </motion.div>

      <div className="flex flex-col">
        {shows.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseEnter={() => setHoveredShow(show.id)}
            onMouseLeave={() => setHoveredShow(null)}
            className="group relative border-t border-neutral-800 py-8 transition-colors duration-300 hover:bg-neutral-900/50"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
              {/* Date */}
              <div className="flex flex-row md:flex-col items-baseline gap-4 md:gap-0 w-full md:w-32 shrink-0">
                <span className="text-3xl font-bold tracking-tighter group-hover:text-white transition-colors text-neutral-300">
                  {show.date}
                </span>
                <span className="text-sm text-neutral-600 font-mono">{show.year}</span>
              </div>

              {/* Venue & Location */}
              <div className="flex-grow space-y-1 w-full md:w-auto">
                <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-white group-hover:translate-x-2 transition-transform duration-300">
                  {show.venue}
                </h3>
                <div className="flex items-center gap-2 text-neutral-500 text-sm tracking-wider uppercase">
                  <MapPin className="w-4 h-4" />
                  {show.city}, {show.country}
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
                <div className="text-right">
                  {show.status === "sold_out" && (
                    <span className="inline-block px-3 py-1 text-xs font-bold text-red-500 border border-red-500/30 bg-red-500/10 rounded-full uppercase tracking-widest">
                      Sold Out
                    </span>
                  )}
                  {show.status === "selling_fast" && (
                    <span className="inline-block px-3 py-1 text-xs font-bold text-amber-500 border border-amber-500/30 bg-amber-500/10 rounded-full uppercase tracking-widest">
                      Selling Fast
                    </span>
                  )}
                </div>

                <motion.a
                  href={show.ticketLink}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all whitespace-nowrap",
                    show.status === "sold_out"
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "bg-white text-black hover:bg-neutral-200"
                  )}
                >
                  <Ticket className="w-4 h-4" />
                  {show.status === "sold_out" ? "Waitlist" : "Get Tickets"}
                </motion.a>
              </div>
            </div>

            {/* Hover Background Effect */}
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-900/10 to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              layoutId="row-highlight"
            />
          </motion.div>
        ))}

        {/* Bottom Border */}
        <div className="border-t border-neutral-800" />
      </div>

      <div className="mt-16 text-center">
        <p className="text-neutral-500 text-sm uppercase tracking-widest mb-4">
          Don&apos;t see your city?
        </p>
        <a href="/contact" className="text-white border-b border-white/30 hover:border-white pb-1 transition-colors">
          Request a show
        </a>
      </div>
    </>
  );
}
