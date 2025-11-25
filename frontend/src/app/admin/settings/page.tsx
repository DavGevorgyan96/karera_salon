"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'website' | 'dictionaries'>('general');
  const [settings, setSettings] = useState<any>(null);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New inputs
  const [newSpecName, setNewSpecName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'SPEC' | 'CAT' | null;
    id: string | null; // For Spec ID or Category Name
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  const DEFAULT_SETTINGS = {
    contactPhone: '+7 (999) 123-45-67',
    contactAddress: 'Москва, ул. Красоты, д. 1',
    heroTitle: 'Салон красоты «КарЕра»',
    heroSubtitle: 'Салон красоты, где ваша карьера и внешний вид — в надёжных руках.',
    categories: []
  };

  const fetchData = async () => {
    try {
      const [settingsRes, specsRes] = await Promise.all([
        api.get('/settings'),
        api.get('/specializations')
      ]);
      
      const fetchedSettings = settingsRes.data || {};
      // Merge fetched settings with defaults to ensure inputs are populated
      setSettings({
        ...DEFAULT_SETTINGS,
        ...fetchedSettings,
        categories: fetchedSettings.categories || []
      });
      
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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/settings', settings);
      toast.success('Настройки сохранены');
    } catch (error) {
      toast.error('Ошибка при сохранении');
    }
  };

  // Specializations
  const handleAddSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecName.trim()) return;
    try {
      await api.post('/specializations', { name: newSpecName });
      setNewSpecName('');
      toast.success('Специализация добавлена');
      const res = await api.get('/specializations');
      setSpecializations(res.data);
    } catch (error) {
      toast.error('Ошибка добавления');
    }
  };

  const handleDeleteSpec = async () => {
    if (!confirmModal.id) return;
    try {
      await api.delete(`/specializations/${confirmModal.id}`);
      toast.success('Специализация удалена');
      const res = await api.get('/specializations');
      setSpecializations(res.data);
      setConfirmModal({ isOpen: false, type: null, id: null });
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  // Categories
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    const currentCategories = settings.categories || [];
    if (currentCategories.includes(newCategoryName)) {
      toast.error('Такая категория уже есть');
      return;
    }

    const updatedCategories = [...currentCategories, newCategoryName];
    const updatedSettings = { ...settings, categories: updatedCategories };
    
    try {
      await api.put('/settings', updatedSettings);
      setSettings(updatedSettings);
      setNewCategoryName('');
      toast.success('Категория добавлена');
    } catch (error) {
      toast.error('Ошибка добавления');
    }
  };

  const handleDeleteCategory = async () => {
    if (!confirmModal.id) return; // id here is the category name
    
    const updatedCategories = settings.categories.filter((c: string) => c !== confirmModal.id);
    const updatedSettings = { ...settings, categories: updatedCategories };

    try {
      await api.put('/settings', updatedSettings);
      setSettings(updatedSettings);
      toast.success('Категория удалена');
      setConfirmModal({ isOpen: false, type: null, id: null });
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Настройки</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'general' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('general')}
        >
          Контакты
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'website' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('website')}
        >
          Веб-сайт
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'dictionaries' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('dictionaries')}
        >
          Справочники
        </button>
      </div>
      
      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Общие настройки</h3>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded" 
                value={settings?.contactPhone || ''}
                onChange={e => setSettings({...settings, contactPhone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded" 
                value={settings?.contactAddress || ''}
                onChange={e => setSettings({...settings, contactAddress: e.target.value})}
              />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90">
              Сохранить
            </button>
          </form>
        </div>
      )}

      {/* Website Settings Tab */}
      {activeTab === 'website' && (
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Настройки главной страницы</h3>
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок (Hero Title)</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded" 
                value={settings?.heroTitle || ''}
                onChange={e => setSettings({...settings, heroTitle: e.target.value})}
                placeholder="Например: Ваш путь к здоровью"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Подзаголовок (Hero Subtitle)</label>
              <textarea 
                className="w-full border p-2 rounded h-24" 
                value={settings?.heroSubtitle || ''}
                onChange={e => setSettings({...settings, heroSubtitle: e.target.value})}
                placeholder="Например: Профессиональная медицинская помощь..."
              />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90">
              Сохранить
            </button>
          </form>
        </div>
      )}

      {/* Dictionaries Tab */}
      {activeTab === 'dictionaries' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Specializations */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Специализации</h3>
            <form onSubmit={handleAddSpec} className="flex gap-2 mb-4">
              <input 
                type="text" 
                className="flex-1 border p-2 rounded" 
                placeholder="Новая специализация"
                value={newSpecName}
                onChange={e => setNewSpecName(e.target.value)}
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+</button>
            </form>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {specializations.map(s => (
                <li key={s.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{s.name}</span>
                  <button 
                    onClick={() => setConfirmModal({ isOpen: true, type: 'SPEC', id: s.id })}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Категории услуг</h3>
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
              <input 
                type="text" 
                className="flex-1 border p-2 rounded" 
                placeholder="Новая категория"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+</button>
            </form>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {(settings?.categories || []).map((c: string) => (
                <li key={c} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{c}</span>
                  <button 
                    onClick={() => setConfirmModal({ isOpen: true, type: 'CAT', id: c })}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, id: null })}
        title="Подтверждение удаления"
        footer={
          <>
            <button
              onClick={() => setConfirmModal({ isOpen: false, type: null, id: null })}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Отмена
            </button>
            <button
              onClick={confirmModal.type === 'SPEC' ? handleDeleteSpec : handleDeleteCategory}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Удалить
            </button>
          </>
        }
      >
        <p>Вы уверены, что хотите удалить {confirmModal.type === 'SPEC' ? 'специализацию' : 'категорию'}?</p>
      </Modal>
    </div>
  );
}
