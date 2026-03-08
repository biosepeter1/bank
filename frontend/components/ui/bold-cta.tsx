'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Zap } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';

export function BoldCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Magnetic effect for the primary button
      const button = buttonRef.current;
      if (button) {
        const onMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const { left, top, width, height } = button.getBoundingClientRect();
          const x = clientX - (left + width / 2);
          const y = clientY - (top + height / 2);
          
          gsap.to(button, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: "power2.out"
          });
        };

        const onMouseLeave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
          });
        };

        button.addEventListener('mousemove', onMouseMove);
        button.addEventListener('mouseleave', onMouseLeave);
        return () => {
          button.removeEventListener('mousemove', onMouseMove);
          button.removeEventListener('mouseleave', onMouseLeave);
        };
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="bg-[#111111] py-32 md:py-48 relative overflow-hidden flex items-center justify-center border-t border-white/5"
    >
      {/* Background Texture */}
      <div 
        className="absolute inset-x-0 -top-40 bottom-0 bg-cover bg-center grayscale opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070")' }}
      />
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* System Status */}
          <div className="inline-flex items-center gap-3 mb-12 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-[#E63B2E] animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.4em] text-[#E63B2E]">
              INITIALIZE_PROTOCOL_09
            </span>
          </div>

          <h2 className="font-space-grotesk text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-16 uppercase">
            READY TO <br/>
            <span className="text-[#E63B2E]">SCALE?</span>
          </h2>

          <p className="font-space-grotesk text-xl md:text-2xl text-white/40 mb-20 max-w-2xl mx-auto leading-tight font-medium">
            Deploy your private banking infrastructure in under 180 seconds. 
            No paperwork. No fragmentation. Pure precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/register">
              <button
                ref={buttonRef}
                className="group relative h-20 px-12 bg-[#E63B2E] text-white flex items-center gap-4 overflow-hidden rounded-[2rem] transition-transform hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
                <span className="relative z-10 font-space-grotesk text-xl font-black uppercase tracking-tight">Deploy Interface</span>
                <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </Link>

            <Link href="/contact">
              <button className="h-20 px-12 border-2 border-[#E8E4DD]/20 text-[#E8E4DD] rounded-[2rem] font-mono text-sm font-bold uppercase tracking-widest hover:bg-[#E8E4DD]/5 transition-colors flex items-center gap-3 group">
                <Activity size={18} className="text-[#E63B2E] group-hover:rotate-180 transition-transform duration-700" />
                GET_DATA_PACK
              </button>
            </Link>
          </div>

          {/* System Ready Indicator */}
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            {["ZERO_LATENCY", "ENCRYPTED_SSL", "GLOBAL_STABLE"].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <Zap size={14} className="text-[#E63B2E] opacity-50" />
                <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
