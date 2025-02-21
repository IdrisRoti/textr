import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// import Head from "next/head"
import "./globals.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Textr AI Powered text processor",
  description: "Textr - AI Powered text processor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta 
          httpEquiv="origin-trial" 
          content={process.env.TRANSLATOR_API_TOKEN}
        />
        <meta 
          httpEquiv="origin-trial" 
          content={process.env.LANGUAGE_DETECTOR_API_TOKEN}
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
