import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function ReviewsPage() {
  const reviews = [
    { name: 'Ольга', rating: 5, text: 'Прекрасный салон! Очень довольна стрижкой. Мастер Анна — настоящий профессионал, поняла меня с полуслова.', date: '20.11.2025' },
    { name: 'Наталья', rating: 4, text: 'Маникюр сделали хорошо, но пришлось немного подождать своего времени. В остальном сервис на высоте.', date: '18.11.2025' },
    { name: 'Екатерина', rating: 5, text: 'Лучшая чистка лица в моей жизни! Кожа сияет. Обязательно приду еще.', date: '15.11.2025' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-dark">Отзывы клиентов</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Мы ценим каждое мнение и стремимся стать лучше для вас.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-surface p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-serif font-bold text-lg text-dark">{review.name}</div>
                    <div className="text-accent text-sm">{'★'.repeat(review.rating)}</div>
                  </div>
                  <div className="text-gray-300 text-sm">{review.date}</div>
                </div>
                <p className="text-gray-600 leading-relaxed italic">"{review.text}"</p>
              </div>
            ))}
          </div>

          <div className="bg-surface p-10 rounded-2xl shadow-lg h-fit sticky top-24">
            <h2 className="text-2xl font-serif font-bold mb-6 text-center text-dark">Оставить отзыв</h2>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ваше имя</label>
                <input type="text" className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" placeholder="Как к вам обращаться?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Оценка</label>
                <select className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition bg-surface">
                  <option value="5">5 - Отлично</option>
                  <option value="4">4 - Хорошо</option>
                  <option value="3">3 - Нормально</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ваш отзыв</label>
                <textarea className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" rows={4} placeholder="Расскажите о ваших впечатлениях..."></textarea>
              </div>
              <button className="w-full bg-dark text-white py-3 rounded-full hover:bg-primary transition duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Отправить отзыв
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
