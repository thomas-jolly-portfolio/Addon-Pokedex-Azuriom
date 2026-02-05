<?php

namespace Azuriom\Plugin\Pokedex\Controllers\Admin;

use Azuriom\Http\Controllers\Controller;
use Azuriom\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Affiche la page de configuration du Pokédex.
     */
    public function show()
    {
        return view('pokedex::admin.settings', [
            // On récupère les valeurs actuelles ou on met des valeurs par défaut
            'items_per_page' => setting('pokedex.items_per_page', 30),
            'cache_duration' => setting('pokedex.cache_duration', 3600),
            'shiny_rate' => setting('pokedex.shiny_rate', 4096),
            'loading_batch_size' => setting('pokedex.loading_batch_size', 50),
            'enable_simulators' => setting('pokedex.enable_simulators', true),
        ]);
    }

    /**
     * Sauvegarde les paramètres.
     */
    public function save(Request $request)
    {
        // Validation des données
        $validated = $this->validate($request, [
            'pokedex_items_per_page' => ['required', 'integer', 'min:10', 'max:100'],
            'pokedex_cache_duration' => ['required', 'integer', 'min:0'],
            'pokedex_shiny_rate' => ['required', 'integer', 'min:1'],
            'pokedex_loading_batch_size' => ['required', 'integer', 'min:10', 'max:500'],
            'pokedex_enable_simulators' => ['filled', 'boolean'],
        ]);

        // Sauvegarde via la méthode native d'Azuriom
        // Note: Azuriom attend les clés avec des points (pokedex.items_per_page)
        // Mais les inputs HTML utilisent des underscores (pokedex_items_per_page)
        Setting::updateSettings([
            'pokedex.items_per_page' => $request->input('pokedex_items_per_page'),
            'pokedex.cache_duration' => $request->input('pokedex_cache_duration'),
            'pokedex.shiny_rate' => $request->input('pokedex_shiny_rate'),
            'pokedex.loading_batch_size' => $request->input('pokedex_loading_batch_size'),
            'pokedex.enable_simulators' => $request->has('pokedex_enable_simulators'),
        ]);

        return redirect()->route('pokedex.admin.settings')->with('success', 'Configuration mise à jour !');
    }
}