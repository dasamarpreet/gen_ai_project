import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LayoutWithSidebar from "@/components/LayoutWithSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptAce APDas",
  description: "This is an ai chatbot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Header />
          <ToastContainer position="bottom-right" autoClose={3000} />
            <LayoutWithSidebar>
              {children}
            </LayoutWithSidebar>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
