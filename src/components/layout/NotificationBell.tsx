'use client';

import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Calendar, Zap, Info } from 'lucide-react';
import { useNotificationStore } from '@/stores/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, fetchNotifications, subscribeToNotifications } = useNotificationStore();
  
  // This would be triggered by auth state, but for simplicity we'll assume it runs once mounted
  useEffect(() => {
    const initNotifications = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        fetchNotifications();
        subscribeToNotifications(user.id);
      }
    };
    initNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'task': return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'streak': return <Zap className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 origin-top-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl z-[100] overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notifications</span>
            <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No new notifications</div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <button 
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                    setIsOpen(false);
                    if (n.link) router.push(n.link);
                  }}
                  className={`w-full p-4 text-left border-b border-gray-50 dark:border-gray-800 flex gap-3 ${!n.is_read ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`}
                >
                  <div className="mt-1">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                  </div>
                </button>
              ))
            )}
          </div>
          
          <button 
            onClick={() => { setIsOpen(false); router.push('/notifications'); }}
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 text-purple-600 dark:text-purple-400 text-xs font-black uppercase text-center"
          >
            Show All Notifications
          </button>
        </div>
      )}
    </div>
  );
}
