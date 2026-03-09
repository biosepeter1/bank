'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Open your account in minutes with seamless digital verification. Zero paperwork, zero branch visits.",
    color: "#E63B2E"
  },
  {
    number: "02",
    title: "Verify Identity",
    description: "Securely verify your identity in seconds. Gain instant access to premium banking features.",
    color: "#111111"
  },
  {
    number: "03",
    title: "Start Banking",
    description: "Deposit funds and experience the future of finance. Manage payments and savings with absolute precision.",
    color: "#E63B2E"
  }
];

export function WorkflowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;

      cards.forEach((card, i) => {
        // Pin each card at the top
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          pin: true,
          pinSpacing: i === cards.length - 1, // Only the last card gets spacing
          end: () => `+=${window.innerHeight}`,
          anticipatePin: 1, // Add anticipation for smoother pinning
        });

        // Animate the PREVIOUS card as this one moves in
        if (i > 0) {
          gsap.to(cards[i - 1], {
            scale: 0.9,
            filter: "blur(20px)",
            opacity: 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top top",
              scrub: true,
            }
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#E8E4DD]">
      {steps.map((step, i) => (
        <div
          key={i}
          ref={(el) => { if (el) cardsRef.current[i] = el; }}
          className="flex items-center justify-center h-[100dvh] w-full p-4 md:p-6"
          style={{ zIndex: i + 1 }}
        >
          <div className="relative w-full max-w-6xl aspect-auto md:aspect-video min-h-[500px] md:min-h-0 bg-[#F5F3EE] rounded-[2rem] md:rounded-[3rem] border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row">
            {/* Left Content */}
            <div className="flex-1 p-8 md:p-20 flex flex-col justify-center">
              <div className="font-mono text-lg md:text-2xl text-[#E63B2E] mb-4 md:mb-6 tracking-widest">
                STEP_{step.number}
              </div>
              <h2 className="font-space-grotesk text-4xl md:text-7xl lg:text-8xl font-black text-[#111111] mb-6 md:mb-8 leading-tight uppercase">
                {step.title}
              </h2>
              <p className="font-space-grotesk text-lg md:text-2xl text-[#111111]/70 max-w-md leading-snug">
                {step.description}
              </p>
            </div>

            {/* Right Visual Animation */}
            <div className="h-[250px] md:h-auto md:flex-1 bg-black/5 flex items-center justify-center relative border-t md:border-t-0 md:border-l border-black/10 overflow-hidden">
              {i === 0 && (
                <div className="w-full h-full flex items-center justify-center scale-75 md:scale-100">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="relative w-64 h-64 md:w-96 md:h-96"
                  >
                    {[...Array(6)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute inset-0 border-2 border-[#E63B2E]/20 rounded-full"
                        style={{ transform: `scale(${1 - j * 0.15})` }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#E63B2E] rounded-full shadow-[0_0_15px_#E63B2E]" />
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}

              {i === 1 && (
                <div className="w-full h-full p-8 md:p-12 flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-[200px] md:max-w-sm aspect-square bg-white border border-black/10 rounded-2xl overflow-hidden shadow-inner scale-90 md:scale-100">
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-px p-4 opacity-20">
                      {[...Array(100)].map((_, j) => (
                        <div key={j} className="bg-[#111111] rounded-full scale-[0.5]" />
                      ))}
                    </div>
                    <motion.div
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-0 right-0 h-1 bg-[#E63B2E] shadow-[0_0_20px_#E63B2E] z-10"
                    />
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-black/5 text-[10rem] md:text-[15rem] select-none">
                      ID
                    </div>
                  </div>
                </div>
              )}

              {i === 2 && (
                <div className="w-full h-full flex items-center justify-center scale-75 md:scale-100">
                  <svg width="400" height="200" viewBox="0 0 400 200" className="opacity-80">
                    <motion.path
                      d="M 0 100 L 50 100 L 60 70 L 80 130 L 100 20 L 120 180 L 140 100 L 190 100 L 200 40 L 220 160 L 240 100 L 400 100"
                      fill="none"
                      stroke="#E63B2E"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle
                      r="6"
                      fill="#E63B2E"
                      initial={{ offset: 0 }}
                      animate={{ offset: 1 }}
                    >
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path="M 0 100 L 50 100 L 60 70 L 80 130 L 100 20 L 120 180 L 140 100 L 190 100 L 200 40 L 220 160 L 240 100 L 400 100"
                      />
                    </motion.circle>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
