"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Continuous champagne bubble field — full-viewport WebGL background.
 * - Custom shader: spherical gradient + rim glow, additive blending so bubbles glow.
 * - Bubbles drift upward with subtle horizontal sway, recycle when off-top.
 * - Mouse position shifts the whole field laterally for parallax.
 */
function Bubbles({ count = 280, mouse }: { count?: number; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Points>(null!);
  const { viewport, size } = useThree();

  const { positions, scales, speeds, sway } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const sway = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = Math.random() * 0.6 + 0.15;
      speeds[i] = Math.random() * 0.6 + 0.25;
      sway[i] = Math.random() * Math.PI * 2;
    }
    return { positions, scales, speeds, sway };
  }, [count]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: typeof window !== "undefined" ? window.devicePixelRatio : 1 },
        uColor: { value: new THREE.Color("#E8C779") }, // soft champagne gold
      },
      vertexShader: /* glsl */ `
        attribute float aScale;
        attribute float aSpeed;
        attribute float aSway;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;

        void main() {
          vec3 p = position;
          float t = uTime * aSpeed;
          // rise
          p.y = mod(p.y + t * 1.4 + 15.0, 30.0) - 15.0;
          // horizontal sway
          p.x += sin(uTime * 0.6 + aSway) * 0.35 * aScale;
          p.z += cos(uTime * 0.4 + aSway) * 0.25 * aScale;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aScale * 28.0 * uPixelRatio * (1.0 / -mv.z);
          // fade in from bottom & out at top
          float yN = (p.y + 15.0) / 30.0;
          vAlpha = smoothstep(0.0, 0.15, yN) * (1.0 - smoothstep(0.85, 1.0, yN));
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          // bubble: bright rim + soft core
          float rim = smoothstep(0.5, 0.42, d);
          float core = smoothstep(0.0, 0.45, d);
          float a = rim * 0.9 + (1.0 - core) * 0.25;
          gl_FragColor = vec4(uColor, a * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state, delta) => {
    material.uniforms.uTime.value += delta;
    if (ref.current) {
      // gentle parallax to mouse
      ref.current.position.x += (mouse.current.x * 1.2 - ref.current.position.x) * 0.04;
      ref.current.position.y += (mouse.current.y * 0.6 - ref.current.position.y) * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aSway" args={[sway, 1]} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

/** A wine-purple liquid blob that follows the cursor — subtle, additive. */
function CursorOrb({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();
  useFrame((s, d) => {
    if (!ref.current) return;
    const tx = mouse.current.x * (viewport.width / 2);
    const ty = mouse.current.y * (viewport.height / 2);
    ref.current.position.x += (tx - ref.current.position.x) * 0.08;
    ref.current.position.y += (ty - ref.current.position.y) * 0.08;
    const t = s.clock.elapsedTime;
    ref.current.scale.setScalar(2.4 + Math.sin(t * 1.4) * 0.18);
  });
  return (
    <mesh ref={ref} position={[0, 0, 0.5]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#5B1A2E" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

export default function BubbleField() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    >
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 1.5]}
      >
        <Bubbles mouse={mouse} />
        <CursorOrb mouse={mouse} />
      </Canvas>
    </div>
  );
}
