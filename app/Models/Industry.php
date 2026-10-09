<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Industry extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'default_ebitda_multiple' => 'float',
        'min_ebitda_multiple' => 'float',
        'max_ebitda_multiple' => 'float',
        'default_revenue_multiple' => 'float',
        'typical_gross_margin' => 'float',
        'typical_net_margin' => 'float',
    ];

    public function pitches(): HasMany
    {
        return $this->hasMany(ValuationPitch::class);
    }
}
