"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStaff, setNewStaff] = useState({
    name: '',
    specializationId: '',
    description: '',
  });
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const fetchData = async () => {
    try {
      const [staffRes, specsRes] = await Promise.all([
        api.get('/staff'),
        api.get('/specializations')
      ]);
      setStaff(staffRes.data);
      setSpecializations(specsRes.data);
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

  const openDeleteStaff = (id: string) => setConfirmModal({ isOpen: true, id });
  const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });

  const handleConfirmDelete = async () => {
    if (!confirmModal.id) return;

    try {
      await api.delete(`/staff/${confirmModal.id}`);
      toast.success('Мастер удален');
      fetchData();
      closeConfirm();
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.specializationId) {
      toast.error('Выберите специализацию');
      return;
    }
    try {
      await api.post('/staff', newStaff);
      setNewStaff({ name: '', specializationId: '', description: '' });
      toast.success('Мастер добавлен');
      fetchData();
    } catch (error) {
      toast.error('Ошибка при создании мастера');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Мастера</h2>
      </div>

      {/* Create Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-semibold mb-4">Добавить мастера</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Имя</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded text-sm" 
              value={newStaff.name}
              onChange={e => setNewStaff({...newStaff, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Специализация</label>
            <select 
              className="w-full border p-2 rounded text-sm" 
              value={newStaff.specializationId}
              onChange={e => setNewStaff({...newStaff, specializationId: e.target.value})}
              required
            >
              <option value="">Выберите...</option>
              {specializations.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Описание</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded text-sm" 
              value={newStaff.description}
              onChange={e => setNewStaff({...newStaff, description: e.target.value})}
            />
          </div>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-opacity-90 h-10">
            Добавить
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staff.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
            <h3 className="text-lg font-bold">{s.name}</h3>
            <p className="text-gray-500 mb-2">{s.specialization?.name || 'Без специализации'}</p>
            <div className="text-yellow-500 text-sm mb-4">★ {s.rating}</div>
            <div className="flex space-x-2 w-full">
              <button 
                onClick={() => openDeleteStaff(s.id)}
                className="flex-1 border border-red-200 text-red-600 py-1 rounded text-sm hover:bg-red-50"
              >
                Скрыть
              </button>
            </div>
          </div>
        ))}
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
        <p>Вы уверены, что хотите скрыть этого мастера?</p>
      </Modal>
    </div>
  );
}
