'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useBranding } from '@/contexts/BrandingContext';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Send, Target, TrendingUp, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';

// Full slides with matched content + unique visuals
const heroSlides = [
    {
        badge: "Digital Banking Redefined",
        headline: "Banking Made",
        highlight: "Simple & Smart",
        description: "Experience the future of finance with our award-winning digital platform. Send, save, and grow your money — all from your phone.",
        type: "banking",
        icon: "💳"
    },
    {
        badge: "Fast & Secure",
        headline: "Instant",
        highlight: "Transfers",
        description: "Send money to anyone, anywhere in seconds. Zero delays, zero hassle. Your money moves as fast as you do.",
        type: "transfer",
        icon: "💸"
    },
    {
        badge: "Grow Your Wealth",
        headline: "Save Smarter,",
        highlight: "Earn More",
        description: "High-yield savings accounts with up to 15% APY. Automated savings tools to help you reach your goals faster.",
        type: "savings",
        icon: "🎯"
    },
    {
        badge: "Business Solutions",
        headline: "Power Your",
        highlight: "Business",
        description: "Comprehensive banking solutions for entrepreneurs. Invoicing, payroll, multi-user access — all in one platform.",
        type: "business",
        icon: "💼"
    }
];

// Unique visual for each slide type
function SlideVisual({ type, icon }: { type: string; icon: string }) {
    if (type === "banking") {
        return (
            <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-4 overflow-hidden">
                {/* Banking Dashboard */}
                <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-t-[2rem] p-6 text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-sm opacity-80 mb-1">Total Balance</div>
                            <div className="text-4xl font-black">$24,568.00</div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <span className="text-3xl">{icon}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white/20 backdrop-blur rounded-xl p-3 text-center">
                            <div className="text-xs opacity-70">Income</div>
                            <div className="font-bold">+$4,200</div>
                        </div>
                        <div className="flex-1 bg-white/20 backdrop-blur rounded-xl p-3 text-center">
                            <div className="text-xs opacity-70">Expenses</div>
                            <div className="font-bold">-$1,832</div>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-4 gap-3">
                        {['Send', 'Request', 'Cards', 'More'].map((action, i) => (
                            <div key={action} className="bg-slate-50 rounded-2xl p-4 text-center">
                                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl">
                                    {['💸', '📥', '💳', '⚡'][i]}
                                </div>
                                <div className="text-xs font-semibold text-slate-600">{action}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (type === "transfer") {
        return (
            <div className="relative">
                {/* Two phones with money flowing between */}
                <div className="flex items-center justify-center gap-8">
                    {/* Left Phone */}
                    <div className="bg-white rounded-3xl shadow-2xl p-3 transform -rotate-6">
                        <div className="bg-brand-primary rounded-2xl p-6 text-white w-48">
                            <div className="text-sm opacity-80 mb-1">Sending</div>
                            <div className="text-3xl font-black mb-4">$500.00</div>
                            <div className="bg-white/20 rounded-xl p-3 text-center">
                                <div className="text-sm font-bold">To: John Doe</div>
                            </div>
                        </div>
                    </div>

                    {/* Arrow/Flow */}
                    <div className="flex flex-col items-center gap-2">
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-4xl"
                        >
                            💰
                        </motion.div>
                        <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 0.5, delay: i * 0.2, repeat: Infinity }}
                                    className="w-3 h-3 bg-brand-primary rounded-full"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Phone */}
                    <div className="bg-white rounded-3xl shadow-2xl p-3 transform rotate-6">
                        <div className="bg-green-500 rounded-2xl p-6 text-white w-48">
                            <div className="text-sm opacity-80 mb-1">Received!</div>
                            <div className="text-3xl font-black mb-4">+$500.00</div>
                            <div className="bg-white/20 rounded-xl p-3 text-center">
                                <div className="text-sm font-bold">✓ Complete</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Speed indicator */}
                <div className="mt-8 bg-white/80 backdrop-blur rounded-2xl shadow-xl p-4 max-w-xs mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white">
                            <Send size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">Instant Transfer</div>
                            <div className="text-sm text-slate-500">Completed in 0.3 seconds</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "savings") {
        return (
            <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-6 overflow-hidden">
                {/* Savings Goal Card */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Savings Goal</div>
                        <div className="text-2xl font-black text-slate-900">Vacation Fund</div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-3xl shadow-lg">
                        🎯
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-brand-primary">$7,500</span>
                        <span className="text-slate-500">of $10,000</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                        />
                    </div>
                    <div className="text-right text-sm text-slate-500 mt-1">75% Complete</div>
                </div>

                {/* Interest Rate */}
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="text-green-600" size={24} />
                            <div>
                                <div className="font-bold text-slate-900">Interest Rate</div>
                                <div className="text-sm text-slate-500">Annual Percentage Yield</div>
                            </div>
                        </div>
                        <div className="text-3xl font-black text-green-600">15%</div>
                    </div>
                </div>

                {/* Auto-save badge */}
                <div className="flex items-center gap-2 justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-600">Auto-save enabled: $200/week</span>
                </div>
            </div>
        );
    }

    if (type === "business") {
        return (
            <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 p-4 overflow-hidden">
                {/* Business Dashboard */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-[2rem] p-6 text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-sm opacity-80 mb-1">Business Account</div>
                            <div className="text-4xl font-black">$85,320.00</div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <Briefcase size={28} />
                        </div>
                    </div>

                    {/* Revenue chart bars */}
                    <div className="flex items-end gap-2 h-16">
                        {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: i * 0.1 }}
                                className="flex-1 bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-lg"
                            />
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {/* Team members */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-slate-700">Team Access</span>
                        <div className="flex -space-x-2">
                            {['JD', 'SM', 'AO', '+3'].map((initials, i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-8 rounded-full ${i === 3 ? 'bg-slate-200 text-slate-600' : 'bg-brand-primary text-white'} flex items-center justify-center text-xs font-bold border-2 border-white`}
                                >
                                    {initials}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                            <div className="text-lg font-black text-slate-900">142</div>
                            <div className="text-xs text-slate-500">Invoices Sent</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 text-center">
                            <div className="text-lg font-black text-green-600">$24.5K</div>
                            <div className="text-xs text-slate-500">This Month</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export function WemaHero() {
    const { branding } = useBranding();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

    const slide = heroSlides[currentSlide];

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-[rgb(var(--brand-primary-rgb)/0.05)]" />

            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-20 w-[600px] h-[600px] bg-[rgb(var(--brand-primary-rgb)/0.25)] rounded-full blur-3xl"
            />
            <motion.div
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[rgb(var(--brand-secondary-rgb)/0.2)] rounded-full blur-3xl"
            />

            <motion.div
                animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-32 left-[15%] w-16 h-16 border-2 border-brand-primary/30 rounded-xl"
            />

            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left - Text */}
                    <div className="text-center lg:text-left">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-8 border border-brand-primary/20">
                                    <Sparkles size={16} className="text-brand-primary" />
                                    <span className="text-sm font-semibold text-brand-primary">{slide.badge}</span>
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tight">
                                    {slide.headline}
                                    <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                                        {slide.highlight}
                                    </span>
                                </h1>

                                <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                    {slide.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="h-16 px-10 text-lg font-bold rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white shadow-2xl shadow-brand-primary/30 transition-all hover:scale-105 group"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-16 px-10 text-lg font-bold rounded-2xl border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-brand-primary hover:text-brand-primary transition-all bg-white/50"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 justify-center lg:justify-start">
                            <button
                                onClick={prevSlide}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-2">
                                {heroSlides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`h-3 rounded-full transition-all ${i === currentSlide ? 'bg-brand-primary w-8' : 'bg-slate-300 hover:bg-slate-400 w-3'}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={nextSlide}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right - Unique Visual for Each Slide */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-primary/20 via-brand-secondary/20 to-brand-primary/20 rounded-[3rem] blur-2xl" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <SlideVisual type={slide.type} icon={slide.icon} />
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
