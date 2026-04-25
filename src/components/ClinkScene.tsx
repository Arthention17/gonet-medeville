"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Two wine glasses approach centre, clink at progress=0.5, ripple emits, glasses linger
 * tilted with droplets falling, then slowly recede after progress > 0.85.
 *
 * Pinned via ScrollTrigger over 350vh of scroll so the viewer reads the moment.
 */

function glassProfile() {
  const pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(0.0, -1.6));
  pts.push(new THREE.Vector2(0.55, -1.6));
  pts.push(new THREE.Vector2(0.55, -1.55));
  pts.push(new THREE.Vector2(0.06, -1.5));
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    pts.push(new THREE.Vector2(0.04 + Math.sin(t * Math.PI) * 0.005, -1.5 + t * 1.0));
  }
  pts.push(new THREE.Vector2(0.06, -0.5));
  pts.push(new THREE.Vector2(0.32, -0.35));
  pts.push(new THREE.Vector2(0.6, -0.05));
  pts.push(new THREE.Vector2(0.78, 0.4));
  pts.push(new THREE.Vector2(0.82, 0.85));
  pts.push(new THREE.Vector2(0.78, 1.15));
  pts.push(new THREE.Vector2(0.74, 1.2));
  pts.push(new THREE.Vector2(0.74, 1.22));
  return pts;
}

function Glass({ side, progress }: { side: -1 | 1; progress: number }) {
  const group = useRef<THREE.Group>(null!);
  const liquid = useRef<THREE.Mesh>(null!);
  const profile = useMemo(() => glassProfile(), []);
  const glassGeom = useMemo(() => new THREE.LatheGeometry(profile, 64), [profile]);
  const liquidGeom = useMemo(() => {
    const liq: THREE.Vector2[] = [
      new THREE.Vector2(0.05, -0.45),
      new THREE.Vector2(0.3, -0.32),
      new THREE.Vector2(0.55, -0.05),
      new THREE.Vector2(0.7, 0.35),
      new THREE.Vector2(0.7, 0.55),
      new THREE.Vector2(0, 0.55),
    ];
    return new THREE.LatheGeometry(liq, 48);
  }, []);

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.04,
        transmission: 1,
        thickness: 0.45,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.92,
      }),
    []
  );
  const liquidMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#3a0d1c",
        roughness: 0.15,
        transmission: 0.55,
        thickness: 1.2,
        ior: 1.36,
        attenuationColor: new THREE.Color("#5b1a2e"),
        attenuationDistance: 0.9,
        emissive: new THREE.Color("#1a0610"),
        emissiveIntensity: 0.18,
      }),
    []
  );

  useFrame((s) => {
    if (!group.current) return;
    const p = progress;
    // Approach during 0..0.5, hold near centre during 0.5..0.85, recede during 0.85..1
    let approach: number;
    if (p < 0.5) approach = p / 0.5;
    else if (p < 0.85) approach = 1;
    else approach = 1 - (p - 0.85) / 0.15;
    approach = Math.max(0, Math.min(1, approach));

    const eased = 1 - Math.pow(1 - approach, 3);
    const targetX = side * (5.5 - eased * 5.0);
    const tilt = side * (0.05 + eased * 0.22);

    group.current.position.x += (targetX - group.current.position.x) * 0.2;
    group.current.position.y += (-0.2 + eased * 0.2 - group.current.position.y) * 0.18;
    group.current.rotation.z += (tilt - group.current.rotation.z) * 0.2;

    if (liquid.current) {
      const t = s.clock.elapsedTime;
      // wine sloshes more violently around the impact
      const slosh = 0.04 + (p > 0.45 && p < 0.7 ? 0.16 : 0.04 * eased);
      liquid.current.rotation.x = Math.sin(t * 2.6 + side * 1.7) * slosh;
      liquid.current.rotation.z = side * (0.03 + eased * 0.22);
    }
  });

  return (
    <group ref={group} position={[side * 5.5, -0.2, 0]}>
      <mesh geometry={glassGeom} material={glassMat} />
      <mesh ref={liquid} geometry={liquidGeom} material={liquidMat} position={[0, 0, 0]} />
    </group>
  );
}

function Ripple({ progress }: { progress: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const fired = useRef(false);
  const t0 = useRef(0);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (progress > 0.5 && progress < 0.6 && !fired.current) {
      fired.current = true;
      t0.current = t;
    }
    if (progress < 0.45) fired.current = false;

    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    if (fired.current) {
      const age = t - t0.current;
      if (age < 1.2) {
        const k = age / 1.2;
        ref.current.scale.setScalar(0.3 + k * 6);
        m.opacity = (1 - k) * 0.55;
      } else {
        m.opacity = 0;
      }
    } else {
      m.opacity = 0;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.95, 1.02, 64]} />
      <meshBasicMaterial color="#E8C779" transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Droplets({ progress }: { progress: number }) {
  const ref = useRef<THREE.Points>(null!);
  const N = 100;
  const data = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = 0.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      const a = Math.random() * Math.PI * 2;
      const sp = Math.random() * 3 + 1;
      vel[i * 3] = Math.cos(a) * sp;
      vel[i * 3 + 1] = Math.random() * 3 + 2;
      vel[i * 3 + 2] = Math.sin(a) * sp * 0.4;
    }
    return { pos, vel };
  }, []);
  const fired = useRef(false);
  const t0 = useRef(0);
  const lastP = useRef(0);

  useFrame((s, d) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    if (progress > 0.5 && progress < 0.6 && lastP.current < 0.5) {
      fired.current = true;
      t0.current = t;
      const arr = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < N; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 0.3;
        arr[i * 3 + 1] = 0.4;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 3 + 1;
        data.vel[i * 3] = Math.cos(a) * sp;
        data.vel[i * 3 + 1] = Math.random() * 3 + 2;
        data.vel[i * 3 + 2] = Math.sin(a) * sp * 0.4;
      }
      (ref.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
    lastP.current = progress;
    if (progress < 0.45) fired.current = false;

    if (fired.current) {
      const arr = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const age = t - t0.current;
      for (let i = 0; i < N; i++) {
        arr[i * 3] += data.vel[i * 3] * d * 0.6;
        arr[i * 3 + 1] += (data.vel[i * 3 + 1] - age * 6) * d * 0.6;
        arr[i * 3 + 2] += data.vel[i * 3 + 2] * d * 0.6;
      }
      (ref.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      const m = ref.current.material as THREE.PointsMaterial;
      m.opacity = Math.max(0, 1 - age * 0.9);
    } else {
      const m = ref.current.material as THREE.PointsMaterial;
      m.opacity = 0;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#8B2635" size={0.085} transparent opacity={0} sizeAttenuation />
    </points>
  );
}

function Scene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const [p, setP] = useState(0);
  useFrame(() => setP(progressRef.current));
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.6} />
      <directionalLight position={[-5, 3, -2]} intensity={0.6} color="#E8C779" />
      <Glass side={-1} progress={p} />
      <Glass side={1} progress={p} />
      <Ripple progress={p} />
      <Droplets progress={p} />
    </>
  );
}

export default function ClinkScene() {
  const progress = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=300%",
      pin: stickyRef.current,
      scrub: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        progress.current = self.progress;
        if (titleRef.current) {
          // Title fades in around the impact
          const op = self.progress > 0.45 && self.progress < 0.92
            ? Math.min(1, (self.progress - 0.45) / 0.1)
            : self.progress >= 0.92
              ? Math.max(0, 1 - (self.progress - 0.92) / 0.08)
              : 0;
          titleRef.current.style.opacity = String(op);
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "300vh", background: "linear-gradient(180deg, #0E0E0C 0%, #1a0a14 50%, #0E0E0C 100%)" }}
    >
      <div ref={stickyRef} className="h-screen w-full relative">
        <Canvas
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0.4, 6], fov: 35 }}
          dpr={[1, 1.5]}
        >
          <Scene progressRef={progress} />
        </Canvas>
        <div ref={titleRef} className="absolute inset-0 flex flex-col items-center justify-end pb-24 pointer-events-none" style={{ opacity: 0, transition: "opacity 0.3s" }}>
          <div className="font-mono text-[10px] tracking-[3px] text-[var(--gold)] mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
            III — TCHIN
          </div>
          <h2 className="font-serif text-[clamp(36px,5vw,76px)] font-light italic text-white tracking-tight">
            Aux trois siècles.
          </h2>
        </div>
      </div>
    </section>
  );
}
