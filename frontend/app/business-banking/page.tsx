'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Building2,
  Users,
  Wallet,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  BarChart3,
  CreditCard,
  DollarSign,
  Factory,
  Briefcase,
  Sparkles,
  Clock,
  Lock,
  HeadphonesIcon,
  ArrowUpRight,
  Target,
  Award
} from 'lucide-react';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';

export default function BusinessBankingPage() {
  const { settings } = useSettings();
  const { branding } = useBranding();
  const siteName = settings?.general?.siteName || branding.name || 'RDN Bank';

  const services = [
    {
      id: 'accounts',
      icon: <Building2 className="w-7 h-7" />,
      title: 'Business Accounts',
      subtitle: 'Tailored for Modern Enterprises',
      description: 'Purpose-built accounts for entrepreneurs, SMEs, and corporations. Streamline your financial operations with powerful tools and dedicated support.',
      features: [
        'SME and Corporate account tiers',
        'Multi-signatory authorization',
        'Dedicated relationship manager',
        'Competitive transaction fees',
        'Real-time financial reporting'
      ],
      highlight: '₦0',
      highlightLabel: 'Monthly Fee',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      id: 'merchant',
      icon: <CreditCard className="w-7 h-7" />,
      title: 'Merchant Services',
      subtitle: 'Accept Payments Seamlessly',
      description: 'Enable your business to accept payments anywhere, anytime. From POS terminals to online gateways, we\'ve got your payment needs covered.',
      features: [
        'Point-of-Sale (POS) terminals',
        'Online payment gateway integration',
        'Bulk payment processing',
        'Multi-currency acceptance',
        'Same-day settlement available'
      ],
      highlight: '24hrs',
      highlightLabel: 'Settlement',
      gradient: 'from-purple-600 to-pink-500'
    },
    {
      id: 'corporate',
      icon: <Globe className="w-7 h-7" />,
      title: 'Corporate Banking',
      subtitle: 'Enterprise-Grade Solutions',
      description: 'Complete control over your corporate finances from a single platform. Manage payroll, vendor payments, and approvals with ease.',
      features: [
        'Role-based access control',
        'Automated payroll processing',
        'Vendor and supplier payments',
        'Custom approval workflows',
        'Comprehensive dashboards'
      ],
      highlight: '100+',
      highlightLabel: 'Users Supported',
      gradient: 'from-emerald-600 to-teal-500'
    },
    {
      id: 'loans',
      icon: <Wallet className="w-7 h-7" />,
      title: 'Business Financing',
      subtitle: 'Capital to Fuel Growth',
      description: 'Access the funding you need to scale operations, purchase equipment, or seize new opportunities. Flexible terms tailored to your business.',
      features: [
        'Working capital up to ₦100M',
        'Asset and equipment financing',
        'Invoice discounting',
        'Trade finance solutions',
        'Flexible repayment options'
      ],
      highlight: '₦100M',
      highlightLabel: 'Credit Line',
      gradient: 'from-orange-600 to-red-500'
    },
    {
      id: 'cash',
      icon: <BarChart3 className="w-7 h-7" />,
      title: 'Cash Management',
      subtitle: 'Optimize Your Liquidity',
      description: 'Gain complete visibility and control over your cash positions across all accounts. Advanced tools for smarter treasury management.',
      features: [
        'Cash flow forecasting',
        'Liquidity optimization',
        'Automated account sweeping',
        'Multi-entity pooling',
        'Treasury analytics'
      ],
      highlight: 'Real-time',
      highlightLabel: 'Visibility',
      gradient: 'from-indigo-600 to-blue-500'
    },
    {
      id: 'industry',
      icon: <Factory className="w-7 h-7" />,
      title: 'Industry Solutions',
      subtitle: 'Sector-Specific Expertise',
      description: 'We understand your industry. Get specialized banking solutions designed for the unique challenges and opportunities in your sector.',
      features: [
        'Retail & e-commerce',
        'Technology & startups',
        'Logistics & supply chain',
        'Manufacturing',
        'Healthcare & education'
      ],
      highlight: '15+',
      highlightLabel: 'Industries',
      gradient: 'from-teal-600 to-cyan-500'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Businesses Served', icon: <Building2 className="w-6 h-6" /> },
    { value: '₦500B+', label: 'Transactions Processed', icon: <DollarSign className="w-6 h-6" /> },
    { value: '99.9%', label: 'Uptime Guarantee', icon: <Zap className="w-6 h-6" /> },
    { value: '4.9/5', label: 'Customer Rating', icon: <Award className="w-6 h-6" /> }
  ];

  const benefits = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Instant Setup',
      description: 'Open a business account in minutes with streamlined digital onboarding.'
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, fraud monitoring, and complete regulatory compliance.'
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: 'Smart Analytics',
      description: 'AI-powered insights to make smarter financial decisions for your business.'
    },
    {
      icon: <HeadphonesIcon className="w-7 h-7" />,
      title: '24/7 Support',
      description: 'Dedicated business support team available around the clock.'
    }
  ];

  const testimonials = [
    {
      quote: "Switching to their business banking has transformed how we manage finances. The corporate dashboard is incredibly powerful.",
      author: "Chidi Okonkwo",
      role: "CEO, TechStart Nigeria",
      avatar: "CO"
    },
    {
      quote: "Their merchant services helped us scale from 100 to 10,000 daily transactions seamlessly. Outstanding reliability.",
      author: "Amina Hassan",
      role: "Founder, QuickMart",
      avatar: "AH"
    },
    {
      quote: "The business loan process was straightforward and fast. We got approved and funded within 48 hours.",
      author: "Emeka Nnamdi",
      role: "MD, Logistics Express",
      avatar: "EN"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(0deg, #8B0000, #DC143C, #8B0000)',
              'linear-gradient(180deg, #8B0000, #DC143C, #8B0000)',
              'linear-gradient(360deg, #8B0000, #DC143C, #8B0000)'
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
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Animated orbs */}
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
              <span className="text-white text-sm font-medium">Enterprise Solutions</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Business{' '}
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Banking
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Empowering businesses to grow, scale, and succeed with powerful financial solutions
            </p>

            <div className="flex justify-center">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 bg-white text-brand-primary hover:bg-white/90 text-lg font-bold shadow-xl">
                  Open Business Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
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

      {/* Services Section */}
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
              🏢 Business Solutions
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4">
              Everything Your Business <span className="text-brand-primary">Needs</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive financial tools and services designed to power enterprises of all sizes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                  <div className="relative">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-brand-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 font-medium mb-4">
                      {service.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Highlight */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <div className={`text-2xl font-black bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                          {service.highlight}
                        </div>
                        <div className="text-slate-500 text-xs">{service.highlightLabel}</div>
                      </div>
                      <Link href="/register">
                        <Button size="sm" className={`bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white shadow-lg`}>
                          Get Started
                          <ArrowUpRight className="ml-1 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-brand-secondary/10 rounded-full text-sm font-bold text-brand-secondary mb-6">
              ✨ Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Built for <span className="text-brand-secondary">Business Success</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Banking solutions designed for the demands of modern enterprises
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-brand-primary/30 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              💬 Client Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Trusted by <span className="text-brand-primary">Industry Leaders</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              See how businesses like yours are thriving with our banking solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/80 text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-white/50 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-sm font-bold text-brand-primary mb-6">
                🛡️ Security & Compliance
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Bank with <span className="text-brand-primary">Confidence</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Your business finances are protected by multiple layers of enterprise-grade security and full regulatory compliance.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Shield className="w-5 h-5" />, text: 'CBN Licensed and Regulated' },
                  { icon: <Lock className="w-5 h-5" />, text: 'PCI-DSS Level 1 Certified' },
                  { icon: <Target className="w-5 h-5" />, text: 'SOC 2 Type II Compliant' },
                  { icon: <Clock className="w-5 h-5" />, text: '24/7 Fraud Monitoring' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      {item.icon}
                    </div>
                    <span className="text-lg text-slate-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { value: '256-bit', label: 'SSL Encryption', icon: <Lock className="w-6 h-6" /> },
                { value: '99.99%', label: 'Uptime SLA', icon: <Zap className="w-6 h-6" /> },
                { value: '2FA', label: 'Authentication', icon: <Shield className="w-6 h-6" /> },
                { value: 'ISO 27001', label: 'Certified', icon: <Award className="w-6 h-6" /> }
              ].map((stat, index) => (
                <div key={index} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-brand-gradient flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-slate-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
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
              Ready to Scale Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of successful businesses banking smarter with {siteName}. Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 bg-white text-brand-primary hover:bg-white/90 text-lg font-bold shadow-2xl">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Open Business Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="h-16 px-10 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 text-lg font-bold">
                  Talk to Sales Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

