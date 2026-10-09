<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ValuationPitchResource\Pages;
use App\Models\ValuationPitch;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ValuationPitchResource extends Resource
{
    protected static ?string $model = ValuationPitch::class;

    protected static ?string $navigationIcon = 'heroicon-o-presentation-chart-line';

    protected static ?string $navigationLabel = 'Pitches & Valuaciones';

    protected static ?string $navigationGroup = 'Gestión ValuaTank';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Información del Emprendimiento')
                    ->columns(2)
                    ->schema([
                        Forms\Components\TextInput::make('company_name')
                            ->label('Empresa')
                            ->required(),
                        Forms\Components\TextInput::make('founder_name')
                            ->label('Fundador(a)'),
                        Forms\Components\Select::make('industry_id')
                            ->label('Sector')
                            ->relationship('industry', 'name')
                            ->required(),
                        Forms\Components\Select::make('stage')
                            ->label('Etapa')
                            ->options([
                                'semilla' => 'Etapa Semilla (Pre-Revenue / Validación)',
                                'crecimiento' => 'Crecimiento (Tracción / Expansión)',
                                'madura' => 'Madura / Consolidada',
                            ])
                            ->required(),
                    ]),

                Forms\Components\Section::make('La Oferta Implícita (Pitch Ask)')
                    ->columns(3)
                    ->schema([
                        Forms\Components\TextInput::make('ask_amount')
                            ->label('Capital Solicitado ($ MXN)')
                            ->numeric()
                            ->prefix('$')
                            ->required(),
                        Forms\Components\TextInput::make('equity_offered')
                            ->label('Equity Ofrecido (%)')
                            ->numeric()
                            ->suffix('%')
                            ->required(),
                        Forms\Components\TextInput::make('implicit_valuation')
                            ->label('Valuación Implícita ($ MXN)')
                            ->numeric()
                            ->prefix('$')
                            ->required(),
                    ]),

                Forms\Components\Section::make('Métricas Financieras y Operativas')
                    ->columns(3)
                    ->schema([
                        Forms\Components\TextInput::make('annual_revenue')
                            ->label('Ventas Anuales ($)')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\TextInput::make('annual_ebitda')
                            ->label('EBITDA Anual ($)')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\TextInput::make('gross_margin_percent')
                            ->label('Margen Bruto (%)')
                            ->numeric()
                            ->suffix('%'),
                        Forms\Components\TextInput::make('cac')
                            ->label('CAC ($)')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\TextInput::make('repurchase_rate')
                            ->label('Recompra / Retención (%)')
                            ->numeric()
                            ->suffix('%'),
                        Forms\Components\TextInput::make('total_debt')
                            ->label('Deuda Total ($)')
                            ->numeric()
                            ->prefix('$'),
                    ]),

                Forms\Components\Section::make('Diagnóstico del Tanque')
                    ->columns(3)
                    ->schema([
                        Forms\Components\Select::make('semaphore_status')
                            ->label('Semáforo del Inversionista')
                            ->options([
                                'green' => '🟢 Justa / Atractiva',
                                'yellow' => '🟡 Ambiciosa Respaldada',
                                'red' => '🔴 Pretenciosa',
                            ])
                            ->required(),
                        Forms\Components\TextInput::make('counter_offer_equity')
                            ->label('Contraoferta Equity (%)')
                            ->numeric()
                            ->suffix('%'),
                        Forms\Components\TextInput::make('counter_offer_valuation')
                            ->label('Valuación Contraoferta ($)')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\Textarea::make('diagnosis_notes')
                            ->label('Notas de Diagnóstico y Feedback de los Tiburones')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('company_name')
                    ->label('Empresa')
                    ->searchable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('industry.name')
                    ->label('Sector')
                    ->badge()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('ask_amount')
                    ->label('Solicitud')
                    ->money('MXN')
                    ->sortable(),
                Tables\Columns\TextColumn::make('equity_offered')
                    ->label('Equity')
                    ->suffix('%')
                    ->sortable(),
                Tables\Columns\TextColumn::make('implicit_valuation')
                    ->label('Valuación Implícita')
                    ->money('MXN')
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('semaphore_status')
                    ->label('Semáforo')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'green' => 'success',
                        'yellow' => 'warning',
                        'red' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'green' => 'Justa',
                        'yellow' => 'Ambiciosa',
                        'red' => 'Pretenciosa',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('semaphore_status')
                    ->label('Semáforo')
                    ->options([
                        'green' => 'Justa',
                        'yellow' => 'Ambiciosa',
                        'red' => 'Pretenciosa',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListValuationPitches::route('/'),
            'create' => Pages\CreateValuationPitch::route('/create'),
            'edit' => Pages\EditValuationPitch::route('/{record}/edit'),
        ];
    }
}
