"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Dynamic import with ssr disabled to prevent WebGL context loss on Next.js navigation
const Title3DClient = dynamic(() => import("./Title3DClient").then(mod => ({ default: mod.Title3DClient })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[500px] flex items-center justify-center pointer-events-none">
      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-white" style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        letterSpacing: '0.05em',
        textShadow: '0 0 20px rgba(255,255,255,0.3)'
      }}>
        CHARLESKY
      </h1>
    </div>
  ),
});

export function Title3D() {
  const pathname = usePathname();
  const [resetKey, setResetKey] = useState(0);

  // Force a complete unmount/remount of the 3D scene whenever the path changes (navigating back to home)
  // or when the component mounts.
  useEffect(() => {
    setResetKey(prev => prev + 1);
  }, [pathname]);

  return <Title3DClient key={`${pathname}-${resetKey}`} />;
}
