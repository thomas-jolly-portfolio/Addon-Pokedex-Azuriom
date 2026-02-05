@extends('admin.layouts.admin')

@section('title', 'Configuration du Pokédex')

@section('content')
    <div class="card shadow mb-4">
        <div class="card-body">
            <form action="{{ route('pokedex.admin.settings.save') }}" method="POST">
                @csrf

                <div class="row">
                    {{-- PERFORMANCE --}}
                    <div class="col-md-12 mb-4">
                        <h5 class="font-weight-bold text-primary">Performance</h5>
                        <hr>
                    </div>

                    <div class="form-group col-md-6">
                        <label for="pokedex_items_per_page">Pokémon par page (Lazy Loading)</label>
                        <input type="number" class="form-control" id="pokedex_items_per_page" name="pokedex_items_per_page" value="{{ $items_per_page }}" required>
                        <small class="form-text text-muted">Défaut: 30. Plus ce nombre est élevé, plus la page sera lourde.</small>
                    </div>

                    <div class="form-group col-md-6">
                        <label for="pokedex_loading_batch_size">Taille des paquets de chargement (Batch Size)</label>
                        <input type="number" class="form-control" id="pokedex_loading_batch_size" name="pokedex_loading_batch_size" value="{{ $loading_batch_size }}" required>
                        <small class="form-text text-muted">Défaut: 50. Nombre de fichiers JSON chargés en simultané.</small>
                    </div>

                    <div class="form-group col-md-6">
                        <label for="pokedex_cache_duration">Durée du Cache (Secondes)</label>
                        <input type="number" class="form-control" id="pokedex_cache_duration" name="pokedex_cache_duration" value="{{ $cache_duration }}" required>
                        <small class="form-text text-muted">0 pour désactiver. Recommandé: 3600 (1 heure).</small>
                    </div>

                    {{-- GAMEPLAY --}}
                    <div class="col-md-12 mb-4 mt-4">
                        <h5 class="font-weight-bold text-primary">Simulateurs & Gameplay</h5>
                        <hr>
                    </div>

                    <div class="form-group col-md-6">
                        <label for="pokedex_shiny_rate">Taux de Shiny (Simulateur d'œuf)</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">1 /</span>
                            </div>
                            <input type="number" class="form-control" id="pokedex_shiny_rate" name="pokedex_shiny_rate" value="{{ $shiny_rate }}" required>
                        </div>
                        <small class="form-text text-muted">Défaut Pixelmon: 4096.</small>
                    </div>

                    <div class="form-group col-md-6 d-flex align-items-center">
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="pokedex_enable_simulators" name="pokedex_enable_simulators" @if($enable_simulators) checked @endif>
                            <label class="custom-control-label" for="pokedex_enable_simulators">Activer les simulateurs (Capture / Repro)</label>
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Enregistrer
                    </button>
                </div>
            </form>
        </div>
    </div>
@endsection