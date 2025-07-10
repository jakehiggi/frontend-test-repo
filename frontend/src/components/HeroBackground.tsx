import { useEffect, useState } from "react";

type Ripple = { id: number; x: number; y: number; created: number };

export function HeroBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [lightPos, setLightPos] = useState({ x: 0, y: 0 });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Blobs */}
      <div className="absolute w-[70vw] h-[70vw] bg-purple-700 opacity-40 blur-2xl rounded-full animate-blob1" />
      <div className="absolute w-[50vw] h-[50vw] bg-pink-500 opacity-40 blur-2xl rounded-full animate-blob2 top-1/2 left-1/3" />
      <div className="absolute w-[90vw] h-[90vw] bg-indigo-600 opacity-40 blur-2xl rounded-full animate-blob3 top-1/4 left-1/2" />

      {/* Mouse Light */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen">
        <div
          className="absolute inset-0 transition-all duration-100"
          style={{
            background: `radial-gradient(circle at ${lightPos.x}px ${lightPos.y}px, rgba(255, 255, 255, 0.15), transparent 250px)`
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-100"
          style={{
            background: `radial-gradient(circle at ${lightPos.x}px ${lightPos.y}px, rgba(255, 255, 255, 0.08), transparent 450px)`
          }}
        />
      </div>
    </div>
  );
}

