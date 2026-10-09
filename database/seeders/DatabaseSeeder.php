<?php

namespace Database\Seeders;

use App\Models\Industry;
use App\Models\LearningModule;
use App\Models\PitchChallenge;
use App\Models\User;
use App\Models\ValuationPitch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::updateOrCreate(
            ['email' => 'admin@valuetank.test'],
            [
                'name' => 'Tiburón Maestro',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // 1. Industries
        $industries = [
            [
                'name' => 'Software SaaS & Cloud',
                'slug' => 'saas',
                'description' => 'Suscripciones recurrentes B2B/B2C con alto margen bruto y escalabilidad sin costo marginal.',
                'default_ebitda_multiple' => 9.0,
                'min_ebitda_multiple' => 6.0,
                'max_ebitda_multiple' => 15.0,
                'default_revenue_multiple' => 4.5,
                'typical_gross_margin' => 78.0,
                'typical_net_margin' => 22.0,
                'icon' => 'Cpu',
            ],
            [
                'name' => 'E-Commerce & Marcas D2C',
                'slug' => 'ecommerce',
                'description' => 'Ventas digitales directas al consumidor. Alta dependencia del CAC y la recompra recurrente.',
                'default_ebitda_multiple' => 4.5,
                'min_ebitda_multiple' => 3.0,
                'max_ebitda_multiple' => 7.0,
                'default_revenue_multiple' => 1.5,
                'typical_gross_margin' => 48.0,
                'typical_net_margin' => 12.0,
                'icon' => 'ShoppingBag',
            ],
            [
                'name' => 'Alimentos, Bebidas y Gastronomía',
                'slug' => 'alimentos',
                'description' => 'Restaurantes, productos empaquetados (CPG) y franquicias. Mercado preferido en Shark Tank.',
                'default_ebitda_multiple' => 4.0,
                'min_ebitda_multiple' => 2.5,
                'max_ebitda_multiple' => 6.5,
                'default_revenue_multiple' => 0.9,
                'typical_gross_margin' => 58.0,
                'typical_net_margin' => 14.0,
                'icon' => 'Utensils',
            ],
            [
                'name' => 'Retail y Cadena Comercial',
                'slug' => 'retail',
                'description' => 'Comercio físico minorista, distribución y puntos de venta tradicionales.',
                'default_ebitda_multiple' => 3.5,
                'min_ebitda_multiple' => 2.0,
                'max_ebitda_multiple' => 5.5,
                'default_revenue_multiple' => 0.7,
                'typical_gross_margin' => 38.0,
                'typical_net_margin' => 8.0,
                'icon' => 'Store',
            ],
            [
                'name' => 'Manufactura e Industrial',
                'slug' => 'manufactura',
                'description' => 'Plantas de transformación, maquinaria pesada y producción con fuerte base de activos físicos.',
                'default_ebitda_multiple' => 5.0,
                'min_ebitda_multiple' => 3.5,
                'max_ebitda_multiple' => 7.5,
                'default_revenue_multiple' => 1.0,
                'typical_gross_margin' => 35.0,
                'typical_net_margin' => 10.0,
                'icon' => 'Factory',
            ],
            [
                'name' => 'Salud, Farma y Biotecnología',
                'slug' => 'salud',
                'description' => 'Servicios clínicos, dispositivos médicos o laboratorios de alta barrera de entrada.',
                'default_ebitda_multiple' => 8.0,
                'min_ebitda_multiple' => 5.0,
                'max_ebitda_multiple' => 13.0,
                'default_revenue_multiple' => 3.0,
                'typical_gross_margin' => 65.0,
                'typical_net_margin' => 18.0,
                'icon' => 'Activity',
            ],
        ];

        foreach ($industries as $ind) {
            Industry::updateOrCreate(['slug' => $ind['slug']], $ind);
        }

        // 2. Learning Modules (El Código de la Valuación)
        $modules = [
            [
                'order' => 1,
                'category' => 'fundamentos',
                'title' => 'La Matemática de la Oferta Implícita',
                'subtitle' => 'Tu petición es una declaración jurada del valor de tu empresa',
                'summary' => 'Cada vez que pides capital cediendo un porcentaje, fijas matemáticamente la valuación de tu compañía.',
                'content_markdown' => "### La Sombra Matemática\n\nCuando dices: *'Pido $1,000,000 MXN por el 10% de mi empresa'*, no estás pidiendo solo un millón; estás declarando formalmente que tu empresa completa vale **$10,000,000 MXN**.\n\n$$\\text{Valuación Implícita} = \\frac{\\text{Monto Solicitado}}{\\text{Porcentaje Ofrecido}}$$\n\n**Ejemplo:**\n- Petición: $1,000,000 MXN\n- Equity: 10% (0.10)\n- Valuación: $10,000,000 MXN.\n\nSi tus ventas son de solo $500,000 MXN al año, estás exigiendo un múltiplo de **20 veces ventas**, lo cual disparará todas las alarmas en el tanque.",
                'key_takeaway' => 'Conoce tu valuación implícita de memoria antes de pronunciar una sola palabra frente a los inversionistas.',
                'icon' => 'Calculator',
            ],
            [
                'order' => 2,
                'category' => 'metodos',
                'title' => 'Los 4 Métodos Formales de Valuación',
                'subtitle' => 'La ciencia financiera detrás del precio',
                'summary' => 'Compara Múltiplos de Mercado, Flujo Descontado (DCF), Valor en Libros y el Método Venture Capital (VC).',
                'content_markdown' => "### 1. Múltiplos de Mercado (El favorito en Shark Tank)\nMultiplica una métrica clave (Ventas o EBITDA) por un múltiplo promedio de transacciones recientes en tu sector.\n\n### 2. Flujo de Caja Descontado (DCF)\nProyecta el efectivo neto a 5 años y calcula su valor presente aplicando una tasa de descuento por riesgo (WACC). Ideal para empresas maduras y predecibles.\n\n### 3. Valor de los Activos (Valor en Libros)\nSuma de todos los bienes tangibles menos todas las deudas y pasivos. Ideal para empresas industriales o en liquidación.\n\n### 4. Método VC (Capital de Riesgo)\nEstima el valor de salida (Exit en 5-7 años) y calcula hacia atrás el porcentaje necesario para otorgar un retorno de 10x al fondo de inversión.",
                'key_takeaway' => 'Usa el método adecuado para tu etapa: Startups semilla usan VC/Múltiplos tempranos; empresas en crecimiento usan EBITDA/DCF.',
                'icon' => 'TrendingUp',
            ],
            [
                'order' => 3,
                'category' => 'operativo',
                'title' => 'El Efecto Multiplicador: Métricas Operativas',
                'subtitle' => 'Por qué dos empresas con las mismas ventas valen muy diferente',
                'summary' => 'Márgenes de ganancia, CAC, retención y deuda dictan si recibes un múltiplo premium o una penalización brutal.',
                'content_markdown' => "### El Caso de las Dos Empresas\n\n- **Empresa A:** Ventas $5M, Deuda CERO, Margen Neto 25%, CAC Bajo, Recompra 70%.\n- **Empresa B:** Ventas $5M, Deuda Alta, Margen Neto 4%, CAC Elevado, Recompra 10%.\n\nAunque ambas facturan $5,000,000 MXN, la **Empresa A** obtendrá un múltiplo de 8x EBITDA ($10M+ de valor), mientras que la **Empresa B** sufrirá penalizaciones destructivas y no conseguirá oferta.",
                'key_takeaway' => 'La deuda cero y la fidelidad de clientes (retención) son los dos mayores aceleradores de múltiplos.',
                'icon' => 'ShieldCheck',
            ],
            [
                'order' => 4,
                'category' => 'negociacion',
                'title' => 'El Semáforo del Inversionista',
                'subtitle' => 'Diagnóstico en tiempo real: ¿Justa, Ambiciosa o Pretenciosa?',
                'summary' => 'Aprende a clasificar tu oferta antes de que un tiburón te destruya en televisión nacional.',
                'content_markdown' => "### 🟢 Valuación Justa o Atractiva\nRespaldada por ventas reales, múltiplos dentro del rango del sector y balance saludable.\n\n### 🟡 Valuación Ambiciosa Respaldada\nPor encima de la media de la industria, pero sólidamente justificada por un foso defensivo (moat), márgenes récord o un CAC ínfimo.\n\n### 🔴 Valuación Pretenciosa\nCompletamente desvinculada de la realidad operativa. Supone crecimientos milagrosos, ignora pasivos o inventa múltiplos sin sustento.",
                'key_takeaway' => 'Si tu semáforo marca rojo, ajusta tu porcentaje antes de entrar a negociar o saldrás sin nada.',
                'icon' => 'AlertTriangle',
            ],
            [
                'order' => 5,
                'category' => 'negociacion',
                'title' => 'Radiografía de una Valuación Pretenciosa',
                'subtitle' => 'Las 4 trampas mortales que enfurecen a los inversionistas',
                'summary' => 'Ficción del Múltiplo, Márgenes Asfixiados, Amnesia de Pasivos y Alucinación VC.',
                'content_markdown' => "### Las 4 Patologías del Pitch:\n1. **Ficción del Múltiplo:** Pedir múltiplos de Silicon Valley (20x) para un negocio tradicional de retail.\n2. **Márgenes Asfixiados:** Presumir ventas millonarias mientras te queda 2% de ganancia neta.\n3. **Amnesia de Pasivos:** Ocultar créditos bancarios o pasivos laborales en el balance.\n4. **Alucinación VC:** Presentar proyecciones exponenciales tipo hockey-stick sin validación de tracción.",
                'key_takeaway' => 'Los inversionistas perdonan números pequeños, pero jamás perdonan la falta de honestidad o métricas infladas.',
                'icon' => 'Skull',
            ],
            [
                'order' => 6,
                'category' => 'negociacion',
                'title' => 'El Escuadrón de Respaldo: Mentores vs Asesores',
                'subtitle' => 'Cuándo necesitas un consejero y cuándo un auditor técnico',
                'summary' => 'Diferencias clave entre fundadores exitosos y consultores financieros, y cómo compensarlos (FAST agreements).',
                'content_markdown' => "### Mentor (Founder con Experiencia)\n- **Enfoque:** Visión holística, contactos y perspectiva de vida.\n- **Etapa:** Semilla y validación.\n- **Compensación:** Voluntaria o 0.25% - 1.0% de equity con vesting a 1-2 años (Contrato FAST).\n\n### Asesor Financiero (Consultor Técnico)\n- **Enfoque:** Modelos financieros, DCF, due diligence, estructuración pre-ronda.\n- **Etapa:** Crecimiento y Serie A.\n- **Compensación:** Honorarios fijos, iguala mensual (retainer) o éxito.",
                'key_takeaway' => 'Arma un consejo asesor temprano con contratos FAST estandarizados para no regalar acciones.',
                'icon' => 'Users',
            ],
        ];

        foreach ($modules as $mod) {
            LearningModule::updateOrCreate(['order' => $mod['order']], $mod);
        }

        // 3. Pitch Challenges (Gamified Arena)
        $challenges = [
            [
                'title' => 'Salsa Habanero Maya: El Pitch Tradicional',
                'company_name' => 'Salsas El Maya',
                'industry_name' => 'Alimentos y Bebidas',
                'stage' => 'crecimiento',
                'story' => 'El fundador pide $1,500,000 MXN por el 10% ($15,000,000 MXN de valuación). Vende en 120 supermercados locales con ventas de $2.4M anuales y EBITDA de $280,000 MXN. Margen bruto del 52%, pero tiene una deuda bancaria de $900,000 MXN.',
                'ask_amount' => 1500000,
                'equity_offered' => 10,
                'revenue' => 2400000,
                'ebitda' => 280000,
                'gross_margin' => 52,
                'cac' => 45,
                'repurchase_rate' => 60,
                'total_debt' => 900000,
                'expected_semaphore' => 'red',
                'correct_shark_verdict' => 'counter',
                'explanation' => 'A $15M de valuación implícita con solo $280k de EBITDA, está pidiendo más de 53x EBITDA en una industria donde el promedio es 4x. Con deuda alta de $900k, los tiburones sólo entrarían por mínimo 35%-40% o regalías.',
                'difficulty' => 'facil',
                'reward_xp' => 100,
            ],
            [
                'title' => 'TrackLogistics: El SaaS B2B Imparable',
                'company_name' => 'TrackLogistics',
                'industry_name' => 'Software SaaS & Cloud',
                'stage' => 'crecimiento',
                'story' => 'La fundadora pide $2,500,000 MXN por el 12% ($20.8M de valuación implícita). Plataforma de monitoreo de flotas con $5,800,000 MXN en ventas anuales recurrentes (ARR) y EBITDA de $1,900,000 MXN. Margen bruto del 81%, CAC de $280 con LTV de $3,200 (11x ratio), deuda CERO y retención neta de 96%.',
                'ask_amount' => 2500000,
                'equity_offered' => 12,
                'revenue' => 5800000,
                'ebitda' => 1900000,
                'gross_margin' => 81,
                'cac' => 280,
                'repurchase_rate' => 96,
                'total_debt' => 0,
                'expected_semaphore' => 'green',
                'correct_shark_verdict' => 'deal',
                'explanation' => '¡Una joya de inversión! Valuación implícita de 10.9x EBITDA en SaaS con retención del 96%, cero deuda y márgenes superiores al 80%. Valuación muy justa y atractiva. Todos los tiburones pelearán la oferta.',
                'difficulty' => 'medio',
                'reward_xp' => 150,
            ],
            [
                'title' => 'EcoWheels: Fábrica de Bicis Urbanas',
                'company_name' => 'EcoWheels Industrial',
                'industry_name' => 'Manufactura e Industrial',
                'stage' => 'madura',
                'story' => 'Piden $3,000,000 MXN por el 25% ($12,000,000 MXN de valuación). Tienen bodega propia y maquinaria valuada en libros en $9,500,000 MXN. Sus ventas son de $4,000,000 MXN con EBITDA bajo de $400,000 MXN debido a cuellos de botella operativos. Deuda de $1,200,000 MXN.',
                'ask_amount' => 3000000,
                'equity_offered' => 25,
                'revenue' => 4000000,
                'ebitda' => 400000,
                'gross_margin' => 38,
                'cac' => 500,
                'repurchase_rate' => 15,
                'total_debt' => 1200000,
                'expected_semaphore' => 'yellow',
                'correct_shark_verdict' => 'counter',
                'explanation' => 'Valuación ambiciosa por múltiplos de ganancia (30x EBITDA), pero fuertemente respaldada por activos tangibles ($8.3M valor en libros neto). Un tiburón industrial ofrecerá estructurar deuda convertible con garantía en maquinaria.',
                'difficulty' => 'medio',
                'reward_xp' => 200,
            ],
            [
                'title' => 'UltraFast: Quema Desenfrenada en Quick-Commerce',
                'company_name' => 'UltraFast Delivery',
                'industry_name' => 'E-Commerce & Marcas D2C',
                'stage' => 'semilla',
                'story' => 'El equipo pide $8,000,000 MXN por el 5% ($160,000,000 MXN de valuación implícita). Entregas en 10 minutos. Tienen $12,000,000 MXN en ventas brutas pero EBITDA negativo de -$18,000,000 MXN. El CAC es de $450 pero el ticket promedio es de $120. Deuda en líneas revolventes de $6,000,000 MXN.',
                'ask_amount' => 8000000,
                'equity_offered' => 5,
                'revenue' => 12000000,
                'ebitda' => -18000000,
                'gross_margin' => 14,
                'cac' => 450,
                'repurchase_rate' => 25,
                'total_debt' => 6000000,
                'expected_semaphore' => 'red',
                'correct_shark_verdict' => 'out',
                'explanation' => 'Alucinación VC clásica. Cada pedido genera pérdida operativa, el CAC quema todo el margen y la valuación de $160M está en la estratósfera. Veredicto: ¡Están fuera!',
                'difficulty' => 'avanzado',
                'reward_xp' => 250,
            ],
        ];

        foreach ($challenges as $ch) {
            PitchChallenge::updateOrCreate(['company_name' => $ch['company_name']], $ch);
        }

        // 4. Sample Valuation Pitch
        $techIndustry = Industry::where('slug', 'saas')->first();
        ValuationPitch::create([
            'company_name' => 'DemoTech Solutions',
            'founder_name' => 'Ana Laura García',
            'industry_id' => $techIndustry?->id,
            'stage' => 'crecimiento',
            'ask_amount' => 1000000,
            'equity_offered' => 10,
            'implicit_valuation' => 10000000,
            'annual_revenue' => 3500000,
            'annual_ebitda' => 1100000,
            'annual_net_income' => 750000,
            'gross_margin_percent' => 75,
            'cac' => 350,
            'ltv' => 2800,
            'repurchase_rate' => 88,
            'total_debt' => 0,
            'net_assets' => 2500000,
            'valuation_method' => 'multiplos',
            'calculated_valuation' => 9900000,
            'semaphore_status' => 'green',
            'diagnosis_notes' => 'Valuación justa y respaldada por 9.0x EBITDA y márgenes sanos con deuda cero.',
            'counter_offer_equity' => 12.0,
            'counter_offer_valuation' => 8333333,
        ]);
    }
}
