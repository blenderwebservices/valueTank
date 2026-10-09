<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LearningModuleResource\Pages;
use App\Models\LearningModule;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class LearningModuleResource extends Resource
{
    protected static ?string $model = LearningModule::class;

    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    protected static ?string $navigationLabel = 'El Código de la Valuación (Lecciones)';

    protected static ?string $navigationGroup = 'Gamificación & Aprendizaje';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('order')
                    ->label('Número de Lección')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('title')
                    ->label('Título')
                    ->required(),
                Forms\Components\TextInput::make('subtitle')
                    ->label('Subtítulo'),
                Forms\Components\Select::make('category')
                    ->label('Categoría')
                    ->options([
                        'fundamentos' => 'Fundamentos & Oferta Implícita',
                        'metodos' => 'Métodos Formales de Valuación',
                        'operativo' => 'Métricas Operativas & Salud',
                        'negociacion' => 'Negociación en el Tanque',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('summary')
                    ->label('Resumen Ejecutivo')
                    ->columnSpanFull()
                    ->required(),
                Forms\Components\MarkdownEditor::make('content_markdown')
                    ->label('Contenido Completo (Markdown)')
                    ->columnSpanFull()
                    ->required(),
                Forms\Components\Textarea::make('key_takeaway')
                    ->label('Lección Clave / Takeaway')
                    ->columnSpanFull()
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order')
                    ->label('#')
                    ->sortable(),
                Tables\Columns\TextColumn::make('title')
                    ->label('Lección')
                    ->searchable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('category')
                    ->label('Categoría')
                    ->badge(),
                Tables\Columns\TextColumn::make('key_takeaway')
                    ->label('Conclusión Clave')
                    ->limit(50),
            ])
            ->defaultSort('order', 'asc')
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLearningModules::route('/'),
            'create' => Pages\CreateLearningModule::route('/create'),
            'edit' => Pages\EditLearningModule::route('/{record}/edit'),
        ];
    }
}
