"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
      toast.error('Ошибка загрузки отзывов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      toast.success('Статус обновлен');
      fetchReviews();
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const openDeleteReview = (id: string) => setConfirmModal({ isOpen: true, id });
  const closeConfirm = () => setConfirmModal({ isOpen: false, id: null });

  const handleDelete = async () => {
    if (!confirmModal.id) return;
    try {
      await api.delete(`/reviews/${confirmModal.id}`);
      toast.success('Отзыв удален');
      fetchReviews();
      closeConfirm();
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Отзывы</h2>
      
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">Нет отзывов</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold mr-2">{review.clientName}</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                  {review.staff && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Мастер: {review.staff.name})
                    </span>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  review.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                  review.status === 'HIDDEN' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {review.status === 'APPROVED' ? 'Одобрен' : 
                   review.status === 'HIDDEN' ? 'Скрыт' : 'На проверке'}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{review.text}</p>
              <div className="flex space-x-3">
                {review.status === 'PENDING' && (
                  <button 
                    onClick={() => updateStatus(review.id, 'APPROVED')}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Одобрить
                  </button>
                )}
                {review.status !== 'HIDDEN' && (
                  <button 
                    onClick={() => updateStatus(review.id, 'HIDDEN')}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    Скрыть
                  </button>
                )}
                {review.status === 'HIDDEN' && (
                  <button 
                    onClick={() => updateStatus(review.id, 'APPROVED')}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Восстановить
                  </button>
                )}
                <button 
                  onClick={() => openDeleteReview(review.id)}
                  className="text-sm text-red-600 hover:underline ml-auto"
                >
                  Удалить навсегда
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        title="Удалить отзыв?"
        footer={
          <>
            <button
              onClick={closeConfirm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Отмена
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Удалить
            </button>
          </>
        }
      >
        <p>Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
}
