<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('valuation_pitches', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('founder_name')->nullable();
            $table->foreignId('industry_id')->nullable()->constrained()->nullOnDelete();
            $table->string('stage')->default('crecimiento'); // semilla, crecimiento, madura
            
            // Pitch Asks
            $table->decimal('ask_amount', 14, 2); // Monto solicitado
            $table->decimal('equity_offered', 5, 2); // % ofrecido
            $table->decimal('implicit_valuation', 14, 2); // Valuacion implicita
            
            // Financial Engine Metrics
            $table->decimal('annual_revenue', 14, 2)->default(0);
            $table->decimal('annual_ebitda', 14, 2)->default(0);
            $table->decimal('annual_net_income', 14, 2)->default(0);
            $table->decimal('gross_margin_percent', 5, 2)->default(50);
            $table->decimal('cac', 10, 2)->default(0);
            $table->decimal('ltv', 10, 2)->default(0);
            $table->decimal('repurchase_rate', 5, 2)->default(0);
            $table->decimal('total_debt', 14, 2)->default(0);
            $table->decimal('net_assets', 14, 2)->default(0);
            
            // Method and Results
            $table->string('valuation_method')->default('multiplos'); // multiplos, dcf, libros, vc
            $table->decimal('calculated_valuation', 14, 2)->default(0);
            $table->string('semaphore_status')->default('green'); // green, yellow, red
            $table->text('diagnosis_notes')->nullable();
            $table->decimal('counter_offer_equity', 5, 2)->nullable();
            $table->decimal('counter_offer_valuation', 14, 2)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valuation_pitches');
    }
};
