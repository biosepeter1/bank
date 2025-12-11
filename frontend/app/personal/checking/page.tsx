'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Shield, Smartphone, Globe, ArrowRight, Zap, CreditCard, Clock, DollarSign, Users, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function CheckingPage() {
    const features = [
        {
            title: 'No Monthly Fees',
            description: 'Enjoy fee-free banking with no minimum balance requirements. Keep more of your money.',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Global ATM Access',
            description: 'Access your funds from 55,000+ ATMs worldwide with no foreign transaction fees.',
            icon: Globe,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Mobile Banking',
            description: 'Deposit checks, pay bills, and transfer money instantly from our award-winning app.',
            icon: Smartphone,
            color: 'from-purple-500 to-violet-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Bank-Grade Security',
            description: 'Your deposits are FDIC insured and protected by 256-bit encryption.',
            icon: Shield,
            color: 'from-slate-600 to-slate-800',
            bgColor: 'bg-slate-100',
            iconColor: 'text-slate-700'
        },
        {
            title: 'Instant Transfers',
            description: 'Send money to friends and family instantly with no transfer fees.',
            icon: Zap,
            color: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600'
        },
        {
            title: 'Virtual Debit Cards',
            description: 'Generate unlimited virtual cards for secure online shopping.',
            icon: CreditCard,
            color: 'from-pink-500 to-rose-600',
            bgColor: 'bg-pink-50',
            iconColor: 'text-pink-600'
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
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/5 to-transparent" />
                    <motion.div
                        className="absolute top-20 right-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-20 left-20 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl"
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 10, repeat: Infinity }}
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
                                <CheckCircle2 className="w-4 h-4" />
                                Personal Checking
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                                Banking That
                                <span className="block bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                                    Works For You
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                No monthly fees. No minimum balance. No nonsense. Just simple, powerful checking that puts you in control.
                            </p>
                            <div className="mb-8">
                                <Link href="/register">
                                    <Button size="lg" className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white shadow-xl shadow-brand-primary/25 h-14 px-8 text-base rounded-xl">
                                        Open Free Account
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-green-500" />
                                    <span>Open in 5 minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                    <span>FDIC Insured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span className="font-semibold">50,000+ Customers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-500" />
                                    <span className="font-semibold">4.9/5 App Rating</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    <span className="font-semibold">55,000+ ATMs</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative z-10 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 max-w-md mx-auto transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-brand-primary" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Current Balance</div>
                                        <div className="text-2xl font-bold text-slate-900">$12,450.00</div>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {[
                                        { name: 'Netflix Subscription', amount: '-$15.99', date: 'Today', icon: '🎬' },
                                        { name: 'Grocery Store', amount: '-$84.32', date: 'Yesterday', icon: '🛒' },
                                        { name: 'Salary Deposit', amount: '+$3,250.00', date: 'Oct 28', icon: '💰', positive: true },
                                    ].map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm">
                                                    {tx.icon}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{tx.name}</div>
                                                    <div className="text-xs text-slate-500">{tx.date}</div>
                                                </div>
                                            </div>
                                            <div className={`font-bold ${tx.positive ? 'text-green-600' : 'text-slate-900'}`}>
                                                {tx.amount}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl p-4 text-white flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-8 bg-white/20 rounded flex items-center justify-center">
                                            <div className="w-6 h-4 border border-white/50 rounded-sm" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/80">Virtual Card</div>
                                            <div className="font-mono text-sm">•••• 4242</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded">ACTIVE</div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-gradient opacity-20 blur-3xl -z-10 rounded-full" />
                            <motion.div
                                className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl z-20"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-900">Instant Transfer</div>
                                        <div className="text-xs text-slate-500">Just now</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Everything You Need</h2>
                            <p className="text-xl text-slate-600">
                                Powerful features designed for how you actually bank.
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
                                className="group bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} ${feature.iconColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">See The Difference</h2>
                            <p className="text-xl text-slate-600">
                                Compare our checking account to traditional banks.
                            </p>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
                    >
                        <div className="grid grid-cols-3 bg-slate-900 text-white">
                            <div className="p-6 font-semibold">Feature</div>
                            <div className="p-6 font-semibold text-center bg-gradient-to-r from-brand-primary to-brand-secondary">Our Checking</div>
                            <div className="p-6 font-semibold text-center text-slate-400">Other Banks</div>
                        </div>
                        {comparisonData.map((row, index) => (
                            <div key={index} className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                                <div className="p-5 font-medium text-slate-700">{row.feature}</div>
                                <div className="p-5 text-center font-semibold text-green-600 flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {row.us}
                                </div>
                                <div className="p-5 text-center text-slate-500">{row.others}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Bank Smarter?
                        </h2>
                        <p className="text-xl text-slate-300 mb-10">
                            Join thousands who've already made the switch. Open your free account in just 5 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-10 text-base rounded-xl font-semibold">
                                    Open Free Account
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 h-14 px-10 text-base rounded-xl">
                                    Talk to an Expert
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

