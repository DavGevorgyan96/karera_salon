"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [dayDetailsModal, setDayDetailsModal] = useState<{
    isOpen: boolean;
    date: string | null;
    appointments: any[];
  }>({
    isOpen: false,
    date: null,
    appointments: []
  });

  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [apptMode, setApptMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

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
    status: 'NEW'
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

  const openCreateModal = (dateStr?: string) => {
    setApptMode('create');
    setEditingId(null);
    setApptForm({
      clientName: '',
      clientPhone: '',
      serviceId: '',
      staffId: '',
      date: dateStr || new Date().toISOString().split('T')[0],
      timeFrom: '10:00',
      status: 'NEW'
    });
    setIsApptModalOpen(true);
  };

  const openEditModal = (app: any) => {
    setApptMode('edit');
    setEditingId(app.id);
    setApptForm({
      clientName: app.clientName,
      clientPhone: app.clientPhone,
      serviceId: app.serviceId,
      staffId: app.staffId || '',
      date: app.date.toString().split('T')[0],
      timeFrom: app.timeFrom.toString().split('T')[1].substring(0, 5),
      status: app.status
    });
    setIsApptModalOpen(true);
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (apptMode === 'create') {
        await api.post('/appointments', apptForm);
        toast.success('Запись создана');
      } else {
        await api.put(`/appointments/${editingId}`, apptForm);
        toast.success('Запись обновлена');
      }
      setIsApptModalOpen(false);
      setDayDetailsModal(prev => ({ ...prev, isOpen: false }));
      fetchData();
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm('Вы уверены?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Запись удалена');
      setDayDetailsModal(prev => ({ ...prev, isOpen: false }));
      setIsApptModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Ошибка удаления');
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

  if (loading) return <div>Загрузка...</div>;

  // Filter for today's appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(app => 
    app.date.toString().startsWith(todayStr)
  ).sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Обзор на сегодня</h2>
        <div className="space-x-2">
          <button 
            onClick={() => openCreateModal()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            + Записать клиента
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">Записей сегодня</div>
            <div className="text-3xl font-bold text-gray-900">{todayAppointments.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">Новых заявок</div>
            <div className="text-3xl font-bold text-blue-600">
                {appointments.filter(a => a.status === 'NEW').length}
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium mb-1">Мастеров работает</div>
            <div className="text-3xl font-bold text-green-600">{staffList.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Расписание на сегодня ({new Date().toLocaleDateString('ru-RU')})
            </h3>
            <Link href="/admin/appointments" className="text-sm text-primary hover:underline">
                Перейти к расписанию &rarr;
            </Link>
        </div>
        <div className="divide-y divide-gray-100">
            {todayAppointments.length > 0 ? (
                todayAppointments.map(app => (
                    <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md font-semibold text-sm">
                                {new Date(app.timeFrom).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{app.clientName}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <span>{app.service?.name}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{app.staff?.name || 'Любой мастер'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                app.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                app.status === 'DONE' ? 'bg-gray-100 text-gray-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {app.status === 'NEW' ? 'Новая' : 
                                 app.status === 'CONFIRMED' ? 'Подтверждена' : 
                                 app.status === 'DONE' ? 'Выполнена' : 'Отменена'}
                            </span>
                            <button 
                                onClick={() => openEditModal(app)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-gray-500">
                    На сегодня записей нет
                </div>
            )}
        </div>
      </div>

      {/* Day Details Modal */}
      <Modal
        isOpen={dayDetailsModal.isOpen}
        onClose={() => setDayDetailsModal({ ...dayDetailsModal, isOpen: false })}
        title={`Записи на ${dayDetailsModal.date ? new Date(dayDetailsModal.date).toLocaleDateString('ru-RU') : ''}`}
        footer={null}
      >
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => {
                        setDayDetailsModal({ ...dayDetailsModal, isOpen: false });
                        openCreateModal(dayDetailsModal.date || undefined);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Добавить запись
                </button>
            </div>

            {dayDetailsModal.appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Нет записей на этот день
                </div>
            ) : (
                <div className="space-y-3">
                    {dayDetailsModal.appointments.map((app) => (
                        <div key={app.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-start group hover:border-gray-200 transition-all">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900">
                                        {new Date(app.timeFrom).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        {' - '}
                                        {new Date(app.timeTo).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                                        app.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                        app.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                        app.status === 'DONE' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {app.status === 'NEW' ? 'Новая' : 
                                         app.status === 'CONFIRMED' ? 'Подтверждена' : 
                                         app.status === 'DONE' ? 'Выполнена' : 'Отменена'}
                                    </span>
                                </div>
                                <div className="text-sm font-medium text-gray-900">{app.clientName}</div>
                                <div className="text-xs text-gray-500 mb-1">{app.service?.name}</div>
                                {app.staff && (
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <span>Мастер: {app.staff.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        setDayDetailsModal({ ...dayDetailsModal, isOpen: false });
                                        openEditModal(app);
                                    }}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Редактировать"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteAppointment(app.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Удалить"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </Modal>

      {/* Create/Edit Appointment Modal */}
      <Modal
        isOpen={isApptModalOpen}
        onClose={() => setIsApptModalOpen(false)}
        title={apptMode === 'create' ? "Новая запись" : "Редактирование записи"}
      >
        <form onSubmit={handleSaveAppointment} className="space-y-4">
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
          
          {apptMode === 'edit' && (
             <div>
                <label className="block text-sm font-medium mb-1">Статус</label>
                <select
                  className="w-full border p-2 rounded"
                  value={apptForm.status}
                  onChange={e => setApptForm({...apptForm, status: e.target.value})}
                >
                  <option value="NEW">Новая</option>
                  <option value="CONFIRMED">Подтверждена</option>
                  <option value="DONE">Выполнена</option>
                  <option value="CANCELED">Отменена</option>
                </select>
             </div>
          )}

          <div className="flex justify-between pt-4">
            {apptMode === 'edit' && editingId ? (
              <button
                type="button"
                onClick={() => handleDeleteAppointment(editingId)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Удалить
              </button>
            ) : <div></div>}
            
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90">
              {apptMode === 'create' ? 'Создать запись' : 'Сохранить'}
            </button>
          </div>
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
