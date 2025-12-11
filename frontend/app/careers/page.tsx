'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    Briefcase,
    Users,
    Heart,
    TrendingUp,
    GraduationCap,
    Award,
    CheckCircle,
    Clock,
    DollarSign,
    Shield,
    Sparkles,
    Lightbulb,
    Target,
    Globe,
    Send,
    FileText,
    UserCheck,
    MessageSquare,
    BadgeCheck,
    Handshake,
    Laptop,
    HeartHandshake,
    Building2,
    Code,
    Lock,
    Phone,
    BarChart3,
    Megaphone,
    Rocket,
    Star
} from 'lucide-react';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSettings } from '@/contexts/SettingsContext';

export default function CareersPage() {
    const { settings } = useSettings();
    const siteName = settings?.general?.siteName || 'RDN Bank';

    // Why Work With Us
    const whyWorkWithUs = [
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Empowering Your Growth',
            description: 'We invest in our people. From professional training to leadership development, you\'ll gain opportunities that help you advance faster in your career.',
            gradient: 'from-emerald-500 to-teal-600'
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: 'Driven by Innovation',
            description: 'Work with cutting-edge fintech tools, banking technology, digital payments infrastructure, cybersecurity systems, and cloud-based environments.',
            gradient: 'from-amber-500 to-orange-600'
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: 'A Culture of Excellence',
            description: 'We encourage creativity, collaboration, and continuous improvement. Every team member contributes to shaping smarter financial solutions.',
            gradient: 'from-violet-500 to-purple-600'
        }
    ];

    // Life at Bank
    const lifeAtBank = [
        {
            icon: <Users className="w-10 h-10" />,
            title: 'Collaborative Environment',
            description: 'We maintain a culture of teamwork, trust, and open communication. Cross-functional teams work together to solve real challenges.'
        },
        {
            icon: <Laptop className="w-10 h-10" />,
            title: 'Flexible & Modern Work Culture',
            description: 'We understand work-life balance. Employees enjoy flexible schedules, hybrid work opportunities, and a supportive environment.'
        },
        {
            icon: <HeartHandshake className="w-10 h-10" />,
            title: 'Inclusive & Diverse Workplace',
            description: 'We welcome people from all backgrounds and ensure equal opportunity, respect, and belonging for everyone.'
        }
    ];

    // Benefits
    const benefits = [
        { icon: <DollarSign className="w-5 h-5" />, text: 'Competitive salary and performance incentives' },
        { icon: <Laptop className="w-5 h-5" />, text: 'Flexible work arrangements' },
        { icon: <Shield className="w-5 h-5" />, text: 'Health insurance & wellness support' },
        { icon: <Clock className="w-5 h-5" />, text: 'Annual leave, public holidays & paid time-off' },
        { icon: <TrendingUp className="w-5 h-5" />, text: 'Retirement savings & financial assistance programs' },
        { icon: <GraduationCap className="w-5 h-5" />, text: 'Sponsored certifications and skill development' },
        { icon: <Sparkles className="w-5 h-5" />, text: 'Access to modern fintech tools & industry events' }
    ];

    // Hiring Process
    const hiringProcess = [
        {
            step: 1,
            title: 'Submit Your Application',
            description: 'Send us your CV or join our talent pool for future opportunities.',
            icon: <Send className="w-6 h-6" />
        },
        {
            step: 2,
            title: 'HR Review',
            description: 'We evaluate applications based on qualifications, potential, and cultural fit.',
            icon: <FileText className="w-6 h-6" />
        },
        {
            step: 3,
            title: 'Interviews',
            description: 'Depending on the role, interviews may include technical, behavioral, or managerial assessments.',
            icon: <MessageSquare className="w-6 h-6" />
        },
        {
            step: 4,
            title: 'Decision & Offer',
            description: 'Successful applicants receive an official offer and onboarding instructions.',
            icon: <BadgeCheck className="w-6 h-6" />
        },
        {
            step: 5,
            title: 'Welcome to the Team',
            description: `New hires undergo structured orientation to integrate smoothly into ${siteName}.`,
            icon: <Handshake className="w-6 h-6" />
        }
    ];

    // Talent Network Categories
    const talentCategories = [
        { icon: <Code className="w-5 h-5" />, text: 'Technology & Software Development' },
        { icon: <Lock className="w-5 h-5" />, text: 'Cybersecurity & Compliance' },
        { icon: <Building2 className="w-5 h-5" />, text: 'Banking Operations' },
        { icon: <Phone className="w-5 h-5" />, text: 'Customer Service' },
        { icon: <BarChart3 className="w-5 h-5" />, text: 'Business & Finance' },
        { icon: <Megaphone className="w-5 h-5" />, text: 'Marketing & Corporate Communications' },
        { icon: <Rocket className="w-5 h-5" />, text: 'Product & Innovation' }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section - Enhanced */}
            <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary text-white overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-white/5 to-transparent rounded-full" />
                </div>

                <div className="container mx-auto px-6 relative z-10 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-center max-w-5xl mx-auto"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/20"
                        >
                            <Star className="w-4 h-4 text-yellow-300" />
                            <span className="text-sm font-medium">Join Our Award-Winning Team</span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                            Shape the Future of
                            <br />
                            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                                Digital Banking
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-12">
                            At {siteName}, we are redefining finance through innovation, security, and human-centered
                            digital experiences. We're always looking for passionate, talented individuals who want to
                            build meaningful careers in a world where technology meets financial excellence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    className="bg-white text-brand-primary hover:bg-white/95 text-lg px-10 py-7 rounded-2xl shadow-xl shadow-black/20 font-semibold transition-all hover:scale-105"
                                >
                                    <Send className="w-5 h-5 mr-3" />
                                    Submit Your CV
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    className="bg-white/15 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/25 text-lg px-10 py-7 rounded-2xl font-semibold transition-all hover:scale-105"
                                >
                                    <Users className="w-5 h-5 mr-3" />
                                    Join Talent Network
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Who We Are - Enhanced */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <span className="inline-block text-brand-primary font-semibold text-sm uppercase tracking-wider mb-4">About Us</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                                Who We Are
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                {siteName} is a next-generation financial institution powered by innovation, integrity,
                                and a commitment to helping individuals and businesses thrive. Our people make this
                                possible—and we're committed to building a workplace where they can grow, lead, and excel.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Work With Us - Enhanced with colored gradients */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-brand-primary font-semibold text-sm uppercase tracking-wider mb-4">Benefits</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Why Work With Us?
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {whyWorkWithUs.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Life at Bank - Enhanced */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-brand-primary font-semibold text-sm uppercase tracking-wider mb-4">Culture</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Life at {siteName}
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                        {lifeAtBank.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto mb-6 group-hover:scale-110 transition-transform border-2 border-brand-primary/10">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Employee Benefits - Enhanced */}
            <section className="py-24 bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-white/70 font-semibold text-sm uppercase tracking-wider mb-4">Perks</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Our Commitment to You
                        </h2>
                        <p className="text-xl text-white/80">
                            Employee Benefits
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-5 border border-white/10 hover:bg-white/15 transition-colors"
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    {benefit.icon}
                                </div>
                                <span className="text-white font-medium">{benefit.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Hiring Process - Enhanced */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block text-brand-primary font-semibold text-sm uppercase tracking-wider mb-4">Process</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Our Hiring Process
                        </h2>
                        <p className="text-xl text-gray-600">
                            We maintain a transparent, professional, and fair recruitment process
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        {hiringProcess.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-6 mb-6 last:mb-0"
                            >
                                {/* Step Number */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {step.step}
                                    </div>
                                    {index < hiringProcess.length - 1 && (
                                        <div className="w-1 h-10 bg-gradient-to-b from-brand-primary/30 to-transparent mx-auto mt-3 rounded-full" />
                                    )}
                                </div>
                                {/* Content */}
                                <div className="bg-gray-50 rounded-2xl p-6 flex-grow hover:shadow-lg transition-shadow border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="text-brand-primary">{step.icon}</div>
                                        <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                                    </div>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Internship & Graduate Programs - Enhanced */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2rem] p-10 lg:p-16 shadow-2xl border border-gray-100 max-w-5xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Internship & Graduate Programs
                            </h2>
                            <p className="text-xl text-gray-600">
                                We nurture future leaders through:
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                            {[
                                'Graduate Trainee Programs',
                                'Internship Opportunities',
                                'Mentorship & hands-on banking experience',
                                'Career-building workshops',
                                'Fast-track employment opportunities'
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-3 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-xl px-5 py-4 border border-brand-primary/10"
                                >
                                    <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white text-lg px-10 py-7 rounded-2xl shadow-xl font-semibold transition-all hover:scale-105"
                                >
                                    <GraduationCap className="w-5 h-5 mr-3" />
                                    Apply for Internship
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Join Our Talent Network - Enhanced */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-14"
                        >
                            <span className="inline-block text-brand-primary font-semibold text-sm uppercase tracking-wider mb-4">Opportunities</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Join Our Talent Network
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Even if you don't see an available role today, you can still be part of our talent pipeline.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-50 rounded-[2rem] p-8 lg:p-12 border border-gray-100"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">
                                We welcome professionals in:
                            </h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                                {talentCategories.map((category, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-11 h-11 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-lg flex items-center justify-center text-brand-primary flex-shrink-0">
                                            {category.icon}
                                        </div>
                                        <span className="text-gray-700 font-medium">{category.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-center">
                                <Link href="/contact">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white text-lg px-10 py-7 rounded-2xl shadow-xl font-semibold transition-all hover:scale-105"
                                    >
                                        <Users className="w-5 h-5 mr-3" />
                                        Join Talent Network
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA - Enhanced */}
            <section className="py-24 bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                            Your Future in Modern Banking Starts Here
                        </h2>
                        <p className="text-xl text-white/85 mb-12 leading-relaxed">
                            Be part of a team committed to excellence, innovation, and financial empowerment.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    className="bg-white text-brand-primary hover:bg-white/95 text-lg px-10 py-7 rounded-2xl shadow-xl shadow-black/20 font-semibold transition-all hover:scale-105"
                                >
                                    <Send className="w-5 h-5 mr-3" />
                                    Submit Your CV
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    className="bg-white/15 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/25 text-lg px-10 py-7 rounded-2xl font-semibold transition-all hover:scale-105"
                                >
                                    <Users className="w-5 h-5 mr-3" />
                                    Join Talent Network
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

