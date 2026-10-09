<?php

namespace App\Filament\Resources\ValuationPitchResource\Pages;

use App\Filament\Resources\ValuationPitchResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListValuationPitches extends ListRecords
{
    protected static string $resource = ValuationPitchResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
