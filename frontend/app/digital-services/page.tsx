'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  CreditCard,
  Bell,
  Shield,
  CheckCircle,
  Download,
  Fingerprint,
  Zap,
  Eye,
  Lock,
  Bot
} from 'lucide-react';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSettings } from '@/contexts/SettingsContext';

export default function DigitalServicesPage() {
  const { settings } = useSettings();
  const siteName = settings?.general?.siteName || 'RDN Bank';

  const services = [
    {
      id: 'app',
      icon: <Smartphone className="w-12 h-12" />,
      title: 'Mobile Banking App',
      subtitle: 'Your Bank in Your Pocket',
      description: 'Instant transfers, biometric login, card control, and financial insights. Experience the full power of digital banking wherever you go.',
      features: [
        'Biometric login (Face ID / Fingerprint)',
        'Instant money transfers',
        'Card freeze & unfreeze',
        'Spending analytics & insights',
        'Bill payments & airtime top-up'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'online',
      icon: <Monitor className="w-12 h-12" />,
      title: 'Online Banking Portal',
      subtitle: 'Complete Control from Any Device',
      description: 'Manage accounts, payments, statements, and schedules securely from any device. Full-featured banking accessible through your browser.',
      features: [
        'Account management dashboard',
        'Payment scheduling & automation',
        'Statement downloads (PDF/CSV)',
        'Beneficiary management',
        'Transaction history & search'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'virtual',
      icon: <CreditCard className="w-12 h-12" />,
      title: 'Virtual Cards',
      subtitle: 'Secure Digital Payments',
      description: 'Generate secure digital cards for online payments with customizable limits. Protect your main card while shopping online.',
      features: [
        'Instant card generation',
        'Customizable spending limits',
        'Single-use or recurring options',
        'Enhanced online security',
        'Real-time transaction alerts'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'alerts',
      icon: <Bell className="w-12 h-12" />,
      title: 'Instant Alerts & Notifications',
      subtitle: 'Stay Informed in Real-Time',
      description: 'Real-time updates for every transaction. Never miss an important account activity with our comprehensive notification system.',
      features: [
        'Transaction alerts (push, SMS, email)',
        'Low balance warnings',
        'Security notifications',
        'Payment reminders',
        'Customizable alert preferences'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'security',
      icon: <Shield className="w-12 h-12" />,
      title: 'Fraud Protection & Security',
      subtitle: 'Bank-Grade Protection',
      description: 'Multi-factor authentication, encryption, and intelligent monitoring. Your security is our top priority.',
      features: [
        'Multi-factor authentication (MFA)',
        'End-to-end encryption',
        'AI-powered fraud detection',
        'Suspicious activity alerts',
        '24/7 security monitoring'
      ],
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const securityFeatures = [
    {
      icon: <Fingerprint className="w-8 h-8" />,
      title: 'Biometric Authentication',
      description: 'Use your fingerprint or face to securely access your accounts.'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: '256-bit Encryption',
      description: 'Military-grade encryption protects all your data and transactions.'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Real-time Monitoring',
      description: 'AI systems monitor for suspicious activity around the clock.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Alerts',
      description: 'Get notified immediately of any account activity.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary text-white py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Digital{' '}
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Experience Seamless Digital Banking—Anytime, Anywhere
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Digital Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern banking tools designed for the digital age
            </p>
          </motion.div>

          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-20 last:mb-0"
            >
              <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 0 ? '' : 'md:grid-flow-dense'}`}>
                <div className={index % 2 === 0 ? '' : 'md:col-start-2'}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                    {service.icon}
                  </div>

                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xl text-gray-600 mb-6">
                    {service.subtitle}
                  </p>
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {service.id === 'app' && (
                    <Button size="lg" className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}>
                      <Download className="w-5 h-5 mr-2" />
                      Download App
                    </Button>
                  )}
                  {service.id === 'online' && (
                    <Link href="/login">
                      <Button size="lg" className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}>
                        <Monitor className="w-5 h-5 mr-2" />
                        Access Portal
                      </Button>
                    </Link>
                  )}
                  {service.id === 'virtual' && (
                    <Link href="/register">
                      <Button size="lg" className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Get Virtual Card
                      </Button>
                    </Link>
                  )}
                  {service.id === 'alerts' && (
                    <Link href="/register">
                      <Button size="lg" className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}>
                        <Bell className="w-5 h-5 mr-2" />
                        Enable Alerts
                      </Button>
                    </Link>
                  )}
                  {service.id === 'security' && (
                    <Link href="/register">
                      <Button size="lg" className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}>
                        <Shield className="w-5 h-5 mr-2" />
                        Secure My Account
                      </Button>
                    </Link>
                  )}
                </div>

                <div className={`relative ${index % 2 === 0 ? '' : 'md:col-start-1 md:row-start-1'}`}>
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                    <div className={`w-full h-full bg-gradient-to-br ${service.color} flex items-center justify-center opacity-20`}>
                      <div className="text-9xl">{service.icon}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Security, Our Priority
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced security measures to protect your digital banking experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Experience Digital Banking
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Download our app or access your dashboard to get started
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-gray-100 text-lg px-8 py-6">
                <Download className="w-5 h-5 mr-2" />
                Download App
              </Button>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Access Dashboard
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

