"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Globe } from "@/components/globe";
import { LoadingScreen } from "@/components/loading-screen";
import { UI } from "@/components/ui-overlay";

export default function Page() {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* 3D Scene */}
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 45,
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Environment */}
          <Environment preset="sunset" />

          {/* Globe */}
          <Globe />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Loading Screen */}
      <Suspense fallback={<LoadingScreen />}>
        <LoadingScreen />
      </Suspense>

      {/* UI Overlay */}
      <UI />
    </div>
  );
}
