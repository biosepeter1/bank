'use client';

import { motion } from 'framer-motion';
import {
    Briefcase,
    Globe,
    PiggyBank,
    CreditCard,
    LineChart,
    GraduationCap,
} from 'lucide-react';

const products = [
    {
        icon: <CreditCard size={28} />,
        title: "Virtual Cards",
        description: "Create unlimited virtual cards for safe online shopping with zero FX fees.",
        pattern: "💳"
    },
    {
        icon: <Globe size={28} />,
        title: "Global Transfers",
        description: "Send money to 150+ countries with the best exchange rates. Arrives in minutes.",
        pattern: "🌍"
    },
    {
        icon: <PiggyBank size={28} />,
        title: "High-Yield Savings",
        description: "Earn up to 15% interest p.a. on your savings goals. Watch your money grow.",
        pattern: "🐷"
    },
    {
        icon: <Briefcase size={28} />,
        title: "Business Accounts",
        description: "Powerful tools for entrepreneurs. Invoicing, payroll, and multi-user access.",
        pattern: "💼"
    },
    {
        icon: <LineChart size={28} />,
        title: "Investment Hub",
        description: "Stocks, mutual funds, and fixed deposits. Grow your wealth with expert guidance.",
        pattern: "📈"
    },
    {
        icon: <GraduationCap size={28} />,
        title: "Education Trust",
        description: "Secure your child's future with our dedicated education savings plan.",
        pattern: "🎓"
    },
];

export function SpecialProducts() {
    return (
        <section className="py-16 sm:py-24 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
            <div className="absolute top-40 right-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-20 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 sm:mb-12 md:mb-16"
                >
                    <span className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-sm font-bold text-brand-primary mb-6">
                        🛍️ Products
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 mb-3 sm:mb-4">
                        Explore Our
                        <span className="text-brand-primary"> Products</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl mx-auto px-4">
                        From cards to savings, we have everything you need for a complete financial life.
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="relative h-full group"
                            >
                                {/* Glow effect */}
                                <div className="absolute -inset-1 bg-brand-primary rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500" />

                                {/* Card */}
                                <div className="relative bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl transition-all h-full border border-slate-100 overflow-hidden">
                                    {/* Background pattern */}
                                    <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
                                        {product.pattern}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                        {product.icon}
                                    </div>

                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-brand-primary transition-all">
                                        {product.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
