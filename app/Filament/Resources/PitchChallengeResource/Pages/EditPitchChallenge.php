<?php

namespace App\Filament\Resources\PitchChallengeResource\Pages;

use App\Filament\Resources\PitchChallengeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPitchChallenge extends EditRecord
{
    protected static string $resource = PitchChallengeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
