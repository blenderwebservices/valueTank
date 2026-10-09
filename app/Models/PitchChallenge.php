<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PitchChallenge extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'ask_amount' => 'float',
        'equity_offered' => 'float',
        'revenue' => 'float',
        'ebitda' => 'float',
        'gross_margin' => 'float',
        'cac' => 'float',
        'repurchase_rate' => 'float',
        'total_debt' => 'float',
        'reward_xp' => 'integer',
    ];

    public function getImplicitValuationAttribute(): float
    {
        return $this->equity_offered > 0 ? ($this->ask_amount / ($this->equity_offered / 100)) : 0;
    }
}
