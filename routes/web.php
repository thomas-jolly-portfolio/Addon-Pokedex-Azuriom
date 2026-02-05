<?php

use Azuriom\Plugin\Pokedex\Controllers\PokedexController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {

    Route::get('lang/{lang}', function ($lang) {
    if (in_array($lang, ['fr', 'en', 'es'])) { // Sécurité : n'accepte que ces langues
        session(['locale' => $lang]);
    }
    return back();
})->name('language.set');
    
    Route::get('/pokedex', [PokedexController::class, 'index'])->name('pokedex.index');
    
    // --- NOUVELLE ROUTE POUR LE GÉNÉRATEUR ---
    Route::get('/pokedex/generate-json', [PokedexController::class, 'generateBigJson'])->name('generate-json');

    Route::prefix('api/pokedex')->name('pokedex.api.')->group(function () {
        Route::get('/list', [PokedexController::class, 'listFiles'])->name('list');
        Route::get('/pokemon/{name}', [PokedexController::class, 'getPokemon'])->name('get');
    });
});