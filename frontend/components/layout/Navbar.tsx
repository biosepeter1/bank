'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
 Menu,
 X,
 Building2,
 ChevronDown,
 Home,
 Landmark,
 Users,
 Briefcase,
 CreditCard,
 PiggyBank,
 Wallet,
 Building,
 BadgeDollarSign,
 Store,
 Receipt,
 HelpCircle,
 MessageSquare,
 ArrowRight,
 UserPlus,
 LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBranding } from '@/contexts/BrandingContext';

interface NavbarProps {
 variant?: 'default' | 'hero-overlay' | 'light';
}

export function Navbar({ variant = 'default' }: NavbarProps) {
 const { branding } = useBranding();
 const [scrolled, setScrolled] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 useEffect(() => {
 const handleScroll = () => {
 setScrolled(window.scrollY > 20);
 };
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 // Determine styles based on variant
 const isLight = false; // Force dark cinematic mode

 const navBgClass = scrolled
 ? 'bg-[#F5F3EE]/80 backdrop-blur-xl shadow-2xl border-b border-slate-200 rounded-[2rem] mt-4 max-w-7xl mx-auto'
 : 'bg-transparent mt-4 max-w-7xl mx-auto';

 // Text color logic
 const textColorClass = 'text-brand-text font-sans';
 const textHoverClass = 'hover:text-brand-primary';
 const iconColorClass = 'text-brand-text';

 // Button style
 const buttonClass = 'magnetic-btn bg-brand-primary text-white hover:bg-brand-primary/90 border-transparent rounded-[2rem]';

 return (
 <>
 <nav
 className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}
 >
 <div className="container mx-auto px-4 md:px-6">
 <div className="flex items-center justify-between h-20">
 {/* Left side - Home Icon + Nav Links */}
 <div className="flex items-center gap-1 md:gap-8">
 {/* Home Icon */}
 <Link
 href="/"
 className={`p-2 transition-colors ${iconColorClass} ${textHoverClass}`}
 >
 <Home size={22} />
 </Link>

 {/* Desktop Nav Links - Only on large screens */}
 <div className="hidden lg:flex items-center gap-1">
 {/* About Us Dropdown */}
 <div className="relative group">
 <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${textColorClass} ${textHoverClass}`}>
 About Us <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
 </button>
 <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
 {/* Gradient header */}
 <div className="bg-brand-primary px-4 py-3">
 <p className="text-brand-text text-xs font-medium opacity-90">Learn more about us</p>
 </div>
 <div className="p-2">
 <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-brand-primary/10 transition-colors">
 <Building2 size={18} className="text-slate-500 group-hover/item:text-brand-primary" />
 </div>
 <div>
 <div className="font-semibold">About Us</div>
 <div className="text-xs text-brand-text/50">Our story & values</div>
 </div>
 </Link>
 </div>
 </div>
 </div>

 {/* Personal Dropdown */}
 <div className="relative group">
 <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${textColorClass} ${textHoverClass}`}>
 Personal <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
 </button>
 <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
 <div className="bg-brand-primary px-4 py-3">
 <p className="text-brand-text text-xs font-medium opacity-90">Personal Banking Solutions</p>
 </div>
 <div className="p-2">
 <Link href="/personal-banking" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
 <Users size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Personal Banking</div>
 <div className="text-xs text-brand-text/50">Overview & services</div>
 </div>
 </Link>
 <Link href="/personal/checking" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-green-100 transition-colors">
 <Wallet size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Checking Accounts</div>
 <div className="text-xs text-brand-text/50">Everyday banking</div>
 </div>
 </Link>
 <Link href="/personal/savings" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-amber-100 transition-colors">
 <PiggyBank size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Savings & Vaults</div>
 <div className="text-xs text-brand-text/50">Grow your wealth</div>
 </div>
 </Link>
 <Link href="/personal/cards" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-purple-100 transition-colors">
 <CreditCard size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Cards</div>
 <div className="text-xs text-brand-text/50">Debit & credit cards</div>
 </div>
 </Link>
 </div>
 </div>
 </div>

 {/* Business Dropdown */}
 <div className="relative group">
 <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${textColorClass} ${textHoverClass}`}>
 Business <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
 </button>
 <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-[2rem] shadow-2xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
 <div className="bg-brand-primary px-4 py-3">
 <p className="text-brand-text text-xs font-medium opacity-90">Business Banking Solutions</p>
 </div>
 <div className="p-2">
 <Link href="/business-banking" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-brand-primary/10 transition-colors">
 <Briefcase size={18} className="text-slate-500 group-hover/item:text-brand-primary" />
 </div>
 <div>
 <div className="font-semibold">Business Banking</div>
 <div className="text-xs text-brand-text/50">Overview & services</div>
 </div>
 </Link>
 <Link href="/business/corporate" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
 <Building size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Corporate Accounts</div>
 <div className="text-xs text-brand-text/50">Enterprise solutions</div>
 </div>
 </Link>
 <Link href="/business/loans" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-green-100 transition-colors">
 <BadgeDollarSign size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">SME Loans</div>
 <div className="text-xs text-brand-text/50">Business financing</div>
 </div>
 </Link>
 <Link href="/business/merchant" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-purple-100 transition-colors">
 <Store size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Merchant Services</div>
 <div className="text-xs text-brand-text/50">Payment processing</div>
 </div>
 </Link>
 <Link href="/business/payroll" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-amber-100 transition-colors">
 <Receipt size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Payroll Solutions</div>
 <div className="text-xs text-brand-text/50">Employee payments</div>
 </div>
 </Link>
 </div>
 </div>
 </div>

 {/* Loans & Investments */}
 <Link href="/loans-investments" className={`px-4 py-2 text-sm font-medium transition-colors ${textColorClass} ${textHoverClass}`}>
 Loans & Investments
 </Link>

 {/* Support Dropdown */}
 <div className="relative group">
 <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${textColorClass} ${textHoverClass}`}>
 Support <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
 </button>
 <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
 <div className="bg-brand-primary px-4 py-3">
 <p className="text-brand-text text-xs font-medium opacity-90">We're here to help</p>
 </div>
 <div className="p-2">
 <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-emerald-100 transition-colors">
 <MessageSquare size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Contact Us</div>
 <div className="text-xs text-brand-text/50">Get in touch</div>
 </div>
 </Link>
 <Link href="/faq" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-teal-100 transition-colors">
 <HelpCircle size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">FAQ</div>
 <div className="text-xs text-brand-text/50">Common questions</div>
 </div>
 </Link>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Right side - Internet Banking + Logo */}
 <div className="flex items-center gap-6">
 {/* Internet Banking Dropdown */}
 <div className="relative group hidden sm:block">
 <Button
 className={`${buttonClass} text-xs font-bold px-5 h-10 gap-2 rounded-xl shadow-sm transition-all`}
 >
 <Landmark size={14} />
 Internet Banking
 <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
 </Button>
 <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
 <div className="bg-brand-primary px-4 py-3">
 <p className="text-brand-text text-xs font-medium opacity-90">Access your account</p>
 </div>
 <div className="p-2">
 <Link href="/register" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-green-100 transition-colors">
 <UserPlus size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Open an Account</div>
 <div className="text-xs text-brand-text/50">Start banking today</div>
 </div>
 </Link>
 <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-sm text-brand-text/80 hover:bg-slate-50 hover:text-brand-primary rounded-xl font-medium transition-all group/item">
 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
 <LogIn size={18} className="text-white" />
 </div>
 <div>
 <div className="font-semibold">Login</div>
 <div className="text-xs text-brand-text/50">Access your account</div>
 </div>
 </Link>
 </div>
 </div>
 </div>

 {/* Logo - UBA Style */}
 <Link href="/" className="flex items-center group">
 {/* Logo Icon */}
 <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
 {branding.logo ? (
 <img src={branding.logo} alt={branding.name} className="w-full h-full object-contain" />
 ) : (
 <Building2 size={32} className="text-brand-primary" />
 )}
 </div>
 </Link>

 {/* Mobile Menu Toggle - Visible on md and below */}
 <button
 className={`lg:hidden p-2 ${iconColorClass}`}
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 >
 {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
 </button>
 </div>
 </div>
 </div>
 </nav>

 {/* Mobile Menu Drawer */}
 <AnimatePresence>
 {mobileMenuOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
 onClick={() => setMobileMenuOpen(false)}
 />

 {/* Drawer */}
 <motion.div
 initial={{ x: '-100%' }}
 animate={{ x: 0 }}
 exit={{ x: '-100%' }}
 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
 className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto"
 >
 <div className="p-6">
 {/* Header */}
 <div className="flex items-center justify-between mb-8">
 <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
 <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center overflow-hidden shadow-lg">
 {branding.logo ? (
 <img src={branding.logo} alt={branding.name} className="w-full h-full object-contain" />
 ) : (
 <Building2 size={24} className="text-white" />
 )}
 </div>
 <span className="text-lg font-bold text-slate-900">{branding.name}</span>
 </Link>
 <button
 className="p-2 text-brand-text/50 hover:text-slate-900 rounded-lg hover:bg-slate-50"
 onClick={() => setMobileMenuOpen(false)}
 >
 <X size={24} />
 </button>
 </div>

 {/* Menu Items */}
 <div className="space-y-6">
 <div>
 <h3 className="text-xs font-bold text-brand-text/50 uppercase tracking-wider mb-3 px-3">About</h3>
 <div className="space-y-1">
 <Link href="/about" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
 </div>
 </div>

 <div>
 <h3 className="text-xs font-bold text-brand-text/50 uppercase tracking-wider mb-3 px-3">Personal</h3>
 <div className="space-y-1">
 <Link href="/personal-banking" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Personal Banking</Link>
 <Link href="/personal/checking" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Checking Accounts</Link>
 <Link href="/personal/savings" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Savings & Vaults</Link>
 <Link href="/personal/cards" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Cards</Link>
 </div>
 </div>

 <div>
 <h3 className="text-xs font-bold text-brand-text/50 uppercase tracking-wider mb-3 px-3">Business</h3>
 <div className="space-y-1">
 <Link href="/business-banking" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Business Banking</Link>
 <Link href="/business/corporate" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Corporate Accounts</Link>
 <Link href="/business/loans" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>SME Loans</Link>
 <Link href="/business/merchant" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Merchant Services</Link>
 <Link href="/business/payroll" className="block px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-brand-primary rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Payroll Solutions</Link>
 </div>
 </div>

 <div className="pt-4 border-t border-slate-100 space-y-3">
 <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
 <Button className="w-full justify-center bg-brand-primary hover:bg-brand-primary/90 text-white h-12 rounded-xl text-base shadow-lg shadow-brand-primary/20">
 Internet Banking
 </Button>
 </Link>
 <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
 <Button variant="outline" className="w-full justify-center border-slate-200 text-slate-700 hover:bg-slate-50 h-12 rounded-xl text-base">
 Open Account
 </Button>
 </Link>
 </div>
 </div>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </>
 );
}
