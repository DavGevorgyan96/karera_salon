'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { User } from 'lucide-react';
import api from '@/lib/api';

export default function MastersPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get('/staff');
        setStaff(res.data);
      } catch (error) {
        console.error('Failed to fetch staff', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-dark">Наши мастера</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Команда профессионалов, влюбленных в свое дело.</p>
        </div>
        
        {loading ? (
          <div className="text-center py-20">Загрузка...</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {staff.map((master) => (
              <div key={master.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] bg-surface rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group flex flex-col">
                <div className="h-72 bg-gradient-to-br from-gray-100 to-gray-200 w-full relative overflow-hidden flex items-center justify-center">
                   {master.avatarUrl ? (
                     <img 
                       src={`${api.defaults.baseURL?.replace(/\/$/, '')}${master.avatarUrl}`} 
                       alt={master.name} 
                       className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                     />
                   ) : (
                     <User className="w-24 h-24 text-gray-400 group-hover:scale-110 transition duration-500" strokeWidth={1.5} />
                   )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-bold text-dark">{master.name}</h3>
                    <span className="flex items-center bg-secondary text-accent text-xs px-2 py-1 rounded-full font-bold">
                      ★ {Number(master.rating || 5.0).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-primary font-medium mb-3 text-sm uppercase tracking-wide">{master.specialization?.name || 'Мастер'}</p>
                  <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">{master.description || 'Профессиональный мастер с большим опытом работы.'}</p>
                  <Link href="/zapic" className="w-full block text-center bg-dark text-white py-3 rounded-full hover:bg-primary transition duration-300 font-medium">
                    Записаться
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
