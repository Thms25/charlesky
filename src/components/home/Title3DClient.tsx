"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Center, Float, Environment } from "@react-three/drei";
import { useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

function Scene() {
  const meshRef = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();
  const { viewport } = useThree();
  
  // Improved responsive scale based on viewport width
  // Mobile: smaller scale, Tablet: medium, Desktop: full
  const scale = viewport.width < 4 ? viewport.width / 10 : viewport.width < 8 ? viewport.width / 9 : 1;
  // Also adjust text size based on viewport
  const textSize = viewport.width < 4 ? 0.8 : viewport.width < 8 ? 0.9 : 1;

  // "Fall back" effect: Map scrollYProgress to rotation
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [0, -Math.PI / 2]);

  useFrame(() => {
    if (meshRef.current) {
        meshRef.current.rotation.x = rotateX.get();
    }
  });

  return (
    <group ref={meshRef} scale={scale}>
      <Center>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={textSize}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
          >
            CHARLESKY
            <meshStandardMaterial color="white" roughness={0.3} metalness={0.8} />
          </Text3D>
        </Float>
      </Center>
    </group>
  );
}

export function Title3DClient() {
  return (
    <div className="w-full h-[300px] md:h-[500px] flex items-center justify-center pointer-events-none">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <spotLight position={[-10, 10, 5]} intensity={1} angle={0.5} penumbra={1} />
          <Environment preset="city" />
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
