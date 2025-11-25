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
          
          <div className="bg-gray-100 rounded-2xl h-[600px] overflow-hidden shadow-lg">
            <iframe 
              src="https://yandex.com/map-widget/v1/?ll=37.366195%2C55.820502&mode=poi&poi%5Bpoint%5D=37.366158%2C55.820500&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D236970320560&z=17" 
              width="100%" 
              height="600" 
              frameBorder="0" 
              allowFullScreen={true}
              className="w-full h-full"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
