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

            {/* Hero Section â€” The Opening Shot Blend */}
            <section className="relative min-h-[100dvh] w-full bg-[#0D0D12] overflow-hidden flex items-center pt-24 pb-16 md:pt-32 lg:pt-0">
                {/* Background Texture & Gradient */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2670&auto=format&fit=crop" 
                        alt="Raw Structural Concrete" 
                        className="w-full h-full object-cover grayscale opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14] via-[#0D0D12]/80 to-[#0D0D12]/50" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-left max-w-2xl"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#E8E4DD] font-mono text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                                <CreditCard className="w-3.5 h-3.5 text-[#E63B2E]" />
                                PROTOCOL_CARDS_ACTIVE
                            </div>
                            
                            <h1 className="leading-[0.9] tracking-tighter mb-8">
                                <span className="block font-space-grotesk font-black text-white text-5xl sm:text-7xl lg:text-8xl xl:text-9xl uppercase">
                                    Capital
                                </span>
                                <span className="block font-drama italic text-[#E63B2E] text-6xl sm:text-8xl lg:text-9xl xl:text-[10rem] mt-2 lowercase">
                                    Deployment.
                                </span>
                            </h1>
                            
                            <p className="font-space-mono text-white/60 text-sm md:text-base mb-10 leading-relaxed max-w-xl uppercase tracking-widest">
                                From daily logistics to global travel, engineer your spending with precision instruments. Maximize throughput on every transaction.
                            </p>

                            {/* Rewards Preview - Brutalist Grid */}
                            <div className="grid grid-cols-4 gap-3 mb-10">
                                {rewardCategories.map((cat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-[#1A1A1A] border border-white/10 rounded-xl p-3 text-center transition-colors hover:border-[#E63B2E]/50"
                                    >
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-[#0D0D12] text-white border border-white/5 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                                            <cat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
                                        </div>
                                        <div className="text-[#E8E4DD] font-space-grotesk font-black text-lg sm:text-xl leading-none mb-1">{cat.rate}</div>
                                        <div className="font-mono text-[#E8E4DD]/50 text-[9px] sm:text-[10px] uppercase tracking-wider">{cat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <Link href="/register">
                                    <button className="group relative px-10 py-5 bg-[#E63B2E] overflow-hidden rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-2xl w-full sm:w-auto">
                                        <span className="relative z-10 font-space-grotesk font-black text-white flex items-center justify-center gap-3 text-lg tracking-widest uppercase">
                                            INIT SEQUENCE
                                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                    </button>
                                </Link>
                                <Link href="#cards">
                                    <div className="px-8 py-5 bg-transparent border border-white/20 text-white font-space-grotesk font-black text-lg uppercase tracking-wider rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto">
                                        <span>Deploy Matrix</span>
                                    </div>
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
                                        â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ {4589 + i * 1111}
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

                            {/* Floating Badge (Brutalist Style) */}
                            <motion.div
                                className="absolute top-10 right-10 bg-[#1A1A1A] border border-[#E63B2E]/20 rounded-[2rem] shadow-2xl p-4 z-40 backdrop-blur-md"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#0D0D12] rounded-full flex items-center justify-center border border-white/5">
                                        <CheckCircle2 className="w-5 h-5 text-[#E63B2E]" />
                                    </div>
                                    <div>
                                        <div className="font-space-mono text-xs font-bold text-[#E8E4DD]/70 uppercase tracking-widest">Yield Detected</div>
                                        <div className="font-space-grotesk text-sm font-black text-[#E8E4DD]">+$24.50 CYCLE</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div >
            </section >

            {/* Cards Comparison Section -> Brutalist Pricing Tier */}
            <section id="cards" className="py-24 bg-[#F5F3EE]">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-space-grotesk font-black text-[#111111] uppercase tracking-tighter mb-4">Deployment Tiers</h2>
                            <p className="font-space-mono text-[#111111]/70 uppercase tracking-widest text-sm md:text-base">
                                Select your logistical access level. No soft limits.
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
                                className={`relative border-2 ${card.popular ? 'bg-[#E63B2E] border-[#E63B2E]' : 'bg-[#111111] border-[#111111]'} rounded-[2rem] overflow-hidden shadow-2xl group`}
                            >
                                {card.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-[#0D0D12] text-[#E8E4DD] text-center py-2 font-space-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                        OPTIMAL THROUGHPUT
                                    </div>
                                )}
                                <div className={`p-8 ${card.popular ? 'pt-14' : ''} flex flex-col h-full`}>
                                    {/* Card Details */}
                                    <div className="mb-8 border-b border-white/10 pb-8">
                                        <h3 className={`text-2xl font-space-grotesk font-black ${card.popular ? 'text-white' : 'text-[#E8E4DD]'} uppercase tracking-tight`}>{card.name}</h3>
                                        <p className={`font-space-mono text-xs mt-1 uppercase tracking-widest ${card.popular ? 'text-white/80' : 'text-[#E63B2E]'}`}>Protocol: {card.type}</p>
                                    </div>

                                    <div className="flex justify-between items-center gap-4 mb-8">
                                        <div>
                                            <div className="font-space-mono text-[10px] uppercase tracking-widest text-white/50 mb-1">Yield</div>
                                            <div className={`text-3xl font-space-grotesk font-black leading-none ${card.popular ? 'text-white' : 'text-[#E8E4DD]'}`}>{card.cashback}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-space-mono text-[10px] uppercase tracking-widest text-white/50 mb-1">Annual Protocol</div>
                                            <div className={`text-3xl font-space-grotesk font-black leading-none ${card.popular ? 'text-white' : 'text-[#E8E4DD]'}`}>{card.annualFee}</div>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-10 flex-grow">
                                        {card.features.map((feature, i) => (
                                            <li key={i} className={`flex items-start gap-3 font-space-mono text-xs uppercase tracking-wider ${card.popular ? 'text-white/90' : 'text-[#E8E4DD]/70'}`}>
                                                <div className={`w-4 h-4 mt-0.5 rounded-sm flex items-center justify-center shrink-0 ${card.popular ? 'bg-white text-[#E63B2E]' : 'bg-[#E63B2E] text-white'}`}>
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/register" className="block mt-auto">
                                        <button
                                            className={`w-full h-14 rounded-full font-space-grotesk font-black text-sm uppercase tracking-widest transition-all ${card.popular
                                                ? 'bg-[#0D0D12] text-white hover:bg-black'
                                                : 'bg-[#E8E4DD] text-[#111111] hover:bg-white'
                                                }`}
                                        >
                                            INITIATE
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Detailed Comparison Table -> Brutalist Data Matrix */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-24 max-w-6xl mx-auto overflow-x-auto"
                    >
                        <div className="mb-8 border-b border-[#111111]/20 pb-4 min-w-[800px]">
                            <h3 className="text-2xl md:text-3xl font-space-grotesk font-black text-[#111111] uppercase tracking-tighter">Protocol Data Matrix</h3>
                        </div>

                        <div className="border border-[#111111]/20 bg-white shadow-xl min-w-[800px]">
                            {/* Table Header */}
                            <div className="grid grid-cols-4 bg-[#111111] text-[#E8E4DD]">
                                <div className="p-4 md:p-6 font-space-mono text-xs md:text-sm font-bold uppercase tracking-widest opacity-60 flex items-center">Parameter</div>
                                {cardTypes.map((card, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 md:p-6 text-center border-l border-white/10 ${card.popular ? 'bg-[#E63B2E] text-white' : ''}`}
                                    >
                                        <div className="font-space-mono text-[10px] uppercase tracking-widest opacity-80 mb-1">{card.type}</div>
                                        <div className="font-space-grotesk font-black text-sm md:text-base uppercase tracking-tight">{card.name}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Table Body */}
                            {comparisonSpecs.map((spec, rowIndex) => (
                                <div
                                    key={spec.key}
                                    className={`grid grid-cols-4 ${rowIndex % 2 === 0 ? 'bg-[#F5F3EE]' : 'bg-white'} border-t border-[#111111]/10`}
                                >
                                    <div className="p-4 md:p-6 font-space-mono text-xs font-bold text-[#111111]/80 uppercase tracking-widest flex items-center pr-2">
                                        {spec.label}
                                    </div>
                                    {cardTypes.map((card, cardIndex) => {
                                        const value = card[spec.key as keyof typeof card];
                                        return (
                                            <div
                                                key={cardIndex}
                                                className={`p-4 md:p-6 text-center flex items-center justify-center border-l border-[#111111]/10 ${card.popular ? 'bg-[#E63B2E]/5' : ''}`}
                                            >
                                                {spec.isBoolean ? (
                                                    value ? (
                                                        <div className="w-5 h-5 bg-[#111111] flex items-center justify-center shrink-0">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 border border-[#111111]/20 flex items-center justify-center shrink-0">
                                                            <X className="w-4 h-4 text-[#111111]/20" />
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className={`font-space-mono text-xs md:text-sm uppercase tracking-wider ${spec.key === 'cashback' || spec.key === 'rewardsRate'
                                                        ? 'text-[#E63B2E] font-bold'
                                                        : 'text-[#111111]'
                                                        }`}>
                                                        {String(value)}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section -> Interactive Functional Artifacts */}
            <section className="py-24 bg-[#E8E4DD] border-t border-[#111111]/10 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-20 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-space-grotesk font-black text-[#111111] uppercase tracking-tighter mb-4">
                                Functional Artifacts
                            </h2>
                            <p className="font-space-mono text-[#111111]/70 uppercase tracking-widest text-sm md:text-base">
                                Protocol utilities loaded into every access tier.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1: Instant Rewards (Diagnostic Shuffler) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#F5F3EE] p-8 rounded-[2rem] border border-[#111111]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
                        >
                            <div className="h-48 relative mb-8 flex items-center justify-center">
                                {/* Shuffler Mechanism */}
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="absolute w-48 h-32 bg-white border border-[#111111]/10 rounded-xl shadow-lg flex flex-col justify-center items-center p-4"
                                        style={{
                                            transform: `scale(${1 - i * 0.05}) translateY(${i * 10}px)`,
                                            zIndex: 10 - i,
                                            animation: `diagnosticShuffle 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite`,
                                            animationDelay: `${i}s`
                                        }}
                                    >
                                        <Gift className="w-8 h-8 text-[#E63B2E] mb-2" />
                                        <div className="font-space-mono text-[10px] text-[#111111]/60 font-bold tracking-widest uppercase">Yield Logged</div>
                                    </div>
                                ))}
                            </div>
                            <h3 className="text-2xl font-space-grotesk font-black text-[#111111] mb-3 uppercase tracking-tight">Instant Rewards</h3>
                            <p className="font-space-mono text-[#111111]/70 text-sm leading-relaxed tracking-wider">Earn cashback on every transaction. Yield deployed directly to your balance.</p>
                        </motion.div>

                        {/* Card 2: Tap to Pay (Telemetry Typewriter) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#111111] p-8 rounded-[2rem] border border-[#111111]/20 shadow-2xl relative overflow-hidden group flex flex-col"
                        >
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63B2E] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E63B2E]"></span>
                                </span>
                                <span className="font-space-mono text-[10px] text-[#E63B2E] uppercase tracking-widest font-bold">Live Feed</span>
                            </div>
                            <div className="h-48 relative mb-8 flex items-end">
                                <div className="font-space-mono text-[#E8E4DD] text-sm overflow-hidden h-24 relative w-full font-bold uppercase tracking-wider">
                                    <div className="animate-[telemetryScroll_4s_linear_infinite] absolute bottom-0 w-full opacity-80 flex flex-col gap-2">
                                        <div className="flex justify-between items-center"><span className="text-[#E63B2E]">{'>'}</span> PROXIMITY_DETECT</div>
                                        <div className="flex justify-between items-center"><span className="text-[#E63B2E]">{'>'}</span> AUTH_HANDSHAKE: OK</div>
                                        <div className="flex justify-between items-center"><span className="text-[#E63B2E]">{'>'}</span> TX_COMPLETE 42ms</div>
                                        <div className="flex justify-between items-center"><span className="text-[#E63B2E]">{'>'}</span> TERMINAL_SYNC</div>
                                    </div>
                                    <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#111111] to-transparent pointer-events-none" />
                                </div>
                            </div>
                            <div className="mt-auto">
                                <h3 className="text-2xl font-space-grotesk font-black text-[#E8E4DD] mb-3 uppercase tracking-tight">Tap to Pay</h3>
                                <p className="font-space-mono text-[#E8E4DD]/60 text-sm leading-relaxed tracking-wider">Zero-contact transmission. Secure, instantaneous authorizations globally.</p>
                            </div>
                        </motion.div>

                        {/* Card 3: Zero Liability (Cursor Protocol Scheduler) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#F5F3EE] p-8 rounded-[2rem] border border-[#111111]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group"
                        >
                            <div className="h-48 relative mb-8 bg-white border border-[#111111]/5 rounded-xl p-4 overflow-hidden shadow-inner">
                                <div className="grid grid-cols-7 gap-1 h-3/4">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                        <div key={i} className="font-space-mono text-[8px] text-center text-[#111111]/40 mb-1">{day}</div>
                                    ))}
                                    {[...Array(21)].map((_, i) => (
                                        <div key={i} className={`rounded-sm border border-[#111111]/5 h-6 ${i === 12 ? 'bg-[#E63B2E]/20 border-[#E63B2E]/30 relative' : 'bg-[#F5F3EE]/50'}`}>
                                            {i === 12 && (
                                                <div className="absolute inset-0 m-auto w-1 h-1 bg-[#E63B2E] animate-ping rounded-full" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute w-4 h-4 text-[#111111] animate-[cursorProtocol_4s_ease-in-out_infinite]" style={{ top: '60%', left: '40%' }}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.41 0 .75-.34.75-.75V8.56c0-.41-.34-.75-.75-.75H6.25a.75.75 0 0 0-.75.75z" transform="rotate(-25 12 12)"/></svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-space-grotesk font-black text-[#111111] mb-3 uppercase tracking-tight">Zero Liability</h3>
                            <p className="font-space-mono text-[#111111]/70 text-sm leading-relaxed tracking-wider">Continuous threat isolation. You are shielded from any unauthorized anomalies.</p>
                        </motion.div>

                        {/* Card 4: Virtual Cards (Diagnostic Shuffler) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-[#111111] p-8 rounded-[2rem] border border-[#111111]/20 shadow-2xl relative overflow-hidden group flex flex-col"
                        >
                            <div className="h-48 relative mb-8 flex items-center justify-center">
                                {/* Shuffler Mechanism */}
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="absolute w-48 h-32 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-lg flex flex-col justify-center items-center p-4"
                                        style={{
                                            transform: `scale(${1 - i * 0.05}) translateY(${i * 10}px)`,
                                            zIndex: 10 - i,
                                            animation: `diagnosticShuffle 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite`,
                                            animationDelay: `${i * 1.5}s`
                                        }}
                                    >
                                        <div className="font-space-mono text-[9px] text-[#E8E4DD]/40 tracking-widest uppercase mb-4 self-start">UUID // {i * 4782}</div>
                                        <div className="font-space-mono text-sm text-[#E8E4DD] tracking-widest font-bold">•••• {4000 + i * 321}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto">
                                <h3 className="text-2xl font-space-grotesk font-black text-[#E8E4DD] mb-3 uppercase tracking-tight">Virtual Cards</h3>
                                <p className="font-space-mono text-[#E8E4DD]/60 text-sm leading-relaxed tracking-wider">Generate transient credentials for isolated surface area exposure online.</p>
                            </div>
                        </motion.div>

                        {/* Card 5: Global Acceptance (Telemetry Typewriter) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="bg-[#F5F3EE] p-8 rounded-[2rem] border border-[#111111]/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group flex flex-col"
                        >
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#111111] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#111111]"></span>
                                </span>
                                <span className="font-space-mono text-[10px] text-[#111111] uppercase tracking-widest font-bold">Grid Status</span>
                            </div>
                            <div className="h-48 relative mb-8 flex items-end">
                                <div className="font-space-mono text-[#111111] text-sm overflow-hidden h-24 relative w-full font-bold uppercase tracking-wider">
                                    <div className="animate-[telemetryScroll_5s_linear_infinite] absolute bottom-0 w-full opacity-80 flex flex-col gap-2">
                                        <div className="flex justify-between items-center"><span className="text-[#E63B2E]">{"//"}</span> NODE: TOKYO_01 <span className="text-xs">OK</span></div>
                                        <div className="flex justify-between items-center"><span className="text-[#E63B2E]">{"//"}</span> NODE: LDN_4X <span className="text-xs">OK</span></div>
                                        <div className="flex justify-between items-center"><span className="text-[#E63B2E]">{"//"}</span> NODE: NY_SYS <span className="text-xs">OK</span></div>
                                        <div className="flex justify-between items-center"><span className="text-[#E63B2E]">{"//"}</span> NODE: BER_90 <span className="text-xs">OK</span></div>
                                    </div>
                                    <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#F5F3EE] to-transparent pointer-events-none" />
                                </div>
                            </div>
                            <div className="mt-auto">
                                <h3 className="text-2xl font-space-grotesk font-black text-[#111111] mb-3 uppercase tracking-tight">Global Acceptance</h3>
                                <p className="font-space-mono text-[#111111]/70 text-sm leading-relaxed tracking-wider">Interoperable across 200+ regions. Seamless currency conversion algorithms.</p>
                            </div>
                        </motion.div>

                        {/* Card 6: Card Controls (Cursor Protocol Scheduler) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="bg-[#111111] p-8 rounded-[2rem] border border-[#111111]/20 shadow-2xl relative overflow-hidden group flex flex-col"
                        >
                            <div className="h-48 relative mb-8 bg-[#0D0D12] border border-white/5 rounded-xl p-4 overflow-hidden shadow-inner flex items-center justify-center">
                                <div className="space-y-4 w-full px-4">
                                    <div className="w-full h-8 bg-[#1A1A1A] rounded p-1 flex items-center justify-between">
                                        <div className="font-space-mono text-[9px] text-white/50 uppercase">Freeze Card</div>
                                        <div className="w-8 h-4 rounded-full bg-[#E63B2E] p-0.5 flex justify-end">
                                            <div className="w-3 h-3 bg-white rounded-full" />
                                        </div>
                                    </div>
                                    <div className="w-full h-8 bg-[#1A1A1A] rounded p-1 flex items-center justify-between">
                                        <div className="font-space-mono text-[9px] text-white/50 uppercase">Spend Limit</div>
                                        <div className="font-space-mono text-[10px] text-white">$5,000</div>
                                    </div>
                                </div>
                                <div className="absolute w-4 h-4 text-[#E8E4DD] animate-[cursorProtocol_3s_ease-in-out_infinite]" style={{ top: '30%', left: '80%' }}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.41 0 .75-.34.75-.75V8.56c0-.41-.34-.75-.75-.75H6.25a.75.75 0 0 0-.75.75z" transform="rotate(-25 12 12)"/></svg>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <h3 className="text-2xl font-space-grotesk font-black text-[#E8E4DD] mb-3 uppercase tracking-tight">Access Control</h3>
                                <p className="font-space-mono text-[#E8E4DD]/60 text-sm leading-relaxed tracking-wider">Instantly sever network connections. Full parametric control over limits.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Security Section -> Brutalist Protocol Layout */}
            <section className="py-24 bg-[#0A0A14] border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-space-grotesk font-black text-white uppercase tracking-tighter mb-6">
                                Security
                                <span className="block italic font-drama text-[#E63B2E] text-5xl md:text-7xl lowercase mt-1">Infrastructure.</span>
                            </h2>
                            <p className="font-space-mono text-white/60 text-sm md:text-base mb-10 leading-relaxed uppercase tracking-widest">
                                Your transactions route through encrypted military-grade tunnels. Constant threat mitigation.
                            </p>
                            <ul className="space-y-5">
                                {[
                                    'Real-time fraud monitoring (AI Matrix)',
                                    'Instant hardware lock from terminal',
                                    'Zero root liability for anomalies',
                                    'Biometric signature required',
                                    'Encrypted virtual tokens'
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        className="flex items-center gap-4 font-space-mono text-xs sm:text-sm uppercase tracking-wider text-[#E8E4DD]/80"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <div className="w-6 h-6 border border-[#E63B2E] bg-[#E63B2E]/10 flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 bg-[#E63B2E]" />
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
                            <div className="relative w-full max-w-md aspect-square bg-[#0D0D12] border border-white/10 p-8 flex flex-col justify-between shadow-2xl">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 border border-[#E63B2E] bg-[#E63B2E]/10 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-[#E63B2E]" />
                                    </div>
                                    <div className="font-space-mono text-[10px] text-white/40 uppercase tracking-widest">Sys_Secure</div>
                                </div>
                                
                                <div className="space-y-4 py-8">
                                    <div className="h-[1px] w-full bg-white/10 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full w-1/3 bg-[#E63B2E] animate-[telemetryScroll_2s_ease-in-out_infinite_alternate]" />
                                    </div>
                                    <div className="h-[1px] w-3/4 bg-white/10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 h-full w-1/4 bg-white animate-[telemetryScroll_3s_ease-in-out_infinite_alternate]" />
                                    </div>
                                </div>

                                <div>
                                    <div className="font-space-grotesk font-black tracking-tight text-white mb-1 uppercase">Defense Matrix Online</div>
                                    <div className="font-space-mono text-[10px] uppercase tracking-widest text-[#E63B2E]">No Threats Detected</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section -> Terminal Execution */}
            <section className="py-32 bg-[#0D0D12] relative overflow-hidden border-t border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h2 className="font-space-grotesk font-black text-white text-4xl sm:text-6xl md:text-8xl tracking-tighter uppercase mb-8">
                            Execute Protocol.
                        </h2>
                        <p className="font-space-mono text-white/50 text-sm md:text-base mb-12 uppercase tracking-widest">
                            Initiate your hardware deployment sequence. Immediate authorization.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link href="/register">
                                <button className="group relative px-12 py-6 bg-[#E63B2E] overflow-hidden rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-2xl w-full sm:w-auto">
                                    <span className="relative z-10 font-space-grotesk font-black text-white flex items-center justify-center gap-3 text-lg tracking-widest uppercase">
                                        INIT SEQUENCE
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                </button>
                            </Link>
                            <Link href="#cards">
                                <div className="px-12 py-6 bg-transparent border border-white/20 text-white font-space-grotesk font-black text-lg uppercase tracking-wider rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto">
                                    <span>Deploy Matrix</span>
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div >
    );
}
