"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto h-20 flex items-center justify-between px-4">
        <Link href="/" className="text-3xl font-serif font-bold text-dark tracking-tight">
          КарЕра
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link href="/uslugi" className="text-dark hover:text-primary transition font-medium">Услуги</Link>
          <Link href="/masters" className="text-dark hover:text-primary transition font-medium">Мастера</Link>
          <Link href="/otzyvy" className="text-dark hover:text-primary transition font-medium">Отзывы</Link>
          <Link href="/kontakty" className="text-dark hover:text-primary transition font-medium">Контакты</Link>
          <Link 
            href="/zapic" 
            className="bg-dark text-white px-6 py-2.5 rounded-full hover:bg-primary transition duration-300 font-medium text-sm"
          >
            Записаться
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-dark focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-gray-200 absolute w-full left-0 top-20 shadow-lg">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              href="/uslugi" 
              className="text-dark hover:text-primary transition font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Услуги
            </Link>
            <Link 
              href="/masters" 
              className="text-dark hover:text-primary transition font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Мастера
            </Link>
            <Link 
              href="/otzyvy" 
              className="text-dark hover:text-primary transition font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Отзывы
            </Link>
            <Link 
              href="/kontakty" 
              className="text-dark hover:text-primary transition font-medium text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
            </Link>
            <Link 
              href="/zapic" 
              className="bg-dark text-white px-6 py-3 rounded-full hover:bg-primary transition duration-300 font-medium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Записаться
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
