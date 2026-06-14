'use client';

import { useState } from 'react';
import { HelpCircle, X, MessageCircle, RefreshCcw, ExternalLink, Lightbulb, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import HelpDocumentationModal from './HelpDocumentationModal';

const QUICK_TIPS = [
  { title: "Avoid Burnout", text: "ADHD brains focus better with frequent short breaks. Try the 15/5 Pomodoro." },
  { title: "Clear the Fog", text: "If you feel overwhelmed, use the Brain Dump (press 'Q') to clear your mind." },
  { title: "Start Small", text: "Break your main task into 3 tiny subtasks using the List icon on any task." },
  { title: "Sound Anchors", text: "Brown noise is often better than music for staying anchored to a task." },
];

export default function UniversalHelpFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const router = useRouter();

  const handleRestartOnboarding = () => {
    router.push('/onboarding/step-1');
    setIsOpen(false);
    toast.info("Restarting your onboarding journey.");
  };

  const handleOpenDocs = () => {
    setShowDocs(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100]">
        {/* Floating Menu */}
        {isOpen && (
          <div className="absolute bottom-20 right-0 w-80 glass-card rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <header className="grad-primary p-6 text-white">
              <h3 className="text-lg font-black flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                FocusFlow Guide
              </h3>
              <p className="text-xs text-purple-100 mt-1">Quick tips and assistance for your journey.</p>
            </header>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-auto text-left">
              {/* Quick Tips Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Lightbulb className="w-3 h-3" />
                  ADHD Focus Tips
                </h4>
                <div className="grid gap-3">
                  {QUICK_TIPS.map((tip, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 group hover:border-purple-200 transition-all">
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-1">{tip.title}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
                <button 
                  onClick={handleRestartOnboarding}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 rounded-xl transition-all"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Restart Onboarding
                </button>
                <button 
                  onClick={handleOpenDocs}
                  className="w-full flex items-center gap-3 p-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 rounded-xl transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Help Documentation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-gray-900 text-white rotate-180' : 'grad-primary text-white'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
        </button>
      </div>

      <HelpDocumentationModal isOpen={showDocs} onClose={() => setShowDocs(false)} />
    </>
  );
}
