'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceHeroProps {
    title: string;
    subtitle: string;
    description: string;
    imageSrc?: string;
    ctaText?: string;
    ctaLink?: string;
}

export function ServiceHero({
    title,
    subtitle,
    description,
    ctaText = "Get Started",
    ctaLink = "/register"
}: ServiceHeroProps) {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-primary/5 via-transparent to-transparent opacity-50" />
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary text-sm font-medium mb-6 border border-brand-primary/10">
                            {subtitle}
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
                            {title}
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            {description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={ctaLink}>
                                <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white shadow-xl shadow-brand-primary/20 border-0 h-12 px-8 text-base">
                                    {ctaText} <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
