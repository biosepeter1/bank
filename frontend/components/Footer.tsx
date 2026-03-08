'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Zap,
  MapPin,
  Phone,
  Mail,
  Send,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const siteName = settings?.general?.siteName || 'Banking Platform';
  const supportPhone = settings?.general?.supportPhone || '+234 800 000 0000';
  const supportEmail = settings?.general?.supportEmail || 'support@bank.com';

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Personal Banking', href: '/personal-banking' },
    { name: 'Business Banking', href: '/business-banking' },
    { name: 'Loans & Investments', href: '/loans-investments' },
  ];

  const services = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ];

  const legal = [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Compliance', href: '#' },
  ];

  return (
    <footer className="relative bg-[#0B0B0B] text-white pt-16 md:pt-24 pb-12 rounded-t-[3rem] md:rounded-t-[4rem] overflow-hidden border-t border-white/5">
      {/* Subtle Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
          
          {/* 1. Brand & Contact Section */}
          <div className="space-y-6 md:space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#E63B2E] flex items-center justify-center rounded-lg group-hover:rotate-12 transition-transform duration-500">
                <Zap size={20} className="text-white fill-white" />
              </div>
              <span className="font-space-grotesk text-2xl font-black uppercase tracking-tight">{siteName}</span>
            </Link>
            <p className="font-space-grotesk text-white/40 leading-relaxed font-medium text-sm md:text-base">
              Modern digital banking — secure, fast, and borderless. Experience the future of finance.
            </p>
            
            <div className="space-y-4 text-white/60">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#E63B2E] shrink-0" />
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-tight">Egbeda, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#E63B2E] shrink-0" />
                <a href={`tel:${supportPhone}`} className="font-mono text-[10px] md:text-xs uppercase tracking-tight hover:text-white transition-colors">{supportPhone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#E63B2E] shrink-0" />
                <a href={`mailto:${supportEmail}`} className="font-mono text-[10px] md:text-xs uppercase tracking-tight hover:text-white transition-colors">{supportEmail}</a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {[<Facebook key="f" />, <Twitter key="t" />, <Instagram key="i" />, <Linkedin key="l" />, <Youtube key="y" />].map((icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  whileHover={{ scale: 1.1, color: "#E63B2E" }}
                  className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center text-white/40 transition-colors"
                >
                  <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="md:pt-4">
            <h4 className="font-mono text-[10px] md:text-xs font-black text-[#E63B2E] uppercase tracking-[0.3em] mb-6 md:mb-8">QUICK_LINKS</h4>
            <ul className="grid grid-cols-1 gap-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="font-space-grotesk text-sm md:text-base text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="uppercase font-bold tracking-tight">{link.name}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Services */}
          <div className="md:pt-4">
            <h4 className="font-mono text-[10px] md:text-xs font-black text-[#E63B2E] uppercase tracking-[0.3em] mb-6 md:mb-8">SERVICES</h4>
            <ul className="grid grid-cols-1 gap-4">
              {services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="font-space-grotesk text-sm md:text-base text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="uppercase font-bold tracking-tight">{link.name}</span>
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div className="space-y-6 md:space-y-8 md:pt-4">
            <h4 className="font-mono text-[10px] md:text-xs font-black text-[#E63B2E] uppercase tracking-[0.3em] mb-4 md:mb-8">NEWSLETTER</h4>
            <p className="font-space-grotesk text-sm md:text-base text-white/40 leading-relaxed font-medium">
              Join the technical briefing. No spam. Only protocol updates.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="IDENTITY_EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono text-[10px] md:text-xs uppercase h-12 rounded-xl focus:ring-[#E63B2E] focus:border-[#E63B2E]"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1 top-1 bottom-1 bg-[#E63B2E] hover:bg-[#E63B2E]/90 text-white rounded-lg px-3 group h-auto"
                >
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                </Button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-12">
          {/* Status Indicator */}
          <div className="flex items-center gap-4 py-2 px-5 bg-white/[0.03] border border-white/5 rounded-full self-start">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[#00FF66]" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
            </div>
            <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF66]">
              SYSTEM_OPERATIONAL
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12 w-full md:w-auto">
            <p className="font-mono text-[10px] text-white/20 uppercase font-black tracking-widest order-2 sm:order-1">
              © {new Date().getFullYear()} {siteName}. INIT_V1.0
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-8 order-1 sm:order-2 border-b border-white/5 pb-4 sm:pb-0 sm:border-0 w-full sm:w-auto">
              {legal.map(l => (
                <Link key={l.name} href={l.href} className="font-mono text-[10px] text-white/20 uppercase font-black tracking-widest hover:text-white transition-colors">
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

