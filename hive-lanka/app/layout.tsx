import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import AIChatBot from '@/components/AIChatBot';
import { LanguageProvider } from '@/lib/LanguageContext';

const inter = Inter({ subsets:  ['latin'] });

export const metadata: Metadata = {
  title: 'Hive Lanka - Empowering Sri Lankan Artisans',
  description: 'Connect with authentic Sri Lankan handicrafts and support local artisans',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <LanguageProvider>
            <Header />
            {children}
            <Footer />
            <AIChatBot />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}