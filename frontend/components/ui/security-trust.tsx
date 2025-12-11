'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Fingerprint, BadgeCheck, Star, Quote } from 'lucide-react';

const trustBadges = [
    {
        icon: <Shield size={32} />,
        title: "Zero Fraud Liability",
        description: "100% protection for unauthorized transactions"
    },
    {
        icon: <Lock size={32} />,
        title: "256-bit Encryption",
        description: "Bank-level security for all your data"
    },
    {
        icon: <Fingerprint size={32} />,
        title: "Biometric Access",
        description: "Face ID & fingerprint authentication"
    },
    {
        icon: <BadgeCheck size={32} />,
        title: "CBN Licensed",
        description: "Regulated by the Central Bank"
    }
];

const testimonials = [
    {
        name: "Sarah Mitchell",
        role: "Business Owner",
        avatar: "SM",
        content: "This app has completely transformed how I manage my business finances. The dashboard is intuitive and transfers are instant. Best banking decision I've ever made!",
        rating: 5
    },
    {
        name: "David Chen",
        role: "Software Engineer",
        avatar: "DC",
        content: "Finally, a bank that understands modern users. The virtual cards feature is a game-changer for online shopping. Love the clean interface!",
        rating: 5
    },
    {
        name: "Amina Okafor",
        role: "Freelancer",
        avatar: "AO",
        content: "I've recommended this to all my friends. The savings goals helped me save for my vacation in just 3 months. The interest rates are unbeatable!",
        rating: 5
    }
];

export function SecurityTrust() {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="absolute top-40 left-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-20 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-2 bg-green-100 rounded-full text-sm font-bold text-green-700 mb-6">
                        🔒 Security First
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6">
                        Your Money is
                        <span className="text-brand-primary"> Fort Knox Safe</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        We use the same security protocols trusted by the world's largest financial institutions.
                    </p>
                </motion.div>

                {/* Trust Badges */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {trustBadges.map((badge, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative"
                        >
                            <div className="absolute -inset-1 bg-brand-primary rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all" />
                            <div className="relative bg-slate-50 hover:bg-white p-8 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all text-center shadow-sm hover:shadow-xl">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                    {badge.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{badge.title}</h3>
                                <p className="text-slate-500">{badge.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 overflow-hidden">
                        {/* Background effects */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
                        <div className="absolute top-10 right-10 text-white/5">
                            <Quote size={200} />
                        </div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-12">
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                                    Trusted by <span className="text-brand-primary">50,000+</span> Users
                                </h3>
                                <div className="flex justify-center gap-1 mb-6">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} size={24} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-400 text-lg">4.9 out of 5 based on 12,000+ reviews</p>
                            </div>

                            {/* Testimonial cards */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {testimonials.map((testimonial, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>

                                        <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>

                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{testimonial.name}</div>
                                                <div className="text-sm text-slate-400">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
