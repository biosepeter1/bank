'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import {
    TrendingUp,
    DollarSign,
    Clock,
    CheckCircle2,
    ArrowRight,
    Calculator,
    FileText,
    Zap,
    Shield,
    Users,
    Building,
    Truck,
    Factory,
    Briefcase,
    Target,
    Award
} from 'lucide-react';

export default function SMELoansPage() {
    const [loanAmount, setLoanAmount] = useState('50000');
    const [loanTerm, setLoanTerm] = useState('12');
    const [interestRate] = useState(12); // 12% annual rate

    const calculateMonthlyPayment = () => {
        const principal = parseFloat(loanAmount) || 0;
        const months = parseInt(loanTerm) || 1;
        const monthlyRate = interestRate / 100 / 12;

        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);

        return isNaN(payment) ? 0 : payment;
    };

    const monthlyPayment = calculateMonthlyPayment();
    const totalPayment = monthlyPayment * parseInt(loanTerm);
    const totalInterest = totalPayment - parseFloat(loanAmount);

    const loanProducts = [
        {
            icon: TrendingUp,
            title: 'Working Capital Loan',
            rate: 'From 11.5% p.a.',
            amount: 'Up to ₦50M',
            term: '6-36 months',
            description: 'Flexible financing for daily operations, inventory, and short-term business needs',
            features: [
                'Quick approval within 48 hours',
                'No collateral up to ₦5M',
                'Flexible repayment options',
                'Revolving credit facility available'
            ]
        },
        {
            icon: Truck,
            title: 'Equipment Financing',
            rate: 'From 10.5% p.a.',
            amount: 'Up to ₦100M',
            term: '12-60 months',
            description: 'Finance machinery, vehicles, and equipment to grow your business capacity',
            features: [
                'Up to 90% equipment value',
                'Equipment serves as collateral',
                'Tax-efficient financing',
                'Maintenance packages available'
            ]
        },
        {
            icon: Building,
            title: 'Business Expansion Loan',
            rate: 'From 12% p.a.',
            amount: 'Up to ₦200M',
            term: '24-84 months',
            description: 'Long-term financing for business growth, new locations, or market expansion',
            features: [
                'Competitive fixed rates',
                'Grace period options',
                'Customized repayment plans',
                'Business advisory support'
            ]
        }
    ];

    const benefits = [
        {
            icon: Zap,
            title: 'Fast Approval',
            description: 'Get loan decisions within 24-48 hours with minimal documentation'
        },
        {
            icon: DollarSign,
            title: 'Competitive Rates',
            description: 'Industry-leading interest rates starting from 10.5% per annum'
        },
        {
            icon: Clock,
            title: 'Flexible Terms',
            description: 'Choose repayment periods from 6 to 84 months based on your cash flow'
        },
        {
            icon: Shield,
            title: 'No Hidden Fees',
            description: 'Transparent pricing with no processing fees or prepayment penalties'
        }
    ];

    const eligibility = [
        'Business registered for at least 12 months',
        'Minimum annual revenue of ₦5 million',
        'Good credit history and financial records',
        'Valid business bank account',
        'Collateral for loans above ₦5 million',
        'Clear business plan and financial projections'
    ];

    const documents = [
        'Certificate of Incorporation',
        'CAC Forms (2, 3, 7)',
        'Tax Identification Number (TIN)',
        'Last 12 months bank statements',
        'Financial statements (2 years)',
        'Business plan and projections',
        'Directors\' IDs and utility bills',
        'Collateral documents (if applicable)'
    ];

    const industries = [
        { icon: Factory, title: 'Manufacturing', description: 'Production and processing' },
        { icon: Truck, title: 'Logistics', description: 'Transportation and delivery' },
        { icon: Building, title: 'Real Estate', description: 'Property development' },
        { icon: Briefcase, title: 'Professional Services', description: 'Consulting and advisory' },
        { icon: Users, title: 'Hospitality', description: 'Hotels and restaurants' },
        { icon: Target, title: 'Retail', description: 'Shops and e-commerce' }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
                                <span className="text-brand-primary font-semibold text-sm">SME Financing Solutions</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                                Fuel Your Business Growth with
                                <span className="text-brand-primary"> Smart Financing</span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                Competitive rates, flexible terms, and fast approval. Get the capital you need to scale your business.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div id="loan-calculator" className="bg-white rounded-3xl shadow-2xl p-8">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Quick Loan Estimate</h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Loan Amount (₦)
                                        </label>
                                        <Input
                                            type="number"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(e.target.value)}
                                            className="h-12 text-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Loan Term (months)
                                        </label>
                                        <Input
                                            type="number"
                                            value={loanTerm}
                                            onChange={(e) => setLoanTerm(e.target.value)}
                                            className="h-12 text-lg"
                                        />
                                    </div>

                                    <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-xl p-6 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">Interest Rate</span>
                                            <span className="text-lg font-bold text-brand-primary">{interestRate}% p.a.</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">Monthly Payment</span>
                                            <span className="text-2xl font-bold text-slate-900">
                                                ₦{monthlyPayment.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">Total Interest</span>
                                            <span className="font-semibold text-slate-700">
                                                ₦{totalInterest.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                    </div>

                                    <Link href="/register" className="block">
                                        <Button className="w-full h-12 bg-brand-gradient text-white">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Why Choose Our SME Loans
                        </h2>
                        <p className="text-xl text-slate-600">
                            Designed specifically for small and medium enterprises
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center mx-auto mb-4">
                                    <benefit.icon className="w-8 h-8 text-brand-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                                <p className="text-slate-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Loan Products */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Our Loan Products
                        </h2>
                        <p className="text-xl text-slate-600">
                            Tailored financing solutions for every business need
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {loanProducts.map((product, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center mb-6">
                                    <product.icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{product.title}</h3>
                                <p className="text-slate-600 mb-6">{product.description}</p>

                                <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Interest Rate</span>
                                        <span className="font-bold text-brand-primary">{product.rate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Loan Amount</span>
                                        <span className="font-bold text-slate-900">{product.amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Tenure</span>
                                        <span className="font-bold text-slate-900">{product.term}</span>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {product.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-slate-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/register">
                                    <Button className="w-full bg-brand-gradient text-white">
                                        Apply Now
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industries We Serve */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Industries We Serve
                        </h2>
                        <p className="text-xl text-slate-600">
                            Specialized financing across diverse sectors
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {industries.map((industry, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-100 hover:border-brand-primary/20 hover:shadow-lg transition-all duration-300"
                            >
                                <industry.icon className="w-10 h-10 text-brand-primary mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{industry.title}</h3>
                                <p className="text-sm text-slate-600">{industry.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Eligibility & Documents */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Eligibility Criteria</h2>
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <ul className="space-y-4">
                                    {eligibility.map((item, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                                            </div>
                                            <span className="text-slate-700">{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Required Documents</h2>
                            <div className="bg-white rounded-2xl p-8 shadow-lg">
                                <ul className="space-y-4">
                                    {documents.map((doc, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-start gap-3"
                                        >
                                            <FileText className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">{doc}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
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
                        className="text-center max-w-4xl mx-auto"
                    >
                        <Award className="w-16 h-16 text-brand-secondary mx-auto mb-6" />
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Ready to Grow Your Business?
                        </h2>
                        <p className="text-xl text-white/80 mb-10">
                            Apply now and get a loan decision within 48 hours
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl h-14 px-10 text-base rounded-xl font-semibold">
                                    Apply for a Loan
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:text-white h-14 px-10 text-base rounded-xl">
                                <Calculator className="mr-2 w-5 h-5" />
                                Speak to a Loan Officer
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

