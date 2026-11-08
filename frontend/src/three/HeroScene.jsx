import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ElegantDiamond() {
  const meshRef = useRef();
  const wireRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= 0.003;
      wireRef.current.rotation.x += 0.002;
    }
  });

  const geometry = useMemo(() => new THREE.OctahedronGeometry(1.6, 0), []);

  return (
    <group position={[0, -0.2, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={meshRef} geometry={geometry} castShadow>
          <meshPhysicalMaterial
            color="#FFFFFF"
            metalness={0.1}
            roughness={0.02}
            transmission={0.98}
            thickness={2}
            ior={2.4}
            clearcoat={1}
            clearcoatRoughness={0}
            envMapIntensity={2}
          />
        </mesh>

        <mesh ref={wireRef} geometry={geometry} scale={1.05}>
          <meshBasicMaterial color="#A18A70" wireframe transparent opacity={0.2} />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.4, 0.01, 16, 100]} />
          <meshBasicMaterial color="#D8CBB8" transparent opacity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full" style={{ touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#FFFFFF" />
        <spotLight position={[-10, 5, -5]} angle={0.5} penumbra={1} intensity={1.5} color="#D8CBB8" />
        <pointLight position={[0, -5, 0]} intensity={0.5} color="#F5F1E9" />

        <Environment preset="studio" background={false} />

        <ElegantDiamond />

        <ContactShadows position={[0, -2.5, 0]} opacity={0.2} scale={10} blur={2} far={4} color="#A18A70" />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}