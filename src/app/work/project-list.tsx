"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { SiteContent } from "@/lib/site/content";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ProjectList({ projects }: { projects: SiteContent["work"]["projects"] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {projects.map((project) => (
        <motion.div
          key={project.id}
          variants={item}
          className="group relative aspect-square bg-neutral-900 rounded-lg overflow-hidden cursor-pointer"
        >
          <div
            className={`absolute inset-0 ${project.color || "bg-neutral-800"} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
          />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
              <Play className="w-8 h-8 fill-white text-white" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
            <p className="text-sm text-white/70 uppercase tracking-wider mb-2">{project.artist}</p>
            <span className="inline-block px-2 py-1 text-xs border border-white/20 rounded-full text-white/50">
              {project.role}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
