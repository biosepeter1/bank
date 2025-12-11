'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function BoldCTA() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Gradient background using brand colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary" />

            {/* Overlay for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.1),transparent_50%)]" />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Floating orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-20 right-[20%] w-72 h-72 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.15, 0.3, 0.15]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-20 left-[20%] w-80 h-80 bg-white/10 rounded-full blur-3xl"
            />

            {/* Floating geometric shapes */}
            <motion.div
                animate={{ y: [-20, 20, -20], rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-40 left-[10%] w-16 h-16 border-2 border-white/20 rounded-xl"
            />
            <motion.div
                animate={{ y: [20, -20, 20] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute bottom-32 right-[15%] w-12 h-12 bg-white/10 rounded-full"
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center text-white max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur rounded-full mb-8 border border-white/20"
                    >
                        <Sparkles size={18} className="text-yellow-300" />
                        <span className="font-bold">Join 50,000+ Happy Customers</span>
                    </motion.div>

                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                        Ready to Experience
                        <span className="block text-white/90">
                            The Future of Banking?
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Open your free account in under 3 minutes. No paperwork, no minimum balance, no hidden fees.
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        {["Free to open", "No monthly fees", "Instant virtual card", "24/7 support"].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-2 text-white/90"
                            >
                                <CheckCircle size={20} className="text-green-300" />
                                <span className="font-semibold">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Buttons - Fixed and improved */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <Link href="/register">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="h-16 px-12 text-xl font-black rounded-2xl bg-white text-brand-primary hover:bg-white/95 shadow-2xl shadow-black/30 flex items-center gap-3 transition-colors"
                            >
                                Get Started Free
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                            </motion.button>
                        </Link>
                        <Link href="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="h-16 px-12 text-xl font-bold rounded-2xl border-2 border-white/40 text-white hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm flex items-center gap-2"
                            >
                                Talk to Sales
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
