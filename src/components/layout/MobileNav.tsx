'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  Clock, 
  LayoutDashboard, 
  LineChart, 
  Settings 
} from 'lucide-react';

const navItems = [
  { label: 'Today', href: '/today', icon: LayoutDashboard },
  { label: 'Focus', href: '/focus', icon: Clock },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Progress', href: '/progress', icon: LineChart },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-6 py-3 z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
