'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  CreditCard,
  Smartphone,
  PiggyBank,
  GraduationCap,
  Headphones,
  CheckCircle2,
  DollarSign,
  Shield,
  Zap,
  Star,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  Award,
  Globe,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';

export default function PersonalBankingPage() {
  const { settings } = useSettings();
  const { branding } = useBranding();
  const siteName = settings?.general?.siteName || branding.name || 'RDN Bank';

  const stats = [
    { value: '2M+', label: 'Happy Customers', icon: <Users className="w-6 h-6" /> },
    { value: '₦500B+', label: 'Transactions', icon: <DollarSign className="w-6 h-6" /> },
    { value: '99.9%', label: 'Uptime', icon: <Zap className="w-6 h-6" /> },
    { value: '4.9/5', label: 'App Rating', icon: <Star className="w-6 h-6" /> }
  ];

  const services = [
    {
      id: 'savings',
      icon: <PiggyBank className="w-7 h-7" />,
      title: 'Savings Accounts',
      subtitle: 'Grow Your Wealth Securely',
      description: 'Competitive interest rates and flexible deposit options to help your money grow.',
      features: [
        'Up to 15% p.a. interest',
        'Flexible deposit options',
        'Goal-based savings plans',
        'Automatic savings tools'
      ],
      highlight: '15%',
      highlightLabel: 'Interest p.a.',
      gradient: 'from-emerald-600 to-teal-500'
    },
    {
      id: 'current',
      icon: <Wallet className="w-7 h-7" />,
      title: 'Current Accounts',
      subtitle: 'Seamless Daily Banking',
      description: 'Instant transfers, free debit cards, and real-time notifications.',
      features: [
        'Instant fund transfers',
        'Free debit card',
        'Real-time alerts',
        'Overdraft available'
      ],
      highlight: '₦0',
      highlightLabel: 'Monthly Fee',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      id: 'mobile',
      icon: <Smartphone className="w-7 h-7" />,
      title: 'Mobile Banking',
      subtitle: '24/7 Access Anywhere',
      description: 'Secure digital banking with biometric login and instant payments.',
      features: [
        'Biometric authentication',
        'Spending insights',
        'P2P payments',
        'Bill scheduling'
      ],
      highlight: '24/7',
      highlightLabel: 'Access',
      gradient: 'from-purple-600 to-pink-500'
    },
    {
      id: 'cards',
      icon: <CreditCard className="w-7 h-7" />,
      title: 'Debit & Virtual Cards',
      subtitle: 'Shop Globally',
      description: 'Globally accepted cards with advanced security and contactless payments.',
      features: [
        'Global acceptance',
        'Virtual cards',
        'Contactless payments',
        'Fraud protection'
      ],
      highlight: '150+',
      highlightLabel: 'Countries',
      gradient: 'from-orange-600 to-red-500'
    },
    {
      id: 'student',
      icon: <GraduationCap className="w-7 h-7" />,
      title: 'Student Banking',
      subtitle: 'Build Financial Habits',
      description: 'Smart solutions designed for young adults starting their financial journey.',
      features: [
        'Zero maintenance fees',
        'Financial literacy',
        'Student-friendly limits',
        'Special offers'
      ],
      highlight: '₦0',
      highlightLabel: 'Account Fees',
      gradient: 'from-indigo-600 to-blue-500'
    },
    {
      id: 'support',
      icon: <Headphones className="w-7 h-7" />,
      title: 'Customer Support',
      subtitle: 'Always Here For You',
      description: 'Dedicated assistance for inquiries, disputes, and banking guidance.',
      features: [
        '24/7 availability',
        'Live chat support',
        'Quick resolution',
        'Multi-channel'
      ],
      highlight: '<2hrs',
      highlightLabel: 'Response Time',
      gradient: 'from-teal-600 to-cyan-500'
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Bank-Grade Security',
      description: 'Advanced encryption and fraud monitoring protect your funds 24/7.',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Instant Transactions',
      description: 'Send and receive money in seconds with lightning-fast infrastructure.',
      gradient: 'from-purple-600 to-pink-500'
    },
    {
      icon: <Star className="w-7 h-7" />,
      title: 'Premium Experience',
      description: 'Intuitive banking designed around your needs and lifestyle.',
      gradient: 'from-orange-600 to-red-500'
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: 'Financial Growth',
      description: 'Tools and insights to help you grow and manage your wealth.',
      gradient: 'from-emerald-600 to-teal-500'
    }
  ];

  const testimonials = [
    {
      quote: "The mobile app is incredibly intuitive. I can manage all my finances on the go without any hassle.",
      author: "Chioma Eze",
      role: "Entrepreneur",
      avatar: "CE"
    },
    {
      quote: "Best savings rates I've found anywhere. My money is actually growing now!",
      author: "Emeka Johnson",
      role: "Software Developer",
      avatar: "EJ"
    },
    {
      quote: "Customer support is outstanding. They resolved my issue within an hour.",
      author: "Amaka Obi",
      role: "Marketing Manager",
      avatar: "AO"
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
              <span className="text-white text-sm font-medium">Personal Banking</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Banking Crafted for{' '}
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Your Life
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Modern banking solutions designed around your everyday needs
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
              💳 Our Services
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4">
              Everything You <span className="text-brand-primary">Need</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive financial solutions tailored for your personal banking needs
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
                      {service.features.map((feature, idx) => (
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
              Banking That <span className="text-brand-secondary">Works For You</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience banking designed around your life
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
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform duration-300`}>
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
              💬 Customer Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Loved by <span className="text-brand-primary">Millions</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              See why customers choose {siteName} for their personal banking
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
                🛡️ Your Security
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Bank with <span className="text-brand-primary">Peace of Mind</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Your money is protected by multiple layers of security and full NDIC insurance coverage.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Shield className="w-5 h-5" />, text: 'NDIC Insured Deposits' },
                  { icon: <Lock className="w-5 h-5" />, text: '256-bit SSL Encryption' },
                  { icon: <Clock className="w-5 h-5" />, text: '24/7 Fraud Monitoring' },
                  { icon: <Award className="w-5 h-5" />, text: 'CBN Regulated' }
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
                { value: '₦50M', label: 'NDIC Coverage', icon: <Shield className="w-6 h-6" /> },
                { value: '99.99%', label: 'Uptime SLA', icon: <Zap className="w-6 h-6" /> },
                { value: '2FA', label: 'Authentication', icon: <Lock className="w-6 h-6" /> },
                { value: '0%', label: 'Fraud Loss Rate', icon: <Award className="w-6 h-6" /> }
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
              Ready to Start Banking Smarter?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Open an account in minutes and experience banking designed for modern life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 bg-white text-brand-primary hover:bg-white/90 text-lg font-bold shadow-2xl">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Open Free Account
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

      <Footer />
    </div>
  );
}

