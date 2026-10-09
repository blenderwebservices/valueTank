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
        Schema::create('industries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('default_ebitda_multiple', 8, 2)->default(5.0);
            $table->decimal('min_ebitda_multiple', 8, 2)->default(3.0);
            $table->decimal('max_ebitda_multiple', 8, 2)->default(10.0);
            $table->decimal('default_revenue_multiple', 8, 2)->default(2.5);
            $table->decimal('typical_gross_margin', 5, 2)->default(50.0);
            $table->decimal('typical_net_margin', 5, 2)->default(15.0);
            $table->string('icon')->default('Briefcase');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('industries');
    }
};
