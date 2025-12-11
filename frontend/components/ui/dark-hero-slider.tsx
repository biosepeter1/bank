'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useBranding } from '@/contexts/BrandingContext';

interface HeroSlide {
    id: number;
    tag: string;
    headline: string;
    description: string;
    ctaPrimary: { text: string; link: string };
    ctaSecondary: { text: string; link: string };
    image: string;
}

const heroSlides: HeroSlide[] = [
    {
        id: 1,
        tag: "Digital Banking",
        headline: "Online banking that's easy and efficient",
        description: "From fund transfers to bill payments, our online platform offers a range of features designed to make banking simple, fast, and accessible.",
        ctaPrimary: { text: "Login", link: "/login" },
        ctaSecondary: { text: "Open an account", link: "/register" },
        image: "/images/hero-floating-1.png"
    },
    {
        id: 2,
        tag: "Mobile Banking",
        headline: "Banking at your fingertips, anytime",
        description: "Experience seamless banking on the go. Transfer funds, pay bills, and manage your accounts securely from your smartphone.",
        ctaPrimary: { text: "Login", link: "/login" },
        ctaSecondary: { text: "Open an account", link: "/register" },
        image: "/images/hero-floating-2.png"
    },
    {
        id: 3,
        tag: "Business Solutions",
        headline: "Grow your business with smart banking",
        description: "Tailored financial solutions to help your business thrive. From corporate accounts to payroll management, we've got you covered.",
        ctaPrimary: { text: "Login", link: "/login" },
        ctaSecondary: { text: "Open an account", link: "/register" },
        image: "/images/hero-floating-3.png"
    },
    {
        id: 4,
        tag: "Secure Banking",
        headline: "Your money, protected around the clock",
        description: "Bank with confidence. Our state-of-the-art security systems ensure your funds and personal information are always safe.",
        ctaPrimary: { text: "Login", link: "/login" },
        ctaSecondary: { text: "Open an account", link: "/register" },
        image: "/images/hero-floating-4.png"
    }
];

export function DarkHeroSlider() {
    const { branding } = useBranding();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const nextSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, [isAnimating]);

    const prevSlide = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }, [isAnimating]);

    const goToSlide = useCallback((index: number) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex, isAnimating]);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(nextSlide, 7000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const currentSlide = heroSlides[currentIndex];

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        })
    };

    const imageVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.9,
        })
    };

    // Floating animation for the image
    const floatingAnimation = {
        y: [0, -15, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1] as [number, number, number, number]
        }
    };

    return (
        <section className="relative min-h-screen bg-slate-900 overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />

            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Main content */}
            <div className="relative container mx-auto px-4 md:px-6 pt-24 pb-16 min-h-screen flex items-center">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">

                    {/* Left side - Text content */}
                    <AnimatePresence mode="wait" custom={direction} onExitComplete={() => setIsAnimating(false)}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="text-center lg:text-left"
                        >
                            {/* Tag */}
                            <div className="mb-4">
                                <span className="text-sm text-white/60 font-medium tracking-wide">
                                    {branding.name} {currentSlide.tag}
                                </span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                {currentSlide.headline}
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                                {currentSlide.description}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link href={currentSlide.ctaPrimary.link}>
                                    <Button
                                        size="lg"
                                        className="h-12 px-8 text-base font-semibold rounded-full"
                                        style={{
                                            backgroundColor: 'var(--brand-primary)',
                                            color: 'white'
                                        }}
                                    >
                                        {currentSlide.ctaPrimary.text}
                                    </Button>
                                </Link>
                                <Link href={currentSlide.ctaSecondary.link}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-12 px-8 text-base font-semibold rounded-full border-white/30 text-white hover:bg-white hover:text-slate-900"
                                    >
                                        {currentSlide.ctaSecondary.text}
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Right side - Image (no card, blends with background) */}
                    <div className="relative flex justify-center lg:justify-end">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="relative w-full max-w-xl lg:max-w-2xl xl:max-w-3xl aspect-[4/3]"
                            >
                                {/* Floating animation wrapper */}
                                <motion.div
                                    animate={floatingAnimation}
                                    className="relative w-full h-full"
                                >
                                    {/* Image - no background card, blends with hero */}
                                    <Image
                                        src={currentSlide.image}
                                        alt={currentSlide.headline}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Navigation arrows */}
            <button
                onClick={prevSlide}
                disabled={isAnimating}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-50 border border-white/10"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                disabled={isAnimating}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all disabled:opacity-50 border border-white/10"
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Slide indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        disabled={isAnimating}
                        className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${index === currentIndex
                            ? 'w-8 h-2 bg-brand-primary'
                            : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
