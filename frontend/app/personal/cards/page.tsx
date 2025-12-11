'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { CreditCard, ShieldCheck, Zap, Gift, ArrowRight, Lock, Globe, Smartphone, Percent, Star, CheckCircle2, Sparkles, Plane, Coffee, ShoppingBag, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function CardsPage() {
    const [selectedCards, setSelectedCards] = useState<number[]>([0, 1, 2]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const cardTypes = [
        {
            name: 'Gold Card Master',
            type: 'Debit',
            color: 'from-slate-700 to-slate-900',
            cashback: '1%',
            annualFee: '$0',
            monthlyFee: '$0',
            features: ['No monthly fees', 'ATM rebates', 'Virtual cards', 'Mobile wallet'],
            popular: false,
            icon: CreditCard,
            atmWithdrawal: '$500/day',
            transferLimit: '$2,000/day',
            onlinePurchase: '$1,000/day',
            foreignTxFee: '1.5%',
            rewardsRate: '1x on all purchases',
            loungeAccess: false,
            travelInsurance: false,
            concierge: false,
            virtualCards: 'Unlimited',
            cardReplacement: '$2'
        },
        {
            name: 'Visa Infinite',
            type: 'Credit',
            color: 'from-brand-primary to-brand-secondary',
            cashback: '3%',
            annualFee: '$50',
            monthlyFee: '$0',
            features: ['3% on dining & travel', 'Airport lounge access', 'Travel insurance', 'Concierge service'],
            popular: true,
            icon: Star,
            atmWithdrawal: '$1,000/day',
            transferLimit: '$5,000/day',
            onlinePurchase: '$3,000/day',
            foreignTxFee: '0%',
            rewardsRate: '3x on dining & travel',
            loungeAccess: true,
            travelInsurance: true,
            concierge: true,
            virtualCards: 'Unlimited',
            cardReplacement: 'Free'
        },
        {
            name: 'Platinum Elite',
            type: 'Credit',
            color: 'from-amber-500 to-amber-700',
            cashback: '5%',
            annualFee: '$250',
            monthlyFee: '$0',
            features: ['5% on everything', 'Unlimited lounge access', 'Premium concierge', '$500 travel credit'],
            popular: false,
            icon: Sparkles,
            atmWithdrawal: '$5,000/day',
            transferLimit: 'Unlimited',
            onlinePurchase: 'Unlimited',
            foreignTxFee: '0%',
            rewardsRate: '5x on everything',
            loungeAccess: true,
            travelInsurance: true,
            concierge: true,
            virtualCards: 'Unlimited',
            cardReplacement: 'Free'
        }
    ];

    const comparisonSpecs = [
        { label: 'Card Type', key: 'type' },
        { label: 'Annual Fee', key: 'annualFee' },
        { label: 'Monthly Fee', key: 'monthlyFee' },
        { label: 'Cashback Rate', key: 'cashback' },
        { label: 'Rewards Rate', key: 'rewardsRate' },
        { label: 'ATM Withdrawal Limit', key: 'atmWithdrawal' },
        { label: 'Transfer Limit', key: 'transferLimit' },
        { label: 'Online Purchase Limit', key: 'onlinePurchase' },
        { label: 'Foreign Transaction Fee', key: 'foreignTxFee' },
        { label: 'Airport Lounge Access', key: 'loungeAccess', isBoolean: true },
        { label: 'Travel Insurance', key: 'travelInsurance', isBoolean: true },
        { label: 'Concierge Service', key: 'concierge', isBoolean: true },
        { label: 'Virtual Cards', key: 'virtualCards' },
        { label: 'Card Replacement', key: 'cardReplacement' },
    ];

    const rewardCategories = [
        { icon: Plane, label: 'Travel', rate: '3x', color: 'bg-brand-primary' },
        { icon: Coffee, label: 'Dining', rate: '3x', color: 'bg-brand-primary' },
        { icon: ShoppingBag, label: 'Shopping', rate: '2x', color: 'bg-brand-secondary' },
        { icon: Zap, label: 'Everything Else', rate: '1x', color: 'bg-slate-500' },
    ];

    const features = [
        {
            title: 'Instant Rewards',
            description: 'Earn cashback on every purchase. Redeem instantly or save for bigger rewards.',
            icon: Gift,
            bgColor: 'bg-rose-50',
            iconColor: 'text-rose-600'
        },
        {
            title: 'Tap to Pay',
            description: 'Contactless payments at millions of locations worldwide. Fast, secure, convenient.',
            icon: Zap,
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600'
        },
        {
            title: 'Zero Liability',
            description: "You're never responsible for unauthorized purchases. Shop with confidence.",
            icon: ShieldCheck,
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600'
        },
        {
            title: 'Virtual Cards',
            description: 'Generate unlimited virtual card numbers for secure online shopping.',
            icon: CreditCard,
            bgColor: 'bg-violet-50',
            iconColor: 'text-violet-600'
        },
        {
            title: 'Global Acceptance',
            description: 'Accepted at 40+ million locations in 200+ countries and territories.',
            icon: Globe,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Card Controls',
            description: 'Lock/unlock your card, set spending limits, and get instant alerts from the app.',
            icon: Smartphone,
            bgColor: 'bg-slate-100',
            iconColor: 'text-slate-700'
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-20 right-20 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 10, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-20 left-10 w-72 h-72 bg-brand-secondary/20 rounded-full blur-3xl"
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold mb-6 border border-white/20">
                                <CreditCard className="w-4 h-4" />
                                Premium Cards
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                                Cards That
                                <span className="block bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                                    Reward You
                                </span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                                From everyday spending to premium travel, find the perfect card for your lifestyle. Earn rewards on everything.
                            </p>

                            {/* Rewards Preview */}
                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {rewardCategories.map((cat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/10 backdrop-blur rounded-xl p-3 text-center"
                                    >
                                        <div className={`w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                            <cat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-white font-bold">{cat.rate}</div>
                                        <div className="text-slate-400 text-xs">{cat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div>
                                <Link href="/register">
                                    <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white shadow-xl shadow-brand-primary/25 h-14 px-8 text-base rounded-xl">
                                        Apply Now
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Hero Visual - Stacked Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative h-[400px] hidden lg:block"
                        >
                            {/* Card Stack */}
                            {[
                                { rotate: -15, color: 'from-slate-800 via-slate-900 to-black', z: 10, y: 0, name: 'Gold Card Master' },
                                { rotate: 0, color: 'from-red-700 via-red-600 to-red-500', z: 20, y: -20, name: 'Visa Infinite' },
                                { rotate: 15, color: 'from-amber-400 via-yellow-500 to-amber-600', z: 30, y: -40, name: 'Platinum Elite' },
                            ].map((card, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute left-1/2 top-1/2 w-80 h-48 rounded-2xl p-6 shadow-2xl backdrop-blur-md border border-white/10 overflow-hidden`}
                                    style={{
                                        zIndex: card.z,
                                        background: i === 1
                                            ? 'linear-gradient(110deg, #1a0505 0%, #7f1d1d 40%, #ef4444 100%)' // Custom Red/Black gradient for Visa
                                            : `linear-gradient(135deg, ${i === 2 ? '#fbbf24, #d97706' : '#1e293b, #0f172a'})`
                                    }}
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{
                                        opacity: 1,
                                        y: card.y,
                                        x: '-50%',
                                        rotate: card.rotate
                                    }}
                                    transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                                    whileHover={{ y: card.y - 20, scale: 1.05 }}
                                >
                                    {/* Noise Texture Overlay */}
                                    <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                                    {/* Globe Watermark for Visa Card */}
                                    {i === 1 && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-20 pointer-events-none">
                                            <Globe className="w-full h-full text-white" strokeWidth={0.5} />
                                        </div>
                                    )}

                                    {/* Glass Shine */}
                                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

                                    <div className="relative z-10 flex justify-between items-start mb-8">
                                        <div className="w-12 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md shadow-sm flex items-center justify-center">
                                            <div className="w-8 h-5 border border-black/10 rounded-[2px]" />
                                        </div>
                                        <div className="text-white/90 text-sm font-bold tracking-wider italic">
                                            {i === 1 ? 'VISA' : 'MasterCard'}
                                        </div>
                                    </div>
                                    <div className="relative z-10 text-white text-lg tracking-[0.15em] font-mono mb-6 drop-shadow-md">
                                        •••• •••• •••• {4589 + i * 1111}
                                    </div>
                                    <div className="relative z-10 flex justify-between text-white/90 font-mono text-xs">
                                        <div>
                                            <div className="text-[10px] opacity-70 mb-1">CARDHOLDER</div>
                                            <div className="tracking-wider">ALEX MORGAN</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] opacity-70 mb-1">EXPIRES</div>
                                            <div className="tracking-wider">12/28</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Floating Badge */}
                            <motion.div
                                className="absolute top-10 right-10 bg-white rounded-2xl shadow-xl p-4 z-40"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">Cashback Earned</div>
                                        <div className="text-xs text-slate-500">+$24.50 this month</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div >
            </section >

            {/* Cards Comparison Section */}
            < section id="cards" className="py-24 bg-slate-50" >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Choose Your Card</h2>
                            <p className="text-xl text-slate-600">
                                From no-fee basics to premium rewards, we have the perfect card for you.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {cardTypes.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-white rounded-3xl overflow-hidden border-2 ${card.popular ? 'border-brand-primary shadow-xl shadow-brand-primary/20' : 'border-slate-100'
                                    }`}
                            >
                                {card.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-brand-gradient text-white text-center py-2 text-sm font-semibold">
                                        Most Popular
                                    </div>
                                )}
                                <div className={`p-8 ${card.popular ? 'pt-14' : ''}`}>
                                    {/* Card Preview */}
                                    <div className={`rounded-xl p-5 mb-6 aspect-[1.6/1] relative overflow-hidden shadow-lg`}
                                        style={{
                                            background: index === 1
                                                ? 'linear-gradient(110deg, #1a0505 0%, #7f1d1d 40%, #ef4444 100%)'
                                                : `linear-gradient(135deg, ${index === 2 ? '#fbbf24, #d97706' : '#1e293b, #0f172a'})`
                                        }}
                                    >
                                        {/* Noise Texture Overlay */}
                                        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                                        {/* Globe Watermark for Visa Card */}
                                        {index === 1 && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-20 pointer-events-none">
                                                <Globe className="w-full h-full text-white" strokeWidth={0.5} />
                                            </div>
                                        )}

                                        {/* Glass Shine */}
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>

                                        <div className="relative h-full flex flex-col justify-between z-10">
                                            <div className="flex justify-between items-start">
                                                <div className="w-10 h-7 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded shadow-sm flex items-center justify-center border border-yellow-600/30">
                                                    <div className="grid grid-cols-2 gap-0.5 w-6">
                                                        <div className="h-3 border border-black/10 rounded-[1px]"></div>
                                                        <div className="h-3 border border-black/10 rounded-[1px]"></div>
                                                    </div>
                                                </div>
                                                <span className="text-white/90 text-xs font-bold tracking-wider italic">{index === 1 ? 'VISA' : 'MasterCard'}</span>
                                            </div>
                                            <div>
                                                <div className="text-white/90 font-mono text-sm tracking-widest mb-2">•••• {4589 + index * 1111}</div>
                                                <div className="flex justify-between items-end">
                                                    <div className="text-white font-semibold text-sm">{card.name}</div>
                                                    <div className="text-white/70 text-[10px] font-mono">12/28</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Details */}
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-slate-900">{card.name}</h3>
                                        <p className="text-slate-500">{card.type} Card</p>
                                    </div>

                                    <div className="flex justify-center gap-8 mb-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-brand-primary">{card.cashback}</div>
                                            <div className="text-slate-500 text-sm">Cashback</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-slate-900">{card.annualFee}</div>
                                            <div className="text-slate-500 text-sm">Annual Fee</div>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {card.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-600">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/register" className="block">
                                        <Button
                                            size="lg"
                                            className={`w-full h-12 rounded-xl ${card.popular
                                                ? 'bg-brand-gradient text-white'
                                                : 'bg-slate-900 text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            Apply Now
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Detailed Comparison Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20"
                    >
                        <div className="text-center mb-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Detailed Comparison</h3>
                            <p className="text-slate-600">Compare all features side by side</p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-6xl mx-auto">
                            {/* Table Header */}
                            <div className="grid grid-cols-4 bg-slate-900 text-white">
                                <div className="p-5 font-semibold text-slate-300">Feature</div>
                                {cardTypes.map((card, index) => (
                                    <div
                                        key={index}
                                        className={`p-5 font-semibold text-center ${card.popular ? 'bg-gradient-to-r from-brand-primary to-brand-secondary' : ''
                                            }`}
                                    >
                                        <div className="text-sm opacity-80">{card.type}</div>
                                        <div>{card.name}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Table Body */}
                            {comparisonSpecs.map((spec, rowIndex) => (
                                <div
                                    key={spec.key}
                                    className={`grid grid-cols-4 ${rowIndex % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border-t border-slate-100`}
                                >
                                    <div className="p-4 font-medium text-slate-700 flex items-center">
                                        {spec.label}
                                    </div>
                                    {cardTypes.map((card, cardIndex) => {
                                        const value = card[spec.key as keyof typeof card];
                                        return (
                                            <div
                                                key={cardIndex}
                                                className={`p-4 text-center flex items-center justify-center ${card.popular ? 'bg-brand-primary/5' : ''
                                                    }`}
                                            >
                                                {spec.isBoolean ? (
                                                    value ? (
                                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-green-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                            <X className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className={`font-semibold ${spec.key === 'cashback' || spec.key === 'rewardsRate'
                                                        ? 'text-brand-primary'
                                                        : 'text-slate-900'
                                                        }`}>
                                                        {String(value)}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            {/* Apply Row */}
                            <div className="grid grid-cols-4 bg-slate-100 border-t border-slate-200">
                                <div className="p-5"></div>
                                {cardTypes.map((card, index) => (
                                    <div key={index} className="p-5 text-center">
                                        <Link href="/register">
                                            <Button
                                                size="sm"
                                                className={`px-6 ${card.popular
                                                    ? 'bg-brand-gradient text-white'
                                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                                    }`}
                                            >
                                                Apply Now
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* Features Section */}
            < section className="py-24 bg-white" >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Every Card, Loaded With Benefits</h2>
                            <p className="text-xl text-slate-600">
                                All our cards come with powerful features to make your life easier.
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
            </section >

            {/* Security Section */}
            < section className="py-24 bg-slate-900 relative overflow-hidden" >
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Security You Can
                                <span className="text-brand-secondary"> Trust</span>
                            </h2>
                            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                                Every transaction is protected by multiple layers of security. Shop online and in-store with complete peace of mind.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Real-time fraud monitoring',
                                    'Instant card lock from your phone',
                                    'Zero liability for unauthorized purchases',
                                    'Biometric authentication',
                                    'Encrypted virtual card numbers'
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        className="flex items-center gap-3 text-slate-300"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <div className="w-6 h-6 bg-brand-primary/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-brand-secondary" />
                                        </div>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                <div className="w-64 h-64 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full flex items-center justify-center">
                                    <div className="w-48 h-48 bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30 rounded-full flex items-center justify-center">
                                        <div className="w-32 h-32 bg-brand-gradient rounded-full flex items-center justify-center">
                                            <Lock className="w-16 h-16 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg"
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <ShieldCheck className="w-8 h-8 text-brand-primary" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden" >
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
                        <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Earning?
                        </h2>
                        <p className="text-xl text-white/80 mb-10">
                            Apply in minutes. Get instant approval. Start earning rewards today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl h-14 px-10 text-base rounded-xl font-semibold">
                                    Apply Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="#cards">
                                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:text-white h-14 px-10 text-base rounded-xl">
                                    Compare Cards
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section >

            <Footer />
        </div >
    );
}

