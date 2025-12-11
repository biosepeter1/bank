'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Lock, Mail, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useBranding } from '@/contexts/BrandingContext';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const { branding } = useBranding();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate registration delay
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 text-center bg-slate-900 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-brand-gradient opacity-10" />
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                <Building2 size={24} />
                            </div>
                            <span className="text-xl font-bold">{branding.name}</span>
                        </Link>
                        <h1 className="text-2xl font-bold relative z-10">Open an Account</h1>
                        <p className="text-slate-400 mt-2 relative z-10">Join thousands of satisfied customers today</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400" size={20} />
                                        <Input id="firstName" placeholder="John" className="pl-10 h-12" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-slate-400" size={20} />
                                        <Input id="lastName" placeholder="Doe" className="pl-10 h-12" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <Input id="email" type="email" placeholder="name@example.com" className="pl-10 h-12" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="pl-10 h-12" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <Input id="password" type="password" placeholder="Create a strong password" className="pl-10 h-12" required />
                                </div>
                                <p className="text-xs text-slate-500">Must be at least 8 characters with 1 special character.</p>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="mt-0.5">
                                    <input type="checkbox" id="terms" className="w-4 h-4 text-brand-primary rounded border-slate-300 focus:ring-brand-primary" required />
                                </div>
                                <label htmlFor="terms" className="text-sm text-slate-600 leading-tight">
                                    I agree to the <Link href="#" className="text-brand-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-brand-primary hover:underline">Privacy Policy</Link>.
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-brand-gradient text-white font-medium text-lg shadow-lg shadow-brand-primary/20 border-0 hover:opacity-90 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Get Started <ArrowRight size={20} />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="font-bold text-brand-primary hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

