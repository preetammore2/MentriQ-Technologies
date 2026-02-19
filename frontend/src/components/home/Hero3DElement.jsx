import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Stars, Torus } from '@react-three/drei';

function RotatingTorusKnot() {
    const meshRef = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = t * 0.18;
        meshRef.current.rotation.y = t * 0.22;
        meshRef.current.rotation.z = t * 0.08;
    });
    return (
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
            <mesh ref={meshRef} scale={1.8}>
                <torusKnotGeometry args={[1, 0.32, 180, 32, 2, 3]} />
                <MeshDistortMaterial
                    color="#6366f1"
                    attach="material"
                    distort={0.35}
                    speed={2}
                    roughness={0.05}
                    metalness={0.9}
                    emissive="#4338ca"
                    emissiveIntensity={0.4}
                />
            </mesh>
        </Float>
    );
}

function OrbitRing() {
    const ref = useRef();
    useFrame((state) => {
        ref.current.rotation.x = state.clock.getElapsedTime() * 0.3;
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    });
    return (
        <mesh ref={ref} scale={3.2}>
            <Torus args={[1, 0.012, 16, 100]}>
                <meshStandardMaterial
                    color="#818cf8"
                    emissive="#818cf8"
                    emissiveIntensity={0.6}
                    transparent
                    opacity={0.4}
                />
            </Torus>
        </mesh>
    );
}

const Hero3DElement = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 50 }}
                gl={{ alpha: true, antialias: true }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.3} />
                    <pointLight position={[10, 10, 10]} intensity={1.2} color="#818cf8" />
                    <pointLight position={[-10, -10, -5]} intensity={0.6} color="#06b6d4" />
                    <spotLight position={[0, 8, 4]} angle={0.4} penumbra={1} intensity={1.5} color="#a78bfa" />
                    <Stars
                        radius={80}
                        depth={50}
                        count={3000}
                        factor={3}
                        saturation={0}
                        fade
                        speed={0.6}
                    />
                    <RotatingTorusKnot />
                    <OrbitRing />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Hero3DElement;
