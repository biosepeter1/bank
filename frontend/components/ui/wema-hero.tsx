'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useBranding } from '@/contexts/BrandingContext';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Send, Target, TrendingUp, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';

// Full slides with matched content + unique visuals
const heroSlides = [
 {
 badge:"Digital Banking Redefined",
 headline:"Banking Made",
 highlight:"Simple & Smart",
 description:"Experience the future of finance with our award-winning digital platform. Send, save, and grow your money — all from your phone.",
 type:"banking",
 icon:"💳"
 },
 {
 badge:"Fast & Secure",
 headline:"Instant",
 highlight:"Transfers",
 description:"Send money to anyone, anywhere in seconds. Zero delays, zero hassle. Your money moves as fast as you do.",
 type:"transfer",
 icon:"💸"
 },
 {
 badge:"Grow Your Wealth",
 headline:"Save Smarter,",
 highlight:"Earn More",
 description:"High-yield savings accounts with up to 15% APY. Automated savings tools to help you reach your goals faster.",
 type:"savings",
 icon:"🎯"
 },
 {
 badge:"Business Solutions",
 headline:"Power Your",
 highlight:"Business",
 description:"Comprehensive banking solutions for entrepreneurs. Invoicing, payroll, multi-user access — all in one platform.",
 type:"business",
 icon:"💼"
 }
];

// Unique visual for each slide type
function SlideVisual({ type, icon }: { type: string; icon: string }) {
 if (type ==="banking") {
 return (
 <div className="relative bg-white/80 backdrop-blur-xl border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-200 p-2 sm:p-4 overflow-hidden w-full max-w-[260px] sm:max-w-[340px] md:max-w-none mx-auto">
 {/* Banking Dashboard */}
 <div className="bg-[#111111] rounded-t-xl sm:rounded-t-[2rem] p-3 sm:p-6 text-white">
 <div className="flex justify-between items-start mb-2 sm:mb-6">
 <div>
 <div className="text-[10px] sm:text-sm opacity-80 mb-0.5 sm:mb-1">Total Balance</div>
 <div className="text-lg sm:text-3xl md:text-4xl font-black">$24,568</div>
 </div>
 <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-[2rem] bg-slate-100 backdrop-blur flex items-center justify-center">
 <span className="text-base sm:text-3xl">{icon}</span>
 </div>
 </div>
 <div className="flex gap-2 sm:gap-4">
 <div className="flex-1 bg-slate-100 backdrop-blur rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
 <div className="text-[10px] sm:text-xs opacity-70">Income</div>
 <div className="font-bold text-xs sm:text-base">+$4,200</div>
 </div>
 <div className="flex-1 bg-slate-100 backdrop-blur rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
 <div className="text-[10px] sm:text-xs opacity-70">Expenses</div>
 <div className="font-bold text-xs sm:text-base">-$1,832</div>
 </div>
 </div>
 </div>
 <div className="p-3 sm:p-6">
 <div className="grid grid-cols-4 gap-1 sm:gap-3">
 {['Send', 'Pay', 'Cards', 'More'].map((action, i) => (
 <div key={action} className="bg-slate-50 rounded-lg sm:rounded-[2rem] p-1.5 sm:p-4 text-center">
 <div className="w-6 h-6 sm:w-10 sm:h-10 mx-auto mb-0.5 sm:mb-2 rounded-md sm:rounded-xl bg-brand-primary/10 flex items-center justify-center text-xs sm:text-xl">
 {['💸', '📥', '💳', '⚡'][i]}
 </div>
 <div className="text-[9px] sm:text-xs font-semibold text-slate-600">{action}</div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
 }

 if (type ==="transfer") {
 return (
 <div className="relative w-full max-w-[340px] sm:max-w-none mx-auto">
 {/* Mobile: Compact horizontal layout, Desktop: Full layout */}
 <div className="flex items-center justify-center gap-2 sm:gap-8">
 {/* Left Phone - Sending */}
 <div className="bg-white rounded-xl sm:rounded-[2.5rem] shadow-xl sm:shadow-2xl p-1.5 sm:p-3 transform sm:-rotate-6">
 <div className="bg-[#111111] rounded-lg sm:rounded-[2rem] p-3 sm:p-6 text-white w-[100px] sm:w-48">
 <div className="text-[10px] sm:text-sm opacity-80 mb-0.5 sm:mb-1">Sending</div>
 <div className="text-base sm:text-3xl font-black mb-1 sm:mb-4">$500</div>
 <div className="bg-slate-100 rounded-lg sm:rounded-xl p-1.5 sm:p-3 text-center">
 <div className="text-[10px] sm:text-sm font-bold">To: John</div>
 </div>
 </div>
 </div>

 {/* Arrow/Flow - Hidden on mobile, static on tablet+ */}
 <div className="hidden sm:flex flex-col items-center gap-2">
 <div className="text-4xl">💰</div>
 <div className="flex gap-1">
 {[0, 1, 2].map(i => (
 <div
 key={i}
 className="w-3 h-3 bg-brand-primary rounded-full opacity-70"
 />
 ))}
 </div>
 </div>

 {/* Mobile arrow - Static */}
 <div className="flex sm:hidden flex-col items-center">
 <div className="text-2xl">→</div>
 </div>

 {/* Right Phone - Received */}
 <div className="bg-white rounded-xl sm:rounded-[2.5rem] shadow-xl sm:shadow-2xl p-1.5 sm:p-3 transform sm:rotate-6">
 <div className="bg-green-500 rounded-lg sm:rounded-[2rem] p-3 sm:p-6 text-white w-[100px] sm:w-48">
 <div className="text-[10px] sm:text-sm opacity-80 mb-0.5 sm:mb-1">Received!</div>
 <div className="text-base sm:text-3xl font-black mb-1 sm:mb-4">+$500</div>
 <div className="bg-slate-100 rounded-lg sm:rounded-xl p-1.5 sm:p-3 text-center">
 <div className="text-[10px] sm:text-sm font-bold">✓ Done</div>
 </div>
 </div>
 </div>
 </div>

 {/* Speed indicator */}
 <div className="mt-4 sm:mt-8 bg-white/80 backdrop-blur rounded-xl sm:rounded-[2rem] shadow-xl p-2.5 sm:p-4 max-w-[220px] sm:max-w-xs mx-auto">
 <div className="flex items-center gap-2 sm:gap-3">
 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 flex items-center justify-center text-brand-primary">
 <Send size={16} className="sm:w-5 sm:h-5" />
 </div>
 <div>
 <div className="font-bold text-slate-900 text-sm sm:text-base">Instant Transfer</div>
 <div className="text-xs sm:text-sm text-brand-text/50">Completed in 0.3s</div>
 </div>
 </div>
 </div>
 </div>
 );
 }

 if (type ==="savings") {
 return (
 <div className="relative bg-white/80 backdrop-blur-xl border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-200 p-3 sm:p-6 overflow-hidden w-full max-w-[260px] sm:max-w-none mx-auto">
 {/* Savings Goal Card */}
 <div className="flex items-center justify-between mb-3 sm:mb-6">
 <div>
 <div className="text-[10px] sm:text-sm text-brand-text/50 mb-0.5 sm:mb-1">Savings Goal</div>
 <div className="text-base sm:text-2xl font-black text-slate-900">Vacation Fund</div>
 </div>
 <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[2rem] bg-emerald-100 flex items-center justify-center text-xl sm:text-3xl shadow-lg">
 🎯
 </div>
 </div>

 {/* Progress */}
 <div className="mb-3 sm:mb-6">
 <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
 <span className="font-bold text-brand-primary">$7,500</span>
 <span className="text-brand-text/50">of $10,000</span>
 </div>
 <div className="h-2.5 sm:h-4 bg-slate-100 rounded-full overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width:"75%" }}
 transition={{ duration: 1, delay: 0.5 }}
 className="h-full bg-brand-primary rounded-full"
 />
 </div>
 <div className="text-right text-[10px] sm:text-sm text-brand-text/50 mt-0.5 sm:mt-1">75% Complete</div>
 </div>

 {/* Interest Rate */}
 <div className="bg-green-50 rounded-xl sm:rounded-[2rem] p-2.5 sm:p-4 border border-green-100 mb-2 sm:mb-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2 sm:gap-3">
 <TrendingUp className="text-green-600 w-4 h-4 sm:w-6 sm:h-6" />
 <div>
 <div className="font-bold text-slate-900 text-xs sm:text-base">Interest Rate</div>
 <div className="text-[10px] sm:text-sm text-brand-text/50">Annual Yield</div>
 </div>
 </div>
 <div className="text-xl sm:text-3xl font-black text-green-600">15%</div>
 </div>
 </div>

 {/* Auto-save badge */}
 <div className="flex items-center gap-1.5 sm:gap-2 justify-center">
 <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
 <span className="text-[10px] sm:text-sm font-medium text-slate-600">Auto-save: $200/week</span>
 </div>
 </div>
 );
 }

 if (type ==="business") {
 return (
 <div className="relative bg-white/80 backdrop-blur-xl border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-slate-200 p-2 sm:p-4 overflow-hidden w-full max-w-[260px] sm:max-w-none mx-auto">
 {/* Business Dashboard */}
 <div className="bg-[#111111] rounded-t-xl sm:rounded-t-[2rem] p-3 sm:p-6 text-white">
 <div className="flex justify-between items-start mb-3 sm:mb-6">
 <div>
 <div className="text-[10px] sm:text-sm opacity-80 mb-0.5 sm:mb-1">Business Account</div>
 <div className="text-lg sm:text-4xl font-black">$85,320</div>
 </div>
 <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-[2rem] bg-slate-100 backdrop-blur flex items-center justify-center">
 <Briefcase size={16} className="sm:w-7 sm:h-7" />
 </div>
 </div>

 {/* Revenue chart bars */}
 <div className="flex items-end gap-1 sm:gap-2 h-10 sm:h-16">
 {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
 <motion.div
 key={i}
 initial={{ height: 0 }}
 animate={{ height: `${height}%` }}
 transition={{ delay: i * 0.1 }}
 className="flex-1 bg-brand-primary rounded-t-sm sm:rounded-t-lg"
 />
 ))}
 </div>
 </div>

 <div className="p-3 sm:p-6">
 {/* Team members */}
 <div className="flex items-center justify-between mb-2 sm:mb-4">
 <span className="text-[10px] sm:text-sm font-bold text-slate-700">Team</span>
 <div className="flex -space-x-1.5 sm:-space-x-2">
 {['JD', 'SM', '+2'].map((initials, i) => (
 <div
 key={i}
 className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full ${i === 2 ? 'bg-slate-50 text-slate-600' : 'bg-slate-200 text-brand-text'} flex items-center justify-center text-[8px] sm:text-xs font-bold border-2 border-white`}
 >
 {initials}
 </div>
 ))}
 </div>
 </div>

 {/* Quick stats */}
 <div className="grid grid-cols-2 gap-2 sm:gap-3">
 <div className="bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
 <div className="text-sm sm:text-lg font-black text-slate-900">142</div>
 <div className="text-[9px] sm:text-xs text-brand-text/50">Invoices</div>
 </div>
 <div className="bg-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
 <div className="text-sm sm:text-lg font-black text-green-600">$24.5K</div>
 <div className="text-[9px] sm:text-xs text-brand-text/50">Revenue</div>
 </div>
 </div>
 </div>
 </div>
 );
 }

 return null;
}

export function WemaHero() {
 const { branding } = useBranding();
 const [currentSlide, setCurrentSlide] = useState(0);

 useEffect(() => {
 const interval = setInterval(() => {
 setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
 }, 6000);
 return () => clearInterval(interval);
 }, []);

 const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
 const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

 const slide = heroSlides[currentSlide];

 return (
 <section className="relative lg:min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-8 md:pb-16">
 {/* Background - Static light solid color */}
 <div className="absolute inset-0 bg-[#F5F3EE]" />

 {/* Static decorative blurs - no animation for better mobile perf */}
 <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-[rgb(var(--brand-primary-rgb)/0.15)] rounded-full blur-3xl opacity-30 hidden md:block" />
 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[rgb(var(--brand-secondary-rgb)/0.15)] rounded-full blur-3xl opacity-25 hidden md:block" />
 <div className="absolute top-32 left-[15%] w-16 h-16 border-2 border-brand-primary/20 rounded-xl hidden lg:block" />

 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

 <div className="container mx-auto px-4 sm:px-6 relative z-10">
 <div className="grid lg:grid-cols-2 gap-4 lg:gap-12 xl:gap-20 items-center">

 {/* Left - Text */}
 <div className="text-center lg:text-left">
 <AnimatePresence mode="wait">
 <motion.div
 key={currentSlide}
 initial={{ opacity: 0, x: -50 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 50 }}
 transition={{ duration: 0.5 }}
 >
 <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#F5F3EE]/10 rounded-full mb-4 sm:mb-8 border border-brand-primary/20">
 <Sparkles size={16} className="text-brand-primary" />
 <span className="text-sm font-semibold text-brand-primary">{slide.badge}</span>
 </div>

 <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-black text-brand-text leading-[1.1] mb-4 sm:mb-8 tracking-tight">
 {slide.headline}
 <span className="block mt-1 sm:mt-2 text-brand-primary font-drama italic font-normal text-4xl sm:text-5xl md:text-6xl lg:text-8xl">
 {slide.highlight}
 </span>
 </h1>

 <p className="text-base sm:text-lg md:text-xl text-brand-text/70 mb-4 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-medium">
 {slide.description}
 </p>
 </motion.div>
 </AnimatePresence>

 {/* Buttons - Hidden on mobile/tablet, shown on desktop */}
 <div className="hidden lg:flex flex-row gap-4 justify-start mb-10">
 <Link href="/register">
 <Button
 size="lg"
 className="h-16 px-10 text-lg font-bold rounded-[2rem] bg-brand-primary hover:bg-brand-primary/90 text-white shadow-2xl shadow-brand-primary/30 transition-all hover:scale-105 group"
 >
 Get Started Free
 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
 </Button>
 </Link>
 <Link href="/about">
 <Button
 size="lg"
 variant="outline"
 className="h-16 px-10 text-lg font-bold rounded-[2rem] border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-brand-primary hover:text-brand-primary transition-all bg-slate-50"
 >
 Learn More
 </Button>
 </Link>
 </div>

 {/* Slide navigation - Hidden on mobile/tablet, shown on desktop */}
 <div className="hidden lg:flex items-center gap-4 justify-start">
 <button
 onClick={prevSlide}
 className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-primary hover:text-brand-primary hover:border-brand-primary transition-all"
 >
 <ChevronLeft size={18} />
 </button>
 <div className="flex gap-2">
 {heroSlides.map((_, i) => (
 <button
 key={i}
 onClick={() => setCurrentSlide(i)}
 className={`h-3 rounded-full transition-all ${i === currentSlide ? 'bg-brand-primary w-8' : 'bg-slate-300 hover:bg-slate-400 w-3'}`}
 />
 ))}
 </div>
 <button
 onClick={nextSlide}
 className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-primary hover:text-brand-primary hover:border-brand-primary transition-all"
 >
 <ChevronRight size={18} />
 </button>
 </div>
 </div>

 {/* Right - Unique Visual for Each Slide */}
 <div className="relative">
 <div className="absolute -inset-4 bg-slate-200/50 rounded-[3rem] blur-2xl" />

 <AnimatePresence mode="wait">
 <motion.div
 key={currentSlide}
 initial={{ opacity: 0, x: 50, scale: 0.95 }}
 animate={{ opacity: 1, x: 0, scale: 1 }}
 exit={{ opacity: 0, x: -50, scale: 0.95 }}
 transition={{ duration: 0.5 }}
 >
 <motion.div
 animate={{ y: [0, -15, 0] }}
 transition={{ duration: 5, repeat: Infinity, ease:"easeInOut" }}
 >
 <SlideVisual type={slide.type} icon={slide.icon} />
 </motion.div>
 </motion.div>
 </AnimatePresence>
 </div>
 </div>

 {/* Mobile/Tablet: Buttons and navigation BELOW the visual */}
 <div className="lg:hidden mt-6">
 <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
 <Link href="/register">
 <Button
 size="lg"
 className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white shadow-xl shadow-brand-primary/30 transition-all group"
 >
 Get Started Free
 <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
 </Button>
 </Link>
 <Link href="/about">
 <Button
 size="lg"
 variant="outline"
 className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-brand-primary hover:text-brand-primary transition-all bg-slate-50"
 >
 Learn More
 </Button>
 </Link>
 </div>

 {/* Mobile slide navigation */}
 <div className="flex items-center gap-3 justify-center">
 <button
 onClick={prevSlide}
 className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-primary hover:text-brand-primary transition-all"
 >
 <ChevronLeft size={16} />
 </button>
 <div className="flex gap-2">
 {heroSlides.map((_, i) => (
 <button
 key={i}
 onClick={() => setCurrentSlide(i)}
 className={`h-2.5 rounded-full transition-all ${i === currentSlide ? 'bg-brand-primary w-6' : 'bg-slate-300 w-2.5'}`}
 />
 ))}
 </div>
 <button
 onClick={nextSlide}
 className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-primary hover:text-brand-primary transition-all"
 >
 <ChevronRight size={16} />
 </button>
 </div>
 </div>
 </div>
 </section>
 );
}
