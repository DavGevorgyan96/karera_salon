"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (error) {
        console.error('Failed to fetch footer settings', error);
      }
    };
    fetchSettings();
  }, []);

  const phone = settings?.contactPhone || '+7 (999) 123-45-67';
  const address = settings?.contactAddress || 'Москва, ул. Красоты, д. 1';

  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-6">КарЕра</h3>
            <p className="text-gray-400 leading-relaxed">
              Салон красоты премиум-класса. Мы заботимся о вашей красоте и здоровье, используя только лучшие материалы и технологии.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Навигация</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/uslugi" className="hover:text-primary transition">Услуги</Link></li>
              <li><Link href="/masters" className="hover:text-primary transition">Мастера</Link></li>
              <li><Link href="/otzyvy" className="hover:text-primary transition">Отзывы</Link></li>
              <li><Link href="/kontakty" className="hover:text-primary transition">Контакты</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-6">Контакты</h4>
            <ul className="space-y-3 text-gray-400">
              <li>{address}</li>
              <li>{phone}</li>
              <li>Ежедневно с 10:00 до 22:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Салон красоты «КарЕра». Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
