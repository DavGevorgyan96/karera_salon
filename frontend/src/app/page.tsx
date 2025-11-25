import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import api from '@/lib/api';

async function getSettings() {
  try {
    const res = await api.get('/settings');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch settings', error);
    return null;
  }
}

export default async function Home() {
  const settings = await getSettings();

  const heroTitle = settings?.heroTitle || 'Искусство быть собой';
  const heroSubtitle = settings?.heroSubtitle || 'Салон красоты «КарЕра» — это пространство, где профессионализм встречается с эстетикой. Позвольте нам раскрыть вашу естественную красоту.';

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center bg-dark overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-90 z-0"></div>
          {/* Decorative circle */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent rounded-full blur-[120px] opacity-20 -translate-x-1/3 translate-y-1/3"></div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-white leading-tight">
              {heroTitle}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              {heroSubtitle}
            </p>
            <Link 
              href="/zapic" 
              className="inline-block bg-primary text-white text-lg px-10 py-4 rounded-full hover:bg-white hover:text-dark transition duration-300 font-medium tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Записаться онлайн
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-surface">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-2xl">✨</div>
                <h3 className="text-xl font-serif font-bold mb-4">Премиум материалы</h3>
                <p className="text-gray-600 leading-relaxed">Мы используем только сертифицированную косметику от ведущих мировых брендов.</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-2xl">💎</div>
                <h3 className="text-xl font-serif font-bold mb-4">Опытные мастера</h3>
                <p className="text-gray-600 leading-relaxed">Наши специалисты регулярно повышают квалификацию и следят за трендами.</p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-2xl">🌿</div>
                <h3 className="text-xl font-serif font-bold mb-4">Атмосфера уюта</h3>
                <p className="text-gray-600 leading-relaxed">Расслабьтесь и наслаждайтесь процессом в нашем стильном и комфортном пространстве.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Services */}
        <section className="py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold mb-4 text-dark">Популярные услуги</h2>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Женская стрижка', price: '1500 ₽', desc: 'Индивидуальный подбор формы и уход' },
                { title: 'Маникюр с покрытием', price: '2000 ₽', desc: 'Классический, аппаратный или комбинированный' },
                { title: 'Чистка лица', price: '3000 ₽', desc: 'Глубокое очищение и восстановление кожи' },
              ].map((service, idx) => (
                <div key={idx} className="bg-surface p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 group">
                  <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition">{service.title}</h3>
                  <p className="text-gray-500 mb-6">{service.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-dark">{service.price}</span>
                    <Link href="/zapic" className="text-primary font-medium hover:text-dark transition">Записаться →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/uslugi" className="inline-block border-2 border-dark text-dark px-8 py-3 rounded-full hover:bg-dark hover:text-white transition duration-300 font-medium">
                Смотреть все услуги
              </Link>
            </div>
          </div>
        </section>

        {/* Masters Preview */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-dark">Наши мастера</h2>
                <div className="w-24 h-1 bg-primary mx-auto md:mx-0"></div>
              </div>
              <Link href="/masters" className="text-primary hover:text-dark transition font-medium text-lg">
                Все мастера →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { name: 'Анна Иванова', role: 'Топ-стилист' },
                { name: 'Мария Петрова', role: 'Nail-мастер' },
                { name: 'Елена Сидорова', role: 'Косметолог-эстетист' },
              ].map((master, idx) => (
                <div key={idx} className="group text-center">
                  <div className="relative w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden bg-gray-100">
                    {/* Placeholder for master image */}
                    <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition duration-500"></div>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-2">{master.name}</h3>
                  <p className="text-primary font-medium uppercase tracking-wider text-sm">{master.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-dark text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-5"></div>
           <div className="container mx-auto px-4 text-center relative z-10">
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Готовы преобразиться?</h2>
             <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
               Запишитесь на процедуру прямо сейчас и получите скидку 10% на первое посещение.
             </p>
             <Link 
              href="/zapic" 
              className="inline-block bg-white text-dark text-lg px-10 py-4 rounded-full hover:bg-primary hover:text-white transition duration-300 font-medium shadow-lg"
            >
              Записаться на визит
            </Link>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
