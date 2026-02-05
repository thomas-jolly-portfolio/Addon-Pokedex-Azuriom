<?php

namespace Azuriom\Plugin\Pokedex\Controllers;

use Azuriom\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;

class PokedexController extends Controller
{
    public function index()
    {
        return view('pokedex::index');
    }

    public function listFiles()
    {
        $path = base_path('plugins/pokedex/public/data');
        
        if (!File::isDirectory($path)) {
            return response()->json([]);
        }

        $files = collect(File::files($path))
            ->filter(fn($file) => $file->getExtension() === 'json')
            ->map(fn($file) => $file->getFilename())
            ->values();

        return response()->json($files);
    }

    public function getPokemon(string $name)
    {
        $path = base_path("plugins/pokedex/public/data/{$name}");

        if (!File::exists($path)) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json(json_decode(File::get($path), true));
    }

    // --- NOUVELLE FONCTION A AJOUTER ICI ---
    public function generateBigJson()
    {
        // Chemin vers le dossier data
        $directory = public_path('assets/plugins/pokedex/data');
        
        if (!is_dir($directory)) {
            // Tentative avec le chemin interne si le public_path échoue
            $directory = base_path('plugins/pokedex/public/data');
            if (!is_dir($directory)) {
                return response()->json(['error' => 'Dossier data introuvable'], 404);
            }
        }

        $files = glob($directory . '/*.json');
        $combinedData = [];

        foreach ($files as $file) {
            $filename = basename($file);
            
            // On ignore le fichier final pour ne pas boucler
            if ($filename === 'all.json') continue;

            $json = json_decode(file_get_contents($file), true);
            
            if ($json) {
                // On utilise le nom du fichier comme clé (ex: "001.json")
                $combinedData[$filename] = $json;
            }
        }

        // Sauvegarde du gros fichier
        file_put_contents($directory . '/all.json', json_encode($combinedData));

        return response()->json([
            'status' => 'success',
            'count' => count($combinedData),
            'message' => 'Fichier all.json généré avec succès !'
        ]);
    }
}