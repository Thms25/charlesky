"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Dynamic import with ssr disabled to prevent WebGL context loss on Next.js navigation
const AudioPlayerClient = dynamic(() => import("./AudioPlayerClient").then(mod => ({ default: mod.AudioPlayerClient })), {
  ssr: false,
  loading: () => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <div className="h-64 md:h-80 w-full flex items-center justify-center">
        <div className="text-white/50">Loading audio player...</div>
      </div>
    </div>
  ),
});

export function AudioPlayer({ src, artwork, title, artist, scale = 0.8 }: { src?: string; artwork?: string; title?: string; artist?: string; scale?: number }) {
  const pathname = usePathname();
  const [resetKey, setResetKey] = useState(0);

  // Force a complete unmount/remount of the 3D scene whenever the path changes
  useEffect(() => {
    setResetKey(prev => prev + 1);
  }, [pathname]);

  return <AudioPlayerClient key={`${pathname}-${resetKey}`} src={src} artwork={artwork} title={title} artist={artist} scale={scale} />;
}
