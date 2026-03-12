import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import GlassNav from '@/components/GlassNav';

export const metadata: Metadata = {
  title: 'Hair X Studio | Luxury Family Salon',
  description: 'Premium hair and beauty experience in Ballari. Book your luxury salon services today.',
};

import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable} ${inter.variable}`}>
      <body className="antialiased overflow-x-hidden selection:bg-[#B76E79] selection:text-white font-[family-name:var(--font-inter)]">
        <CustomCursor />
        <GlassNav />
        {children}
      </body>
    </html>
  );
}
