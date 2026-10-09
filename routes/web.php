<?php

use App\Http\Controllers\ValuationController;
use Illuminate\Support\Facades\Route;

// Main SPA entry point
Route::get('/', function () {
    return view('app');
});

// Reactive API Endpoints for React Frontend
Route::prefix('api')->group(function () {
    Route::get('/initial-data', [ValuationController::class, 'getInitialData']);
    Route::post('/evaluate', [ValuationController::class, 'evaluate']);
    Route::post('/pitches', [ValuationController::class, 'store']);
    Route::post('/verify-challenge', [ValuationController::class, 'verifyChallenge']);
});
