<?php

use Azuriom\Plugin\Pokedex\Controllers\Admin\SettingController;
use Azuriom\Plugin\Pokedex\Controllers\Admin\EditorController;
use Illuminate\Support\Facades\Route;

// Routes existantes (Settings)
Route::get('/settings', [SettingController::class, 'show'])->name('settings');
Route::post('/settings', [SettingController::class, 'save'])->name('settings.save');

// --- NOUVELLES ROUTES POUR L'ÉDITEUR ---
Route::prefix('editor')->name('editor.')->group(function () {
    // La page principale
    Route::get('/', [EditorController::class, 'index'])->name('index');
    
    // Les API internes de l'éditeur (Sécurisées Admin)
    Route::get('/api/list', [EditorController::class, 'listFiles'])->name('list');
    Route::get('/api/load/{filename}', [EditorController::class, 'loadFile'])->name('load');
    Route::post('/api/save/{filename}', [EditorController::class, 'saveFile'])->name('save');
    Route::post('/api/upload', [EditorController::class, 'uploadImage'])->name('upload');
});