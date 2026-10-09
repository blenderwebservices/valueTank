<?php

namespace App\Filament\Resources\LearningModuleResource\Pages;

use App\Filament\Resources\LearningModuleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLearningModule extends EditRecord
{
    protected static string $resource = LearningModuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
