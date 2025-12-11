'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useBranding } from '@/contexts/BrandingContext';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const { branding } = useBranding();
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
        }, 2000);
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
                        <h1 className="text-2xl font-bold relative z-10">Reset Password</h1>
                        <p className="text-slate-400 mt-2 relative z-10">We'll send you instructions to reset it</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {isSent ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
                                <p className="text-slate-600 mb-8">
                                    We've sent password reset instructions to your email address.
                                </p>
                                <Link href="/auth/login">
                                    <Button className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800">
                                        Back to Login
                                    </Button>
                                </Link>
                            </motion.div>
                        ) : (
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

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-brand-gradient text-white font-medium text-lg shadow-lg shadow-brand-primary/20 border-0 hover:opacity-90 transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Send Instructions <ArrowRight size={20} />
                                        </span>
                                    )}
                                </Button>

                                <div className="text-center">
                                    <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-primary transition-colors">
                                        <ArrowLeft size={16} /> Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

