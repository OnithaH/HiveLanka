import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

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
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}