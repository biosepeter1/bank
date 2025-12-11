'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Smartphone, Zap, TrendingUp, CreditCard, Globe } from 'lucide-react';

const benefits = [
    {
        icon: <Smartphone size={28} />,
        title: "Mobile-First Banking",
        description: "Your entire bank fits in your pocket. Pay, save, and invest with just a tap."
    },
    {
        icon: <ShieldCheck size={28} />,
        title: "Military-Grade Security",
        description: "256-bit encryption, biometrics, and real-time fraud detection protect every transaction."
    },
    {
        icon: <Zap size={28} />,
        title: "Instant Everything",
        description: "Lightning-fast transfers, real-time notifications, and zero-lag performance."
    },
    {
        icon: <TrendingUp size={28} />,
        title: "Grow Your Wealth",
        description: "High-yield savings up to 15% APY. Watch your money work harder for you."
    },
    {
        icon: <CreditCard size={28} />,
        title: "Virtual & Physical Cards",
        description: "Create unlimited virtual cards instantly. Shop globally with zero FX fees."
    },
    {
        icon: <Globe size={28} />,
        title: "Global Transfers",
        description: "Send money to 150+ countries with the best exchange rates. Arrives in minutes."
    }
];

export function BenefitsSection() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />

            {/* Decorative elements using brand colors */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-brand-secondary/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-sm font-bold text-brand-primary mb-6"
                    >
                        ✨ Why Choose Us
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6">
                        Banking That
                        <span className="text-brand-primary"> Moves With You</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                        We're not just a bank. We're your financial partner, built for the modern world.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative"
                        >
                            {/* Card glow on hover */}
                            <div className="absolute -inset-1 bg-brand-primary rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500" />

                            {/* Card */}
                            <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    {benefit.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-all">
                                    {benefit.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
