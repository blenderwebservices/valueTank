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
        Schema::create('pitch_challenges', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('company_name');
            $table->string('industry_name');
            $table->string('stage'); // semilla, crecimiento, madura
            $table->text('story');
            $table->decimal('ask_amount', 14, 2);
            $table->decimal('equity_offered', 5, 2);
            $table->decimal('revenue', 14, 2);
            $table->decimal('ebitda', 14, 2);
            $table->decimal('gross_margin', 5, 2);
            $table->decimal('cac', 10, 2);
            $table->decimal('repurchase_rate', 5, 2);
            $table->decimal('total_debt', 14, 2);
            $table->string('expected_semaphore'); // green, yellow, red
            $table->string('correct_shark_verdict'); // deal, counter, out
            $table->text('explanation');
            $table->string('difficulty')->default('medio'); // facil, medio, avanzado
            $table->integer('reward_xp')->default(150);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pitch_challenges');
    }
};
