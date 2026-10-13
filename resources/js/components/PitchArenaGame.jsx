import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  ArrowRight, 
  RefreshCw,
  Award,
  Flame,
  HelpCircle
} from 'lucide-react';

export default function PitchArenaGame({ 
  challenges, 
  userXp, 
  setUserXp, 
  formatCurrency 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSemaphore, setSelectedSemaphore] = useState(null);
  const [selectedVerdict, setSelectedVerdict] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const currentChallenge = challenges[currentIndex] || challenges[0];

  const implicitValuation = currentChallenge 
    ? (currentChallenge.ask_amount / (currentChallenge.equity_offered / 100))
    : 0;

  const handleVerify = () => {
    if (!selectedSemaphore || !selectedVerdict) return;
    setIsVerifying(true);

    const semCorrect = selectedSemaphore === currentChallenge.expected_semaphore;
    const verdCorrect = selectedVerdict === currentChallenge.correct_shark_verdict;
    const fullCorrect = semCorrect && verdCorrect;

    const earned = fullCorrect 
      ? currentChallenge.reward_xp 
      : (semCorrect ? Math.round(currentChallenge.reward_xp * 0.5) : 0);

    if (earned > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setUserXp(prev => prev + earned);
    }

    setFeedback({
      fullCorrect,
      semCorrect,
      verdCorrect,
      earned,
      explanation: currentChallenge.explanation,
    });
    setIsVerifying(false);
  };

  const handleNextChallenge = () => {
    setSelectedSemaphore(null);
    setSelectedVerdict(null);
    setFeedback(null);
    setCurrentIndex((prev) => (prev + 1) % challenges.length);
  };

  if (!currentChallenge) {
    return (
      <div className="glass-panel p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400">No hay desafíos disponibles en la base de datos.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2 border border-amber-500/20">
            <Trophy size={14} />
            <span>Reto de Inversión {currentIndex + 1} de {challenges.length}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Pitch Arena: ¿Estás dentro o estás fuera?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Ponte en los zapatos de los tiburones. Evalúa la oferta del emprendedor y detecta si es un deal o una trampa.
          </p>
        </div>

        {/* Current XP Pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-2xl shadow-xs">
          <Flame className="text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" size={20} />
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-bold uppercase">Tu Reputación</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{userXp} XP</span>
          </div>
        </div>
      </div>

      {/* Main Pitch Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden">
        {/* Pitch Title & Story */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {currentChallenge.industry_name}
            </span>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              +{currentChallenge.reward_xp} XP Recompensa
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {currentChallenge.title}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 italic">
            "{currentChallenge.story}"
          </p>
        </div>

        {/* Financial Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-center">
          <div className="bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block mb-1">Petición</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(currentChallenge.ask_amount)}</span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block mb-1">Equity</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{currentChallenge.equity_offered}%</span>
          </div>

          <div className="bg-emerald-50/60 dark:bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30 dark:bg-emerald-500/5 shadow-xs">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-sans font-bold block mb-1">Val. Implícita</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(implicitValuation)}</span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block mb-1">Ventas</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(currentChallenge.revenue)}</span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block mb-1">EBITDA</span>
            <span className={`text-sm font-bold ${currentChallenge.ebitda < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {formatCurrency(currentChallenge.ebitda)}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block mb-1">Deuda</span>
            <span className={`text-sm font-bold ${currentChallenge.total_debt === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {currentChallenge.total_debt === 0 ? 'CERO' : formatCurrency(currentChallenge.total_debt)}
            </span>
          </div>
        </div>

        {/* Question 1: Semaphore Diagnosis */}
        {!feedback && (
          <div className="space-y-6 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Paso 1: ¿Cuál es el diagnóstico del Semáforo para esta valuación?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'green', label: '🟢 Valuación Justa o Atractiva', desc: 'Respaldada por ventas y múltiplos normales.' },
                  { id: 'yellow', label: '🟡 Ambiciosa Respaldada', desc: 'Alta, pero justificada por margen o activos.' },
                  { id: 'red', label: '🔴 Valuación Pretenciosa', desc: 'Desconectada de números o con deuda destructiva.' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSemaphore(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedSemaphore === opt.id
                        ? 'border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <span className="font-bold text-sm block mb-1 text-slate-900 dark:text-white">{opt.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Shark Verdict */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Paso 2: Como Tiburón, ¿cuál es tu decisión final?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'deal', label: '🤝 ¡Hay Trato!', desc: 'Acepto la oferta tal como fue planteada.' },
                  { id: 'counter', label: '⚖️ Contraoferta', desc: 'Pido más porcentaje o regalías para mitigar riesgo.' },
                  { id: 'out', label: '🚪 ¡Estoy Fuera!', desc: 'Imposible llegar a un acuerdo sensato.' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedVerdict(opt.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedVerdict === opt.id
                        ? 'border-amber-500 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <span className="font-bold text-sm block mb-1 text-slate-900 dark:text-white">{opt.label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleVerify}
                disabled={!selectedSemaphore || !selectedVerdict || isVerifying}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40"
              >
                <Sparkles size={18} />
                <span>Emitir Veredicto de Tiburón</span>
              </button>
            </div>
          </div>
        )}

        {/* Results Feedback Box */}
        {feedback && (
          <div className="space-y-6 pt-4 animate-in zoom-in-95 duration-300">
            <div className={`p-6 rounded-2xl border ${
              feedback.fullCorrect 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 dark:text-emerald-300' 
                : 'bg-amber-500/10 border-amber-500/40 text-amber-800 dark:text-amber-300'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  feedback.fullCorrect ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}>
                  {feedback.fullCorrect ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {feedback.fullCorrect ? '¡Análisis Perfecto, Tiburón!' : 'Análisis Parcialmente Acertado'}
                    </h3>
                    <span className="font-black font-mono text-sm px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-xs">
                      +{feedback.earned} XP Ganados
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {feedback.explanation}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-4 text-xs font-mono">
                    <span>Semáforo Real: <strong>{currentChallenge.expected_semaphore.toUpperCase()}</strong></span>
                    <span>Decisión Óptima: <strong>{currentChallenge.correct_shark_verdict.toUpperCase()}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextChallenge}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                <span>Siguiente Caso del Tanque</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
