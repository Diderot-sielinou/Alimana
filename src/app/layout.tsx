// layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../components/dashboard/globals.css';
import { Toaster } from 'react-hot-toast'; // ✅
import GlobalProviders from '@/provider/GlobalProviders';
import 'react-tooltip/dist/react-tooltip.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alimana StoreMS',
  description: 'Gestion de boutique moderne avec Next.js & NestJS',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased bg-background text-foreground dark:bg-gray-900 dark:text-white"
        suppressHydrationWarning={true}
      >
        <GlobalProviders>{children}</GlobalProviders>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
