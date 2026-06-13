import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { FocusSession } from '@/types';

type FocusStore = {
  currentSession: Partial<FocusSession> | null;
  isActive: boolean;
  timeLeft: number;
  mode: 'work' | 'break';
  sessionsCompletedToday: number;

  startSession: (type: FocusSession['session_type'], duration: number, taskId?: string, moodBefore?: number) => void;
  resetSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: (completed: boolean, moodAfter?: number) => Promise<void>;
  tick: () => void;
  settimeLeft: (time: number) => void;
  fetchSessionsCompletedToday: () => Promise<void>;
  canStartSession: () => Promise<boolean>;
};

export const useFocusStore = create<FocusStore>((set, get) => ({
  currentSession: null,
  isActive: false,
  timeLeft: 15 * 60,
  mode: 'work',
  sessionsCompletedToday: 0,

  resetSession: () => {
    console.log("resetSession called");
    set({
      currentSession: null,
      isActive: false,
      timeLeft: 15 * 60,
      mode: 'work',
    });
  },

  canStartSession: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase.rpc('can_start_session', { p_user_id: user.id });
    if (error) {
      console.error('Error calling can_start_session:', error);
      return false;
    }
    return data;
  },

  fetchSessionsCompletedToday: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
      .from('focus_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true)
      .gte('started_at', `${today}T00:00:00Z`);

    if (!error && count !== null) {
      set({ sessionsCompletedToday: count });
    }
  },

  startSession: (type, duration, taskId, moodBefore) => {
    set({
      currentSession: {
        session_type: type,
        planned_minutes: Math.floor(duration / 60),
        started_at: new Date().toISOString(),
        task_id: taskId,
        mood_before: moodBefore,
      },
      isActive: true,
      timeLeft: duration,
      mode: 'work',
    });
  },

  pauseSession: () => set({ isActive: false }),
  resumeSession: () => set({ isActive: true }),

  tick: () => {
    const { timeLeft, isActive } = get();
    if (isActive && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else if (isActive && timeLeft === 0) {
      set({ isActive: false }); // Stop the timer but don't call endSession yet
    }
  },

  settimeLeft: (time) => set({ timeLeft: time }),

  endSession: async (completed, moodAfter) => {
    const { currentSession, mode } = get();
    if (!currentSession) {
      console.log("No current session found");
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No user found");
      return;
    }

    // Use a fixed planned_minutes if it's already on currentSession
    const plannedMinutes = currentSession.planned_minutes || 0;
    const actualMinutes = completed ? plannedMinutes : 0; 

    const sessionData = {
      ...currentSession,
      user_id: user.id,
      actual_minutes: actualMinutes,
      completed,
      mood_after: moodAfter,
      ended_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('focus_sessions').insert([sessionData]);

    if (!error && completed) {
      set((state) => ({ sessionsCompletedToday: state.sessionsCompletedToday + 1 }));
    }

    // Logic: Only go to break if it was a Pomodoro work session
    const isPomodoro = currentSession.session_type === 'pomodoro';
    
    set({
      currentSession: null,
      isActive: false,
      timeLeft: (isPomodoro && mode === 'work') ? 5 * 60 : 15 * 60,
      mode: (isPomodoro && mode === 'work') ? 'break' : 'work',
    });
  },
}));
