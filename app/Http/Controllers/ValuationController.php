<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use App\Models\LearningModule;
use App\Models\PitchChallenge;
use App\Models\ValuationPitch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ValuationController extends Controller
{
    /**
     * Get all essential app data for the reactive frontend.
     */
    public function getInitialData(): JsonResponse
    {
        $industries = Industry::all();
        $challenges = PitchChallenge::all();
        $modules = LearningModule::orderBy('order')->get();
        $recentPitches = ValuationPitch::with('industry')->latest()->take(5)->get();

        return response()->json([
            'industries' => $industries,
            'challenges' => $challenges,
            'modules' => $modules,
            'recent_pitches' => $recentPitches,
            'stats' => [
                'total_pitches' => ValuationPitch::count(),
                'green_count' => ValuationPitch::where('semaphore_status', 'green')->count(),
                'yellow_count' => ValuationPitch::where('semaphore_status', 'yellow')->count(),
                'red_count' => ValuationPitch::where('semaphore_status', 'red')->count(),
            ],
        ]);
    }

    /**
     * Pure valuation and diagnosis engine.
     */
    public function evaluate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_name' => 'nullable|string',
            'founder_name' => 'nullable|string',
            'industry_id' => 'required|exists:industries,id',
            'stage' => 'required|in:semilla,crecimiento,madura',
            'ask_amount' => 'required|numeric|min:1',
            'equity_offered' => 'required|numeric|min:0.1|max:100',
            'annual_revenue' => 'required|numeric|min:0',
            'annual_ebitda' => 'required|numeric',
            'gross_margin_percent' => 'required|numeric|min:0|max:100',
            'cac' => 'nullable|numeric|min:0',
            'ltv' => 'nullable|numeric|min:0',
            'repurchase_rate' => 'nullable|numeric|min:0|max:100',
            'total_debt' => 'nullable|numeric|min:0',
            'net_assets' => 'nullable|numeric',
            'valuation_method' => 'required|in:multiplos,dcf,libros,vc',
        ]);

        $result = $this->calculateDiagnosis($data);

        return response()->json($result);
    }

    /**
     * Save valuation pitch into DB and return diagnosis.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'founder_name' => 'nullable|string|max:255',
            'industry_id' => 'required|exists:industries,id',
            'stage' => 'required|in:semilla,crecimiento,madura',
            'ask_amount' => 'required|numeric|min:1',
            'equity_offered' => 'required|numeric|min:0.1|max:100',
            'annual_revenue' => 'required|numeric|min:0',
            'annual_ebitda' => 'required|numeric',
            'gross_margin_percent' => 'required|numeric|min:0|max:100',
            'cac' => 'nullable|numeric|min:0',
            'ltv' => 'nullable|numeric|min:0',
            'repurchase_rate' => 'nullable|numeric|min:0|max:100',
            'total_debt' => 'nullable|numeric|min:0',
            'net_assets' => 'nullable|numeric',
            'valuation_method' => 'required|in:multiplos,dcf,libros,vc',
        ]);

        $evaluation = $this->calculateDiagnosis($data);

        $pitch = ValuationPitch::create([
            'company_name' => $data['company_name'],
            'founder_name' => $data['founder_name'] ?? 'Emprendedor Anónimo',
            'industry_id' => $data['industry_id'],
            'stage' => $data['stage'],
            'ask_amount' => $data['ask_amount'],
            'equity_offered' => $data['equity_offered'],
            'implicit_valuation' => $evaluation['implicit_valuation'],
            'annual_revenue' => $data['annual_revenue'],
            'annual_ebitda' => $data['annual_ebitda'],
            'annual_net_income' => $evaluation['estimated_net_income'],
            'gross_margin_percent' => $data['gross_margin_percent'],
            'cac' => $data['cac'] ?? 0,
            'ltv' => $data['ltv'] ?? 0,
            'repurchase_rate' => $data['repurchase_rate'] ?? 0,
            'total_debt' => $data['total_debt'] ?? 0,
            'net_assets' => $data['net_assets'] ?? 0,
            'valuation_method' => $data['valuation_method'],
            'calculated_valuation' => $evaluation['calculated_valuation'],
            'semaphore_status' => $evaluation['semaphore'],
            'diagnosis_notes' => $evaluation['primary_feedback'],
            'counter_offer_equity' => $evaluation['counter_offer']['equity'],
            'counter_offer_valuation' => $evaluation['counter_offer']['valuation'],
        ]);

        return response()->json([
            'pitch' => $pitch->load('industry'),
            'evaluation' => $evaluation,
        ]);
    }

    /**
     * Submit answer for a pitch challenge game.
     */
    public function verifyChallenge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'challenge_id' => 'required|exists:pitch_challenges,id',
            'chosen_semaphore' => 'required|in:green,yellow,red',
            'chosen_verdict' => 'required|in:deal,counter,out',
        ]);

        $challenge = PitchChallenge::findOrFail($validated['challenge_id']);

        $semaphoreCorrect = ($validated['chosen_semaphore'] === $challenge->expected_semaphore);
        $verdictCorrect = ($validated['chosen_verdict'] === $challenge->correct_shark_verdict);

        $isFullCorrect = $semaphoreCorrect && $verdictCorrect;
        $earnedXp = $isFullCorrect ? $challenge->reward_xp : ($semaphoreCorrect ? intval($challenge->reward_xp * 0.5) : 0);

        return response()->json([
            'is_correct' => $isFullCorrect,
            'semaphore_correct' => $semaphoreCorrect,
            'verdict_correct' => $verdictCorrect,
            'earned_xp' => $earnedXp,
            'expected_semaphore' => $challenge->expected_semaphore,
            'correct_shark_verdict' => $challenge->correct_shark_verdict,
            'explanation' => $challenge->explanation,
        ]);
    }

    /**
     * Internal financial valuation & diagnostic math.
     */
    private function calculateDiagnosis(array $data): array
    {
        $industry = Industry::findOrFail($data['industry_id']);

        $askAmount = (float) $data['ask_amount'];
        $equityOffered = (float) $data['equity_offered'];
        $revenue = (float) $data['annual_revenue'];
        $ebitda = (float) $data['annual_ebitda'];
        $grossMargin = (float) $data['gross_margin_percent'];
        $cac = (float) ($data['cac'] ?? 0);
        $ltv = (float) ($data['ltv'] ?? 0);
        $repurchaseRate = (float) ($data['repurchase_rate'] ?? 0);
        $totalDebt = (float) ($data['total_debt'] ?? 0);
        $netAssets = (float) ($data['net_assets'] ?? 0);
        $method = $data['valuation_method'];
        $stage = $data['stage'];

        // 1. Implicit Pitch Valuation (La Matemática de la Oferta Implícita)
        $implicitValuation = $equityOffered > 0 ? ($askAmount / ($equityOffered / 100)) : 0;

        // 2. Base Method Valuation
        $baseValuation = 0;
        $multiplierUsed = 0;

        if ($method === 'multiplos') {
            if ($ebitda > 0) {
                $multiplierUsed = $industry->default_ebitda_multiple;
                $baseValuation = $ebitda * $multiplierUsed;
            } else {
                $multiplierUsed = $industry->default_revenue_multiple;
                $baseValuation = $revenue * $multiplierUsed;
            }
        } elseif ($method === 'dcf') {
            // Simplified 5-year discounted cash flow
            $growthRate = match ($stage) {
                'semilla' => 0.40,
                'crecimiento' => 0.25,
                'madura' => 0.10,
            };
            $discountRate = match ($stage) {
                'semilla' => 0.25,
                'crecimiento' => 0.18,
                'madura' => 0.12,
            };
            $cf = max($ebitda * 0.75, $revenue * 0.15);
            $presentValue = 0;
            for ($year = 1; $year <= 5; $year++) {
                $projectedCf = $cf * pow(1 + $growthRate, $year);
                $presentValue += $projectedCf / pow(1 + $discountRate, $year);
            }
            // Terminal value with 3% perpetual growth
            $terminalValue = ($cf * pow(1 + $growthRate, 5) * 1.03) / ($discountRate - 0.03);
            $pvTerminal = $terminalValue / pow(1 + $discountRate, 5);
            $baseValuation = max($presentValue + ($pvTerminal * 0.5), $revenue * 0.5);
            $multiplierUsed = $ebitda > 0 ? ($baseValuation / $ebitda) : ($baseValuation / max($revenue, 1));
        } elseif ($method === 'libros') {
            // Valor de activos netos menos deuda
            $baseValuation = max(0, $netAssets - $totalDebt);
            if ($baseValuation == 0 && $revenue > 0) {
                $baseValuation = $revenue * 0.5;
            }
            $multiplierUsed = 1.0;
        } elseif ($method === 'vc') {
            // Venture Capital Method: Exit Value / 10x ROI
            $projectedExit = max($revenue * 5, $ebitda * 12, $askAmount * 15);
            $targetRoi = 10.0;
            $postMoney = $projectedExit / $targetRoi;
            $baseValuation = max($postMoney, $askAmount * 1.5);
            $multiplierUsed = $targetRoi;
        }

        // 3. Operational Adjustments (El Efecto Multiplicador)
        $operationalScore = 0; // -3 to +3
        $adjustments = [];

        // Margins impact
        if ($grossMargin > $industry->typical_gross_margin + 10) {
            $operationalScore += 1;
            $adjustments[] = 'Márgenes brutos estelares (+'.round($grossMargin - $industry->typical_gross_margin).'% vs sector)';
        } elseif ($grossMargin < $industry->typical_gross_margin - 15) {
            $operationalScore -= 1;
            $adjustments[] = 'Márgenes deprimidos por debajo del estándar del sector';
        }

        // Debt impact
        if ($totalDebt <= 0) {
            $operationalScore += 1;
            $adjustments[] = 'Deuda CERO: Justifica múltiplo premium';
        } elseif ($totalDebt > max($ebitda * 2.5, $revenue * 0.5)) {
            $operationalScore -= 2;
            $adjustments[] = 'Amnesia de Pasivos: Exceso de deuda destruye el múltiplo';
        }

        // Repurchase / Customer Retention
        if ($repurchaseRate >= 60) {
            $operationalScore += 1;
            $adjustments[] = 'Alta retención de clientes (>60% recompra recurrente)';
        } elseif ($repurchaseRate > 0 && $repurchaseRate < 20) {
            $adjustments[] = 'Baja tasa de recompra; alta fuga de clientes';
        }

        // Apply multiplier adjustment
        $adjustmentFactor = 1.0 + ($operationalScore * 0.08);
        $calculatedValuation = max(100000, $baseValuation * $adjustmentFactor);

        // 4. Semaphore Evaluation (El Semáforo del Inversionista)
        $valuationRatio = $calculatedValuation > 0 ? ($implicitValuation / $calculatedValuation) : 999;
        $semaphore = 'green';
        $pathology = null;

        if ($valuationRatio <= 1.25) {
            $semaphore = 'green'; // Justa o Atractiva
        } elseif ($valuationRatio <= 2.2 && $operationalScore >= 0) {
            $semaphore = 'yellow'; // Ambiciosa Respaldada
        } else {
            $semaphore = 'red'; // Pretenciosa
            // Detect pathology
            if ($ebitda <= 0 && $valuationRatio > 5) {
                $pathology = 'Alucinación VC: Proyección sin validación de tracción comercial';
            } elseif ($totalDebt > $revenue * 0.6) {
                $pathology = 'Amnesia de Pasivos: Exige valuación alta ignorando pasivos asfixiantes';
            } elseif ($grossMargin < 30) {
                $pathology = 'Márgenes Asfixiados: Costos operativos carcomen la rentabilidad';
            } else {
                $pathology = 'Ficción del Múltiplo: Múltiplo exigido excede la realidad del sector';
            }
        }

        // 5. Shark Tank Counter-Offer Simulation
        $counterEquity = min(49.0, max(15.0, round(($askAmount / max($calculatedValuation, 1)) * 100, 1)));
        $counterValuation = $counterEquity > 0 ? ($askAmount / ($counterEquity / 100)) : $calculatedValuation;

        // Sharks dialogue
        $sharkQuotes = [
            'arturo' => $semaphore === 'green'
                ? '¡Me encanta! Números claros, sin mentiras. Tienes una propuesta sólida y estoy listo para hacer una oferta.'
                : ($semaphore === 'yellow'
                    ? 'Está cara, pero veo que tienes buena retención. Te ofrezco el dinero, pero quiero el '.$counterEquity.'% de tu empresa.'
                    : '¡Estás loco! Estás valuando castillos en el aire. Con esa deuda y ese múltiplo inflado... ¡Estoy fuera!'),
            'patricia' => $semaphore === 'green'
                ? 'Tus métricas de CAC y retención son excepcionales. Esta empresa puede escalar 10x.'
                : ($semaphore === 'yellow'
                    ? 'Veo potencial tecnológico, pero tu valuación implícita de '.number_format($implicitValuation).' se adelanta 3 años a tus números.'
                    : 'Tu costo de adquisición y quema de capital son insostenibles. No entiendo cómo llegaste a este número. ¡Estoy fuera!'),
            'carlos' => 'En el sector de '.$industry->name.', las empresas reales cotizan a '.round($industry->default_ebitda_multiple, 1).'x EBITDA. Tu valuación implícita exige '.round($ebitda > 0 ? ($implicitValuation / $ebitda) : ($implicitValuation / max($revenue, 1)), 1).'x.',
        ];

        return [
            'implicit_valuation' => round($implicitValuation, 2),
            'calculated_valuation' => round($calculatedValuation, 2),
            'valuation_ratio' => round($valuationRatio, 2),
            'semaphore' => $semaphore,
            'pathology' => $pathology,
            'operational_score' => $operationalScore,
            'adjustments' => $adjustments,
            'estimated_net_income' => round(max(0, $ebitda * 0.70), 2),
            'counter_offer' => [
                'equity' => $counterEquity,
                'valuation' => round($counterValuation, 2),
                'ask_amount' => $askAmount,
            ],
            'primary_feedback' => match ($semaphore) {
                'green' => 'Valuación Justa o Atractiva: Tu oferta está sustentada con ventas comprobadas, balance sano y múltiplos alineados a tu sector.',
                'yellow' => 'Valuación Ambiciosa Respaldada: Tu precio está por encima del promedio, pero tus métricas operativas y retención justifican defender tu valor.',
                'red' => 'Valuación Pretenciosa: Tu petición de capital está desconectada de tus números actuales. Los inversionistas exigirán un castigo severo o te rechazarán.',
            },
            'shark_dialogues' => $sharkQuotes,
        ];
    }
}
