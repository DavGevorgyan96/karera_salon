"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import AdminCalendar from '@/components/admin/AdminCalendar';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Forms
  const [apptForm, setApptForm] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    staffId: '',
    date: '',
    timeFrom: '',
  });

  const [blockForm, setBlockForm] = useState({
    date: '',
    timeFrom: '',
    timeTo: '',
    reason: '',
    staffId: '',
    isAllDay: false
  });

  const fetchData = async () => {
    try {
      // 1. Fetch public data (Services, Staff)
      // These should work even if auth is broken
      const [servRes, staffRes] = await Promise.all([
        api.get('/services'),
        api.get('/staff')
      ]);
      setServices(servRes.data);
      setStaffList(staffRes.data);

      // 2. Fetch protected data (Appointments, Blocked Times)
      // If this fails (e.g. 401), we still have the dropdown data
      const [appRes, blockRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/blocked-times')
      ]);
      setAppointments(appRes.data);
      setBlockedTimes(blockRes.data);

    } catch (error: any) {
      console.error('Failed to fetch data', error);
      if (error.response?.status === 401) {
        toast.error('Сессия истекла. Пожалуйста, перезайдите.');
      } else {
        toast.error('Ошибка загрузки данных');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectSlot = (slotInfo: any) => {
    const now = new Date();
    const start = new Date(slotInfo.start);
    
    // Reset time part for date comparison to allow selecting today
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const slotDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());

    if (slotDate < today) {
      return;
    }

    setSelectedSlot(slotInfo);
    // Pre-fill forms with selected date
    const dateStr = new Date(slotInfo.start).toISOString().split('T')[0];
    const timeStr = new Date(slotInfo.start).toTimeString().slice(0, 5);
    
    setApptForm(prev => ({ ...prev, date: dateStr, timeFrom: timeStr }));
    setBlockForm(prev => ({ ...prev, date: dateStr, timeFrom: timeStr, timeTo: new Date(slotInfo.end).toTimeString().slice(0, 5) }));
    
    setIsApptModalOpen(true);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/appointments', apptForm);
      toast.success('Запись создана');
      setIsApptModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Ошибка создания записи');
    }
  };

  const handleBlockTime = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...blockForm,
      timeFrom: blockForm.isAllDay ? null : blockForm.timeFrom,
      timeTo: blockForm.isAllDay ? null : blockForm.timeTo,
    };
    try {
      await api.post('/blocked-times', data);
      toast.success('Время заблокировано');
      setIsBlockModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Ошибка блокировки');
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm('Разблокировать это время?')) return;
    try {
      await api.delete(`/blocked-times/${id}`);
      toast.success('Разблокировано');
      fetchData();
    } catch (error) {
      toast.error('Ошибка');
    }
  };

  const handleSelectEvent = (event: any) => {
    if (event.type === 'BLOCKED') {
      handleDeleteBlock(event.id);
    } else {
      // Maybe open details for appointment
      toast('Это запись клиента: ' + event.title);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Календарь записей</h2>
        <div className="space-x-2">
          <button 
            onClick={() => setIsApptModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            + Записать клиента
          </button>
          <button 
            onClick={() => setIsBlockModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Заблокировать время
          </button>
        </div>
      </div>

      <AdminCalendar 
        appointments={appointments}
        blockedTimes={blockedTimes}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />

      {/* Create Appointment Modal */}
      <Modal
        isOpen={isApptModalOpen}
        onClose={() => setIsApptModalOpen(false)}
        title="Новая запись"
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Имя клиента</label>
            <input 
              required
              className="w-full border p-2 rounded"
              value={apptForm.clientName}
              onChange={e => setApptForm({...apptForm, clientName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Телефон</label>
            <input 
              required
              className="w-full border p-2 rounded"
              value={apptForm.clientPhone}
              onChange={e => setApptForm({...apptForm, clientPhone: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Дата</label>
              <input 
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border p-2 rounded"
                value={apptForm.date}
                onChange={e => setApptForm({...apptForm, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Время</label>
              <input 
                type="time"
                required
                className="w-full border p-2 rounded"
                value={apptForm.timeFrom}
                onChange={e => setApptForm({...apptForm, timeFrom: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Услуга</label>
            <select 
              required
              className="w-full border p-2 rounded"
              value={apptForm.serviceId}
              onChange={e => setApptForm({...apptForm, serviceId: e.target.value})}
            >
              <option value="">Выберите услугу</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.price} ₽)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Мастер (необязательно)</label>
            <select 
              className="w-full border p-2 rounded"
              value={apptForm.staffId}
              onChange={e => setApptForm({...apptForm, staffId: e.target.value})}
            >
              <option value="">Любой мастер</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.specialization?.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90">
            Создать запись
          </button>
        </form>
      </Modal>

      {/* Block Time Modal */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        title="Блокировка времени"
      >
        <form onSubmit={handleBlockTime} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Причина</label>
            <input 
              className="w-full border p-2 rounded"
              placeholder="Например: Санитарный день"
              value={blockForm.reason}
              onChange={e => setBlockForm({...blockForm, reason: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Дата</label>
            <input 
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full border p-2 rounded"
              value={blockForm.date}
              onChange={e => setBlockForm({...blockForm, date: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="allDay"
              checked={blockForm.isAllDay}
              onChange={e => setBlockForm({...blockForm, isAllDay: e.target.checked})}
            />
            <label htmlFor="allDay">Весь день</label>
          </div>
          {!blockForm.isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">С</label>
                <input 
                  type="time"
                  required
                  className="w-full border p-2 rounded"
                  value={blockForm.timeFrom}
                  onChange={e => setBlockForm({...blockForm, timeFrom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">По</label>
                <input 
                  type="time"
                  required
                  className="w-full border p-2 rounded"
                  value={blockForm.timeTo}
                  onChange={e => setBlockForm({...blockForm, timeTo: e.target.value})}
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Мастер (необязательно)</label>
            <select 
              className="w-full border p-2 rounded"
              value={blockForm.staffId}
              onChange={e => setBlockForm({...blockForm, staffId: e.target.value})}
            >
              <option value="">Весь салон</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Если не выбрано, блокируется для всех.</p>
          </div>
          <button type="submit" className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
            Заблокировать
          </button>
        </form>
      </Modal>
    </div>
  );
}
