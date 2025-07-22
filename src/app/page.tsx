"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stars } from "@react-three/drei";
import { Globe } from "../components/globe";
import { LoadingScreen } from "@/components/loading-screen";
import { UIOverlay } from "../components/ui-overlay";
import { useState, useEffect } from "react";
import { ContentForm } from "@/components/content-form";
import { Modal } from "../components/modal";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";

export default function Page() {
  const [showForm, setShowForm] = useState(false);
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm]);
  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600">
      {/* Floating Add Content Button */}
      <Button
        className="absolute bottom-5 right-6 z-50 transition-all duration-200 bg-transparent hover:bg-transparent border-none outline-none focus:outline-none focus:ring-0 shadow-none p-4 w-20 h-20"
        onClick={() => setShowForm(true)}
        size="icon"
        variant="ghost"
      >
        <Send
          className="w-36 h-36"
          style={{
            color: "#ffffff",
            width: "40px",
            height: "40px",
            position: "relative",
            bottom: "-20px",
            right: "-30px",
          }}
        />
      </Button>
      {/* Modal Overlay for Form */}
      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 text-gray-500 hover:text-gray-800 hover:bg-gray-100 z-10"
            onClick={() => setShowForm(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
          <ContentForm onCancel={() => setShowForm(false)} />
        </div>
      </Modal>
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
      <UIOverlay />
    </div>
  );
}
