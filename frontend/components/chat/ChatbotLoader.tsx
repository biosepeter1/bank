'use client';

import dynamic from 'next/dynamic';

// Dynamically import ChatbotWidget to avoid SSR issues
const ChatbotWidget = dynamic(() => import('@/components/chat/ChatbotWidget'), {
    ssr: false,
});

export default function ChatbotLoader() {
    return <ChatbotWidget />;
}
