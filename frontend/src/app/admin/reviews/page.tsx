"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  review.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                  review.status === 'HIDDEN' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {review.status}
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
                    className="text-sm text-red-600 hover:underline"
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
