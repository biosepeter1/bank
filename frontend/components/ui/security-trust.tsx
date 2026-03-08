'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Fingerprint, BadgeCheck, Star, Quote, ChevronRight, Activity } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Sub-Components for Functional Artifacts ---

// 1. Fraud Detection Engine
const DiagnosticShuffler = () => {
  const [items, setItems] = useState([
    { id: 1, label: "SECURE_TRANSACTION", status: "SECURE" },
    { id: 2, label: "ENCRYPT_PROT_V3", status: "LOCKED" },
    { id: 3, label: "AUDIT_VERIFIED", status: "VERIFIED" }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setItems(prev => {
        const next = [...prev];
        const last = next.pop();
        if (last) next.unshift(last);
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-48 w-full flex items-center justify-center perspective-1000">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{
              opacity: 1 - index * 0.3,
              y: index * -20,
              z: index * -50,
              scale: 1 - index * 0.05,
              zIndex: 10 - index
            }}
            exit={{ opacity: 0, y: -100, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute w-full max-w-[280px] bg-white border border-black/10 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#E63B2E]/10 flex items-center justify-center text-[#E63B2E]">
                <Shield size={16} />
              </div>
              <span className="font-mono text-[10px] text-[#E63B2E] font-bold">{item.status}</span>
            </div>
            <div className="font-mono text-xs tracking-tighter text-black/40 mb-1">DATA_STREAM_{item.id}</div>
            <div className="font-space-grotesk font-black text-sm uppercase text-black">{item.label}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// 2. Immutable Audit Logging
const TelemetryTypewriter = () => {
  const [text, setText] = useState('');
  const messages = [
    "> AES_256_INIT",
    "> SECURE_HANDSHAKE",
    "> CERT_VERIFIED",
    "> AUTH_STABLE_001",
    "> SECURITY_ACTIVE"
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= messages[msgIndex].length) {
        setText(messages[msgIndex].substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 2000);
      }
    }, 50);
    return () => clearInterval(typeInterval);
  }, [msgIndex]);

  return (
    <div className="bg-black rounded-2xl p-6 h-48 flex flex-col justify-between overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E63B2E] animate-pulse" />
          <span className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Live Feed</span>
        </div>
        <Activity size={14} className="text-[#E63B2E] opacity-50" />
      </div>
      <div className="font-mono text-sm text-[#E63B2E] leading-relaxed">
        {text}
        <span className="inline-block w-2 h-4 bg-[#E63B2E] ml-1 animate-blink" />
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex gap-1">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-[#E63B2E]/40"
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Cursor Biometric Access Control
const CursorProtocolScheduler = () => {
  return (
    <div className="relative bg-white border border-black/5 rounded-2xl p-6 h-48 flex flex-col">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="font-mono text-[10px] text-center text-black/20 uppercase font-black">{day}</div>
        ))}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            id={`cell-${i}`}
            className={`aspect-square rounded-md border border-black/5 flex items-center justify-center text-[10px] font-mono ${i === 8 ? 'bg-[#E63B2E] text-white' : 'bg-black/2'}`}
          >
            {i + 1}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-auto bg-black text-white font-mono text-[10px] py-2 px-4 rounded-full self-start flex items-center gap-2"
        animate={{ scale: [1, 0.95, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      >
        SAVE_SETTINGS
      </motion.div>

      {/* Animated Cursor */}
      <motion.div
        className="absolute top-0 left-0 text-[#E63B2E] pointer-events-none z-20"
        animate={{
          x: [20, 120, 120, 20, 20],
          y: [20, 60, 60, 150, 20],
          scale: [1, 1, 0.9, 1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.64 2l12.13 12.13-4.66.57 2.89 6.27-1.89.87-2.88-6.27-5.59 5.59V2z" />
        </svg>
      </motion.div>
    </div>
  );
};

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Global Logistics Director",
    avatar: "SM",
    content: "The platform reliability is exceptional. We have not seen a single security bottleneck since deployment.",
    rating: 5
  },
  {
    name: "David Chen",
    role: "Lead Architect",
    avatar: "DC",
    content: "Minimalist density done right. Every interaction feels weighted and intentional. Pure digital excellence.",
    rating: 5
  },
  {
    name: "Amina Okafor",
    role: "Financial Director",
    avatar: "AO",
    content: "Growth yields have outperformed every legacy benchmark we previously tracked. Essential tool.",
    rating: 5
  }
];

export function SecurityTrust() {
  return (
    <section className="bg-[#F5F3EE] py-24 sm:py-32 md:py-48 relative overflow-hidden border-t border-black/5">
      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="max-w-4xl mb-24 md:mb-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[2px] w-12 bg-[#E63B2E]" />
            <span className="font-mono text-sm font-bold uppercase tracking-[0.3em] text-[#E63B2E]">
              Security Protocol
            </span>
          </div>

          <h2 className="font-space-grotesk text-5xl md:text-7xl lg:text-8xl font-black text-black leading-[0.9] tracking-tighter mb-12">
            YOUR MONEY IS <br />
            <span className="font-dm-serif-display italic font-normal text-[#E63B2E]">Fort Knox Safe.</span>
          </h2>

          <p className="font-space-grotesk text-xl md:text-2xl text-black/60 max-w-2xl leading-snug font-medium">
            We use the same high-intensity security protocols trusted by the world's largest financial institutions.
            Zero compromise, raw precision.
          </p>
        </div>

        {/* Functional Artifacts Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-32">
          {/* Card 1 */}
          <div className="group bg-[#E8E4DD] p-8 md:p-10 rounded-[2.5rem] border border-black/5 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-500">
            <DiagnosticShuffler />
            <div className="mt-8">
              <h3 className="font-space-grotesk text-2xl font-black text-black mb-4 uppercase tracking-tight">Fraud Detection Engine</h3>
              <p className="font-space-grotesk text-black/50 leading-relaxed font-medium">Real-time fraud detection cycling through active data packets to ensure total integrity.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-[#E8E4DD] p-8 md:p-10 rounded-[2.5rem] border border-black/5 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-500">
            <TelemetryTypewriter />
            <div className="mt-8">
              <h3 className="font-space-grotesk text-2xl font-black text-black mb-4 uppercase tracking-tight">Immutable Audit Logging</h3>
              <p className="font-space-grotesk text-black/50 leading-relaxed font-medium">Live terminal feed detailing every encryption handshake and verification protocol in real-time.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-[#E8E4DD] p-8 md:p-10 rounded-[2.5rem] border border-black/5 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-500">
            <CursorProtocolScheduler />
            <div className="mt-8">
              <h3 className="font-space-grotesk text-2xl font-black text-black mb-4 uppercase tracking-tight">Biometric Access Control</h3>
              <p className="font-space-grotesk text-black/50 leading-relaxed font-medium">Automated biometric access scheduling with precise cursor-tracking validation sequences.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-black rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 grayscale pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070")' }} />

          <div className="relative z-10">
            <div className="mb-20 text-center md:text-left">
              <h3 className="font-space-grotesk text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
                TRUSTED_BY <br />
                <span className="font-dm-serif-display italic font-normal text-[#E63B2E] text-5xl md:text-7xl">50,000+ Users.</span>
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <div className="font-mono text-sm text-white/30 uppercase tracking-[0.2em]">Rating_4.9 / 5.0 (Global_Average)</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-colors duration-500">
                  <Quote size={40} className="text-[#E63B2E] mb-8 opacity-50" />
                  <p className="font-space-grotesk text-xl text-white/80 leading-snug font-medium mb-10 italic">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E63B2E] flex items-center justify-center text-white font-black text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-space-grotesk font-black text-white uppercase tracking-tight">{t.name}</div>
                      <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
