'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  Ticket,
  HelpCircle,
  MessageSquare,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { useBranding } from '@/contexts/BrandingContext';
import { useAuthStore } from '@/stores/authStore';
import { useSocket } from '@/hooks/useSocket';

type TicketMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'USER' | 'ADMIN';
  message: string;
  createdAt: string;
};

type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
};

type FAQ = {
  question: string;
  answer: string;
  category: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function SupportPage() {
  
  const { branding } = useBranding();
const { settings } = useSettings();
  const { user } = useAuthStore();
  const { socket, isConnected } = useSocket(user?.id, user?.role);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'contact'>('tickets');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: '',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message: TicketMessage) => {
      // Update selected ticket if it matches
      if (selectedTicket && message.ticketId === selectedTicket.id) {
        setSelectedTicket((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [...(prev.messages || []), message],
          };
        });
      }
      
      // Show notification if message is from support
      if (message.senderType === 'ADMIN') {
        toast.success('New message from Support Team');
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, selectedTicket]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${backendUrl}/support/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Failed to fetch support tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const faqs: FAQ[] = [
    {
      question: 'How do I complete KYC verification?',
      answer: 'Steps to complete verification:\n\n• Navigate to Account Settings\n• Click on KYC Verification\n• Upload government-issued ID\n• Upload proof of address\n• Submit selfie photo\n\nOur verification team will review within 24-48 hours and notify you via email.',
      category: 'Account',
    },
    {
      question: 'How do I fund my wallet?',
      answer: 'Funding process:\n\n• Go to the Wallet section\n• Submit a funding request\n• Select payment method\n• Follow instructions\n\nNote: Approval from our verification team may be required. Contact support for assistance.',
      category: 'Account',
    },
    {
      question: 'How do I request a withdrawal?',
      answer: 'Withdrawal steps:\n\n• Navigate to Wallet section\n• Click "Withdraw Funds"\n• Enter withdrawal amount\n• Select withdrawal method\n• Confirm request\n\nProcessing: 1-3 business days after verification approval.',
      category: 'Transactions',
    },
    {
      question: 'What are transfer verification codes (COT/IMF/TAX)?',
      answer: 'Verification codes are security measures for certain transactions:\n\n• Request codes through Transfers section\n• Our verification team reviews requests\n• Codes sent to registered email\n• Required for high-value transfers\n\nTypes: COT, IMF, and TAX codes.',
      category: 'Transactions',
    },
    {
      question: 'How do I request a virtual card?',
      answer: 'Card request process:\n\n• Go to Cards section\n• Click "Request New Card"\n• Select card type (virtual/physical)\n• Fill out request form\n• Submit request\n\nOur card services team will review and notify you once approved.',
      category: 'Cards',
    },
    {
      question: 'Can I freeze my virtual card?',
      answer: 'Card freeze feature:\n\n• Freeze/unfreeze anytime\n• Access through Cards section\n• Instant activation\n• No fees\n\nUseful for: Security concerns, temporary disablement, lost devices.',
      category: 'Cards',
    },
    {
      question: 'How do I apply for a loan?',
      answer: 'Loan application:\n\n• Navigate to Loans section\n• Click "New Application"\n• Provide loan details\n• Submit documentation\n\nOur loan processing team reviews within 3-5 business days.',
      category: 'Loans',
    },
    {
      question: 'What happens after I submit a loan application?',
      answer: 'Review process:\n\n• Our team reviews application\n• Additional documents may be requested\n• Decision within stated timeframe\n• Approval notification via email\n\nProcessing fee may be required before disbursement.',
      category: 'Loans',
    },
    {
      question: 'How do I create a support ticket?',
      answer: 'Ticket creation:\n\n• Click "New Ticket"\n• Enter subject\n• Select category\n• Choose priority level\n• Describe issue in detail\n\nOur support team responds promptly.',
      category: 'Support',
    },
    {
      question: 'How secure is my account?',
      answer: 'Security measures:\n\n• Encrypted connections\n• Secure password storage\n• Transaction monitoring\n• Regular security audits\n\nYour responsibility: Use strong passwords, never share credentials, contact support if suspicious activity.',
      category: 'Security',
    },
  ];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketForm.subject || !ticketForm.category || !ticketForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${backendUrl}/support/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: ticketForm.subject,
          category: ticketForm.category,
          priority: ticketForm.priority || 'MEDIUM',
          message: ticketForm.description,
        }),
      });

      if (response.ok) {
        toast.success('Support ticket created successfully!');
        setShowTicketForm(false);
        setTicketForm({ subject: '', category: '', priority: '', description: '' });
        fetchTickets(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create ticket');
      }
    } catch (error) {
      console.error('Failed to create support ticket:', error);
      toast.error('Failed to create ticket');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'CLOSED':
        return <CheckCircle2 className="w-4 h-4 text-gray-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'RESOLVED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'CLOSED':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const openChatDialog = async (ticket: SupportTicket) => {
    // Fetch latest ticket data to get all messages
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${backendUrl}/support/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const latestTickets = await response.json();
        const latestTicket = latestTickets.find((t: SupportTicket) => t.id === ticket.id);
        setSelectedTicket(latestTicket || ticket);
      } else {
        setSelectedTicket(ticket);
      }
    } catch (error) {
      console.error('Failed to fetch latest ticket:', error);
      setSelectedTicket(ticket);
    }
    
    setReplyMessage('');
    setShowChatDialog(true);
    
    // Join ticket room for real-time updates
    if (socket) {
      socket.emit('joinTicket', ticket.id);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      setSendingReply(true);
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${backendUrl}/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: replyMessage.trim() }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        toast.success('Message sent');
        setReplyMessage('');
        
        // Update selected ticket with new message immediately
        if (selectedTicket) {
          setSelectedTicket({
            ...selectedTicket,
            messages: [...(selectedTicket.messages || []), newMessage],
          });
        }
      } else {
        throw new Error('Failed to send reply');
      }
    } catch (error: any) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleStartLiveChat = async () => {
    try {
      setStartingChat(true);
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${backendUrl}/support/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: 'Live Chat - ' + new Date().toLocaleString(),
          category: 'Live Chat',
          priority: 'MEDIUM',
          message: 'Hello! I need help.',
        }),
      });

      if (response.ok) {
        const newTicket = await response.json();
        toast.success('Live chat started!');
        await fetchTickets(); // Refresh tickets list
        // Find and open the newly created ticket
        const ticket = tickets.find(t => t.id === newTicket.id) || newTicket;
        openChatDialog(ticket);
        setActiveTab('tickets'); // Switch to tickets tab
      } else {
        throw new Error('Failed to start chat');
      }
    } catch (error: any) {
      console.error('Failed to start live chat:', error);
      toast.error('Failed to start live chat');
    } finally {
      setStartingChat(false);
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Modern Header */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-1.5 h-10 rounded-full"
                style={{ background: branding.colors.primary }}
              />
              <h1 className="text-4xl font-bold" style={{ color: branding.colors.primary }}>
                Help & Support
              </h1>
            </div>
            <p className="text-gray-600 text-lg ml-5">Get help with your account and transactions</p>
          </motion.div>

          {/* Modern Tabs */}
          <motion.div variants={itemVariants}>
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border-2"
              style={{ borderColor: `${branding.colors.primary}10` }}
            >
              <nav className="flex gap-2">
                <button
                  onClick={() => setActiveTab('tickets')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300"
                  style={{
                    background: activeTab === 'tickets' 
                      ? `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                      : 'transparent',
                    color: activeTab === 'tickets' ? 'white' : '#6b7280',
                    boxShadow: activeTab === 'tickets' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                  }}
                >
                  <Ticket className="w-4 h-4" />
                  Support Tickets
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300"
                  style={{
                    background: activeTab === 'faq' 
                      ? `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                      : 'transparent',
                    color: activeTab === 'faq' ? 'white' : '#6b7280',
                    boxShadow: activeTab === 'faq' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                  }}
                >
                  <HelpCircle className="w-4 h-4" />
                  FAQ
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300"
                  style={{
                    background: activeTab === 'contact' 
                      ? `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                      : 'transparent',
                    color: activeTab === 'contact' ? 'white' : '#6b7280',
                    boxShadow: activeTab === 'contact' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Contact Us
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
            <AnimatePresence mode="wait">
              <motion.div
                key="tickets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {!showTicketForm && (
                  <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-1 h-6 rounded-full"
                            style={{ background: branding.colors.primary }}
                          />
                          <div>
                            <CardTitle className="text-xl">Your Support Tickets</CardTitle>
                            <CardDescription className="mt-1">Track and manage your support requests</CardDescription>
                          </div>
                        </div>
                        <Button
                          onClick={() => setShowTicketForm(true)}
                          className="text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                          style={{
                            background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                          }}
                        >
                          <Ticket className="w-4 h-4 mr-2" />
                          New Ticket
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {tickets.length === 0 ? (
                        <div className="text-center py-12">
                          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">No support tickets yet</p>
                          <Button onClick={() => setShowTicketForm(true)}>
                            Create Your First Ticket
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {tickets.map((ticket) => (
                            <motion.div
                              key={ticket.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-5 border-2 rounded-xl shadow-md hover:shadow-lg transition-all ${getStatusColor(ticket.status)}`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                      {ticket.priority}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">Category: {ticket.category}</p>
                                  <p className="text-sm text-gray-700 mb-2"><strong>Message:</strong> {ticket.message}</p>
                                  <p className="text-xs text-gray-500">
                                    Created: {new Date(ticket.createdAt).toLocaleString()} • 
                                    Last Update: {new Date(ticket.updatedAt).toLocaleString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(ticket.status)}
                                  <span className="text-xs font-medium">{ticket.status.replace('_', ' ')}</span>
                                </div>
                              </div>
                              <div className="mt-4">
                                <Button
                                  size="sm"
                                  onClick={() => openChatDialog(ticket)}
                                  className="text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                  style={{
                                    background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                                  }}
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  View Conversation ({ticket.messages?.length || 0} messages)
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {showTicketForm && (
                  <Card className="border-none shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-1 h-6 rounded-full"
                          style={{ background: branding.colors.primary }}
                        />
                        <div>
                          <CardTitle className="text-xl">Create Support Ticket</CardTitle>
                          <CardDescription className="mt-1">Describe your issue and we'll get back to you</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                      <form onSubmit={handleSubmitTicket} className="space-y-8">
                        {/* Subject Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-1 h-5 rounded-full"
                              style={{ background: branding.colors.primary }}
                            />
                            <h3 className="font-semibold text-base text-gray-800">Ticket Information</h3>
                          </div>
                          
                          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border shadow-sm space-y-4">
                            <div>
                              <Label htmlFor="subject" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <span>Subject</span>
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="subject"
                                placeholder="e.g., Unable to complete withdrawal"
                                value={ticketForm.subject}
                                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                                required
                                className="mt-2 h-11 border-gray-300 focus:border-transparent focus:ring-2 transition-all"
                                style={{ '--tw-ring-color': branding.colors.primary } as any}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="category" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <span>Category</span>
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={ticketForm.category}
                                  onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                                >
                                  <SelectTrigger className="mt-2 h-11 border-gray-300">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Account">💼 Account</SelectItem>
                                    <SelectItem value="Transactions">💸 Transactions</SelectItem>
                                    <SelectItem value="Cards">💳 Cards</SelectItem>
                                    <SelectItem value="Loans">🏦 Loans</SelectItem>
                                    <SelectItem value="Technical">⚙️ Technical Issue</SelectItem>
                                    <SelectItem value="Other">📋 Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</Label>
                                <Select
                                  value={ticketForm.priority}
                                  onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}
                                >
                                  <SelectTrigger className="mt-2 h-11 border-gray-300">
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="LOW">🟢 Low</SelectItem>
                                    <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                                    <SelectItem value="HIGH">🔴 High</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-1 h-5 rounded-full"
                              style={{ background: branding.colors.primary }}
                            />
                            <h3 className="font-semibold text-base text-gray-800">Issue Details</h3>
                          </div>
                          
                          <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border shadow-sm">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <span>Description</span>
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="description"
                              placeholder="Please provide detailed information about your issue. Include any relevant transaction IDs, error messages, or steps to reproduce the problem."
                              rows={7}
                              value={ticketForm.description}
                              onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                              required
                              className="mt-2 border-gray-300 focus:border-transparent focus:ring-2 transition-all resize-none"
                              style={{ '--tw-ring-color': branding.colors.primary } as any}
                            />
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                              The more details you provide, the faster we can help you
                            </p>
                          </div>
                        </div>

                        {/* Info Banner */}
                        <div 
                          className="p-4 rounded-xl border-2 flex items-start gap-3"
                          style={{
                            background: `linear-gradient(135deg, ${branding.colors.primary}08 0%, ${branding.colors.secondary}08 100%)`,
                            borderColor: `${branding.colors.primary}25`
                          }}
                        >
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: `${branding.colors.primary}15` }}
                          >
                            <HelpCircle className="w-5 h-5" style={{ color: branding.colors.primary }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 mb-1">Response Time</p>
                            <p className="text-xs text-gray-600">Our support team typically responds within 2-4 hours during business hours. High priority tickets are handled first.</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                          <Button 
                            type="submit" 
                            className="flex-1 h-12 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-base"
                            style={{
                              background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                            }}
                          >
                            <Send className="w-5 h-5 mr-2" />
                            Submit Ticket
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowTicketForm(false)}
                            className="h-12 px-8 border-2 border-gray-300 hover:bg-gray-50 font-medium"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <AnimatePresence mode="wait">
              <motion.div
                key="faq"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to common questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input
                          placeholder="Search FAQs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {filteredFAQs.map((faq, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
                          >
                            <div className="flex items-start gap-3 text-left">
                              <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium">{faq.question}</p>
                                <p className="text-xs text-gray-500 mt-1">{faq.category}</p>
                              </div>
                            </div>
                            {expandedFAQ === index ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          <AnimatePresence>
                            {expandedFAQ === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pt-0 pl-12 text-gray-600 text-sm whitespace-pre-line">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>

                    {filteredFAQs.length === 0 && (
                      <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No FAQs match your search</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <AnimatePresence mode="wait">
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Hero Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                  }}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                      <MessageCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">We're Here to Help</h2>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                      Have questions? Our support team is ready to assist you through multiple channels
                    </p>
                  </div>
                </motion.div>

                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Email Support */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
                      <div 
                        className="absolute top-0 left-0 w-full h-1"
                        style={{ background: branding.colors.primary }}
                      />
                      <CardContent className="pt-8 pb-6 text-center">
                        <div 
                          className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform"
                          style={{
                            background: `linear-gradient(135deg, ${branding.colors.primary}15 0%, ${branding.colors.secondary}15 100%)`
                          }}
                        >
                          <Mail className="w-8 h-8" style={{ color: branding.colors.primary }} />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-gray-900">Email Support</h3>
                        <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                          Get detailed assistance via email. We respond within 24 hours.
                        </p>
                        <a 
                          href={`mailto:${settings.general.supportEmail}`} 
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                          style={{
                            background: `${branding.colors.primary}10`,
                            color: branding.colors.primary
                          }}
                        >
                          <Mail className="w-4 h-4" />
                          {settings.general.supportEmail}
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Phone Support */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
                      <div 
                        className="absolute top-0 left-0 w-full h-1"
                        style={{ background: branding.colors.secondary }}
                      />
                      <CardContent className="pt-8 pb-6 text-center">
                        <div 
                          className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform"
                          style={{
                            background: `linear-gradient(135deg, ${branding.colors.secondary}15 0%, ${branding.colors.primary}15 100%)`
                          }}
                        >
                          <Phone className="w-8 h-8" style={{ color: branding.colors.secondary }} />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-gray-900">Phone Support</h3>
                        <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                          Speak with our team directly. Available Mon-Fri, 9AM-6PM.
                        </p>
                        <a 
                          href={`tel:${settings.general.supportPhone}`} 
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                          style={{
                            background: `${branding.colors.secondary}10`,
                            color: branding.colors.secondary
                          }}
                        >
                          <Phone className="w-4 h-4" />
                          {settings.general.supportPhone}
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Live Chat */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
                      <div 
                        className="absolute top-0 left-0 w-full h-1"
                        style={{
                          background: `linear-gradient(90deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                        }}
                      />
                      <CardContent className="pt-8 pb-6 text-center">
                        <div 
                          className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform"
                          style={{
                            background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                          }}
                        >
                          <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-gray-900">Live Chat</h3>
                        <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                          Get instant help through our real-time chat support.
                        </p>
                        <Button 
                          onClick={handleStartLiveChat}
                          disabled={startingChat}
                          className="w-full text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                          style={{
                            background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                          }}
                        >
                          {startingChat ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Start Chat Now
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Additional Info Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="border-none shadow-lg bg-gradient-to-br from-gray-50 to-white">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5" style={{ color: branding.colors.primary }} />
                            Support Hours
                          </h4>
                          <p className="text-gray-600 mb-2"><strong>Live Chat:</strong> 24/7 Available</p>
                          <p className="text-gray-600 mb-2"><strong>Phone:</strong> Mon-Fri, 9AM-6PM EST</p>
                          <p className="text-gray-600"><strong>Email:</strong> 24-hour response time</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" style={{ color: branding.colors.primary }} />
                            Need Help?
                          </h4>
                          <p className="text-gray-600 mb-3">
                            Before contacting support, check our FAQ section for quick answers to common questions.
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveTab('faq')}
                            className="border-2 font-semibold hover:scale-105 transition-all"
                            style={{
                              borderColor: branding.colors.primary,
                              color: branding.colors.primary
                            }}
                          >
                            View FAQ
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Chat Dialog */}
      {showChatDialog && selectedTicket && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div 
              className="p-6 text-white relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
              }}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Bank Logo */}
                  {branding.logo ? (
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm p-2 flex items-center justify-center shadow-lg">
                      <img 
                        src={branding.logo} 
                        alt="Bank Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-xl">{selectedTicket.subject}</h3>
                    <p className="text-sm text-white/80 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{selectedTicket.category}</span>
                      <span>•</span>
                      <span>Support Chat</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatDialog(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {/* Original Message */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                  style={{ background: branding.colors.primary }}
                >
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-md border-2" style={{ borderColor: `${branding.colors.primary}20` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm" style={{ color: branding.colors.primary }}>You</span>
                      <span className="text-xs text-gray-400">
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedTicket.message}</p>
                  </div>
                </div>
              </motion.div>

              {/* Additional Messages */}
              {selectedTicket.messages?.map((msg, index) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-3 ${msg.senderType === 'USER' ? '' : 'flex-row-reverse'}`}
                >
                  {msg.senderType === 'USER' ? (
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                      style={{ background: branding.colors.primary }}
                    >
                      {user?.firstName?.charAt(0) || 'U'}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md border-2" style={{ borderColor: branding.colors.secondary }}>
                      {branding.logo ? (
                        <img src={branding.logo} alt="Support" className="w-6 h-6 object-contain" />
                      ) : (
                        <MessageCircle className="w-5 h-5" style={{ color: branding.colors.secondary }} />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <div 
                      className={`rounded-2xl p-4 shadow-md ${
                        msg.senderType === 'USER' 
                          ? 'rounded-tl-sm bg-white border-2' 
                          : 'rounded-tr-sm border-2'
                      }`}
                      style={{
                        borderColor: msg.senderType === 'USER' ? `${branding.colors.primary}20` : `${branding.colors.secondary}20`,
                        background: msg.senderType === 'USER' ? 'white' : `${branding.colors.secondary}08`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="font-bold text-sm"
                          style={{ color: msg.senderType === 'USER' ? branding.colors.primary : branding.colors.secondary }}
                        >
                          {msg.senderType === 'USER' ? 'You' : 'Support Team'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reply Input */}
            {selectedTicket.status !== 'CLOSED' && (
              <div className="p-6 border-t bg-white">
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="Type your message here..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={3}
                      className="resize-none border-2 rounded-xl focus:ring-2 pr-12 transition-all"
                      style={{
                        borderColor: `${branding.colors.primary}30`,
                        '--tw-ring-color': branding.colors.primary
                      } as any}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyMessage.trim()}
                      className="flex-1 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)`
                      }}
                    >
                      {sendingReply ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowChatDialog(false)}
                      className="border-2 font-semibold hover:scale-[1.02] transition-all"
                      style={{
                        borderColor: branding.colors.primary,
                        color: branding.colors.primary
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {selectedTicket.status === 'CLOSED' && (
              <div className="p-6 border-t bg-gradient-to-br from-green-50 to-emerald-50 text-center">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-white border-2 border-green-200 rounded-2xl shadow-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-green-900">
                      Ticket Closed
                    </p>
                    <p className="text-xs text-green-700">
                      This conversation has ended. Create a new ticket if you need further assistance.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

