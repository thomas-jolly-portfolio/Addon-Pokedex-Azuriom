/**
 * POKEDEX CORE - FUSION INTEGRALE (VERSION MAXIMALE)
 * * Sources: pokedex-core.js (Structure, API, Tailwind) + script.js (Logique lourde, Data, Calculs)
 * Fonctionnalités incluses :
 * - Chargement Asynchrone Azuriom
 * - Détection Formes Complexes (Météo, Zen, Battle Bond, etc.)
 * - Analyseur d'Équipe V2 (Vue Débutant/Expert, Drag&Drop, Synergie, Cores)
 * - Calculateur Capture Complet (Toutes les Balls, Conditions météo/statut)
 * - Calculateur IV/EV/Stats Interactif
 * - Générateur Carte Dresseur (Canvas)
 * - Gestion Favoris/Comparateur/Historique
 */

// =====================================================================================
// 1. CONFIGURATION & DONNÉES MASSIVES
// =====================================================================================



const COSMETIC_MAP = {
    "100": "Zombie", "101": "Online", "102": "Drowned", "103": "Valentine",
    "104": "Rainbow", "105": "Alien", "106": "Valencian", "107": "Alter",
    "108": "Pink", "109": "Summer", "110": "Crystal", "111": "Creator",
    "112": "Strike", "113": "Ashen", "114": "Spirit", "115": "Halloween"
};

const MAIN_TAGS = ["Mega", "Gigantamax", "Fusion", "Baby", "Legendary", "UltraBeast", "Paradox", "Hisuian", "Galarian", "Alolan", "Paldean", "Totem", "Noble"];

// Listes complètes pour la détection
const OFFICIAL_MEGAS = [
    "Venusaur","Charizard","Clefable","Meowstic","Zygarde","Victreebel","Blastoise","Beedrill","Starmie","Pidgeot","Alakazam","Slowbro","Gengar","Kangaskhan","Pinsir","Gyarados","Aerodactyl","Mewtwo","Ampharos","Steelix","Scizor","Heracross","Houndoom","Tyranitar","Sceptile","Blaziken","Swampert","Gardevoir","Sableye","Mawile","Aggron","Medicham","Manectric","Sharpedo","Camerupt","Altaria","Banette","Absol","Glalie","Salamence","Metagross","Latias","Latios","Rayquaza","Lopunny","Garchomp","Lucario","Abomasnow","Gallade","Audino","Diancie",
    // Custom Megas potentiels (support Azuriom)
    "Meganium", "Typhlosion", "Feraligatr", "Torterra", "Infernape", "Empoleon", "Serperior", "Emboar", "Samurott", "Flygon", "Milotic", "Dragonite", "Hydreigon", "Haxorus", "Zoroark", "Slowking", "Froslass", "Luxray", "Malamar", "Dragalge", "Hawlucha", "Zygarde", "Greninja", "Goodra", "Noivern", "Yanmega", "Staraptor", "Tentacruel"
];

const OFFICIAL_GMAX = [
    "Venusaur", "Charizard", "Blastoise", "Butterfree", "Pikachu", "Meowth", "Machamp", "Gengar", "Kingler", "Lapras", "Eevee", "Snorlax", "Garbodor",
    "Melmetal", "Rillaboom", "Cinderace", "Inteleon", "Corviknight", "Orbeetle", "Drednaw", "Coalossal", "Flapple", "Appletun", "Sandaconda", "Toxtricity",
    "Centiskorch", "Hatterene", "Grimmsnarl", "Alcremie", "Copperajah", "Duraludon", "Urshifu", "Terapagos", "Eternatus"
];

const REGION_MAPPING = {
    "Alolan": ["Rattata","Raticate","Raichu","Sandshrew","Sandslash","Vulpix","Ninetales","Diglett","Dugtrio","Meowth","Persian","Geodude","Graveler","Golem","Grimer","Muk","Exeggutor","Marowak"],
    "Galarian": ["Meowth","Ponyta","Rapidash","Slowpoke","Slowbro","Farfetch'd","Weezing","Mr. Mime","Corsola","Zigzagoon","Linoone","Darumaka","Darmanitan","Yamask","Stunfisk","Slowking","Articuno","Zapdos","Moltres"],
    "Hisuian": ["Growlithe","Arcanine","Voltorb","Electrode","Typhlosion","Qwilfish","Sneasel","Samurott","Lilligant","Basculin","Zorua","Zoroark","Braviary","Sliggoo","Goodra","Avalugg","Decidueye"],
    "Paldean": ["Tauros","Wooper"]
};

const NATURES = {
    "Hardy":{}, "Lonely":{pos:"Attack",neg:"Defence"}, "Brave":{pos:"Attack",neg:"Speed"}, "Adamant":{pos:"Attack",neg:"SpecialAttack"}, "Naughty":{pos:"Attack",neg:"SpecialDefence"},
    "Bold":{pos:"Defence",neg:"Attack"}, "Docile":{}, "Relaxed":{pos:"Defence",neg:"Speed"}, "Impish":{pos:"Defence",neg:"SpecialAttack"}, "Lax":{pos:"Defence",neg:"SpecialDefence"},
    "Timid":{pos:"Speed",neg:"Attack"}, "Hasty":{pos:"Speed",neg:"Defence"}, "Serious":{}, "Jolly":{pos:"Speed",neg:"SpecialAttack"}, "Naive":{pos:"Speed",neg:"SpecialDefence"},
    "Modest":{pos:"SpecialAttack",neg:"Attack"}, "Mild":{pos:"SpecialAttack",neg:"Defence"}, "Quiet":{pos:"SpecialAttack",neg:"Speed"}, "Bashful":{}, "Rash":{pos:"SpecialAttack",neg:"SpecialDefence"},
    "Calm":{pos:"SpecialDefence",neg:"Attack"}, "Gentle":{pos:"SpecialDefence",neg:"Defence"}, "Sassy":{pos:"SpecialDefence",neg:"Speed"}, "Careful":{pos:"SpecialDefence",neg:"SpecialAttack"}, "Quirky":{}
};

const TIER_RANK = {"Uber":1,"OU":2,"UU":3,"RU":4,"NU":5,"PU":6,"LC":7,"Unknown":99};
const TIER_VALUES = {"Uber":100,"OU":95,"UU":85,"RU":75,"NU":65,"PU":55,"LC":40,"Unknown":50};
const SMOGON_TIERS = {"Mewtwo":"Uber","Rayquaza":"Uber","Arceus":"Uber","Zacian":"Uber","Koraidon":"Uber","Miraidon":"Uber","Landorus-Therian":"OU","Great Tusk":"OU","Kingambit":"OU","Gholdengo":"OU","Dragapult":"OU","Charizard":"PU","Pikachu":"PU"};

const TYPE_CHART = {
    "Normal": { "Rock": 0.5, "Ghost": 0, "Steel": 0.5 },
    "Fire": { "Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 2, "Bug": 2, "Rock": 0.5, "Dragon": 0.5, "Steel": 2 },
    "Water": { "Fire": 2, "Water": 0.5, "Grass": 0.5, "Ground": 2, "Rock": 2, "Dragon": 0.5 },
    "Electric": { "Water": 2, "Electric": 0.5, "Grass": 0.5, "Ground": 0, "Flying": 2, "Dragon": 0.5 },
    "Grass": { "Fire": 0.5, "Water": 2, "Grass": 0.5, "Poison": 0.5, "Ground": 2, "Flying": 0.5, "Bug": 0.5, "Rock": 2, "Dragon": 0.5, "Steel": 0.5 },
    "Ice": { "Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 0.5, "Ground": 2, "Flying": 2, "Dragon": 2, "Steel": 0.5 },
    "Fighting": { "Normal": 2, "Ice": 2, "Poison": 0.5, "Flying": 0.5, "Psychic": 0.5, "Bug": 0.5, "Rock": 2, "Ghost": 0, "Dark": 2, "Steel": 2, "Fairy": 0.5 },
    "Poison": { "Grass": 2, "Poison": 0.5, "Ground": 0.5, "Rock": 0.5, "Ghost": 0.5, "Steel": 0, "Fairy": 2 },
    "Ground": { "Fire": 2, "Electric": 2, "Grass": 0.5, "Poison": 2, "Flying": 0, "Bug": 0.5, "Rock": 2, "Steel": 2 },
    "Flying": { "Electric": 0.5, "Grass": 2, "Fighting": 2, "Bug": 2, "Rock": 0.5, "Steel": 0.5 },
    "Psychic": { "Fighting": 2, "Poison": 2, "Psychic": 0.5, "Dark": 0, "Steel": 0.5 },
    "Bug": { "Fire": 0.5, "Grass": 2, "Fighting": 0.5, "Poison": 0.5, "Flying": 0.5, "Psychic": 2, "Ghost": 0.5, "Dark": 2, "Steel": 0.5, "Fairy": 0.5 },
    "Rock": { "Fire": 2, "Ice": 2, "Fighting": 0.5, "Ground": 0.5, "Flying": 2, "Bug": 2, "Steel": 0.5 },
    "Ghost": { "Normal": 0, "Psychic": 2, "Ghost": 2, "Dark": 0.5 },
    "Dragon": { "Dragon": 2, "Steel": 0.5, "Fairy": 0 },
    "Steel": { "Fire": 0.5, "Water": 0.5, "Electric": 0.5, "Ice": 2, "Rock": 2, "Steel": 0.5, "Fairy": 2 },
    "Dark": { "Fighting": 0.5, "Psychic": 2, "Ghost": 2, "Dark": 0.5, "Fairy": 0.5 },
    "Fairy": { "Fire": 0.5, "Fighting": 2, "Poison": 0.5, "Dragon": 2, "Dark": 2, "Steel": 0.5 }
};

// --- CONSTANTES REPRODUCTION PIXELMON 1.12.2 ---
const BREEDING_BLOCKS = {
    "Normal": [ {n:"Gâteau", v:3}, {n:"Laine", v:1}, {n:"Pierre", v:1}, {n:"Bibliothèque", v:2} ],
    "Fire": [ {n:"Lave", v:3}, {n:"Netherrack", v:2}, {n:"Feu", v:3}, {n:"Pierre", v:1} ],
    "Water": [ {n:"Eau", v:1}, {n:"Éponge", v:3}, {n:"Canne à Sucre", v:2}, {n:"Nénuphar", v:3} ],
    "Grass": [ {n:"Botte de Foin", v:3}, {n:"Melon/Citrouille", v:2}, {n:"Herbe", v:1}, {n:"Feuilles", v:1} ],
    "Electric": [ {n:"Bloc Redstone", v:3}, {n:"Lampe Redstone", v:2}, {n:"Minerai Redstone", v:1}, {n:"Laine", v:1} ],
    "Ice": [ {n:"Glace Compactée", v:3}, {n:"Glace", v:2}, {n:"Neige", v:1} ],
    "Fighting": [ {n:"Enclume", v:3}, {n:"Briques", v:2}, {n:"Pierre", v:1}, {n:"Barrière", v:2} ],
    "Poison": [ {n:"Alambic", v:3}, {n:"Mycelium", v:3}, {n:"Éponge", v:2}, {n:"Gâteau", v:2} ],
    "Ground": [ {n:"Argile Durcie", v:2}, {n:"Terre", v:1}, {n:"Sable", v:1}, {n:"Cactus", v:2} ],
    "Flying": [ {n:"Distributeur", v:3}, {n:"Vitre", v:2}, {n:"Hautes Herbes", v:1} ],
    "Psychic": [ {n:"Tapis", v:3}, {n:"Bibliothèque", v:2}, {n:"Quartz", v:2}, {n:"Vitre", v:2} ],
    "Bug": [ {n:"Pot de Fleur", v:3}, {n:"Bloc Champignon", v:2}, {n:"Feuilles", v:1}, {n:"Fleur", v:1} ],
    "Rock": [ {n:"Pierre de l'End", v:3}, {n:"Four", v:2}, {n:"Charbon (Bloc)", v:2}, {n:"Pierre", v:1} ],
    "Ghost": [ {n:"Tapis", v:3}, {n:"Toile", v:2}, {n:"Barreaux Fer", v:2}, {n:"Bibliothèque", v:2} ],
    "Dragon": [ {n:"Bloc Or", v:3}, {n:"Pierre de l'End", v:3}, {n:"Obsidienne", v:2}, {n:"Émeraude", v:2} ],
    "Steel": [ {n:"Bloc Fer", v:3}, {n:"Piston", v:2}, {n:"Barreaux Fer", v:2}, {n:"Rail", v:1} ],
    "Dark": [ {n:"Bloc Charbon", v:2}, {n:"Obsidienne", v:2}, {n:"Netherrack", v:1}, {n:"Toile", v:1} ],
    "Fairy": [ {n:"Gâteau", v:3}, {n:"Laine Rose", v:2}, {n:"Glowstone", v:2}, {n:"Fleur", v:1} ]
};

const INCENSE_DATA = {
    "Munchlax": "Encens Plein (Full)", "Wynaut": "Encens Doux (Lax)", "Azurill": "Encens Mer (Sea)",
    "Bonsly": "Encens Roc (Rock)", "Mime Jr.": "Encens Bizarre (Odd)", "Happiny": "Encens Veine (Luck)",
    "Mantyke": "Encens Vague (Wave)", "Chingling": "Encens Pur (Pure)", "Budew": "Encens Fleur (Rose)"
};

// =====================================================================================
// 2. ÉTAT GLOBAL
// =====================================================================================
let allPokemon = [];
let displayedPokemon = [];
let favorites = JSON.parse(localStorage.getItem('pokedex_favs')) || [];
let myTeam = JSON.parse(localStorage.getItem('pokedex_team')) || [];
let compareList = [];
let navHistory = JSON.parse(localStorage.getItem('pokedex_history')) || [];
let currentPokemon = null;
let currentPokeStats = {}; // Pour le calculateur
let statChartInstance = null;
let teamChartInstance = null;
let compareChartInstance = null;
const ITEMS_PER_PAGE = 30;
let currentPage = 1;

// Init
document.addEventListener('DOMContentLoaded', () => {
    initPokedex();
    updateFloatingBar();
});

// =====================================================================================
// 3. CHARGEMENT & INIT (API AZURIOM)
// =====================================================================================
// --- VARIABLE GLOBALE POUR LES IMAGES 3D ---
// =========================================================
// --- VARIABLES GLOBALES ---
// =========================================================
let ingamePictures = {}; // Stockage des images 3D (Aperçu In-game)
let spritePictures = {}; // Stockage des sprites 2D Customs (spritegamepicture.json)

// =========================================================
// --- INITIALISATION DU POKEDEX ---
// =========================================================
async function initPokedex() {
    const grid = document.getElementById('pokedex-grid');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const loadingPercent = document.getElementById('loading-percent');

    const loadingWrapper = document.getElementById('loading-wrapper');
    if(loadingWrapper) loadingWrapper.classList.remove('hidden');

    try {
        // --- A. Chargement Mapping Images 3D ---
        try {
            const imgRes = await fetch('/assets/plugins/pokedex/data/sprites/ingamepicture.json');
            if (imgRes.ok) {
                ingamePictures = await imgRes.json();
                console.log("Images 3D chargées :", Object.keys(ingamePictures).length);
            }
        } catch (e) {
            console.warn("Fichier ingamepicture.json non trouvé.");
            ingamePictures = {};
        }

        // --- B. Chargement Mapping Sprites 2D Customs ---
        try {
            const spriteRes = await fetch('/assets/plugins/pokedex/data/sprites/spritegamepicture.json');
            if (spriteRes.ok) {
                spritePictures = await spriteRes.json();
                console.log("Sprites 2D Customs chargés :", Object.keys(spritePictures).length);
            }
        } catch (e) {
            console.warn("Fichier spritegamepicture.json non trouvé.");
            spritePictures = {};
        }

        // --- C. Chargement des Données Pokémon (all.json) ---
        const response = await fetch('/assets/plugins/pokedex/data/all.json');
        
        if (!response.ok) {
            throw new Error(`Impossible de charger all.json (${response.status})`);
        }

        const rawDataMap = await response.json();
        const rawDataValues = Object.values(rawDataMap);

        if (!rawDataValues.length) {
            grid.innerHTML = '<div class="col-span-full text-center py-20 opacity-50">Aucune donnée trouvée.</div>';
            return;
        }

        if(loadingBar) loadingBar.style.width = `100%`;
        if(loadingPercent) loadingPercent.innerText = `100%`;
        if(loadingText) loadingText.innerText = `Traitement des données...`;

        allPokemon = [];
        
        // --- D. Traitement des données ---
        rawDataValues.forEach(data => {
            const pokeData = Array.isArray(data) ? data[0] : data;
            if(!pokeData) return;
            
            const realId = pokeData.pokedexId || "000";
            const pName = pokeData.pixelmonName;
            
            const parent = formatPokemon(pokeData, realId);
            if(parent) allPokemon.push(parent);

            let gmaxFoundInJson = false;

            if (pokeData.forms) {
                Object.entries(pokeData.forms).forEach(([key, form]) => {
                    if (key === "0") return;
                    
                    const specialCheck = identifySpecialForm(pName, key, form, pokeData);
                    const isSpecial = OFFICIAL_MEGAS.includes(pName) || OFFICIAL_GMAX.includes(pName) || Object.values(REGION_MAPPING).flat().includes(pName) || specialCheck;
                    const isCosmetic = COSMETIC_MAP[key] !== undefined;
                    
                    if (!isCosmetic && !isSpecial && !isFormDistinct(pokeData, form)) return;
                    
                    const formattedForm = formatPokemon(form, realId, true, pokeData, key);
                    if (formattedForm) {
                        allPokemon.push(formattedForm);
                        if (formattedForm.tag === "Gigantamax") gmaxFoundInJson = true;
                    }
                });
            }

            if (OFFICIAL_GMAX.includes(pName) && !gmaxFoundInJson) {
                const forcedGmax = formatPokemon(pokeData, realId, true, pokeData, "GMAX_FORCE");
                if (forcedGmax) allPokemon.push(forcedGmax);
            }
        });

        allPokemon.sort((a, b) => parseInt(a.pokedexId) - parseInt(b.pokedexId));
        
        if(loadingText) loadingText.innerText = `${allPokemon.length} Pokémon prêts`;
        if(loadingBar) loadingBar.style.backgroundColor = '#2ecc71';
        
        setTimeout(() => {
            if(loadingWrapper) loadingWrapper.classList.add('hidden');
        }, 500);

        generateCheckboxes(Object.keys(TYPE_CHART), 'type-filters', 'type');
        generateCheckboxes([...new Set(allPokemon.flatMap(p => p.eggGroups || []))].sort(), 'egg-filters', 'egg');
        generateCheckboxes(MAIN_TAGS, 'main-tag-filters', 'main-tag');
        generateCheckboxes(Object.keys(TIER_RANK).filter(k => k !== "Unknown"), 'tier-filters', 'tier');
        generateStatFilters();

        document.getElementById('search-input')?.addEventListener('input', applyFilters);
        document.getElementById('sort-select')?.addEventListener('change', applyFilters);
        document.getElementById('load-more-btn')?.addEventListener('click', loadMore);

        applyFilters();

    } catch (error) {
        console.error("Erreur Init Pokedex:", error);
        grid.innerHTML = `<div class="col-span-full text-center text-red-400 p-4">Erreur: ${error.message}</div>`;
    }
}

// =====================================================================================
// 4. LOGIQUE MÉTIER & PARSING (SCRIPT.JS LOGIC)
// =====================================================================================

function isFormDistinct(parent, form) {
    if (form.pixelmonName && form.pixelmonName !== parent.pixelmonName) return true;
    if (form.types && JSON.stringify(form.types) !== JSON.stringify(parent.types)) return true;
    if (form.stats) {
        const s1 = parent.stats;
        const s2 = form.stats;
        if (s1.HP !== s2.HP || s1.Attack !== s2.Attack || s1.Speed !== s2.Speed || s1.SpecialAttack !== s2.SpecialAttack) return true;
    }
    if (form.abilities && JSON.stringify(form.abilities) !== JSON.stringify(parent.abilities)) return true;
    return false;
}

// Détection Formes Spéciales (copié de script.js)
function identifySpecialForm(pName, formKey, data, parentData) {
    const stats = data.stats || parentData.stats || {};
    const types = data.types || parentData.types || [];
    
    if (pName === "Greninja") {
        if (formKey === "1") return { name: "Ash-Greninja", tag: "Battle Bond", slug: "greninja-ash" };
        if (["9", "10", "11"].includes(formKey)) return { name: "Mega Greninja", tag: "Mega", slug: "greninja-mega" };
    }
    if (pName === "Rotom") {
        if (types.includes("Fire")) return { name: "Rotom Heat", tag: "Heat", slug: "rotom-heat" };
        if (types.includes("Water")) return { name: "Rotom Wash", tag: "Wash", slug: "rotom-wash" };
        if (types.includes("Ice")) return { name: "Rotom Frost", tag: "Frost", slug: "rotom-frost" };
        if (types.includes("Flying")) return { name: "Rotom Fan", tag: "Fan", slug: "rotom-fan" };
        if (types.includes("Grass")) return { name: "Rotom Mow", tag: "Mow", slug: "rotom-mow" };
    }
    if (pName === "Necrozma") {
        if (types.includes("Steel")) return { name: "Dusk Mane Necrozma", tag: "Fusion", slug: "necrozma-dusk" };
        if (types.includes("Ghost")) return { name: "Dawn Wings Necrozma", tag: "Fusion", slug: "necrozma-dawn" };
        if (types.includes("Dragon")) return { name: "Ultra Necrozma", tag: "Ultra", slug: "necrozma-ultra" };
    }
    if (pName === "Zacian" && types.includes("Steel")) return { name: "Zacian Crowned", tag: "Crowned", slug: "zacian-crowned" };
    if (pName === "Zamazenta" && types.includes("Steel")) return { name: "Zamazenta Crowned", tag: "Crowned", slug: "zamazenta-crowned" };
    if (pName === "Zygarde") {
        if (formKey === "1" || stats.HP < 90) return { name: "Zygarde 10%", tag: "10%", slug: "zygarde-10" };
        if (formKey === "2" || stats.HP > 200) return { name: "Zygarde Complete", tag: "Complete", slug: "zygarde-complete" };
    }
    if (pName === "Castform") {
        if (types.includes("Fire")) return { name: "Castform Sunny", tag: "Sunny", slug: "castform-sunny" };
        if (types.includes("Water")) return { name: "Castform Rainy", tag: "Rainy", slug: "castform-rainy" };
        if (types.includes("Ice")) return { name: "Castform Snowy", tag: "Snowy", slug: "castform-snowy" };
    }
    if (pName === "Deoxys") {
        if (stats.Speed > 160) return { name: "Deoxys Speed", tag: "Speed", slug: "deoxys-speed" };
        if (stats.Attack > 160) return { name: "Deoxys Attack", tag: "Attack", slug: "deoxys-attack" };
        if (stats.Defence > 140) return { name: "Deoxys Defense", tag: "Defense", slug: "deoxys-defense" };
    }
    if (pName === "Terapagos") {
        if(stats.HP > 150) return { name: "Terapagos Stellar", tag: "Stellar", slug: "terapagos-stellar" };
        if(stats.HP > 100) return { name: "Terapagos Terastal", tag: "Terastal", slug: "terapagos-terastal" };
    }
    if (pName === "Ogerpon") {
        if(types.includes("Water")) return { name: "Ogerpon Wellspring", tag: "Wellspring", slug: "ogerpon-wellspring" };
        if(types.includes("Fire")) return { name: "Ogerpon Hearthflame", tag: "Hearthflame", slug: "ogerpon-hearthflame" };
        if(types.includes("Rock")) return { name: "Ogerpon Cornerstone", tag: "Cornerstone", slug: "ogerpon-cornerstone" };
    }
    // Formes Hisui/Galar détectées par type si pas explicite dans le nom
    if (pName === "Zoroark" && types.includes("Normal") && types.includes("Ghost")) return { name: "Hisuian Zoroark", tag: "Hisuian", slug: "zoroark-hisui" };
    
    return null;
}

function formatPokemon(data, id, isForm = false, parentData = null, formKey = null) {
    if (!data) return null;

    let displayName = data.pixelmonName || (parentData ? parentData.pixelmonName : "Inconnu");
    let detectedTag = data.formType || (isForm ? "Forme" : "");
    let cosmeticTheme = data.cosmeticTheme || null;
    let customSlug = null;

    // --- DÉTECTION INTELLIGENTE DES FORMES ---
    if (isForm && parentData) {
        const pName = parentData.pixelmonName;
        
        // CAS 1 : GMAX FORCE
        if (formKey === "GMAX_FORCE") {
            detectedTag = "Gigantamax";
            displayName = `Gigantamax ${pName}`;
            customSlug = `${pName.toLowerCase()}-gigantamax`;
        }
        // CAS 2 : Cosmétiques
        else if (formKey && COSMETIC_MAP[formKey]) {
            cosmeticTheme = COSMETIC_MAP[formKey];
            detectedTag = "Cosmetic";
            displayName = `${cosmeticTheme} ${pName}`;
        } 
        // CAS 3 : Formes Standards
        else {
            const fKey = parseInt(formKey);
            const special = identifySpecialForm(pName, formKey, data, parentData);
            
            if (special) {
                displayName = special.name; 
                detectedTag = special.tag; 
                customSlug = special.slug;
            } 
            else {
                // LOGIQUE STRICTE MEGA & GIGANTAMAX
                if (["Charizard", "Mewtwo"].includes(pName)) {
                    if (fKey === 1) { detectedTag = "Mega"; displayName = `Mega ${pName} X`; customSlug = `${pName.toLowerCase()}-mega-x`; }
                    else if (fKey === 2) { detectedTag = "Mega"; displayName = `Mega ${pName} Y`; customSlug = `${pName.toLowerCase()}-mega-y`; }
                    else if (fKey === 3 && OFFICIAL_GMAX.includes(pName)) { detectedTag = "Gigantamax"; displayName = `Gigantamax ${pName}`; customSlug = `${pName.toLowerCase()}-gigantamax`; }
                }
                else if (OFFICIAL_MEGAS.includes(pName) && OFFICIAL_GMAX.includes(pName)) {
                    if (fKey === 1) { detectedTag = "Mega"; displayName = `Mega ${pName}`; customSlug = `${pName.toLowerCase()}-mega`; }
                    else if (fKey === 2) { detectedTag = "Gigantamax"; displayName = `Gigantamax ${pName}`; customSlug = `${pName.toLowerCase()}-gigantamax`; }
                }
                else if (OFFICIAL_MEGAS.includes(pName)) {
                    if (fKey === 1) { detectedTag = "Mega"; displayName = `Mega ${pName}`; customSlug = `${pName.toLowerCase()}-mega`; }
                }
                else if (OFFICIAL_GMAX.includes(pName)) {
                    if (fKey >= 1) { detectedTag = "Gigantamax"; displayName = `Gigantamax ${pName}`; customSlug = `${pName.toLowerCase()}-gigantamax`; }
                }
                else {
                    for (const [region, pokes] of Object.entries(REGION_MAPPING)) {
                        if (pokes.includes(pName) && isFormDistinct(data, parentData)) {
                            detectedTag = region; displayName = `${region} ${pName}`; customSlug = `${pName.toLowerCase()}-${region.toLowerCase()}`; break;
                        }
                    }
                }
            }
        }
    }

    // --- ID INTERNE (CLÉ POUR LE MAPPING DES SPRITES 2D ET 3D) ---
    const internalId = data.pixelmonName || (parentData ? parentData.pixelmonName : null) || data.name;

    // --- STATS ---
    let finalStats = data.stats ? { ...data.stats } : (parentData ? { ...parentData.stats } : {HP:0,Attack:0,Defence:0,Speed:0,SpecialAttack:0,SpecialDefence:0});
    if (detectedTag === "Gigantamax") {
        if(finalStats.HP === parentData?.stats?.HP) { finalStats = { ...finalStats }; finalStats.HP = Math.floor(finalStats.HP * 2); }
    }

    // --- CAPABILITIES ---
    const checkCap = (keyRoot, keyCap) => {
        if (data[keyRoot] === true) return true;
        if (data.capabilities && data.capabilities[keyCap] === true) return true;
        if (parentData) {
            if (data[keyRoot] === undefined && (!data.capabilities || data.capabilities[keyCap] === undefined)) {
                if (parentData[keyRoot] === true) return true;
                if (parentData.capabilities && parentData.capabilities[keyCap] === true) return true;
            }
        }
        return false;
    };

    let caps = {
        ride: checkCap('isRideable', 'ride'),
        fly: checkCap('canFly', 'fly'),
        surf: checkCap('canSurf', 'surf')
    };

    // =========================================================
    // --- GESTION DES IMAGES (LOGIQUE DÉCOUPLÉE) ---
    // =========================================================
    let localImg = "";
    let imgSlug = "";
    
    // 1. DÉTERMINATION DU SLUG STANDARD
    if (customSlug) {
        imgSlug = customSlug;
    } else if (displayName.toLowerCase() === "missingno") {
        imgSlug = "missingno";
    } else {
        const rawName = parentData ? parentData.pixelmonName : (data.pixelmonName || displayName);
        const nameFixes = {
            "nidoranmale": "nidoran-m", "nidoranm": "nidoran-m", "nidoranfemale": "nidoran-f", "nidoranf": "nidoran-f",
            "mrmime": "mr-mime", "mimejr": "mime-jr", "mrrime": "mr-rime", "typenull": "type-null", "hooh": "ho-oh", 
            "porygonz": "porygon-z", "jangmoo": "jangmo-o", "hakamoo": "hakamo-o", "kommoo": "kommo-o",
            "tapukoko": "tapu-koko", "tapulele": "tapu-lele", "tapubulu": "tapu-bulu", "tapufini": "tapu-fini"
        };
        const cleanKey = rawName.toLowerCase().replace(/[\.\s']/g, "");
        imgSlug = nameFixes[cleanKey] || rawName.toLowerCase().replace(/['\.]/g, "").replace(/\s+/g, "-");
    }

    if (detectedTag === "Gigantamax") imgSlug = imgSlug.replace(/-gmax$/, "").replace(/-gigantamax$/, "") + "-gigantamax";
    if (detectedTag === "Mega" && !imgSlug.includes("-mega")) imgSlug += "-mega";

    // 2. CHOIX DE L'IMAGE FINALE (PRIORITÉ AU MAPPING 2D)
    // On regarde si internalId (ex: "Bulbasaur") existe dans spritePictures (chargé depuis spritegamepicture.json)
    if (typeof spritePictures !== 'undefined' && spritePictures[internalId]) {
        localImg = `/assets/plugins/pokedex/data/sprites/${spritePictures[internalId]}`;
    } else {
        // Sinon, chemin standard par défaut
        localImg = `/assets/plugins/pokedex/img/${imgSlug}.png`;
    }

    let fallbackImg = `https://img.pokemondb.net/sprites/home/normal/${imgSlug}.png`;
    if (imgSlug === "missingno") fallbackImg = "https://img.pokemondb.net/sprites/red-blue/normal/missingno.png";

    return {
        name: displayName,
        pixelmonName: internalId, // Utilisé par openModal pour l'image 3D
        id: isForm ? `${id}-${formKey}` : `${id}-base`,
        pokedexId: id,
        tag: detectedTag,
        cosmeticTheme: cosmeticTheme,
        parentName: parentData ? parentData.pixelmonName : null,
        types: data.types || (parentData ? parentData.types : ["Normal"]),
        stats: finalStats,
        totalStats: Object.values(finalStats).reduce((a,b)=>a+b,0),
        weight: data.weight || parentData?.weight || 0,
        height: data.height || parentData?.height || 0,
        catchRate: data.catchRate || parentData?.catchRate || 45,
        eggCycles: data.eggCycles !== undefined ? data.eggCycles : (parentData?.eggCycles !== undefined ? parentData.eggCycles : 20),
        eggGroups: data.eggGroups || parentData?.eggGroups || [],
        abilities: data.abilities || parentData?.abilities || [],
        malePercent: data.malePercent ?? parentData?.malePercent ?? 50,
        moves: {
            levelUp: data.levelUpMoves || parentData?.levelUpMoves || {},
            tm: [...(data.tmMoves8 || []), ...(data.tmMoves9 || [])],
            egg: data.eggMoves || [],
            tutor: data.tutorMoves || []
        },
        evolutions: Array.isArray(data.evolutions) ? data.evolutions : [],
        preEvolutions: Array.isArray(data.preEvolutions) ? data.preEvolutions : [],
        capabilities: caps, 
        img: localImg,
        fallbackImg: fallbackImg,
        
        // Nettoyage pour forcer l'usage des dictionnaires JSON externes
        customImage: null,
        ingameImage: null
    };
}

// =====================================================================================
// 5. AFFICHAGE ET FILTRES
// =====================================================================================

function getTier(poke) {
    if (!poke) return "Unknown";
    if (SMOGON_TIERS[poke.name]) return SMOGON_TIERS[poke.name];
    if (poke.tag === "Mega" || poke.tag === "Gigantamax" || poke.tag === "Legendary") return "Uber";
    if (poke.tag === "Paradox" || poke.tag === "UltraBeast") return "OU";
    if (poke.totalStats >= 670) return "Uber";
    if (poke.totalStats >= 570) return "OU";
    return "LC";
}

function applyFilters() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const sortType = document.getElementById('sort-select').value;
    const activeTypes = getCheckedValues('filter-type');
    const activeEggs = getCheckedValues('filter-egg');
    const activeTags = getCheckedValues('filter-main-tag');
    const activeTiers = getCheckedValues('filter-tier');

    if(term === "fav:") {
        displayedPokemon = allPokemon.filter(p => favorites.includes(p.id));
        renderGrid(true);
        return;
    }

    const statFilters = [];
    document.querySelectorAll('.stat-input').forEach(input => {
        if(input.value) statFilters.push({ stat: input.dataset.stat, val: parseInt(input.value), isMin: input.classList.contains('min') });
    });

    displayedPokemon = allPokemon.filter(p => {
        if (term && !p.name.toLowerCase().includes(term) && !String(p.pokedexId).includes(term)) return false;
        if (activeTypes.length > 0 && !p.types.some(t => activeTypes.includes(t))) return false;
        if (activeEggs.length > 0 && !p.eggGroups.some(g => activeEggs.includes(g))) return false;
        if (activeTiers.length > 0 && !activeTiers.includes(getTier(p))) return false;
        if (activeTags.length > 0 && !activeTags.includes(p.tag)) return false;
        if (activeTags.length === 0 && (p.tag === 'Cosmetic' || p.cosmeticTheme)) return false;

        for(const f of statFilters) {
            const val = p.stats[f.stat] || 0;
            if(f.isMin && val < f.val) return false;
            if(!f.isMin && val > f.val) return false;
        }
        return true;
    });

    displayedPokemon.sort((a, b) => {
        if (sortType === 'id') return parseInt(a.pokedexId) - parseInt(b.pokedexId);
        if (sortType === 'name') return a.name.localeCompare(b.name);
        if (sortType === 'tier') return (TIER_RANK[getTier(a)]||99) - (TIER_RANK[getTier(b)]||99);
        if (sortType === 'weight') return b.weight - a.weight;
        if (sortType.startsWith('stat-')) {
            const key = sortType.replace('stat-', '');
            const valA = key === 'total' ? a.totalStats : (a.stats[key === 'attack' ? 'Attack' : key === 'speed' ? 'Speed' : key === 'spatk' ? 'SpecialAttack' : 'HP'] || 0);
            const valB = key === 'total' ? b.totalStats : (b.stats[key === 'attack' ? 'Attack' : key === 'speed' ? 'Speed' : key === 'spatk' ? 'SpecialAttack' : 'HP'] || 0);
            return valB - valA;
        }
        return 0;
    });

    currentPage = 1;
    renderGrid(true);
}

function renderGrid(reset = false) {
    const grid = document.getElementById('pokedex-grid');
    const loadBtn = document.getElementById('load-more-container');
    if (reset) grid.innerHTML = '';

    const slice = displayedPokemon.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    if (slice.length === 0 && reset) {
        grid.innerHTML = '<div class="col-span-full text-center opacity-50 italic py-10">Aucun résultat.</div>';
        loadBtn.classList.add('hidden');
        return;
    }

    slice.forEach(poke => {
        const typesHtml = poke.types.map(t => `<span class="type-badge type-${t}">${t}</span>`).join(' ');
        const tier = getTier(poke);
        const tagHtml = poke.tag ? `<span class="form-tag ${poke.tag === 'Mega' ? 'tag-mega' : (poke.tag === 'Gigantamax' ? 'tag-gigantamax' : 'bg-blue-600/50 text-white')}">${poke.tag}</span>` : '';
        const tierHtml = tier !== "Unknown" ? `<span class="tier-badge">${tier}</span>` : '';
        const isFav = favorites.includes(poke.id) ? 'active' : '';
        const isComp = compareList.includes(poke.id) ? 'compare-active' : '';

        const card = document.createElement('div');
        card.className = 'glass-card rounded-2xl p-4 flex flex-col items-center cursor-pointer transition poke-card-hover group border border-white/5 bg-[#1e293b]/50 relative overflow-hidden';
        card.onclick = () => openModal(poke);

        card.innerHTML = `
            <div class="card-actions">
                <button class="btn-mini ${isComp}" onclick="event.stopPropagation(); toggleCompare('${poke.id}')" title="Comparer"><i class="fas fa-balance-scale"></i></button>
                <button class="btn-mini ${isFav}" onclick="event.stopPropagation(); toggleFavorite('${poke.id}')" title="Favori"><i class="fas fa-heart"></i></button>
                <button class="btn-mini" onclick="event.stopPropagation(); toggleTeam('${poke.id}')" title="Équipe"><i class="fas fa-plus"></i></button>
            </div>
            <div class="w-full flex justify-between items-start mb-2 opacity-50 text-[10px] font-mono"><span>#${poke.pokedexId}</span> ${tierHtml}</div>
            <div class="h-32 w-32 flex items-center justify-center mb-4 relative">
                 <div class="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500"></div>
                 <img src="${poke.img}" class="h-full w-full object-contain relative z-10" loading="lazy" onerror="this.onerror=null; this.src='${poke.fallbackImg}';">
            </div>
            <div class="flex items-center justify-center w-full mb-2"><h3 class="font-bold text-white uppercase italic tracking-wider text-sm truncate">${poke.name}</h3>${tagHtml}</div>
            <div class="flex flex-wrap justify-center gap-1 mt-auto">${typesHtml}</div>
        `;
        grid.appendChild(card);
    });
    loadBtn.classList.toggle('hidden', displayedPokemon.length <= currentPage * ITEMS_PER_PAGE);
}

// =====================================================================================
// 6. MODALE PRINCIPALE (CONTENU COMPLET)
// =====================================================================================

function openModal(poke) {
    currentPokemon = poke;
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-body-content');
    
    // --- CHEMIN DES IMAGES CUSTOM (In-Game) ---
    const customSpritePath = '/assets/plugins/pokedex/data/sprites/';

    // --- 1. HELPERS ---
    const getFallback = (pName) => {
        let clean = pName.toLowerCase().replace(/['\.]/g, "");
        const regions = ["alolan", "galarian", "hisuian", "paldean", "mega", "gigantamax"];
        const parts = clean.split(" ");
        if (parts.length > 1 && regions.includes(parts[0])) clean = `${parts[1]}-${parts[0]}`;
        else clean = clean.replace(/\s+/g, "-");
        return `https://img.pokemondb.net/sprites/home/normal/${clean}.png`;
    };
    const getTreeSprite = (pName) => {
        const found = allPokemon.find(p => p.name === pName);
        return found?.img || `/assets/plugins/pokedex/img/${pName}.png`;
    };

    // --- 2. LOGIQUE ARBRE ---
    let familyRoot = null;
    let temp = poke;
    if (poke.parentName && (poke.tag === "Mega" || poke.tag === "Gigantamax" || poke.tag === "Cosmetic")) {
        const parentBase = allPokemon.find(p => p.name === poke.parentName && !p.isForm);
        if (parentBase) temp = parentBase;
    }
    while (temp) {
        const tempBase = allPokemon.find(p => p.name === temp.name && !p.isForm) || temp;
        const parentName = tempBase.preEvolutions && tempBase.preEvolutions.length > 0 ? tempBase.preEvolutions[tempBase.preEvolutions.length - 1] : null;
        if (!parentName) { familyRoot = temp.name; break; }
        let parentData = null;
        if (temp.tag && ["Alolan", "Galarian", "Hisuian", "Paldean"].includes(temp.tag)) parentData = allPokemon.find(p => p.name === `${temp.tag} ${parentName}`);
        if (!parentData) parentData = allPokemon.find(p => p.name === parentName && !p.isForm);
        if (!parentData) { familyRoot = parentName; break; }
        temp = parentData;
    }

    let treeVisited = new Set();
    let allFamilyStandardNames = [];

    const renderEvolutionTree = (currentName) => {
        if (treeVisited.has(currentName)) return "";
        treeVisited.add(currentName);
        if (!allFamilyStandardNames.includes(currentName)) allFamilyStandardNames.push(currentName);
        
        let displayPoke = allPokemon.find(p => p.name === currentName);
        let dataPoke = allPokemon.find(p => p.name === currentName && !p.isForm) || displayPoke;
        const isSelected = currentName === (poke.parentName || poke.name);
        const spriteUrl = getTreeSprite(currentName);
        const fallbackUrl = getFallback(currentName);
        const displayTag = displayPoke?.tag && ["Alolan", "Galarian", "Hisuian"].includes(displayPoke.tag) ? displayPoke.tag : "";

        let nodeHTML = `
            <div onclick="searchPokemon('${currentName.replace(/'/g,"\\'")}')" 
                 class="shrink-0 cursor-pointer flex flex-col items-center p-2 md:p-4 rounded-2xl transition border-2 ${isSelected && !poke.tag ? 'bg-blue-500/20 border-blue-500/50 shadow-lg' : 'bg-black/20 border-white/5 hover:border-blue-500/30 group'} min-w-[70px] md:min-w-[110px]">
                <img src="${spriteUrl}" class="w-10 h-10 md:w-16 md:h-16 object-contain" onerror="this.src='${fallbackUrl}'">
                <span class="text-[9px] md:text-sm font-black uppercase mt-1 md:mt-2 ${isSelected && !poke.tag ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'} text-center truncate w-full">${currentName}</span>
                ${displayTag ? `<span class="text-[7px] md:text-[9px] bg-white/10 px-1 md:px-2 rounded text-gray-400 mt-0.5">${displayTag}</span>` : ''}
            </div>
        `;

        if (dataPoke?.evolutions?.length > 0) {
            const childrenHTML = dataPoke.evolutions.map(evo => {
                let nextName = evo.to.name || evo.to;
                if (displayPoke?.tag && ["Alolan", "Galarian", "Hisuian"].includes(displayPoke.tag)) {
                    const regionalTarget = `${displayPoke.tag} ${nextName}`;
                    if (allPokemon.find(p => p.name === regionalTarget)) nextName = regionalTarget;
                }
                let condText = typeof formatEvolutionCondition === 'function' ? formatEvolutionCondition(evo) : (evo.level ? `Niv. ${evo.level}` : 'Spécial');
                return `
                    <div class="flex items-center mx-1 md:mx-3">
                        <div class="flex flex-col items-center px-1 opacity-60 min-w-[30px] md:min-w-[50px]">
                            <div class="text-[7px] md:text-[9px] font-black uppercase bg-blue-500/10 px-1 md:px-2 rounded mb-0.5 border border-blue-500/20 text-blue-300 text-center whitespace-nowrap">${condText}</div>
                            <i class="fas fa-long-arrow-alt-right text-gray-500 text-xs md:text-lg"></i>
                        </div>
                        ${renderEvolutionTree(nextName)}
                    </div>`;
            }).join('');
            return `<div class="flex items-center">${nodeHTML}<div class="flex items-center">${childrenHTML}</div></div>`;
        }
        return `<div class="flex items-center">${nodeHTML}</div>`;
    };

    const standardChainHTML = renderEvolutionTree(familyRoot);
    const superEvos = allPokemon.filter(f => allFamilyStandardNames.includes(f.parentName) && (['Mega','Gigantamax','Primal','Ultra'].includes(f.tag)));
    let superEvoHTML = "";
    if (superEvos.length > 0) {
        superEvoHTML = `<div class="flex items-center ml-2 md:ml-6 gap-2 md:gap-4 border-l border-white/10 pl-2 md:pl-6">` + superEvos.map(f => `
             <div onclick="searchPokemon('${f.name.replace(/'/g,"\\'")}')" class="shrink-0 cursor-pointer flex flex-col items-center p-2 md:p-3 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition group min-w-[60px] md:min-w-[90px]">
                <img src="${f.img}" class="w-8 h-8 md:w-12 md:h-12 object-contain" onerror="this.src='${f.fallbackImg}'">
                <span class="text-[7px] md:text-[10px] ${f.tag === 'Gigantamax' ? 'text-red-400' : 'text-yellow-500'} mt-1 font-bold group-hover:text-white transition text-center">${f.tag === 'Gigantamax' ? 'G-MAX' : f.tag}</span>
             </div>`).join('') + `</div>`;
    }

    // --- 4. VISUELS ---
    const badges = poke.types.map(t => `<span class="type-badge type-${t} text-[10px] md:text-xs py-1 px-2">${t}</span>`).join(' ');
    const catchInfo = typeof getCatchGroup === 'function' ? getCatchGroup(poke.catchRate) : { label: '?', color: 'text-gray-500' };
    const mainImgId = `modal-main-img-${poke.id}`;
    let genderHTML = (poke.malePercent === -1)
        ? `<span class="text-gray-400 font-bold italic"><i class="fas fa-genderless"></i> Asexué</span>`
        : `<span class="font-bold text-xs"><span class="text-blue-400">${poke.malePercent}% ♂</span> <span class="text-pink-400">${100 - poke.malePercent}% ♀</span></span>`;

    const cycles = poke.eggCycles || 20;
    const stepsBase = (cycles + 1) * 255;
    const stepsBoost = Math.ceil(stepsBase / 2);
    
    let breedingBlocksHTML = "";
    poke.types.forEach(type => {
        const blocks = BREEDING_BLOCKS[type] || [];
        if(blocks.length > 0) {
            breedingBlocksHTML += `
                <div class="mb-3">
                    <h5 class="text-xs uppercase font-bold text-gray-400 mb-2 border-b border-white/5 pb-1">Blocs Type <span class="text-${type.toLowerCase()}">${type}</span></h5>
                    <div class="breeding-grid">
                        ${blocks.map(b => `<div class="block-card"><div class="text-[10px] text-gray-300">${b.n}</div><div class="block-val">+${b.v}</div></div>`).join('')}
                    </div>
                </div>`;
        }
    });

    // --- BLOC APERÇU IN-GAME (MODIFIÉ AVEC ZOOM) ---
    const linkedImage = ingamePictures[poke.pixelmonName];

    // J'ai ajouté onclick="openImageZoom(this.src)" et la classe cursor-zoom-in
    const ingamePreviewHTML = (linkedImage) ? `
        <div class="mt-4 w-full bg-[#0f172a] rounded-xl border border-white/5 p-3 group relative overflow-hidden shadow-lg">
            <h4 class="text-[9px] uppercase text-gray-500 font-bold mb-2 text-center tracking-widest">Aperçu en Jeu (3D)</h4>
            <div class="relative overflow-hidden rounded-lg border border-white/5 aspect-video flex items-center justify-center bg-black/20 group cursor-zoom-in" onclick="openImageZoom('${customSpritePath}${linkedImage}')">
                 <div class="absolute inset-0 bg-[url('/assets/img/pattern.png')] opacity-10 pointer-events-none"></div>
                 <img src="${customSpritePath}${linkedImage}" class="w-full h-full object-contain z-10 group-hover:scale-110 transition duration-700 ease-in-out" onerror="this.parentElement.parentElement.style.display='none'">
                 <div class="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"><i class="fas fa-search-plus"></i> Zoom</div>
            </div>
        </div>
    ` : '';
    // -------------------------------------

    let itemsHTML = `
        <div class="item-row"><span><i class="fas fa-link text-gray-500"></i> Nœud Destin</span> <span class="text-gray-400">5 IVs</span></div>
        <div class="item-row"><span><i class="fas fa-gem text-gray-500"></i> Pierre Stase</span> <span class="text-gray-400">Nature</span></div>
        <div class="item-row"><span><i class="fas fa-dumbbell text-gray-500"></i> Objets Pouvoir</span> <span class="text-gray-400">1 IV</span></div>
        <div class="item-row"><span><i class="fas fa-ring text-gray-500"></i> Charme Ovale</span> <span class="text-gray-400">Oeufs ++</span></div>
    `;
    if (INCENSE_DATA[poke.name]) {
        itemsHTML += `<div class="item-row bg-yellow-500/10 border-yellow-500/30"><span class="text-yellow-400"><i class="fas fa-baby"></i> Requis (Bébé)</span> <span class="font-bold text-white">${INCENSE_DATA[poke.name]}</span></div>`;
    }

    // --- HTML GENERAL ---
    const generalHTML = `
        <div id="tab-general" class="tab-panel active space-y-6">
            <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
                
                <div class="w-full md:w-1/3 flex flex-col items-center">
                    <div class="relative w-48 h-48 md:w-full md:aspect-square flex items-center justify-center bg-white/5 rounded-full md:rounded-2xl border border-white/5 mb-4 group overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                        <div class="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-50"></div>
                        <img id="${mainImgId}" src="${poke.img}" onclick="openImageZoom(this.src)" class="w-32 h-32 md:w-3/4 md:h-3/4 object-contain z-10 drop-shadow-2xl group-hover:scale-110 transition duration-500 cursor-zoom-in" onerror="this.src='${poke.fallbackImg}'">
                        <button onclick="toggleShiny('${mainImgId}', this)" class="shiny-btn absolute top-2 right-2 text-yellow-400 bg-black/50 p-2 rounded-full" title="Voir Shiny">✨</button>
                    </div>
                    
                    <div class="flex flex-wrap justify-center gap-1 w-full">${badges}</div>
                    
                    ${ingamePreviewHTML}
                </div>

                <div class="w-full md:w-2/3 space-y-5">
                    <div class="flex flex-col md:flex-row justify-between items-center md:items-start border-b border-white/5 pb-4 text-center md:text-left gap-4">
                        <div>
                            <h2 class="text-3xl md:text-5xl font-black text-white italic uppercase leading-none">${poke.name}</h2>
                            <span class="text-blue-500 font-mono tracking-widest text-lg opacity-80">#${poke.pokedexId}</span>
                        </div>
                        <div class="flex flex-row md:flex-col items-center md:items-end gap-2 w-full md:w-auto justify-center md:justify-end">
                             <button id="btn-add-team" onclick="toggleTeam('${poke.id}')" class="flex-1 md:flex-none w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-6 py-3 rounded-xl transition uppercase tracking-tighter shadow-lg shadow-blue-600/20">
                                ${myTeam.includes(poke.id) ? 'Retirer' : 'Ajouter'}
                             </button>
                             ${poke.tag ? `<span class="px-3 py-1 rounded bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-wider">${poke.tag}</span>` : ''}
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xs md:text-sm">
                        <div class="bg-[#1e293b]/50 p-3 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between items-center text-center md:text-left"><span class="text-gray-400 uppercase tracking-wide text-[10px]">Poids</span> <strong>${poke.weight} kg</strong></div>
                        <div class="bg-[#1e293b]/50 p-3 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between items-center text-center md:text-left"><span class="text-gray-400 uppercase tracking-wide text-[10px]">Taille</span> <strong>${poke.height} m</strong></div>
                        <div class="bg-[#1e293b]/50 p-3 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between items-center text-center md:text-left"><span class="text-gray-400 uppercase tracking-wide text-[10px]">Capture</span> <div class="flex flex-col md:flex-row items-center gap-1"><strong>${poke.catchRate}</strong> <span class="catch-badge border ${catchInfo.color} ${catchInfo.color.split(' ')[0]}">${catchInfo.label}</span></div></div>
                        <div class="bg-[#1e293b]/50 p-3 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between items-center text-center md:text-left"><span class="text-gray-400 uppercase tracking-wide text-[10px]">Sexe</span> ${genderHTML}</div>
                    </div>
                    <div class="flex justify-around bg-[#0f172a] p-4 rounded-xl border border-white/5 mt-4">
                        ${['ride','fly','surf'].map(c => `<div class="flex flex-col items-center gap-1 ${poke.capabilities[c] ? 'text-blue-400' : 'text-gray-600 opacity-30'}"><i class="fas fa-${c==='ride'?'horse':(c==='fly'?'plane':'water')} text-xl"></i><span class="text-[9px] uppercase font-bold">${c}</span></div>`).join('')}
                    </div>
                    <div class="bg-black/20 p-3 rounded-lg border border-white/5">
                        <h4 class="text-[10px] uppercase text-gray-500 font-bold mb-2 text-center md:text-left">Faiblesses</h4>
                        <div class="flex flex-wrap gap-2 justify-center md:justify-start text-[10px]">
                            ${Object.entries(calculateWeaknesses(poke.types)).map(([t,m]) => m===1?'':`<span class="px-2 py-1 bg-white/5 rounded border border-white/5 ${m>1?(m>2?'text-red-500 font-black':'text-red-400'):'text-green-400'}">${t} x${m}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div class="pt-6 border-t border-white/5">
                <h4 class="font-bold text-gray-500 text-[10px] uppercase mb-4 tracking-widest text-center">Lignée Évolutive</h4>
                <div class="w-full overflow-x-auto custom-scroll pb-4">
                    <div class="flex items-center justify-start md:justify-center min-w-max px-4 space-x-4 md:space-x-8">
                        ${standardChainHTML} ${superEvoHTML}
                    </div>
                </div>
            </div>
        </div>`;

    // --- ANALYSE STRATÉGIQUE AVANCÉE ---
    const totalBS = Object.values(poke.stats).reduce((a,b) => a+b, 0);
    const getStatAnalysis = (s) => {
        const sorted = Object.entries(s).sort((a,b) => b[1] - a[1]);
        const best = sorted[0];
        const second = sorted[1];
        
        let role = "";
        if (best[0] === 'Speed') role = "Speedster / Pivot Rapide";
        else if (best[0] === 'Attack') role = "Sweeper Physique";
        else if (best[0] === 'SpecialAttack') role = "Sweeper Spécial";
        else if (best[0] === 'Defence' || best[0] === 'SpecialDefence') role = "Mur Défensif / Tank";
        else if (best[0] === 'HP') role = "PV Sac / Support";
        else role = "Polyvalent";

        if (best[1] > 130) role = "<strong>Uber</strong> " + role;
        
        return `<div class="flex items-center gap-3">
            <div class="text-2xl text-yellow-400"><i class="fas fa-chess-king"></i></div>
            <div>
                <div class="text-xs text-gray-400 uppercase font-bold">Rôle Suggéré</div>
                <div class="text-white font-bold text-sm">${role}</div>
                <div class="text-[10px] text-gray-500 mt-1">Points forts : <span class="text-blue-300">${best[0]} (${best[1]})</span> & <span class="text-blue-300">${second[0]} (${second[1]})</span></div>
            </div>
        </div>`;
    };

    const statRows = Object.entries(poke.stats).map(([key, base]) => {
        let min, max;
        if (key === 'HP') { min = (base===1)?1:Math.floor(2*base+110+31); max = (base===1)?1:Math.floor(2*base+110+31+63); }
        else { min = Math.floor((2*base+5+31)*0.9); max = Math.floor((2*base+5+31+63)*1.1); }
        const pct = Math.min((base/255)*100, 100);
        const color = base < 60 ? 'bg-red-500' : (base < 100 ? 'bg-yellow-500' : (base < 130 ? 'bg-green-500' : 'bg-cyan-500'));
        return `<div class="grid grid-cols-[30px_30px_1fr_40px_40px] md:grid-cols-[40px_35px_1fr_40px_40px] gap-2 md:gap-3 items-center text-xs mb-3 group hover:bg-white/5 p-1 rounded transition"><div class="font-bold text-gray-400 uppercase text-[10px]">${key.substring(0,3)}</div><div class="font-bold text-white text-right">${base}</div><div class="h-2 bg-gray-700/50 rounded-full overflow-hidden relative"><div class="h-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.3)]" style="width:${pct}%"></div></div><div class="text-gray-500 text-right font-mono text-[10px] hidden md:block">${min}</div><div class="text-white text-right font-bold font-mono text-[10px] hidden md:block">${max}</div></div>`;
    }).join('');

    const statsHTML = `
    <div id="tab-stats" class="tab-panel">
        <div class="flex flex-col gap-6 h-full">
            <div class="flex flex-col lg:flex-row gap-6">
                <div class="w-full lg:w-1/2 bg-[#1e293b]/50 p-5 rounded-2xl border border-white/5 flex flex-col justify-center">
                    <div class="flex justify-between items-end mb-4 border-b border-white/10 pb-2"><h4 class="font-black text-white uppercase text-sm">Stats de Base</h4><div class="text-[9px] text-gray-400 uppercase tracking-widest hidden md:flex gap-4"><span>Base</span><span class="mr-8">Barre</span><span>Min (Lv100) Max</span></div></div>
                    ${statRows}
                    <div class="mt-auto pt-3 border-t border-white/10 flex justify-between items-center"><span class="font-bold text-gray-400 uppercase text-xs">Total (BST)</span><span class="text-2xl font-black ${totalBS>=600?'text-purple-400':(totalBS>=500?'text-green-400':'text-white')}">${totalBS}</span></div>
                </div>
                <div class="w-full lg:w-1/2 bg-[#1e293b]/50 p-4 rounded-2xl border border-white/5 flex items-center justify-center relative" style="min-height: 350px;">
                    <div style="width: 100%; height: 100%;"><canvas id="statChart" style="max-height: 100%; max-width: 100%;"></canvas></div>
                </div>
            </div>
            <div class="w-full p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">${getStatAnalysis(poke.stats)}</div>
        </div>
    </div>`;
    
    const movesHTML = `<div id="tab-moves" class="tab-panel"><div class="flex gap-2 mb-4 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar"><button class="move-cat-btn active whitespace-nowrap" onclick="switchMoveTab('levelUp', this)">Niveau</button><button class="move-cat-btn whitespace-nowrap" onclick="switchMoveTab('tm', this)">CT/CS</button><button class="move-cat-btn whitespace-nowrap" onclick="switchMoveTab('egg', this)">Œuf</button><button class="move-cat-btn whitespace-nowrap" onclick="switchMoveTab('tutor', this)">Maître</button></div><div id="moves-container" class="max-h-[400px] overflow-y-auto custom-scroll p-2"></div></div>`;
    
    const natureOptions = Object.keys(NATURES).sort().map(n => `<option value="${n}">${n}</option>`).join('');
    const simRows = Object.keys(poke.stats).map(key => `<div class="sim-row grid grid-cols-[30px_30px_1fr_1fr_30px] gap-2 items-center text-[10px] mb-2"><div class="font-bold text-gray-400">${key.substring(0,3)}</div><div class="text-center">${poke.stats[key]}</div><div class="flex items-center gap-1"><span class="text-gray-600">IV</span><input type="number" id="iv-${key}" class="bg-black/30 border border-white/10 rounded w-full px-1 text-center py-1" value="31" min="0" max="31" oninput="updateCalculator()"></div><div class="flex items-center gap-1"><span class="text-gray-600">E</span><input type="number" id="ev-${key}" class="bg-black/30 border border-white/10 rounded w-full px-1 text-center py-1" value="0" min="0" max="252" step="4" oninput="updateCalculator()"></div><div class="font-bold text-blue-400 text-right" id="res-${key}">0</div></div>`).join('');
    
    const simuHTML = `
    <div id="tab-simu" class="tab-panel space-y-6">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-1/2 bg-[#0f172a] p-4 rounded-xl border border-white/5">
                <h4 class="font-bold text-green-400 uppercase text-xs mb-4">Calculateur Stratégique</h4>
                <div class="flex gap-2 mb-2 items-center text-xs"><label>Niveau</label><input type="number" id="sim-level" value="50" min="1" max="100" class="bg-black/30 border border-white/10 rounded w-12 text-center text-white p-2" oninput="updateCalculator()"><label>Nature</label><select id="sim-nature" class="bg-black/30 border border-white/10 rounded w-24 text-white p-2" onchange="updateCalculator()">${natureOptions}</select></div>
                <div>${simRows}</div>
            </div>
            <div class="w-full md:w-1/2 bg-[#1e293b]/50 p-4 rounded-xl border border-white/5 text-xs space-y-3">
                <h4 class="font-bold text-green-400 uppercase mb-4">Simulateur Capture</h4>
                <div class="space-y-2"><label class="block text-gray-400">Type de Ball</label><select id="catch-ball" class="w-full bg-black/30 border border-white/10 rounded p-1 text-white" onchange="updateCatchRate()"><option value="poke">Poké Ball (x1)</option><option value="great">Super Ball (x1.5)</option><option value="ultra">Hyper Ball (x2)</option><option value="master">Master Ball (100%)</option><option value="net">Filet Ball (Eau/Ins)</option><option value="dive">Scuba Ball (Eau)</option><option value="dusk">Sombre Ball (Nuit)</option><option value="quick">Rapide Ball (T1)</option><option value="timer">Chrono Ball</option><option value="repeat">Bis Ball</option><option value="nest">Faiblo Ball</option></select></div>
                <div class="space-y-2"><label class="block text-gray-400">Statut</label><select id="catch-status" class="w-full bg-black/30 border border-white/10 rounded p-1 text-white" onchange="updateCatchRate()"><option value="1">Aucun</option><option value="1.5">Statut (Par/Brûl/Ps)</option><option value="2.5">Sommeil / Gel</option></select></div>
                <div class="grid grid-cols-2 gap-2"><label class="flex items-center gap-2"><input type="checkbox" id="chk-night" onchange="updateCatchRate()"> Nuit/Grotte</label><label class="flex items-center gap-2"><input type="checkbox" id="chk-turn1" onchange="updateCatchRate()"> Tour 1</label><label class="flex items-center gap-2"><input type="checkbox" id="chk-water" onchange="updateCatchRate()"> Eau</label><label class="flex items-center gap-2"><input type="checkbox" id="chk-caught" onchange="updateCatchRate()"> Déjà capturé</label></div>
                <div class="mt-4"><div class="flex justify-between mb-1"><label class="block text-gray-400">PV Restants</label><span id="catch-hp-val" class="font-bold text-green-400">100%</span></div><input type="range" id="catch-hp" class="w-full accent-green-500" min="1" max="100" value="100" oninput="updateCatchRate()"></div>
                <div class="bg-black/40 p-3 rounded text-center border border-white/5 mt-4"><div class="text-3xl font-black text-green-400" id="catch-result">0%</div></div>
            </div>
        </div>
    </div>`;

    const breedingHTML = `
        <div id="tab-breeding" class="tab-panel space-y-6">
            <div class="flex flex-col md:flex-row gap-6">
                <div class="w-full md:w-1/3 space-y-6">
                    <div class="steps-box text-center"><i class="fas fa-egg text-4xl text-yellow-300 mb-2"></i><h4 class="font-black text-white uppercase text-sm mb-1">Éclosion</h4><div class="text-[10px] text-blue-200 mb-4">${cycles} Cycles</div><div class="font-bold text-white mt-2">${(cycles+1)*255} pas</div></div>
                    
                    <div class="bg-red-500/10 p-3 rounded-lg border border-red-500/30 flex justify-between items-center text-xs">
                        <span class="text-red-300 font-bold"><i class="fas fa-fire mr-1"></i> Corps Ardent</span>
                        <span class="text-white font-bold">${stepsBoost.toLocaleString()} pas</span>
                    </div>

                    <div class="bg-[#1e293b]/50 p-4 rounded-xl border border-white/5 text-xs space-y-2">${itemsHTML}</div>
                </div>
                <div class="w-full md:w-2/3 bg-[#0f172a] p-5 rounded-2xl border border-white/5"><div class="mb-4"><h4 class="font-bold text-green-400 uppercase text-sm">Ranch</h4></div><div class="space-y-4">${breedingBlocksHTML || '<div class="text-gray-500 italic text-center py-10">Aucun bloc spécifique.</div>'}</div></div>
            </div>
        </div>`;

    content.innerHTML = generalHTML + statsHTML + movesHTML + simuHTML + breedingHTML;
    modal.classList.remove('hidden');
    openTab('general');

    setTimeout(() => {
        renderRadarChart(poke.stats);
        updateCatchRate(); 
        const simContainer = document.getElementById('sim-rows-container');
        if(simContainer) simContainer.innerHTML = simRows;
        updateCalculator();
        const moveBtn = document.querySelector('.move-cat-btn');
        if(moveBtn) switchMoveTab('levelUp', moveBtn);
    }, 100);
}

// =====================================================================================
// 7. ANALYSE D'ÉQUIPE V2 (INTELLIGENTE & COMPLETE)
// =====================================================================================

function calculateWeaknesses(types) {
    let result = {};
    Object.keys(TYPE_CHART).forEach(attacker => {
        let multiplier = 1;
        types.forEach(defender => { if(TYPE_CHART[attacker] && TYPE_CHART[attacker][defender] !== undefined) multiplier *= TYPE_CHART[attacker][defender]; });
        if(multiplier !== 1) result[attacker] = multiplier;
    });
    return result;
}

function calculateTeamSynergy(members) {
    let synergy = { weaknesses: {}, resistances: {}, immunities: {}, cores: [] };
    Object.keys(TYPE_CHART).forEach(t => { synergy.weaknesses[t] = 0; synergy.resistances[t] = 0; synergy.immunities[t] = 0; });

    members.forEach(p => {
        const weak = calculateWeaknesses(p.types);
        for (const [type, mult] of Object.entries(weak)) {
            if (mult > 1) synergy.weaknesses[type]++;
            if (mult < 1 && mult > 0) synergy.resistances[type]++;
            if (mult === 0) synergy.immunities[type]++;
        }
    });

    const teamTypes = new Set(members.flatMap(p => p.types));
    // Détection de Cores
    if(teamTypes.has("Fire") && teamTypes.has("Water") && teamTypes.has("Grass")) synergy.cores.push({name: "FWG Core", icon: "🔥💧🌿"});
    if(teamTypes.has("Dragon") && teamTypes.has("Steel") && teamTypes.has("Fairy")) synergy.cores.push({name: "Fantasy Core", icon: "🐲🛡️✨"});
    if(teamTypes.has("Psychic") && teamTypes.has("Fighting") && teamTypes.has("Dark")) synergy.cores.push({name: "Psy-Fight-Dark", icon: "🔮👊🌑"});
    if(teamTypes.has("Ice") && members.some(p => p.name.includes("Ninetales") || p.name.includes("Abomasnow"))) synergy.cores.push({name: "Hail/Snow Team", icon: "❄️"});

    return synergy;
}

function initDragAndDrop() {
    const draggables = document.querySelectorAll('.organizer-slot');
    const container = document.getElementById('team-organizer-container');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => { draggable.classList.add('opacity-50', 'dragging'); });
        draggable.addEventListener('dragend', () => { draggable.classList.remove('opacity-50', 'dragging'); saveNewOrder(); });
    });
    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientX);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) container.appendChild(draggable); else container.insertBefore(draggable, afterElement);
    });
}
function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.organizer-slot:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) return { offset: offset, element: child }; else return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
function saveNewOrder() {
    const newTeamIds = [];
    document.querySelectorAll('.organizer-slot').forEach(slot => { const uid = slot.getAttribute('data-uid'); if (uid) newTeamIds.push(uid); });
    myTeam = newTeamIds;
    localStorage.setItem('pokedex_team', JSON.stringify(myTeam));
    updateFloatingBar();
}

// --- HELPER : GROUPE DE CAPTURE ---
function getCatchGroup(rate) {
    if (rate >= 200) return { label: "Très Facile", color: "text-green-400 bg-green-400/10 border-green-400/20" };
    if (rate >= 150) return { label: "Facile", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
    if (rate >= 100) return { label: "Moyen", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" };
    if (rate >= 45) return { label: "Difficile", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" };
    return { label: "Légendaire", color: "text-red-500 bg-red-500/10 border-red-500/20" };
}

// Fonction Géante d'Analyse (Vue Débutant + Vue Expert)
function openTeamAnalysis() {
    if (myTeam.length === 0) { alert("Équipe vide !"); return; }
    document.getElementById('team-modal').classList.remove('hidden');

    const members = myTeam.map(uid => allPokemon.find(p => p.id === uid)).filter(p=>p);
    const synergy = calculateTeamSynergy(members);
    
    // Calculs de scores (Algorithme script.js)
    let scoreMeta = members.reduce((acc, p) => acc + (TIER_VALUES[getTier(p)] || 50), 0) / members.length;
    let scoreStruct = 50 + (synergy.cores.length * 20);
    const weaknessCount = Object.values(synergy.weaknesses).filter(c => c >= 3).length;
    let scoreSynergy = 100 - (weaknessCount * 15) + (Object.values(synergy.immunities).reduce((a,b)=>a+b,0) * 2);
    let finalScore = Math.floor((scoreMeta + scoreStruct + scoreSynergy) / 3);
    if(finalScore > 100) finalScore = 100;

    // Rôles (Checklist complète)
    const rolesCheck = [
        { name: "Pièges", desc: "Pose des dégâts résiduels (Stealth Rock...)", moves: ["Stealth Rock", "Spikes", "Toxic Spikes", "Sticky Web"], found: false },
        { name: "Nettoyeur", desc: "Enlève les pièges du terrain (Rapid Spin...)", moves: ["Rapid Spin", "Defog", "Mortal Spin", "Tidy Up"], found: false },
        { name: "Pivot", desc: "Change en attaquant (U-turn...)", moves: ["U-turn", "Volt Switch", "Flip Turn", "Parting Shot"], found: false },
        { name: "Soin", desc: "Se soigne (Recover...)", moves: ["Recover", "Roost", "Synthesis", "Moonlight", "Wish", "Milk Drink", "Slack Off"], found: false },
        { name: "Priorité", desc: "Attaque en premier", moves: ["Extreme Speed", "Mach Punch", "Bullet Punch", "Aqua Jet", "Shadow Sneak", "Sucker Punch", "Ice Shard"], found: false }
    ];
    
    members.forEach(p => {
        const allMoves = [...Object.values(p.moves.levelUp || {}).flat(), ...(p.moves.tm || []), ...(p.moves.egg || []), ...(p.moves.tutor || [])].map(m => String(m).toLowerCase());
        rolesCheck.forEach(r => { if(r.moves.some(m => allMoves.includes(m.toLowerCase()))) r.found = true; });
    });

    // Génération HTML
    const content = `
        <div class="relative h-full flex flex-col p-6">
            <button onclick="document.getElementById('team-modal').classList.add('hidden')" class="absolute top-0 right-0 text-white text-2xl hover:text-red-500">&times;</button>
            
            <div class="text-center mb-6">
                <h2 class="text-3xl font-black text-white uppercase italic">Rapport Stratégique</h2>
                <div class="flex justify-center items-center gap-4 mt-2">
                    <div class="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center text-3xl font-black ${finalScore>=80?'bg-green-500 text-white':(finalScore>=60?'bg-yellow-500 text-black':'bg-red-500 text-white')} shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        ${finalScore}
                    </div>
                    <div class="text-left">
                        <div class="text-xl font-bold text-white">RANG ${finalScore>=90?'S':(finalScore>=75?'A':(finalScore>=60?'B':'C'))}</div>
                        <div class="text-xs text-gray-400 uppercase tracking-widest">Note Globale</div>
                    </div>
                </div>
            </div>

            <div id="team-organizer-container" class="flex justify-center gap-4 mb-6 min-h-[70px] p-2 bg-white/5 rounded-xl border border-dashed border-white/10">
                ${members.map(p => `<div class="organizer-slot w-14 h-14 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden cursor-move relative group" draggable="true" data-uid="${p.id}"><img src="${p.img}" class="w-10 h-10 object-contain pointer-events-none"><div class="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition"></div></div>`).join('')}
            </div>

            <div class="flex gap-2 mb-4 justify-center">
                <button onclick="switchAnalysisView('beginner')" class="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold uppercase hover:bg-blue-500 transition analysis-tab-btn active" id="btn-view-beginner">🎓 Débutant</button>
                <button onclick="switchAnalysisView('expert')" class="px-4 py-2 rounded-full bg-gray-700 text-gray-300 text-xs font-bold uppercase hover:bg-gray-600 transition analysis-tab-btn" id="btn-view-expert">📈 Expert</button>
            </div>

            <div id="view-beginner" class="analysis-view active space-y-4 overflow-y-auto custom-scroll flex-1 pr-2">
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-center"><div class="text-red-400 font-bold text-lg">${Math.floor(scoreMeta)}</div><div class="text-[10px] text-red-200 uppercase">Puissance</div><div class="text-[9px] text-gray-500 mt-1">Force brute (Tiers)</div></div>
                    <div class="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl text-center"><div class="text-blue-400 font-bold text-lg">${Math.floor(scoreSynergy)}</div><div class="text-[10px] text-blue-200 uppercase">Défense</div><div class="text-[9px] text-gray-500 mt-1">Couverture Types</div></div>
                    <div class="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl text-center"><div class="text-yellow-400 font-bold text-lg">${Math.floor(scoreStruct)}</div><div class="text-[10px] text-yellow-200 uppercase">Structure</div><div class="text-[9px] text-gray-500 mt-1">Cores & Rôles</div></div>
                </div>
                <div class="space-y-2">
                    <h4 class="font-bold text-gray-400 text-xs uppercase">Check-list des Rôles</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        ${rolesCheck.map(r => `<div class="bg-white/5 p-2 rounded flex items-center gap-3 border ${r.found?'border-green-500/30':'border-red-500/30'}"><div class="${r.found?'text-green-400':'text-red-400'} text-lg">${r.found?'✅':'❌'}</div><div><div class="text-xs font-bold text-gray-200">${r.name}</div><div class="text-[9px] text-gray-500">${r.desc}</div></div></div>`).join('')}
                    </div>
                </div>
                 ${synergy.cores.length > 0 ? `<div class="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl"><h4 class="text-purple-300 text-xs font-bold uppercase mb-2">Cores Détectés</h4><div class="flex flex-wrap gap-2">${synergy.cores.map(c => `<span class="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs border border-purple-500/40">${c.icon} ${c.name}</span>`).join('')}</div></div>` : ''}
                <div class="bg-blue-600/20 border border-blue-500/30 p-3 rounded-xl flex items-start gap-3"><i class="fas fa-info-circle text-blue-400 mt-1"></i><p class="text-xs text-blue-100">${finalScore < 60 ? "Conseil: Essayez de diversifier vos types pour éviter les faiblesses communes et ajoutez des Pokémon capables d'enlever les pièges." : "Superbe équipe ! Elle est bien équilibrée et prête pour le combat."}</p></div>
            </div>

            <div id="view-expert" class="analysis-view hidden space-y-4 overflow-y-auto custom-scroll flex-1 pr-2">
                 <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    ${Object.keys(TYPE_CHART).map(t => {
                        const w = synergy.weaknesses[t];
                        const r = synergy.resistances[t];
                        const i = synergy.immunities[t];
                        let bg = "bg-white/5";
                        if(w >= 3) bg = "bg-red-500/20 border-red-500/50";
                        else if(r > w) bg = "bg-green-500/20 border-green-500/50";
                        return `<div class="${bg} border border-white/5 rounded p-2 flex flex-col items-center"><span class="type-badge type-${t} scale-75 origin-top">${t.substring(0,3)}</span><div class="mt-1 text-center"><div class="text-[10px] text-red-400 font-bold">Faib: ${w}</div><div class="text-[10px] text-green-400 font-bold">Res: ${r}</div>${i>0?`<div class="text-[10px] text-purple-400 font-bold">Imm: ${i}</div>`:''}</div></div>`;
                    }).join('')}
                 </div>
                 <div class="h-40 w-full"><canvas id="teamRadarChart"></canvas></div>
            </div>
            
            <button onclick="generateTrainerCard()" class="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black rounded-xl uppercase tracking-widest shadow-lg transform active:scale-95 transition"><i class="fas fa-camera mr-2"></i> Carte Dresseur</button>
        </div>
    `;
    
    document.querySelector('#team-modal .modal-content').innerHTML = content;
    initDragAndDrop();
    
    // Chart Expert
    if(teamChartInstance) teamChartInstance.destroy();
    setTimeout(() => {
         const ctx = document.getElementById('teamRadarChart');
         if(ctx) {
             let totalStats = {HP:0,Attack:0,Defence:0,SpecialAttack:0,SpecialDefence:0,Speed:0};
             members.forEach(p => Object.keys(totalStats).forEach(k => totalStats[k]+=p.stats[k]));
             const avg = Object.values(totalStats).map(v => Math.floor(v/members.length));
             teamChartInstance = new Chart(ctx, {
                type: 'radar',
                data: { labels: ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Vit'], datasets: [{ label: 'Moyenne', data: avg, backgroundColor: 'rgba(59, 130, 246, 0.4)', borderColor: '#3b82f6', pointBackgroundColor: '#fff' }] },
                options: { scales: { r: { ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.1)' }, angleLines: { color: 'rgba(255,255,255,0.1)' } } }, plugins: { legend: { display: false } }, maintainAspectRatio: false }
             });
         }
    }, 100);
}

function switchAnalysisView(view) {
    document.querySelectorAll('.analysis-view').forEach(el => el.classList.add('hidden'));
    document.getElementById(`view-${view}`).classList.remove('hidden');
    document.querySelectorAll('.analysis-tab-btn').forEach(el => {
        el.classList.remove('bg-blue-600', 'text-white');
        el.classList.add('bg-gray-700', 'text-gray-300');
    });
    const activeBtn = document.getElementById(`btn-view-${view}`);
    activeBtn.classList.remove('bg-gray-700', 'text-gray-300');
    activeBtn.classList.add('bg-blue-600', 'text-white');
}

// =====================================================================================
// 8. COMPARATEUR & UTILS
// =====================================================================================

function openCompareModal() {
    if(compareList.length < 2) return;
    const p1 = allPokemon.find(p => p.id === compareList[0]);
    const p2 = allPokemon.find(p => p.id === compareList[1]);
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal-body-content');
    
    const statsHTML = Object.keys(p1.stats).map(key => {
        const v1 = p1.stats[key]; const v2 = p2.stats[key];
        const max = Math.max(v1, v2, 150);
        return `<div class="grid grid-cols-[1fr_60px_1fr] items-center gap-4 text-xs mb-3"><div class="flex items-center justify-end gap-2"><span class="${v1>v2?'text-green-400 font-bold':''}">${v1}</span><div class="h-2 bg-white/10 rounded-full w-24 flex justify-end overflow-hidden"><div class="h-full bg-blue-500" style="width:${(v1/max)*100}%"></div></div></div><div class="text-center text-gray-500 font-mono uppercase">${key.substring(0,3)}</div><div class="flex items-center justify-start gap-2"><div class="h-2 bg-white/10 rounded-full w-24 overflow-hidden"><div class="h-full bg-red-500" style="width:${(v2/max)*100}%"></div></div><span class="${v2>v1?'text-green-400 font-bold':''}">${v2}</span></div></div>`;
    }).join('');

    content.innerHTML = `<div class="text-center mb-6 relative"><button onclick="closeModal()" class="absolute top-0 right-0 text-white text-xl hover:text-red-500">&times;</button><h2 class="text-3xl font-black text-white italic">COMPARATEUR VS</h2></div><div class="flex justify-between items-center mb-8 px-8"><div class="text-center"><img src="${p1.img}" class="w-32 h-32 object-contain mx-auto mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"><h3 class="font-bold text-blue-400 text-xl uppercase">${p1.name}</h3></div><div class="text-4xl font-black text-white/10 italic">VS</div><div class="text-center"><img src="${p2.img}" class="w-32 h-32 object-contain mx-auto mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"><h3 class="font-bold text-red-400 text-xl uppercase">${p2.name}</h3></div></div><div class="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5">${statsHTML}</div>`;
    modal.classList.remove('hidden');
}

// Le gros switch case des balls
function updateCatchRate() {
    if(!currentPokemon) return;

    // Récupération des valeurs
    const hpPercent = parseInt(document.getElementById('catch-hp').value);
    const statusMult = parseFloat(document.getElementById('catch-status').value);
    const ballVal = document.getElementById('catch-ball').value;
    
    // Bonus Checkboxes
    const isNight = document.getElementById('chk-night').checked;
    const isTurn1 = document.getElementById('chk-turn1').checked;
    const isWater = document.getElementById('chk-water').checked;
    const isCaught = document.getElementById('chk-caught').checked;

    // Mise à jour visuelle du slider PV
    const hpLabel = document.getElementById('catch-hp-val');
    hpLabel.innerText = hpPercent + '%';
    if(hpPercent > 50) hpLabel.className = 'text-green-400 font-bold';
    else if(hpPercent > 20) hpLabel.className = 'text-yellow-400 font-bold';
    else hpLabel.className = 'text-red-500 font-bold';

    let ballMult = 1;
    let detailText = "";

    // Logique Balles (Switch complet)
    switch(ballVal) {
        case 'master': ballMult = 255; break; 
        case 'poke': ballMult = 1; break;
        case 'great': ballMult = 1.5; break;
        case 'ultra': ballMult = 2; break;
        case 'safari': ballMult = 1.5; break;
        case 'net':
            if(currentPokemon.types.includes("Water") || currentPokemon.types.includes("Bug")) { 
                ballMult = 3.5; detailText="Bonus Type (x3.5)"; 
            } else ballMult = 1; 
            break;
        case 'dusk':
            if(isNight) { ballMult = 3; detailText="Bonus Nuit (x3)"; } else ballMult = 1; break;
        case 'quick':
            if(isTurn1) { ballMult = 5; detailText="Bonus Tour 1 (x5)"; } else ballMult = 1; break;
        case 'repeat':
            if(isCaught) { ballMult = 3.5; detailText="Déjà capturé (x3.5)"; } else ballMult = 1; break;
        case 'dive':
            if(isWater) { ballMult = 3.5; detailText="Bonus Eau (x3.5)"; } else ballMult = 1; break;
        case 'nest':
            // Simplification : on suppose cible niveau 20 pour la démo
            ballMult = 2; detailText="Niveau Faible (x2)"; break;
        case 'timer': 
            ballMult = 4; detailText="Tours max (x4)"; break;
        default: ballMult = 1;
    }

    // Master Ball : 100% Direct
    if (ballMult >= 255) {
        document.getElementById('catch-result').innerText = "100%";
        document.getElementById('catch-bar').style.width = "100%";
        document.getElementById('catch-bar').className = "calc-fill bg-green-500";
        document.getElementById('catch-detail').innerText = "Capture Certaine";
        return;
    }

    // --- FORMULE DE CAPTURE (Gen 3-7 Approx) ---
    // Probabilité = ( ( ( 3 * MaxHP - 2 * HP ) * Rate * Ball ) / ( 3 * MaxHP ) ) * Status
    // Simplification pourcentages : MaxHP = 100, HP = hpPercent
    
    // 1. Facteur PV (Plus les PV sont bas, plus ce chiffre est haut)
    const hpFactor = (300 - (2 * hpPercent)); 
    
    // 2. Calcul Numérateur
    let modifiedRate = (hpFactor * currentPokemon.catchRate * ballMult);
    
    // 3. Division par 3 * MaxHP (300)
    modifiedRate = modifiedRate / 300;
    
    // 4. Application du Statut (Multiplication finale !)
    modifiedRate = modifiedRate * statusMult;

    // 5. Conversion en % (Sur 255)
    let prob = (modifiedRate / 255) * 100;

    // Bornes
    if (prob > 100) prob = 100;
    if (prob < 0) prob = 0;

    // Affichage
    const resultText = document.getElementById('catch-result');
    const resultBar = document.getElementById('catch-bar');
    const detailSpan = document.getElementById('catch-detail');

    resultText.innerText = prob.toFixed(1) + '%';
    resultBar.style.width = prob + '%';
    
    // Couleurs Barres
    resultBar.className = "calc-fill transition-all duration-500 " + 
        (prob < 15 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : 
        (prob < 50 ? "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" : 
        "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"));

    detailSpan.innerText = detailText || "Aucun bonus spécial";
}

function updateCalculator() {
    if(!currentPokemon) return;
    const level = parseInt(document.getElementById('sim-level').value) || 50;
    const natureName = document.getElementById('sim-nature').value;
    const nature = NATURES[natureName] || {};

    Object.keys(currentPokemon.stats).forEach(stat => {
        const base = currentPokemon.stats[stat];
        const iv = parseInt(document.getElementById(`iv-${stat}`).value) || 0;
        const ev = parseInt(document.getElementById(`ev-${stat}`).value) || 0;
        let res = stat === 'HP' ? (base===1?1:Math.floor(((2*base+iv+Math.floor(ev/4))*level)/100)+level+10) : Math.floor(((2*base+iv+Math.floor(ev/4))*level)/100)+5;
        if(stat!=='HP'){ if(nature.pos===stat) res=Math.floor(res*1.1); if(nature.neg===stat) res=Math.floor(res*0.9); }
        document.getElementById(`res-${stat}`).innerText = res;
        document.getElementById(`bar-${stat}`).style.width = Math.min((res/(stat==='HP'?700:500))*100, 100) + '%';
    });
}

function renderRadarChart(stats) {
    const ctx = document.getElementById('statChart');
    if(!ctx || statChartInstance) { if(statChartInstance) statChartInstance.destroy(); }
    if(!ctx) return;
    statChartInstance = new Chart(ctx, {
        type: 'radar',
        data: { labels: ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Vit'], datasets: [{ data: Object.values(stats), backgroundColor: 'rgba(59, 130, 246, 0.5)', borderColor: '#3b82f6', pointBackgroundColor: '#fff' }] },
        options: { scales: { r: { angleLines: {color:'rgba(255,255,255,0.1)'}, grid: {color:'rgba(255,255,255,0.1)'}, pointLabels: {color:'#94a3b8', font:{size:10}}, suggestedMin: 0, suggestedMax: 150 } }, plugins: { legend: { display: false } }, maintainAspectRatio: false }
    });
}

async function generateTrainerCard() {
    const trainerName = prompt("Pseudo Dresseur :", "Dresseur");
    if (!trainerName) return;
    const canvas = document.createElement('canvas'); canvas.width = 800; canvas.height = 450;
    const ctx = canvas.getContext('2d');
    const grd = ctx.createLinearGradient(0, 0, 800, 450); grd.addColorStop(0, "#1e293b"); grd.addColorStop(1, "#3b82f6");
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 800, 450);
    ctx.fillStyle = "white"; ctx.font = "bold 60px Arial"; ctx.fillText(trainerName.toUpperCase(), 50, 120);
    
    const imagePromises = myTeam.map(uid => {
        const p = allPokemon.find(x => x.id === uid);
        return new Promise((resolve) => { const img = new Image(); img.crossOrigin = "Anonymous"; img.onload = () => resolve(img); img.src = p.img; });
    });
    const images = await Promise.all(imagePromises);
    images.forEach((img, i) => { if(img) ctx.drawImage(img, 350 + (i%3)*140, 50 + Math.floor(i/3)*140, 120, 120); });
    
    const link = document.createElement('a'); link.download = `TrainerCard.png`; link.href = canvas.toDataURL(); link.click();
}

// Helpers
function loadMore() { currentPage++; renderGrid(false); }
function resetFilters() { document.getElementById('search-input').value = ""; document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false); applyFilters(); }
function closeModal() { document.getElementById('modal').classList.add('hidden'); }
function searchPokemon(name) { const target = allPokemon.find(p => p.name === name); if(target) openModal(target); }
// --- FONCTION DE ZOOM D'IMAGE (CORRECTIF Z-INDEX) ---
function openImageZoom(src) {
    // Si l'image n'existe pas ou est vide, on arrête
    if (!src || src.includes('undefined') || src.includes('null')) return;

    // Création de l'overlay (Fond noir)
    const overlay = document.createElement('div');
    // Z-Index 10000 pour être SUR d'être au dessus du modal Pokédex
    overlay.className = 'fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center cursor-zoom-out backdrop-blur-sm transition-opacity duration-300 opacity-0';
    
    // L'image
    const img = document.createElement('img');
    img.src = src;
    img.className = 'max-h-[90vh] max-w-[90vw] object-contain drop-shadow-2xl transform scale-90 transition-transform duration-300';
    
    overlay.appendChild(img);

    // Fermeture au clic
    overlay.onclick = function() {
        overlay.classList.remove('opacity-100');
        img.classList.remove('scale-100');
        setTimeout(() => overlay.remove(), 300); // Attendre la fin de l'anim
    };

    document.body.appendChild(overlay);

    // Animation d'entrée
    requestAnimationFrame(() => {
        overlay.classList.add('opacity-100');
        img.classList.add('scale-100');
    });
}
function closeImageZoom() { document.getElementById('zoom-overlay').classList.add('hidden'); }
function toggleShiny(imgId, btn) {
    const img = document.getElementById(imgId);
    if (!img) return;

    const currentSrc = img.src;

    // --- CAS 1 : IMAGE LOCALE (Ton dossier img) ---
    if (currentSrc.includes(window.location.origin) || currentSrc.includes('/assets/plugins/')) {
        if (currentSrc.includes('-shiny.png')) {
            // Retour au normal : on enlève "-shiny"
            img.src = currentSrc.replace('-shiny.png', '.png');
            btn.style.filter = "grayscale(100%)"; // Visuel bouton désactivé
            btn.style.opacity = "0.5";
        } else {
            // Passage en Shiny : on ajoute "-shiny" avant le .png
            img.src = currentSrc.replace('.png', '-shiny.png');
            btn.style.filter = "none"; // Visuel bouton activé
            btn.style.opacity = "1";
        }
    }
    // --- CAS 2 : IMAGE POKÉMONDB (Fallback Internet) ---
    else if (currentSrc.includes('pokemondb.net')) {
        if (currentSrc.includes('/shiny/')) {
            // Retour au normal
            img.src = currentSrc.replace('/shiny/', '/normal/');
            btn.style.filter = "grayscale(100%)";
            btn.style.opacity = "0.5";
        } else {
            // Passage en Shiny
            img.src = currentSrc.replace('/normal/', '/shiny/');
            btn.style.filter = "none";
            btn.style.opacity = "1";
        }
    }
}
function openTab(tabName) {
    document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.querySelector(`button[data-target="tab-${tabName}"]`).classList.add('active');
}
function switchMoveTab(cat, btn) {
    document.querySelectorAll('.move-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const moves = currentPokemon.moves[cat];
    const container = document.getElementById('moves-container');
    if(!moves || (Array.isArray(moves)&&moves.length===0)) { container.innerHTML = '<div class="text-center text-gray-500 italic">Aucune donnée.</div>'; return; }
    
    let html = cat === 'levelUp' 
        ? Object.entries(moves).map(([lvl, mList]) => `<div class="flex justify-between p-2 border-b border-white/5"><span class="font-bold text-gray-300">${Array.isArray(mList) ? mList.join(', ') : mList}</span><span class="text-[10px] bg-blue-900/50 px-2 rounded text-blue-200">Niv. ${lvl}</span></div>`).join('')
        : moves.map(m => `<div class="flex justify-between p-2 border-b border-white/5"><span class="font-bold text-gray-300">${m}</span><span class="text-[10px] bg-white/10 px-2 rounded text-gray-400">${cat.toUpperCase()}</span></div>`).join('');
    container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">${html}</div>`;
}

function generateCheckboxes(list, containerId, className) {
    const container = document.getElementById(containerId);
    if(container) container.innerHTML = list.map(item => `<label class="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded transition"><input type="checkbox" value="${item}" class="filter-${className} form-checkbox h-3 w-3 text-blue-500 rounded border-gray-600 bg-gray-800"><span class="text-[10px] text-gray-400">${item}</span></label>`).join('');
    document.querySelectorAll(`.filter-${className}`).forEach(cb => cb.addEventListener('change', applyFilters));
}
function generateStatFilters() {
    const container = document.getElementById('stats-filters');
    if(!container) return;

    // Configuration Design
    const statsConfig = [
        { key: 'HP', label: 'PV', color: 'text-green-400', border: 'border-green-500/30' },
        { key: 'Attack', label: 'ATK', color: 'text-yellow-500', border: 'border-yellow-500/30' },
        { key: 'Defence', label: 'DEF', color: 'text-orange-500', border: 'border-orange-500/30' },
        { key: 'SpecialAttack', label: 'SPA', color: 'text-blue-400', border: 'border-blue-500/30' },
        { key: 'SpecialDefence', label: 'SPD', color: 'text-purple-400', border: 'border-purple-500/30' },
        { key: 'Speed', label: 'VIT', color: 'text-pink-400', border: 'border-pink-500/30' }
    ];

    let html = `<div class="grid grid-cols-2 gap-3">`;

    statsConfig.forEach(stat => {
        html += `
        <div class="bg-[#0f172a] p-2 rounded-lg border border-white/5 shadow-sm">
            <div class="flex justify-between items-end mb-1">
                <span class="text-[10px] font-black uppercase tracking-widest ${stat.color}">${stat.label}</span>
            </div>
            <div class="flex items-center gap-1">
                <input type="number" class="stat-input min w-full bg-black/20 border ${stat.border} rounded px-1 py-1 text-[10px] text-white text-center focus:outline-none focus:bg-black/40 transition font-mono" 
                    data-stat="${stat.key}" placeholder="0" oninput="applyFilters()">
                <span class="text-gray-600 text-[9px]">-</span>
                <input type="number" class="stat-input max w-full bg-black/20 border ${stat.border} rounded px-1 py-1 text-[10px] text-white text-center focus:outline-none focus:bg-black/40 transition font-mono" 
                    data-stat="${stat.key}" placeholder="255" oninput="applyFilters()">
            </div>
        </div>`;
    });

    html += `</div><div class="mt-3 text-right"><button onclick="document.querySelectorAll('.stat-input').forEach(i=>{i.value='';applyFilters()})" class="text-[10px] text-gray-500 hover:text-white underline decoration-dotted cursor-pointer">Effacer</button></div>`;

    container.innerHTML = html;
}
function getCheckedValues(className) { return Array.from(document.querySelectorAll(`.${className}:checked`)).map(cb => cb.value); }
function toggleFavorite(id) {
    if(favorites.includes(id)) favorites = favorites.filter(f => f !== id); else favorites.push(id);
    localStorage.setItem('pokedex_favs', JSON.stringify(favorites));
    renderGrid(false);
}
function toggleTeam(id) {
    if(myTeam.includes(id)) myTeam = myTeam.filter(t => t !== id); 
    else { if(myTeam.length < 6) myTeam.push(id); else alert("Équipe complète !"); }
    localStorage.setItem('pokedex_team', JSON.stringify(myTeam));
    updateFloatingBar();
    renderGrid(false);
    const btn = document.getElementById('btn-add-team-modal');
    if(btn) btn.innerText = myTeam.includes(id) ? 'Retirer' : 'Ajouter équipe';
}
function toggleCompare(id) {
    if(compareList.includes(id)) compareList = compareList.filter(c => c !== id);
    else { if(compareList.length >= 2) compareList.shift(); compareList.push(id); if(compareList.length === 2) openCompareModal(); }
    renderGrid(false);
}
function updateFloatingBar() {
    let bar = document.getElementById('floating-bar');
    if(myTeam.length === 0) { if(bar) bar.remove(); return; }
    if(!bar) { bar = document.createElement('div'); bar.id = 'floating-bar'; bar.className = 'floating-bar'; document.body.appendChild(bar); }
    bar.innerHTML = `<div class="flex items-center gap-2">${myTeam.map(uid => { const p = allPokemon.find(x => x.id === uid); return p ? `<div class="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden relative cursor-pointer group" onclick="openModal(allPokemon.find(x=>x.id=='${uid}'))"><img src="${p.img}" class="w-full h-full object-contain"><div class="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-bold text-xs" onclick="event.stopPropagation(); toggleTeam('${uid}')">&times;</div></div>` : ''; }).join('')}</div><div class="h-10 w-[1px] bg-white/20 mx-2"></div><button onclick="openTeamAnalysis()" class="bg-blue-600 hover:bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center transition shadow-lg"><i class="fas fa-chart-pie"></i></button>`;
}