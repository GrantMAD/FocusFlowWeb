'use client';

import { X, BookOpen, Sun, Zap, Brain, Moon, Info } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SECTIONS = [
  {
    title: 'Morning Rituals',
    icon: Sun,
    color: 'text-emerald-500',
    text: 'ADHD brains often struggle with "starting friction." A consistent morning ritual signals to your brain that the workday has begun, reducing the cognitive load of deciding what to do first.'
  },
  {
    title: 'Body Doubling',
    icon: Zap,
    color: 'text-purple-500',
    text: 'Working alongside a "simulated partner" provides a social anchor. This psychological presence helps maintain focus and prevents the mind from wandering during deep work sessions.'
  },
  {
    title: 'Brain Dumping',
    icon: Brain,
    color: 'text-indigo-500',
    text: 'Working memory is often limited in ADHD. Externalizing thoughts into the Brain Dump clears "mental RAM," allowing you to focus entirely on the current task without fear of forgetting others.'
  },
  {
    title: 'Evening Reflection',
    icon: Moon,
    color: 'text-orange-500',
    text: 'Celebrating small wins is crucial for dopamine regulation. Reflecting on your day helps close the loop and prepares your mind for restful sleep by offloading lingering stress.'
  }
];

export default function HelpDocumentationModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="grad-primary p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black">FocusFlow Guide</h2>
              <p className="text-purple-100 font-medium italic">Understanding your ADHD-friendly toolkit.</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 space-y-8">
          <div className="grid gap-6">
            {SECTIONS.map((section, i) => (
              <div key={i} className="flex gap-6 group">
                <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <section.icon className={`w-6 h-6 ${section.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 mb-2">{section.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-800 flex gap-4">
            <Info className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
              <span className="font-bold block mb-1 uppercase tracking-wider">Pro Tip: Keyboard Shortcuts</span>
              Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono shadow-sm">Q</kbd> anywhere to open the Brain Dump, and <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border rounded font-mono shadow-sm">N</kbd> on the Tasks page to add a new objective.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Got it, thanks!
          </button>
        </footer>
      </div>
    </div>
  );
}
