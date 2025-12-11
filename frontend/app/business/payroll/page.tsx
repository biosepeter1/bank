'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import {
    Users,
    DollarSign,
    Clock,
    Shield,
    FileText,
    CheckCircle2,
    ArrowRight,
    Zap,
    BarChart3,
    Lock,
    Calendar,
    Download,
    Upload,
    Bell,
    Settings,
    TrendingUp,
    Award,
    Briefcase,
    CreditCard,
    Globe,
    Smartphone,
} from 'lucide-react';

export default function PayrollSolutionsPage() {


    const features = [
        {
            icon: Zap,
            title: 'Automated Processing',
            description: 'Set up once and let the system handle monthly payroll automatically',
            details: [
                'Scheduled automatic runs',
                'Bulk salary disbursement',
                'Instant payment confirmation',
                'Error-free calculations'
            ]
        },
        {
            icon: Shield,
            title: 'Tax Compliance',
            description: 'Stay compliant with automatic tax calculations and filings',
            details: [
                'PAYE auto-calculation',
                'Pension remittance',
                'Tax filing assistance',
                'Compliance reporting'
            ]
        },
        {
            icon: Users,
            title: 'Employee Self-Service',
            description: 'Empower employees with access to their payroll information',
            details: [
                'Digital payslips',
                'Tax documents download',
                'Leave management',
                'Salary advance requests'
            ]
        },
        {
            icon: BarChart3,
            title: 'Advanced Analytics',
            description: 'Gain insights into your payroll costs and trends',
            details: [
                'Cost analysis reports',
                'Department breakdowns',
                'Trend forecasting',
                'Export capabilities'
            ]
        }
    ];

    const benefits = [
        {
            icon: Clock,
            title: 'Save Time',
            description: 'Reduce payroll processing time by 90% with automation'
        },
        {
            icon: DollarSign,
            title: 'Reduce Costs',
            description: 'Cut payroll administration costs by up to 60%'
        },
        {
            icon: Lock,
            title: 'Secure & Compliant',
            description: 'Bank-grade security with full regulatory compliance'
        },
        {
            icon: TrendingUp,
            title: 'Scalable',
            description: 'Grow from 10 to 10,000 employees seamlessly'
        }
    ];

    const integrations = [
        {
            icon: FileText,
            title: 'Accounting Software',
            apps: ['QuickBooks', 'Xero', 'Sage', 'Zoho Books']
        },
        {
            icon: Users,
            title: 'HR Systems',
            apps: ['BambooHR', 'Workday', 'SAP SuccessFactors', 'Oracle HCM']
        },
        {
            icon: Calendar,
            title: 'Time Tracking',
            apps: ['Clockify', 'Toggl', 'Harvest', 'TimeCamp']
        },
        {
            icon: CreditCard,
            title: 'Benefits Providers',
            apps: ['Pension Administrators', 'Health Insurance', 'Life Insurance']
        }
    ];

    const pricingTiers = [
        {
            name: 'Starter',
            price: '₦15,000',
            employees: 'Up to 50',
            features: [
                'Automated payroll processing',
                'Tax calculations',
                'Employee self-service portal',
                'Basic reporting',
                'Email support',
                'Mobile app access'
            ],
            popular: false
        },
        {
            name: 'Professional',
            price: '₦35,000',
            employees: 'Up to 200',
            features: [
                'Everything in Starter',
                'Advanced analytics',
                'Leave management',
                'Loan management',
                'API access',
                'Priority support',
                'Custom workflows',
                'Dedicated account manager'
            ],
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            employees: 'Unlimited',
            features: [
                'Everything in Professional',
                'Multi-company support',
                'Custom integrations',
                'White-label option',
                'SLA guarantee',
                '24/7 phone support',
                'On-site training',
                'Dedicated implementation team'
            ],
            popular: false
        }
    ];

    const steps = [
        {
            number: '01',
            title: 'Upload Employee Data',
            description: 'Import your employee information via CSV or connect your HR system',
            icon: Upload
        },
        {
            number: '02',
            title: 'Configure Settings',
            description: 'Set up salary structures, deductions, and payment schedules',
            icon: Settings
        },
        {
            number: '03',
            title: 'Review & Approve',
            description: 'Review calculated payroll and approve for processing',
            icon: CheckCircle2
        },
        {
            number: '04',
            title: 'Automatic Disbursement',
            description: 'Salaries are automatically transferred to employee accounts',
            icon: Zap
        }
    ];

    const compliance = [
        'PAYE (Pay As You Earn) calculations',
        'Pension contributions (8% employee, 10% employer)',
        'National Housing Fund (NHF) deductions',
        'Industrial Training Fund (ITF) compliance',
        'NSITF (Employee Compensation) contributions',
        'Withholding Tax (WHT) management',
        'Annual tax returns preparation',
        'Audit trail and record keeping'
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-block px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
                                <span className="text-brand-primary font-semibold text-sm">Payroll Made Simple</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                                Automate Your Payroll in
                                <span className="text-brand-primary"> Minutes, Not Days</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                Complete payroll solution with automated tax compliance, employee self-service, and seamless integration with your accounting software.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register">
                                    <Button size="lg" className="bg-brand-gradient hover:opacity-90 text-white shadow-xl shadow-brand-primary/25 h-14 px-8 text-base rounded-xl">
                                        Start Free Trial
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>

                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 p-8">
                                <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-900">Payroll Summary</h3>
                                        <span className="text-sm text-brand-primary font-semibold">November 2024</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Total Employees</span>
                                            <span className="font-bold">156</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Gross Salary</span>
                                            <span className="font-bold">₦45,600,000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Deductions</span>
                                            <span className="font-bold text-red-600">₦8,200,000</span>
                                        </div>
                                        <div className="flex justify-between pt-3 border-t">
                                            <span className="font-bold text-slate-900">Net Salary</span>
                                            <span className="font-bold text-brand-primary text-xl">₦37,400,000</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white rounded-xl p-4 shadow">
                                        <Users className="w-8 h-8 text-brand-primary mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">98%</div>
                                        <div className="text-xs text-slate-600">On-time Rate</div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow">
                                        <Clock className="w-8 h-8 text-green-500 mb-2" />
                                        <div className="text-2xl font-bold text-slate-900">5 min</div>
                                        <div className="text-xs text-slate-600">Avg. Process Time</div>
                                    </div>
                                </div>
                            </div>
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
                            Why Businesses Choose Us
                        </h2>
                        <p className="text-xl text-slate-600">
                            Transform your payroll from a headache to a breeze
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

            {/* Features Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Comprehensive Payroll Features
                        </h2>
                        <p className="text-xl text-slate-600">
                            Everything you need in one powerful platform
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100"
                            >
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center flex-shrink-0">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                        <p className="text-slate-600">{feature.description}</p>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {feature.details.map((detail, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-sm text-slate-600">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-slate-600">
                            Get started in 4 simple steps
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-sm font-bold text-brand-primary mb-2">{step.number}</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-slate-600">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Compliance Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <Shield className="w-16 h-16 text-brand-primary mx-auto mb-6" />
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                                Full Tax & Regulatory Compliance
                            </h2>
                            <p className="text-xl text-slate-600">
                                Stay compliant with Nigerian tax laws and regulations
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                {compliance.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                                        </div>
                                        <span className="text-slate-700">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
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
                            Connect with your existing business tools
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {integrations.map((integration, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
                            >
                                <integration.icon className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                                <h3 className="font-bold text-slate-900 mb-3">{integration.title}</h3>
                                <div className="space-y-1">
                                    {integration.apps.map((app, i) => (
                                        <div key={i} className="text-sm text-slate-600">{app}</div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
                        <Award className="w-16 h-16 text-brand-secondary mx-auto mb-6" />
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Ready to Simplify Your Payroll?
                        </h2>
                        <p className="text-xl text-white/80 mb-10">
                            Join 5,000+ businesses that trust us with their payroll
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl h-14 px-10 text-base rounded-xl font-semibold">
                                    Start Free 30-Day Trial
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:text-white h-14 px-10 text-base rounded-xl">
                                    Schedule a Demo
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

