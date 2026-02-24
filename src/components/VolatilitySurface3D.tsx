'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface VolatilitySurfaceProps {
    data: {
        strikes: number[];      // e.g., [30, 40, 50, 60, 70]
        expiries: number[];     // days to expiry
        volatilities: number[][]; // 2D grid of IV values [expiry][strike]
    };
    className?: string;
}

const Surface = ({ data }: { data: VolatilitySurfaceProps['data'] }) => {
    const { strikes, expiries, volatilities } = data;
    const meshRef = useRef<THREE.Mesh>(null);

    // Non-rotating for professional analytical stability
    /* useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
        }
    }); */

    const { geometry } = useMemo(() => {
        const width = expiries.length;
        const height = strikes.length;
        const geometry = new THREE.PlaneGeometry(10, 10, width - 1, height - 1);

        const vertices = geometry.attributes.position.array as Float32Array;
        const colorArray = new Float32Array(vertices.length);

        // Map data to vertices
        // Z axis is the volatility (vertical)
        // X axis is Expiry
        // Y axis is Strike

        const minVol = Math.min(...volatilities.flat());
        const maxVol = Math.max(...volatilities.flat());
        const volRange = maxVol - minVol || 1;

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const idx = (j * width + i) * 3;

                // Set Z (height) based on volatility
                const vol = volatilities[i][j];
                const normalizedVol = (vol - minVol) / volRange;
                vertices[idx + 2] = normalizedVol * 3; // Scale height

                // Color based on IV level (Blue to Red heatmap)
                const color = new THREE.Color();
                // Blue (low) -> Green (mid) -> Red (high)
                if (normalizedVol < 0.5) {
                    color.setRGB(0, normalizedVol * 2, 1);
                } else {
                    color.setRGB((normalizedVol - 0.5) * 2, 1 - (normalizedVol - 0.5) * 2, 0);
                }
                colorArray[idx] = color.r;
                colorArray[idx + 1] = color.g;
                colorArray[idx + 2] = color.b;
            }
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        return { geometry };
    }, [expiries, strikes, volatilities]);

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]}>
            <primitive object={geometry} attach="geometry" />

            <meshPhongMaterial
                vertexColors
                side={THREE.DoubleSide}
                shininess={30}
                specular={new THREE.Color(0x334155)}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
};

const AxisLabels = () => {
    return (
        <group>
            {/* X-Axis: Expiry */}
            <Text
                position={[5.5, -5, 0]}
                fontSize={0.5}
                color="#64748b"
                rotation={[-Math.PI / 2, 0, 0]}
            >
                Time to Expiry (Days)
            </Text>

            {/* Y-Axis: Strike */}
            <Text
                position={[-6, 0, 0]}
                fontSize={0.5}
                color="#64748b"
                rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            >
                Strike Price (%)
            </Text>

            {/* Z-Axis: IV */}
            <Text
                position={[-6, 0, 1.5]}
                fontSize={0.5}
                color="#64748b"
                rotation={[0, Math.PI / 2, 0]}
            >
                Implied Vol (%)
            </Text>

            {/* Grid Helper */}
            <gridHelper args={[10, 10, 0x334155, 0x1e293b]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.01]} />
        </group>
    );
};

export default function VolatilitySurface3D({ data, className }: VolatilitySurfaceProps) {
    if (!data || !data.volatilities.length) {
        return (
            <div className={`flex items-center justify-center bg-[#0a0a0f] text-[#06b6d4] rounded-xl border border-white/10 ${className}`}>
                No Volatility Data Available
            </div>
        );
    }

    return (
        <div className={`relative glass-premium overflow-hidden group ${className}`} style={{ height: '400px' }}>
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"></span>
                    Implied Volatility Surface
                </h3>
                <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest">Scientific Analysis Engine</p>
            </div>

            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                    onClick={() => {
                        const canvas = document.querySelector('canvas');
                        if (canvas) {
                            const link = document.createElement('a');
                            link.download = 'vol-surface.png';
                            link.href = canvas.toDataURL();
                            link.click();
                        }
                    }}
                    className="px-3 py-1 text-[10px] font-bold bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg transition-all text-primary"
                >
                    Export Data
                </button>
            </div>

            <Canvas shadows gl={{ preserveDrawingBuffer: true, antialias: true }}>
                <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={35} />
                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} enableDamping />

                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#06b6d4" castShadow />
                <pointLight position={[-10, 5, -10]} intensity={1} color="#a855f7" />
                <rectAreaLight width={20} height={20} position={[0, 10, 0]} intensity={0.5} color="#ffffff" />

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

                <group rotation={[0, 0, 0]} position={[0, -1, 0]}>
                    <Surface data={data} />
                    <AxisLabels />
                </group>
            </Canvas>
        </div>
    );
}
