import React from 'react';
import { 
  Calculator, 
  PieChart, 
  Trophy, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ activeTab, setActiveTab, userXp, stats, theme, setTheme }) {
  const getRank = (xp) => {
    if (xp >= 500) return { title: 'Tiburón Maestro', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (xp >= 300) return { title: 'Socio de Fondo VC', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (xp >= 150) return { title: 'Inversionista Ángel', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' };
    return { title: 'Analista Novato', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-200/60 dark:bg-slate-800/60 border-slate-300/50 dark:border-slate-700/50' };
  };

  const rank = getRank(userXp);

  return (
    <aside className="w-72 bg-white/95 dark:bg-slate-950/95 border-r border-slate-200 dark:border-slate-800/80 min-h-screen text-slate-700 dark:text-slate-300 flex flex-col hidden lg:flex select-none z-20 transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Calculator className="text-emerald-500 dark:text-emerald-400" size={22} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Valua<span className="text-emerald-500 dark:text-emerald-400">Tank</span></span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20">v2.0</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">El Código de la Valuación</p>
          </div>
        </div>
      </div>

      {/* Theme Switcher in Sidebar */}
      <div className="px-4 pt-4">
        <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 px-2 pb-1.5 flex items-center justify-between">
          <span>Modo de Tema</span>
          <span className="text-[10px] lowercase text-slate-400 font-normal">
            {theme === 'system' ? 'automático' : theme}
          </span>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      {/* Gamification Rank Card */}
      <div className="p-4 mx-4 my-4 rounded-xl border glass-panel">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award size={16} className={rank.color} />
            <span className={`text-xs font-bold ${rank.color}`}>{rank.title}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 dark:text-amber-400">
            <Flame size={14} className="fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
            <span>{userXp} XP</span>
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500" 
            style={{ width: `${Math.min(100, (userXp / 600) * 100)}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex justify-between">
          <span>Meta: Gran Tiburón</span>
          <span>{600 - userXp > 0 ? `${600 - userXp} XP para subir` : '¡Nivel Máximo!'}</span>
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex flex-col gap-1.5 flex-grow">
        <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 px-3 py-1">
          Navegación Principal
        </div>

        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
            activeTab === 'dashboard' 
              ? 'bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-500/15 dark:to-transparent text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500 shadow-sm font-semibold' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <PieChart size={18} className={activeTab === 'dashboard' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
          <span>Resumen & Pitch Radar</span>
        </button>

        <button 
          onClick={() => setActiveTab('wizard')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
            activeTab === 'wizard' 
              ? 'bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-500/15 dark:to-transparent text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500 shadow-sm font-semibold' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Calculator size={18} className={activeTab === 'wizard' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
          <div className="flex-1">
            <span className="block leading-tight">Motor de Valuación</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">4 Métodos & Semáforo</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
        </button>

        <button 
          onClick={() => setActiveTab('arena')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
            activeTab === 'arena' 
              ? 'bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-500/15 dark:to-transparent text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500 shadow-sm font-semibold' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Trophy size={18} className={activeTab === 'arena' ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'} />
          <div className="flex-1">
            <span className="block leading-tight">Pitch Arena (Juego)</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Retos Shark Tank</span>
          </div>
          <span className="text-[10px] font-bold bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20 dark:border-amber-500/30">+XP</span>
        </button>

        <button 
          onClick={() => setActiveTab('comparator')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
            activeTab === 'comparator' 
              ? 'bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-500/15 dark:to-transparent text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500 shadow-sm font-semibold' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp size={18} className={activeTab === 'comparator' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
          <span>Efecto Multiplicador</span>
        </button>

        <button 
          onClick={() => setActiveTab('academy')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left ${
            activeTab === 'academy' 
              ? 'bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-500/15 dark:to-transparent text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500 shadow-sm font-semibold' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen size={18} className={activeTab === 'academy' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
          <span>El Código (PDF & Guía)</span>
        </button>
      </nav>

      {/* Filament PHP Quick Access Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/40">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 flex flex-col gap-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-amber-500 dark:text-amber-400" />
              FilamentPHP Admin
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">v3.3</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Gestiona sectores, múltiplos, retos y valuaciones guardadas.
          </p>
          <a 
            href="/admin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-1 py-2 px-3 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all group"
          >
            <span>Abrir Panel /admin</span>
            <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </aside>
  );
}
