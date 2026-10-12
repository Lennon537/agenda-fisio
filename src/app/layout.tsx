import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Agendar sessão | Ketllen Souza Fisioterapia',
  description: 'Ketllen Souza Fisioterapia & Pilates. Agende sua sessão com facilidade ou solicite um encaixe na agenda.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ketllen Souza Fisioterapia',
  },
};

export const viewport: Viewport = {
  themeColor: '#2d5a4c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-theme="light" className={`${plusJakarta.variable} ${outfit.variable}`}>
      <body className={plusJakarta.className}>
        {children}
      </body>
    </html>
  );
}
