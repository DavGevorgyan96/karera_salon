import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

export default function ServicesPage() {
  const categories = [
    {
      name: 'Волосы',
      services: [
        { name: 'Женская стрижка', price: '1500 ₽', duration: '60 мин' },
        { name: 'Мужская стрижка', price: '1000 ₽', duration: '45 мин' },
        { name: 'Окрашивание в один тон', price: '3500 ₽', duration: '120 мин' },
      ]
    },
    {
      name: 'Ногти',
      services: [
        { name: 'Маникюр с покрытием', price: '2000 ₽', duration: '90 мин' },
        { name: 'Педикюр', price: '2500 ₽', duration: '90 мин' },
        { name: 'Дизайн ногтей', price: 'от 500 ₽', duration: '30 мин' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-dark">Наши услуги</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Мы предлагаем широкий спектр услуг для вашей красоты и здоровья.</p>
        </div>
        
        <div className="space-y-16">
          {categories.map((cat, idx) => (
            <div key={idx}>
              <h2 className="text-3xl font-serif font-bold mb-8 text-dark border-b border-primary/20 pb-4 inline-block pr-12">{cat.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cat.services.map((service, sIdx) => (
                  <div key={sIdx} className="bg-surface p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300 flex justify-between items-center group">
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-1 group-hover:text-primary transition">{service.name}</h3>
                      <p className="text-gray-400 text-sm flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                        {service.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-dark mb-3">{service.price}</p>
                      <Link href="/zapic" className="inline-block bg-dark text-white px-5 py-2 rounded-full text-sm hover:bg-primary transition duration-300">
                        Записаться
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
