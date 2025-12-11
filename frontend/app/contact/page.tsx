'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  CreditCard,
  AlertCircle,
  Building2,
  HelpCircle,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useSettings } from '@/contexts/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();
  const siteName = settings?.general?.siteName || 'RDN Bank';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/support/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          category: formData.category,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Message sent successfully! Reference: #${data.reference}. We'll get back to you within 24 hours.`, {
          duration: 5000,
          icon: '✉️'
        });
        setFormData({ name: '', email: '', subject: '', category: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-7 h-7" />,
      title: 'Email Support',
      details: settings.general.supportEmail || 'support@rdnbank.com',
      subtitle: 'Reply within 24 hours',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: <MapPin className="w-7 h-7" />,
      title: 'Head Office',
      details: 'Victoria Island, Lagos',
      subtitle: 'Nigeria',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const contactCategories = [
    { icon: <HelpCircle className="w-5 h-5" />, label: 'General Inquiries', value: 'general' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Card Issues', value: 'cards' },
    { icon: <Send className="w-5 h-5" />, label: 'Transfers & Payments', value: 'transfers' },
    { icon: <AlertCircle className="w-5 h-5" />, label: 'Fraud or Dispute', value: 'fraud' },
    { icon: <Building2 className="w-5 h-5" />, label: 'Corporate Services', value: 'corporate' }
  ];

  const quickActions = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Chat with our support team or AI assistant 24/7',
      action: 'Start Chat',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Support',
      description: 'Call our dedicated support line anytime',
      action: settings.general.supportPhone || '+234 800 900 7777',
      gradient: 'from-emerald-500 to-teal-500',
      isPhone: true
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: 'Help Center',
      description: 'Browse FAQs and knowledge base',
      action: 'Visit FAQ',
      gradient: 'from-violet-500 to-purple-500',
      href: '/faq'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Toaster position="top-center" />

      {/* Hero Section - Enhanced */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/5 to-transparent rounded-full" />
        </div>

        <div className="container mx-auto px-6 relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-white/20"
            >
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">24/7 Customer Support</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Get in Touch
              <br />
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                With Us
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl mx-auto">
              We're here to help with your banking needs. Reach out through any channel
              and our team will respond promptly and professionally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards - Floating */}
      <section className="relative z-20 -mt-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {info.title}
                </h3>
                <p className="text-brand-primary font-semibold mb-1">
                  {info.details}
                </p>
                <p className="text-sm text-gray-500">
                  {info.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Options */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Form - Takes 3 columns */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-xl border border-gray-100">
                <span className="inline-block text-brand-primary font-semibold text-sm uppercase tracking-wider mb-3">Message Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and our team will get back to you promptly
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                      Inquiry Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-gray-900 focus:border-brand-primary focus:ring-brand-primary"
                    >
                      <option value="">Select a category</option>
                      {contactCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full h-12 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your inquiry in detail..."
                      rows={5}
                      required
                      className="w-full rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-lg rounded-xl shadow-lg font-semibold transition-all hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Support Options - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Quick Actions */}
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
                <span className="inline-block text-brand-primary font-semibold text-sm uppercase tracking-wider mb-3">Quick Actions</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Other Ways to Reach Us
                </h3>

                <div className="space-y-5">
                  {quickActions.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>
                        {item.isPhone ? (
                          <a href={`tel:${item.action}`} className="text-brand-primary hover:text-brand-secondary font-semibold inline-flex items-center gap-1">
                            {item.action}
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        ) : item.href ? (
                          <Link href={item.href}>
                            <Button variant="outline" size="sm" className="rounded-lg border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
                              {item.action}
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" size="sm" className="rounded-lg border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white">
                            {item.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Working Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-lg">Closed</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Digital support available 24/7</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary rounded-[2rem] p-12 lg:p-16 text-white text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                We're Here to Help
              </h2>
              <p className="text-xl text-white/85 mb-8 leading-relaxed">
                Your satisfaction is our priority. Reach out through any channel, and we'll ensure
                your concerns are addressed promptly and professionally.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-brand-primary hover:bg-white/95 text-lg px-8 py-6 rounded-xl shadow-xl font-semibold transition-all hover:scale-105"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Now
                </Button>
                <Button
                  size="lg"
                  className="bg-white/15 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/25 text-lg px-8 py-6 rounded-xl font-semibold transition-all hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Live Chat
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

