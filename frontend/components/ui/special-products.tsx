'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Briefcase,
  Globe,
  PiggyBank,
  CreditCard,
  LineChart,
  GraduationCap
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    icon: <CreditCard size={28} />,
    title: "Virtual Cards",
    description: "Create unlimited virtual cards for safe online shopping with zero FX fees.",
    code: "CARD_SYS_v2.1"
  },
  {
    icon: <Globe size={28} />,
    title: "Global Transfers",
    description: "Send money to 150+ countries with the best exchange rates. Arrives in minutes.",
    code: "TRANS_X_GLOBAL"
  },
  {
    icon: <PiggyBank size={28} />,
    title: "High-Yield Savings",
    description: "Earn up to 15% interest p.a. on your savings goals. Watch your money grow.",
    code: "ROI_YIELD_MAX"
  },
  {
    icon: <Briefcase size={28} />,
    title: "Business Accounts",
    description: "Powerful tools for entrepreneurs. Invoicing, payroll, and multi-user access.",
    code: "BIZ_OPS_ALPHA"
  },
  {
    icon: <LineChart size={28} />,
    title: "Investment Hub",
    description: "Stocks, mutual funds, and fixed deposits. Grow your wealth with expert guidance.",
    code: "EQ_HUB_ACTIVE"
  },
  {
    icon: <GraduationCap size={28} />,
    title: "Education Trust",
    description: "Secure your child's future with our dedicated education savings plan.",
    code: "TRUST_SEC_99"
  },
];

export function SpecialProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgy = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Manifesto text animation
      const words = headlineRef.current?.querySelectorAll('.manifesto-word');
      if (words) {
        gsap.from(words, {
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
          },
          y: 60,
          opacity: 0,
          rotateX: -45,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out"
        });
      }

      // Cards stagger
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: ".products-grid",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#111111] py-24 sm:py-32 md:py-48 relative overflow-hidden"
    >
      {/* Parallax Background Texture */}
      <motion.div 
        style={{ y: bgy, backgroundImage: 'url("https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?q=80&w=2070&auto=format&fit=crop")' }}
        className="absolute inset-x-0 -top-20 bottom-0 bg-cover bg-center grayscale opacity-10 pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Manifesto Section */}
        <div ref={headlineRef} className="max-w-6xl mb-32 md:mb-48">
          <div className="inline-flex items-center gap-3 mb-10 overflow-hidden">
            <div className="h-px w-8 bg-[#E63B2E]/50" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.4em] text-[#E63B2E] manifesto-word">
              The Philosophy
            </span>
          </div>

          <div className="space-y-4">
            <p className="font-space-grotesk text-xl md:text-3xl lg:text-4xl text-white/40 leading-tight manifesto-word">
              Most banking focuses on: <span className="text-white/60">fragmented legacy systems.</span>
            </p>
            <h2 className="font-space-grotesk text-5xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter">
              <span className="manifesto-word inline-block">WE FOCUS </span>
              <span className="manifesto-word inline-block text-[#E63B2E]">ON:</span><br/>
              <span className="font-dm-serif-display italic font-normal text-[#E63B2E] manifesto-word inline-block mt-4 md:mt-8">
                Integrated Protocols.
              </span>
            </h2>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {products.map((product, index) => (
            <div
              key={index}
              ref={(el) => { if (el) cardsRef.current[index] = el; }}
              className="group relative bg-[#111111] p-10 md:p-14 hover:bg-[#1a1a1a] transition-colors duration-500 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-16">
                  <div className="text-[#E63B2E] w-12 h-12 flex items-center justify-center bg-[#E63B2E]/10 rounded-full group-hover:bg-[#E63B2E] group-hover:text-white transition-all duration-300">
                    {product.icon}
                  </div>
                  <span className="font-mono text-[10px] uppercase text-white/20 tracking-widest mt-2">
                    {product.code}
                  </span>
                </div>

                <h3 className="font-space-grotesk text-2xl font-black text-white mb-4 uppercase tracking-tight">
                  {product.title}
                </h3>
                <p className="font-space-grotesk text-white/50 leading-relaxed font-medium max-w-xs">
                  {product.description}
                </p>
              </div>

              {/* Brutalist border effects */}
              <div className="absolute top-0 right-0 w-px h-full bg-white/5" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-white/5" />
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#E63B2E] transition-all duration-700 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
