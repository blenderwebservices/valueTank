<?php

namespace App\Filament\Resources\PitchChallengeResource\Pages;

use App\Filament\Resources\PitchChallengeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPitchChallenges extends ListRecords
{
    protected static string $resource = PitchChallengeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
