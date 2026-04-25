"use client";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function Bottle({ image, scrollProgress, accent }: { image: string; scrollProgress: number; accent: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      image,
      (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        setTexture(tex);
      },
      undefined,
      () => setTexture(null) // silently fail
    );
  }, [image]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = scrollProgress * Math.PI * 2 + Math.sin(Date.now() * 0.0003) * 0.05;
    meshRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.05;
  });

  const bottleGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.38, 0));
    points.push(new THREE.Vector2(0.4, 0.02));
    points.push(new THREE.Vector2(0.42, 0.1));
    points.push(new THREE.Vector2(0.42, 1.8));
    points.push(new THREE.Vector2(0.4, 1.9));
    points.push(new THREE.Vector2(0.35, 2.0));
    points.push(new THREE.Vector2(0.25, 2.15));
    points.push(new THREE.Vector2(0.16, 2.3));
    points.push(new THREE.Vector2(0.14, 2.5));
    points.push(new THREE.Vector2(0.14, 3.0));
    points.push(new THREE.Vector2(0.16, 3.02));
    points.push(new THREE.Vector2(0.16, 3.1));
    points.push(new THREE.Vector2(0.14, 3.1));
    return new THREE.LatheGeometry(points, 64);
  }, []);

  const labelGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.425, 0.425, 1.0, 64, 1, true, -Math.PI * 0.6, Math.PI * 1.2);
  }, []);

  const accentColor = new THREE.Color(accent);

  return (
    <group ref={meshRef} scale={0.8} position={[0, -1.2, 0]}>
      <mesh geometry={bottleGeometry}>
        <meshPhysicalMaterial color="#1a3318" roughness={0.05} metalness={0.1} transmission={0.3} thickness={0.5} clearcoat={1} clearcoatRoughness={0.05} ior={1.5} envMapIntensity={1.5} />
      </mesh>
      <mesh geometry={labelGeometry} position={[0, 0.95, 0]}>
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.6} metalness={0.0} side={THREE.DoubleSide} />
        ) : (
          <meshStandardMaterial color="#F8F3E8" roughness={0.6} metalness={0.0} side={THREE.DoubleSide} />
        )}
      </mesh>
      <mesh position={[0, 2.95, 0]}>
        <cylinderGeometry args={[0.155, 0.165, 0.25, 32]} />
        <meshStandardMaterial color={accentColor} roughness={0.15} metalness={0.95} />
      </mesh>
    </group>
  );
}

export default function BottleScene({ image, scrollProgress, accent }: { image: string; scrollProgress: number; accent: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-6xl font-light" style={{ color: accent, opacity: 0.15 }}>G·M</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        onError={() => setError(true)}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 3, -3]} intensity={0.5} />
        <spotLight position={[0, 5, 2]} intensity={0.8} angle={0.4} penumbra={0.5} />
        <Environment preset="studio" />
        <Bottle image={image} scrollProgress={scrollProgress} accent={accent} />
      </Canvas>
    </div>
  );
}
