'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useSubscription } from '@/hooks/useSubscription';
import { User, Bell, Palette, CreditCard, Save, Loader2, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import AvatarImage from '@/components/ui/AvatarImage';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'appearance'>('profile');
  const { profile, user, updateProfile } = useAuthStore();
  const { isPro, status } = useSubscription();

  const [fullName, setFullName] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isSaving, setIsSaving] = useState(false);

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setTheme(profile.theme || 'system');
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate type & size (max 2 MB)
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2 MB');
      return;
    }

    // Optimistic local preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setIsUploadingAvatar(true);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const filePath = `avatars/${user.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Add cache-bust so the browser fetches the new image
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: profileError } = await updateProfile({ avatar_url: publicUrl });
      if (profileError) throw profileError;

      setAvatarPreview(publicUrl);
      toast.success('Avatar updated!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload avatar');
      setAvatarPreview(profile?.avatar_url || null);
    } finally {
      setIsUploadingAvatar(false);
      URL.revokeObjectURL(objectUrl);
      // Reset file input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    setIsUploadingAvatar(true);
    try {
      const { error } = await updateProfile({ avatar_url: null });
      if (error) throw error;
      setAvatarPreview(null);
      toast.success('Avatar removed');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to remove avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

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

                {/* Avatar Upload */}
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-400 font-black text-2xl uppercase overflow-hidden">
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} fallback={displayName[0]} />
                      ) : (
                        <span>{displayName[0]}</span>
                      )}
                    </div>
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Photo</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">JPG, PNG or GIF · max 2 MB</p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50"
                      >
                        <Camera className="w-3 h-3" />
                        {avatarPreview ? 'Change' : 'Upload'}
                      </button>
                      {avatarPreview && (
                        <button
                          onClick={handleRemoveAvatar}
                          disabled={isUploadingAvatar}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-500 transition-all disabled:opacity-50"
                        >
                          <X className="w-3 h-3" />
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                    />
                  </div>
                </div>

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
