"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Neon Nights",
    artist: "The Midnight Echo",
    role: "Producer / Mix",
    color: "bg-purple-500",
  },
  {
    id: 2,
    title: "Urban Jungle",
    artist: "Sarah V",
    role: "Mixing Engineer",
    color: "bg-emerald-500",
  },
  {
    id: 3,
    title: "Deep Dive",
    artist: "Ocean Sounds",
    role: "Producer",
    color: "bg-blue-500",
  },
  {
    id: 4,
    title: "Retrograde",
    artist: "Synthwave Collective",
    role: "Mastering",
    color: "bg-pink-500",
  },
  {
    id: 5,
    title: "Acoustic Sessions",
    artist: "John Doe",
    role: "Recording / Mix",
    color: "bg-amber-500",
  },
  {
    id: 6,
    title: "Future Bass",
    artist: "Drop Zone",
    role: "Producer / Mix",
    color: "bg-cyan-500",
  },
];

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

export default function Work() {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl md:text-6xl font-bold mb-12 tracking-tighter"
      >
        SELECTED WORK
      </motion.h1>

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
            {/* Placeholder Artwork */}
            <div
              className={`absolute inset-0 ${project.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
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
    </div>
  );
}
