<?php

namespace Azuriom\Plugin\Pokedex\Providers;

use Azuriom\Extensions\Plugin\BasePluginServiceProvider;
use Illuminate\Support\Facades\Route; // N'oubliez pas ça

class PokedexServiceProvider extends BasePluginServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        $pluginPath = __DIR__ . '/../../';

        $this->loadViewsFrom($pluginPath . 'resources/views', 'pokedex');
        $this->loadTranslationsFrom($pluginPath . 'resources/lang', 'pokedex');

        // Chargement des routes WEB
        $this->loadRoutesFrom($pluginPath . 'routes/web.php');

        // Chargement des routes ADMIN
        Route::prefix('admin/pokedex')
            ->middleware('admin-access') // Vérifie que c'est un admin
            ->name('pokedex.admin.')     // Préfixe de nom (ex: pokedex.admin.editor.index)
            ->group($pluginPath . 'routes/admin.php');
    }

    protected function routeDescriptions()
    {
        return [
            'pokedex.index' => 'pokedex::messages.route',
        ];
    }

    // Cette fonction est parfois nécessaire pour dire à Azuriom "J'ai des réglages admin"
    protected function adminNavigation()
    {
        return [
            'pokedex' => [
                'name' => 'Pokédex',
                'type' => 'dropdown',
                'icon' => 'fas fa-book',
                'route' => 'pokedex.admin.settings',
                'items' => [
                    'pokedex.admin.settings' => 'Paramètres',
                    'pokedex.admin.editor.index' => 'Éditeur JSON', // Lien vers l'éditeur
                ],
            ],
        ];
    }
}