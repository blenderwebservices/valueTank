<?php

namespace App\Filament\Resources;

use App\Filament\Resources\IndustryResource\Pages;
use App\Models\Industry;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class IndustryResource extends Resource
{
    protected static ?string $model = Industry::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office';

    protected static ?string $navigationLabel = 'Sectores y Múltiplos';

    protected static ?string $navigationGroup = 'Gestión ValuaTank';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nombre del Sector')
                    ->required(),
                Forms\Components\TextInput::make('slug')
                    ->required(),
                Forms\Components\Textarea::make('description')
                    ->label('Descripción')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('default_ebitda_multiple')
                    ->label('Múltiplo EBITDA Promedio')
                    ->numeric()
                    ->suffix('x')
                    ->required(),
                Forms\Components\TextInput::make('min_ebitda_multiple')
                    ->label('Múltiplo EBITDA Mínimo')
                    ->numeric()
                    ->suffix('x')
                    ->required(),
                Forms\Components\TextInput::make('max_ebitda_multiple')
                    ->label('Múltiplo EBITDA Máximo')
                    ->numeric()
                    ->suffix('x')
                    ->required(),
                Forms\Components\TextInput::make('default_revenue_multiple')
                    ->label('Múltiplo de Ventas')
                    ->numeric()
                    ->suffix('x')
                    ->required(),
                Forms\Components\TextInput::make('typical_gross_margin')
                    ->label('Margen Bruto Típico')
                    ->numeric()
                    ->suffix('%')
                    ->required(),
                Forms\Components\TextInput::make('typical_net_margin')
                    ->label('Margen Neto Típico')
                    ->numeric()
                    ->suffix('%')
                    ->required(),
                Forms\Components\TextInput::make('icon')
                    ->default('Briefcase'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Sector')
                    ->weight('bold')
                    ->searchable(),
                Tables\Columns\TextColumn::make('default_ebitda_multiple')
                    ->label('EBITDA Promedio')
                    ->suffix('x')
                    ->sortable(),
                Tables\Columns\TextColumn::make('default_revenue_multiple')
                    ->label('Ventas Promedio')
                    ->suffix('x')
                    ->sortable(),
                Tables\Columns\TextColumn::make('typical_gross_margin')
                    ->label('Margen Bruto')
                    ->suffix('%')
                    ->sortable(),
                Tables\Columns\TextColumn::make('pitches_count')
                    ->counts('pitches')
                    ->label('Pitches'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListIndustries::route('/'),
            'create' => Pages\CreateIndustry::route('/create'),
            'edit' => Pages\EditIndustry::route('/{record}/edit'),
        ];
    }
}
