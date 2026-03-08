'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  CreditCard,
  Smartphone,
  PiggyBank,
  GraduationCap,
  Headphones,
  CheckCircle2,
  DollarSign,
  Shield,
  Zap,
  Star,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  Award,
  Globe,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';

export default function PersonalBankingPage() {
  const { settings } = useSettings();
  const { branding } = useBranding();
  const siteName = settings?.general?.siteName || branding.name || 'RDN Bank';
  const heroRef = useRef<HTMLElement>(null);
  const archiveRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    let ctx = gsap.context(() => {
      // Hero Entrance
      gsap.fromTo('.hero-text', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
      );

      // Protocol E: Sticky Stacking Archive
      const cards = gsap.utils.toArray('.archive-card');
      if (cards.length > 0) {
        cards.forEach((card: any, index: number) => {
          if (index < cards.length - 1) {
            gsap.to(card, {
              scrollTrigger: {
                trigger: card,
                start: 'top top',
                end: 'bottom top',
                pin: true,
                pinSpacing: false,
                scrub: true,
              },
              scale: 0.9,
              filter: 'blur(20px)',
              opacity: 0.5,
              ease: 'none'
            });
          }
        });
      }
    }, [heroRef, archiveRef]);
    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '2M+', label: 'Happy Customers', icon: <Users className="w-6 h-6" /> },
    { value: '₦500B+', label: 'Transactions', icon: <DollarSign className="w-6 h-6" /> },
    { value: '99.9%', label: 'Uptime', icon: <Zap className="w-6 h-6" /> },
    { value: '4.9/5', label: 'App Rating', icon: <Star className="w-6 h-6" /> }
  ];

  const services = [
    {
      id: 'savings',
      icon: <PiggyBank className="w-7 h-7" />,
      title: 'Savings Accounts',
      subtitle: 'Grow Your Wealth Securely',
      description: 'Competitive interest rates and flexible deposit options to help your money grow.',
      features: [
        'Up to 15% p.a. interest',
        'Flexible deposit options',
        'Goal-based savings plans',
        'Automatic savings tools'
      ],
      highlight: '15%',
      highlightLabel: 'Interest p.a.',
      gradient: 'from-emerald-600 to-teal-500'
    },
    {
      id: 'current',
      icon: <Wallet className="w-7 h-7" />,
      title: 'Current Accounts',
      subtitle: 'Seamless Daily Banking',
      description: 'Instant transfers, free debit cards, and real-time notifications.',
      features: [
        'Instant fund transfers',
        'Free debit card',
        'Real-time alerts',
        'Overdraft available'
      ],
      highlight: '₦0',
      highlightLabel: 'Monthly Fee',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      id: 'mobile',
      icon: <Smartphone className="w-7 h-7" />,
      title: 'Mobile Banking',
      subtitle: '24/7 Access Anywhere',
      description: 'Secure digital banking with biometric login and instant payments.',
      features: [
        'Biometric authentication',
        'Spending insights',
        'P2P payments',
        'Bill scheduling'
      ],
      highlight: '24/7',
      highlightLabel: 'Access',
      gradient: 'from-purple-600 to-pink-500'
    },
    {
      id: 'cards',
      icon: <CreditCard className="w-7 h-7" />,
      title: 'Debit & Virtual Cards',
      subtitle: 'Shop Globally',
      description: 'Globally accepted cards with advanced security and contactless payments.',
      features: [
        'Global acceptance',
        'Virtual cards',
        'Contactless payments',
        'Fraud protection'
      ],
      highlight: '150+',
      highlightLabel: 'Countries',
      gradient: 'from-orange-600 to-red-500'
    },
    {
      id: 'student',
      icon: <GraduationCap className="w-7 h-7" />,
      title: 'Student Banking',
      subtitle: 'Build Financial Habits',
      description: 'Smart solutions designed for young adults starting their financial journey.',
      features: [
        'Zero maintenance fees',
        'Financial literacy',
        'Student-friendly limits',
        'Special offers'
      ],
      highlight: '₦0',
      highlightLabel: 'Account Fees',
      gradient: 'from-indigo-600 to-blue-500'
    },
    {
      id: 'support',
      icon: <Headphones className="w-7 h-7" />,
      title: 'Customer Support',
      subtitle: 'Always Here For You',
      description: 'Dedicated assistance for inquiries, disputes, and banking guidance.',
      features: [
        '24/7 availability',
        'Live chat support',
        'Quick resolution',
        'Multi-channel'
      ],
      highlight: '<2hrs',
      highlightLabel: 'Response Time',
      gradient: 'from-teal-600 to-cyan-500'
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Bank-Grade Security',
      description: 'Advanced encryption and fraud monitoring protect your funds 24/7.',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Instant Transactions',
      description: 'Send and receive money in seconds with lightning-fast infrastructure.',
      gradient: 'from-purple-600 to-pink-500'
    },
    {
      icon: <Star className="w-7 h-7" />,
      title: 'Premium Experience',
      description: 'Intuitive banking designed around your needs and lifestyle.',
      gradient: 'from-orange-600 to-red-500'
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: 'Financial Growth',
      description: 'Tools and insights to help you grow and manage your wealth.',
      gradient: 'from-emerald-600 to-teal-500'
    }
  ];

  const testimonials = [
    {
      quote: "The mobile app is incredibly intuitive. I can manage all my finances on the go without any hassle.",
      author: "Chioma Eze",
      role: "Entrepreneur",
      avatar: "CE"
    },
    {
      quote: "Best savings rates I've found anywhere. My money is actually growing now!",
      author: "Emeka Johnson",
      role: "Software Developer",
      avatar: "EJ"
    },
    {
      quote: "Customer support is outstanding. They resolved my issue within an hour.",
      author: "Amaka Obi",
      role: "Marketing Manager",
      avatar: "AO"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section — The Opening Shot */}
      <section ref={heroRef} className="relative min-h-[100dvh] w-full bg-[#0D0D12] overflow-hidden flex items-end">
        {/* Full-bleed background image with industrial aesthetic */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Brutalist Architecture" 
            className="w-full h-full object-cover grayscale opacity-80" 
          />
          {/* Heavy black overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14] via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-black/60" />
          {/* Visual noise texture */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        {/* Content pushed to bottom-left third, with padding top to protect navbar */}
        <div className="container mx-auto px-6 relative z-10 pt-32 pb-20 md:pt-48 md:pb-32">
          <div className="max-w-4xl">
            <h1 className="leading-[0.9] tracking-tighter mb-8">
              <span className="hero-text block font-space-grotesk font-black text-white text-5xl sm:text-7xl lg:text-8xl xl:text-9xl uppercase">
                Command The
              </span>
              <span className="hero-text block font-drama italic text-[#E63B2E] text-7xl sm:text-9xl lg:text-[10rem] xl:text-[12rem] mt-2">
                Capital.
              </span>
            </h1>

            <p className="hero-text font-space-grotesk text-white/60 text-lg sm:text-xl md:text-2xl max-w-2xl font-medium mb-12">
              Precision banking engineered for your personal financial infrastructure. Zero friction. Absolute control.
            </p>

            <div className="hero-text flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link href="/register">
                <button className="group relative px-10 py-5 bg-[#E63B2E] overflow-hidden rounded-full transition-all hover:scale-[1.03] active:scale-95 shadow-2xl">
                  <span className="relative z-10 font-space-grotesk font-black text-white flex items-center gap-3 text-lg">
                    INITIALIZE PROTOCOL
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </button>
              </Link>
            </div>

            {/* Brutalist Stats Bar */}
            <div className="hero-text grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 pt-12 md:pt-16 mt-12 md:mt-16 border-t border-white/10">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-mono text-[10px] md:text-xs text-[#E63B2E] font-black uppercase tracking-widest">{stat.label}</div>
                  <div className="font-space-grotesk text-3xl md:text-5xl font-black text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — "Interactive Functional Artifacts" */}
      <section className="py-32 bg-[#F5F3EE] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-20">
            <h2 className="text-5xl md:text-7xl font-space-grotesk font-black text-[#111111] uppercase tracking-tighter leading-none mb-6">
              Core <span className="font-drama italic text-[#E63B2E] lowercase text-6xl md:text-8xl">Systems.</span>
            </h2>
            <p className="font-space-mono text-[#111111]/70 max-w-xl text-sm md:text-base uppercase tracking-widest leading-relaxed">
              Diagnostic, Telemetry, and Protocol sequences engineered for your personal financial infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* CARD 1: Savings Accounts (Diagnostic Shuffler) */}
            <div className="relative bg-[#E8E4DD] rounded-[2rem] border border-[#111111]/10 overflow-hidden shadow-xl p-8 flex flex-col group min-h-[480px]">
              <div className="flex justify-between items-start mb-8">
                <span className="font-mono text-xs font-bold text-[#E63B2E] bg-[#E63B2E]/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">Sys_01</span>
                <PiggyBank className="w-6 h-6 text-[#111111]" />
              </div>
              <h3 className="font-space-grotesk text-2xl font-black text-[#111111] mb-2">{services[0].title}</h3>
              <p className="font-space-mono text-xs text-[#111111]/80 mb-4 font-bold uppercase tracking-widest">{services[0].subtitle}</p>
              <p className="font-space-mono text-sm text-[#111111]/60 mb-6 leading-relaxed">
                {services[0].description}
              </p>
              
              <div className="space-y-2 mb-8">
                {services[0].features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#111111]/70">
                    <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                  </div>
                ))}
              </div>
              
              <div className="relative h-32 mt-auto perspective-1000">
                <div className="absolute inset-x-0 bottom-0 h-full bg-[#111111] rounded-2xl p-4 shadow-2xl transform transition-transform duration-700 group-hover:-translate-y-4 group-hover:scale-105 z-30 flex flex-col justify-between">
                  <div className="font-mono text-[10px] text-white/50 text-right uppercase tracking-widest">{services[0].highlightLabel}</div>
                  <div className="font-space-grotesk text-4xl font-black text-[#E63B2E]">{services[0].highlight}</div>
                </div>
                <div className="absolute inset-x-4 bottom-4 h-full bg-[#2A2A35] rounded-2xl transform -translate-y-2 scale-95 z-20 opacity-80" />
                <div className="absolute inset-x-8 bottom-8 h-full bg-[#0D0D12] rounded-2xl transform -translate-y-4 scale-90 z-10 opacity-60" />
              </div>
            </div>

            {/* CARD 2: Current Accounts (Diagnostic Shuffler Variation) */}
            <div className="relative bg-[#111111] rounded-[2rem] border border-white/10 overflow-hidden shadow-xl p-8 flex flex-col group min-h-[480px]">
              <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] mix-blend-overlay" />
              <div className="relative z-10 flex justify-between items-start mb-8">
                <span className="font-mono text-xs font-bold text-[#E8E4DD] bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">Sys_02</span>
                <Wallet className="w-6 h-6 text-[#E8E4DD]" />
              </div>
              <h3 className="font-space-grotesk text-2xl font-black text-[#E8E4DD] mb-2 relative z-10">{services[1].title}</h3>
              <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest relative z-10">{services[1].subtitle}</p>
              <p className="font-space-mono text-sm text-[#E8E4DD]/60 mb-6 leading-relaxed relative z-10">
                {services[1].description}
              </p>
              
              <div className="space-y-2 mb-8 relative z-10">
                {services[1].features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#E8E4DD]/70">
                    <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                  </div>
                ))}
              </div>

              <div className="relative h-32 mt-auto perspective-1000 z-10">
                <div className="absolute inset-x-0 bottom-0 h-full bg-[#E8E4DD] rounded-2xl p-4 shadow-2xl transform transition-transform duration-700 group-hover:-translate-y-4 group-hover:scale-105 z-30 flex flex-col justify-between">
                  <div className="font-mono text-[10px] text-[#111111]/50 text-right uppercase tracking-widest">{services[1].highlightLabel}</div>
                  <div className="font-space-grotesk text-4xl font-black text-[#111111]">{services[1].highlight}</div>
                </div>
                <div className="absolute inset-x-4 bottom-4 h-full bg-white/80 rounded-2xl transform -translate-y-2 scale-95 z-20" />
                <div className="absolute inset-x-8 bottom-8 h-full bg-white/60 rounded-2xl transform -translate-y-4 scale-90 z-10" />
              </div>
            </div>

            {/* CARD 3: Mobile Banking (Telemetry Typewriter) */}
            <div className="relative bg-[#E8E4DD] rounded-[2rem] border border-[#111111]/10 overflow-hidden shadow-xl p-8 flex flex-col min-h-[480px]">
              <div className="flex justify-between items-start mb-8">
                <span className="font-mono text-xs font-bold text-[#111111] border border-[#111111]/20 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63B2E] animate-pulse" />
                  Live Feed
                </span>
                <Smartphone className="w-6 h-6 text-[#111111]" />
              </div>
              <h3 className="font-space-grotesk text-2xl font-black text-[#111111] mb-2">{services[2].title}</h3>
              <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest">{services[2].subtitle}</p>
              <p className="font-space-mono text-sm text-[#111111]/60 mb-6 leading-relaxed">
                {services[2].description}
              </p>
              
              <div className="space-y-2 mb-8">
                {services[2].features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#111111]/70">
                    <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                  </div>
                ))}
              </div>
              
              <div className="mt-auto bg-[#111111] rounded-xl p-4 border border-[#111111]/10 font-mono text-xs text-[#E8E4DD]/80 font-medium h-32 overflow-hidden flex flex-col justify-end shadow-inner">
                <div className="space-y-2">
                  <div className="opacity-40">&gt; BIOMETRIC_AUTH... OK.</div>
                  <div className="opacity-60">&gt; P2P_CONNECTION_SECURE.</div>
                  <div className="text-[#E63B2E] flex justify-between items-center">
                    <span>&gt; {services[2].highlightLabel.toUpperCase()}...</span>
                    <span className="font-bold">{services[2].highlight}</span>
                  </div>
                  <div className="text-[#E8E4DD]">&gt; SYSTEM_READY<span className="animate-pulse text-[#E63B2E]">_</span></div>
                </div>
              </div>
            </div>

            {/* CARD 4: Debit & Virtual Cards (Cursor Protocol Scheduler) */}
            <div className="relative bg-[#111111] rounded-[2rem] border border-white/10 overflow-hidden shadow-xl p-8 flex flex-col group min-h-[480px]">
              <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] mix-blend-overlay" />
              <div className="relative z-10 flex justify-between items-start mb-8">
                <span className="font-mono text-xs font-bold text-[#E8E4DD] bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">Sys_04</span>
                <CreditCard className="w-6 h-6 text-[#E8E4DD]" />
              </div>
              <h3 className="font-space-grotesk text-2xl font-black text-[#E8E4DD] mb-2 relative z-10">{services[3].title}</h3>
              <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest relative z-10">{services[3].subtitle}</p>
              <p className="font-space-mono text-sm text-[#E8E4DD]/60 mb-6 leading-relaxed relative z-10">
                {services[3].description}
              </p>
              
              <div className="space-y-2 mb-8 relative z-10">
                {services[3].features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#E8E4DD]/70">
                    <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                  </div>
                ))}
              </div>
              
              <div className="mt-auto relative h-32 bg-[#E8E4DD] rounded-xl border border-white/10 p-2 grid grid-cols-7 gap-1 z-10">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className={`rounded-md transition-colors duration-500 ${i === 8 ? 'bg-[#E63B2E]/20 border border-[#E63B2E]' : 'bg-[#111111]/10'}`} />
                ))}
                <motion.div 
                  className="absolute z-10 w-4 h-4 text-[#E63B2E]"
                  animate={{
                    x: [10, 80, 80, 20],
                    y: [10, 40, 40, 80],
                    scale: [1, 1, 0.8, 1]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.4, 0.5, 1]
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l16 16m0 0V4m0 16H4" />
                  </svg>
                </motion.div>
                
                <div className="absolute bottom-2 right-2 px-3 py-1 bg-[#111111] flex flex-col items-end rounded-lg">
                  <div className="text-[#E63B2E] font-space-grotesk text-sm font-black leading-none">{services[3].highlight}</div>
                  <div className="text-[#E8E4DD]/60 font-mono text-[8px] uppercase">{services[3].highlightLabel}</div>
                </div>
              </div>
            </div>

            {/* CARD 5: Student Banking (Cursor Protocol Scheduler Variation) */}
            <div className="relative bg-[#E8E4DD] rounded-[2rem] border border-[#111111]/10 overflow-hidden shadow-xl p-8 flex flex-col group min-h-[480px]">
              <div className="flex justify-between items-start mb-8">
                <span className="font-mono text-xs font-bold text-[#111111] bg-[#111111]/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">Sys_05</span>
                <GraduationCap className="w-6 h-6 text-[#111111]" />
              </div>
              <h3 className="font-space-grotesk text-2xl font-black text-[#111111] mb-2">{services[4].title}</h3>
              <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest">{services[4].subtitle}</p>
              <p className="font-space-mono text-sm text-[#111111]/60 mb-6 leading-relaxed">
                {services[4].description}
              </p>
              
              <div className="space-y-2 mb-8">
                {services[4].features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#111111]/70">
                    <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                  </div>
                ))}
              </div>
              
              <div className="mt-auto relative h-32 bg-white rounded-xl border border-[#111111]/10 p-2 grid grid-cols-4 gap-2">
                 <div className="col-span-4 bg-[#111111]/5 rounded-md flex items-center px-4">
                    <div className="font-mono text-xs font-bold text-[#111111]">LIMITS: OPTIMIZED</div>
                 </div>
                 <div className="col-span-2 row-span-2 bg-[#E63B2E]/10 rounded-md border border-[#E63B2E]/30 flex flex-col items-center justify-center p-2">
                    <div className="font-space-grotesk text-2xl font-black text-[#E63B2E] leading-none">{services[4].highlight}</div>
                    <div className="font-mono text-[8px] text-[#111111]/60 uppercase mt-1 text-center">{services[4].highlightLabel}</div>
                 </div>
                 <div className="col-span-2 bg-[#111111]/5 rounded-md" />
                 <div className="col-span-2 bg-[#111111]/10 rounded-md" />
                 
                 <motion.div 
                  className="absolute z-10 w-4 h-4 text-[#111111]"
                  animate={{
                    x: [180, 60, 60, 180],
                    y: [10, 50, 50, 80],
                    scale: [1, 1, 0.8, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.4, 0.5, 1]
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l16 16m0 0V4m0 16H4" />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* CARD 6: Customer Support (Telemetry Typewriter Variation) */}
            <div className="relative bg-[#111111] rounded-[2rem] border border-white/10 overflow-hidden shadow-xl p-8 flex flex-col min-h-[480px]">
              <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] mix-blend-overlay" />
              <div className="relative z-10 flex justify-between items-start mb-8">
                <span className="font-mono text-xs font-bold text-white/50 border border-white/20 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63B2E] animate-pulse" />
                  Active Link
                </span>
                <Headphones className="w-6 h-6 text-[#E8E4DD]" />
              </div>
              <h3 className="font-space-grotesk text-2xl font-black text-[#E8E4DD] mb-2 relative z-10">{services[5].title}</h3>
              <p className="font-space-mono text-xs text-[#E63B2E] mb-4 font-bold uppercase tracking-widest relative z-10">{services[5].subtitle}</p>
              <p className="font-space-mono text-sm text-[#E8E4DD]/60 mb-6 leading-relaxed relative z-10">
                {services[5].description}
              </p>
              
              <div className="space-y-2 mb-8 relative z-10">
                {services[5].features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-space-mono text-[#E8E4DD]/70">
                    <span className="w-1 h-1 bg-[#E63B2E] rounded-full" /> {feat}
                  </div>
                ))}
              </div>
              
              <div className="mt-auto bg-[#E8E4DD] rounded-xl p-4 border border-white/10 font-mono text-xs text-[#111111] font-medium h-32 overflow-hidden flex flex-col justify-end shadow-inner relative z-10">
                <div className="space-y-2">
                  <div className="opacity-60">&gt; INCOMING_QUERY_DETECTED.</div>
                  <div className="opacity-80">&gt; ROUTING_TO_SPECIALIST...</div>
                  <div className="text-[#E63B2E] flex justify-between items-center bg-[#E63B2E]/10 px-2 py-1 rounded">
                    <span>&gt; {services[5].highlightLabel.toUpperCase()}</span>
                    <span className="font-bold">{services[5].highlight}</span>
                  </div>
                  <div className="text-[#111111]">&gt; SPECIALIST_CONNECTED<span className="animate-pulse text-[#E63B2E]">_</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>




      {/* PROTOCOL E: Sticky Stacking Archive (Customer Stories) */}
      <section ref={archiveRef} className="bg-[#0D0D12] relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Intro */}
        <div className="pt-32 pb-16 container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-5xl md:text-7xl font-space-grotesk font-black text-[#E8E4DD] uppercase tracking-tighter leading-none mb-6">
              Verified <span className="font-drama italic text-[#C9A84C] lowercase text-6xl md:text-8xl">Telemetry.</span>
            </h2>
            <p className="font-space-mono text-[#E8E4DD]/70 max-w-xl mx-auto text-sm md:text-base uppercase tracking-widest leading-relaxed">
              Consensus reports from the active user matrix.
            </p>
        </div>

        {/* Stacking Cards */}
        <div className="relative pb-32">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="archive-card h-screen w-full flex items-center justify-center sticky top-0"
            >
              <div className={`w-full max-w-5xl mx-4 md:mx-auto h-[70vh] rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 flex flex-col justify-between relative overflow-hidden shadow-2xl ${
                index === 0 ? 'bg-[#1A1A1A] border border-white/10' : 
                index === 1 ? 'bg-[#2A2A35] border border-white/10' : 
                'bg-[#0D0D12] border border-[#C9A84C]/30'
              }`}>
                {/* Background Animation Canvas */}
                <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                  {index === 0 && (
                    <motion.svg className="w-full h-full text-[#E8E4DD]" viewBox="0 0 100 100" animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
                      <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                    </motion.svg>
                  )}
                  {index === 1 && (
                    <div className="w-full h-full relative">
                      <motion.div className="absolute top-0 bottom-0 w-px bg-[#E8E4DD]/50" animate={{ left: ['0%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                      <div className="w-full h-full opacity-30 bg-[url('/grid.svg')] bg-[length:40px_40px]" />
                    </div>
                  )}
                  {index === 2 && (
                    <motion.svg className="w-full h-40 text-[#C9A84C]" viewBox="0 0 200 40">
                      <motion.path 
                        d="M0,20 L40,20 L50,0 L60,40 L70,20 L200,20" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        initial={{ strokeDasharray: 300, strokeDashoffset: 300 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.svg>
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 flex justify-between items-start">
                  <span className="font-mono text-xs md:text-sm font-bold text-[#E8E4DD]/50 border border-white/20 px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-3 bg-black/40 backdrop-blur-md">
                    <span className={`w-2 h-2 rounded-full ${index === 2 ? 'bg-[#C9A84C]' : 'bg-[#E8E4DD]'} animate-pulse`} />
                    LOG_ENTRY_0{index + 1}
                  </span>
                  <div className="font-mono text-4xl text-[#E8E4DD]/10 font-black">0{index + 1}</div>
                </div>

                <div className="relative z-10 my-auto max-w-4xl">
                  <div className="font-drama italic text-3xl md:text-5xl lg:text-7xl text-[#E8E4DD] leading-tight mb-8">
                    "{testimonial.quote}"
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-xl font-space-grotesk font-black text-[#0D0D12] ${
                      index === 2 ? 'bg-[#C9A84C]' : 'bg-[#E8E4DD]'
                    }`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-space-grotesk text-xl md:text-2xl font-black text-[#E8E4DD] uppercase">{testimonial.author}</div>
                      <div className="font-space-mono text-xs md:text-sm text-[#E8E4DD]/50 uppercase tracking-widest">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Security Section */}
      <section className="py-32 bg-[#F5F3EE] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Left: Security Typography */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#E63B2E]/10 rounded-full font-mono text-xs font-bold text-[#E63B2E] uppercase tracking-widest mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E63B2E] animate-pulse" />
                Active Shield Protocol
              </span>
              <h2 className="text-5xl md:text-7xl font-space-grotesk font-black text-[#111111] leading-none tracking-tighter mb-8">
                Bank with <br />
                <span className="font-drama italic text-[#E63B2E] lowercase text-6xl md:text-8xl">Peace of Mind.</span>
              </h2>
              <p className="font-space-mono text-[#111111]/70 mb-12 uppercase tracking-widest leading-relaxed text-sm">
                Your capital is protected by military-grade cryptographic protocols and absolute NDIC insurance coverage.
              </p>
              
              <div className="grid gap-6">
                {[
                  'NDIC Insured Deposits',
                  '256-bit SSL Encryption',
                  '24/7 Fraud Monitoring',
                  'CBN Regulated Infrastructure'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full border border-[#E63B2E]/30 bg-[#E63B2E]/5 flex items-center justify-center text-[#E63B2E] group-hover:bg-[#E63B2E] group-hover:text-white transition-colors duration-300">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-space-mono text-sm font-bold text-[#111111] uppercase tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Brutalist Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '₦50M', label: 'NDIC Coverage', icon: <Shield className="w-6 h-6" /> },
                { value: '99.9%', label: 'Uptime SLA', icon: <Zap className="w-6 h-6" /> },
                { value: '2FA', label: 'Authentication', icon: <Lock className="w-6 h-6" /> },
                { value: '0.0%', label: 'Fraud Loss Rate', icon: <Shield className="w-6 h-6" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-[#111111]/10 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-full bg-[#E63B2E]/10 flex items-center justify-center text-[#E63B2E] mb-6 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="font-space-grotesk text-3xl md:text-4xl font-black text-[#111111] mb-2 leading-none">{stat.value}</div>
                  <div className="font-space-mono text-[10px] text-[#111111]/50 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Terminal Execution CTA */}
      <section className="py-32 relative overflow-hidden bg-[#0D0D12]">
        {/* Deep noise and radial glow */}
        <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-[#E63B2E]/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="flex justify-center mb-8">
              <span className="font-mono text-xs font-bold text-[#E63B2E] border border-[#E63B2E]/30 px-4 py-2 rounded-full uppercase tracking-widest bg-[#E63B2E]/10">
                Sequence Authorization
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-space-grotesk font-black text-[#E8E4DD] leading-none tracking-tighter mb-8">
              Start Banking <br />
              <span className="font-drama italic text-[#C9A84C] lowercase">Smarter.</span>
            </h2>
            
            <p className="font-space-mono text-[#E8E4DD]/60 mb-16 uppercase tracking-widest leading-relaxed text-sm max-w-2xl mx-auto">
              Open a digital account in under 3 minutes. Experience financial infrastructure engineered for total precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register">
                {/* Magnetic Primary Button */}
                <div className="relative group overflow-hidden rounded-[2rem] p-[2px] cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E63B2E] to-[#C9A84C] opacity-80 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
                  <div className="absolute inset-[2px] bg-[#0D0D12] rounded-[2rem] z-0 transition-opacity duration-300 group-hover:opacity-0" />
                  <div className="relative z-10 px-10 py-5 bg-[#E8E4DD] text-[#0D0D12] font-space-grotesk font-black text-lg uppercase tracking-wider rounded-[2rem] flex items-center justify-center gap-3 transform transition-transform duration-500 hover:scale-[1.03] active:scale-95 shadow-2xl">
                    <Zap className="w-5 h-5 text-[#E63B2E]" />
                    <span>Open Free Account</span>
                  </div>
                </div>
              </Link>
              
              <Link href="/contact">
                {/* Ghost Output Button */}
                <div className="px-10 py-5 bg-transparent border border-[#E8E4DD]/20 text-[#E8E4DD] font-space-grotesk font-black text-lg uppercase tracking-wider rounded-[2rem] hover:bg-[#E8E4DD]/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                  <span>Speak to an Advisor</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

