import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { FocusSession } from '@/types';

type FocusStore = {
  currentSession: Partial<FocusSession> | null;
  isActive: boolean;
  timeLeft: number;
  mode: 'work' | 'break';
  sessionsCompletedToday: number;
  
  startSession: (type: FocusSession['session_type'], duration: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: (completed: boolean) => Promise<void>;
  tick: () => void;
  settimeLeft: (time: number) => void;
};

export const useFocusStore = create<FocusStore>((set, get) => ({
  currentSession: null,
  isActive: false,
  timeLeft: 25 * 60,
  mode: 'work',
  sessionsCompletedToday: 0,

  startSession: (type, duration) => {
    set({
      currentSession: {
        session_type: type,
        planned_minutes: Math.floor(duration / 60),
        started_at: new Date().toISOString(),
      },
      isActive: true,
      timeLeft: duration,
      mode: 'work',
    });
  },

  pauseSession: () => set({ isActive: false }),
  resumeSession: () => set({ isActive: true }),

  tick: () => {
    const { timeLeft, isActive, endSession } = get();
    if (isActive && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else if (isActive && timeLeft === 0) {
      endSession(true);
    }
  },

  settimeLeft: (time) => set({ timeLeft: time }),

  endSession: async (completed) => {
    const { currentSession, timeLeft, mode } = get();
    if (!currentSession) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const actualMinutes = Math.floor((currentSession.planned_minutes! * 60 - timeLeft) / 60);

    const { error } = await supabase.from('focus_sessions').insert([
      {
        ...currentSession,
        user_id: user.id,
        actual_minutes: actualMinutes,
        completed,
        ended_at: new Date().toISOString(),
      },
    ]);

    if (!error && completed) {
      set((state) => ({ sessionsCompletedToday: state.sessionsCompletedToday + 1 }));
    }

    set({
      currentSession: null,
      isActive: false,
      timeLeft: mode === 'work' ? 5 * 60 : 25 * 60, // Simple reset logic
      mode: mode === 'work' ? 'break' : 'work',
    });
  },
}));
