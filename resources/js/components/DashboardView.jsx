import React from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Sparkles,
  Layers,
  Award
} from 'lucide-react';

export default function DashboardView({ 
  stats, 
  industries, 
  recentPitches, 
  setActiveTab, 
  userXp,
  formatCurrency 
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200 dark:border-emerald-500/20 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/40 p-8 md:p-10 shadow-lg dark:shadow-2xl transition-colors duration-200">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-4">
              <Sparkles size={14} />
              <span>Simulador Financiero & Pitch Arena</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Domina tus números y <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                defiende tu valor en el Tanque
              </span>
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
              Basado en <span className="text-emerald-700 dark:text-emerald-300 font-semibold">El Código de la Valuación</span>. Descubre tu valuación implícita, sométete al semáforo de los inversionistas y negocia antes de entrar frente a los tiburones.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('wizard')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calculator size={18} />
                <span>Iniciar Valuación de mi Pitch</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setActiveTab('arena')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700/80 transition-all"
              >
                <Award size={18} className="text-amber-500 dark:text-amber-400" />
                <span>Jugar Pitch Arena (+XP)</span>
              </button>
            </div>
          </div>

          {/* Quick Formula Card */}
          <div className="w-full md:w-80 glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 shadow-xl">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-2 flex items-center justify-between">
              <span>Sombra Matemática</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded">Fórmula Clave</span>
            </div>
            <div className="bg-white/80 dark:bg-slate-950/80 rounded-xl p-4 border border-slate-200 dark:border-slate-800 font-mono text-center mb-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Valuación Implícita =</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">Monto Solicitado</p>
              <div className="w-24 h-0.5 bg-emerald-500/60 mx-auto my-1"></div>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">% Equity Ofrecido</p>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
              Ejemplo: $1,000,000 MXN por el 10% = <strong className="text-slate-900 dark:text-white">$10,000,000 MXN</strong> de valuación total exigida.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pitches Analizados</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Layers size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
            {stats?.total_pitches || 1}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">En base de datos Filament</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 relative overflow-hidden bg-gradient-to-b from-emerald-500/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">🟢 Justas o Atractivas</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
            {stats?.green_count || 1}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Respaldadas por métricas</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-amber-500/20 relative overflow-hidden bg-gradient-to-b from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">🟡 Ambiciosas</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mb-1">
            {stats?.yellow_count || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Exigen foso defensivo o retención</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-rose-500/20 relative overflow-hidden bg-gradient-to-b from-rose-500/5 to-transparent">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">🔴 Pretenciosas</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mb-1">
            {stats?.red_count || 0}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Desconectadas de la realidad</p>
        </div>
      </div>

      {/* Two Column Layout: Sectors & Multiples + Core Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Industry Multiples Reference (Page 4 of PDF) */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="text-emerald-500 dark:text-emerald-400" size={20} />
                Múltiplos de Mercado por Industria
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                El factor promedio al que se venden empresas en cada sector (Base real para Shark Tank).
              </p>
            </div>
            <a 
              href="/admin/industries" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <span>Editar en Filament</span>
              <ArrowRight size={12} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {industries.map((ind) => (
              <div 
                key={ind.id} 
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/95 shadow-xs"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{ind.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {ind.default_ebitda_multiple}x EBITDA
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {ind.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2 font-mono">
                  <span>Ventas: ~{ind.default_revenue_multiple}x</span>
                  <span>Margen Bruto: ~{ind.typical_gross_margin}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Founder Checklist from Page 15 */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-4 border border-blue-500/20">
              <ShieldCheck size={14} />
              <span>Checklist Definitivo del Founder</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Los 4 Pasos Obligatorios antes del Pitch
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Conoce tu sombra matemática</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Divide el capital entre el equity ofrecido. Apréndete tu valuación implícita de memoria.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Respalda con la ciencia adecuada</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Alinea tu etapa con el método formal (Múltiplos, DCF, Activos en Libros o Método VC).</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Domina la eficiencia operativa</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Márgenes altos, CAC controlado y deuda cero justifican un múltiplo premium.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Ficha a tu escuadrón</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Un mentor (founder exitoso) para visión y un asesor financiero para auditar el modelo.</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('academy')}
            className="mt-6 w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-all flex items-center justify-center gap-2"
          >
            <span>Ver Lecciones en El Código</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Recent Pitches Table */}
      {recentPitches && recentPitches.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Últimos Pitches Evaluados en el Tanque</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Sincronizado con Filament</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 dark:text-slate-400 uppercase font-mono border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Empresa</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Solicitud</th>
                  <th className="py-3 px-4">Equity</th>
                  <th className="py-3 px-4">Valuación Implícita</th>
                  <th className="py-3 px-4">Semáforo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                {recentPitches.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{p.company_name}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{p.industry?.name || 'General'}</td>
                    <td className="py-3.5 px-4 font-mono">{formatCurrency(p.ask_amount)}</td>
                    <td className="py-3.5 px-4 font-mono">{p.equity_offered}%</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(p.implicit_valuation)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${
                        p.semaphore_status === 'green' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                        p.semaphore_status === 'yellow' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                      }`}>
                        {p.semaphore_status === 'green' ? '🟢 Justa' : p.semaphore_status === 'yellow' ? '🟡 Ambiciosa' : '🔴 Pretenciosa'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
