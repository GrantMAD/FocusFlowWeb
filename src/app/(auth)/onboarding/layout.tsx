'use client';

import { usePathname } from 'next/navigation';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const step = parseInt(pathname.split('-').pop() || '1');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-purple-600">FocusFlow</h1>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full ${
                i <= step ? 'bg-purple-600' : 'bg-gray-100'
              }`}
            />
          ))}
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
