"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Dynamic import with ssr disabled to prevent WebGL context loss on Next.js navigation
const Title3DClient = dynamic(() => import("./Title3DClient").then(mod => ({ default: mod.Title3DClient })), {
  ssr: false,
});

export function Title3D() {
  const pathname = usePathname();

  return <Title3DClient key={`${pathname}`} />;
}
