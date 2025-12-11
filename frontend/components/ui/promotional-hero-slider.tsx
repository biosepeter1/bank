'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useBranding } from '@/contexts/BrandingContext';

interface PromoSlide {
    id: number;
    headline: string;
    subHeadline: string;
    prizeText: string;
    prizeSubtext: string;
    bottomText: string;
    features: string[];
    ctaText: string;
    ctaLink: string;
    bgImage: string;
    bgColor: string;
    accentColor: string;
}

const promoSlides: PromoSlide[] = [
    {
        id: 1,
        headline: "Save",
        subHeadline: "& Win",
        prizeText: "₦50M",
        prizeSubtext: "FOR YOU",
        bottomText: "500+ LUCKY WINNERS",
        features: [
            "SAVE AT LEAST ₦50,000",
            "GROW YOUR ACCOUNT BALANCE",
            "COMPLETE 5 TRANSACTIONS ON ANY OF OUR DIGITAL CHANNELS"
        ],
        ctaText: "Start Saving",
        ctaLink: "/register",
        bgImage: "/images/promo-slide-1.png",
        bgColor: "#0099ff",
        accentColor: "#FFD700"
    },
    {
        id: 2,
        headline: "Refer",
        subHeadline: "& Earn",
        prizeText: "₦10K",
        prizeSubtext: "PER REFERRAL",
        bottomText: "UNLIMITED EARNINGS",
        features: [
            "INVITE FRIENDS TO OPEN AN ACCOUNT",
            "SHARE YOUR UNIQUE REFERRAL LINK",
            "EARN ₦10,000 FOR EACH SUCCESSFUL REFERRAL"
        ],
        ctaText: "Refer Now",
        ctaLink: "/register",
        bgImage: "/images/promo-slide-2.png",
        bgColor: "#00A86B",
        accentColor: "#FFD700"
    },
    {
        id: 3,
        headline: "Go",
        subHeadline: "Digital",
        prizeText: "24/7",
        prizeSubtext: "BANKING",
        bottomText: "ANYTIME, ANYWHERE",
        features: [
            "DOWNLOAD OUR MOBILE APP",
            "INSTANT MONEY TRANSFERS",
            "PAY BILLS & BUY AIRTIME EASILY"
        ],
        ctaText: "Get Started",
        ctaLink: "/register",
        bgImage: "/images/promo-slide-3.png",
        bgColor: "#8B5CF6",
        accentColor: "#F59E0B"
    },
    {
        id: 4,
        headline: "Grow",
        subHeadline: "Your Business",
        prizeText: "0%",
        prizeSubtext: "FEES FOR 3 MONTHS",
        bottomText: "FOR NEW BUSINESS ACCOUNTS",
        features: [
            "OPEN A CORPORATE ACCOUNT",
            "ACCESS PAYROLL SOLUTIONS",
            "MERCHANT SERVICES AVAILABLE"
        ],
        ctaText: "Open Business Account",
        ctaLink: "/register",
        bgImage: "/images/promo-slide-4.png",
        bgColor: "#F97316",
        accentColor: "#FBBF24"
    }
];

export function PromotionalHeroSlider() {
    const { branding } = useBranding();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % promoSlides.length);
    }, [isAnimating]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
    }, [isAnimating]);

    const goToSlide = useCallback((index: number) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex, isAnimating]);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const currentSlide = promoSlides[currentIndex];

    // Unified slide animation - background and content move together
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 1,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 1,
        })
    };

    // Staggered content animations (within each slide)
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: delay * 0.1, duration: 0.4, ease: "easeOut" }
        })
    };

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Static decorative shapes (don't animate with slides) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                {/* Left curved shape */}
                <div
                    className="absolute -left-32 top-1/2 -translate-y-1/2 w-[400px] h-[800px]"
                    style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
                        borderRadius: '0 50% 50% 0',
                    }}
                />

                {/* Right curved shape */}
                <div
                    className="absolute -right-32 top-1/2 -translate-y-1/2 w-[400px] h-[800px]"
                    style={{
                        background: 'linear-gradient(-90deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
                        borderRadius: '50% 0 0 50%',
                    }}
                />

                {/* Floating decorative elements */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-24 right-[15%] w-16 h-16 opacity-15"
                >
                    <svg viewBox="0 0 100 100" fill="white">
                        <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-32 left-[10%] w-12 h-12 opacity-10"
                >
                    <svg viewBox="0 0 100 100" fill="white">
                        <circle cx="50" cy="50" r="50" />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-[40%] left-[5%] w-10 h-10 opacity-8"
                >
                    <svg viewBox="0 0 100 100" fill="white">
                        <polygon points="50,0 100,100 0,100" />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[25%] w-24 h-24"
                >
                    <svg viewBox="0 0 100 100" fill="white">
                        <circle cx="50" cy="50" r="50" />
                    </svg>
                </motion.div>
            </div>

            {/* UNIFIED SLIDE - Background + Content animate together */}
            <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
                onExitComplete={() => setIsAnimating(false)}
            >
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "tween", duration: 0.6, ease: [0.32, 0.72, 0, 1] },
                        opacity: { duration: 0.3 }
                    }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={currentSlide.bgImage}
                            alt=""
                            fill
                            className="object-cover"
                            priority
                        />

                        {/* Dark gradient overlay - stronger on left for text readability */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(90deg, 
                                    rgba(0,0,0,0.85) 0%,
                                    rgba(0,0,0,0.6) 35%,
                                    rgba(0,0,0,0.3) 60%,
                                    rgba(0,0,0,0.15) 100%)`
                            }}
                        />
                        {/* Brand color tint overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(135deg, 
                                    rgba(var(--brand-primary-rgb), 0.3) 0%,
                                    rgba(var(--brand-primary-rgb), 0.1) 50%,
                                    transparent 100%)`
                            }}
                        />
                    </div>

                    {/* Content Container */}
                    <div className="relative container mx-auto px-4 md:px-6 pt-28 pb-24 min-h-screen flex items-center">
                        <div className="grid lg:grid-cols-[1.2fr_1fr_1fr] gap-6 lg:gap-8 items-center px-4 sm:px-8 md:px-12 w-full">
                            {/* Left - Headline */}
                            <div className="text-center lg:text-left">
                                <motion.div
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={1}
                                >
                                    <h1 className="font-black leading-[0.95] tracking-tight">
                                        <span
                                            className="block text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                                            style={{
                                                textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {currentSlide.headline}
                                        </span>
                                        <span
                                            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl whitespace-nowrap"
                                            style={{
                                                color: 'var(--brand-secondary)',
                                                textShadow: '0 4px 30px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)'
                                            }}
                                        >
                                            {currentSlide.subHeadline}
                                        </span>
                                    </h1>
                                </motion.div>
                            </div>

                            {/* Center - Prize Card */}
                            <div className="flex flex-col items-center">
                                <motion.div
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={2}
                                    className="relative"
                                >
                                    {/* Prize board */}
                                    <div
                                        className="relative px-10 py-8 rounded-2xl shadow-2xl transform"
                                        style={{
                                            background: 'linear-gradient(135deg, #0d5c49 0%, #0a7057 50%, #085c47 100%)',
                                            border: '5px solid #ffd700',
                                            boxShadow: `
                        0 20px 60px rgba(0,0,0,0.4),
                        inset 0 2px 0 rgba(255,255,255,0.2),
                        inset 0 -2px 0 rgba(0,0,0,0.2)
                      `
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 rounded-xl overflow-hidden"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)'
                                            }}
                                        />

                                        <div className="text-center relative z-10">
                                            <div
                                                className="text-5xl sm:text-6xl md:text-7xl font-black"
                                                style={{
                                                    color: '#ffd700',
                                                    textShadow: '3px 3px 6px rgba(0,0,0,0.6), 0 0 30px rgba(255,215,0,0.3)'
                                                }}
                                            >
                                                {currentSlide.prizeText}
                                            </div>
                                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 tracking-wide">
                                                {currentSlide.prizeSubtext}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom tag */}
                                    <motion.div
                                        className="mt-5 px-8 py-4 rounded-full text-center mx-auto relative"
                                        style={{
                                            background: 'linear-gradient(135deg, #0a7057 0%, #085c47 100%)',
                                            border: '4px solid #ffd700',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                        }}
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={3}
                                    >
                                        <span className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide">
                                            {currentSlide.bottomText}
                                        </span>
                                    </motion.div>
                                </motion.div>

                                {/* CTA Button */}
                                <motion.div
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={4}
                                    className="mt-8"
                                >
                                    <Link href={currentSlide.ctaLink}>
                                        <Button
                                            size="lg"
                                            className="h-14 px-12 text-lg font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
                                            style={{
                                                background: 'var(--brand-secondary)',
                                                color: 'var(--brand-primary)',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {currentSlide.ctaText}
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Right - Features */}
                            <div className="space-y-5">
                                {currentSlide.features.map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={5 + index}
                                        className="flex items-start gap-4"
                                    >
                                        <div
                                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 shadow-lg"
                                            style={{
                                                background: 'var(--brand-secondary)',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            <Star size={16} fill="var(--brand-primary)" style={{ color: 'var(--brand-primary)' }} />
                                        </div>
                                        <span
                                            className="text-white text-base md:text-lg font-semibold leading-relaxed"
                                            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
                                        >
                                            {feature}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows - Fixed position, above slides */}
            <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="absolute left-2 md:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all group border border-white/30 shadow-lg disabled:opacity-50"
                aria-label="Previous slide"
            >
                <ChevronLeft size={32} className="group-hover:scale-110 transition-transform" />
            </button>

            <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="absolute right-2 md:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all group border border-white/30 shadow-lg disabled:opacity-50"
                aria-label="Next slide"
            >
                <ChevronRight size={32} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Carousel Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
                {promoSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        disabled={isAnimating}
                        className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${index === currentIndex
                            ? 'w-10 h-4 bg-white shadow-lg'
                            : 'w-4 h-4 bg-white/50 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Terms text */}
            <div className="absolute bottom-4 right-4 md:right-8 text-white/70 text-sm font-medium z-20">
                Terms & Conditions apply
            </div>
        </section>
    );
}
