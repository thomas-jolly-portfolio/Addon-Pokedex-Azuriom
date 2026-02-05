<?php

namespace Azuriom\Plugin\Pokedex\Controllers\Admin;

use Azuriom\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class EditorController extends Controller
{
    private function getDataPath()
    {
        return base_path('plugins/pokedex/public/data');
    }

    // --- MAPPING 1 : Images 3D ---
    private function getImagesMappingPath()
    {
        return base_path('plugins/pokedex/public/data/sprites/ingamepicture.json');
    }

    // --- MAPPING 2 : Sprites 2D Custom (NOUVEAU) ---
    private function getSpritesMappingPath()
    {
        return base_path('plugins/pokedex/public/data/sprites/spritegamepicture.json');
    }

    private function getMapping($path)
    {
        if (!File::exists($path)) return [];
        return json_decode(File::get($path), true) ?? [];
    }

    public function index()
    {
        return view('pokedex::admin.editor');
    }

    public function listFiles()
    {
        $path = $this->getDataPath();
        if (!File::isDirectory($path)) return response()->json([]);

        $files = collect(File::files($path))
            ->filter(fn($file) => $file->getExtension() === 'json' && !in_array($file->getFilename(), ['all.json', 'ingamepicture.json', 'spritegamepicture.json']))
            ->map(fn($file) => $file->getFilename())
            ->values();

        return response()->json($files);
    }

    public function loadFile($filename)
    {
        if (str_contains($filename, '/') || str_contains($filename, '\\')) abort(403);
        $path = $this->getDataPath() . '/' . $filename;
        if (!File::exists($path)) return response()->json(['error' => 'Fichier introuvable'], 404);

        $jsonContent = json_decode(File::get($path), true);
        $isList = isset($jsonContent[0]);
        $pokemonData = $isList ? $jsonContent[0] : $jsonContent;

        // Charger les mappings
        $ingameMap = $this->getMapping($this->getImagesMappingPath());
        $spriteMap = $this->getMapping($this->getSpritesMappingPath());
        
        $pixelmonName = $pokemonData['pixelmonName'] ?? null;
        
        // Injection virtuelle pour l'éditeur
        if ($pixelmonName) {
            if (isset($ingameMap[$pixelmonName])) $pokemonData['ingameImage'] = $ingameMap[$pixelmonName];
            if (isset($spriteMap[$pixelmonName])) $pokemonData['customImage'] = $spriteMap[$pixelmonName];
        }

        if ($isList) $jsonContent[0] = $pokemonData;
        else $jsonContent = $pokemonData;

        return response()->json($jsonContent);
    }

    public function saveFile(Request $request, $filename)
    {
        if (str_contains($filename, '/') || str_contains($filename, '\\')) abort(403);
        
        $path = $this->getDataPath() . '/' . $filename;
        $inputData = $request->input('data'); 

        $isList = isset($inputData[0]);
        $pokemonData = $isList ? $inputData[0] : $inputData;

        $ingameMap = $this->getMapping($this->getImagesMappingPath());
        $spriteMap = $this->getMapping($this->getSpritesMappingPath());

        // Fonction helper pour traiter un Pokémon (Base ou Forme)
        $processEntry = function(&$entry) use (&$ingameMap, &$spriteMap) {
            if (isset($entry['pixelmonName'])) {
                $pName = $entry['pixelmonName'];
                
                // 1. Traitement Image 3D (ingameImage)
                if (isset($entry['ingameImage']) && !empty($entry['ingameImage'])) {
                    $ingameMap[$pName] = $entry['ingameImage'];
                } else {
                    if(isset($ingameMap[$pName])) unset($ingameMap[$pName]);
                }
                unset($entry['ingameImage']); // On retire du fichier final

                // 2. Traitement Sprite 2D (customImage) - NOUVEAU
                if (isset($entry['customImage']) && !empty($entry['customImage'])) {
                    $spriteMap[$pName] = $entry['customImage'];
                } else {
                    if(isset($spriteMap[$pName])) unset($spriteMap[$pName]);
                }
                unset($entry['customImage']); // On retire du fichier final
            }
        };

        // Traiter la base
        $processEntry($pokemonData);

        // Traiter les formes si elles existent
        if (isset($pokemonData['forms'])) {
            foreach ($pokemonData['forms'] as &$form) {
                $processEntry($form);
            }
        }

        // Sauvegarde des fichiers de mapping
        File::put($this->getImagesMappingPath(), json_encode($ingameMap, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        File::put($this->getSpritesMappingPath(), json_encode($spriteMap, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        // Sauvegarde du fichier Pokémon nettoyé
        if ($isList) $inputData[0] = $pokemonData;
        else $inputData = $pokemonData;

        File::put($path, json_encode($inputData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        return response()->json(['status' => 'success']);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9\._-]/', '', $file->getClientOriginalName());
        $destinationPath = base_path('plugins/pokedex/public/data/sprites');
        
        if (!File::isDirectory($destinationPath)) {
            File::makeDirectory($destinationPath, 0775, true);
        }

        $file->move($destinationPath, $filename);

        return response()->json([
            'status' => 'success',
            'filename' => $filename
        ]);
    }
}