'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { TrendingUp, Lock, PiggyBank, Target, ArrowRight, Shield, Percent, Wallet, Sparkles, CheckCircle2, ArrowUpRight, Clock, BarChart3 } from 'lucide-react';
import { motion, useInView, animate } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';

function CountUp({ to, prefix = '$' }: { to: number; prefix?: string }) {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!nodeRef.current || !isInView) return;

        const node = nodeRef.current;
        const controls = animate(0, to, {
            duration: 2.5,
            onUpdate: (value) => {
                node.textContent = `${prefix}${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
            },
            ease: "easeOut"
        });

        return () => controls.stop();
    }, [isInView, to, prefix]);

    return <span ref={nodeRef} className="text-4xl font-bold text-slate-900">{prefix}0.00</span>;
}

export default function SavingsPage() {
    const features = [
        {
            title: 'High-Yield APY',
            description: 'Earn up to 4.5% APY on your savings — 10x the national average.',
            icon: Percent,
            highlight: '4.5% APY',
            bgColor: 'bg-brand-primary/10',
            iconColor: 'text-brand-primary',
            borderColor: 'border-brand-primary/20'
        },
        {
            title: 'Smart Vaults',
            description: 'Create separate vaults for each goal — vacation, emergency fund, or dream purchase.',
            icon: PiggyBank,
            highlight: 'Unlimited',
            bgColor: 'bg-violet-50',
            iconColor: 'text-violet-600',
            borderColor: 'border-violet-200'
        },
        {
            title: 'Auto-Save Rules',
            description: 'Round up purchases, save on payday, or set custom rules that work for you.',
            icon: Sparkles,
            highlight: 'Automatic',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-200'
        },
        {
            title: 'Goal Tracking',
            description: 'Visualize progress toward your goals with beautiful charts and milestones.',
            icon: Target,
            highlight: 'Visual',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200'
        },
        {
            title: 'No Lock-in Period',
            description: 'Access your money anytime. No penalties, no waiting periods.',
            icon: Clock,
            highlight: 'Flexible',
            bgColor: 'bg-rose-50',
            iconColor: 'text-rose-600',
            borderColor: 'border-rose-200'
        },
        {
            title: 'FDIC Insured',
            description: 'Your deposits are protected up to $250,000 by the FDIC.',
            icon: Shield,
            highlight: 'Protected',
            bgColor: 'bg-slate-100',
            iconColor: 'text-slate-700',
            borderColor: 'border-slate-200'
        }
    ];

    const vaultExamples = [
        { name: 'Emergency Fund', target: 10000, current: 7500, color: 'from-brand-primary to-brand-secondary', icon: '🛡️' },
        { name: 'Dream Vacation', target: 5000, current: 3200, color: 'from-brand-primary to-brand-secondary', icon: '✈️' },
        { name: 'New Car', target: 25000, current: 12000, color: 'from-brand-primary to-brand-secondary', icon: '🚗' },
        { name: 'Home Down Payment', target: 50000, current: 28000, color: 'from-brand-primary to-brand-secondary', icon: '🏠' },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
                    <motion.div
                        className="absolute top-20 right-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 10, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-20 left-10 w-72 h-72 bg-brand-secondary/10 rounded-full blur-3xl"
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                </div>

                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-6 border border-brand-primary/20">
                                <TrendingUp className="w-4 h-4" />
                                High-Yield Savings
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                                Watch Your
                                <span className="block bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                                    Money Grow
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                Earn 4.5% APY with no minimums, no fees, and no hoops to jump through. Your savings, supercharged.
                            </p>

                            {/* APY Highlight */}
                            <div className="bg-brand-gradient rounded-2xl p-6 mb-8 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white/80 text-sm font-medium">Annual Percentage Yield</div>
                                        <div className="text-5xl font-bold">4.50%</div>
                                        <div className="text-white/80 text-sm mt-1">10x the national average</div>
                                    </div>
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-10 h-10" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Link href="/register">
                                    <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white shadow-xl shadow-brand-primary/25 h-14 px-8 text-base rounded-xl">
                                        Start Saving Now
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Hero Visual - Savings Growth */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
                                {/* Total Savings */}
                                <div className="mb-8">
                                    <div className="text-slate-500 text-sm mb-1">Total Savings</div>
                                    <div className="flex items-end gap-3">
                                        <CountUp to={24750} />
                                        <span className="text-brand-primary text-sm font-semibold flex items-center mb-1">
                                            <ArrowUpRight className="w-4 h-4" />
                                            +$892.50 this month
                                        </span>
                                    </div>
                                </div>

                                {/* Mini Chart Visual */}
                                <div className="h-32 flex items-end gap-2 mb-8">
                                    {[40, 45, 42, 55, 60, 58, 70, 75, 72, 85, 90, 95].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex-1 bg-brand-gradient rounded-t-sm"
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${height}%` }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.05, duration: 0.5 }}
                                        />
                                    ))}
                                </div>

                                {/* Interest Earned */}
                                <div className="bg-brand-primary/5 rounded-xl p-4 border border-brand-primary/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-brand-primary text-sm font-medium">Interest Earned (YTD)</div>
                                            <div className="text-2xl font-bold text-slate-900">$1,114.38</div>
                                        </div>
                                        <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-brand-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating notification */}
                            <motion.div
                                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-brand-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">Interest Added</div>
                                        <div className="text-xs text-slate-500">+$28.75</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Saving Made Simple</h2>
                            <p className="text-xl text-slate-600">
                                Powerful tools to help you save more, stress less, and reach your goals faster.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`group bg-white rounded-2xl p-8 border ${feature.borderColor} hover:shadow-xl transition-all duration-300`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} ${feature.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <feature.icon size={28} />
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${feature.bgColor} ${feature.iconColor}`}>
                                        {feature.highlight}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vaults Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                                Organize with
                                <span className="text-brand-primary"> Vaults</span>
                            </h2>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                Create separate savings vaults for each of your goals. Watch your progress, stay motivated, and celebrate when you hit your targets.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Create unlimited vaults for any goal',
                                    'Set target amounts and deadlines',
                                    'Track progress with visual indicators',
                                    'Automate contributions to each vault'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/register">
                                <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white h-12 px-8 rounded-xl">
                                    Create Your First Vault
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            {vaultExamples.map((vault, index) => {
                                const percentage = (vault.current / vault.target) * 100;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{vault.icon}</span>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{vault.name}</div>
                                                    <div className="text-sm text-slate-500">
                                                        ${vault.current.toLocaleString()} of ${vault.target.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-slate-900">{percentage.toFixed(0)}%</div>
                                            </div>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full bg-gradient-to-r ${vault.color} rounded-full`}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${percentage}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                See Your Money Grow
                            </h2>
                            <p className="text-xl text-slate-300 mb-8">
                                With our high-yield savings, your money works harder. Here's what $10,000 could become:
                            </p>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { years: '1 Year', amount: '$10,450', growth: '+$450' },
                                    { years: '3 Years', amount: '$11,412', growth: '+$1,412' },
                                    { years: '5 Years', amount: '$12,462', growth: '+$2,462' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                                        <div className="text-slate-400 text-sm mb-1">{item.years}</div>
                                        <div className="text-2xl font-bold text-white">{item.amount}</div>
                                        <div className="text-brand-secondary text-sm font-semibold">{item.growth}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-2xl">
                                <div className="text-slate-500 text-sm mb-2">Compare: Traditional Banks</div>
                                <div className="text-4xl font-bold text-slate-900 mb-2">0.45% APY</div>
                                <div className="text-slate-400 mb-6">National Average</div>
                                <div className="border-t pt-6">
                                    <div className="text-brand-primary text-sm font-semibold mb-2">Our Savings Account</div>
                                    <div className="text-6xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">4.50%</div>
                                    <div className="text-slate-500 mt-2">10x Higher Returns</div>
                                </div>
                                <Link href="/register" className="block mt-6">
                                    <Button size="lg" className="w-full bg-brand-gradient text-white h-14 rounded-xl text-lg">
                                        Open Savings Account
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-brand-primary/5">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <PiggyBank className="w-10 h-10 text-brand-primary" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            Start Growing Your Savings Today
                        </h2>
                        <p className="text-xl text-slate-600 mb-10">
                            No minimums. No fees. Just higher returns. Open your account in minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-brand-gradient text-white shadow-xl shadow-brand-primary/25 h-14 px-10 text-base rounded-xl font-semibold">
                                    Open Free Account
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="border-2 h-14 px-10 text-base rounded-xl">
                                    Have Questions?
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

