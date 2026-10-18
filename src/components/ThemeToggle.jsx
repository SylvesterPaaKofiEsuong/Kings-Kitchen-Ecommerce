import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      className="flex items-center p-2 rounded-md hover:bg-muted/70 text-foreground transition-colors"
    >
      {dark ? (
        <Sun strokeWidth={1.5} className="h-[18px] w-[18px]" />
      ) : (
        <Moon strokeWidth={1.5} className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
