import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Users, ShieldCheck, FileText, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function AcademyView({ modules }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(modules[0]?.id || 1);

  const categories = [
    { id: 'all', label: 'Todas las Lecciones' },
    { id: 'fundamentos', label: '1. Sombra Matemática' },
    { id: 'metodos', label: '2. Métodos Formales' },
    { id: 'operativo', label: '3. Efecto Multiplicador' },
    { id: 'negociacion', label: '4. Negociación & Tiburones' },
  ];

  const filtered = selectedCategory === 'all' 
    ? modules 
    : modules.filter(m => m.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/20">
          <BookOpen size={14} />
          <span>Biblioteca de Conocimiento</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          El Código de la Valuación: Lecciones Maestras
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Guía integral basada en el PDF original y la infografía estratégica para fundadores.
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === c.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Special Feature Card: Mentores vs Asesores (Page 9-11 of PDF) */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">El Escuadrón de Respaldo</h3>
            <p className="text-xs text-slate-400">Mentores (Founders Exitosos) vs Asesores Financieros (Consultores Técnicos)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-sm text-emerald-400 mb-1">El Mentor (Founder Experimentado)</h4>
            <p className="text-xs text-slate-300 mb-2">Visión holística, contactos clave, red de apoyo y cómo no equivocarse en etapa semilla.</p>
            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2">
              Compensación estándar: <strong className="text-white">0.25% a 1.0% de Equity</strong> con vesting a 1-2 años bajo contrato <strong>FAST</strong> (Founder Advisor Standard Template).
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-sm text-cyan-400 mb-1">El Asesor Financiero (Consultor Técnico)</h4>
            <p className="text-xs text-slate-300 mb-2">Modelos financieros, DCF formal, due diligence, estructuración pre-ronda y auditoría.</p>
            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2">
              Compensación estándar: <strong className="text-white">Honorarios / Retainer mensual</strong> o porcentaje de éxito en levantamiento de capital.
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Modules List */}
      <div className="space-y-4">
        {filtered.map(mod => {
          const isExpanded = expandedId === mod.id;
          return (
            <div
              key={mod.id}
              className={`rounded-2xl border transition-all ${
                isExpanded 
                  ? 'glass-panel border-emerald-500/40 shadow-xl' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : mod.id)}
                className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isExpanded ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {mod.order}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{mod.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{mod.subtitle || mod.summary}</p>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-4 text-sm text-slate-300">
                  <div className="prose prose-invert max-w-none text-xs md:text-sm whitespace-pre-line leading-relaxed">
                    {mod.content_markdown}
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                      <strong className="block text-emerald-200 mb-0.5">Lección Clave:</strong>
                      <span>{mod.key_takeaway}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
