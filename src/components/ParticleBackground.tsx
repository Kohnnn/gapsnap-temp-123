'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
}

interface ParticleBackgroundProps {
    particleCount?: number;
    connectionDistance?: number;
    mouseRadius?: number;
    className?: string;
}

export default function ParticleBackground({
    particleCount = 80,
    connectionDistance = 150,
    mouseRadius = 100,
    className = '',
}: ParticleBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animationFrameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const initParticles = (width: number, height: number) => {
            const particles: Particle[] = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                });
            }
            particlesRef.current = particles;
        };

        const animate = () => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const { width, height } = canvas;
            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            // Clear canvas with fade effect
            ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; // Updated to match professional Deep Slate bg
            ctx.fillRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach((particle, i) => {
                // Mouse repulsion
                const dx = particle.x - mouse.x;
                const dy = particle.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouseRadius && dist > 0) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    particle.vx += (dx / dist) * force * 0.5;
                    particle.vy += (dy / dist) * force * 0.5;
                }

                // Apply velocity
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Damping
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Bounce off edges
                if (particle.x < 0 || particle.x > width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > height) particle.vy *= -1;

                // Keep in bounds
                particle.x = Math.max(0, Math.min(width, particle.x));
                particle.y = Math.max(0, Math.min(height, particle.y));

                // Draw particle with gradient
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.radius * 2
                );
                // Updated colors to match Blue/Slate theme
                gradient.addColorStop(0, `rgba(59, 130, 246, ${particle.opacity})`);
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const other = particles[j];
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.2;
                        const gradient = ctx.createLinearGradient(
                            particle.x, particle.y, other.x, other.y
                        );
                        gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`);
                        gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);

                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(canvas.width, canvas.height);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Start animation
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [particleCount, connectionDistance, mouseRadius]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 ${className}`}
            style={{ background: 'transparent' }}
        />
    );
}
