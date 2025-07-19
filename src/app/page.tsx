"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Globe } from "@/components/globe";
import { LoadingScreen } from "@/components/loading-screen";
import { UI } from "@/components/ui-overlay";

export default function Page() {
  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600">
      {/* 3D Scene */}
      <Canvas
        className="absolute inset-0 z-0"
        camera={{
          position: [0, 0, 5],
          fov: 45,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          {/* Background stars */}
          <Stars
            radius={300}
            depth={60}
            count={20000}
            factor={7}
            saturation={0}
            fade={true}
          />

          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#4a90e2"
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
            autoRotateSpeed={0.3}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Loading Screen */}
      <Suspense fallback={<LoadingScreen />}>
        <div style={{ display: "none" }}>
          <LoadingScreen />
        </div>
      </Suspense>

      {/* UI Overlay */}
      <div className="absolute top-10 left-10 z-50 text-white bg-red-500 p-4">
        UI TEST
      </div>
    </div>
  );
}
