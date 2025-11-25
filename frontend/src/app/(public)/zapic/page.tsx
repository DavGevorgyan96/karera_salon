"use client";
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AppointmentForm() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  const [formData, setFormData] = useState({
    service: '',
    master: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    comment: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (serviceId) {
      setFormData(prev => ({ ...prev, service: serviceId }));
    }
  }, [serviceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4 text-dark">Спасибо за заявку!</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Мы свяжемся с вами в ближайшее время для подтверждения записи.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition duration-300 font-medium"
        >
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Услуга</label>
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
            >
              <option value="">Выберите услугу</option>
              <option value="1">Женская стрижка</option>
              <option value="2">Маникюр</option>
              <option value="3">Чистка лица</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Мастер</label>
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              value={formData.master}
              onChange={(e) => setFormData({...formData, master: e.target.value})}
            >
              <option value="">Любой мастер</option>
              <option value="1">Анна Иванова</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
            <input 
              type="date" 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            >
              <option value="">Выберите время</option>
              <option value="10:00">10:00</option>
              <option value="12:00">12:00</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
            <input 
              type="text" 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              placeholder="Иван"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input 
              type="tel" 
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              placeholder="+7 (999) 000-00-00"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
          <textarea 
            className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
            rows={3}
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-opacity-90 transition"
        >
          Записаться
        </button>
      </form>
    </>
  );
}

export default function AppointmentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Онлайн-запись</h1>
          <Suspense fallback={<div>Загрузка формы...</div>}>
            <AppointmentForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
