import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function MastersPage() {
  const masters = [
    { name: 'Анна Иванова', role: 'Парикмахер', rating: 5.0, desc: 'Топ-стилист с 10-летним стажем. Специализируется на сложных окрашиваниях.' },
    { name: 'Мария Петрова', role: 'Мастер маникюра', rating: 4.9, desc: 'Аккуратность и креативность. Создает уникальные дизайны.' },
    { name: 'Елена Сидорова', role: 'Косметолог', rating: 5.0, desc: 'Врач-дерматолог. Эксперт в области уходовых процедур.' },
    { name: 'Дмитрий Смирнов', role: 'Барбер', rating: 4.8, desc: 'Мастер мужских стрижек и оформления бороды.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-dark">Наши мастера</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Команда профессионалов, влюбленных в свое дело.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {masters.map((master, idx) => (
            <div key={idx} className="bg-surface rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group flex flex-col">
              <div className="h-72 bg-gray-200 w-full relative overflow-hidden">
                 {/* Placeholder for image */}
                 <div className="absolute inset-0 bg-gray-300 group-hover:scale-105 transition duration-500"></div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif font-bold text-dark">{master.name}</h3>
                  <span className="flex items-center bg-secondary text-accent text-xs px-2 py-1 rounded-full font-bold">
                    ★ {master.rating}
                  </span>
                </div>
                <p className="text-primary font-medium mb-3 text-sm uppercase tracking-wide">{master.role}</p>
                <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">{master.desc}</p>
                <Link href="/zapic" className="w-full block text-center bg-dark text-white py-3 rounded-full hover:bg-primary transition duration-300 font-medium">
                  Записаться
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
