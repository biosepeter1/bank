'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Headset } from 'lucide-react';
import { useBranding } from '@/contexts/BrandingContext';
import { useSettings } from '@/contexts/SettingsContext';
import apiClient from '@/lib/api/client';
import { io, Socket } from 'socket.io-client';

type Message = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
};

type ChatMode = 'AI' | 'LIVE';

export default function ChatbotWidget() {
    const { branding } = useBranding();
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const [mode, setMode] = useState<ChatMode>('AI');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const siteName = settings?.general?.siteName || branding?.name || 'Our Bank';
    const supportPhone = settings?.general?.supportPhone || '+234 800 900 7777';
    const supportEmail = settings?.general?.supportEmail || 'support@bank.com';

    // Initialize with welcome message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: '1',
                role: 'assistant',
                content: `Hi there! 👋 I'm your ${siteName} assistant. How can I help you today?`,
                timestamp: new Date(),
            }]);
        }
    }, [siteName]);

    // Cleanup socket on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    // Hide pulse after first open
    useEffect(() => {
        if (isOpen) setShowPulse(false);
    }, [isOpen]);

    const startLiveChat = () => {
        setIsLoading(true);
        // Clean existing socket if any
        if (socket) socket.disconnect();

        const newSocket = io('http://localhost:3001/live-chat');

        newSocket.on('connect', () => {
            console.log('Connected to live chat');
            newSocket.emit('startChat', {
                userIp: 'guest', // In real app, get from API or context
                name: 'Guest User', // Could ask user for name first
            });
        });

        newSocket.on('chatStarted', (session) => {
            setSessionId(session.id);
            setIsLoading(false);
            setMode('LIVE');
            setMessages(prev => [...prev, {
                id: `system-queue-${Date.now()}`,
                role: 'system',
                content: 'You are now connected to the Live Support queue. An agent will be with you shortly.',
                timestamp: new Date(),
            }]);
        });

        newSocket.on('adminJoined', (data) => {
            setMessages(prev => [...prev, {
                id: `system-${Date.now()}`,
                role: 'system',
                content: 'A support agent has joined the chat.',
                timestamp: new Date(),
            }]);
        });

        newSocket.on('newMessage', (msg) => {
            // Only add if it's not our own message (we add optimistically)
            // Or if we don't add optimistically, we add everything.
            // Let's add everything from server for simplicity, unless we want optimistic UI
            if (msg.sender === 'USER') return; // we added user message manually

            setMessages(prev => [...prev, {
                id: msg.id,
                role: msg.sender === 'ADMIN' ? 'assistant' : 'system',
                content: msg.message,
                timestamp: new Date(msg.createdAt),
            }]);
        });

        newSocket.on('sessionEnded', () => {
            setMessages(prev => [...prev, {
                id: `system-end-${Date.now()}`,
                role: 'system',
                content: 'The chat session has ended. You can continue with our AI assistant or start a new live chat.',
                timestamp: new Date(),
            }]);
            // Reset to AI mode
            setMode('AI');
            setSessionId(null);
            newSocket.disconnect();
            setSocket(null);
        });

        setSocket(newSocket);
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const currentInput = input.trim();
        setInput('');

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: currentInput,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);

        if (mode === 'LIVE' && socket && sessionId) {
            socket.emit('sendMessage', {
                sessionId,
                message: currentInput,
                sender: 'USER',
            });
        } else {
            // AI Mode
            setIsLoading(true);
            try {
                // Prepare conversation history for backend
                const history = messages.filter(m => m.role !== 'system').map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }));

                const response = await apiClient.post('/chat/ai', {
                    message: currentInput,
                    history,
                    siteName,
                    supportPhone,
                    supportEmail,
                });

                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response.data.response || 'I apologize, but I couldn\'t process your request.',
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, assistantMessage]);
            } catch (error) {
                console.error('Chatbot error:', error);
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'I\'m having trouble connecting right now.',
                    timestamp: new Date(),
                }]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white group"
                        style={{ background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` }}
                    >
                        <MessageCircle className="w-6 h-6" />
                        {showPulse && (
                            <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: branding.colors.primary }} />
                        )}
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Chat with us
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div
                            className="p-4 text-white relative overflow-hidden flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` }}
                        >
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            {mode === 'LIVE' ? (
                                                <Headset className="w-5 h-5 text-white" />
                                            ) : branding.logo ? (
                                                <img src={branding.logo} alt="" className="w-6 h-6 object-contain" />
                                            ) : (
                                                <Bot className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base">{mode === 'LIVE' ? 'Live Support' : `${siteName} Assistant`}</h3>
                                            <div className="flex items-center gap-1.5 text-xs text-white/80">
                                                <span className={`w-2 h-2 rounded-full animate-pulse ${mode === 'LIVE' ? 'bg-green-400' : 'bg-blue-300'}`}></span>
                                                {mode === 'LIVE' ? 'Connected to Agent' : 'AI Powered'}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                {/* Mode Toggle */}
                                {mode === 'AI' && (
                                    <button
                                        onClick={startLiveChat}
                                        className="w-full mt-2 py-1.5 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors border border-white/10"
                                    >
                                        <Headset className="w-3.5 h-3.5" />
                                        Speak with a human agent
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''} ${message.role === 'system' ? 'justify-center !mb-2' : ''}`}
                                >
                                    {message.role === 'system' ? (
                                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full tracking-wider">
                                            {message.content}
                                        </span>
                                    ) : (
                                        <>
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                                    ? 'bg-slate-200 text-slate-600'
                                                    : ''
                                                    }`}
                                                style={message.role === 'assistant' ? { background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` } : {}}
                                            >
                                                {message.role === 'user' ? (
                                                    <User className="w-4 h-4" />
                                                ) : mode === 'LIVE' ? (
                                                    <Headset className="w-4 h-4 text-white" />
                                                ) : (
                                                    <Sparkles className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <div
                                                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${message.role === 'user'
                                                    ? 'bg-slate-800 text-white rounded-br-md'
                                                    : 'bg-white shadow-md border border-slate-100 rounded-bl-md text-slate-700'
                                                    }`}
                                            >
                                                {message.content}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2"
                                >
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` }}
                                    >
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white shadow-md border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions (AI Only) */}
                        {mode === 'AI' && (
                            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                    <button
                                        onClick={() => setInput('How do I open an account?')}
                                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 transition-colors whitespace-nowrap"
                                    >
                                        Open account
                                    </button>
                                    <button
                                        onClick={() => setInput('What are your loan options?')}
                                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 transition-colors whitespace-nowrap"
                                    >
                                        Loans
                                    </button>
                                    <button
                                        onClick={startLiveChat}
                                        className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 transition-colors whitespace-nowrap"
                                    >
                                        Live support
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-100 bg-white">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={mode === 'LIVE' ? "Type a message to support..." : "Type a message..."}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all disabled:opacity-50"
                                    style={{ '--tw-ring-color': branding.colors.primary } as any}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="w-10 h-10 rounded-xl text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                                    style={{ background: `linear-gradient(135deg, ${branding.colors.primary} 0%, ${branding.colors.secondary} 100%)` }}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 text-center mt-2">
                                {mode === 'LIVE' ? 'Chats may be recorded for quality assurance.' : <span>Powered by AI • <a href="/contact" className="hover:underline" style={{ color: branding.colors.primary }}>Contact Support</a></span>}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

