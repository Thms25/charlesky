"use client";

import { Suspense, useEffect, useRef, useState, memo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import { Play, Pause } from "lucide-react";
import * as THREE from "three";

function Disc({ isPlaying, artwork, scale = 1 }: { isPlaying: boolean; artwork?: string; scale?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, artwork || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop");
  
  // Cleanup texture on unmount and clear cache so we don't get a disposed texture on remount
  useEffect(() => {
    return () => {
      texture.dispose();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - useLoader has a clear method in @react-three/fiber
      useLoader.clear(THREE.TextureLoader, artwork || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop");
    };
  }, [texture, artwork]);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate if playing - slower speed
      if (isPlaying) {
        meshRef.current.rotation.z -= delta * 0.3;
      }
    }
  });

  return (
    // Tilted slightly for 3D effect but more "straight" as requested
    <group ref={meshRef} rotation={[0.2, 0.2, 0]} scale={scale}>
       {/* Main Vinyl Body */}
       <mesh>
        <cylinderGeometry args={[1.5, 1.5, 0.05, 64]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Grooves hint (torus rings) - moved up to avoid z-fighting */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.026, 0]}>
           <ringGeometry args={[0.6, 1.45, 64]} />
           <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* White rim/contour line */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.027, 0]}>
         <ringGeometry args={[1.48, 1.5, 64]} />
         <meshBasicMaterial color="#333" />
      </mesh>

      {/* Label with Artwork */}
      <mesh position={[0, 0.028, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial map={texture} /> 
      </mesh>

      {/* White center spindle hole area */}
      <mesh position={[0, 0.029, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  const [bars, setBars] = useState<number[]>(new Array(40).fill(10));

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBars(Array.from({ length: 40 }, () => Math.max(10, Math.random() * 100)));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const displayedBars = isPlaying ? bars : new Array(40).fill(10);

  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full overflow-hidden opacity-50">
      {displayedBars.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-white rounded-full transition-all duration-100 ease-in-out"
          style={{
            height: `${height}%`,
          }}
        />
      ))}
    </div>
  );
}

function Scene({ isPlaying, artwork, scale }: { isPlaying: boolean; artwork?: string; scale?: number }) {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <Disc isPlaying={isPlaying} artwork={artwork} scale={scale} />
      </Float>
      <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
    </>
  );
}

const Visualizer3D = memo(function Visualizer3D({ isPlaying, artwork, scale }: { isPlaying: boolean; artwork?: string; scale?: number }) {
    return (
        <div className="h-64 md:h-80 w-full relative bg-black/20 rounded-xl overflow-hidden">
          <Canvas camera={{ position: [0, 0, 4], fov: 35 }} key={artwork}>
            <Suspense fallback={null}>
              <Scene isPlaying={isPlaying} artwork={artwork} scale={scale} />
            </Suspense>
          </Canvas>
        </div>
    );
});

export function AudioPlayerClient({ src, artwork, title, artist, scale = 0.8 }: { src?: string; artwork?: string; title?: string; artist?: string; scale?: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    const onEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);
    audio.addEventListener("ended", onEnd);

    // Stop audio on unmount
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
      setProgress(val);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* 3D Visual */}
        <Visualizer3D isPlaying={isPlaying} artwork={artwork} scale={scale} />

        {/* Controls */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{title || "Unknown Track"}</h3>
            <p className="text-white/60 text-lg">{artist || "Unknown Artist"}</p>
          </div>

          <Waveform isPlaying={isPlaying} />

          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
            <div className="flex justify-between text-xs text-white/40 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button 
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition active:scale-95"
            >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={src} />
    </div>
  );
}
