'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Eye,
  Target,
  Compass,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSettings } from '@/contexts/SettingsContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const { settings } = useSettings();
  const siteName = settings?.general?.siteName || 'RDN Bank';

  // Hero slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    '/images/about-slide-1.png',
    '/images/about-slide-2.png',
    '/images/about-slide-3.png',
    '/images/about-slide-4.png',
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Protocol E: Stacking Animation
  useEffect(() => {
    const cards = gsap.utils.toArray('.stack-card');
    
    cards.forEach((card: any, index: number) => {
      // Pin each card at the top
      ScrollTrigger.create({
        trigger: card,
        start: "top top",
        pin: true,
        pinSpacing: false,
        // The card stays pinned until the next one covers it completely
        end: () => `+=${window.innerHeight}`, 
      });

      // Animate the PREVIOUS card as this one moves in
      if (index > 0) {
        gsap.to(cards[index - 1], {
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
          scale: 0.9,
          filter: "blur(20px)",
          opacity: 0.5,
          ease: "none"
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Vision, Mission, Strategy cards
  const visionCards = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Our Vision',
      description: 'To be the undisputed leading and dominant financial services institution in our region.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Our Mission',
      description: 'To be a role model by creating superior value for all our stakeholders through excellence.',
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: 'Our Strategy',
      description: 'Our strategy revolves around innovation, customer-centricity and sustainable growth.',
    }
  ];

  // Feature cards with 3D artwork
  const featureCards = [
    {
      title: 'Our History',
      description: `${siteName} was established with a vision to transform banking. Over the years, we have evolved significantly, becoming one of the leading banks offering innovative services.`,
      image: '/images/about-history.png',
      href: '#history'
    },
    {
      title: 'Awards and Achievements',
      description: `${siteName} remains at the forefront of innovation in the financial services industry and has received numerous awards and accolades in recognition of its excellence.`,
      image: '/images/about-awards.png',
      href: '#awards'
    },
    {
      title: 'Leadership',
      description: 'Meet our board of directors and senior management comprising our Chair, Non-Executive Directors and Executive Directors.',
      image: '/images/about-leadership.png',
      href: '#leadership'
    },
    {
      title: "CEO's Overview",
      description: `At ${siteName}, our CEO is committed to excellence and innovation. We focus on customer satisfaction, technological advancement, and sustainable growth.`,
      image: '/images/about-ceo.png',
      href: '#ceo'
    },
    {
      title: 'Our Strategy',
      description: `At ${siteName}, our strategy is guided by a deep commitment to delivering value to our customers, shareholders, and communities.`,
      image: '/images/about-strategy.png',
      href: '#strategy'
    },
    {
      title: 'Global Presence',
      description: 'With branches in key financial centres across the region, we bring our innovative banking services to a diverse and international clientele.',
      image: '/images/about-global.png',
      href: '#global'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section — "The Opening Shot" (Brutalist Signal Refactor) */}
      <section className="relative h-[100dvh] w-full overflow-hidden flex items-end">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={heroSlides[currentSlide]}
                alt={`Hero Background ${currentSlide + 1}`}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Solid Dark Overlay (No Gradient per User Request) */}
          <div className="absolute inset-0 bg-black/60 z-10" />
          
          {/* Global Noise Overlay */}
          <div className="absolute inset-0 z-20 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        <div className="container mx-auto px-6 md:px-12 pb-24 md:pb-32 relative z-30">
          <div className="max-w-4xl text-left">
            {/* Staggered Content Container */}
            <div id="hero-content">
              {/* Identity Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#E63B2E]/30 bg-[#E63B2E]/10 rounded-full mb-8"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#E63B2E] animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#E63B2E]">
                  PROTOCOL_ABOUT_EST_ALPHA
                </span>
              </motion.div>

              {/* Massive Typography Contrast */}
              <div className="hero-typography mb-8">
                <h1 className="flex flex-col gap-2">
                  <motion.span 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="font-space-grotesk text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white/50"
                  >
                    SECURE THE
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="font-dm-serif italic text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-[#F5F3EE] leading-[0.85] -ml-1 sm:-ml-2"
                  >
                    TRUST.
                  </motion.span>
                </h1>
              </div>

              {/* Subheading Stagger */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="font-space-grotesk text-white/40 text-sm sm:text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-12"
              >
                {siteName} operates with a commitment to excellence, serving individuals,
                businesses, and organizations. We bring world-class banking to you,
                supporting trade, business growth, and financial sustainability.
              </motion.p>

              {/* CTA Stagger - Magnetic Buttons implemented via CSS classes */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="flex flex-wrap gap-6"
              >
                <Link href="/register">
                  <button className="group relative px-10 py-5 bg-[#E63B2E] overflow-hidden rounded-full transition-all active:scale-95">
                    <span className="relative z-10 font-space-grotesk font-black text-white flex items-center gap-3">
                      OPEN ACCOUNT
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </button>
                </Link>
                
                <Link href="/contact" className="group flex items-center gap-4 text-white hover:text-[#E63B2E] transition-colors">
                  <span className="font-mono text-xs font-black uppercase tracking-widest border-b-2 border-white/10 pb-1 group-hover:border-[#E63B2E]">
                    ESTABLISH_CONTACT
                  </span>
                  <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#E63B2E] group-hover:border-[#E63B2E] transition-all">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Banking Excellence Section — Brutalist Refactor */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="font-mono text-[10px] text-[#E63B2E] font-black uppercase tracking-[0.5em]">
                ESTABLISHED_EXCELLENCE_1996
              </span>
              <h2 className="font-space-grotesk text-5xl md:text-7xl font-black text-[#111111] leading-[0.9] uppercase tracking-tighter">
                Decades of <br/> 
                <span className="text-[#E63B2E]">Banking.</span>
              </h2>
            </motion.div>

            {/* Right - Description */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-space-grotesk text-lg md:text-xl text-[#111111]/60 leading-relaxed space-y-8 font-medium border-l border-black/10 pl-8 md:pl-16"
            >
              <p>
                For years, we have delivered superior financial services to individuals,
                businesses, governments, and global organizations. Our wide range of
                products and services meets the needs of millions of retail clients seeking
                savings, security and financial inclusion.
              </p>
              <p>
                We serve global businesses requiring sophisticated trade finance solutions.
                Our ability to combine last-mile payments with global FX and treasury
                products makes us the partner of choice for anyone seeking global solutions
                with local execution.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Strategy Section — Brutalist Aesthetic */}
      <section className="py-24 bg-[#F5F3EE] relative overflow-hidden border-t border-black/5">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left mb-16"
          >
            <span className="font-mono text-[10px] text-[#E63B2E] font-black uppercase tracking-[0.3em] mb-4 block">
              // CORE_OBJECTIVES
            </span>
            <h2 className="font-space-grotesk text-4xl md:text-6xl font-black text-[#111111] uppercase tracking-tighter">
              Operational <br/> <span className="text-[#E63B2E]">Principles.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {visionCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2rem] p-8 border border-black/5 hover:border-[#E63B2E] transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                <div className={`w-16 h-16 rounded-2xl ${index === 0 ? 'bg-black' : index === 1 ? 'bg-[#E63B2E]' : 'bg-[#E8E4DD]'} flex items-center justify-center ${index === 2 ? 'text-black' : 'text-white'} mb-8 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="font-space-grotesk text-2xl font-black text-[#111111] uppercase tracking-tight mb-4">{card.title}</h3>
                <p className="font-space-grotesk text-[#111111]/60 leading-relaxed font-medium">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol E — "Sticky Stacking Archive" (6-Card Implementation) */}
      <section id="stacking-archive" className="relative bg-[#0D0D12] pt-24">
        <div className="container mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-12">
            <div>
              <span className="font-mono text-[10px] text-[#E63B2E] font-black uppercase tracking-[0.3em] mb-4 block">
                SYSTEM_ARCHIVE_v4.0
              </span>
              <h2 className="font-space-grotesk text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                Corporate <br/> <span className="text-[#E63B2E]">Foundation.</span>
              </h2>
            </div>
            <p className="font-space-grotesk text-white/40 max-w-md text-right font-medium">
              A comprehensive technical log of our evolution, leadership, and global infrastructure orchestration.
            </p>
          </div>
        </div>

        {/* The Stacking Container */}
        <div className="relative">
          {featureCards.map((card, index) => (
            <div 
              key={index} 
              className="stack-card h-screen w-full flex items-center justify-center overflow-hidden bg-[#0D0D12]"
            >
              {/* Card Surface */}
              <div className="relative w-[90%] h-[80%] bg-[#111111] border border-white/5 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 group overflow-hidden shadow-2xl">
                
                {/* Background Animation Overlay (Unique per card) */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                   {index === 0 && ( /* History: Rotating Concentric Circles */
                     <svg className="w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="0.1" fill="none" />
                       <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.1" fill="none" />
                       <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.1" fill="none" />
                       <line x1="50" y1="10" x2="50" y2="90" stroke="white" strokeWidth="0.1" />
                       <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="0.1" />
                     </svg>
                   )}
                   {index === 1 && ( /* Awards: Horizontal Laser Scan */
                     <div className="absolute inset-x-0 h-px bg-[#E63B2E] shadow-[0_0_20px_#E63B2E] animate-[laser_4s_ease-in-out_infinite]" />
                   )}
                   {index === 2 && ( /* Leadership: Pulsing Waveform */
                     <svg className="w-full h-full" viewBox="0 0 100 20">
                       <path 
                         d="M0 10 Q 5 0, 10 10 T 20 10 T 30 10 T 40 10 T 50 10 T 60 10 T 70 10 T 80 10 T 90 10 T 100 10" 
                         stroke="#E63B2E" 
                         fill="none" 
                         strokeWidth="0.5" 
                         className="animate-[pulse_2s_infinite]"
                       />
                     </svg>
                   )}
                   {index === 3 && ( /* CEO: Hexagonal Grid */
                     <div className="w-full h-full grid grid-cols-8 gap-4 p-4 opacity-10">
                       {Array.from({length: 32}).map((_, i) => (
                         <div key={i} className="aspect-square border border-white/20 rotate-45 animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                       ))}
                     </div>
                   )}
                   {index === 4 && ( /* Strategy: Vertical Scan */
                     <div className="absolute inset-y-0 w-px bg-white/20 animate-[scan-v_5s_linear_infinite]" />
                   )}
                   {index === 5 && ( /* Global: Radiating Signal */
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-[#E63B2E] rounded-full animate-ping" />
                        <div className="absolute inset-0 w-40 h-40 border border-[#E63B2E]/20 rounded-full animate-[ping_3s_linear_infinite] -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute inset-0 w-80 h-80 border border-[#E63B2E]/10 rounded-full animate-[ping_3s_linear_infinite_1.5s] -translate-x-1/2 -translate-y-1/2" />
                     </div>
                   )}
                </div>

                {/* Content Left */}
                <div className="relative z-10 flex-1 space-y-8">
                  <div className="space-y-4">
                    <span className="font-mono text-[10px] text-[#E63B2E] font-black uppercase tracking-[0.5em]">
                      ARCHIVE_ENTRY_0{index + 1}
                    </span>
                    <h3 className="font-space-grotesk text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                      {card.title.split(' ')[0]} <br/> 
                      <span className="text-white/20 group-hover:text-[#E63B2E] transition-colors duration-700">
                        {card.title.split(' ').slice(1).join(' ')}
                      </span>
                    </h3>
                  </div>
                  <p className="font-space-grotesk text-white/40 text-sm md:text-lg leading-relaxed max-w-xl">
                    {card.description}
                  </p>
                </div>

                {/* Image Right */}
                <div className="relative z-10 flex-1 w-full h-full max-h-[400px] md:max-h-none flex items-center justify-center p-4">
                  <div className="relative w-full aspect-square md:aspect-auto md:h-[80%] rounded-[2rem] overflow-hidden border border-white/10 shadow-3xl">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Styles for the specific animations */}
      <style jsx global>{`
        @keyframes laser {
          0%, 100% { top: 10%; opacity: 0; }
          40%, 60% { opacity: 1; }
          50% { top: 90%; }
        }
        @keyframes scan-v {
          0% { left: 0; opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>

      {/* Stats Section — Brutalist Signal Refactor */}
      <section className="py-24 bg-[#E63B2E] text-white relative overflow-hidden">
        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left mb-16 border-l-4 border-white pl-8"
          >
            <h2 className="font-space-grotesk text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              System <br/> <span className="text-white/40">Performance.</span>
            </h2>
            <p className="font-space-grotesk text-white/60 max-w-xl text-lg font-medium">
              Real-time synchronization and security metrics across our global banking infrastructure.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { value: '10+', label: 'Years of Excellence' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '₦10B+', label: 'Transactions Processed' },
              { value: '24/7', label: 'Customer Support' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/70 font-medium text-xs sm:text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* CTA Section — Brutalist Termination */}
      <section className="py-32 bg-[#F5F3EE] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#111111] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <span className="font-mono text-[10px] text-[#E63B2E] font-black uppercase tracking-[0.5em]">
                  SECURE_INITIALIZATION_v4
                </span>
                <h2 className="font-space-grotesk text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
                  Begin the <br/> <span className="text-[#E63B2E]">Protocol.</span>
                </h2>
              </div>
              
              <p className="font-space-grotesk text-white/40 text-lg md:text-2xl max-w-2xl mx-auto font-medium">
                Join the thousands of architects of the future who trust our global banking infrastructure.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link href="/register">
                  <button className="group relative px-12 py-6 bg-[#E63B2E] overflow-hidden rounded-full transition-all active:scale-95">
                    <span className="relative z-10 font-space-grotesk font-black text-white flex items-center gap-3 text-xl">
                      CREATE ACCOUNT
                      <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </button>
                </Link>
                
                <Link href="/contact" className="group flex items-center gap-4 text-white hover:text-[#E63B2E] transition-colors">
                  <span className="font-mono text-sm font-black uppercase tracking-widest border-b-2 border-white/10 pb-1 group-hover:border-[#E63B2E]">
                    REQUEST_CONSULTATION
                  </span>
                  <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#E63B2E] group-hover:border-[#E63B2E] transition-all">
                    <ArrowRight size={20} />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div >
  );
}
