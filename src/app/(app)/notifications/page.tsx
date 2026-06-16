'use client';

import { useEffect } from 'react';
import { 
  Bell, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  Zap,
  Info 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const router = useRouter();
  const { 
    notifications, 
    isLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'task': return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'streak': return <Zap className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-6 h-6 text-gray-500" />
          </button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Notifications</h1>
        </div>
        
        {notifications.some(n => !n.is_read) && (
          <button onClick={() => markAllAsRead()} className="text-purple-600 dark:text-purple-400 font-bold text-xs uppercase hover:underline">
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {isLoading && notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">No notifications</div>
        ) : (
          notifications.map((item) => (
            <div 
              key={item.id}
              className={`p-5 rounded-3xl border flex items-start gap-4 transition-colors ${
                item.is_read 
                  ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800' 
                  : 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20'
              }`}
            >
              <div className={`p-3 rounded-2xl ${item.is_read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className={`font-black text-sm truncate ${
                    item.is_read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                  }`}>
                    {item.title}
                  </p>
                  {!item.is_read && <span className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{item.message}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </p>
              </div>

              <button 
                onClick={() => deleteNotification(item.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                <Trash2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
