'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Eye,
  Target,
  Compass,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSettings } from '@/contexts/SettingsContext';

export default function AboutPage() {
  const { settings } = useSettings();
  const siteName = settings?.general?.siteName || 'RDN Bank';

  // Hero slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    '/images/about-slide-1.png',
    '/images/about-slide-2.png',
    '/images/about-slide-3.png',
    '/images/about-slide-4.png',
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Vision, Mission, Strategy cards
  const visionCards = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Our Vision',
      description: 'To be the undisputed leading and dominant financial services institution in our region.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Our Mission',
      description: 'To be a role model by creating superior value for all our stakeholders through excellence.',
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: 'Our Strategy',
      description: 'Our strategy revolves around innovation, customer-centricity and sustainable growth.',
    }
  ];

  // Feature cards with 3D artwork
  const featureCards = [
    {
      title: 'Our History',
      description: `${siteName} was established with a vision to transform banking. Over the years, we have evolved significantly, becoming one of the leading banks offering innovative services.`,
      image: '/images/about-history.png',
      href: '#history'
    },
    {
      title: 'Awards and Achievements',
      description: `${siteName} remains at the forefront of innovation in the financial services industry and has received numerous awards and accolades in recognition of its excellence.`,
      image: '/images/about-awards.png',
      href: '#awards'
    },
    {
      title: 'Leadership',
      description: 'Meet our board of directors and senior management comprising our Chair, Non-Executive Directors and Executive Directors.',
      image: '/images/about-leadership.png',
      href: '#leadership'
    },
    {
      title: "CEO's Overview",
      description: `At ${siteName}, our CEO is committed to excellence and innovation. We focus on customer satisfaction, technological advancement, and sustainable growth.`,
      image: '/images/about-ceo.png',
      href: '#ceo'
    },
    {
      title: 'Our Strategy',
      description: `At ${siteName}, our strategy is guided by a deep commitment to delivering value to our customers, shareholders, and communities.`,
      image: '/images/about-strategy.png',
      href: '#strategy'
    },
    {
      title: 'Global Presence',
      description: 'With branches in key financial centres across the region, we bring our innovative banking services to a diverse and international clientele.',
      image: '/images/about-global.png',
      href: '#global'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Enhanced with Animated Gradient */}
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

        {/* Animated floating orbs */}
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/30"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">About {siteName}</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                Your Trusted
                <br />
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Banking Partner
                </span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed max-w-xl mb-10">
                {siteName} operates with a commitment to excellence, serving individuals,
                businesses, and organizations. We bring world-class banking to you,
                supporting trade, business growth, and financial sustainability.
              </p>

              {/* Clear, Solid CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-white text-brand-primary hover:bg-white/90 text-lg font-bold rounded-xl shadow-2xl shadow-black/20"
                  >
                    Open an Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-slate-900 text-white hover:bg-slate-800 text-lg font-bold rounded-xl shadow-xl"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right - Image Slideshow */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] lg:h-[500px]"
            >
              {/* Slideshow Container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={heroSlides[currentSlide]}
                      alt={`${siteName} - Slide ${currentSlide + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-brand-primary hover:bg-white transition-colors z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-brand-primary hover:bg-white transition-colors z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${currentSlide === index
                        ? 'bg-white w-10'
                        : 'bg-white/50 hover:bg-white/70 w-3'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-brand-secondary/30 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Banking Excellence Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Decades of Banking
                <br />
                <span className="text-brand-primary">Excellence</span>
              </h2>
            </motion.div>

            {/* Right - Description */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 leading-relaxed space-y-4"
            >
              <p>
                For years, we have delivered superior financial services to individuals,
                businesses, governments, and global organizations. Our wide range of
                products and services meets the needs of millions of retail clients seeking
                savings, security and financial inclusion.
              </p>
              <p>
                We serve global businesses requiring sophisticated trade finance solutions.
                Our ability to combine last-mile payments with global FX and treasury
                products makes us the partner of choice for anyone seeking global solutions
                with local execution.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Strategy Cards */}
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
              🎯 Our Purpose
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              What Drives <span className="text-brand-primary">Us</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our vision, mission, and strategy guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {visionCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${index === 0 ? 'from-blue-600 to-cyan-500' :
                  index === 1 ? 'from-brand-primary to-brand-secondary' :
                    'from-purple-600 to-pink-500'
                  } flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid - Improved sizing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Text Content */}
                <div className="p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{card.description}</p>
                </div>

                {/* Image Container - Full width and height like UBA reference */}
                <div className="relative w-full h-[450px] lg:h-[500px] bg-gradient-to-br from-gray-50 via-gray-100/30 to-white">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              A testament to our commitment to excellence and customer satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10+', label: 'Years of Excellence' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '₦10B+', label: 'Transactions Processed' },
              { value: '24/7', label: 'Customer Support' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="py-20 bg-white" >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Bank with Us?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied customers who trust us with their financial future.
              Experience banking excellence today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Open an Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white text-lg px-8 py-6 rounded-xl transition-all"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section >

      <Footer />
    </div >
  );
}
