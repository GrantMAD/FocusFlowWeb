import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

type AuthStore = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ data: Profile | null; error: any }>;
  completeOnboardingStep: (stepId: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),
  setSession: (session) => set({ session, user: session?.user ?? null, isLoading: false }),
  setProfile: (profile) => set({ profile }),

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) set({ profile: data });
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { user, profile } = get();
    if (!user) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      set({ profile: data });
    }
    return { data, error };
  },

  completeOnboardingStep: async (stepId: string) => {
    const { user, profile } = get();
    if (!user || !profile) return;

    const currentProgress = (profile as any).onboarding_progress || {};
    if (currentProgress[stepId]) return;

    const newProgress = { ...currentProgress, [stepId]: true };
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update({ onboarding_progress: newProgress })
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      set({ profile: data });
    }
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },
}));
