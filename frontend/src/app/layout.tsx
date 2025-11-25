import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: {
    default: "Салон красоты «КарЕра» | Стрижки, Маникюр, Косметология",
    template: "%s | Салон красоты «КарЕра»",
  },
  description: "Профессиональный салон красоты «КарЕра» в Москве. Стрижки, окрашивание, маникюр, педикюр и косметология. Онлайн-запись 24/7. Лучшие мастера и премиум косметика.",
  keywords: ["салон красоты", "парикмахерская", "маникюр", "педикюр", "косметолог", "стрижка", "окрашивание", "Москва", "онлайн запись"],
  authors: [{ name: "Karera Salon" }],
  creator: "Karera Salon",
  publisher: "Karera Salon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://karera-salon.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Салон красоты «КарЕра» — Ваш стиль, наша забота",
    description: "Запишитесь онлайн на стрижку, маникюр или уход за лицом. Профессиональные мастера, уютная атмосфера и отличный сервис.",
    url: 'https://karera-salon.vercel.app',
    siteName: 'Салон красоты «КарЕра»',
    images: [
      {
        url: '/og-image.jpg', // Рекомендуемый размер 1200x630
        width: 1200,
        height: 630,
        alt: 'Интерьер салона красоты КарЕра',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Салон красоты «КарЕра»",
    description: "Премиум услуги красоты в Москве. Записывайтесь онлайн!",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-secondary text-dark antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
