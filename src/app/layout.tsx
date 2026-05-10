import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'GenHi — Direktori Bank Sampah Yogyakarta',
  description: 'Platform digital bank sampah Kota Yogyakarta. Digital Collaboration. Social Empowerment. Sustainable Economy.',
  manifest: '/manifest.json',
  themeColor: '#1a5c2e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <body className="font-sans bg-green-50 text-green-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
