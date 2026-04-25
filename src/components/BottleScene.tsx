"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";

interface BottleProps {
  image: string;
  scrollProgress: number;
  accent: string;
}

function Bottle({ image, scrollProgress, accent }: BottleProps) {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useTexture(image);

  // Configure texture
  useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.offset.set(0, 0);
  }, [texture]);

  // Scroll-driven rotation and position
  useFrame(() => {
    if (!meshRef.current) return;
    // Smooth rotation based on scroll
    meshRef.current.rotation.y = scrollProgress * Math.PI * 2 + Math.sin(Date.now() * 0.0003) * 0.05;
    // Gentle floating
    meshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.05;
  });

  // Create bottle shape using LatheGeometry for realistic silhouette
  const bottleGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    // Bottom
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.38, 0));
    points.push(new THREE.Vector2(0.4, 0.02));
    // Body
    points.push(new THREE.Vector2(0.42, 0.1));
    points.push(new THREE.Vector2(0.42, 1.8));
    // Shoulder
    points.push(new THREE.Vector2(0.4, 1.9));
    points.push(new THREE.Vector2(0.35, 2.0));
    points.push(new THREE.Vector2(0.25, 2.15));
    // Neck
    points.push(new THREE.Vector2(0.16, 2.3));
    points.push(new THREE.Vector2(0.14, 2.5));
    points.push(new THREE.Vector2(0.14, 3.0));
    // Lip
    points.push(new THREE.Vector2(0.16, 3.02));
    points.push(new THREE.Vector2(0.16, 3.1));
    points.push(new THREE.Vector2(0.14, 3.1));

    return new THREE.LatheGeometry(points, 64);
  }, []);

  // Label area - a slightly offset cylinder section for the label
  const labelGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.425, 0.425, 1.0, 64, 1, true, -Math.PI * 0.6, Math.PI * 1.2);
    return geo;
  }, []);

  const accentColor = new THREE.Color(accent);

  return (
    <group ref={meshRef} scale={0.8} position={[0, -1.2, 0]}>
      {/* Main bottle body - glass */}
      <mesh geometry={bottleGeometry}>
        <meshPhysicalMaterial
          color="#1a3318"
          roughness={0.05}
          metalness={0.1}
          transmission={0.3}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          ior={1.5}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Label - photo texture */}
      <mesh geometry={labelGeometry} position={[0, 0.95, 0]}>
        <meshStandardMaterial
          map={texture}
          roughness={0.6}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Foil capsule */}
      <mesh position={[0, 2.95, 0]}>
        <cylinderGeometry args={[0.155, 0.165, 0.25, 32]} />
        <meshStandardMaterial
          color={accentColor}
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>
    </group>
  );
}

interface SceneProps {
  image: string;
  scrollProgress: number;
  accent: string;
}

export default function BottleScene({ image, scrollProgress, accent }: SceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 3, -3]} intensity={0.5} />
        <spotLight
          position={[0, 5, 2]}
          intensity={0.8}
          angle={0.4}
          penumbra={0.5}
        />
        <Environment preset="studio" />
        <Bottle
          image={image}
          scrollProgress={scrollProgress}
          accent={accent}
        />
      </Canvas>
    </div>
  );
}
