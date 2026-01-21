import React, { useEffect, useRef } from 'react';
import { Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;
        const particles: DataNode[] = [];
        const maxParticles = 1000; // Increased cap for a denser field
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

                // Initial burst velocity from cursor movement
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 1.8 + 0.3;
                this.vx = (Math.cos(angle) * speed) + (mvx * 0.2);
                this.vy = (Math.sin(angle) * speed) + (mvy * 0.2);

                // High-end sizing
                this.size = Math.random() * 2.5 + 0.6;

                // Ultra-slow decay to ensure they "stay long"
                // Lifecycle lasts roughly 1000-2000 frames
                this.decay = 0.0004 + Math.random() * 0.0008;

                this.color = brandColors[Math.floor(Math.random() * brandColors.length)];
                this.noiseOffset = Math.random() * 10000;
                this.pulseSpeed = 0.01 + Math.random() * 0.03;
            }

            update() {
                // Organic drift using sine-wave noise for that "smooth" feeling
                const drift = 0.015;
                this.vx += Math.cos(time * 0.008 + this.noiseOffset) * drift;
                this.vy += Math.sin(time * 0.008 + this.noiseOffset) * drift;

                // Fluid friction (dampens the initial burst gradually)
                this.vx *= 0.99;
                this.vy *= 0.99;

                this.x += this.vx;
                this.y += this.vy;

                // Continuous life cycle decrement
                this.life -= this.decay;
            }

            draw(context: CanvasRenderingContext2D) {
                if (this.life <= 0) return;

                // Subtle pulsing effect for "living" data
                const pulse = 0.85 + Math.sin(time * this.pulseSpeed) * 0.15;
                const currentOpacity = this.life * 0.7 * pulse;

                context.beginPath();
                context.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
                context.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentOpacity})`;

                // Premium soft-glow bloom when the node is "young" and vibrant
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
            // Safety check for canvas existence
            if (!canvas) return;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        };

        const animate = () => {
            time++;
            // Safety checks
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            // 1. Calculate Cursor Momentum
            mouse.vx = mouse.x - mouse.lastX;
            mouse.vy = mouse.y - mouse.lastY;
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;

            // 2. Continuous Emission Logic
            if (mouse.active) {
                const intensity = Math.max(2, Math.min(8, Math.floor(Math.abs(mouse.vx) + Math.abs(mouse.vy) + 2)));
                for (let i = 0; i < intensity; i++) {
                    if (particles.length >= maxParticles) {
                        particles.shift();
                    }
                    particles.push(new DataNode(mouse.x, mouse.y, mouse.vx, mouse.vy));
                }
            }

            // 3. Render Pass: Connections
            ctx.lineWidth = 0.35;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();

                const step = window.innerWidth < 768 ? 10 : 8;
                for (let j = i + 1; j < particles.length; j += step) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;
                    const threshold = 120;

                    if (distSq < threshold * threshold) {
                        const dist = Math.sqrt(distSq);
                        const alpha = (1 - dist / threshold) * p1.life * p2.life * 0.12;
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
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;

            clearTimeout((window as any).idleTimer);
            (window as any).idleTimer = setTimeout(() => {
                mouse.active = false;
            }, 500);
        };

        const handleResize = () => {
            init();
        };

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

    return (
        <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-white font-inter">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none z-0"
                style={{ opacity: 1.0 }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-sm font-medium mb-8 reveal">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444] mr-2 animate-pulse"></span>
                    Now supporting 500+ Enterprise Teams
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1e293b] tracking-tight mb-6 reveal">
                    Complete HR Management System & <br />
                    <span className="text-slate-500 font-medium italic">Employee Tracking Software</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 reveal">
                    Manage Your Workforce, Not Just Data. Streamline attendance, optimize projects,
                    and empower your people with the next-generation HRMS built for modern enterprises.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal relative z-20">
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-10 py-5 bg-[#1e293b] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
                    >
                        Book a Demo
                    </Link>
                    <Link
                        to="/features"
                        className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-[#1e293b] rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all text-center flex items-center justify-center"
                    >
                        View Features
                    </Link>
                </div>

                {/* Floating Glassmorphism Elements */}
                <div className="absolute top-[70%] -right-4 lg:right-10 xl:right-20 hidden lg:block animate-float">
                    <div className="glass p-6 rounded-3xl shadow-2xl border border-white/40 w-64 text-left backdrop-blur-xl bg-white/60">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-2 py-1 rounded-lg">+12% growth</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Active Employees</p>
                        <h4 className="text-3xl font-black text-[#1e293b] tracking-tighter">1,284</h4>
                        <div className="mt-4 flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <img
                                    key={i}
                                    src={`https://picsum.photos/seed/${i + 10}/32/32`}
                                    alt="User"
                                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                                />
                            ))}
                            <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                                +42
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-[-15%] -left-10 lg:left-0 xl:left-10 hidden lg:block animate-float" style={{ animationDelay: '1.5s' }}>
                    <div className="glass p-5 rounded-2xl shadow-xl border border-white/40 w-52 text-left backdrop-blur-xl bg-white/60">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-[10px] font-black text-[#1e293b] uppercase tracking-widest">Attendance Sync</p>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[92%]"></div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Avg Check-in Rate</p>
                            <span className="text-[10px] font-black text-green-600">92%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 right-[-10%] w-[30%] h-[50%] bg-slate-50 blur-[100px] rounded-full"></div>
            </div>
        </section>
    );
};

export default Hero;
