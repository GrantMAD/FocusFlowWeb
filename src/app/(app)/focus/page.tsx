'use client';

import { useEffect, useState } from 'react';
import { useFocusStore } from '@/stores/focusStore';
import { useTaskStore } from '@/stores/taskStore';
import { useSubscription } from '@/hooks/useSubscription';
import SessionTypeSelector from '@/components/focus/SessionTypeSelector';
import AmbientSoundPicker from '@/components/focus/AmbientSoundPicker';
import { Play, Pause, X, RotateCcw, Check, MessageSquare } from 'lucide-react';

const MOODS = [
  { value: 1, label: '😩' },
  { value: 2, label: '😕' },
  { value: 3, label: '😐' },
  { value: 4, label: '🙂' },
  { value: 5, label: '🤩' },
];

export default function FocusPage() {
  const { 
    isActive, 
    startSession, 
    resetSession,
    pauseSession, 
    resumeSession, 
    endSession, 
    timeLeft, 
    mode, 
    currentSession, 
    sessionsCompletedToday,
    fetchSessionsCompletedToday 
  } = useFocusStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { isPro } = useSubscription();

  const [showPreSession, setShowPreSession] = useState(false);
  const [showPostSession, setShowPostSession] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [moodBefore, setMoodBefore] = useState<number>(3);
  const [moodAfter, setMoodAfter] = useState<number>(3);

  useEffect(() => {
    fetchSessionsCompletedToday();
    fetchTasks();
    const timer = setInterval(() => {
      useFocusStore.getState().tick();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for session completion to show post-session modal and stop sound
  useEffect(() => {
    if (!isActive && currentSession && timeLeft === 0) {
      setShowPostSession(true);
      // Automatically stop any playing ambient sound when the timer ends
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('stop-ambient-sound');
        window.dispatchEvent(event);
      }
    }
  }, [isActive, currentSession, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [customDuration, setCustomDuration] = useState(25);
  const [isCustom, setIsCustom] = useState(false);

  // ... rest of the state ...

  const handleCustomSelect = () => {
    setIsCustom(true);
    setShowPreSession(true);
  };

  const handleStartClick = () => {
    if (!isPro && sessionsCompletedToday >= 3) {
      alert('You have reached your daily limit of 3 focus sessions. Upgrade to Pro for unlimited sessions!');
      return;
    }
    setIsCustom(false);
    setShowPreSession(true);
  };

  const handleStartSession = () => {
    const duration = isCustom ? customDuration * 60 : timeLeft;
    let type: 'pomodoro' | 'deep_work' | 'custom' = 'pomodoro';
    if (isCustom) type = 'custom';
    else if (timeLeft === 60 * 60) type = 'deep_work';
    
    startSession(type, duration, selectedTaskId || undefined, moodBefore);
    setShowPreSession(false);
  };

  const handleCompleteSession = async () => {
    await endSession(true, moodAfter);
    setShowPostSession(false);
    setMoodAfter(3);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-2xl w-full flex flex-col items-center gap-12">
        <header className="text-center">
          <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
            mode === 'work' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          }`}>
            {mode === 'work' ? 'Focus Time' : 'Break Time'}
          </span>
          <h1 className="mt-4 text-4xl font-black text-gray-900 dark:text-gray-100">
            {mode === 'work' ? 'Get into the flow' : 'Take a breather'}
          </h1>
          {!isPro && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
              Daily sessions: {sessionsCompletedToday} / 3
            </p>
          )}
        </header>

        <div className="relative flex flex-col items-center">
          <div className="text-[12rem] font-black tabular-nums text-gray-900 dark:text-gray-100 leading-none transition-colors">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex gap-4 mt-8">
            {!isActive ? (
              <button
                onClick={handleStartClick}
                className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-all shadow-xl hover:scale-105"
              >
                <Play className="w-10 h-10 fill-white" />
              </button>
            ) : (
              <button
                onClick={pauseSession}
                className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md"
              >
                <Pause className="w-10 h-10 fill-gray-900 dark:fill-gray-100" />
              </button>
            )}

            {(isActive || timeLeft !== 15 * 60) && (
              <button
                onClick={() => endSession(false)}
                className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 text-red-500 border-2 border-red-50 dark:border-red-900/30 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-md"
              >
                <X className="w-10 h-10" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <SessionTypeSelector onCustomSelect={handleCustomSelect} />
          <AmbientSoundPicker />
        </div>
      </div>

      {/* Pre-Session Modal */}
      {showPreSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200 transition-colors">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6">Setup Session</h2>
            
            <div className="space-y-6">
              {isCustom && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm transition-colors"
                    min="1"
                    max="120"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select a Task (Optional)</label>
                <select 
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm transition-colors"
                >
                  <option value="">No specific task</option>
                  {tasks.filter(t => t.status === 'pending').map(task => (
                    <option key={task.id} value={task.id}>{task.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">How are you feeling?</label>
                <div className="flex justify-between gap-2">
                  {MOODS.map(mood => (
                    <button
                      key={mood.value}
                      onClick={() => setMoodBefore(mood.value)}
                      className={`flex-1 aspect-square text-2xl rounded-xl border-2 transition-all ${
                        moodBefore === mood.value ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowPreSession(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleStartSession}
                  className="flex-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg"
                >
                  Start Focusing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post-Session Modal */}
      {showPostSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200 text-center transition-colors">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-2">Well Done!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Session complete. How do you feel now?</p>
            
            <div className="space-y-8">
              <div className="flex justify-between gap-2">
                {MOODS.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setMoodAfter(mood.value)}
                    className={`flex-1 aspect-square text-2xl rounded-xl border-2 transition-all ${
                      moodAfter === mood.value ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {mood.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleCompleteSession}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg"
              >
                Complete Reflection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
