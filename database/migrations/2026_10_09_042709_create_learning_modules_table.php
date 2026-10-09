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
        Schema::create('learning_modules', function (Blueprint $table) {
            $table->id();
            $table->integer('order')->default(1);
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('category')->default('fundamentos'); // fundamentos, metodos, operativo, negociacion
            $table->text('summary');
            $table->longText('content_markdown');
            $table->text('key_takeaway');
            $table->string('icon')->default('BookOpen');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_modules');
    }
};
