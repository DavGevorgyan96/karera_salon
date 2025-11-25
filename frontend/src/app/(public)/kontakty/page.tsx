import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function ContactsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center text-dark">Контакты</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          <div className="bg-surface p-10 rounded-2xl shadow-sm">
            <div className="mb-10">
              <h2 className="text-2xl font-serif font-bold mb-4 text-dark">Наш адрес</h2>
              <p className="text-lg text-gray-600">г. Москва, ул. Красоты, д. 1</p>
              <p className="text-sm text-gray-400 mt-2">5 минут от м. Театральная</p>
            </div>
            
            <div className="mb-10">
              <h2 className="text-2xl font-serif font-bold mb-4 text-dark">Свяжитесь с нами</h2>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Телефон:</span> 
                  <a href="tel:+79991234567" className="text-primary hover:text-dark transition font-bold text-lg">+7 (999) 123-45-67</a>
                </p>
                <p className="flex items-center text-gray-600">
                  <span className="font-medium w-24">Telegram:</span> 
                  <span className="text-dark">@karera_beauty</span>
                </p>
                <p className="flex items-center text-gray-600">
                  <span className="font-medium w-24">WhatsApp:</span> 
                  <span className="text-dark">+7 (999) 123-45-67</span>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold mb-4 text-dark">Режим работы</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Понедельник - Пятница</span>
                  <span className="font-medium">10:00 - 21:00</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Суббота - Воскресенье</span>
                  <span className="font-medium">11:00 - 20:00</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-200 rounded-2xl h-[600px] flex items-center justify-center text-gray-500 overflow-hidden shadow-inner relative">
            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
            <span className="relative z-10 font-medium">Интерактивная карта</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
