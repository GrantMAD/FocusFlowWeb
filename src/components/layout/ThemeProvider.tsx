'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuthStore();
  const theme = profile?.theme || 'system';

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old classes
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      root.style.colorScheme = systemTheme;
    } else {
      root.classList.add(theme);
      root.style.colorScheme = theme;
    }
  }, [theme]);

  // Handle system theme changes if set to 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      const newTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.add(newTheme);
      root.style.colorScheme = newTheme;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return <>{children}</>;
}
