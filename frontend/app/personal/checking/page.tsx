'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Shield, Smartphone, Globe, ArrowRight, Zap, CreditCard, Clock, DollarSign, Users, Star, ChevronRight, GraduationCap, PiggyBank, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CheckingPage() {
    const heroRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.hero-text', {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.2
            });
        }, heroRef);
        return () => ctx.revert();
    }, []);

    const features = [
        {
            title: 'No Monthly Fees',
            subtitle: 'Zero Balance Req',
            description: 'Enjoy fee-free banking with no minimum balance requirements. Keep more of your money.',
            features: ['Zero Hidden Fees', 'No Minimum Deposit', 'Free Maintenance'],
            icon: DollarSign,
            highlightLabel: 'MAINTENANCE',
            highlight: '$0.00'
        },
        {
            title: 'Global ATM Access',
            subtitle: 'Universal Reach',
            description: 'Access your funds from 55,000+ ATMs worldwide with no foreign transaction fees.',
            features: ['55k+ Network', 'Zero Forex Fees', 'Instant Rebates'],
            icon: Globe,
            highlightLabel: 'ATM_NETWORK',
            highlight: '55,000+'
        },
        {
            title: 'Mobile Banking',
            subtitle: 'Digital Control',
            description: 'Deposit checks, pay bills, and transfer money instantly from our award-winning app.',
            features: ['Mobile Deposits', 'Bill Pay Engine', 'Biometric Auth'],
            icon: Smartphone,
            highlightLabel: 'APP_RATING',
            highlight: '4.9/5'
        },
        {
            title: 'Bank-Grade Security',
            subtitle: 'Vault Protocol',
            description: 'Your deposits are FDIC insured and protected by 256-bit encryption.',
            features: ['FDIC Insured', '256-bit Encryption', '24/7 Monitoring'],
            icon: Shield,
            highlightLabel: 'ENCRYPTION',
            highlight: '256-BIT'
        },
        {
            title: 'Instant Transfers',
            subtitle: 'Velocity Matrix',
            description: 'Send money to friends and family instantly with no transfer fees.',
            features: ['P2P Network', 'Zero Transfer Rate', 'Instant Settling'],
            icon: Zap,
            highlightLabel: 'TRANSFER_SPD',
            highlight: '0.0ms'
        },
        {
            title: 'Virtual Debit Cards',
            subtitle: 'Dynamic Issuance',
            description: 'Generate unlimited virtual cards for secure online shopping.',
            features: ['Burner Cards', 'Spend Limits', 'Instant Freeze'],
            icon: CreditCard,
            highlightLabel: 'CARDS_LIMIT',
            highlight: 'UNLIMITED'
        }
    ];

    const comparisonData = [
        { feature: 'Monthly Fee', us: 'Free', others: '$12-15/mo' },
        { feature: 'ATM Fee Rebates', us: 'Unlimited', others: 'Limited' },
        { feature: 'Minimum Balance', us: 'None', others: '$500+' },
        { feature: 'Overdraft Protection', us: 'Free', others: '$35/incident' },
        { feature: 'Mobile Check Deposit', us: 'Instant', others: '1-2 days' },
        { feature: 'International Transfers', us: 'Low fees', others: 'High fees' },
    ];

    return (
        <div ref={heroRef} className="min-h-screen bg-white font-sans selection:bg-[#E63B2E] selection:text-white">
            <Navbar />

            {/* Hero Section — The Opening Shot */}
            <section className="relative min-h-[100dvh] w-full bg-[#0D0D12] overflow-hidden flex items-end">
                {/* Background Texture & Gradient */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2670&auto=format&fit=crop" 
                        alt="Raw Structural Concrete" 
                        className="w-full h-full object-cover grayscale opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14] via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>

                <div className="container mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32 relative z-10 w-full">
                    <div className="max-w-4xl">
                        
                        {/* Eyebrow / Stats grid */}
                        <div className="hero-text opacity-0 flex flex-wrap gap-2 md:gap-4 mb-8">
                            <span className="font-mono text-[10px] md:text-xs font-bold text-[#E8E4DD] border border-white/20 px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 bg-black/40 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E63B2E] animate-pulse" />
                                CHECKING_SYS_ONLINE
                            </span>
                            <span className="font-mono text-[10px] md:text-xs text-[#E8E4DD]/70 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest bg-black/20 flex items-center gap-2">
                                <Shield className="w-3 h-3 text-[#E63B2E]" /> FDIC INSURED
                            </span>
                            <span className="font-mono text-[10px] md:text-xs text-[#E8E4DD]/70 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-widest bg-black/20 flex items-center gap-2">
                                <Globe className="w-3 h-3 text-[#E8E4DD]" /> 55K+ ATMS
                            </span>
                        </div>

                        {/* Brutalist Headline */}
                        <h1 className="leading-[0.9] tracking-tighter mb-8">
                            <span className="hero-text opacity-0 block font-space-grotesk font-black text-white text-5xl sm:text-7xl lg:text-8xl xl:text-9xl uppercase">
                                Control The
                            </span>
                            <span className="hero-text opacity-0 block font-drama italic text-[#E63B2E] text-7xl sm:text-9xl lg:text-[10rem] xl:text-[12rem] mt-2 lowercase">
                                Liquidity.
                            </span>
                        </h1>

                        <p className="hero-text opacity-0 font-space-mono text-white/60 text-sm md:text-base max-w-2xl mb-12 uppercase tracking-widest leading-relaxed">
                            No monthly fees. No minimum balance. No nonsense. Just simple, powerful financial infrastructure that puts you in absolute control.
                        </p>

                        <div className="hero-text opacity-0 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <Link href="/register">
                                <button className="group relative px-10 py-5 bg-[#E63B2E] overflow-hidden rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-2xl w-full sm:w-auto">
                                    <span className="relative z-10 font-space-grotesk font-black text-white flex items-center justify-center gap-3 text-lg tracking-widest uppercase">
                                        INIT SEQUENCE
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                </button>
                            </Link>

                            <Link href="#features">
                                <div className="px-8 py-5 bg-transparent border border-white/20 text-white font-space-grotesk font-black text-lg uppercase tracking-wider rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto">
                                    <span>Analyze Features</span>
                                </div>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Section - Interactive Functional Artifacts */}
            <section id="features" className="py-32 bg-[#F5F3EE] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111]/5 border border-[#111111]/10 rounded-full mb-6">
                            <Zap className="w-3.5 h-3.5 text-[#E63B2E]" />
                            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-widest">
                                Functional Artifacts
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-space-grotesk font-black text-[#111111] uppercase tracking-tighter leading-none mb-6">
                            Account <span className="font-drama italic text-[#E63B2E] lowercase text-6xl md:text-8xl">Capabilities.</span>
                        </h2>
                        <p className="font-space-mono text-[#111111]/70 max-w-xl text-sm md:text-base uppercase tracking-widest leading-relaxed">
                            Diagnostic, Telemetry, and Protocol sequences engineered for your personal financial infrastructure.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* CARD 1: No Monthly Fees (Diagnostic Shuffler) */}
                        <div className="relative bg-[#E8E4DD] rounded-[2rem] border border-[#111111]/10 overflow-hidden shadow-xl p-8 flex flex-col group min-h-[480px]">
                            <div className="flex justify-between items-start mb-8">
                                <span className="font-mono text-xs font-bold text-[#E63B2E] bg-[#E63B2E]/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">Sys_01</span>
                                <DollarSign className="w-6 h-6 text-[#111111]" />
                            </div>
                            <h3 className="font-space-grotesk text-2xl font-black text-[#111111] mb-2">{features[0].title}</h3>
                            <p className="font-space-mono text-xs text-[#111111]/80 mb-4 font-bold uppercase tracking-widest">{features[0].subtitle}</p>
                            <p className="font-space-mono text-sm text-[#111111]/60 mb-6 leading-relaxed">
                                {features[0].description}
                            </p>
                            
                            <div className="space-y-2 mb-8">
                                {features[0].features.slice(0, 2).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#111111]/70">
                                        <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="relative h-32 mt-auto perspective-1000">
                                <div className="absolute inset-x-0 bottom-0 h-full bg-[#111111] rounded-2xl p-4 shadow-2xl transform transition-transform duration-700 group-hover:-translate-y-4 group-hover:scale-105 z-30 flex flex-col justify-between">
                                    <div className="font-mono text-[10px] text-white/50 text-right uppercase tracking-widest">{features[0].highlightLabel}</div>
                                    <div className="font-space-grotesk text-4xl font-black text-[#E63B2E]">{features[0].highlight}</div>
                                </div>
                                <div className="absolute inset-x-4 bottom-4 h-full bg-[#2A2A35] rounded-2xl transform -translate-y-2 scale-95 z-20 opacity-80" />
                                <div className="absolute inset-x-8 bottom-8 h-full bg-[#0D0D12] rounded-2xl transform -translate-y-4 scale-90 z-10 opacity-60" />
                            </div>
                        </div>

                        {/* CARD 2: Bank-Grade Security (Diagnostic Shuffler Variation - Moved up for layout) */}
                        <div className="relative bg-[#111111] rounded-[2rem] border border-white/10 overflow-hidden shadow-xl p-8 flex flex-col group min-h-[480px]">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                            <div className="relative z-10 flex justify-between items-start mb-8">
                                <span className="font-mono text-xs font-bold text-[#E8E4DD] bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">Sys_02</span>
                                <Shield className="w-6 h-6 text-[#E8E4DD]" />
                            </div>
                            <h3 className="font-space-grotesk text-2xl font-black text-[#E8E4DD] mb-2 relative z-10">{features[3].title}</h3>
                            <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest relative z-10">{features[3].subtitle}</p>
                            <p className="font-space-mono text-sm text-[#E8E4DD]/60 mb-6 leading-relaxed relative z-10">
                                {features[3].description}
                            </p>
                            
                            <div className="space-y-2 mb-8 relative z-10">
                                {features[3].features.slice(0, 2).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#E8E4DD]/70">
                                        <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                                    </div>
                                ))}
                            </div>

                            <div className="relative h-32 mt-auto perspective-1000 z-10">
                                <div className="absolute inset-x-0 bottom-0 h-full bg-[#E8E4DD] rounded-2xl p-4 shadow-2xl transform transition-transform duration-700 group-hover:-translate-y-4 group-hover:scale-105 z-30 flex flex-col justify-between">
                                    <div className="font-mono text-[10px] text-[#111111]/50 text-right uppercase tracking-widest">{features[3].highlightLabel}</div>
                                    <div className="font-space-grotesk text-4xl font-black text-[#111111]">{features[3].highlight}</div>
                                </div>
                                <div className="absolute inset-x-4 bottom-4 h-full bg-white/80 rounded-2xl transform -translate-y-2 scale-95 z-20" />
                                <div className="absolute inset-x-8 bottom-8 h-full bg-white/60 rounded-2xl transform -translate-y-4 scale-90 z-10" />
                            </div>
                        </div>

                        {/* CARD 3: Global ATM Access (Telemetry Typewriter) */}
                        <div className="relative bg-[#E8E4DD] rounded-[2rem] border border-[#111111]/10 overflow-hidden shadow-xl p-8 flex flex-col min-h-[480px]">
                            <div className="flex justify-between items-start mb-8">
                                <span className="font-mono text-xs font-bold text-[#111111] border border-[#111111]/20 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63B2E] animate-pulse" />
                                    Live Feed
                                </span>
                                <Globe className="w-6 h-6 text-[#111111]" />
                            </div>
                            <h3 className="font-space-grotesk text-2xl font-black text-[#111111] mb-2">{features[1].title}</h3>
                            <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest">{features[1].subtitle}</p>
                            <p className="font-space-mono text-sm text-[#111111]/60 mb-6 leading-relaxed">
                                {features[1].description}
                            </p>
                            
                            <div className="space-y-2 mb-8">
                                {features[1].features.slice(0, 2).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#111111]/70">
                                        <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-auto bg-[#111111] rounded-xl p-4 border border-[#111111]/10 font-mono text-xs text-[#E8E4DD]/80 font-medium h-32 overflow-hidden flex flex-col justify-end shadow-inner">
                                <div className="space-y-2">
                                    <div className="opacity-40">&gt; LOCATING_NODE... OK.</div>
                                    <div className="opacity-60">&gt; GLOBAL_CONNECTION_SECURE.</div>
                                    <div className="text-[#E63B2E] flex justify-between items-center">
                                        <span>&gt; {features[1].highlightLabel.toUpperCase()}...</span>
                                        <span className="font-bold">{features[1].highlight}</span>
                                    </div>
                                    <div className="text-[#E8E4DD]">&gt; SYSTEM_READY<span className="animate-pulse text-[#E63B2E]">_</span></div>
                                </div>
                            </div>
                        </div>

                        {/* CARD 4: Virtual Debit Cards (Cursor Protocol Scheduler) */}
                        <div className="relative bg-[#111111] rounded-[2rem] border border-white/10 overflow-hidden shadow-xl p-8 flex flex-col group min-h-[480px]">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                            <div className="relative z-10 flex justify-between items-start mb-8">
                                <span className="font-mono text-xs font-bold text-[#E8E4DD] bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">Sys_04</span>
                                <CreditCard className="w-6 h-6 text-[#E8E4DD]" />
                            </div>
                            <h3 className="font-space-grotesk text-2xl font-black text-[#E8E4DD] mb-2 relative z-10">{features[5].title}</h3>
                            <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest relative z-10">{features[5].subtitle}</p>
                            <p className="font-space-mono text-sm text-[#E8E4DD]/60 mb-6 leading-relaxed relative z-10">
                                {features[5].description}
                            </p>
                            
                            <div className="space-y-2 mb-8 relative z-10">
                                {features[5].features.slice(0, 2).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#E8E4DD]/70">
                                        <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-auto relative h-32 bg-[#E8E4DD] rounded-xl border border-white/10 p-2 grid grid-cols-7 gap-1 z-10">
                                {Array.from({ length: 14 }).map((_, i) => (
                                    <div key={i} className={`rounded-md transition-colors duration-500 ${i === 8 ? 'bg-[#E63B2E]/20 border border-[#E63B2E]' : 'bg-[#111111]/10'}`} />
                                ))}
                                <motion.div 
                                    className="absolute z-10 w-4 h-4 text-[#E63B2E]"
                                    animate={{
                                        x: [10, 80, 80, 20],
                                        y: [10, 40, 40, 80],
                                        scale: [1, 1, 0.8, 1]
                                    }}
                                    transition={{
                                        duration: 3.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        times: [0, 0.4, 0.5, 1]
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4l16 16m0 0V4m0 16H4" />
                                    </svg>
                                </motion.div>
                                
                                <div className="absolute bottom-2 right-2 px-3 py-1 bg-[#111111] flex flex-col items-end rounded-lg">
                                    <div className="text-[#E63B2E] font-space-grotesk text-sm font-black leading-none">{features[5].highlight}</div>
                                    <div className="text-[#E8E4DD]/60 font-mono text-[8px] uppercase">{features[5].highlightLabel}</div>
                                </div>
                            </div>
                        </div>

                        {/* CARD 5: Instant Transfers (Telemetry Typewriter Variation) */}
                        <div className="relative bg-[#E8E4DD] rounded-[2rem] border border-[#111111]/10 overflow-hidden shadow-xl p-8 flex flex-col min-h-[480px]">
                            <div className="flex justify-between items-start mb-8">
                                <span className="font-mono text-xs font-bold text-[#111111] border border-[#111111]/20 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63B2E] animate-pulse" />
                                    Live Feed
                                </span>
                                <Zap className="w-6 h-6 text-[#111111]" />
                            </div>
                            <h3 className="font-space-grotesk text-2xl font-black text-[#111111] mb-2">{features[4].title}</h3>
                            <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest">{features[4].subtitle}</p>
                            <p className="font-space-mono text-sm text-[#111111]/60 mb-6 leading-relaxed">
                                {features[4].description}
                            </p>
                            
                            <div className="space-y-2 mb-8">
                                {features[4].features.slice(0, 2).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#111111]/70">
                                        <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-auto bg-[#111111] rounded-xl p-4 border border-[#111111]/10 font-mono text-xs text-[#E8E4DD]/80 font-medium h-32 overflow-hidden flex flex-col justify-end shadow-inner">
                                <div className="space-y-2">
                                    <div className="opacity-40">&gt; PAYLOAD_INITIALIZED...</div>
                                    <div className="opacity-60">&gt; DISTRIBUTING_FUNDS.</div>
                                    <div className="text-[#E63B2E] flex justify-between items-center">
                                        <span>&gt; {features[4].highlightLabel.toUpperCase()}...</span>
                                        <span className="font-bold">{features[4].highlight}</span>
                                    </div>
                                    <div className="text-[#E8E4DD]">&gt; TRANS_COMPLETE<span className="animate-pulse text-[#E63B2E]">_</span></div>
                                </div>
                            </div>
                        </div>

                        {/* CARD 6: Mobile Banking (Cursor Protocol Scheduler Variation) */}
                        <div className="relative bg-[#111111] rounded-[2rem] border border-white/10 overflow-hidden shadow-xl p-8 flex flex-col group min-h-[480px]">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                            <div className="relative z-10 flex justify-between items-start mb-8">
                                <span className="font-mono text-xs font-bold text-[#E8E4DD] bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">Sys_06</span>
                                <Smartphone className="w-6 h-6 text-[#E8E4DD]" />
                            </div>
                            <h3 className="font-space-grotesk text-2xl font-black text-[#E8E4DD] mb-2 relative z-10">{features[2].title}</h3>
                            <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest relative z-10">{features[2].subtitle}</p>
                            <p className="font-space-mono text-sm text-[#E8E4DD]/60 mb-6 leading-relaxed relative z-10">
                                {features[2].description}
                            </p>
                            
                            <div className="space-y-2 mb-8 relative z-10">
                                {features[2].features.slice(0, 2).map((feat, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#E8E4DD]/70">
                                        <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-auto relative h-32 bg-[#E8E4DD] rounded-xl border border-white/10 p-2 grid grid-cols-4 gap-2 z-10">
                                <div className="col-span-4 bg-[#111111]/5 rounded-md flex items-center px-4">
                                    <div className="font-mono text-xs font-bold text-[#111111]">OPTIMIZED</div>
                                </div>
                                <div className="col-span-2 row-span-2 bg-[#E63B2E]/10 rounded-md border border-[#E63B2E]/30 flex flex-col items-center justify-center p-2">
                                    <div className="font-space-grotesk text-2xl font-black text-[#E63B2E] leading-none">{features[2].highlight}</div>
                                    <div className="font-mono text-[8px] text-[#111111]/60 uppercase mt-1 text-center">{features[2].highlightLabel}</div>
                                </div>
                                <div className="col-span-2 bg-[#111111]/5 rounded-md" />
                                <div className="col-span-2 bg-[#111111]/10 rounded-md" />
                                
                                <motion.div 
                                    className="absolute z-10 w-4 h-4 text-[#111111]"
                                    animate={{
                                        x: [180, 60, 60, 180],
                                        y: [10, 50, 50, 80],
                                        scale: [1, 1, 0.8, 1]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        times: [0, 0.4, 0.5, 1]
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4l16 16m0 0V4m0 16H4" />
                                    </svg>
                                </motion.div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Comparison Section - Brutalist Data Matrix */}
            <section className="py-32 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111]/5 border border-[#111111]/10 rounded-full mb-6">
                            <span className="w-2 h-2 rounded bg-[#E63B2E] animate-pulse" />
                            <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-widest">
                                Protocol Comparison
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-space-grotesk font-black text-[#111111] uppercase tracking-tighter leading-none mb-6">
                            See The <span className="font-drama italic text-[#E63B2E] lowercase text-6xl md:text-8xl">Delta.</span>
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto font-mono text-sm border border-[#111111]/20">
                        {/* Header Row */}
                        <div className="grid grid-cols-3 bg-[#111111] text-[#E8E4DD] uppercase font-bold tracking-widest text-xs border-b border-[#111111]/20">
                            <div className="p-4 border-r border-white/20">Metric</div>
                            <div className="p-4 border-r border-white/20 text-[#E63B2E]">Our Infrastructure</div>
                            <div className="p-4 text-[#E8E4DD]/50">Legacy Systems</div>
                        </div>
                        
                        {/* Data Rows */}
                        {comparisonData.map((row, index) => (
                            <div key={index} className="grid grid-cols-3 border-b border-[#111111]/10 last:border-b-0 group hover:bg-[#111111]/5 transition-colors">
                                <div className="p-4 border-r border-[#111111]/10 font-medium text-[#111111]">{row.feature}</div>
                                <div className="p-4 border-r border-[#111111]/10 text-[#E63B2E] font-bold flex items-center justify-between">
                                    <span>{row.us}</span>
                                    <div className="w-1.5 h-1.5 bg-[#E63B2E] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-4 text-[#111111]/40">{row.others}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Terminal Execution CTA */}
            <section className="py-32 bg-[#0D0D12] relative overflow-hidden border-t border-white/10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E63B2E]/10 border border-[#E63B2E]/20 rounded-full mb-8">
                            <span className="w-2 h-2 rounded bg-[#E63B2E] animate-pulse" />
                            <span className="font-mono text-xs font-bold text-[#E63B2E] uppercase tracking-widest">
                                Init Sequence
                            </span>
                        </div>
                        
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-space-grotesk font-black text-[#E8E4DD] uppercase tracking-tighter leading-[0.9] mb-8">
                            Execute <span className="font-drama text-[#E63B2E] italic lowercase">Upgrade.</span>
                        </h2>
                        
                        <p className="font-space-mono text-[#E8E4DD]/60 max-w-xl mx-auto text-xs md:text-sm uppercase tracking-widest leading-relaxed mb-12">
                            Join thousands who've already migrated. Deploy your free checking node in precisely 300 seconds.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <div className="relative group overflow-hidden rounded-[2rem] p-[2px] cursor-pointer inline-block w-full sm:w-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#E63B2E] to-[#C9A84C] opacity-80 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
                                    <div className="absolute inset-[2px] bg-[#0D0D12] rounded-[2rem] z-0 transition-opacity duration-300 group-hover:opacity-0" />
                                    <div className="relative z-10 px-8 py-4 bg-[#E8E4DD] text-[#0D0D12] font-space-grotesk font-black text-sm md:text-base uppercase tracking-wider rounded-[2rem] flex items-center justify-center gap-3 transform transition-transform duration-500 hover:scale-[1.03] active:scale-95 shadow-2xl">
                                        <Zap className="w-4 h-4 text-[#E63B2E]" />
                                        <span>Open Free Account</span>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/contact">
                                <div className="px-8 py-4 bg-transparent border border-[#E8E4DD]/20 text-[#E8E4DD] font-space-grotesk font-black text-sm md:text-base uppercase tracking-wider rounded-[2rem] hover:bg-[#E8E4DD]/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto h-full">
                                    <span>Talk to an Expert</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
