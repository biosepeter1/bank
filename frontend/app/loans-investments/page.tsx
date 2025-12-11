'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowRight,
  TrendingUp,
  DollarSign,
  Building2,
  Wallet,
  PiggyBank,
  BarChart3,
  Shield,
  CheckCircle2,
  Zap,
  LineChart,
  Home,
  Briefcase,
  Clock,
  Award,
  Users,
  Globe,
  Lock,
  Sparkles,
  Target,
  ArrowUpRight,
  Calculator,
  X
} from 'lucide-react';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';

export default function LoansInvestmentsPage() {
  const { settings } = useSettings();
  const { branding } = useBranding();
  const siteName = settings?.general?.siteName || branding.name || 'RDN Bank';

  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [loanAmount, setLoanAmount] = useState('1000000');
  const [loanTerm, setLoanTerm] = useState('12');
  const [interestRate, setInterestRate] = useState('12');

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount) || 0;
    const months = parseInt(loanTerm) || 1;
    const rate = parseFloat(interestRate) || 0;
    const monthlyRate = rate / 100 / 12;

    if (monthlyRate === 0) {
      return principal / months;
    }

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return isNaN(payment) ? 0 : payment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * parseInt(loanTerm || '1');
  const totalInterest = totalPayment - parseFloat(loanAmount || '0');

  const loanTypes = [
    {
      id: 'personal',
      icon: <Wallet className="w-8 h-8" />,
      title: 'Personal Loans',
      subtitle: 'Your Dreams, Our Priority',
      description: 'Access competitive financing tailored to your personal needs. Whether it\'s consolidating debt, funding education, or handling unexpected expenses, we provide swift approvals with transparent terms.',
      features: [
        'Interest rates starting from 12% p.a.',
        'Borrow up to ₦10,000,000',
        'Flexible terms from 6 to 48 months',
        'No collateral for qualified applicants',
        'Same-day approval available'
      ],
      highlight: '12%',
      highlightLabel: 'Starting Rate',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      id: 'business',
      icon: <Building2 className="w-8 h-8" />,
      title: 'Business Financing',
      subtitle: 'Empowering Enterprise Growth',
      description: 'Unlock your business potential with capital solutions designed for growth. From working capital to equipment financing, we partner with enterprises of all sizes to fuel expansion and innovation.',
      features: [
        'Competitive rates from 14% p.a.',
        'Credit facilities up to ₦100,000,000',
        'Terms extending up to 7 years',
        'Working capital & trade finance',
        'Dedicated relationship manager'
      ],
      highlight: '₦100M',
      highlightLabel: 'Maximum Facility',
      gradient: 'from-purple-600 to-pink-500'
    },
    {
      id: 'salary',
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Salary Advance',
      subtitle: 'Bridge the Gap Seamlessly',
      description: 'Life doesn\'t wait for payday. Access up to 60% of your salary instantly with our hassle-free advance facility. Quick disbursement, automatic repayment, zero stress.',
      features: [
        'Up to 60% of monthly salary',
        'Instant disbursement to your account',
        'Automatic payroll deduction',
        'Zero paperwork required',
        'Available to verified employees'
      ],
      highlight: '60%',
      highlightLabel: 'Of Your Salary',
      gradient: 'from-emerald-600 to-teal-500'
    },
    {
      id: 'asset',
      icon: <Home className="w-8 h-8" />,
      title: 'Asset & Mortgage',
      subtitle: 'Own Your Future Today',
      description: 'Transform your aspirations into reality with structured asset financing. Whether it\'s your dream home, a vehicle, or essential equipment, our flexible payment plans make ownership achievable.',
      features: [
        'Mortgage financing up to ₦200M',
        'Vehicle loans with quick processing',
        'Equipment leasing solutions',
        'Competitive fixed rates',
        'Extended tenures up to 25 years'
      ],
      highlight: '25 Yrs',
      highlightLabel: 'Extended Terms',
      gradient: 'from-orange-600 to-red-500'
    }
  ];

  const investmentPlans = [
    {
      title: 'Fixed Deposits',
      rate: 'Up to 14%',
      rateValue: 14,
      period: '3-24 months',
      minimum: '₦100,000',
      description: 'Guaranteed returns with capital protection. Lock in premium rates and watch your savings compound with absolute peace of mind.',
      icon: <PiggyBank className="w-7 h-7" />,
      features: ['Capital guaranteed', 'Flexible tenures', 'Quarterly interest payout option'],
      gradient: 'from-emerald-600 to-teal-500',
      popular: false
    },
    {
      title: 'Wealth Management',
      rate: 'Up to 22%',
      rateValue: 22,
      period: 'Ongoing',
      minimum: '₦5,000,000',
      description: 'Elite wealth management for discerning investors. Access personalized strategies, exclusive opportunities, and dedicated advisory services.',
      icon: <Award className="w-7 h-7" />,
      features: ['Personal wealth advisor', 'Portfolio diversification', 'Priority access to deals'],
      gradient: 'from-purple-600 to-pink-500',
      popular: true
    },
    {
      title: 'Mutual Funds',
      rate: '15-20%',
      rateValue: 20,
      period: 'Variable',
      minimum: '₦50,000',
      description: 'Professionally managed diversified portfolios. Benefit from institutional-grade investments regardless of your investment size.',
      icon: <BarChart3 className="w-7 h-7" />,
      features: ['Expert fund managers', 'Low entry threshold', 'Daily liquidity available'],
      gradient: 'from-orange-600 to-amber-500',
      popular: false
    },
    {
      title: 'Retirement Plans',
      rate: '12-18%',
      rateValue: 18,
      period: 'Long-term',
      minimum: '₦25,000/mo',
      description: 'Build a secure future with disciplined, growth-oriented retirement planning. Start small, grow consistently, retire comfortably.',
      icon: <Clock className="w-7 h-7" />,
      features: ['Tax-efficient structure', 'Employer matching available', 'Survivor benefits included'],
      gradient: 'from-indigo-600 to-blue-500',
      popular: false
    }
  ];

  const stats = [
    { value: '₦50B+', label: 'Loans Disbursed', icon: <DollarSign className="w-6 h-6" /> },
    { value: '25,000+', label: 'Active Investors', icon: <Users className="w-6 h-6" /> },
    { value: '98%', label: 'Customer Satisfaction', icon: <Target className="w-6 h-6" /> },
    { value: '15+', label: 'Years of Excellence', icon: <Award className="w-6 h-6" /> }
  ];

  const trustFeatures = [
    { icon: <Shield className="w-6 h-6" />, title: 'CBN Regulated', description: 'Fully licensed and compliant with all regulatory requirements' },
    { icon: <Lock className="w-6 h-6" />, title: 'NDIC Insured', description: 'Your deposits are protected up to ₦500,000 per depositor' },
    { icon: <Globe className="w-6 h-6" />, title: 'Global Standards', description: 'PCI-DSS compliant with international security protocols' },
    { icon: <Zap className="w-6 h-6" />, title: '24/7 Support', description: 'Round-the-clock assistance for all your financial needs' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary"
          animate={{
            backgroundImage: [
              'linear-gradient(0deg, var(--brand-primary), var(--brand-secondary), var(--brand-primary))',
              'linear-gradient(180deg, var(--brand-primary), var(--brand-secondary), var(--brand-primary))',
              'linear-gradient(360deg, var(--brand-primary), var(--brand-secondary), var(--brand-primary))'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: 'linear-gradient(180deg, #8B0000, #DC143C, #8B0000)'
          }}
        />
        {/* Overlay for depth */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/30"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Smart Financial Solutions</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Loans &{' '}
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Investments
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Unlock your financial potential with competitive lending and premium investment solutions designed for your success
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Loans Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-sm font-bold text-brand-primary mb-6">
              💰 Lending Solutions
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4">
              Financing That <span className="text-brand-primary">Empowers</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Competitive rates, flexible terms, and swift approvals to help you achieve every goal
            </p>
          </motion.div>

          <div className="space-y-8">
            {loanTypes.map((loan, index) => (
              <motion.div
                key={loan.id}
                id={loan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group relative bg-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${loan.gradient} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500`} />

                  <div className="relative grid lg:grid-cols-12 gap-8 items-center">
                    {/* Left: Icon and Title */}
                    <div className="lg:col-span-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${loan.gradient} flex items-center justify-center text-white shadow-lg mb-6`}>
                        {loan.icon}
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">
                        {loan.title}
                      </h3>
                      <p className="text-lg text-slate-500 font-medium mb-4">
                        {loan.subtitle}
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        {loan.description}
                      </p>
                    </div>

                    {/* Center: Features */}
                    <div className="lg:col-span-5">
                      <div className="space-y-3">
                        {loan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${loan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Highlight + CTA */}
                    <div className="lg:col-span-3 text-center lg:text-right">
                      <div className="inline-block mb-6">
                        <div className={`text-5xl font-black bg-gradient-to-r ${loan.gradient} bg-clip-text text-transparent`}>
                          {loan.highlight}
                        </div>
                        <div className="text-slate-500 text-sm font-medium">{loan.highlightLabel}</div>
                      </div>
                      <div>
                        <Link href="/register">
                          <Button size="lg" className={`bg-gradient-to-r ${loan.gradient} hover:opacity-90 text-white shadow-lg w-full lg:w-auto`}>
                            Apply Now
                            <ArrowUpRight className="ml-2 w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investments Section */}
      <section id="investments" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute bottom-40 left-0 w-[500px] h-[500px] bg-brand-secondary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-brand-secondary/10 rounded-full text-sm font-bold text-brand-secondary mb-6">
              📈 Investment Products
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4">
              Grow Your <span className="text-brand-secondary">Wealth</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Premium investment solutions with competitive returns and professional management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${plan.popular ? 'border-brand-primary' : 'border-slate-100 hover:border-slate-200'} overflow-hidden relative`}>
                  {/* Background pattern */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.gradient} opacity-5 rounded-full blur-2xl`} />

                  <div className="relative">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {plan.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {plan.title}
                    </h3>

                    {/* Rate highlight */}
                    <div className="mb-4">
                      <span className={`text-3xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.rate}
                      </span>
                      <span className="text-slate-500 text-sm ml-2">p.a.</span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                      {plan.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-3 mb-6 py-4 border-y border-slate-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Investment Period</span>
                        <span className="font-semibold text-slate-900">{plan.period}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Minimum Amount</span>
                        <span className="font-semibold text-slate-900">{plan.minimum}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link href="/register">
                      <Button size="lg" className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg`}>
                        Start Investing
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-bold text-white/80 mb-6">
              🛡️ Trust & Security
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Your Trust, <span className="text-brand-primary">Our Commitment</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Bank with confidence knowing your investments are protected by multiple layers of security
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Why Choose <span className="text-brand-primary">{siteName}</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the difference with our customer-first approach to financial services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Zap className="w-7 h-7" />, title: 'Lightning Fast', description: 'Get loan approvals within hours, not days. Our digital-first approach ensures speed.' },
              { icon: <Shield className="w-7 h-7" />, title: 'Fully Protected', description: 'NDIC insured deposits and CBN regulated operations for complete peace of mind.' },
              { icon: <LineChart className="w-7 h-7" />, title: 'Smart Insights', description: 'Track your portfolio performance with real-time analytics and expert recommendations.' },
              { icon: <Users className="w-7 h-7" />, title: 'Dedicated Support', description: 'Personal relationship managers and 24/7 customer support at your fingertips.' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-brand-primary/30 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of satisfied customers who have achieved their financial goals with our expert guidance and competitive solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 bg-white text-brand-primary hover:bg-white/90 text-lg font-bold shadow-2xl">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="h-16 px-10 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 text-lg font-bold">
                  Speak to an Advisor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Loan Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCalculator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Loan Calculator</h3>
                </div>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Loan Amount (₦)
                  </label>
                  <Input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="h-12 text-lg"
                    placeholder="Enter loan amount"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Term (Months)
                    </label>
                    <Input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="h-12 text-lg"
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Interest Rate (% p.a.)
                    </label>
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="h-12 text-lg"
                      placeholder="12"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="text-slate-600">Monthly Payment</span>
                    <span className="text-3xl font-black text-brand-primary">
                      ₦{monthlyPayment.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total Interest</span>
                    <span className="font-semibold text-slate-700">
                      ₦{totalInterest.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total Repayment</span>
                    <span className="font-semibold text-slate-700">
                      ₦{totalPayment.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <Link href="/register" className="block">
                  <Button className="w-full h-14 bg-brand-gradient text-white text-lg font-bold shadow-lg">
                    Apply for This Loan
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>

                <p className="text-xs text-slate-500 text-center">
                  * This is an estimate. Actual rates and terms may vary based on your profile.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

