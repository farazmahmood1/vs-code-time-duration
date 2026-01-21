
import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC<{ className?: string }> = ({ className = "absolute inset-0" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        const particles: DataNode[] = [];
        const maxParticles = 300; // Reduced count for smaller headers/performance
        const mouse = { x: -2000, y: -2000, vx: 0, vy: 0, lastX: 0, lastY: 0, active: false };
        let time = 0;

        const brandColors = [
            { r: 59, g: 130, b: 246 },  // SaaS Blue
            { r: 139, g: 92, b: 246 },  // Intelligence Purple
            { r: 100, g: 116, b: 139 }, // Professional Slate
            { r: 14, g: 165, b: 233 }   // Sky Insight
        ];

        class DataNode {
            x: number;
            y: number;
            vx: number;
            vy: number;
            life: number = 1.0;
            decay: number;
            size: number;
            color: { r: number; g: number; b: number };
            noiseOffset: number;
            pulseSpeed: number;

            constructor(x: number, y: number, mvx: number, mvy: number) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 1.8 + 0.3;
                this.vx = (Math.cos(angle) * speed) + (mvx * 0.2);
                this.vy = (Math.sin(angle) * speed) + (mvy * 0.2);
                this.size = Math.random() * 2.5 + 0.6;
                this.decay = 0.0004 + Math.random() * 0.0008;
                this.color = brandColors[Math.floor(Math.random() * brandColors.length)];
                this.noiseOffset = Math.random() * 10000;
                this.pulseSpeed = 0.01 + Math.random() * 0.03;
            }

            update() {
                const drift = 0.015;
                this.vx += Math.cos(time * 0.008 + this.noiseOffset) * drift;
                this.vy += Math.sin(time * 0.008 + this.noiseOffset) * drift;
                this.vx *= 0.99;
                this.vy *= 0.99;
                this.x += this.vx;
                this.y += this.vy;
                this.life -= this.decay;
            }

            draw(context: CanvasRenderingContext2D) {
                if (this.life <= 0) return;
                const pulse = 0.85 + Math.sin(time * this.pulseSpeed) * 0.15;
                const currentOpacity = this.life * 0.7 * pulse;
                context.beginPath();
                context.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
                context.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity})`;
                if (this.life > 0.4) {
                    context.shadowBlur = 12 * this.life;
                    context.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity * 0.5})`;
                }
                context.fill();
                context.shadowBlur = 0;
            }
        }

        const init = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (rect) {
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
                ctx.scale(dpr, dpr);
            }
        };

        const animate = () => {
            time++;
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            ctx.clearRect(0, 0, width, height);

            mouse.vx = mouse.x - mouse.lastX;
            mouse.vy = mouse.y - mouse.lastY;
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;

            // Auto-emit particles if few exist
            if (particles.length < 50) {
                particles.push(new DataNode(Math.random() * width, Math.random() * height, 0, 0));
            }

            if (mouse.active) {
                const intensity = Math.max(2, Math.min(8, Math.floor(Math.abs(mouse.vx) + Math.abs(mouse.vy) + 2)));
                for (let i = 0; i < intensity; i++) {
                    if (particles.length >= maxParticles) particles.shift();
                    particles.push(new DataNode(mouse.x, mouse.y, mouse.vx, mouse.vy));
                }
            }

            ctx.lineWidth = 0.35;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                for (let j = i + 1; j < particles.length; j += 4) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < 120 * 120) {
                        const alpha = (1 - Math.sqrt(distSq) / 120) * p1.life * p2.life * 0.12;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
                p1.draw(ctx);
                if (p1.life <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
            clearTimeout((window as any).idleTimer);
            (window as any).idleTimer = setTimeout(() => { mouse.active = false; }, 500);
        };

        const handleResize = () => init();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        init();
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={`${className} pointer-events-none`} />;
};

export default ParticleBackground;
