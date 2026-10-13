import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Calculator, 
  PieChart, 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PitchWizard from './components/PitchWizard';
import PitchArenaGame from './components/PitchArenaGame';
import MultiplierComparator from './components/MultiplierComparator';
import AcademyView from './components/AcademyView';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [industries, setIndustries] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [modules, setModules] = useState([]);
  const [recentPitches, setRecentPitches] = useState([]);
  const [stats, setStats] = useState(null);
  const [userXp, setUserXp] = useState(() => {
    const saved = localStorage.getItem('valuetank_xp');
    return saved ? parseInt(saved, 10) : 150;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('valuetank_theme') || 'system';
  });

  useEffect(() => {
    localStorage.setItem('valuetank_xp', userXp.toString());
  }, [userXp]);

  // Synchronize Theme (Light, Dark, System)
  useEffect(() => {
    localStorage.setItem('valuetank_theme', theme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) {
        meta.content = isDark ? 'dark' : 'light';
      }
    };

    applyTheme();

    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'valuetank_theme' && e.newValue) {
        setTheme(e.newValue);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [theme]);

  // Load Initial Data from Backend
  useEffect(() => {
    fetch('/api/initial-data')
      .then(res => res.json())
      .then(data => {
        setIndustries(data.industries || []);
        setChallenges(data.challenges || []);
        setModules(data.modules || []);
        setRecentPitches(data.recent_pitches || []);
        setStats(data.stats || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching initial data:', err);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleSavePitch = async (payload) => {
    const response = await fetch('/api/pitches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Error al guardar pitch');
    }

    const data = await response.json();
    setRecentPitches(prev => [data.pitch, ...prev]);
    // Refresh stats
    setStats(prev => prev ? {
      ...prev,
      total_pitches: prev.total_pitches + 1,
      [data.pitch.semaphore_status + '_count']: (prev[data.pitch.semaphore_status + '_count'] || 0) + 1
    } : null);

    return data;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-800 dark:text-white transition-colors duration-200">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 flex items-center justify-center animate-pulse mb-4">
          <Calculator className="text-emerald-500 dark:text-emerald-400 animate-spin" size={24} />
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Cargando ValuaTank Engine...</p>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">Conectando con Filament PHP</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userXp={userXp} 
        stats={stats} 
        theme={theme}
        setTheme={setTheme}
      />

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-sm">
            <Calculator size={18} />
          </div>
          <span className="font-black text-lg text-slate-900 dark:text-white">Valua<span className="text-emerald-500 dark:text-emerald-400">Tank</span></span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} setTheme={setTheme} compact={true} />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900 transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white dark:bg-slate-950 z-40 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200 border-b border-slate-200 dark:border-slate-800 overflow-y-auto">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 px-3 py-1">
              Tema de Pantalla
            </div>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>

          <div className="space-y-1 pt-2">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 px-3 py-1">
              Navegación
            </div>
            <button 
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-left font-bold text-sm transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              📊 Resumen & Pitch Radar
            </button>
            <button 
              onClick={() => { setActiveTab('wizard'); setMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-left font-bold text-sm transition-all ${
                activeTab === 'wizard' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              🧮 Motor de Valuación (4 Métodos)
            </button>
            <button 
              onClick={() => { setActiveTab('arena'); setMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-left font-bold text-sm transition-all ${
                activeTab === 'arena' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              🏆 Pitch Arena (Juego)
            </button>
            <button 
              onClick={() => { setActiveTab('comparator'); setMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-left font-bold text-sm transition-all ${
                activeTab === 'comparator' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              📈 Efecto Multiplicador
            </button>
            <button 
              onClick={() => { setActiveTab('academy'); setMobileMenuOpen(false); }}
              className={`w-full p-3 rounded-xl text-left font-bold text-sm transition-all ${
                activeTab === 'academy' 
                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              📖 El Código (Lecciones)
            </button>
          </div>
          
          <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4">
            <a 
              href="/admin" 
              className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
            >
              <span>Abrir FilamentPHP /admin</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}

      {/* Main App Content View */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 mt-16 lg:mt-0 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardView 
            stats={stats}
            industries={industries}
            recentPitches={recentPitches}
            setActiveTab={setActiveTab}
            userXp={userXp}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'wizard' && (
          <PitchWizard 
            industries={industries}
            onSavePitch={handleSavePitch}
            formatCurrency={formatCurrency}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'arena' && (
          <PitchArenaGame 
            challenges={challenges}
            userXp={userXp}
            setUserXp={setUserXp}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'comparator' && (
          <MultiplierComparator 
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === 'academy' && (
          <AcademyView 
            modules={modules}
          />
        )}
      </main>
    </div>
  );
}

// Mount React Root
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
