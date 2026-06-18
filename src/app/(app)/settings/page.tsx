'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useSubscription } from '@/hooks/useSubscription';
import { User, Bell, Palette, CreditCard, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'appearance'>('profile');
  const { profile, user, updateProfile } = useAuthStore();
  const { isPro, status } = useSubscription();

  const [fullName, setFullName] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setTheme(profile.theme || 'system');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({ full_name: fullName });
    
    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
    }
    setIsSaving(false);
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    const { error } = await updateProfile({ theme: newTheme });
    if (error) {
      toast.error('Failed to update theme preference');
    } else {
      toast.success(`Theme set to ${newTheme}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences and subscription.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-48 flex flex-col gap-1">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'billing', label: 'Subscription', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Your Profile</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your personal information and how you appear in FocusFlow.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input 
                      type="email" 
                      disabled 
                      value={user?.email || ''} 
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-lg outline-none text-gray-500 dark:text-gray-400 cursor-not-allowed transition-colors" 
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Subscription Plan</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your subscription and billing details.</p>
              </div>
              <div className={`p-6 rounded-xl border-2 transition-colors ${isPro ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-100 dark:border-gray-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Plan</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{isPro ? 'FocusFlow Pro' : 'Free Tier'}</p>
                  </div>
                  {isPro && (
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">ACTIVE</span>
                  )}
                </div>
                
                {isPro ? (
                  <button className="text-purple-600 dark:text-purple-400 font-bold text-sm hover:underline">Manage Subscription</button>
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
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Theme</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4">
                  Theme changes are saved to your profile and apply instantly across the app.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button 
                    key={t} 
                    onClick={() => handleThemeChange(t)}
                    className={`p-4 rounded-xl border-2 transition-all font-bold text-sm capitalize ${
                      theme === t 
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                        : 'border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-400 hover:border-purple-200 dark:hover:border-purple-800'
                    }`}
                  >
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
