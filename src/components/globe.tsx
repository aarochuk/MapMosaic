"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

export function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load realistic Earth textures
  const earthTexture = useLoader(
    TextureLoader,
    "/placeholder.svg?height=1024&width=2048"
  );
  const bumpTexture = useLoader(
    TextureLoader,
    "/placeholder.svg?height=1024&width=2048"
  );
  const cloudsTexture = useLoader(
    TextureLoader,
    "/placeholder.svg?height=1024&width=2048"
  );

  // Animate rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
          transparent={false}
          shininess={100}
          specular={new THREE.Color(0x222222)}
        />
      </Sphere>

      {/* Clouds layer */}
      <Sphere ref={cloudsRef} args={[2.01, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial
          map={cloudsTexture}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[2.15, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={new THREE.Color(0x4a90e2)}
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Inner atmosphere */}
      <Sphere args={[2.05, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={new THREE.Color(0x87ceeb)}
          transparent={true}
          opacity={0.1}
          side={THREE.FrontSide}
        />
      </Sphere>
    </group>
  );
}
