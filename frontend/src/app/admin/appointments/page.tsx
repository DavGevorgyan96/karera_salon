"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null, status: string | null}>({
    isOpen: false, id: null, status: null
  });

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      toast.error('Ошибка загрузки записей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openConfirm = (id: string, status: string) => {
    setConfirmModal({ isOpen: true, id, status });
  };

  const closeConfirm = () => {
    setConfirmModal({ isOpen: false, id: null, status: null });
  };

  const handleConfirmStatus = async () => {
    if (!confirmModal.id || !confirmModal.status) return;

    try {
      await api.put(`/appointments/${confirmModal.id}/status`, { status: confirmModal.status });
      toast.success('Статус обновлен');
      fetchAppointments();
      closeConfirm();
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление записями</h2>
        <div className="space-x-2">
          <button className="bg-white border px-3 py-1 rounded" onClick={fetchAppointments}>Обновить</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Дата/Время</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Клиент</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Услуга</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Мастер</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Статус</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map((app) => (
              <tr key={app.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(app.date).toLocaleDateString('ru-RU')} <br/>
                  {new Date(app.timeFrom).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{app.clientName}</div>
                  <div className="text-sm text-gray-500">{app.clientPhone}</div>
                </td>
                <td className="px-6 py-4">{app.service?.name}</td>
                <td className="px-6 py-4">{app.staff?.name || 'Любой'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    app.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    app.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'DONE' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  {app.status === 'NEW' && (
                    <button 
                      onClick={() => openConfirm(app.id, 'CONFIRMED')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Подтвердить
                    </button>
                  )}
                  {app.status === 'CONFIRMED' && (
                    <button 
                      onClick={() => openConfirm(app.id, 'DONE')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Выполнено
                    </button>
                  )}
                  {app.status !== 'CANCELED' && app.status !== 'DONE' && (
                    <button 
                      onClick={() => openConfirm(app.id, 'CANCELED')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Отменить
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        title="Подтверждение действия"
        footer={
          <>
            <button
              onClick={closeConfirm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Отмена
            </button>
            <button
              onClick={handleConfirmStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Подтвердить
            </button>
          </>
        }
      >
        <p>Вы уверены, что хотите изменить статус на <strong>{confirmModal.status}</strong>?</p>
      </Modal>
    </div>
  );
}
