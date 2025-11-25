"use client";
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { useState, useEffect, Suspense } from 'react';
import Modal from '@/components/ui/Modal';
import { useSearchParams } from 'next/navigation';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (serviceId) {
      setFormData(prev => ({ ...prev, service: serviceId }));
    }
  }, [serviceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Успешно"
        footer={
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
          >
            ОК
          </button>
        }
      >
        <p>Заявка отправлена! (Демонстрация)</p>
      </Modal>
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
