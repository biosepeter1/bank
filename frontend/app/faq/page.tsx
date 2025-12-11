'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Search,
  MessageCircle,
  HelpCircle,
  Sparkles,
  Shield,
  CreditCard,
  Wallet,
  ArrowRight,
  Send,
  Phone,
  Mail,
  Clock,
  Users,
  Building2,
  Lock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { useBranding } from '@/contexts/BrandingContext';
import { useSettings } from '@/contexts/SettingsContext';

export default function FAQPage() {
  const { branding } = useBranding();
  const { settings } = useSettings();
  const siteName = settings?.general?.siteName || branding.name || 'RDN Bank';
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    { name: 'Account Management', icon: <Users className="w-5 h-5" />, emoji: '👤' },
    { name: 'Deposits & Withdrawals', icon: <Wallet className="w-5 h-5" />, emoji: '💰' },
    { name: 'Transfers & Transactions', icon: <Send className="w-5 h-5" />, emoji: '💸' },
    { name: 'Virtual Cards', icon: <CreditCard className="w-5 h-5" />, emoji: '💳' },
    { name: 'Loans & Applications', icon: <Building2 className="w-5 h-5" />, emoji: '🏦' },
    { name: 'Security & Support', icon: <Shield className="w-5 h-5" />, emoji: '🔐' }
  ];

  const faqs = [
    {
      category: 'Account Management',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Creating your account is simple and takes just minutes:\n\n• Click the "Register" button on our homepage\n• Provide your personal information (full name, email, phone number)\n• Create a secure password with at least 8 characters\n• Complete email verification via the link we send\n• Submit KYC documents to unlock all banking features\n\nOnce verified, you\'ll have full access to all our premium banking services.'
        },
        {
          question: 'What is KYC verification and why is it required?',
          answer: 'KYC (Know Your Customer) verification is a regulatory requirement that protects both you and our institution:\n\nRequired Documents:\n• Government-issued ID (passport, driver\'s license, or national ID)\n• Proof of address (utility bill or bank statement dated within 3 months)\n• Selfie photo for identity confirmation\n\nBenefits After Verification:\n• Full access to deposits and withdrawals\n• Higher transaction limits\n• Complete banking services\n• Enhanced account security\n\nVerification typically takes 24-48 hours.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Password reset is quick and secure:\n\n1. Click "Forgot Password" on the login page\n2. Enter your registered email address\n3. Check your inbox for the password reset link\n4. Click the link and create a new strong password\n5. Log in with your new credentials\n\nFor security, reset links expire after 24 hours. If you don\'t receive the email, check your spam folder or contact support.'
        },
        {
          question: 'Can I access my account from multiple devices?',
          answer: 'Yes! Your account is accessible from any device:\n\n• Desktop computers and laptops\n• Tablets (iOS and Android)\n• Smartphones\n• Any modern web browser\n\nSecurity Recommendations:\n• Always log out after each session on shared devices\n• Enable login notifications for real-time alerts\n• Use our mobile app for the most secure experience\n• Avoid accessing your account on public WiFi without a VPN'
        }
      ]
    },
    {
      category: 'Deposits & Withdrawals',
      questions: [
        {
          question: 'How do I fund my wallet?',
          answer: 'Adding funds to your wallet is straightforward:\n\n1. Navigate to the Wallet section in your dashboard\n2. Click "Add Funds" or "Deposit"\n3. Select your preferred payment method\n4. Enter the amount and follow the prompts\n\nAvailable Funding Methods:\n• Bank transfer\n• Card payment (Visa/Mastercard)\n• USSD banking\n• Mobile money\n\nMost deposits are credited instantly, though some methods may take up to 24 hours.'
        },
        {
          question: 'What are the withdrawal options?',
          answer: 'We offer multiple withdrawal methods for your convenience:\n\n• Direct bank transfer to any Nigerian bank\n• International wire transfers\n• Mobile money withdrawal\n\nWithdrawal Process:\n1. Go to Wallet → Withdraw\n2. Select withdrawal method\n3. Enter amount and destination details\n4. Confirm with your PIN/OTP\n5. Track status in transaction history\n\nAll withdrawals undergo security verification to protect your funds.'
        },
        {
          question: 'Are there any fees for deposits or withdrawals?',
          answer: 'Our fee structure is transparent and competitive:\n\nDeposits:\n• Bank transfers: FREE\n• Card deposits: 1.5% (capped at ₦2,000)\n• Mobile money: Varies by provider\n\nWithdrawals:\n• Local transfers: ₦50 flat fee\n• International: Based on amount and destination\n\nView the complete fee schedule in Settings → Fees & Charges. Fees are always displayed before you confirm any transaction.'
        },
        {
          question: 'How long do withdrawals take to process?',
          answer: 'Processing times depend on the method and amount:\n\nStandard Withdrawals:\n• Same-day for requests before 2 PM\n• Next business day for later requests\n\nHigh-Value Withdrawals (above ₦1M):\n• 1-3 business days\n• May require additional verification\n\nInternational Withdrawals:\n• 3-5 business days\n• Subject to correspondent bank processing\n\nTrack your withdrawal status in real-time through your dashboard.'
        }
      ]
    },
    {
      category: 'Transfers & Transactions',
      questions: [
        {
          question: 'How do I transfer funds to another user?',
          answer: 'Transfers are fast and secure:\n\nInternal Transfers (to other users):\n1. Go to Transfers → Send Money\n2. Enter recipient\'s email or account number\n3. Enter amount and optional note\n4. Confirm with your PIN\n5. Instant delivery!\n\nExternal Transfers:\n1. Select "Bank Transfer"\n2. Enter bank details and amount\n3. Verify recipient information\n4. Confirm and track status\n\nAll transfers include real-time notifications for both sender and recipient.'
        },
        {
          question: 'What are transfer verification codes?',
          answer: 'Transfer verification codes add extra security for certain transactions:\n\nTypes of Codes:\n• COT (Cost of Transfer) Code - For high-value transfers\n• IMF Code - For international transactions\n• TAX Code - For tax compliance on large sums\n\nWhen Required:\n• Transfers above certain thresholds\n• International transactions\n• First-time transfers to new recipients\n\nCodes are requested through your dashboard and typically issued within 24-48 hours after verification.'
        },
        {
          question: 'Are there transaction limits?',
          answer: 'Transaction limits protect your account and can be increased:\n\nDefault Daily Limits:\n• Standard accounts: ₦500,000\n• Verified accounts: ₦5,000,000\n• Premium accounts: ₦20,000,000+\n\nHow to Increase Limits:\n1. Complete full KYC verification\n2. Maintain positive account history\n3. Request limit increase through Settings\n4. Provide additional documentation if required\n\nView your current limits anytime in Settings → Transaction Limits.'
        },
        {
          question: 'Can I cancel a transaction?',
          answer: 'Transaction modifications depend on the status:\n\nPending Transactions:\n• Can be cancelled before processing\n• Go to Transaction History → Find Transaction → Cancel\n\nProcessed Transactions:\n• Cannot be automatically reversed\n• Contact support immediately with transaction ID\n• We\'ll work with you to resolve the issue\n\nPrevention Tips:\n• Double-check recipient details before confirming\n• Use our recipient verification feature\n• Save frequent recipients for accuracy'
        }
      ]
    },
    {
      category: 'Virtual Cards',
      questions: [
        {
          question: 'How do I request a virtual card?',
          answer: 'Getting a virtual card is quick and easy:\n\n1. Navigate to Cards section\n2. Click "Create New Card"\n3. Choose card type (Visa or Mastercard)\n4. Set your spending limit\n5. Card is instantly generated!\n\nCard Features:\n• Unique card number for online purchases\n• CVV and expiry date\n• Works globally on any website\n• Instant funding from your wallet\n\nNo approval wait time - start shopping immediately!'
        },
        {
          question: 'How many virtual cards can I have?',
          answer: 'Create multiple cards for better financial management:\n\n• Standard accounts: Up to 3 active cards\n• Verified accounts: Up to 5 active cards\n• Premium accounts: Unlimited cards\n\nBest Practices:\n• Create separate cards for subscriptions\n• Use dedicated cards for specific merchants\n• Set individual limits per card\n• Delete cards you no longer need\n\nManage all your cards from the Cards dashboard.'
        },
        {
          question: 'Can I freeze or unfreeze my card?',
          answer: 'You have complete control over your cards:\n\nTo Freeze a Card:\n1. Go to Cards → Select Card\n2. Toggle "Freeze Card" ON\n3. Card is instantly blocked\n\nTo Unfreeze:\n1. Toggle "Freeze Card" OFF\n2. Card is immediately active\n\nWhen to Freeze:\n• Suspicious activity detected\n• Lost or stolen device\n• Temporary pause on spending\n• Traveling and want extra security\n\nFreezing is free and doesn\'t affect your card details.'
        },
        {
          question: 'What should I do if my card details are compromised?',
          answer: 'Act immediately if you suspect card compromise:\n\nImmediate Steps:\n1. Freeze the card instantly via dashboard\n2. Contact support through live chat\n3. Review recent transactions\n4. Report any unauthorized charges\n\nOur Response:\n• Investigate flagged transactions\n• Issue a new card with fresh details\n• Refund confirmed fraudulent charges\n• Provide incident report if needed\n\nPrevention:\n• Never share card details via email/phone\n• Use secure websites only (look for HTTPS)\n• Enable transaction notifications'
        }
      ]
    },
    {
      category: 'Loans & Applications',
      questions: [
        {
          question: 'How do I apply for a loan?',
          answer: 'Our loan application process is streamlined:\n\n1. Go to Loans → Apply Now\n2. Select loan type (Personal, Business, etc.)\n3. Enter desired amount and tenure\n4. Complete the application form\n5. Upload required documents\n6. Submit for review\n\nDecision Timeline:\n• Initial response: Within 24 hours\n• Full approval: 3-5 business days\n• Disbursement: Same day after approval\n\nTrack your application status in real-time.'
        },
        {
          question: 'What are the loan requirements?',
          answer: 'Eligibility varies by loan type, but generally requires:\n\nBasic Requirements:\n• Completed KYC verification\n• Minimum 3 months account history\n• Good account standing\n• Valid employment or income proof\n\nDocuments Needed:\n• Bank statements (3-6 months)\n• Employment letter or business registration\n• Valid ID\n• Proof of address\n\nCredit Assessment Factors:\n• Transaction history\n• Existing obligations\n• Repayment capacity'
        },
        {
          question: 'What happens after I submit a loan application?',
          answer: 'Here\'s what to expect after submission:\n\nReview Process:\n1. Application received and logged\n2. Document verification (1-2 days)\n3. Credit assessment\n4. Decision communicated via email\n\nIf Approved:\n• Accept loan terms in your dashboard\n• Pay any applicable processing fee\n• Funds disbursed within 24 hours\n• Repayment schedule activated\n\nIf More Info Needed:\n• You\'ll receive specific requests\n• Submit via secure upload\n• Continue review process'
        },
        {
          question: 'Can I have multiple active loans?',
          answer: 'Multiple loans are possible based on your profile:\n\nEligibility Factors:\n• Current loans in good standing\n• Total debt-to-income ratio\n• Available credit capacity\n• Repayment history\n\nHow It Works:\n• Each application evaluated independently\n• Combined exposure considered\n• May require additional documentation\n• Higher verification for multiple loans\n\nTip: Maintaining perfect repayment on existing loans increases approval chances for additional credit.'
        }
      ]
    },
    {
      category: 'Security & Support',
      questions: [
        {
          question: 'How secure is my account?',
          answer: 'Your security is our top priority:\n\nTechnical Safeguards:\n• 256-bit SSL encryption\n• Two-factor authentication (2FA)\n• Biometric login support\n• Real-time fraud monitoring\n• PCI-DSS compliance\n\nAccount Protections:\n• Login attempt notifications\n• Unusual activity alerts\n• Session timeout controls\n• Device management\n\nYour Responsibilities:\n• Use strong, unique passwords\n• Never share login credentials\n• Enable all security features\n• Report suspicious activity immediately'
        },
        {
          question: 'How do I contact customer support?',
          answer: 'We\'re here for you 24/7:\n\nLive Chat:\n• Instant response during business hours\n• Available in your dashboard\n• AI assistant for quick answers\n\nSupport Tickets:\n• Go to Support → New Ticket\n• Describe your issue in detail\n• Attach screenshots if helpful\n• Track status in ticket history\n\nOther Channels:\n• Email: support@' + siteName.toLowerCase().replace(/\s+/g, '') + '.com\n• Phone: Available for premium accounts\n• Social media: @' + siteName.toLowerCase().replace(/\s+/g, '') + '\n\nTarget response time: Under 2 hours for urgent issues.'
        },
        {
          question: 'What should I do if I notice suspicious activity?',
          answer: 'Take immediate action:\n\nStep 1: Secure Your Account\n• Change your password immediately\n• Enable 2FA if not active\n• Freeze any affected cards\n\nStep 2: Report to Us\n• Use live chat for fastest response\n• Provide transaction IDs\n• Note dates and amounts\n• Share any suspicious emails received\n\nStep 3: Our Investigation\n• Account secured within minutes\n• Full investigation initiated\n• Updates provided within 24 hours\n• Resolution and compensation if applicable\n\nRemember: We will NEVER ask for your password or PIN.'
        },
        {
          question: 'How do I close my account?',
          answer: 'Account closure process:\n\nBefore Closing:\n• Withdraw or transfer all funds\n• Cancel any active subscriptions\n• Download transaction history\n• Resolve any pending issues\n\nTo Close:\n1. Contact support with your request\n2. Verify your identity\n3. Confirm closure request\n4. Receive confirmation email\n\nTimeline:\n• Processing: 5-7 business days\n• Data retention per regulatory requirements\n• Reactivation possible within 90 days\n\nWe\'d love to know why you\'re leaving so we can improve.'
        }
      ]
    }
  ];

  const filteredFaqs = searchTerm
    ? faqs.map(category => ({
      ...category,
      questions: category.questions.filter(q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.questions.length > 0)
    : [faqs[activeCategory]];

  const stats = [
    { value: '24/7', label: 'Support Available', icon: <Clock className="w-5 h-5" /> },
    { value: '<2hrs', label: 'Response Time', icon: <Send className="w-5 h-5" /> },
    { value: '98%', label: 'Resolution Rate', icon: <Shield className="w-5 h-5" /> },
    { value: '50K+', label: 'Queries Resolved', icon: <MessageCircle className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
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
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Animated orbs */}
        <motion.div
          className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px]"
          animate={{
            x: [0, -20, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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
              <span className="text-white text-sm font-medium">Help Center</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Find quick answers to common questions about our banking services
            </p>

            {/* Search Box */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 pr-6 py-7 text-lg bg-white border-0 text-slate-900 placeholder:text-slate-400 rounded-2xl shadow-2xl focus:ring-4 focus:ring-brand-primary/30"
              />
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      {!searchTerm && (
        <section className="py-8 bg-slate-50 border-b border-slate-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveCategory(index);
                    setOpenIndex(null);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeCategory === index
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {filteredFaqs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-3xl shadow-lg border border-slate-200"
            >
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600 mb-2">No results found for "{searchTerm}"</p>
              <p className="text-slate-500 mb-6">Try different keywords or browse categories</p>
              <Button
                onClick={() => setSearchTerm('')}
                className="bg-brand-gradient text-white font-semibold shadow-lg"
              >
                Clear Search
              </Button>
            </motion.div>
          ) : (
            filteredFaqs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-8"
              >
                {searchTerm && (
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white">
                      {categories.find(c => c.name === category.category)?.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {category.category}
                    </h2>
                  </div>
                )}

                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const globalIndex = categoryIndex * 100 + index;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all border-2 ${isOpen ? 'border-brand-primary' : 'border-transparent'
                          }`}
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className={`w-full px-6 py-5 flex items-center justify-between text-left transition-all ${isOpen ? 'bg-brand-primary/5' : 'hover:bg-slate-50'
                            }`}
                        >
                          <div className="flex items-start gap-4 pr-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isOpen ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                              <HelpCircle className="w-5 h-5" />
                            </div>
                            <span className={`font-semibold text-lg ${isOpen ? 'text-brand-primary' : 'text-slate-900'}`}>
                              {faq.question}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isOpen ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500'
                              }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 py-6 border-t border-slate-100 bg-slate-50/50">
                                <div className="text-slate-700 leading-relaxed pl-14 whitespace-pre-line">
                                  {faq.answer}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full text-sm font-bold text-brand-primary mb-6">
              💬 Need More Help?
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Still Have <span className="text-brand-primary">Questions?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our dedicated support team is available around the clock to assist you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <MessageCircle className="w-7 h-7" />, title: 'Live Chat', description: 'Get instant help from our support team', action: 'Start Chat', link: '/contact' },
              { icon: <Mail className="w-7 h-7" />, title: 'Email Support', description: 'Send us a detailed message', action: 'Send Email', link: '/contact' },
              { icon: <Phone className="w-7 h-7" />, title: 'Phone Support', description: 'Speak directly with an agent', action: 'Call Now', link: '/contact' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-slate-50 rounded-3xl p-8 text-center hover:bg-white hover:shadow-2xl transition-all duration-500 border border-slate-100"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-brand-primary/30 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 mb-6">{item.description}</p>
                <Link href={item.link}>
                  <Button className="bg-brand-gradient text-white hover:opacity-90 shadow-lg">
                    {item.action}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of satisfied customers enjoying seamless banking with {siteName}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 bg-white text-brand-primary hover:bg-white/90 text-lg font-bold shadow-2xl">
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="h-16 px-10 bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 text-lg font-bold">
                  Contact Support
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

