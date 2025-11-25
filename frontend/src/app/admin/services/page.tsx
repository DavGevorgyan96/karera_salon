"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({
    name: '',
    category: '',
    price: '',
    durationMinutes: '',
  });
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null}>({
    isOpen: false, id: null
  });

  const fetchData = async () => {
    try {
      const [servicesRes, settingsRes] = await Promise.all([
        api.get('/services'),
        api.get('/settings')
      ]);
      setServices(servicesRes.data);
      const cats = settingsRes.data?.categories || [];
      setCategories(cats);
      
      if (cats.length > 0 && !newService.category) {
        setNewService(prev => ({ ...prev, category: cats[0] }));
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDelete = (id: string) => setConfirmModal({ isOpen: true, id });
  const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });

  const handleConfirmDelete = async () => {
    if (!confirmModal.id) return;
    try {
      await api.delete(`/services/${confirmModal.id}`);
      toast.success('Услуга удалена');
      fetchData();
      closeConfirm();
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.category) {
      toast.error('Выберите категорию (добавьте в настройках)');
      return;
    }
    try {
      await api.post('/services', {
        ...newService,
        price: parseFloat(newService.price),
        durationMinutes: parseInt(newService.durationMinutes),
      });
      setNewService({ name: '', category: categories[0] || '', price: '', durationMinutes: '' });
      toast.success('Услуга добавлена');
      fetchData();
    } catch (error) {
      toast.error('Ошибка при создании услуги');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Услуги</h2>
      </div>

      {/* Simple Create Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-semibold mb-4">Добавить новую услугу</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Название</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded text-sm" 
              value={newService.name}
              onChange={e => setNewService({...newService, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Категория</label>
            <select 
              className="w-full border p-2 rounded text-sm"
              value={newService.category}
              onChange={e => setNewService({...newService, category: e.target.value})}
              required
            >
              {categories.length === 0 && <option value="">Нет категорий</option>}
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Цена (₽)</label>
            <input 
              type="number" 
              className="w-full border p-2 rounded text-sm" 
              value={newService.price}
              onChange={e => setNewService({...newService, price: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Длит. (мин)</label>
            <input 
              type="number" 
              className="w-full border p-2 rounded text-sm" 
              value={newService.durationMinutes}
              onChange={e => setNewService({...newService, durationMinutes: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-opacity-90 h-10">
            Добавить
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Название</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Категория</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Цена</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Длительность</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 font-medium">{s.name}</td>
                <td className="px-6 py-4">{s.category}</td>
                <td className="px-6 py-4">{s.price} ₽</td>
                <td className="px-6 py-4">{s.durationMinutes} мин</td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button 
                    onClick={() => openDelete(s.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        title="Подтверждение удаления"
        footer={
          <>
            <button
              onClick={closeConfirm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Удалить
            </button>
          </>
        }
      >
        <p>Вы уверены, что хотите удалить эту услугу?</p>
      </Modal>
    </div>
  );
}
