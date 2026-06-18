'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  Clock, 
  LayoutDashboard, 
  LineChart, 
  Settings, 
  LogOut 
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuthStore } from '@/stores/authStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';

const navItems = [
  { label: 'Today', href: '/today', icon: LayoutDashboard },
  { label: 'Focus', href: '/focus', icon: Clock },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Progress', href: '/progress', icon: LineChart },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, user, signOut } = useAuthStore();
  const { isPro } = useSubscriptionStore();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';

  return (
    <aside className="hidden md:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col transition-colors duration-300">
      <div className="p-6 flex items-center justify-start gap-4">
        <div className="flex items-center gap-2">
          <Image 
            src="/Images/FocusflowLogo.png" 
            alt="FocusFlow Logo" 
            width={40} 
            height={40} 
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-black text-grad">FocusFlow</h1>
        </div>
        <div className="ml-6">
          <NotificationBell />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isActive 
                  ? 'grad-primary text-white shadow-lg shadow-purple-200 dark:shadow-none scale-[1.02]' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Link 
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer text-left w-full block"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 font-bold uppercase shrink-0">
              {displayName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {displayName}
              </p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mt-0.5 ${
                isPro ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}>
                {isPro ? 'Pro' : 'Free'}
              </span>
            </div>
          </div>
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
