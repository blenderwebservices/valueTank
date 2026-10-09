<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ValuationPitch extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'ask_amount' => 'float',
        'equity_offered' => 'float',
        'implicit_valuation' => 'float',
        'annual_revenue' => 'float',
        'annual_ebitda' => 'float',
        'annual_net_income' => 'float',
        'gross_margin_percent' => 'float',
        'cac' => 'float',
        'ltv' => 'float',
        'repurchase_rate' => 'float',
        'total_debt' => 'float',
        'net_assets' => 'float',
        'calculated_valuation' => 'float',
        'counter_offer_equity' => 'float',
        'counter_offer_valuation' => 'float',
    ];

    public function industry(): BelongsTo
    {
        return $this->belongsTo(Industry::class);
    }
}
