import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Sliders, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  Sparkles,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';

export default function PitchWizard({ 
  industries, 
  onSavePitch, 
  formatCurrency, 
  setActiveTab 
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('Mi Startup Innovadora');
  const [founderName, setFounderName] = useState('Emprendedor(a) en el Tanque');
  const [industryId, setIndustryId] = useState(industries[0]?.id || 1);
  const [stage, setStage] = useState('crecimiento'); // semilla, crecimiento, madura

  // Module 1: Pitch Inputs
  const [askAmount, setAskAmount] = useState(1500000);
  const [equityOffered, setEquityOffered] = useState(10);

  // Module 2: Financial Engine Inputs
  const [valuationMethod, setValuationMethod] = useState('multiplos'); // multiplos, dcf, libros, vc
  const [annualRevenue, setAnnualRevenue] = useState(3000000);
  const [annualEbitda, setAnnualEbitda] = useState(600000);
  const [netAssets, setNetAssets] = useState(1200000);

  // Module 3: Operational Adjustments
  const [grossMargin, setGrossMargin] = useState(65);
  const [cac, setCac] = useState(180);
  const [ltv, setLtv] = useState(1600);
  const [repurchaseRate, setRepurchaseRate] = useState(55);
  const [totalDebt, setTotalDebt] = useState(0);

  // Selected Industry helper
  const selectedIndustry = industries.find(i => i.id === Number(industryId)) || industries[0];

  // Mathematical Calculations
  const calculateValuation = () => {
    // 1. Implicit Valuation
    const implicit = equityOffered > 0 ? (askAmount / (equityOffered / 100)) : 0;

    // 2. Base Method Valuation
    let baseValuation = 0;
    const multEbitda = selectedIndustry?.default_ebitda_multiple || 5;
    const multRev = selectedIndustry?.default_revenue_multiple || 2;

    if (valuationMethod === 'multiplos') {
      if (annualEbitda > 0) {
        baseValuation = annualEbitda * multEbitda;
      } else {
        baseValuation = annualRevenue * multRev;
      }
    } else if (valuationMethod === 'dcf') {
      // 5-year DCF simulation
      const growth = stage === 'semilla' ? 0.40 : (stage === 'crecimiento' ? 0.25 : 0.10);
      const discount = stage === 'semilla' ? 0.25 : (stage === 'crecimiento' ? 0.18 : 0.12);
      const cf = Math.max(annualEbitda * 0.75, annualRevenue * 0.15);
      let pv = 0;
      for (let y = 1; y <= 5; y++) {
        pv += (cf * Math.pow(1 + growth, y)) / Math.pow(1 + discount, y);
      }
      const terminal = (cf * Math.pow(1 + growth, 5) * 1.03) / (discount - 0.03);
      baseValuation = Math.max(pv + (terminal / Math.pow(1 + discount, 5) * 0.5), annualRevenue * 0.5);
    } else if (valuationMethod === 'libros') {
      baseValuation = Math.max(0, netAssets - totalDebt);
      if (baseValuation === 0 && annualRevenue > 0) baseValuation = annualRevenue * 0.5;
    } else if (valuationMethod === 'vc') {
      const exitValue = Math.max(annualRevenue * 5, annualEbitda * 12, askAmount * 12);
      baseValuation = Math.max(exitValue / 10, askAmount * 1.5);
    }

    // 3. Operational Adjustments (El Efecto Multiplicador)
    let opScore = 0;
    const adjustmentsList = [];

    const typicalGross = selectedIndustry?.typical_gross_margin || 50;
    if (grossMargin > typicalGross + 8) {
      opScore += 1;
      adjustmentsList.push(`Márgenes brutos destacados (+${Math.round(grossMargin - typicalGross)}% vs sector)`);
    } else if (grossMargin < typicalGross - 12) {
      opScore -= 1;
      adjustmentsList.push('Márgenes por debajo de la media de la industria');
    }

    if (totalDebt <= 0) {
      opScore += 1;
      adjustmentsList.push('Deuda CERO: Justifica múltiplo premium');
    } else if (totalDebt > Math.max(annualEbitda * 2.5, annualRevenue * 0.5)) {
      opScore -= 2;
      adjustmentsList.push('Deuda alta: Destruye el múltiplo');
    }

    if (repurchaseRate >= 60) {
      opScore += 1;
      adjustmentsList.push('Alta retención y clientes recurrentes (>60%)');
    }

    const factor = 1.0 + (opScore * 0.08);
    const calculated = Math.max(100000, baseValuation * factor);

    // 4. Semaphore Status
    const ratio = calculated > 0 ? (implicit / calculated) : 999;
    let sem = 'green';
    let pathologyText = null;

    if (ratio <= 1.25) {
      sem = 'green';
    } else if (ratio <= 2.2 && opScore >= 0) {
      sem = 'yellow';
    } else {
      sem = 'red';
      if (annualEbitda <= 0 && ratio > 5) {
        pathologyText = 'Alucinación VC: Proyección sin validación de tracción comercial comprobada';
      } else if (totalDebt > annualRevenue * 0.6) {
        pathologyText = 'Amnesia de Pasivos: Exige valuación alta ignorando pasivos asfixiantes';
      } else if (grossMargin < 30) {
        pathologyText = 'Márgenes Asfixiados: Costos operativos carcomen la rentabilidad';
      } else {
        pathologyText = 'Ficción del Múltiplo: Múltiplo exigido excede la realidad comprobada del sector';
      }
    }

    // 5. Shark Counter-Offer
    const counterEquity = Math.min(49, Math.max(15, Math.round((askAmount / Math.max(calculated, 1)) * 100)));
    const counterValuation = counterEquity > 0 ? (askAmount / (counterEquity / 100)) : calculated;

    return {
      implicit,
      calculated,
      ratio,
      semaphore: sem,
      pathology: pathologyText,
      opScore,
      adjustments: adjustmentsList,
      counterEquity,
      counterValuation,
    };
  };

  const results = calculateValuation();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSavePitch({
        company_name: companyName,
        founder_name: founderName,
        industry_id: industryId,
        stage: stage,
        ask_amount: askAmount,
        equity_offered: equityOffered,
        annual_revenue: annualRevenue,
        annual_ebitda: annualEbitda,
        gross_margin_percent: grossMargin,
        cac: cac,
        ltv: ltv,
        repurchase_rate: repurchaseRate,
        total_debt: totalDebt,
        net_assets: netAssets,
        valuation_method: valuationMethod,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title & Wizard Tracker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Motor de Valuación & Simulador
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Los 4 Módulos de <strong className="text-emerald-600 dark:text-emerald-400">El Código de la Valuación</strong> para estructurar y validar tu pitch.
          </p>
        </div>

        {/* Steps Breadcrumbs */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {[
            { n: 1, label: '1. Oferta Implícita' },
            { n: 2, label: '2. Motor Financiero' },
            { n: 3, label: '3. Salud Operativa' },
            { n: 4, label: '4. Semáforo & Negociación' }
          ].map(s => (
            <button
              key={s.n}
              onClick={() => setCurrentStep(s.n)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentStep === s.n 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                  : currentStep > s.n 
                    ? 'text-emerald-600 dark:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-800' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: CALCULADORA DE OFERTA IMPLÍCITA */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calculator className="text-emerald-500 dark:text-emerald-400" size={20} />
                    Módulo 1: La Matemática de la Oferta Implícita
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Define cuánto capital pides y cuánto equity estás dispuesto a ceder.
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Paso 1 de 4
                </span>
              </div>

              {/* Startup Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Sector de la Empresa
                  </label>
                  <select
                    value={industryId}
                    onChange={(e) => setIndustryId(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors shadow-xs"
                  >
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name} (~{ind.default_ebitda_multiple}x EBITDA)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ask Amount Slider */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Capital Solicitado al Tanque ($ MXN)
                  </label>
                  <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                    {formatCurrency(askAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="20000000"
                  step="50000"
                  value={askAmount}
                  onChange={(e) => setAskAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>$100,000</span>
                  <span>$10,000,000</span>
                  <span>$20,000,000+</span>
                </div>
              </div>

              {/* Equity Offered Slider */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Equity Ofrecido (% de Participación)
                  </label>
                  <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {equityOffered}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.5"
                  value={equityOffered}
                  onChange={(e) => setEquityOffered(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>1% (Ronda Ángel)</span>
                  <span>10% - 20% (Estándar Shark Tank)</span>
                  <span>50% (Peligro Dilución)</span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  <span>Continuar a Motor Financiero</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Real-time Math Display */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Declaración Absoluta de Valor
                </span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                  Tu Valuación Implícita
                </h4>

                <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-100 dark:from-slate-900 dark:to-emerald-950/60 border border-emerald-500/30 p-6 rounded-2xl text-center shadow-inner mb-6">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                    {formatCurrency(askAmount)} ÷ {equityOffered}%
                  </p>
                  <div className="text-3xl md:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight my-2">
                    {formatCurrency(results.implicit)}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Al pedir este monto, le dices al mercado que tu compañía vale esta cifra exacta.
                  </p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 shadow-xs">
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={16} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Sector:</strong> {selectedIndustry?.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp size={16} className="text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Múltiplo Referencial:</strong> {selectedIndustry?.default_ebitda_multiple}x EBITDA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>Para respaldar esta cifra a un múltiplo de {selectedIndustry?.default_ebitda_multiple}x, necesitarías generar aproximadamente <strong className="text-slate-900 dark:text-white font-mono">{formatCurrency(results.implicit / selectedIndustry?.default_ebitda_multiple)}</strong> de EBITDA anual.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                “Cada oferta que presentas es una declaración jurada del valor total de tu empresa.”
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: MOTOR FINANCIERO MULTIMÉTODO */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={20} />
                  Módulo 2: Motor Financiero Multimétodo
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona la etapa de tu negocio y el método formal de valuación (Páginas 3 y 4 del PDF).
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Paso 2 de 4
              </span>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Etapa del Negocio
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'semilla', title: '1. Etapa Semilla', desc: 'Pre-revenue o validación inicial. Pocas ventas constantes.' },
                  { id: 'crecimiento', title: '2. Crecimiento', desc: 'Tracción comercial comprobada, flujo constante y expansión.' },
                  { id: 'madura', title: '3. Madura', desc: 'Flujos altamente predecibles, dividendos y cuota de mercado.' },
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setStage(st.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      stage === st.id 
                        ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/10' 
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-sm block mb-1 text-white">{st.title}</span>
                    <span className="text-xs text-slate-400 leading-snug">{st.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Valuation Method Selector (The 4 Formal Methods from PDF Page 3) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Método Formal de Valuación (Elige el más adecuado)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    id: 'multiplos',
                    name: 'Múltiplos de Mercado',
                    badge: 'Favorito Shark Tank',
                    desc: 'Multiplica Ventas o EBITDA por el factor de la industria.',
                    ideal: 'Negocios con ventas constantes e industrias bien documentadas.',
                  },
                  {
                    id: 'dcf',
                    name: 'Flujo Descontado (DCF)',
                    badge: 'Ciencia Financiera',
                    desc: 'Proyecta 5 años de efectivo y descuenta a valor presente (WACC).',
                    ideal: 'Empresas maduras o startups con flujos predecibles.',
                  },
                  {
                    id: 'libros',
                    name: 'Valor en Libros (Activos)',
                    badge: 'Base Tangible',
                    desc: 'Suma todos los bienes de la empresa menos todas las deudas.',
                    ideal: 'Empresas industriales, maquinaria o bienes raíces.',
                  },
                  {
                    id: 'vc',
                    name: 'Método VC (Capital Riesgo)',
                    badge: 'Escala 10x',
                    desc: 'Calcula hacia atrás desde el valor de salida (Exit) para dar 10x ROI.',
                    ideal: 'Startups tecnológicas pre-semilla/semilla de alto potencial.',
                  },
                ].map(m => (
                  <div
                    key={m.id}
                    onClick={() => setValuationMethod(m.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      valuationMethod === m.id
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/15'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-mono">
                          {m.badge}
                        </span>
                        {valuationMethod === m.id && <CheckCircle2 size={16} className="text-emerald-400" />}
                      </div>
                      <h4 className="font-bold text-sm text-white mb-1.5">{m.name}</h4>
                      <p className="text-xs text-slate-300 mb-3">{m.desc}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 italic">
                      Ideal para: {m.ideal}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Numbers Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ventas Anuales ($ MXN)
                </label>
                <input
                  type="number"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  EBITDA Real Anual ($ MXN)
                </label>
                <input
                  type="number"
                  value={annualEbitda}
                  onChange={(e) => setAnnualEbitda(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Activos Tangibles / Libros ($ MXN)
                </label>
                <input
                  type="number"
                  value={netAssets}
                  onChange={(e) => setNetAssets(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-semibold"
              >
                <ArrowLeft size={16} />
                <span>Volver</span>
              </button>

              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Avanzar a Salud Operativa</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: CALIFICADOR OPERATIVO (PÁGINA 5 Y 6 DEL PDF) */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="text-emerald-400" size={20} />
                  Módulo 3: Evaluador de Salud Operativa (El Efecto Multiplicador)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Márgenes, CAC, retención y deuda dictan si recibes un múltiplo premium o una penalización.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Paso 3 de 4
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Margen Bruto */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-sm text-white">Margen de Ganancia Bruta</h5>
                    <p className="text-[11px] text-slate-400">Qué proporción de cada venta queda tras costos directos.</p>
                  </div>
                  <span className="text-xl font-black font-mono text-emerald-400">{grossMargin}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={grossMargin}
                  onChange={(e) => setGrossMargin(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 font-mono">
                  Promedio de {selectedIndustry?.name}: ~{selectedIndustry?.typical_gross_margin}%
                </p>
              </div>

              {/* Deuda Total */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-sm text-white">Nivel de Deuda / Pasivos</h5>
                    <p className="text-[11px] text-slate-400">Créditos bancarios o pasivos exigibles.</p>
                  </div>
                  <span className={`text-xl font-black font-mono ${totalDebt === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {totalDebt === 0 ? '¡DEUDA CERO!' : formatCurrency(totalDebt)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={totalDebt}
                  onChange={(e) => setTotalDebt(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 font-mono">
                  {totalDebt === 0 ? '🏆 Bonificación: Múltiplo premium justificado' : '⚠️ Penalización destructiva en el precio'}
                </p>
              </div>

              {/* CAC vs LTV */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-sm text-white">Eficiencia CAC vs LTV</h5>
                    <p className="text-[11px] text-slate-400">Costo de adquirir un cliente vs cuánto gasta en total.</p>
                  </div>
                  <span className="text-sm font-bold font-mono text-cyan-400">
                    Ratio {(ltv / Math.max(cac, 1)).toFixed(1)}x
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono">CAC ($)</label>
                    <input
                      type="number"
                      value={cac}
                      onChange={(e) => setCac(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono">LTV ($)</label>
                    <input
                      type="number"
                      value={ltv}
                      onChange={(e) => setLtv(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Tasa de Recompra / Retención */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-sm text-white">Retención / Tasa de Recompra</h5>
                    <p className="text-[11px] text-slate-400">Porcentaje de clientes que vuelven a comprar.</p>
                  </div>
                  <span className="text-xl font-black font-mono text-emerald-400">{repurchaseRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={repurchaseRate}
                  onChange={(e) => setRepurchaseRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 font-mono">
                  {repurchaseRate >= 60 ? '✨ Fidelidad extrema: Flujo predecible y recurrente' : 'Clientes esporádicos o transaccionales'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-semibold"
              >
                <ArrowLeft size={16} />
                <span>Volver</span>
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Generar Diagnóstico & Semáforo</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REPORTE DE TANQUE & EL SEMÁFORO DEL INVERSIONISTA */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* The Investor Traffic Light Card */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Diagnóstico en Tiempo Real
                </span>
                <h3 className="text-2xl font-black text-white mb-4">
                  El Semáforo del Inversionista
                </h3>

                {/* Visual Traffic Light Physical Box */}
                <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 flex flex-col items-center gap-5 shadow-2xl mx-auto w-44 my-4">
                  {/* Green Light */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    results.semaphore === 'green'
                      ? 'bg-emerald-500 text-slate-950 glow-emerald scale-110 shadow-lg shadow-emerald-500/50'
                      : 'bg-emerald-950/40 opacity-30 text-emerald-800'
                  }`}>
                    <CheckCircle2 size={32} />
                  </div>

                  {/* Yellow Light */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    results.semaphore === 'yellow'
                      ? 'bg-amber-400 text-slate-950 glow-amber scale-110 shadow-lg shadow-amber-400/50'
                      : 'bg-amber-950/40 opacity-30 text-amber-800'
                  }`}>
                    <TrendingUp size={32} />
                  </div>

                  {/* Red Light */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    results.semaphore === 'red'
                      ? 'bg-rose-500 text-slate-950 glow-rose scale-110 shadow-lg shadow-rose-500/50'
                      : 'bg-rose-950/40 opacity-30 text-rose-800'
                  }`}>
                    <AlertTriangle size={32} />
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className="text-center mt-4">
                  <span className={`inline-block px-4 py-1.5 rounded-full font-black text-sm tracking-wide border uppercase ${
                    results.semaphore === 'green' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    results.semaphore === 'yellow' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {results.semaphore === 'green' && '🟢 Valuación Justa o Atractiva'}
                    {results.semaphore === 'yellow' && '🟡 Ambiciosa Respaldada'}
                    {results.semaphore === 'red' && '🔴 Valuación Pretenciosa'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 text-center">
                Ratio Pitch vs Ciencia: <strong className="text-white font-mono">{results.ratio.toFixed(2)}x</strong>
              </div>
            </div>

            {/* Detailed Diagnostic & Pathology */}
            <div className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Dictamen del Comité de Inversión
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Contraste entre lo solicitado y el valor financiero respaldado.
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    Etapa: <strong className="text-white capitalize">{stage}</strong>
                  </span>
                </div>

                {/* Numbers Side by Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                    <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">
                      Valuación Implícita del Pitch
                    </span>
                    <div className="text-2xl font-black font-mono text-white mb-1">
                      {formatCurrency(results.implicit)}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Pides {formatCurrency(askAmount)} por el {equityOffered}% de tu empresa.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-5 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider block mb-1">
                      Valor Financiero Científico
                    </span>
                    <div className="text-2xl font-black font-mono text-emerald-400 mb-1">
                      {formatCurrency(results.calculated)}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Calculado por {valuationMethod.toUpperCase()} + salud operativa.
                    </p>
                  </div>
                </div>

                {/* Pathology Banner if Red (Page 8 of PDF) */}
                {results.pathology && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 mb-6">
                    <AlertTriangle size={18} className="shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-sm text-rose-200">Radiografía de Patología Detectada:</strong>
                      <p className="mt-0.5 leading-relaxed">{results.pathology}</p>
                    </div>
                  </div>
                )}

                {/* Shark Tank Counter-Offer Simulation */}
                <div className="bg-slate-900/90 p-6 rounded-2xl border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                      <Sparkles size={16} />
                      Simulador de Contraoferta en el Tanque
                    </h4>
                    <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                      Oferta Realista
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Para que los inversionistas acepten poner tus <strong className="text-white font-mono">{formatCurrency(askAmount)}</strong> basados en el valor real de tu empresa, te exigirán aproximadamente:
                  </p>
                  <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Equity Exigido:</span>
                      <span className="text-2xl font-black text-amber-400">{results.counterEquity}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Valuación Resultante:</span>
                      <span className="text-xl font-bold text-white">{formatCurrency(results.counterValuation)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save to Filament / Go back */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-semibold"
                >
                  <ArrowLeft size={16} />
                  <span>Modificar Variables</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 size={18} />
                        <span>¡Guardado en Filament!</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Guardar en Filament PHP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
