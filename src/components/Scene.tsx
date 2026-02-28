'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  Sparkles,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  Vignette,
  ChromaticAberration,
  DepthOfField,
  Noise
} from '@react-three/postprocessing';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface SceneProps {
  scrollProgress: number;
}

// THE TAPE ROLL - Realistic unrolling tape
function TapeRoll({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const rollRef = useRef<THREE.Group>(null);
  const unrolledRef = useRef<THREE.Mesh>(null);
  
  // Scene 1: Hero (0-12%) - tape floating
  // Scene 2: Macro (12-22%) - close up
  // Scene 3: Laptop reveal (22-35%)
  // Scene 4-5: Unroll (35-62%)
  // Scene 6: Apply (62-75%)
  // Scene 7-8: Final
  
  const showTape = scrollProgress < 0.75;
  const unrollProgress = useMemo(() => {
    if (scrollProgress < 0.35) return 0;
    if (scrollProgress > 0.5) return 1;
    return (scrollProgress - 0.35) / 0.15;
  }, [scrollProgress]);

  useFrame((state) => {
    if (groupRef.current && showTape) {
      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    
    if (rollRef.current) {
      // Rotate the roll as it unrolls
      rollRef.current.rotation.z = -unrollProgress * Math.PI * 3;
    }
  });

  if (!showTape) return null;

  return (
    <group ref={groupRef}>
      {/* The roll */}
      <group ref={rollRef} position={[-0.8 - unrollProgress * 0.5, 0.2, 0]}>
        {/* Core */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.12, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Tape layers */}
        <mesh>
          <cylinderGeometry args={[0.45, 0.45, 0.1, 32]} />
          <meshStandardMaterial 
            color="#f0f0f0" 
            metalness={0.05} 
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Glow ring */}
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[0.45, 0.008, 16, 64]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      
      {/* Unrolled tape extending toward laptop */}
      {unrollProgress > 0.1 && (
        <mesh 
          ref={unrolledRef}
          position={[0.3 + unrollProgress * 0.8, 0.2, 0]}
          rotation={[0, 0, 0]}
          scale={[unrollProgress * 2, 1, 1]}
        >
          <boxGeometry args={[1.2, 0.012, 0.3]} />
          <meshStandardMaterial 
            color="#fafafa"
            metalness={0.1}
            roughness={0.4}
            transparent
            opacity={Math.min(1, unrollProgress * 1.2)}
          />
        </mesh>
      )}
      
      {/* Connecting unrolled part */}
      {unrollProgress > 0 && unrollProgress < 0.9 && (
        <mesh position={[unrollProgress * 0.2, 0.2, 0]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      )}
    </group>
  );
}

// LAPTOP - Premium realistic laptop with bottom vent
function Laptop({ scrollProgress }: { scrollProgress: number }) {
  const laptopRef = useRef<THREE.Group>(null);
  const ventGlowRef = useRef<THREE.Mesh>(null);
  
  const showLaptop = scrollProgress > 0.22;
  
  // Vent glow during alignment/application
  const ventGlow = scrollProgress > 0.5 && scrollProgress < 0.75;
  const tapeApplied = scrollProgress > 0.62;
  const settled = scrollProgress >= 0.75;

  useFrame((state) => {
    if (laptopRef.current && showLaptop) {
      // Subtle breathing
      laptopRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
    if (ventGlowRef.current) {
      const mat = ventGlowRef.current.material as THREE.MeshStandardMaterial;
      if (ventGlow) {
        mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      }
    }
  });

  if (!showLaptop) return null;

  return (
    <group ref={laptopRef} position={[0.5, -0.5, 0]} scale={0.4} rotation={[Math.PI * 0.12, 0, 0]}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[5, 0.12, 3.5]} />
        <meshStandardMaterial 
          color="#151515" 
          metalness={0.9} 
          roughness={0.15}
        />
      </mesh>
      
      {/* Bottom panel */}
      <mesh position={[0, -0.07, 0]}>
        <boxGeometry args={[5, 0.02, 3.5]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.05} />
      </mesh>
      
      {/* Bottom vent area - THE KEY AREA */}
      <mesh ref={ventGlowRef} position={[0, -0.05, -1]}>
        <boxGeometry args={[2, 0.015, 0.5]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          emissive={ventGlow ? "#00aaff" : "#000000"}
          emissiveIntensity={ventGlow ? 0.4 : 0}
        />
      </mesh>
      
      {/* Vent slats */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[0, -0.04, -1 + (i - 2.5) * 0.1]}>
          <boxGeometry args={[1.5, 0.008, 0.02]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
      ))}
      
      {/* Applied tape on vent */}
      {(tapeApplied || settled) && (
        <group position={[0, 0.01, -1]}>
          {/* The tape */}
          <mesh>
            <boxGeometry args={[1.3, 0.006, 0.35]} />
            <meshStandardMaterial 
              color="#f5f5f5"
              transparent
              opacity={0.95}
              roughness={0.3}
            />
          </mesh>
          {/* Glow when settled */}
          {settled && (
            <pointLight position={[0, 0.15, 0]} color="#00ff88" intensity={0.8} distance={1.5} />
          )}
        </group>
      )}
      
      {/* Trackpad */}
      <mesh position={[0, 0.07, 0.8]}>
        <boxGeometry args={[1.2, 0.01, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// DUST PARTICLES - Flying toward vent
function DustParticles({ scrollProgress }: { scrollProgress: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = -0.02 - Math.random() * 0.02;
      velocities[i * 3 + 2] = 0.01;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    (geo as any).userData.velocities = velocities;
    return geo;
  }, []);

  const positionsRef = useRef(geometry.attributes.position.array as Float32Array);
  const velocitiesRef = useRef((geometry as any).userData.velocities);

  useFrame(() => {
    if (particlesRef.current && scrollProgress > 0.7 && scrollProgress < 0.92) {
      const pos = positionsRef.current;
      const vel = velocitiesRef.current;
      
      for (let i = 0; i < count; i++) {
        // Move toward vent (down and forward)
        pos[i * 3] += vel[i * 3];
        pos[i * 3 + 1] += vel[i * 3 + 1];
        pos[i * 3 + 2] += vel[i * 3 + 2];
        
        // Reset when out of bounds
        if (pos[i * 3 + 1] < -2.5) {
          pos[i * 3 + 1] = 2.5;
          pos[i * 3 + 2] = -1 + Math.random();
          pos[i * 3] = (Math.random() - 0.5) * 4;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const visible = scrollProgress > 0.7 && scrollProgress < 0.92;
  const opacity = visible ? 0.8 : 0;

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#aaaaaa"
        transparent
        opacity={opacity}
        sizeAttenuation
      />
    </points>
  );
}

// AIRFLOW LINES - Clean air passing through
function AirflowLines({ scrollProgress }: { scrollProgress: number }) {
  const linesRef = useRef<THREE.Group>(null);
  const count = 40;
  
  const visible = scrollProgress > 0.75 && scrollProgress < 0.92;
  const opacity = visible ? 0.6 : 0;

  const lines = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      x: Math.random() * 2 - 1,
      y: -0.5 + (Math.random() - 0.5) * 0.3,
      z: -1 + (Math.random() - 0.5) * 0.4,
      length: 0.2 + Math.random() * 0.4,
      speed: 0.02 + Math.random() * 0.02
    }));
  }, []);

  useFrame(() => {
    if (linesRef.current && visible) {
      linesRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        mesh.position.x -= lines[i].speed;
        if (mesh.position.x < -2) {
          mesh.position.x = 2;
        }
      });
    }
  });

  if (!visible) return null;

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <mesh key={i} position={[line.x, line.y, line.z]}>
          <boxGeometry args={[line.length, 0.004, 0.008]} />
          <meshBasicMaterial color="#00ffaa" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

// SCENE CONTENT
function SceneContent({ scrollProgress }: SceneProps) {
  const { camera } = useThree();
  
  // Cinematic camera choreography
  useEffect(() => {
    // Scene 1: Hero (0-12%)
    if (scrollProgress < 0.12) {
      camera.position.set(0, 0.5, 4);
      camera.lookAt(0, 0.2, 0);
    }
    // Scene 2: Macro (12-22%)
    else if (scrollProgress < 0.22) {
      camera.position.set(0, 0.3, 2);
      camera.lookAt(-0.5, 0.2, 0);
    }
    // Scene 3: Laptop reveal (22-35%)
    else if (scrollProgress < 0.35) {
      camera.position.set(1.5, 0, 3.5);
      camera.lookAt(0.3, -0.3, -0.5);
    }
    // Scene 4-5: Unroll (35-62%)
    else if (scrollProgress < 0.62) {
      camera.position.set(0.8, 0.2, 2.5);
      camera.lookAt(0.5, 0, -0.3);
    }
    // Scene 6: Apply (62-75%)
    else if (scrollProgress < 0.75) {
      camera.position.set(0.3, -0.1, 2);
      camera.lookAt(0.5, -0.4, -0.8);
    }
    // Scene 7-8: Final
    else {
      camera.position.set(0, 0.3, 4);
      camera.lookAt(0.2, -0.3, 0);
    }
  }, [scrollProgress, camera]);

  return (
    <>
      {/* CINEMATIC LIGHTING */}
      <ambientLight intensity={0.15} />
      {/* Main key light */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      {/* Cold rim light */}
      <directionalLight position={[-5, 3, -3]} intensity={0.5} color="#4488ff" />
      {/* Fill light */}
      <pointLight position={[0, 3, 2]} intensity={0.3} color="#ffffff" />
      {/* Accent light */}
      <spotLight position={[3, 0, 2]} angle={0.3} penumbra={1} intensity={0.4} color="#ff8844" />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#050508', 2, 12]} />
      
      {/* MAIN 3D ELEMENTS */}
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
        <TapeRoll scrollProgress={scrollProgress} />
      </Float>
      
      <Laptop scrollProgress={scrollProgress} />
      <DustParticles scrollProgress={scrollProgress} />
      <AirflowLines scrollProgress={scrollProgress} />
      
      {/* Ambient sparkles */}
      <Sparkles 
        count={80} 
        scale={8} 
        size={1.5} 
        speed={0.4} 
        color="#334455"
        opacity={0.3}
      />
      
      {/* POST-PROCESSING - CINEMATIC LOOK */}
      <EffectComposer>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration 
          offset={new THREE.Vector2(0.0015, 0.0015)}
        />
        <Vignette darkness={0.55} offset={0.25} />
        <Noise opacity={0.03} />
        <DepthOfField 
          focusDistance={0.01}
          focalLength={0.05}
          bokehScale={3}
        />
      </EffectComposer>
    </>
  );
}

// MAIN SCENE COMPONENT
export default function Scene() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#050508', 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={45} />
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
