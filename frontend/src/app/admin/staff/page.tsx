"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import { User } from 'lucide-react';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStaff, setNewStaff] = useState({
    name: '',
    specializationId: '',
    description: '',
    file: null as File | null,
  });
  
  // Edit Modal State
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    data: any | null;
    file: File | null;
  }>({
    isOpen: false,
    data: null,
    file: null,
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
    
    const formData = new FormData();
    formData.append('name', newStaff.name);
    formData.append('specializationId', newStaff.specializationId);
    formData.append('description', newStaff.description);
    if (newStaff.file) {
      formData.append('file', newStaff.file);
    }

    try {
      await api.post('/staff', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewStaff({ name: '', specializationId: '', description: '', file: null });
      toast.success('Мастер добавлен');
      fetchData();
    } catch (error) {
      toast.error('Ошибка при создании мастера');
    }
  };

  const openEditStaff = (s: any) => {
    setEditModal({
      isOpen: true,
      data: { ...s },
      file: null
    });
  };

  const closeEdit = () => {
    setEditModal({ isOpen: false, data: null, file: null });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.data) return;

    const formData = new FormData();
    formData.append('name', editModal.data.name);
    formData.append('specializationId', editModal.data.specializationId);
    formData.append('description', editModal.data.description || '');
    if (editModal.file) {
      formData.append('file', editModal.file);
    }

    try {
      await api.put(`/staff/${editModal.data.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Мастер обновлен');
      fetchData();
      closeEdit();
    } catch (error) {
      toast.error('Ошибка при обновлении');
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
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
          <div>
            <label className="block text-xs text-gray-500 mb-1">Фото</label>
            <input 
              type="file" 
              className="w-full border p-2 rounded text-sm" 
              onChange={e => setNewStaff({...newStaff, file: e.target.files?.[0] || null})}
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
            {s.avatarUrl ? (
               <img src={`${api.defaults.baseURL?.replace(/\/$/, '')}${s.avatarUrl}`} alt={s.name} className="w-20 h-20 rounded-full mb-4 object-cover" />
            ) : (
               <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4 flex items-center justify-center">
                 <User className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
               </div>
            )}
            <h3 className="text-lg font-bold">{s.name}</h3>
            <p className="text-gray-500 mb-2">{s.specialization?.name || 'Без специализации'}</p>
            <div className="text-yellow-500 text-sm mb-4">★ {Number(s.rating).toFixed(1)}</div>
            <div className="flex space-x-2 w-full">
              <button 
                onClick={() => openEditStaff(s)}
                className="flex-1 border border-blue-200 text-blue-600 py-1 rounded text-sm hover:bg-blue-50"
              >
                Редактировать
              </button>
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

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={closeEdit}
        title="Редактировать мастера"
        footer={null}
      >
        {editModal.data && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={editModal.data.name}
                onChange={e => setEditModal({ ...editModal, data: { ...editModal.data, name: e.target.value } })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Специализация</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={editModal.data.specializationId || ''}
                onChange={e => setEditModal({ ...editModal, data: { ...editModal.data, specializationId: e.target.value } })}
                required
              >
                <option value="">Выберите...</option>
                {specializations.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Описание</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={editModal.data.description || ''}
                onChange={e => setEditModal({ ...editModal, data: { ...editModal.data, description: e.target.value } })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Фото</label>
              <input
                type="file"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={e => setEditModal({ ...editModal, file: e.target.files?.[0] || null })}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={closeEdit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Сохранить
              </button>
            </div>
          </form>
        )}
      </Modal>

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
