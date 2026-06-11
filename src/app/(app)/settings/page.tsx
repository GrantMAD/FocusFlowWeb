'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useSubscription } from '@/hooks/useSubscription';
import { User, Bell, Palette, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'appearance'>('profile');
  const { profile } = useAuthStore();
  const { isPro, status } = useSubscription();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </header>

      <div className="flex gap-8">
        <aside className="w-48 flex flex-col gap-1">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'billing', label: 'Subscription', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" defaultValue={profile?.full_name} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" disabled value="user@example.com" className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg outline-none text-gray-500" />
                  </div>
                </div>
              </div>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription Plan</h3>
              <div className={`p-6 rounded-xl border-2 ${isPro ? 'border-purple-600 bg-purple-50' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Plan</p>
                    <p className="text-2xl font-black text-gray-900">{isPro ? 'FocusFlow Pro' : 'Free Tier'}</p>
                  </div>
                  {isPro && (
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">ACTIVE</span>
                  )}
                </div>
                
                {isPro ? (
                  <button className="text-purple-600 font-bold text-sm hover:underline">Manage Subscription</button>
                ) : (
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all">
                    Upgrade to Pro
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {['Light', 'Dark', 'System'].map((t) => (
                  <button key={t} className="p-4 rounded-xl border-2 border-gray-100 hover:border-purple-200 font-bold text-sm text-gray-700">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
