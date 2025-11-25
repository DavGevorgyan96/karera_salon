"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Helper function to decode JWT token
function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeToken(token);
      if (payload && payload.role) {
        setUserRole(payload.role);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'auth_token=; path=/; max-age=0;';
    router.push('/admin/login');
  };

  const isAdmin = userRole === 'ADMIN';
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">КарЕра Admin</h1>
          {userRole && (
            <p className="text-sm text-gray-500 mt-1">
              {userRole === 'ADMIN' ? 'Администратор' : 'Менеджер'}
            </p>
          )}
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <Link href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
            Dashboard
          </Link>
          <Link href="/admin/appointments" className="block px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
            Записи
          </Link>
          <Link href="/admin/services" className="block px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
            Услуги
          </Link>
          <Link href="/admin/staff" className="block px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
            Мастера
          </Link>
          <Link href="/admin/reviews" className="block px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
            Отзывы
          </Link>
          {isAdmin && (
            <>
              <Link href="/admin/settings" className="block px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
                Настройки
              </Link>
              <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
                Пользователи
              </Link>
            </>
          )}
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 rounded hover:bg-red-50 text-red-600 mb-2"
          >
            Выйти
          </button>
          <Link href="/" className="text-sm text-gray-500 hover:text-primary px-4">
            ← На сайт
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="md:hidden">Menu</div> {/* Mobile menu placeholder */}
          <div className="font-medium">
            {userRole === 'ADMIN' ? 'Администратор' : 'Менеджер'}
          </div>
        </header>
        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
