import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, DM_Serif_Display, Space_Mono } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import ChatbotLoader from "@/components/chat/ChatbotLoader";
import { DynamicMeta } from "@/components/DynamicMeta";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banking Platform",
  description: "Secure and modern corporate banking solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${dmSerifDisplay.variable} ${spaceMono.variable} antialiased`}
      >
        <SettingsProvider>
          <BrandingProvider>
            <DynamicMeta />
            {children}
            <ChatbotLoader />
            <Toaster position="top-right" />
            <ToastContainer position="top-right" autoClose={3000} />
          </BrandingProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}

