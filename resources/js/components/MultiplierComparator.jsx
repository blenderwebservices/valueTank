import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, AlertTriangle, ArrowRight, DollarSign, Award } from 'lucide-react';

export default function MultiplierComparator({ formatCurrency }) {
  // Shared Revenue
  const [salesRevenue, setSalesRevenue] = useState(5000000);

  // Company A Metrics (Healthy / Premium)
  const [marginA, setMarginA] = useState(75);
  const [debtA, setDebtA] = useState(0);
  const [cacA, setCacA] = useState(150);
  const [retentionA, setRetentionA] = useState(85);

  // Company B Metrics (Struggling / Penalized)
  const [marginB, setMarginB] = useState(25);
  const [debtB, setDebtB] = useState(2000000);
  const [cacB, setCacB] = useState(850);
  const [retentionB, setRetentionB] = useState(20);

  // Valuation Calculation for both
  const calcCompany = (margin, debt, cac, retention) => {
    // Estimated EBITDA
    const ebitda = salesRevenue * (margin / 100) * 0.45;
    let multiple = 5.0; // base multiple

    if (debt === 0) multiple += 1.5;
    else if (debt > salesRevenue * 0.3) multiple -= 2.0;

    if (margin > 60) multiple += 1.2;
    else if (margin < 30) multiple -= 1.0;

    if (retention > 60) multiple += 1.0;
    else if (retention < 30) multiple -= 0.8;

    multiple = Math.max(1.2, multiple);
    const valuation = Math.max(0, (ebitda * multiple) - debt);

    return { ebitda, multiple, valuation };
  };

  const compA = calcCompany(marginA, debtA, cacA, retentionA);
  const compB = calcCompany(marginB, debtB, cacB, retentionB);
  const valueGap = Math.max(0, compA.valuation - compB.valuation);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/20">
          <TrendingUp size={14} />
          <span>Lección Práctica: Página 6 del PDF</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          El Efecto Multiplicador: Empresa A vs Empresa B
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Dos empresas con exactamente las mismas ventas facturadas (<strong className="text-white font-mono">{formatCurrency(salesRevenue)}</strong>) pueden valer fortunas completamente distintas.
        </p>

        {/* Sales Revenue Slider */}
        <div className="mt-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-xl">
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
              Ventas Facturadas Compartidas
            </label>
            <input
              type="range"
              min="1000000"
              max="20000000"
              step="500000"
              value={salesRevenue}
              onChange={(e) => setSalesRevenue(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
          <span className="font-mono text-xl font-bold text-emerald-400 shrink-0">
            {formatCurrency(salesRevenue)}
          </span>
        </div>
      </div>

      {/* Difference Spotlight */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Brecha de Valuación Creada por Eficiencia Operativa
          </span>
          <h2 className="text-3xl font-black text-white font-mono">
            {formatCurrency(valueGap)} de diferencia
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Empresa A vale <strong className="text-emerald-400 font-mono">{(compA.valuation / Math.max(compB.valuation, 1)).toFixed(1)}x</strong> más que Empresa B vendiendo exactamente lo mismo.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          Múltiplo Empresa A: <strong className="text-emerald-400">{compA.multiple.toFixed(1)}x</strong> <br />
          Múltiplo Empresa B: <strong className="text-rose-400">{compB.multiple.toFixed(1)}x</strong>
        </div>
      </div>

      {/* The Two Companies Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Empresa A */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-emerald-500/30 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                A
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Empresa A: La Estrella</h3>
                <span className="text-xs text-emerald-400 font-bold">Múltiplo Premium Respaldado</span>
              </div>
            </div>
            <ShieldCheck className="text-emerald-400" size={24} />
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center font-mono">
            <span className="text-xs text-slate-400 block mb-1">Valuación Resultante</span>
            <div className="text-3xl font-black text-emerald-400">{formatCurrency(compA.valuation)}</div>
            <span className="text-xs text-slate-400">Múltiplo Efectivo: {compA.multiple.toFixed(1)}x EBITDA</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Margen Bruto:</span>
                <span className="font-bold text-emerald-400">{marginA}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                value={marginA}
                onChange={(e) => setMarginA(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Deuda:</span>
                <span className="font-bold text-emerald-400">{debtA === 0 ? 'DEUDA CERO' : formatCurrency(debtA)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000000"
                step="50000"
                value={debtA}
                onChange={(e) => setDebtA(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Retención de Clientes:</span>
                <span className="font-bold text-emerald-400">{retentionA}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="99"
                value={retentionA}
                onChange={(e) => setRetentionA(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Empresa B */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-rose-500/30 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                B
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Empresa B: La Ineficiente</h3>
                <span className="text-xs text-rose-400 font-bold">Penalización Destructiva</span>
              </div>
            </div>
            <AlertTriangle className="text-rose-400" size={24} />
          </div>

          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center font-mono">
            <span className="text-xs text-slate-400 block mb-1">Valuación Resultante</span>
            <div className="text-3xl font-black text-rose-400">{formatCurrency(compB.valuation)}</div>
            <span className="text-xs text-slate-400">Múltiplo Castigado: {compB.multiple.toFixed(1)}x EBITDA</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Margen Bruto:</span>
                <span className="font-bold text-rose-400">{marginB}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={marginB}
                onChange={(e) => setMarginB(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Deuda Bancaria:</span>
                <span className="font-bold text-rose-400">{formatCurrency(debtB)}</span>
              </div>
              <input
                type="range"
                min="500000"
                max="5000000"
                step="50000"
                value={debtB}
                onChange={(e) => setDebtB(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-300">Retención de Clientes:</span>
                <span className="font-bold text-rose-400">{retentionB}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                value={retentionB}
                onChange={(e) => setRetentionB(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
