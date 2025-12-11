'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle2,
  User,
  Calendar,
  Tag,
  Flag,
  Mail,
  Trash2,
  MessageSquare,
  Send,
  X,
  Headset,
  Wifi,
  WifiOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/stores/authStore';
import { useSocket } from '@/hooks/useSocket';
import { useBranding } from '@/contexts/BrandingContext';
import { io, Socket } from 'socket.io-client';

type TicketMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'USER' | 'ADMIN';
  message: string;
  createdAt: string;
  ticketId?: string; // Added for socket message handling
};

type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  resolution?: string;
  assignedTo?: string;
  messages?: TicketMessage[];
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

type ChatSession = {
  id: string;
  userId?: string;
  userIp?: string;
  status: 'QUEUED' | 'ACTIVE' | 'ENDED';
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  messages: {
    id: string;
    sender: 'USER' | 'ADMIN' | 'SYSTEM';
    message: string;
    createdAt: string;
  }[];
  admin?: {
    firstName: string;
    lastName: string;
  };
  updatedAt: string;
};

export default function AdminSupportPage() {
  const { branding } = useBranding();
  // We keep the old user socket for notifications, but we'll use a new one for Live Chat admin namespace if needed
  // However, simpler to reuse or create a specific one for live chat
  const { user } = useAuthStore();
  const { socket: notificationSocket } = useSocket(user?.id, user?.role);

  // --- Ticket State ---
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false); // This will be removed or repurposed
  const [updateForm, setUpdateForm] = useState({ status: '', resolution: '' });
  const [replyMessage, setReplyMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [showEmailReplyDialog, setShowEmailReplyDialog] = useState(false);
  const [emailReplyForm, setEmailReplyForm] = useState({ subject: '', message: '' });
  const [sendingEmailReply, setSendingEmailReply] = useState(false);

  // --- Live Chat State ---
  const [activeTab, setActiveTab] = useState('tickets');
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [liveSessions, setLiveSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Helper Functions (Keep existing ones) ---
  const parseGuestInfo = (message: string): { name: string; email: string; cleanMessage: string } | null => {
    const guestMatch = message.match(/\[GUEST CONTACT\]\s*Name:\s*(.+?)\s*Email:\s*(.+?)\s*---\s*([\s\S]*)/i);
    if (guestMatch) {
      return {
        name: guestMatch[1].trim(),
        email: guestMatch[2].trim(),
        cleanMessage: guestMatch[3].trim(),
      };
    }
    return null;
  };
  const isGuestTicket = (ticket: SupportTicket) => ticket.user.email === 'guest@contact.system';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'RESOLVED': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'CLOSED': return <CheckCircle2 className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'RESOLVED': return 'bg-green-50 text-green-700 border-green-200';
      case 'CLOSED': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-700 bg-red-100 border-red-300';
      case 'HIGH': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'LOW': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  // --- Initialize ---
  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  // Listen for real-time messages for tickets
  useEffect(() => {
    if (!notificationSocket) return;

    notificationSocket.on('newMessage', (message: TicketMessage) => {
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

      // Show notification if message is from user
      if (message.senderType === 'USER') {
        toast.success('New message from user');
      }
    });

    return () => {
      notificationSocket.off('newMessage');
    };
  }, [notificationSocket, selectedTicket]);

  // --- Live Chat Logic ---
  useEffect(() => {
    // Only connect if on live-chat tab and socket not already connected
    if (activeTab === 'live-chat' && !chatSocket) {
      // Connect to the 'live-chat' namespace
      const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const newSocket = io(`${socketUrl}/live-chat`, {
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Admin connected to Live Chat');
        newSocket.emit('joinAdminRoom');
      });

      newSocket.on('disconnect', () => {
        console.log('Admin disconnected from Live Chat');
        toast.error('Live Chat disconnected. Please refresh.');
      });

      newSocket.on('newChatSession', (session: ChatSession) => {
        toast.success('New Live Chat Request!');
        setLiveSessions(prev => [session, ...prev]);
      });

      // Listen for new messages in chat sessions
      newSocket.on('newMessage', (msg) => {
        // Update the sessions list
        setLiveSessions(prev => prev.map(s => {
          if (s.id === msg.sessionId) {
            return { ...s, messages: [...s.messages, msg], updatedAt: new Date().toISOString() };
          }
          return s;
        }));

        // Also update selectedSession if this message belongs to it
        setSelectedSession(prev => {
          if (prev && prev.id === msg.sessionId) {
            return { ...prev, messages: [...prev.messages, msg] };
          }
          return prev;
        });

        // Scroll to bottom or show notification
        if (selectedSession && selectedSession.id === msg.sessionId) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else if (msg.sender !== 'ADMIN') {
          toast(`New message in session ${msg.sessionId.slice(0, 8)}`);
        }
      });

      newSocket.on('sessionEnded', (sessionId: string) => {
        toast(`Chat session ${sessionId.slice(0, 8)} ended.`);
        setLiveSessions(prev => prev.filter(s => s.id !== sessionId));
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
        }
      });

      setChatSocket(newSocket);
      fetchSessions();

      return () => {
        newSocket.disconnect();
        setChatSocket(null);
      };
    } else if (activeTab !== 'live-chat' && chatSocket) {
      // Disconnect if switching away from live chat
      chatSocket.disconnect();
      setChatSocket(null);
    }
  }, [activeTab, user]); // Depend on activeTab and user to re-initialize socket

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSession?.messages]);

  const fetchSessions = async () => {
    try {
      const res = await apiClient.get('/live-chat/admin/sessions');
      setLiveSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch live chat sessions:', err);
      toast.error('Failed to load live chat sessions');
    }
  };

  const acceptChat = (session: ChatSession) => {
    if (!chatSocket || !user) return;

    chatSocket.emit('adminJoinSession', { sessionId: session.id, adminId: user.id });

    // Update local state immediately for UI responsiveness
    const updatedSession = { ...session, status: 'ACTIVE' as const, admin: { firstName: user.firstName, lastName: user.lastName } };
    setLiveSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    setSelectedSession(updatedSession);
    toast.success(`Joined chat session with ${session.user?.firstName || 'Guest'}`);
  };

  const endChat = (session: ChatSession) => {
    if (!chatSocket || !user) return;
    if (!confirm('Are you sure you want to end this chat session?')) return;

    chatSocket.emit('adminEndSession', { sessionId: session.id, adminId: user.id });
    toast.success('Chat session ended.');
    setLiveSessions(prev => prev.filter(s => s.id !== session.id));
    if (selectedSession?.id === session.id) {
      setSelectedSession(null);
    }
  };

  const sendChatMessage = () => {
    if (!chatSocket || !selectedSession || !chatInput.trim()) return;

    chatSocket.emit('sendMessage', {
      sessionId: selectedSession.id,
      message: chatInput,
      sender: 'ADMIN'
    });
    setChatInput('');
  };

  // --- Action Handlers (Tickets) ---
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/support/admin/tickets', {
        params: filterStatus ? { status: filterStatus } : {},
      });
      setTickets(response.data);
    } catch (error: any) {
      console.error('Failed to fetch tickets:', error);
      toast.error(error?.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    try {
      setUpdating(true);
      await apiClient.patch(`/support/admin/tickets/${selectedTicket.id}`, {
        status: updateForm.status || selectedTicket.status,
        resolution: updateForm.resolution || undefined,
      });
      toast.success('Ticket updated successfully');
      setShowUpdateDialog(false);
      setSelectedTicket(null);
      setUpdateForm({ status: '', resolution: '' });
      fetchTickets();
    } catch (error: any) {
      console.error('Failed to update ticket:', error);
      toast.error(error?.response?.data?.message || 'Failed to update ticket');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await apiClient.delete(`/support/admin/tickets/${ticketId}`);
      toast.success('Ticket deleted successfully');
      fetchTickets();
    } catch (error: any) {
      console.error('Failed to delete ticket:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete ticket');
    }
  };

  const openUpdateDialog = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setUpdateForm({
      status: ticket.status,
      resolution: ticket.resolution || '',
    });
    setShowUpdateDialog(true);
  };

  const openChatDialog = async (ticket: SupportTicket) => {
    // This function is now repurposed to just view the ticket details,
    // as the real-time chat is handled by the Live Chat tab.
    // If we wanted to integrate ticket chat into the new live chat UI,
    // this would need more complex logic. For now, it just shows the ticket.
    try {
      const response = await apiClient.get(`/support/admin/tickets/${ticket.id}`);
      setSelectedTicket(response.data);
    } catch (error) {
      console.error('Failed to fetch latest ticket:', error);
      setSelectedTicket(ticket);
    }
    setShowChatDialog(true); // This dialog is now just a detailed ticket view
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      setSendingReply(true);
      const response = await apiClient.post(`/support/admin/tickets/${selectedTicket.id}/reply`, {
        message: replyMessage.trim(),
      });
      const newMessage = response.data;
      toast.success('Message sent');
      setReplyMessage('');

      // Update selected ticket with new message immediately
      if (selectedTicket) {
        setSelectedTicket({
          ...selectedTicket,
          messages: [...(selectedTicket.messages || []), newMessage],
        });
      }
    } catch (error: any) {
      console.error('Failed to send reply:', error);
      toast.error(error?.response?.data?.message || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const openEmailReplyDialog = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    const guestInfo = parseGuestInfo(ticket.message);
    setEmailReplyForm({
      subject: `Re: ${ticket.subject}`,
      message: '',
    });
    setShowEmailReplyDialog(true);
  };

  const handleSendEmailReply = async () => {
    if (!selectedTicket || !emailReplyForm.message.trim()) return;

    const guestInfo = parseGuestInfo(selectedTicket.message);
    if (!guestInfo) {
      toast.error('Could not find guest email address');
      return;
    }

    try {
      setSendingEmailReply(true);
      await apiClient.post(`/support/admin/tickets/${selectedTicket.id}/email-reply`, {
        guestEmail: guestInfo.email,
        guestName: guestInfo.name,
        subject: emailReplyForm.subject,
        message: emailReplyForm.message,
      });
      toast.success(`Email sent successfully to ${guestInfo.email}`);
      setShowEmailReplyDialog(false);
      setEmailReplyForm({ subject: '', message: '' });
      fetchTickets(); // Refresh to show the new message record
    } catch (error: any) {
      console.error('Failed to send email:', error);
      toast.error(error?.response?.data?.message || 'Failed to send email');
    } finally {
      setSendingEmailReply(false);
    }
  };


  return (
    <div className="p-6 space-y-6 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-gray-600 mt-1">Manage tickets and live support</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b px-1">
          <TabsList className="bg-transparent border-b-0 -mb-px">
            <TabsTrigger value="tickets" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6">
              <Ticket className="w-4 h-4 mr-2" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="live-chat" className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none px-6">
              <Headset className="w-4 h-4 mr-2" />
              Live Chat
              {liveSessions.filter(s => s.status === 'QUEUED').length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                  {liveSessions.filter(s => s.status === 'QUEUED').length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tickets" className="flex-1 overflow-y-auto pt-4">
          {/* Existing Ticket UI Wrapper */}
          <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Ticket Queue</h2>
              {/* Stats Filters etc */}
              <Select value={filterStatus || 'all'} onValueChange={(value) => setFilterStatus(value === 'all' ? '' : value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Open</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {tickets.filter((t) => t.status === 'OPEN').length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {tickets.filter((t) => t.status === 'IN_PROGRESS').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {tickets.filter((t) => t.status === 'RESOLVED').length}
                      </p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {tickets.length}
                      </p>
                    </div>
                    <Ticket className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tickets List */}
            <Card>
              <CardHeader>
                <CardTitle>All Support Tickets</CardTitle>
                <CardDescription>View and manage user support requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-12 text-center text-gray-600">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="py-12 text-center">
                    <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No support tickets found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => {
                      const guestInfo = isGuestTicket(ticket) ? parseGuestInfo(ticket.message) : null;

                      return (
                        <div
                          key={ticket.id}
                          className={`p-4 border-2 rounded-lg ${getStatusColor(ticket.status)}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}
                                >
                                  {ticket.priority}
                                </span>
                                {guestInfo && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300">
                                    GUEST
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  <span>
                                    {guestInfo ? guestInfo.name : `${ticket.user.firstName} ${ticket.user.lastName}`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {guestInfo ? (
                                    <span className="text-purple-700 font-medium">{guestInfo.email}</span>
                                  ) : (
                                    <span>{ticket.user.email}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Tag className="w-4 h-4" />
                                  <span>{ticket.category}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">
                                <strong>Message:</strong> {guestInfo ? guestInfo.cleanMessage : ticket.message}
                              </p>
                              {ticket.resolution && (
                                <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                                  <strong>Resolution:</strong> {ticket.resolution}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                Created: {new Date(ticket.createdAt).toLocaleString()} • Updated:{' '}
                                {new Date(ticket.updatedAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {getStatusIcon(ticket.status)}
                              <span className="text-xs font-medium">
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {guestInfo && (
                              <Button
                                size="sm"
                                onClick={() => openEmailReplyDialog(ticket)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <Mail className="w-4 h-4 mr-1" />
                                Reply via Email
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => openChatDialog(ticket)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              View Chat ({ticket.messages?.length || 0})
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openUpdateDialog(ticket)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Update Status
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteTicket(ticket.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="live-chat" className="flex-1 flex overflow-hidden pt-4 gap-4 h-full">
          {/* Sidebar: Sessions List */}
          <Card className="w-80 flex flex-col h-full border-r rounded-r-none">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-lg">Live Sessions</CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-y-auto">
              {liveSessions.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No active sessions</div>
              ) : (
                liveSessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(session => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${selectedSession?.id === session.id ? 'bg-slate-100 border-l-4 border-l-blue-500' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${session.status === 'QUEUED' ? 'bg-yellow-100 text-yellow-700' :
                        session.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                        {session.status}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm truncate">
                      {session.user ? `${session.user.firstName} ${session.user.lastName}` : `Guest (${session.userIp})`}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {session.messages[session.messages.length - 1]?.message || 'No messages yet'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Main: Chat Area */}
          <Card className="flex-1 flex flex-col h-full rounded-l-none border-l-0 shadow-none">
            {selectedSession ? (
              <>
                <CardHeader className="p-4 border-b flex flex-row items-center justify-between bg-slate-50/50">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {selectedSession.user ? `${selectedSession.user.firstName} ${selectedSession.user.lastName}` : `Guest (${selectedSession.userIp})`}
                      {selectedSession.status === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                    </CardTitle>
                    <CardDescription>
                      ID: {selectedSession.id.slice(0, 8)} • {selectedSession.status}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {selectedSession.status === 'QUEUED' && (
                      <Button onClick={() => acceptChat(selectedSession)} className="bg-green-600 hover:bg-green-700 text-white">
                        Accept Chat
                      </Button>
                    )}
                    {selectedSession.status === 'ACTIVE' && (
                      <Button onClick={() => endChat(selectedSession)} variant="destructive">
                        End Chat
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                  {selectedSession.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-xl px-4 py-2 text-sm shadow-sm ${msg.sender === 'ADMIN'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : msg.sender === 'SYSTEM'
                          ? 'bg-gray-200 text-gray-600 text-xs italic text-center w-full bg-transparent shadow-none'
                          : 'bg-white border rounded-bl-none'
                        }`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t bg-white">
                  <form
                    onSubmit={(e) => { e.preventDefault(); sendChatMessage(); }}
                    className="flex gap-2"
                  >
                    <Input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      disabled={selectedSession.status !== 'ACTIVE'}
                    />
                    <Button type="submit" disabled={selectedSession.status !== 'ACTIVE' || !chatInput.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Headset className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a session to start chatting</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Support Ticket</DialogTitle>
            <DialogDescription>
              Update the status and add resolution notes for this ticket
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Ticket:</strong> {selectedTicket.subject}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>User:</strong> {selectedTicket.user.firstName}{' '}
                  {selectedTicket.user.lastName} ({selectedTicket.user.email})
                </p>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={updateForm.status}
                  onValueChange={(value) =>
                    setUpdateForm({ ...updateForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="resolution">Resolution Notes (Optional)</Label>
                <Textarea
                  id="resolution"
                  placeholder="Add resolution notes..."
                  rows={4}
                  value={updateForm.resolution}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, resolution: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateTicket} disabled={updating}>
              {updating ? 'Updating...' : 'Update Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog (now a detailed ticket view) */}
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
                      <MessageSquare className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-xl">{selectedTicket.subject}</h3>
                    <p className="text-sm text-white/80 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedTicket.user.firstName} {selectedTicket.user.lastName}
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{selectedTicket.category}</span>
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
                  {selectedTicket.user.firstName.charAt(0)}{selectedTicket.user.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-md border-2" style={{ borderColor: `${branding.colors.primary}20` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm" style={{ color: branding.colors.primary }}>
                        {selectedTicket.user.firstName} {selectedTicket.user.lastName}
                      </span>
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
                  className={`flex gap-3 ${msg.senderType === 'ADMIN' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.senderType === 'USER' ? (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                      style={{ background: branding.colors.primary }}
                    >
                      {selectedTicket.user.firstName.charAt(0)}{selectedTicket.user.lastName.charAt(0)}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md border-2" style={{ borderColor: branding.colors.secondary }}>
                      {branding.logo ? (
                        <img src={branding.logo} alt="Admin" className="w-6 h-6 object-contain" />
                      ) : (
                        <MessageSquare className="w-5 h-5" style={{ color: branding.colors.secondary }} />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <div
                      className={`rounded-2xl p-4 shadow-md ${msg.senderType === 'USER'
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
                          {msg.senderType === 'USER' ? `${selectedTicket.user.firstName} ${selectedTicket.user.lastName}` : 'Support Team (You)'}
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
            <div className="p-6 border-t bg-white">
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Type your response to the user..."
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
                        Send Response
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
          </motion.div>
        </motion.div>
      )}

      {/* Email Reply Dialog for Guest Contacts */}
      <Dialog open={showEmailReplyDialog} onOpenChange={setShowEmailReplyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Reply via Email
            </DialogTitle>
            <DialogDescription>
              Send an email response to the guest contact
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (() => {
            const guestInfo = parseGuestInfo(selectedTicket.message);
            return guestInfo ? (
              <div className="space-y-4">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <p className="text-sm">
                    <strong>To:</strong> {guestInfo.name} ({guestInfo.email})
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Reference:</strong> #{selectedTicket.id.substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={emailReplyForm.subject}
                    onChange={(e) =>
                      setEmailReplyForm({ ...emailReplyForm, subject: e.target.value })
                    }
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="email-message">Message</Label>
                  <Textarea
                    id="email-message"
                    value={emailReplyForm.message}
                    onChange={(e) =>
                      setEmailReplyForm({ ...emailReplyForm, message: e.target.value })
                    }
                    placeholder="Type your response here..."
                    rows={6}
                  />
                </div>
              </div>
            ) : null;
          })()}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEmailReplyDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmailReply}
              disabled={sendingEmailReply || !emailReplyForm.message.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {sendingEmailReply ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

