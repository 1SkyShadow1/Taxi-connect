import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SA Taxi Connect",
  description: "Real-time South African taxi booking & driver platform",
  manifest: '/manifest.webmanifest',
  themeColor: '#f97316',
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png'
  },
  openGraph: {
    title: 'SA Taxi Connect',
    description: 'Real-time South African taxi booking & driver platform',
    images: ['/Logo.png']
  },
  twitter: {
    card: 'summary',
    title: 'SA Taxi Connect',
    description: 'Real-time South African taxi booking & driver platform',
    images: ['/Logo.png']
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#f97316" />
        <link rel="icon" href="/Logo.png" />
        <link rel="apple-touch-icon" href="/Logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{});});}`
          }}
        />
        {children}
      </body>
    </html>
  );
}
