<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PitchChallengeResource\Pages;
use App\Models\PitchChallenge;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PitchChallengeResource extends Resource
{
    protected static ?string $model = PitchChallenge::class;

    protected static ?string $navigationIcon = 'heroicon-o-trophy';

    protected static ?string $navigationLabel = 'Desafíos / Pitch Arena';

    protected static ?string $navigationGroup = 'Gamificación & Aprendizaje';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->label('Título del Reto')
                    ->required(),
                Forms\Components\TextInput::make('company_name')
                    ->label('Nombre de Empresa')
                    ->required(),
                Forms\Components\TextInput::make('industry_name')
                    ->label('Industria')
                    ->required(),
                Forms\Components\Select::make('difficulty')
                    ->label('Dificultad')
                    ->options([
                        'facil' => 'Fácil',
                        'medio' => 'Medio',
                        'avanzado' => 'Avanzado',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('story')
                    ->label('Historia y Pitch del Emprendedor')
                    ->columnSpanFull()
                    ->required(),
                Forms\Components\TextInput::make('ask_amount')
                    ->label('Monto Solicitado ($)')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('equity_offered')
                    ->label('% Ofrecido')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('revenue')
                    ->label('Ventas Anuales ($)')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('ebitda')
                    ->label('EBITDA ($)')
                    ->numeric()
                    ->required(),
                Forms\Components\Select::make('expected_semaphore')
                    ->label('Semáforo Esperado')
                    ->options([
                        'green' => '🟢 Justa',
                        'yellow' => '🟡 Ambiciosa',
                        'red' => '🔴 Pretenciosa',
                    ])
                    ->required(),
                Forms\Components\Select::make('correct_shark_verdict')
                    ->label('Veredicto Correcto')
                    ->options([
                        'deal' => '¡Hay trato! (Oferta aceptada)',
                        'counter' => 'Contraoferta agresiva',
                        'out' => '¡Estoy fuera!',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('explanation')
                    ->label('Explicación y Lección Pedagógica')
                    ->columnSpanFull()
                    ->required(),
                Forms\Components\TextInput::make('reward_xp')
                    ->label('Puntos XP')
                    ->numeric()
                    ->default(150),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Reto')
                    ->searchable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('company_name')
                    ->label('Empresa'),
                Tables\Columns\TextColumn::make('industry_name')
                    ->label('Sector')
                    ->badge(),
                Tables\Columns\TextColumn::make('difficulty')
                    ->label('Dificultad')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'facil' => 'success',
                        'medio' => 'warning',
                        'avanzado' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('expected_semaphore')
                    ->label('Semáforo')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'green' => 'success',
                        'yellow' => 'warning',
                        'red' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('reward_xp')
                    ->label('XP')
                    ->suffix(' XP')
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPitchChallenges::route('/'),
            'create' => Pages\CreatePitchChallenge::route('/create'),
            'edit' => Pages\EditPitchChallenge::route('/{record}/edit'),
        ];
    }
}
