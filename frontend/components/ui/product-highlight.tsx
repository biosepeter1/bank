'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
    "Instant transfers to any bank",
    "Virtual cards for safe online shopping",
    "AI-powered spending insights",
    "Automated savings goals",
    "Bill payments & airtime",
    "24/7 customer support"
];

export function ProductHighlight() {
    return (
        <section className="py-32 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="absolute top-40 right-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-20 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Column - App Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: -80 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Phone frame */}
                        <div className="relative mx-auto max-w-sm">
                            {/* Glow behind phone */}
                            <div className="absolute -inset-8 bg-brand-primary/20 rounded-[4rem] blur-3xl" />

                            {/* Phone */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="relative"
                            >
                                <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl border border-slate-800">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-20" />

                                    {/* Screen */}
                                    <div className="relative bg-gradient-to-b from-brand-primary to-brand-secondary rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                                        <div className="p-6 pt-12 h-full">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <div className="text-white/60 text-sm">Good morning!</div>
                                                    <div className="text-white text-2xl font-bold">Alex Johnson</div>
                                                </div>
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur" />
                                            </div>

                                            <div className="bg-white/10 backdrop-blur rounded-3xl p-6 mb-6">
                                                <div className="text-white/60 text-sm mb-1">Total Balance</div>
                                                <div className="text-white text-4xl font-black mb-4">$24,568</div>
                                                <div className="flex gap-2">
                                                    <div className="flex-1 bg-white/20 rounded-xl py-3 text-center text-white text-sm font-medium">Send</div>
                                                    <div className="flex-1 bg-white/20 rounded-xl py-3 text-center text-white text-sm font-medium">Receive</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-3 mb-6">
                                                {['💳', '📊', '🎯', '⚡'].map((emoji, i) => (
                                                    <div key={i} className="bg-white/10 backdrop-blur rounded-2xl aspect-square flex items-center justify-center text-2xl">
                                                        {emoji}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">↑</div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-slate-900 text-sm">Payment Received</div>
                                                    <div className="text-slate-500 text-xs">From Sarah</div>
                                                </div>
                                                <div className="font-bold text-green-600">+$500</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [-5, 5, -5], x: [-3, 3, -3], rotate: [-2, 2, -2] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-4 -right-4 lg:right-8 bg-white rounded-2xl shadow-2xl p-4 border border-slate-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">✓</div>
                                <div>
                                    <div className="font-bold text-slate-900">Transfer Sent!</div>
                                    <div className="text-sm text-slate-500">$2,450 to John</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [5, -5, 5], x: [3, -3, 3] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute -bottom-8 -left-4 lg:left-8 bg-brand-primary rounded-2xl shadow-2xl p-4 text-white"
                        >
                            <div className="flex items-center gap-3">
                                <Sparkles size={24} />
                                <div>
                                    <div className="font-bold">Savings Goal</div>
                                    <div className="text-sm opacity-80">Reached $10,000!</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-sm font-bold text-brand-primary mb-6">
                            📱 The App
                        </span>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                            Everything You Need,
                            <span className="text-brand-primary"> One App</span>
                        </h2>

                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Our award-winning app puts the power of a full-service bank in your pocket.
                            Simple, fast, and secure.
                        </p>

                        {/* Features list */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-10">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="text-slate-700 font-medium">{feature}</span>
                                </motion.div>
                            ))}
                        </div>


                    </motion.div>
                </div>
            </div>
        </section>
    );
}
