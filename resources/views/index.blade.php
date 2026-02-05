@extends('layouts.app')

@section('title', 'Pokédex Europe')

@push('styles')
    <style>
        /* --- STYLE GLOBAL & GLASSMORPHISM --- */
        :root { --glass-bg: rgba(15, 23, 42, 0.95); --glass-border: rgba(255, 255, 255, 0.1); --primary: #3b82f6; }
        .glass-card { background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border); }
        .poke-card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 40px -10px rgba(59, 130, 246, 0.3); }
        
        /* Badges & Textes */
        .type-badge { text-transform: uppercase; font-size: 0.65rem; font-weight: 800; padding: 0.25rem 0.5rem; border-radius: 4px; letter-spacing: 0.05em; margin-right: 2px; display: inline-block; }
        .tier-badge { font-size: 0.6em; padding: 2px 6px; border-radius: 4px; background: #333; color: white; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); }
        .form-tag { font-size: 0.6em; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase; margin-left: 5px; background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); }
        .tag-mega { background: linear-gradient(135deg, #ff9966, #ff5e62); color: white; border: none; }
        .tag-gigantamax { background: linear-gradient(135deg, #8e2de2, #4a00e0); color: white; border: none; }
        
        /* Onglets */
        .tab-btn { background: transparent; border: none; color: #64748b; font-weight: bold; cursor: pointer; padding: 10px 20px; transition: 0.3s; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; }
        .tab-btn:hover { color: white; }
        .tab-btn.active { border-bottom: 2px solid var(--primary); color: white; background: rgba(255,255,255,0.02); }
        .tab-panel { display: none; animation: fadeIn 0.3s ease; }
        .tab-panel.active { display: block; }

        /* --- SIMULATEURS --- */
        .sim-row { display: grid; grid-template-columns: 40px 40px 1fr 1fr 50px; gap: 8px; align-items: center; margin-bottom: 6px; font-size: 0.8em; }
        .sim-label { font-weight: bold; color: #94a3b8; text-transform: uppercase; }
        .sim-base { text-align: center; font-family: monospace; color: #cbd5e1; }
        .sim-inputs-group { position: relative; }
        .sim-inputs-group span { position: absolute; top: -8px; left: 0; font-size: 0.6em; color: #64748b; }
        .sim-val-input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 4px; border-radius: 4px; width: 100%; text-align: center; font-family: monospace; font-size: 0.9em; }
        .sim-result { text-align: right; font-weight: bold; color: var(--primary); font-family: monospace; font-size: 1.1em; }
        .sim-bar-container { grid-column: 1 / -1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; margin-top: 2px; }
        .sim-bar-fill { height: 100%; transition: width 0.3s ease, background-color 0.3s ease; background: var(--primary); }
        .nature-plus { color: #4ade80 !important; } .nature-minus { color: #f87171 !important; }

        /* --- CATCH CALC --- */
        .catch-calc-box { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 15px; border: 1px solid rgba(255,255,255,0.05); margin-top: 15px; }
        .calc-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.85em; }
        .calc-row select, .calc-row input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 4px; border-radius: 4px; font-size: 0.9em; }
        .calc-result-bar { height: 10px; background: #1e293b; border-radius: 5px; overflow: hidden; margin-top: 10px; border: 1px solid rgba(255,255,255,0.1); }
        .calc-fill { height: 100%; transition: width 0.5s ease; width: 0%; }

        /* --- ATTAQUES --- */
        .move-cat-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 6px 12px; border-radius: 20px; font-size: 0.75em; cursor: pointer; transition: all 0.2s; font-weight: bold; text-transform: uppercase; }
        .move-cat-btn:hover, .move-cat-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        .moves-list { column-count: 2; column-gap: 20px; font-size: 0.85em; padding-left: 0; }
        .moves-list li { break-inside: avoid; margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center; }

        /* --- BARRE FLOTTANTE --- */
        .floating-bar { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #0f172a; padding: 10px 25px; border-radius: 50px; border: 1px solid #334155; display: flex; align-items: center; gap: 15px; z-index: 50; box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
        .team-slot { width: 40px; height: 40px; border-radius: 50%; background-size: cover; background-position: center; background-color: #1e293b; border: 2px solid #334155; position: relative; cursor: pointer; transition: transform 0.2s; }
        .team-slot:hover { transform: scale(1.15); border-color: var(--primary); }
        .team-slot-remove { position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; width: 16px; height: 16px; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
        .team-slot:hover .team-slot-remove { opacity: 1; }
        .btn-mini-clear { background: none; border: none; color: #64748b; cursor: pointer; font-size: 1.2em; padding: 0 5px; transition: color 0.2s; }
        .btn-mini-clear:hover { color: #ef4444; }

        /* --- SCROLLBAR --- */
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.6); }

        /* --- COULEURS DES TYPES (OFFICIELLES) --- */
        .type-Normal { background-color: #A8A77A; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Fire { background-color: #EE8130; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Water { background-color: #6390F0; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Electric { background-color: #F7D02C; color: black; border: 1px solid rgba(255,255,255,0.2); }
        .type-Grass { background-color: #7AC74C; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Ice { background-color: #96D9D6; color: black; border: 1px solid rgba(255,255,255,0.2); }
        .type-Fighting { background-color: #C22E28; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Poison { background-color: #A33EA1; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Ground { background-color: #E2BF65; color: black; border: 1px solid rgba(255,255,255,0.2); }
        .type-Flying { background-color: #A98FF3; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Psychic { background-color: #F95587; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Bug { background-color: #A6B91A; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Rock { background-color: #B6A136; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Ghost { background-color: #735797; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Dragon { background-color: #6F35FC; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Steel { background-color: #B7B7CE; color: black; border: 1px solid rgba(255,255,255,0.2); }
        .type-Dark { background-color: #705746; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .type-Fairy { background-color: #D685AD; color: white; border: 1px solid rgba(255,255,255,0.2); }

        /* --- BARRE DE PROGRESSION --- */
        .loading-container { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin-top: 10px; }
        .loading-bar { height: 100%; background: #3b82f6; width: 0%; transition: width 0.1s linear; }

        /* Animation et Style Bouton Shiny */
        .shiny-btn {
            border: none;
            background: rgba(0, 0, 0, 0.6);
            cursor: pointer;
            font-size: 1rem;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
            z-index: 10;
        }
        .shiny-btn:hover {
            background: rgba(255, 215, 0, 0.2);
            transform: scale(1.1) rotate(15deg);
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
        }
        .shiny-active {
            text-shadow: 0 0 10px yellow;
            animation: shinyPulse 2s infinite;
        }

        @keyframes shinyPulse {
            0% { filter: brightness(1); }
            50% { filter: brightness(1.3) drop-shadow(0 0 5px gold); }
            100% { filter: brightness(1); }
        }

        /* Badge Groupe Capture */
        .catch-badge {
            font-size: 0.7em;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
            text-transform: uppercase;
            margin-left: 5px;
        }

        /* Onglet Reproduction */
        .breeding-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 15px;
        }
        .block-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 10px;
            text-align: center;
        }
        .block-val {
            font-size: 1.2em;
            font-weight: bold;
            color: #2ecc71;
        }
        .item-row {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            font-size: 0.9em;
        }
        .steps-box {
            background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1));
            border: 1px solid rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    </style>
@endpush

@section('content')
<div class="container mx-auto px-4 relative z-10 py-8">

    <div class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
            Pokédex <span class="text-blue-500">Europe</span>
        </h1>
        <p class="text-blue-200 italic text-sm opacity-70">
            Simulateurs de capture, Calculateur de stats, Team Builder et Base de données complète.
        </p>
    </div>

    <div class="lg:hidden mb-4 sticky top-20 z-30">
        <button onclick="toggleFilters()" class="w-full bg-[#1e293b] border border-white/10 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
            <i class="fas fa-filter text-blue-400"></i> Filtres & Recherche
        </button>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 items-start">
        
        {{-- SIDEBAR FILTRES (RESPONSIVE : TIROIR SUR MOBILE / STICKY SUR BUREAU) --}}
        
        <div id="sidebar-overlay" class="fixed inset-0 bg-black/80 z-40 hidden lg:hidden backdrop-blur-sm transition-opacity" onclick="toggleFilters()"></div>

        <aside id="sidebar-filters" class="fixed top-0 left-0 h-full w-80 bg-[#0f172a] z-50 transform -translate-x-full transition-transform duration-300 lg:translate-x-0 lg:static lg:w-[320px] lg:bg-transparent lg:block lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] overflow-y-auto custom-scroll p-4 lg:p-0 lg:pr-2 shadow-2xl lg:shadow-none border-r border-white/10 lg:border-none">

            <div class="flex justify-between items-center mb-6 lg:hidden">
                <h3 class="text-xl font-black text-white uppercase italic">Filtres</h3>
                <button onclick="toggleFilters()" class="text-gray-400 hover:text-white text-xl bg-white/5 w-8 h-8 rounded-full flex items-center justify-center"><i class="fas fa-times"></i></button>
            </div>

            <div class="space-y-6">
                <div class="relative">
                    <i class="fa-solid fa-search absolute left-4 top-3.5 text-gray-400 text-xs"></i>
                    <input type="text" id="search-input" placeholder="Pokémon, Talent, Attaque..." 
                           class="w-full bg-[#1e293b] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-blue-500 outline-none transition shadow-lg">
                </div>

                <div id="loading-wrapper" class="hidden pb-2">
                    <div class="flex justify-between text-[10px] text-blue-400 font-mono mb-1">
                        <span id="loading-text">Chargement...</span>
                        <span id="loading-percent">0%</span>
                    </div>
                    <div class="loading-container">
                        <div id="loading-bar" class="loading-bar"></div>
                    </div>
                </div>
                
                <button onclick="resetFilters()" class="w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                    <i class="fas fa-trash-alt"></i> Réinitialiser les filtres
                </button>

                <div class="bg-[#1e293b] rounded-xl border border-white/5 shadow-xl overflow-hidden">
                    <div class="p-5 border-b border-white/5">
                        <label for="sort-select" class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <i class="fas fa-sort-amount-down mr-1"></i> Trier par
                        </label>
                        <div class="relative">
                            <select id="sort-select" class="w-full bg-[#0f172a] text-white text-sm font-medium border border-white/10 rounded-lg py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 transition cursor-pointer">
                                <option value="id"># Numéro (ID)</option>
                                <option value="name">A-Z Nom</option>
                                <option value="weight-desc">Poids (Lourd → Léger)</option>
                                <option value="weight-asc">Poids (Léger → Lourd)</option>
                                <option value="stat-total">Total Stats (BST)</option>
                                <option value="stat-hp">PV (HP)</option>
                                <option value="stat-attack">Attaque</option>
                                <option value="stat-defence">Défense</option>
                                <option value="stat-spatk">Atk. Spéciale</option>
                                <option value="stat-spdef">Déf. Spéciale</option>
                                <option value="stat-speed">Vitesse</option>
                                <option value="tier">Tier Stratégique</option>
                                <option value="tag">Catégorie</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                <i class="fas fa-chevron-down text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <div class="p-5 bg-[#0f172a]/30">
                        <div class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <i class="fas fa-history"></i> Récemment vus
                        </div>
                        <div id="history-list" class="flex flex-wrap gap-2 min-h-[40px] empty:hidden"></div>
                        <div id="history-empty" class="text-gray-600 text-xs italic">Aucun historique.</div>
                    </div>
                </div>

                <div class="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
                    <div class="p-4 bg-[#1e293b] border-b border-white/5 flex items-center gap-2">
                        <i class="fas fa-paw text-green-400"></i>
                        <h4 class="font-bold text-white text-sm uppercase tracking-wide">Types</h4>
                    </div>
                    <div class="p-4">
                        <div class="checkbox-grid grid grid-cols-2 gap-2" id="type-filters"></div>
                    </div>
                </div>

                <div class="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
                    <div class="p-4 bg-[#1e293b] border-b border-white/5 flex items-center gap-2">
                        <i class="fas fa-trophy text-yellow-400"></i>
                        <h4 class="font-bold text-white text-sm uppercase tracking-wide">Tiers (Smogon)</h4>
                    </div>
                    <div class="p-4">
                        <div class="checkbox-grid flex flex-wrap gap-2" id="tier-filters"></div>
                    </div>
                </div>

                <div class="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
                    <div class="p-4 bg-[#1e293b] border-b border-white/5 flex items-center gap-2">
                        <i class="fas fa-shapes text-purple-400"></i>
                        <h4 class="font-bold text-white text-sm uppercase tracking-wide">Formes</h4>
                    </div>
                    <div class="p-4 space-y-4">
                        <div>
                            <h5 class="text-[10px] text-gray-500 uppercase font-bold mb-2">Tags Principaux</h5>
                            <div class="checkbox-grid flex flex-wrap gap-2" id="main-tag-filters"></div>
                        </div>
                        <div class="pt-4 border-t border-white/5">
                            <h5 class="text-[10px] text-gray-500 uppercase font-bold mb-2 flex items-center gap-2">
                                <i class="fas fa-star text-yellow-500 text-[10px]"></i> Cosmétiques
                            </h5>
                            <div class="checkbox-grid flex flex-wrap gap-2" id="cosmetic-filters"></div>
                        </div>
                    </div>
                </div>

                <div class="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden">
                    <div class="p-4 bg-[#1e293b] border-b border-white/5 flex items-center gap-2">
                        <i class="fas fa-egg text-pink-300"></i>
                        <h4 class="font-bold text-white text-sm uppercase tracking-wide">Groupes d'Œufs</h4>
                    </div>
                    <div class="p-4">
                        <div class="checkbox-grid space-y-1 max-h-40 overflow-y-auto custom-scroll pr-2" id="egg-filters"></div>
                    </div>
                </div>

                <div class="bg-[#1e293b] rounded-xl border border-white/5 overflow-hidden mb-10">
                    <div class="p-4 bg-[#1e293b] border-b border-white/5 flex items-center gap-2">
                        <i class="fas fa-chart-bar text-blue-400"></i>
                        <h4 class="font-bold text-white text-sm uppercase tracking-wide">Statistiques</h4>
                    </div>
                    <div class="p-5" id="stats-filters"></div>
                </div>
            </div> </aside>

        {{-- GRILLE PRINCIPALE --}}
        <main class="flex-1 w-full">
            <div id="pokedex-grid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <div class="col-span-full text-center py-20">
                    <i class="fa-solid fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i>
                    <p class="text-blue-100 animate-pulse">Synchronisation des données...</p>
                </div>
            </div>
            <div class="text-center mt-10 hidden" id="load-more-container">
                <button id="load-more-btn" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-10 rounded-full transition shadow-lg shadow-blue-600/20 text-sm">
                    Afficher plus
                </button>
            </div>
        </main>
    </div>
</div>

{{-- MODALE ANALYSE EQUIPE --}}
<div id="team-modal" class="fixed inset-0 z-[1050] hidden" role="dialog" aria-modal="true">
    <div class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onclick="document.getElementById('team-modal').classList.add('hidden')"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-6xl bg-[#0b1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden modal-content min-h-[600px] flex flex-col">
                {{-- Contenu injecté JS --}}
            </div>
        </div>
    </div>
</div>

{{-- MODALE PRINCIPALE --}}
<div id="modal" class="fixed inset-0 z-[2000] hidden" role="dialog" aria-modal="true">
    
    <div class="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity cursor-pointer" onclick="closeModal()"></div>
    
    <div class="fixed inset-0 z-10 flex items-center justify-center p-0 md:p-4 pointer-events-none">
        
        <div class="pointer-events-auto relative w-full h-full md:h-[90vh] md:max-w-5xl bg-[#0b1120] md:border border-white/10 md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <button class="absolute top-3 right-3 z-50 text-white bg-black/50 hover:bg-red-500/80 rounded-full w-10 h-10 flex items-center justify-center transition backdrop-blur-sm shadow-lg border border-white/10" onclick="closeModal()">
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>

            <div class="modal-nav bg-[#0f172a] border-b border-white/10 shrink-0">
    <div class="flex flex-wrap md:flex-nowrap px-0">
        
        <button class="tab-btn active w-1/3 md:w-auto md:flex-1 whitespace-nowrap px-1 py-3 text-[10px] md:text-sm font-bold uppercase border-b border-white/5 md:border-b-0 md:border-r hover:bg-white/5 transition" data-target="tab-general" onclick="openTab('general')">Général</button>
        <button class="tab-btn w-1/3 md:w-auto md:flex-1 whitespace-nowrap px-1 py-3 text-[10px] md:text-sm font-bold uppercase border-b border-white/5 md:border-b-0 md:border-r hover:bg-white/5 transition" data-target="tab-stats" onclick="openTab('stats')">Stats</button>
        <button class="tab-btn w-1/3 md:w-auto md:flex-1 whitespace-nowrap px-1 py-3 text-[10px] md:text-sm font-bold uppercase border-b border-white/5 md:border-b-0 md:border-r hover:bg-white/5 transition" data-target="tab-moves" onclick="openTab('moves')">Attaques</button>
        
        <button class="tab-btn w-1/2 md:w-auto md:flex-1 whitespace-nowrap px-1 py-3 text-[10px] md:text-sm font-bold uppercase border-r border-white/5 md:border-r-0 hover:bg-white/5 transition" data-target="tab-simu" onclick="openTab('simu')">Simulateurs</button>
        
        <button class="tab-btn w-1/2 md:w-auto md:flex-1 whitespace-nowrap px-1 py-3 text-[10px] md:text-sm font-bold uppercase text-pink-400 hover:bg-white/5 transition" data-target="tab-breeding" onclick="openTab('breeding')"><i class="fas fa-heart mr-1"></i> Repro</button>
    </div>
</div>

            <div id="modal-body-content" class="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 bg-[#0b1120] pb-20 md:pb-8">
                {{-- Contenu injecté JS --}}
            </div>
        </div>
    </div>
</div>

{{-- POPUP ZOOM --}}
<div id="zoom-overlay" class="fixed inset-0 z-[1100] hidden bg-black/95 flex items-center justify-center" onclick="closeImageZoom()">
    <img id="zoom-img-content" class="max-h-[90vh] max-w-[90vw] object-contain drop-shadow-2xl animate-pulse">
    <div class="absolute bottom-10 text-white/50 text-xs tracking-widest uppercase">Cliquer pour fermer</div>
</div>

@endsection

@push('footer-scripts')
    <script>
        // On injecte la config PHP dans le navigateur pour le JS
        window.PokedexConfig = {
            itemsPerPage: {{ setting('pokedex.items_per_page', 30) }},
            batchSize: {{ setting('pokedex.loading_batch_size', 50) }},
            cacheDuration: {{ setting('pokedex.cache_duration', 3600) }},
            shinyRate: {{ setting('pokedex.shiny_rate', 4096) }},
            enableSimulators: {{ setting('pokedex.enable_simulators', true) ? 'true' : 'false' }},
            assetUrl: "{{ plugin_asset('pokedex', 'img/') }}"
        };

        // Fonction Toggle Filtres (Mobile)
        function toggleFilters() {
            const sidebar = document.getElementById('sidebar-filters');
            const overlay = document.getElementById('sidebar-overlay');
            
            if (sidebar.classList.contains('-translate-x-full')) {
                // Ouvrir
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                // Fermer
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }
    </script>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="{{ plugin_asset('pokedex', 'js/pokedex-core.js') }}"></script>
@endpush