'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useBranding } from '@/contexts/BrandingContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const { branding } = useBranding();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login delay
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md">
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
                        <h1 className="text-2xl font-bold relative z-10">Welcome Back</h1>
                        <p className="text-slate-400 mt-2 relative z-10">Sign in to manage your account</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10 h-12"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/auth/forgot-password" className="text-sm font-medium text-brand-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-12"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-brand-gradient text-white font-medium text-lg shadow-lg shadow-brand-primary/20 border-0 hover:opacity-90 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In <ArrowRight size={20} />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600">
                                Don't have an account?{' '}
                                <Link href="/auth/register" className="font-bold text-brand-primary hover:underline">
                                    Open Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Security Footer */}
                    <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                            <Lock size={12} /> Protected by Bank-Grade Security
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

