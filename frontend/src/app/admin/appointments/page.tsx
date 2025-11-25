"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import { Plus, Pencil, Trash2, X, Calendar as CalendarIcon, Clock, User, Scissors } from 'lucide-react';

export default function AdminAppointmentsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // List View State
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null, status: string | null}>({
    isOpen: false, id: null, status: null
  });
  
  const [appointmentModal, setAppointmentModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    data: any;
  }>({
    isOpen: false,
    mode: 'create',
    data: {
      clientName: '',
      clientPhone: '',
      serviceId: '',
      staffId: '',
      date: '',
      timeFrom: '',
      commentFromClient: ''
    }
  });

  const fetchData = async () => {
    try {
      const [appRes, blockedRes, servicesRes, staffRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/blocked-times'),
        api.get('/services'),
        api.get('/staff')
      ]);
      setAppointments(appRes.data);
      setBlockedTimes(blockedRes.data);
      setServices(servicesRes.data);
      setStaffList(staffRes.data);
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

  const handleSelectEvent = (event: any) => {
    if (event.type === 'APPOINTMENT') {
      const app = event.resource;
      setAppointmentModal({
        isOpen: true,
        mode: 'edit',
        data: {
          id: app.id,
          clientName: app.clientName,
          clientPhone: app.clientPhone,
          serviceId: app.serviceId,
          staffId: app.staffId || '',
          date: app.date.split('T')[0],
          timeFrom: app.timeFrom.split('T')[1].substring(0, 5),
          commentFromClient: app.commentFromClient || '',
          status: app.status
        }
      });
    }
  };

  // --- CRUD Handlers ---
  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, mode } = appointmentModal;
    
    try {
      if (mode === 'create') {
        await api.post('/appointments', data);
        toast.success('Запись создана');
      } else {
        await api.put(`/appointments/${data.id}`, data);
        toast.success('Запись обновлена');
      }
      setAppointmentModal({ ...appointmentModal, isOpen: false });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка сохранения');
    }
  };

  const handleDeleteAppointment = async (id?: string) => {
    const targetId = id || appointmentModal.data.id;
    if (!targetId) return;
    
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

    try {
      await api.delete(`/appointments/${targetId}`);
      toast.success('Запись удалена');
      setAppointmentModal({ ...appointmentModal, isOpen: false });
      fetchData();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  // --- Status Handlers (List View) ---
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
      fetchData();
      closeConfirm();
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  // --- List View Helpers ---
  const filteredAppointments = appointments.filter(app => {
    const appDate = new Date(app.date).toISOString().split('T')[0];
    const selected = selectedDate.toISOString().split('T')[0];
    // Adjust for timezone if needed, but assuming simple date string match for now
    // Actually, let's be safer with local date comparison
    const d1 = new Date(app.date);
    const d2 = selectedDate;
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getDate() === d2.getDate();
  }).sort((a, b) => a.timeFrom.localeCompare(b.timeFrom));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
      case 'DONE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW': return 'Новая';
      case 'CONFIRMED': return 'Подтверждена';
      case 'DONE': return 'Выполнена';
      case 'CANCELED': return 'Отменена';
      default: return status;
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Управление записями</h2>
        <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-1 rounded-lg flex">
                <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setViewMode('list')}
                >
                Список
                </button>
                <button 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setViewMode('board')}
                >
                Доска
                </button>
            </div>
            <button 
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center gap-2 shadow-sm transition-all"
            onClick={() => setAppointmentModal({
                isOpen: true,
                mode: 'create',
                data: {
                clientName: '',
                clientPhone: '',
                serviceId: '',
                staffId: '',
                date: selectedDate.toISOString().split('T')[0],
                timeFrom: '10:00',
                commentFromClient: ''
                }
            })}
            >
            <Plus className="w-4 h-4" />
            Новая запись
            </button>
        </div>
      </div>

      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 ${viewMode === 'board' ? '' : ''}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-md border border-gray-200 shadow-sm">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
              </div>
              <input 
                  type="date" 
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                      if(e.target.value) setSelectedDate(new Date(e.target.value));
                  }}
                  className="bg-transparent font-medium text-gray-900 outline-none cursor-pointer"
              />
           </div>
           <div className="text-sm text-gray-500 font-medium">
              {filteredAppointments.length} {filteredAppointments.length === 1 ? 'запись' : filteredAppointments.length >= 2 && filteredAppointments.length <= 4 ? 'записи' : 'записей'}
           </div>
        </div>

        {viewMode === 'list' ? (
            <div className="divide-y divide-gray-100">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((app) => (
                    <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex gap-6">
                            {/* Time Column */}
                            <div className="w-20 flex-shrink-0 flex flex-col items-center pt-1">
                                <span className="text-lg font-bold text-gray-900">
                                    {new Date(app.timeFrom).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <div className="h-full w-px bg-gray-200 my-2 group-last:hidden"></div>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                {/* Status Stripe */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                    app.status === 'CONFIRMED' ? 'bg-green-500' :
                                    app.status === 'NEW' ? 'bg-blue-500' :
                                    app.status === 'DONE' ? 'bg-gray-500' :
                                    'bg-red-500'
                                }`}></div>

                                <div className="pl-3">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{app.clientName}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {app.clientPhone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Scissors className="w-3 h-3" />
                                                    {app.service?.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                            {getStatusLabel(app.status)}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                        <div className="text-sm text-gray-500">
                                            {app.staff ? (
                                                <span className="flex items-center gap-1">
                                                    Мастер: <span className="font-medium text-gray-700">{app.staff.name}</span>
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">Любой мастер</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {app.status === 'NEW' && (
                                                <button 
                                                    onClick={() => openConfirm(app.id, 'CONFIRMED')}
                                                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 font-medium"
                                                >
                                                    Подтвердить
                                                </button>
                                            )}
                                            {app.status === 'CONFIRMED' && (
                                                <button 
                                                    onClick={() => openConfirm(app.id, 'DONE')}
                                                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 font-medium"
                                                >
                                                    Выполнено
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleSelectEvent({ type: 'APPOINTMENT', resource: app })}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteAppointment(app.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="py-20 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Нет записей</h3>
                        <p className="text-gray-500 mt-1">На выбранную дату записей не найдено</p>
                        <button 
                            onClick={() => setAppointmentModal({
                                isOpen: true,
                                mode: 'create',
                                data: {
                                    clientName: '',
                                    clientPhone: '',
                                    serviceId: '',
                                    staffId: '',
                                    date: selectedDate.toISOString().split('T')[0],
                                    timeFrom: '10:00',
                                    commentFromClient: ''
                                }
                            })}
                            className="mt-4 text-primary font-medium hover:underline"
                        >
                            Создать первую запись
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <div className="bg-gray-50 p-6">
                <div className="flex gap-6 overflow-x-auto pb-4" style={{minHeight: '600px'}}>
                    {['NEW', 'CONFIRMED', 'DONE', 'CANCELED'].map((status) => {
                        const statusApps = filteredAppointments.filter(a => a.status === status);
                        return (
                            <div key={status} className="flex-shrink-0 w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col" style={{height: '580px'}}>
                                {/* Column Header */}
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-xl flex-shrink-0">
                                    <div className="flex items-center gap-2 font-bold text-gray-700">
                                        <div className={`w-2.5 h-2.5 rounded-full ${
                                            status === 'NEW' ? 'bg-blue-500' :
                                            status === 'CONFIRMED' ? 'bg-green-500' :
                                            status === 'DONE' ? 'bg-gray-500' :
                                            'bg-red-500'
                                        }`} />
                                        {getStatusLabel(status)}
                                    </div>
                                    <span className="bg-white text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200">
                                        {statusApps.length}
                                    </span>
                                </div>

                                {/* Cards Area */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{scrollbarWidth: 'thin'}}>
                                    {statusApps.map(app => (
                                        <div 
                                            key={app.id} 
                                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                                            onClick={() => handleSelectEvent({ type: 'APPOINTMENT', resource: app })}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-gray-900 text-lg">
                                                    {new Date(app.timeFrom).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteAppointment(app.id); }}
                                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="mb-3">
                                                <div className="font-semibold text-gray-900 truncate">{app.clientName}</div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <Scissors className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{app.service?.name}</span>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <User className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{app.staff?.name || 'Любой мастер'}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-end pt-3 border-t border-gray-100 gap-2">
                                                {status === 'NEW' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); openConfirm(app.id, 'CONFIRMED'); }}
                                                        className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 font-medium border border-green-200"
                                                    >
                                                        Подтвердить
                                                    </button>
                                                )}
                                                {status === 'CONFIRMED' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); openConfirm(app.id, 'DONE'); }}
                                                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 font-medium border border-blue-200"
                                                    >
                                                        Выполнено
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {statusApps.length === 0 && (
                                        <div className="h-32 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                                            <CalendarIcon className="w-6 h-6 text-gray-300 mb-2" />
                                            <span className="text-sm font-medium">Нет записей</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>

      {/* Appointment Modal (Create/Edit) */}
      <Modal
        isOpen={appointmentModal.isOpen}
        onClose={() => setAppointmentModal({ ...appointmentModal, isOpen: false })}
        title={appointmentModal.mode === 'create' ? 'Новая запись' : 'Редактирование записи'}
        footer={null}
      >
        <form onSubmit={handleSaveAppointment} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя клиента</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={appointmentModal.data.clientName}
                onChange={e => setAppointmentModal({
                  ...appointmentModal,
                  data: { ...appointmentModal.data, clientName: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Телефон</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={appointmentModal.data.clientPhone}
                onChange={e => setAppointmentModal({
                  ...appointmentModal,
                  data: { ...appointmentModal.data, clientPhone: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Дата</label>
              <input
                type="date"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={appointmentModal.data.date}
                onChange={e => setAppointmentModal({
                  ...appointmentModal,
                  data: { ...appointmentModal.data, date: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Время</label>
              <input
                type="time"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={appointmentModal.data.timeFrom}
                onChange={e => setAppointmentModal({
                  ...appointmentModal,
                  data: { ...appointmentModal.data, timeFrom: e.target.value }
                })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Услуга</label>
            <select
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={appointmentModal.data.serviceId}
              onChange={e => setAppointmentModal({
                ...appointmentModal,
                data: { ...appointmentModal.data, serviceId: e.target.value }
              })}
            >
              <option value="">Выберите услугу...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} мин) - {s.price} ₽</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Мастер (необязательно)</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={appointmentModal.data.staffId}
              onChange={e => setAppointmentModal({
                ...appointmentModal,
                data: { ...appointmentModal.data, staffId: e.target.value }
              })}
            >
              <option value="">Любой мастер</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.specialization?.name})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Комментарий</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={appointmentModal.data.commentFromClient}
              onChange={e => setAppointmentModal({
                ...appointmentModal,
                data: { ...appointmentModal.data, commentFromClient: e.target.value }
              })}
            />
          </div>

          {appointmentModal.mode === 'edit' && (
             <div>
                <label className="block text-sm font-medium text-gray-700">Статус</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={appointmentModal.data.status}
                  onChange={e => setAppointmentModal({
                    ...appointmentModal,
                    data: { ...appointmentModal.data, status: e.target.value }
                  })}
                >
                  <option value="NEW">Новая</option>
                  <option value="CONFIRMED">Подтверждена</option>
                  <option value="DONE">Выполнена</option>
                  <option value="CANCELED">Отменена</option>
                </select>
             </div>
          )}

          <div className="flex justify-between pt-4">
            {appointmentModal.mode === 'edit' ? (
              <button
                type="button"
                onClick={() => handleDeleteAppointment()}
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Удалить
              </button>
            ) : <div></div>}
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setAppointmentModal({ ...appointmentModal, isOpen: false })}
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
          </div>
        </form>
      </Modal>

      {/* Status Confirmation Modal */}
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
