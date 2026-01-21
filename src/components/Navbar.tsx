"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Work", path: "/work" },
  { name: "Live", path: "/live" },
  { name: "Bio", path: "/bio" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-sm bg-black/20">
      <Link href="/" className="text-xl font-bold tracking-tighter uppercase z-50 mix-blend-difference">
        Charlesky
      </Link>

      <div className="flex items-center gap-8">
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
    </nav>
  );
}
