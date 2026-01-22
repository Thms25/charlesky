"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const navItems = [
  { name: "Work", path: "/work" },
  { name: "Live", path: "/live" },
  { name: "Bio", path: "/bio" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Close menu on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const canUseDOM = typeof document !== "undefined";
  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-9999 bg-black/55 backdrop-blur-2xl isolate"
          onClick={() => setIsOpen(false)}
        >
          {/* Darkening scrim layer to keep text readable while blur stays visible */}
          <div className="absolute inset-0 bg-linear-to-b from-black/85 via-black/55 to-black/85 pointer-events-none z-0" />

          {/* Top bar inside overlay */}
          <div className="absolute top-0 left-0 right-0 px-6 py-6 md:px-12 flex items-center justify-between z-20">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold tracking-tighter uppercase text-white"
            >
              Charlesky
            </Link>

            <button
              className="relative text-white"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <div className="relative w-6 h-6">
                <span className="absolute left-0 top-1/2 w-6 h-0.5 bg-white -translate-y-1/2 rotate-45" />
                <span className="absolute left-0 top-1/2 w-6 h-0.5 bg-white -translate-y-1/2 -rotate-45" />
              </div>
            </button>
          </div>

          {/* Centered menu */}
          <div className="min-h-dvh grid place-items-center px-6 relative z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-10">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.06 + idx * 0.06, duration: 0.32 }}
                    className="leading-none"
                  >
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-5xl sm:text-6xl font-black tracking-tighter uppercase text-white transition-opacity",
                        isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-sm bg-black/20">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter uppercase z-50 mix-blend-difference relative text-white">
            Charlesky
          </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative text-sm font-medium tracking-wide uppercase transition-colors hover:text-white/80",
                  isActive ? "text-white" : "text-white/50"
                )}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 relative text-white group"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <motion.span 
                animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                className="absolute w-6 h-0.5 bg-white origin-center"
            />
            <motion.span 
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="absolute w-6 h-0.5 bg-white"
            />
            <motion.span 
                animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                className="absolute w-6 h-0.5 bg-white origin-center"
            />
          </div>
        </button>
      </div>
      </nav>

      {canUseDOM ? createPortal(overlay, document.body) : null}
    </>
  );
}
