<?php

namespace App\Filament\Resources\ValuationPitchResource\Pages;

use App\Filament\Resources\ValuationPitchResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditValuationPitch extends EditRecord
{
    protected static string $resource = ValuationPitchResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
