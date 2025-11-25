import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-surface/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto h-20 flex items-center justify-between">
        <Link href="/" className="text-3xl font-serif font-bold text-dark tracking-tight">
          КарЕра
        </Link>
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
      </div>
    </header>
  );
}
