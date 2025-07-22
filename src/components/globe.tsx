"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

export function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const [cloudsTexture, setCloudsTexture] = useState<THREE.Texture | null>(
    null
  );

  // Load Earth textures
  useEffect(() => {
    // Removed all placeholder.svg texture loading and usage
  }, []);

  // Animate rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial
          map={earthTexture}
          transparent={false}
          shininess={100}
          specular={new THREE.Color(0x222222)}
        />
      </Sphere>

      {/* Clouds layer */}
      {cloudsTexture && (
        <Sphere args={[2.01, 64, 64]} position={[0, 0, 0]}>
          <meshPhongMaterial
            map={cloudsTexture}
            transparent={true}
            opacity={0.3}
            depthWrite={false}
          />
        </Sphere>
      )}

      {/* Atmosphere glow */}
      <Sphere args={[2.1, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={new THREE.Color(0x4a90e2)}
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}
