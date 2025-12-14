'use client';

import { motion } from 'framer-motion';
import { UserPlus, Fingerprint, Rocket, ArrowRight } from 'lucide-react';

const steps = [
    {
        number: "01",
        title: "Create Account",
        description: "Sign up in under 3 minutes with just your BVN and a quick selfie. No paperwork, no branch visits.",
        icon: <UserPlus size={32} />
    },
    {
        number: "02",
        title: "Verify Identity",
        description: "Our AI-powered verification takes seconds. Unlock premium features and higher limits instantly.",
        icon: <Fingerprint size={32} />
    },
    {
        number: "03",
        title: "Start Banking",
        description: "Fund your account and unlock the full power of digital banking. Send, save, invest — all in one app.",
        icon: <Rocket size={32} />
    }
];

export function WorkflowSection() {
    return (
        <section className="py-16 sm:py-24 md:py-32 bg-slate-900 relative overflow-hidden">
            {/* Background effects using brand colors */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(var(--brand-primary-rgb)/0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgb(var(--brand-secondary-rgb)/0.1),transparent_50%)]" />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 sm:mb-16 md:mb-20"
                >
                    <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm font-bold text-brand-primary mb-6 border border-white/10">
                        🚀 Get Started
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6">
                        Open Your Account in
                        <span className="text-brand-primary"> 3 Easy Steps</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto px-4">
                        No hidden fees. No minimum balance. Just pure, seamless banking.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-brand-primary/30 rounded-full transform -translate-y-1/2 z-0" />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative"
                            >
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 h-full hover:bg-white/10 transition-all duration-500 relative overflow-hidden"
                                >
                                    {/* Glow effect */}
                                    <div className="absolute -inset-1 bg-brand-primary opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />

                                    <div className="relative">
                                        {/* Icon */}
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-2xl mb-4 sm:mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                            {step.icon}
                                        </div>

                                        {/* Number */}
                                        <div className="absolute top-0 right-0 text-4xl sm:text-5xl md:text-7xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                                            {step.number}
                                        </div>

                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-4">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-400 leading-relaxed text-sm sm:text-base md:text-lg">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Arrow between steps */}
                                {index < 2 && (
                                    <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-20 text-brand-primary">
                                        <ArrowRight size={24} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
