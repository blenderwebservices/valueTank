import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle({ theme, setTheme, compact = false, className = '' }) {
  const options = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Oscuro', icon: Moon },
    { id: 'system', label: 'Sistema', icon: Monitor },
  ];

  if (compact) {
    return (
      <div 
        className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${className}`}
        role="group"
        aria-label="Selector de tema"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              title={`Tema ${opt.label}`}
              aria-label={`Tema ${opt.label}`}
              aria-pressed={isActive}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div 
      className={`grid grid-cols-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 ${className}`}
      role="group"
      aria-label="Selector de tema"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            aria-pressed={isActive}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-700/60'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <Icon size={14} className={isActive ? 'text-emerald-500 dark:text-emerald-400' : ''} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
