'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import {
  CreditCard,
  Smartphone,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Clock,
  BarChart3,
  Lock,
  Wifi,
  QrCode,
  Repeat,
  Users,
  Store,
  ShoppingCart,
  Package,
  Truck
} from 'lucide-react';

export default function MerchantServicesPage() {
  const solutions = [
    {
      icon: CreditCard,
      title: 'POS Terminals',
      description: 'Accept card payments in-store with our modern, reliable POS systems',
      features: [
        'Contactless & chip card support',
        'Instant settlement options',
        'Built-in receipt printer',
        'Multi-currency support',
        'Offline transaction mode',
        '24/7 technical support'
      ],
      pricing: {
        rate: '1.5%',
        setup: '₦0',
        monthly: '₦2,500'
      }
    },
    {
      icon: Globe,
      title: 'Online Payment Gateway',
      description: 'Seamlessly integrate payments into your website or mobile app',
      features: [
        'Easy API integration',
        'Multiple payment methods',
        'Fraud detection & prevention',
        'Recurring billing support',
        'Real-time transaction alerts',
        'Customizable checkout'
      ],
      pricing: {
        rate: '1.8%',
        setup: '₦0',
        monthly: '₦5,000'
      }
    },
    {
      icon: Smartphone,
      title: 'Mobile Payments',
      description: 'Accept payments on-the-go with our mobile payment solutions',
      features: [
        'QR code payments',
        'Mobile POS app',
        'USSD payment option',
        'Digital wallet integration',
        'Instant notifications',
        'Cloud-based reporting'
      ],
      pricing: {
        rate: '1.2%',
        setup: '₦0',
        monthly: '₦1,500'
      }
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Instant Settlement',
      description: 'Get your money within 24 hours with our T+1 settlement option'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'PCI-DSS compliant with advanced fraud protection'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track sales, refunds, and settlements in real-time'
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: '24/7 customer support and technical assistance'
    }
  ];

  const features = [
    {
      icon: Repeat,
      title: 'Recurring Payments',
      description: 'Automate subscription and recurring billing'
    },
    {
      icon: QrCode,
      title: 'QR Code Payments',
      description: 'Generate dynamic QR codes for quick payments'
    },
    {
      icon: Lock,
      title: 'Fraud Prevention',
      description: 'AI-powered fraud detection and prevention'
    },
    {
      icon: Wifi,
      title: 'Offline Mode',
      description: 'Continue accepting payments without internet'
    },
    {
      icon: Globe,
      title: 'Multi-Currency',
      description: 'Accept payments in multiple currencies'
    },
    {
      icon: BarChart3,
      title: 'Advanced Reporting',
      description: 'Detailed analytics and business insights'
    }
  ];

  const industries = [
    { icon: Store, title: 'Retail Stores', count: '5,000+' },
    { icon: ShoppingCart, title: 'E-commerce', count: '3,500+' },
    { icon: Package, title: 'Restaurants', count: '2,800+' },
    { icon: Truck, title: 'Logistics', count: '1,200+' },
    { icon: Users, title: 'Services', count: '4,000+' },
    { icon: Globe, title: 'Online Businesses', count: '6,000+' }
  ];

  const integrations = [
    'Shopify', 'WooCommerce', 'Magento', 'PrestaShop',
    'QuickBooks', 'Xero', 'Sage', 'Zoho Books',
    'Salesforce', 'HubSpot', 'Mailchimp', 'Slack'
  ];

  const pricingComparison = [
    { type: 'In-Store (POS)', rate: '1.5%', settlement: 'T+1', fee: '₦2,500/month' },
    { type: 'Online Payments', rate: '1.8%', settlement: 'T+1', fee: '₦5,000/month' },
    { type: 'Mobile Payments', rate: '1.2%', settlement: 'Instant', fee: '₦1,500/month' },
    { type: 'International Cards', rate: '2.5%', settlement: 'T+2', fee: 'Included' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
                <span className="text-brand-primary font-semibold text-sm">Payment Solutions for Modern Businesses</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Accept Payments
                <span className="text-brand-primary"> Anywhere, Anytime</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Comprehensive merchant services with competitive rates, instant settlement, and seamless integration. Grow your business with our payment solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white shadow-xl shadow-brand-primary/25 h-14 px-8 text-base rounded-xl">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-xl border-2">
                  View Pricing
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { label: 'Active Merchants', value: '22,000+' },
                { label: 'Daily Transactions', value: '₦2.5B+' },
                { label: 'Uptime', value: '99.9%' },
                { label: 'Countries', value: '15+' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
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
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose Our Merchant Services
            </h2>
            <p className="text-xl text-slate-600">
              Built for businesses that want to grow faster
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
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Solutions */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Our Payment Solutions
            </h2>
            <p className="text-xl text-slate-600">
              Choose the right solution for your business
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center mb-6">
                  <solution.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">{solution.title}</h3>
                <p className="text-slate-600 mb-6">{solution.description}</p>

                <div className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-brand-primary">{solution.pricing.rate}</div>
                      <div className="text-xs text-slate-600">Per Transaction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{solution.pricing.setup}</div>
                      <div className="text-xs text-slate-600">Setup Fee</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900">{solution.pricing.monthly}</div>
                      <div className="text-xs text-slate-600">Monthly</div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <Button className="w-full bg-brand-gradient text-white">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to manage payments efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-100 hover:border-brand-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-brand-primary mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Trusted Across Industries
            </h2>
            <p className="text-xl text-slate-600">
              Serving businesses of all sizes and sectors
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <industry.icon className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">{industry.title}</h3>
                <p className="text-2xl font-bold text-brand-primary">{industry.count}</p>
                <p className="text-sm text-slate-600">Active Merchants</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-slate-600">
              Connect with your favorite business tools
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-slate-50 rounded-lg p-4 text-center font-semibold text-slate-700 hover:bg-brand-primary/5 hover:text-brand-primary transition-all duration-300"
                >
                  {integration}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">
              No hidden fees, no surprises
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Payment Type</th>
                    <th className="px-6 py-4 text-left">Transaction Rate</th>
                    <th className="px-6 py-4 text-left">Settlement</th>
                    <th className="px-6 py-4 text-left">Monthly Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingComparison.map((item, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{item.type}</td>
                      <td className="px-6 py-4 text-brand-primary font-bold">{item.rate}</td>
                      <td className="px-6 py-4 text-slate-700">{item.settlement}</td>
                      <td className="px-6 py-4 text-slate-700">{item.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <TrendingUp className="w-16 h-16 text-brand-secondary mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Start Accepting Payments Today
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Join 22,000+ merchants growing their business with our payment solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl h-14 px-10 text-base rounded-xl font-semibold">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:text-white h-14 px-10 text-base rounded-xl">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

