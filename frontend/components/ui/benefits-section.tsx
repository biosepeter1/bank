'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Smartphone, Zap, TrendingUp, CreditCard, Globe, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: <Smartphone size={28} />,
    title: "Mobile-First Banking",
    description: "Your entire bank fits in your pocket. Pay, save, and invest with just a tap.",
    code: "010100 FAST_SYNC"
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Military-Grade Security",
    description: "256-bit encryption, biometrics, and real-time fraud detection protect every transaction.",
    code: "SEC_PROTOCOL_ACTIVE"
  },
  {
    icon: <Zap size={28} />,
    title: "Instant Everything",
    description: "Lightning-fast transfers, real-time notifications, and zero-lag performance.",
    code: "LATENCY < 2MS"
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Grow Your Wealth",
    description: "High-yield savings up to 15% APY. Watch your money work harder for you.",
    code: "ROI_OPTIMIZED"
  },
  {
    icon: <CreditCard size={28} />,
    title: "Virtual & Physical Cards",
    description: "Create unlimited virtual cards instantly. Shop globally with zero FX fees.",
    code: "CARD_EMISSION_99"
  },
  {
    icon: <Globe size={28} />,
    title: "Global Transfers",
    description: "Send money to 150+ countries with the best exchange rates. Arrives in minutes.",
    code: "CROSS_BORDER_READY"
  }
];

export function BenefitsSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".brutalist-header > *", {
        scrollTrigger: {
          trigger: ".brutalist-header",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });

      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: ".brutalist-grid",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#E8E4DD] py-20 sm:py-32 relative overflow-hidden border-y-[1px] border-black/10"
    >
      {/* Background Texture Info Labels (Brutalist Style) */}
      <div className="absolute top-10 left-10 opacity-20 pointer-events-none hidden lg:block">
        <div className="font-mono text-[10px] tracking-widest text-black">SYSTEM_PROTOCOL // BENEFITS_GRID</div>
        <div className="font-mono text-[10px] tracking-widest text-black mt-1">LAT_76.223 LONG_9.112</div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="brutalist-header mb-20 md:mb-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-[#E63B2E]" />
            <span className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-[#E63B2E]">
              System Parameters
            </span>
          </div>
          
          <h2 className="font-space-grotesk text-5xl md:text-7xl lg:text-8xl font-black text-[#111111] leading-tight tracking-tighter">
            UPGRADE THE <br/>
            <span className="font-dm-serif-display italic font-normal text-[#E63B2E] text-6xl md:text-8xl lg:text-9xl ml-4 sm:ml-8">
              Protocol.
            </span>
          </h2>
          
          <div className="mt-12 max-w-xl">
            <p className="font-space-grotesk text-xl md:text-2xl text-[#111111] leading-tight font-medium">
              We've eliminated the friction of traditional banking. 
              Pure information density, raw precision, and zero limits.
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="brutalist-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={el => { cardsRef.current[index] = el }}
              className="group relative bg-[#F5F3EE] p-10 border border-black/5 flex flex-col justify-between transition-colors duration-300 hover:bg-white"
            >
              <div>
                <div className="flex justify-between items-start mb-12">
                  <div className="text-[#E63B2E] transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <div className="font-mono text-[10px] uppercase text-black/30 tracking-widest">
                    {benefit.code}
                  </div>
                </div>

                <h3 className="font-space-grotesk text-2xl font-black text-[#111111] mb-4 uppercase tracking-tight">
                  {benefit.title}
                </h3>
                <p className="font-space-grotesk text-[#111111]/70 leading-snug font-medium mb-8">
                  {benefit.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[#E63B2E] transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0">
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Initialize</span>
                <ArrowRight size={14} />
              </div>
              
              {/* Brutalist Accent Line */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E63B2E] transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
