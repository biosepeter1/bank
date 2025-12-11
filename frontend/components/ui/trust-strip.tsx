'use client';

import { motion } from 'framer-motion';

// Partner logos with proper brand representations
const trustedPartners = [
    {
        name: "Central Bank of Nigeria",
        type: "text",
        display: "CBN",
        bg: "#1a472a",
        text: "white"
    },
    {
        name: "Visa",
        type: "visa",
        display: "VISA",
        color: "#1a1f71"
    },
    {
        name: "MasterCard",
        type: "mastercard"
    },
    {
        name: "Verve",
        type: "verve",
        color: "#00425f"
    },
    {
        name: "NDIC",
        type: "text",
        display: "NDIC",
        bg: "#003399",
        text: "white"
    },
    {
        name: "NIBSS",
        type: "text",
        display: "NIBSS",
        bg: "#e31937",
        text: "white"
    }
];

export function TrustStrip() {
    return (
        <section className="py-16 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Trusted & Secured By Industry Leaders
                    </p>
                </motion.div>

                {/* Partners */}
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
                    {trustedPartners.map((partner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ scale: 1.1 }}
                            className="cursor-default"
                        >
                            {partner.type === "visa" ? (
                                // VISA - Italic blue text
                                <span
                                    className="text-3xl font-black italic tracking-tight"
                                    style={{ color: partner.color }}
                                >
                                    VISA
                                </span>
                            ) : partner.type === "mastercard" ? (
                                // MasterCard - Proper overlapping circles
                                <div className="flex items-center">
                                    <svg width="52" height="32" viewBox="0 0 52 32" fill="none">
                                        <circle cx="16" cy="16" r="16" fill="#EB001B" />
                                        <circle cx="36" cy="16" r="16" fill="#F79E1B" />
                                        <path d="M26 3.5C29.5 6.5 32 10.5 32 16C32 21.5 29.5 25.5 26 28.5C22.5 25.5 20 21.5 20 16C20 10.5 22.5 6.5 26 3.5Z" fill="#FF5F00" />
                                    </svg>
                                </div>
                            ) : partner.type === "verve" ? (
                                // Verve - Styled text
                                <span
                                    className="text-2xl font-black lowercase tracking-tight"
                                    style={{ color: partner.color }}
                                >
                                    verve
                                </span>
                            ) : (
                                // CBN, NDIC, NIBSS - Solid colored badges
                                <div
                                    className="px-5 py-2 rounded-lg font-bold text-sm tracking-wide shadow-sm"
                                    style={{
                                        backgroundColor: partner.bg,
                                        color: partner.text
                                    }}
                                >
                                    {partner.display}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 pt-10 border-t border-slate-100"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {[
                            { value: "50,000+", label: "Active Users" },
                            { value: "₦2B+", label: "Monthly Transactions" },
                            { value: "4.9★", label: "App Store Rating" },
                            { value: "24/7", label: "Customer Support" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-black text-brand-primary mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
