"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { SiteContent } from "@/lib/site/content";
import { useState } from "react";
import { AudioPlayer } from "@/components/AudioPlayer";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedId);

  return (
    <>
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
            onClick={() => setSelectedId(project.id)}
            className="group relative aspect-square bg-neutral-900 rounded-lg overflow-hidden cursor-pointer"
          >
            {project.artworkSrc ? (
                 <img src={project.artworkSrc} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            ) : (
                <div
                    className={`absolute inset-0 ${project.color || "bg-neutral-800"} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                />
            )}

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-full">
                <Play className="w-8 h-8 fill-white text-white" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent">
              <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
              <p className="text-sm text-white/70 uppercase tracking-wider mb-2">{project.artist}</p>
              <span className="inline-block px-2 py-1 text-xs border border-white/20 rounded-full text-white/50">
                {project.role}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md"
                onClick={() => setSelectedId(null)}
            >
                <div className="flex min-h-full items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-4xl bg-neutral-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end p-4 absolute top-0 right-0 z-10">
                            <button onClick={() => setSelectedId(null)} className="p-2 bg-black/20 rounded-full text-white/50 hover:text-white transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                    <div className="p-4 md:p-12">
                         <div className={`text-center mb-8 ${selectedProject.audioSrc ? "hidden md:block" : ""}`}>
                            <h2 className="text-3xl font-bold tracking-tighter mb-2">{selectedProject.title}</h2>
                            <p className="text-xl text-white/60">{selectedProject.artist}</p>
                            <div className="mt-4 inline-block px-3 py-1 text-sm border border-white/20 rounded-full text-white/50">
                                {selectedProject.role}
                            </div>
                         </div>

                             {selectedProject.audioSrc ? (
                                 <AudioPlayer 
                                    src={selectedProject.audioSrc}
                                    artwork={selectedProject.artworkSrc}
                                    title={selectedProject.title}
                                    artist={selectedProject.artist}
                                    scale={0.6}
                                 />
                             ) : (
                                 <div className="p-12 text-center border border-white/10 rounded-2xl bg-white/5 text-white/50">
                                     No audio preview available for this project.
                                 </div>
                             )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
