export type User = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  diagnosis_status: 'diagnosed' | 'self_identified' | 'exploring';
  primary_struggles: string[];
  primary_goals: string[];
  notification_preferences: NotificationPreferences;
  theme: 'light' | 'dark' | 'system';
  focus_work_duration: number;
  focus_break_duration: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type NotificationPreferences = {
  morning_ritual: boolean;
  morning_ritual_time: string;
  evening_reflection: boolean;
  evening_reflection_time: string;
  focus_reminders: boolean;
  medication_reminder: boolean;
  medication_time: string | null;
  streak_alerts: boolean;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  priority: 'now' | 'next' | 'later' | 'brain_dump';
  status: 'pending' | 'completed' | 'skipped';
  is_daily_priority: boolean;
  daily_priority_date: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  chunks: TaskChunk[];
  completed_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskChunk = {
  id: string;
  title: string;
  completed: boolean;
};

export type FocusSession = {
  id: string;
  user_id: string;
  task_id: string | null;
  session_type: 'pomodoro' | 'body_doubling' | 'deep_work' | 'custom';
  planned_minutes: number;
  actual_minutes: number;
  completed: boolean;
  ambient_sound: string | null;
  interruptions: number;
  mood_before: number | null;
  mood_after: number | null;
  started_at: string;
  ended_at: string | null;
};

export type Streak = {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
  grace_period_used: boolean;
  total_focus_minutes: number;
  total_tasks_completed: number;
};

export type Subscription = {
  id: string;
  user_id: string;
  status: 'free' | 'trial' | 'active' | 'cancelled' | 'expired' | 'lifetime';
  plan: 'monthly' | 'annual' | 'lifetime' | null;
  payment_source: 'revenuecat' | 'stripe' | null;
  current_period_ends_at: string | null;
  trial_ends_at: string | null;
};

export type BrainDumpItem = {
  id: string;
  user_id: string;
  content: string;
  date: string;
  converted_to_task_id: string | null;
  created_at: string;
};
