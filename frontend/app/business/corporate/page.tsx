'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import {
    Building2,
    Shield,
    CreditCard,
    BarChart3,
    Users,
    Globe,
    Zap,
    Lock,
    FileText,
    CheckCircle2,
    ArrowRight,
    Briefcase,
    GraduationCap,
    Heart,
    Store,
    TrendingUp,
    Phone,
    Sparkles,
    Award,
    DollarSign,
    Clock,
    ArrowUpRight
} from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';

export default function CorporateAccountsPage() {
    const { settings } = useSettings();
    const { branding } = useBranding();
    const siteName = settings?.general?.siteName || branding.name || 'RDN Bank';

    const stats = [
        { value: '5,000+', label: 'Corporate Clients', icon: <Building2 className="w-6 h-6" /> },
        { value: '₦1T+', label: 'Managed Annually', icon: <DollarSign className="w-6 h-6" /> },
        { value: '24/7', label: 'Dedicated Support', icon: <Clock className="w-6 h-6" /> },
        { value: '99.9%', label: 'Uptime Guarantee', icon: <Zap className="w-6 h-6" /> }
    ];

    const benefits = [
        {
            icon: <Zap className="w-7 h-7" />,
            title: 'Instant Business Payments',
            description: 'Real-time settlement capabilities for faster payouts and collections',
            gradient: 'from-blue-600 to-cyan-500'
        },
        {
            icon: <Shield className="w-7 h-7" />,
            title: 'Enterprise Security',
            description: 'Advanced fraud monitoring with multi-factor authentication',
            gradient: 'from-purple-600 to-pink-500'
        },
        {
            icon: <CreditCard className="w-7 h-7" />,
            title: 'Smart Spend Controls',
            description: 'Team cards with customizable limits and spending categories',
            gradient: 'from-emerald-600 to-teal-500'
        },
        {
            icon: <BarChart3 className="w-7 h-7" />,
            title: 'Real-Time Analytics',
            description: 'Comprehensive dashboards and financial reporting tools',
            gradient: 'from-orange-600 to-red-500'
        }
    ];

    const features = [
        { icon: <Users className="w-6 h-6" />, title: 'Dedicated Account Manager', description: 'Personal relationship manager for your business' },
        { icon: <CreditCard className="w-6 h-6" />, title: 'Corporate Debit Cards', description: 'Multiple cards with individual controls' },
        { icon: <FileText className="w-6 h-6" />, title: 'Bulk Payments & Payroll', description: 'Process thousands of payments at once' },
        { icon: <Globe className="w-6 h-6" />, title: 'International Transfers', description: 'Send money globally with competitive rates' },
        { icon: <Zap className="w-6 h-6" />, title: 'API Integrations', description: 'Connect with your ERP and accounting systems' },
        { icon: <Lock className="w-6 h-6" />, title: '24/7 Digital Banking', description: 'Access your account anytime, anywhere' },
        { icon: <TrendingUp className="w-6 h-6" />, title: 'Credit Facilities', description: 'Pre-approved loans and overdraft access' },
        { icon: <FileText className="w-6 h-6" />, title: 'Audit Trails', description: 'Complete transaction history and alerts' }
    ];

    const categories = [
        { icon: <Store className="w-7 h-7" />, title: 'SMEs', description: 'Small and medium enterprises', gradient: 'from-blue-600 to-cyan-500' },
        { icon: <Briefcase className="w-7 h-7" />, title: 'Startups', description: 'Fast-growing tech companies', gradient: 'from-purple-600 to-pink-500' },
        { icon: <GraduationCap className="w-7 h-7" />, title: 'Schools', description: 'Educational institutions', gradient: 'from-emerald-600 to-teal-500' },
        { icon: <Heart className="w-7 h-7" />, title: 'NGOs', description: 'Non-profit organizations', gradient: 'from-red-600 to-orange-500' },
        { icon: <Users className="w-7 h-7" />, title: 'Cooperatives', description: 'Member-owned businesses', gradient: 'from-indigo-600 to-blue-500' },
        { icon: <Building2 className="w-7 h-7" />, title: 'Corporations', description: 'Enterprise organizations', gradient: 'from-slate-700 to-slate-900' }
    ];

    const requirements = [
        'Certificate of Incorporation',
        'Business Registration Documents',
        'Directors/Signatories IDs',
        'Utility Bill (Business Address)',
        'TIN Number',
        'Board Resolution'
    ];

    const steps = [
        { number: '01', title: 'Apply Online', description: 'Complete our simple application' },
        { number: '02', title: 'Upload Docs', description: 'Submit required documents' },
        { number: '03', title: 'Verification', description: 'Quick review process' },
        { number: '04', title: 'Activation', description: 'Get your credentials' },
        { number: '05', title: 'Start Banking', description: 'Manage your finances' }
    ];

    const testimonials = [
        {
            quote: "Switching to this corporate account was the best decision for our business. The real-time analytics have transformed how we manage cash flow.",
            author: "Adaora Okonkwo",
            position: "CFO, TechVentures Ltd",
            avatar: "AO"
        },
        {
            quote: "The dedicated account manager understands our business needs. The bulk payment feature saves us hours every month on payroll.",
            author: "Emeka Nnamdi",
            position: "Finance Director, GlobalTrade Inc",
            avatar: "EN"
        },
        {
            quote: "Outstanding service and security. The API integration with our ERP system has streamlined our entire financial workflow.",
            author: "Chisom Eze",
            position: "CEO, InnovateCorp",
            avatar: "CE"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Animated Gradient Background */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            'linear-gradient(0deg, #8B0000, #DC143C, #8B0000)',
                            'linear-gradient(180deg, #8B0000, #DC143C, #8B0000)',
                            'linear-gradient(360deg, #8B0000, #DC143C, #8B0000)'
                        ]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        background: 'linear-gradient(180deg, #8B0000, #DC143C, #8B0000)'
                    }}
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                {/* Animated orbs */}
                <motion.div
                    className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/30"
                        >
                            <Sparkles className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">Corporate Solutions</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                            Corporate{' '}
                            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                                Accounts
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
                            Build Bigger. Move Faster. Bank Smarter.
                        </p>
                        <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
                            Enterprise-grade banking designed to power your business at every stage of growth
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="h-14 px-8 bg-white text-brand-primary hover:bg-white/90 text-lg font-bold shadow-xl">
                                    Open Corporate Account
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" className="h-14 px-8 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 text-lg font-bold">
                                    <Phone className="mr-2 w-5 h-5" />
                                    Talk to Sales
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                                <div className="text-white/80 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-sm font-bold text-brand-primary mb-6">
                            ✨ Key Benefits
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Why Choose <span className="text-brand-primary">Our Corporate Account</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Enterprise-grade banking solutions designed for modern businesses
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-brand-primary/20 hover:shadow-2xl transition-all duration-500"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-2 bg-brand-secondary/10 rounded-full text-sm font-bold text-brand-secondary mb-6">
                            🚀 Features
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Everything Your Business <span className="text-brand-secondary">Needs</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Comprehensive banking features built for corporate excellence
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-slate-100 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Business Categories */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-sm font-bold text-brand-primary mb-6">
                            🏢 Industries We Serve
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Tailored Solutions for <span className="text-brand-primary">Every Sector</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Specialized banking for every type of organization
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 text-center"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{category.title}</h3>
                                <p className="text-slate-600">{category.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Open Account */}
            <section className="py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px]" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-bold text-white/80 mb-6">
                            📋 Simple Process
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Open Your Account in <span className="text-brand-primary">5 Steps</span>
                        </h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            Get started in minutes with our streamlined onboarding
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-5 gap-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative text-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <span className="text-2xl font-black text-white">{step.number}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-white/60">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Requirements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 max-w-4xl mx-auto"
                    >
                        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-6 text-center">Required Documents</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {requirements.map((requirement, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                                        </div>
                                        <span className="text-white/80">{requirement}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-sm font-bold text-brand-primary mb-6">
                            💬 Client Stories
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            Trusted by <span className="text-brand-primary">Leading Businesses</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            See what our corporate clients have to say
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-slate-700 leading-relaxed mb-6">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                    <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{testimonial.author}</p>
                                        <p className="text-sm text-slate-600">{testimonial.position}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                            Start Banking Like a Modern Corporation
                        </h2>
                        <p className="text-xl text-white/90 mb-10 leading-relaxed">
                            Join thousands of businesses that trust {siteName} with their financial operations
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="h-16 px-10 bg-white text-brand-primary hover:bg-white/90 text-lg font-bold shadow-2xl">
                                    <Briefcase className="w-5 h-5 mr-2" />
                                    Open Corporate Account
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" className="h-16 px-10 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 text-lg font-bold">
                                    Schedule Consultation
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

