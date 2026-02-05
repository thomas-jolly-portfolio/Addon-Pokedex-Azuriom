// --- 1. LISTES & CONFIGURATION ---

const COSMETIC_MAP = {
    "100": "Zombie", "101": "Online", "102": "Drowned", "103": "Valentine",
    "104": "Rainbow", "105": "Alien", "106": "Valencian", "107": "Alter",
    "108": "Pink", "109": "Summer", "110": "Crystal", "111": "Creator",
    "112": "Strike", "113": "Ashen", "114": "Spirit", "115": "Halloween"
};

// LISTE PRINCIPALE (A séparer dans les filtres)
const MAIN_TAGS = ["Mega", "Gigantamax", "Fusion", "Baby", "Temtem", "Pals"];

const CUSTOM_MEGAS = [
    "Meganium", "Typhlosion", "Feraligatr", "Torterra", "Infernape", "Empoleon",
    "Serperior", "Emboar", "Samurott", "Flygon", "Milotic", "Dragonite", "Hydreigon",
    "Haxorus", "Zoroark", "Slowking", "Froslass", "Luxray", "Malamar", "Dragalge",
    "Hawlucha", "Zygarde", "Greninja", "Goodra", "Noivern", "Yanmega", "Staraptor", "Tentacruel"
];

const OFFICIAL_MEGAS = [
    "Venusaur", "Charizard", "Blastoise", "Beedrill", "Pidgeot", "Alakazam", "Slowbro", "Gengar", "Kangaskhan", "Pinsir", "Gyarados", "Aerodactyl", "Mewtwo",
    "Ampharos", "Steelix", "Scizor", "Heracross", "Houndoom", "Tyranitar",
    "Sceptile", "Blaziken", "Swampert", "Gardevoir", "Sableye", "Mawile", "Aggron", "Medicham", "Manectric", "Sharpedo", "Camerupt", "Altaria", "Banette", "Absol", "Glalie", "Salamence", "Metagross", "Latias", "Latios", "Rayquaza",
    "Lopunny", "Garchomp", "Lucario", "Abomasnow", "Gallade", "Audino", "Diancie", ...CUSTOM_MEGAS
];

const OFFICIAL_GMAX = [
    "Venusaur", "Charizard", "Blastoise", "Butterfree", "Pikachu", "Meowth", "Machamp", "Gengar", "Kingler", "Lapras", "Eevee", "Snorlax", "Garbodor",
    "Melmetal", "Rillaboom", "Cinderace", "Inteleon", "Corviknight", "Orbeetle", "Drednaw", "Coalossal", "Flapple", "Appletun", "Sandaconda", "Toxtricity",
    "Centiskorch", "Hatterene", "Grimmsnarl", "Alcremie", "Copperajah", "Duraludon", "Urshifu", "Terapagos"
];

const REGION_MAPPING = {
    "Alolan": ["Rattata", "Raticate", "Raichu", "Sandshrew", "Sandslash", "Vulpix", "Ninetales", "Diglett", "Dugtrio", "Meowth", "Persian", "Geodude", "Graveler", "Golem", "Grimer", "Muk", "Exeggutor", "Marowak"],
    "Galarian": ["Meowth", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Farfetch'd", "Weezing", "Mr. Mime", "Corsola", "Zigzagoon", "Linoone", "Darumaka", "Darmanitan", "Yamask", "Stunfisk", "Slowking", "Articuno", "Zapdos", "Moltres"],
    "Hisuian": ["Growlithe", "Arcanine", "Voltorb", "Electrode", "Typhlosion", "Qwilfish", "Sneasel", "Samurott", "Lilligant", "Basculin", "Zorua", "Zoroark", "Braviary", "Sliggoo", "Goodra", "Avalugg", "Decidueye"],
    "Paldean": ["Tauros", "Wooper"]
};

const NATURES = {
    "Hardy": {}, "Lonely": {pos:"Attack", neg:"Defence"}, "Brave": {pos:"Attack", neg:"Speed"}, "Adamant": {pos:"Attack", neg:"SpecialAttack"}, "Naughty": {pos:"Attack", neg:"SpecialDefence"},
    "Bold": {pos:"Defence", neg:"Attack"}, "Docile": {}, "Relaxed": {pos:"Defence", neg:"Speed"}, "Impish": {pos:"Defence", neg:"SpecialAttack"}, "Lax": {pos:"Defence", neg:"SpecialDefence"},
    "Timid": {pos:"Speed", neg:"Attack"}, "Hasty": {pos:"Speed", neg:"Defence"}, "Serious": {}, "Jolly": {pos:"Speed", neg:"SpecialAttack"}, "Naive": {pos:"Speed", neg:"SpecialDefence"},
    "Modest": {pos:"SpecialAttack", neg:"Attack"}, "Mild": {pos:"SpecialAttack", neg:"Defence"}, "Quiet": {pos:"SpecialAttack", neg:"Speed"}, "Bashful": {}, "Rash": {pos:"SpecialAttack", neg:"SpecialDefence"},
    "Calm": {pos:"SpecialDefence", neg:"Attack"}, "Gentle": {pos:"SpecialDefence", neg:"Defence"}, "Sassy": {pos:"SpecialDefence", neg:"Speed"}, "Careful": {pos:"SpecialDefence", neg:"SpecialAttack"}, "Quirky": {}
};

let favorites = JSON.parse(localStorage.getItem('pokedex_favs')) || [];
let myTeam = JSON.parse(localStorage.getItem('pokedex_team')) || [];
let compareList = [];
let statChartInstance = null;
let allPokemon = [];
let currentPokeStats = {};
let currentPokemon = null; 
const typesList = ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Steel", "Fairy", "Temtem", "Pals"]; 

// --- TABLE DES TYPES (Matrice complète) ---
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

// --- 2. FONCTIONS DE DÉTECTION ---
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

function identifySpecialForm(pName, formKey, data, parentData) {
    const stats = data.stats || parentData.stats;
    const types = data.types || parentData.types;

    if (pName === "Greninja") {
        if (formKey === "1") return { name: "Ash-Greninja", tag: "Battle Bond", slug: "greninja-ash" };
        if (["9", "10", "11"].includes(formKey)) return { name: "Mega Greninja", tag: "Mega", slug: "greninja-mega" };
    }
    if (pName === "Castform") {
        if (types.includes("Fire")) return { name: "Castform Sunny", tag: "Sunny", slug: "castform-sunny" };
        if (types.includes("Water")) return { name: "Castform Rainy", tag: "Rainy", slug: "castform-rainy" };
        if (types.includes("Ice")) return { name: "Castform Snowy", tag: "Snowy", slug: "castform-snowy" };
    }
    if (pName === "Rotom") {
        if (types.includes("Fire")) return { name: "Rotom Heat", tag: "Heat", slug: "rotom-heat" };
        if (types.includes("Water")) return { name: "Rotom Wash", tag: "Wash", slug: "rotom-wash" };
        if (types.includes("Ice")) return { name: "Rotom Frost", tag: "Frost", slug: "rotom-frost" };
        if (types.includes("Flying")) return { name: "Rotom Fan", tag: "Fan", slug: "rotom-fan" };
        if (types.includes("Grass")) return { name: "Rotom Mow", tag: "Mow", slug: "rotom-mow" };
    }
    if (pName === "Deoxys") {
        if (stats.Speed > 160) return { name: "Deoxys Speed", tag: "Speed", slug: "deoxys-speed" };
        if (stats.Attack > 160) return { name: "Deoxys Attack", tag: "Attack", slug: "deoxys-attack" };
        if (stats.Defence > 140) return { name: "Deoxys Defense", tag: "Defense", slug: "deoxys-defense" };
    }
    if (["Dialga", "Palkia"].includes(pName)) {
        if (stats.Attack !== parentData.stats.Attack) return { name: `${pName} Origin`, tag: "Origin", slug: `${pName.toLowerCase()}-origin` };
    }
    if (pName === "Giratina") {
        if (stats.Attack > stats.Defence) return { name: "Giratina Origin", tag: "Origin", slug: "giratina-origin" };
    }
    if (pName === "Basculin") {
        if (types.includes("Water") && data.form >= 2) return { name: "White-Striped Basculin", tag: "Hisuian", slug: "basculin-white-striped" };
    }
    if (["Arceus", "Silvally"].includes(pName)) {
        const type = types[0];
        if (type !== "Normal") return { name: `${pName} ${type}`, tag: type, slug: `${pName.toLowerCase()}-${type.toLowerCase()}` };
    }
    if (pName === "Darmanitan") {
        if (types.includes("Ice") && types.includes("Fire")) return { name: "Galarian Darmanitan Zen", tag: "Zen", slug: "darmanitan-galarian-zen" };
        if (types.includes("Ice")) return { name: "Galarian Darmanitan", tag: "Galarian", slug: "darmanitan-galarian-standard" };
        if (types.includes("Psychic")) return { name: "Darmanitan Zen", tag: "Zen", slug: "darmanitan-zen" };
    }
    if (pName === "Necrozma") {
        if (types.includes("Steel")) return { name: "Dusk Mane Necrozma", tag: "Fusion", slug: "necrozma-dusk" };
        if (types.includes("Ghost")) return { name: "Dawn Wings Necrozma", tag: "Fusion", slug: "necrozma-dawn" };
        if (types.includes("Dragon")) return { name: "Ultra Necrozma", tag: "Ultra", slug: "necrozma-ultra" };
    }
    if (pName === "Zygarde") {
        if (formKey === "1" || stats.HP < 90) return { name: "Zygarde 10%", tag: "10%", slug: "zygarde-10" };
        if (formKey === "2" || stats.HP > 200) return { name: "Zygarde Complete", tag: "Complete", slug: "zygarde-complete" };
    }
    if (pName === "Sawsbuck" || pName === "Deerling") {
        const seasons = ["Spring", "Summer", "Autumn", "Winter"];
        const season = seasons[parseInt(formKey)] || "Spring";
        if(season !== "Spring") return { name: `${pName} ${season}`, tag: "Season", slug: `${pName.toLowerCase()}-${season.toLowerCase()}` };
    }
    if (pName === "Zacian" && types.includes("Steel")) return { name: "Zacian Crowned", tag: "Crowned", slug: "zacian-crowned" };
    if (pName === "Zamazenta" && types.includes("Steel")) return { name: "Zamazenta Crowned", tag: "Crowned", slug: "zamazenta-crowned" };
    if (pName === "Eternatus" && stats.Defence > 200) return { name: "Eternamax Eternatus", tag: "Eternamax", slug: "eternatus-eternamax" };
    if (pName === "Ogerpon") {
        if(types.includes("Water")) return { name: "Ogerpon Wellspring", tag: "Wellspring", slug: "ogerpon-wellspring-mask" };
        if(types.includes("Fire")) return { name: "Ogerpon Hearthflame", tag: "Hearthflame", slug: "ogerpon-hearthflame-mask" };
        if(types.includes("Rock")) return { name: "Ogerpon Cornerstone", tag: "Cornerstone", slug: "ogerpon-cornerstone-mask" };
    }
    if (pName === "Terapagos") {
        if(stats.HP > 150) return { name: "Terapagos Stellar", tag: "Stellar", slug: "terapagos-stellar" };
        if(stats.HP > 100) return { name: "Terapagos Terastal", tag: "Terastal", slug: "terapagos-terastal" };
    }
    return null;
}

let teamChartInstance = null;
let roleChartInstance = null;

// --- ANALYSEUR D'ÉQUIPE V2 (INTELLIGENT) ---

function calculateTeamSynergy(members) {
    let synergy = {
        weaknesses: {},   // Combien de membres craignent ce type
        resistances: {},  // Combien de membres résistent à ce type
        immunities: {},   // Combien de membres sont immunisés
        cores: []         // Cores détectés
    };

    const types = Object.keys(TYPE_CHART);
    types.forEach(t => { synergy.weaknesses[t] = 0; synergy.resistances[t] = 0; synergy.immunities[t] = 0; });

    // 1. Calcul Défensif Global
    members.forEach(p => {
        const weak = calculateWeaknesses(p.types);
        for (const [type, mult] of Object.entries(weak)) {
            if (mult > 1) synergy.weaknesses[type]++;
            if (mult < 1 && mult > 0) synergy.resistances[type]++;
            if (mult === 0) synergy.immunities[type]++;
        }
    });

    // 2. Détection de Cores (Noyaux Stratégiques)
    const teamTypes = new Set(members.flatMap(p => p.types));

    // Core Fire-Water-Grass (Classique)
    if(teamTypes.has("Fire") && teamTypes.has("Water") && teamTypes.has("Grass"))
        synergy.cores.push({name: "Fire-Water-Grass", icon: "🔥💧🌿"});

    // Core Fantasy (Dragon-Steel-Fairy)
    if(teamTypes.has("Dragon") && teamTypes.has("Steel") && teamTypes.has("Fairy"))
        synergy.cores.push({name: "Fantasy (Drg-Stl-Fai)", icon: "🐲🛡️✨"});

    // Core Psychic-Fighting-Dark
    if(teamTypes.has("Psychic") && teamTypes.has("Fighting") && teamTypes.has("Dark"))
        synergy.cores.push({name: "Psy-Fight-Dark", icon: "🔮👊🌑"});

    // Core Weather (Si talents détectés - simulation simple ici par type)
    if(teamTypes.has("Ice") && members.some(p => p.name.includes("Ninetales") || p.name.includes("Abomasnow")))
        synergy.cores.push({name: "Hail/Snow Team", icon: "❄️"});

    return synergy;
}

// --- FONCTION DE BASCULE DES ONGLETS ANALYSE ---
function switchAnalysisView(viewName) {
    // 1. Gestion des boutons
    document.querySelectorAll('.analysis-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-view-${viewName}`).classList.add('active');

    // 2. Gestion du contenu
    document.querySelectorAll('.analysis-view').forEach(view => {
        view.style.display = 'none';
        view.classList.remove('active');
    });

    const target = document.getElementById(`view-${viewName}`);
    if(target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    }
}

// --- CALCULATEURS SPÉCIALISÉS ---

// 1. Calculateur SHOWDOWN (Basé sur la Puissance Brute & Tiers)
function calculateMetaScore(members) {
    let score = 0;
    let bstAverage = 0;

    members.forEach(p => {
        // Score Tier
        const tier = getTier(p) || "Unknown";
        score += (TIER_VALUES[tier] || 50);
        // Score Stats
        bstAverage += p.totalStats;
    });

    score = score / members.length; // Moyenne des tiers
    bstAverage = bstAverage / members.length;

    // Bonus si la moyenne des stats est élevée (Team de légendaires)
    if (bstAverage > 580) score += 10;
    else if (bstAverage > 520) score += 5;

    // Plafond
    return Math.min(Math.floor(score), 100);
}

// 2. Calculateur COUP CRITIQUE (Basé sur l'équilibre & Défense)
function calculateBalanceScore(synergy, roles) {
    let score = 100; // On part de 100 et on retire des points pour les erreurs

    // Pénalité : Faiblesses non couvertes
    const weaknesses = Object.values(synergy.weaknesses).filter(c => c >= 3).length; // 3+ pkmn faibles au même type
    score -= (weaknesses * 15);

    // Pénalité : Manque de Rôles Clés (Problème de structure)
    if (!roles.hazards.found) score -= 5;
    if (!roles.removal.found) score -= 10; // Très grave en strat
    if (!roles.pivot.found) score -= 5;
    if (!roles.speedControl) score -= 5; // (On simule le speed control si Moyenne Vitesse > 100)

    // Bonus : Immunités (Signe d'un bon switch)
    const totalImmunities = Object.values(synergy.immunities).reduce((a,b)=>a+b,0);
    score += (totalImmunities * 2);

    return Math.max(Math.floor(score), 0);
}

// 3. Calculateur CLASSIQUE (Basé sur les Cores & Synergie Types)
function calculateStructureScore(synergy) {
    let score = 50; // Base
    score += (synergy.cores.length * 20); // Les Cores rapportent beaucoup ici

    // Bonus Résistances
    const totalResists = Object.values(synergy.resistances).reduce((a,b)=>a+b,0);
    score += Math.floor(totalResists / 2);

    return Math.min(Math.floor(score), 100);
}

// --- ANALYSEUR ULTIME ---
function openTeamAnalysis() {
    if (myTeam.length === 0) { alert("Votre équipe est vide !"); return; }

    const modal = document.getElementById('team-modal');
    modal.classList.add('active');

    // --- 1. PRÉPARATION DES DONNÉES ---
    const teamMembers = myTeam.map(uid => allPokemon.find(p => p.id === uid)).filter(p => p);

    // Calculs de base
    const synergy = calculateTeamSynergy(teamMembers);
    let totalStats = { HP:0, Attack:0, Defence:0, SpecialAttack:0, SpecialDefence:0, Speed:0 };
    teamMembers.forEach(p => Object.keys(totalStats).forEach(k => totalStats[k] += p.stats[k]));
    const avgStats = Object.values(totalStats).map(v => Math.floor(v / teamMembers.length));
    const avgSpeed = totalStats.Speed / teamMembers.length;

    // Check-list Rôles
    const rolesCheck = {
        hazards: { name: "Hazards (Pièges)", desc: "Pose des dégâts résiduels (Piège de Roc...)", moves: ["Stealth Rock", "Spikes", "Toxic Spikes", "Sticky Web", "Stone Axe"], found: false, providers: [] },
        removal: { name: "Removal (Nettoyeur)", desc: "Enlève les pièges du terrain", moves: ["Rapid Spin", "Defog", "Mortal Spin", "Tidy Up"], found: false, providers: [] },
        pivot: { name: "Pivot (Rotation)", desc: "Change de Pokémon en attaquant", moves: ["U-turn", "Volt Switch", "Flip Turn", "Parting Shot", "Chilly Reception"], found: false, providers: [] },
        recovery: { name: "Soin (Recovery)", desc: "Peut se soigner lui-même", moves: ["Recover", "Roost", "Synthesis", "Moonlight", "Wish", "Milk Drink", "Slack Off", "Soft-Boiled"], found: false, providers: [] },
        priority: { name: "Priorité", desc: "Attaque toujours en premier", moves: ["Extreme Speed", "Mach Punch", "Bullet Punch", "Aqua Jet", "Shadow Sneak", "Sucker Punch", "Ice Shard"], found: false, providers: [] },
        speedControl: { name: "Vitesse", desc: "Equipe Rapide", moves: [], found: avgSpeed > 95, providers: [] }
    };

    teamMembers.forEach(p => {
        const allMoves = [...Object.values(p.moves.levelUp || {}).flat(), ...(p.moves.tm || []), ...(p.moves.egg || []), ...(p.moves.tutor || [])].map(m => m.toLowerCase());
        Object.keys(rolesCheck).forEach(roleKey => {
            const role = rolesCheck[roleKey];

            if (role.moves && role.moves.some(move => allMoves.includes(move.toLowerCase()))) {
                role.found = true;
                if(!role.providers.some(prov => prov.name === p.name)) {
                    const actualMove = allMoves.find(m => role.moves.includes(m));
                    role.providers.push({ name: p.name, img: p.img, move: actualMove });
                }
            }
            if(roleKey === 'speedControl' && role.found) {
                 if(role.providers.length === 0) role.providers.push({ name: "Moyenne Équipe", img: null, move: "> 95" });
            }
        });
    });

    // --- 2. CALCUL DES NOTES ---
    const scoreShowdown = calculateMetaScore(teamMembers);
    const scoreCoupCritique = calculateBalanceScore(synergy, rolesCheck);
    const scoreClassic = calculateStructureScore(synergy);

    // Moyenne Globale
    let finalScore = Math.floor((scoreShowdown + scoreCoupCritique + scoreClassic) / 3);
    let grade = finalScore >= 90 ? "S" : (finalScore >= 75 ? "A" : (finalScore >= 60 ? "B" : (finalScore >= 40 ? "C" : "D")));
    let scoreColor = finalScore >= 80 ? "#27ae60" : (finalScore >= 60 ? "#f1c40f" : "#e74c3c");


    // --- 3. GÉNÉRATION VUE DÉBUTANT ---

    // Cartes des Juges
    const judgesHTML = `
        <div class="judges-container">
            <div class="judge-card meta">
                <div class="judge-title"><i class="fas fa-fist-raised"></i> Showdown</div>
                <div class="judge-score" style="color:#e74c3c;">${scoreShowdown}</div>
                <div class="judge-desc">Puissance brute des Pokémon & Tiers (Uber/OU).</div>
                <div class="judge-bar"><div class="judge-fill" style="width:${scoreShowdown}%; background:#e74c3c;"></div></div>
            </div>
            <div class="judge-card synergy">
                <div class="judge-title"><i class="fas fa-chess"></i> Coup Critique</div>
                <div class="judge-score" style="color:#3498db;">${scoreCoupCritique}</div>
                <div class="judge-desc">Synergie défensive, couverture et rôles tactiques.</div>
                <div class="judge-bar"><div class="judge-fill" style="width:${scoreCoupCritique}%; background:#3498db;"></div></div>
            </div>
            <div class="judge-card struct">
                <div class="judge-title"><i class="fas fa-cubes"></i> Classique</div>
                <div class="judge-score" style="color:#f1c40f;">${scoreClassic}</div>
                <div class="judge-desc">Structure de l'équipe (Cores) et Résistances.</div>
                <div class="judge-bar"><div class="judge-fill" style="width:${scoreClassic}%; background:#f1c40f;"></div></div>
            </div>
        </div>
    `;

    // Explications Juges
    const judgesExplainHTML = `
        <div class="info-grid" style="margin-bottom:20px;">
            <div class="legend-box" style="border-left:4px solid #e74c3c;">
                <strong><i class="fas fa-fist-raised"></i> Note Showdown (Méta)</strong>
                <p style="margin:5px 0 0 0; font-size:0.9em; color:var(--text-muted);">
                    Juge la <strong>puissance brute</strong>. Basé sur les Tiers officiels (Uber, OU). Une équipe de légendaires aura 100/100 ici, une équipe de bébés aura 20/100.
                </p>
            </div>
            <div class="legend-box" style="border-left:4px solid #3498db;">
                <strong><i class="fas fa-chess"></i> Note Coup Critique (Stratégie)</strong>
                <p style="margin:5px 0 0 0; font-size:0.9em; color:var(--text-muted);">
                    Juge la <strong>construction intelligente</strong>. Vérifie si vous avez des pièges, de quoi les enlever, et si vous n'avez pas de faiblesses communes (ex: 3 Pokémon faibles au Feu = Note basse).
                </p>
            </div>
            <div class="legend-box" style="border-left:4px solid #f1c40f;">
                <strong><i class="fas fa-cubes"></i> Note Classique (Structure)</strong>
                <p style="margin:5px 0 0 0; font-size:0.9em; color:var(--text-muted);">
                    Juge la <strong>synergie des types</strong>. Récompense les "Cores" (Noyaux) comme le trio Feu-Eau-Plante et le nombre d'immunités.
                </p>
            </div>
        </div>
    `;

    // >>> BLOC EXPLICATION RÔLES DÉBUTANT <<<
    let beginnerRolesHTML = `<h4 style="margin-top:20px;">🎓 Comprendre les Rôles Tactiques</h4><div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:15px; margin-bottom:20px;">`;

    Object.values(rolesCheck).forEach(role => {
        let providerInfo = "";
        if (role.found && role.providers.length > 0) {
            const p = role.providers[0]; // On montre le premier exemple
            const imgHTML = p.img ? `<img src="${p.img}" style="width:30px; height:30px;">` : "";
            const moveTxt = p.move ? `(via ${p.move})` : "";
            providerInfo = `
                <div style="margin-top:8px; padding:5px; background:#e8f8f5; border-radius:6px; display:flex; align-items:center; gap:8px; border:1px solid #2ecc71;">
                    ${imgHTML}
                    <div style="font-size:0.85em; color:#27ae60;"><strong>${p.name}</strong> s'en occupe ! ${moveTxt}</div>
                </div>`;
        } else {
            providerInfo = `
                <div style="margin-top:8px; padding:5px; background:#fdedec; border-radius:6px; font-size:0.85em; color:#c0392b; border:1px solid #e74c3c;">
                    ❌ Personne dans votre équipe ne fait ça.
                </div>`;
        }

        beginnerRolesHTML += `
            <div style="background:var(--bg-card); padding:10px; border-radius:8px; border:1px solid var(--border);">
                <strong style="color:var(--dark);">${role.name}</strong>
                <p style="margin:5px 0 0 0; font-size:0.85em; color:var(--text-muted);">${role.desc}</p>
                ${providerInfo}
            </div>
        `;
    });
    beginnerRolesHTML += `</div>`;


    // Conseil du Coach
    let adviceHTML = "";
    if (finalScore < 60) adviceHTML = `<div class="warning-box"><strong>💡 Conseil du Coach :</strong> Votre moyenne est faible. Regardez quel Juge vous donne la note la plus basse ci-dessus pour savoir quoi corriger !</div>`;
    else adviceHTML = `<div class="advice-box"><strong>✅ Conseil du Coach :</strong> Excellente équipe ! Elle est performante sur tous les critères (Puissance, Défense et Structure).</div>`;

    const beginnerHTML = `
        <div class="help-tip">
            <h4 style="margin-top:0;"><i class="fas fa-info-circle"></i> Comprendre mes notes</h4>
            <p style="margin:0;">Nous avons simulé l'avis de 3 sites de stratégie différents. Une équipe parfaite doit être performante dans les 3 domaines ci-dessous.</p>
        </div>

        ${judgesHTML}
        ${judgesExplainHTML}
        ${beginnerRolesHTML}
        ${adviceHTML}

        <div class="info-grid">
            <div class="legend-box">
                <h4 style="margin-top:0;">📝 Lexique Stratégique</h4>
                <span class="lexicon-term">Core (Noyau)</span>
                <span class="lexicon-def">Groupe de Pokémon dont les types se protègent mutuellement (ex: Feu / Eau / Plante).</span>
                <span class="lexicon-term">Tier (Rang)</span>
                <span class="lexicon-def">Classement de puissance officielle (Uber = Légendaires, OU = Très forts, PU = Faibles).</span>
                <span class="lexicon-term">Removal (Nettoyeur)</span>
                <span class="lexicon-def">Capacité à enlever les pièges du terrain (Rapid Spin/Defog).</span>
            </div>

            <div class="legend-box">
                <h4 style="margin-top:0;">🎨 Légende Matrice</h4>
                <div class="legend-item"><span class="def-cell" style="width:30px; height:30px; display:inline-flex; align-items:center; justify-content:center; color:#27ae60; font-weight:bold;">🛡️</span> <span><strong>Vert :</strong> Résistance (Vous encaissez bien).</span></div>
                <div class="legend-item"><span class="def-cell" style="width:30px; height:30px; display:inline-flex; align-items:center; justify-content:center; color:#e74c3c; font-weight:bold;">⚠️</span> <span><strong>Rouge :</strong> Danger (3+ Pokémon faibles).</span></div>
            </div>
        </div>
    `;


    // --- 4. GÉNÉRATION VUE EXPERT (DATA BRUTE) ---

    // >>> MATRICE : AJOUT COLONNE IMMUNITÉS <<<
    let matrixHTML = "";
    Object.keys(TYPE_CHART).forEach(type => {
        const weakCount = synergy.weaknesses[type];
        const resistCount = synergy.resistances[type];
        const immuneCount = synergy.immunities[type];

        let statusColor = weakCount >= 3 ? "val-bad" : (resistCount > weakCount ? "val-good" : "val-neutral");
        let icon = weakCount >= 3 ? "⚠️" : (resistCount > weakCount ? "🛡️" : "-");

        matrixHTML += `
            <div class="def-cell">
                <div class="type-badge type-${type}" style="font-size:0.7em; width:100%;">${type.substring(0,3)}</div>
                <div style="font-size:0.8em; margin-top:5px; display:flex; flex-direction:column; gap:2px;">
                     <div><span style="color:#e74c3c">Faib:</span> <strong>${weakCount}</strong></div>
                     <div><span style="color:#27ae60">Res:</span> <strong>${resistCount}</strong></div>
                     <div><span style="color:#8e44ad">Imm:</span> <strong>${immuneCount}</strong></div>
                </div>
                <div style="font-size:0.7em;">${icon}</div>
            </div>`;
    });

    // Rôles
    let rolesHTML = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">`;
    Object.values(rolesCheck).forEach(r => {
        const color = r.found ? "#27ae60" : "#95a5a6";
        const icon = r.found ? "✅" : "❌";
        rolesHTML += `<div title="${r.desc}" style="font-size:0.85em; color:${color}; opacity:${r.found?1:0.5}; font-weight:bold; cursor:help;">${icon} ${r.name}</div>`;
    });
    rolesHTML += `</div>`;

    // Cores
    let coresHTML = synergy.cores.map(c => `<span class="core-tag"><i class="fas fa-link"></i> ${c.icon} ${c.name}</span>`).join('');
    if(!coresHTML) coresHTML = `<span style="color:#999; font-style:italic; font-size:0.9em;">Aucun core standard.</span>`;

    const expertHTML = `
        <div class="analysis-dashboard">
            <div class="analysis-sidebar">
                <div class="card" style="padding:15px;">
                    <h4 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:5px;">Check-list Tactique</h4>
                    ${rolesHTML}
                </div>
                <div class="card" style="padding:15px;">
                    <h4 style="margin-top:0;">Noyaux (Cores)</h4>
                    ${coresHTML}
                </div>
                 <div class="card" style="padding:15px;">
                    <h4 style="margin:0 0 10px 0;">Stats Moyennes</h4>
                    <div style="height:150px;"><canvas id="teamRadarChart"></canvas></div>
                </div>
            </div>

            <div class="analysis-main">
                <div class="card" style="padding:20px;">
                    <h4 style="margin-top:0;">🛡️ Matrice Défensive & Immunités</h4>
                    <div class="def-matrix">${matrixHTML}</div>
                </div>
                <div style="text-align:right; margin-top:10px;">
                    <button class="btn-generate" onclick="generateTrainerCard()"><i class="fas fa-camera"></i> Exporter Carte</button>
                </div>
            </div>
        </div>
    `;

    // --- 5. ASSEMBLAGE FINAL ---
    const content = `
        <span class="close-btn" onclick="closeTeamModal()">&times;</span>

        <div style="text-align:center; margin-bottom:15px;">
            <h2 style="margin:0;"><i class="fas fa-chart-line"></i> Rapport Stratégique</h2>
            <div style="display:flex; justify-content:center; align-items:center; gap:20px; margin-top:10px;">
                <div class="score-circle-big" style="width:80px; height:80px; font-size:2.5em; margin:0; border-color:${scoreColor}; color:${scoreColor};">
                    ${finalScore}
                </div>
                <div style="text-align:left;">
                    <div style="font-size:1.5em; font-weight:900; color:${scoreColor};">RANG ${grade}</div>
                    <div style="font-size:0.9em; opacity:0.7;">Note Moyenne</div>
                </div>
            </div>
        </div>

        <div class="team-organizer" id="team-organizer-container" style="min-height:60px; padding:5px; background:transparent; border:none; justify-content:center; margin-bottom:10px;">
            ${teamMembers.map(p => `<div class="organizer-slot" draggable="true" data-uid="${p.id}" style="background-image: url('${p.img}'); width:50px; height:50px;" title="${p.name}"></div>`).join('')}
        </div>

        <div class="analysis-tabs">
            <button id="btn-view-beginner" class="analysis-tab-btn active" onclick="switchAnalysisView('beginner')">🎓 Débutant</button>
            <button id="btn-view-expert" class="analysis-tab-btn" onclick="switchAnalysisView('expert')">📈 Expert</button>
        </div>

        <div id="view-beginner" class="analysis-view active" style="padding:0 20px;">${beginnerHTML}</div>
        <div id="view-expert" class="analysis-view">${expertHTML}</div>
    `;

    document.querySelector('#team-modal .modal-content').innerHTML = content;

    // Initialisation
    initDragAndDrop();
    if(teamChartInstance) teamChartInstance.destroy();
    const ctx = document.getElementById('teamRadarChart');
    if(ctx) {
        teamChartInstance = new Chart(ctx, {
            type: 'radar',
            data: { labels: ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Vit'], datasets: [{ label: 'Moyenne', data: avgStats, backgroundColor: 'rgba(52, 152, 219, 0.4)', borderColor: '#2980b9', borderWidth: 2, pointBackgroundColor: document.documentElement.classList.contains('theme-dark')?'#fff':'#666' }] },
            options: { scales: { r: { suggestedMin: 0, ticks: { display: false }, grid: { color: document.documentElement.classList.contains('theme-dark')?'#444':'#ddd' } } }, plugins: { legend: { display: false } }, maintainAspectRatio: false }
        });
    }
}

let currentRoleDetails = {};

function showRoleDetails(roleKey) {
    const role = currentRoleDetails[roleKey];
    if(!role) return;

    const overlay = document.getElementById('role-popup');
    const content = document.getElementById('role-popup-inner');

    let providersHTML = "";
    if (role.found) {
        providersHTML = role.providers.map(p =>
            `<div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
                <img src="${p.img}" style="width:30px; height:30px;">
                <strong>${p.name}</strong>
                <span style="color:#7f8c8d;">via ${p.move}</span>
            </div>`
        ).join('');
    } else {
        providersHTML = `<div style="color:#e74c3c; font-style:italic;">Aucun Pokémon ne remplit ce rôle.</div>`;
    }

    content.innerHTML = `
        <h3 style="margin-top:0; color:var(--primary); display:flex; align-items:center; gap:10px;">
            ${role.found ? '✅' : '❌'} ${role.name}
        </h3>
        <p style="font-weight:bold; margin-bottom:5px;">Définition :</p>
        <p style="margin-top:0; font-size:0.95em; line-height:1.4;">${role.fullDesc}</p>

        <p style="font-weight:bold; margin-bottom:5px;">Dans votre équipe :</p>
        <div class="role-providers-list">
            ${providersHTML}
        </div>
        <button onclick="document.getElementById('role-popup').classList.remove('active')" style="width:100%; margin-top:15px; padding:10px; background:var(--dark); color:white; border:none; border-radius:6px; cursor:pointer;">Fermer</button>
    `;

    overlay.classList.add('active');
}

// --- LOGIQUE DRAG & DROP ---
function initDragAndDrop() {
    const draggables = document.querySelectorAll('.organizer-slot');
    const container = document.getElementById('team-organizer-container');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            saveNewOrder();
        });
    });

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientX);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });
}

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.organizer-slot:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


function saveNewOrder() {
    const newTeamIds = [];
    const container = document.getElementById('team-organizer-container');
    const slots = container.querySelectorAll('.organizer-slot');

    slots.forEach(slot => {
        const uid = slot.getAttribute('data-uid');
        if (uid) newTeamIds.push(uid);
    });

    myTeam = newTeamIds;
    localStorage.setItem('pokedex_team', JSON.stringify(myTeam));
    updateFloatingBar();
}

// --- GÉNÉRATEUR CARTE DRESSEUR ---
async function generateTrainerCard() {
    const trainerName = prompt("Entrez votre pseudo de Dresseur :", "Sacha");
    if (!trainerName) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');

    // 1. Fond (Dégradé Stylé)
    const grd = ctx.createLinearGradient(0, 0, 800, 450);
    grd.addColorStop(0, "#2c3e50");
    grd.addColorStop(1, "#3498db");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 800, 450);

    // 2. Cercle Déco
    ctx.beginPath();
    ctx.arc(400, 225, 150, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fill();

    // 3. Texte Dresseur
    ctx.fillStyle = "white";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "left";
    ctx.fillText("DRESSEUR", 50, 60);
    ctx.font = "bold 60px Arial";
    ctx.fillText(trainerName.toUpperCase(), 50, 120);

    // 4. Dessin des Pokémon
    const teamMembers = myTeam.map(uid => allPokemon.find(p => p.id === uid)).filter(p => p);

    // Chargement des images (Asynchrone)
    const imagePromises = teamMembers.map(p => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = p.img; // Utilise le chemin /plugins/pokedex/img/...
        });
    });

    try {
        const images = await Promise.all(imagePromises);

        images.forEach((img, i) => {
            if(!img) return;
            const col = i % 3;
            const row = Math.floor(i / 3);

            const x = 350 + (col * 140);
            const y = 50 + (row * 140);

            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 10;
            ctx.drawImage(img, x, y, 120, 120);
            ctx.shadowBlur = 0; 
        });

        // 5. Téléchargement
        const link = document.createElement('a');
        link.download = `TrainerCard-${trainerName}.png`;
        link.href = canvas.toDataURL();
        link.click();

    } catch (e) {
        alert("Erreur lors de la génération de l'image (problème de sécurité navigateur ou image manquante).");
        console.error(e);
    }
}

function closeTeamModal() {
    document.getElementById('team-modal').classList.remove('active');
}

function toggleFavorite(id, btn) {
    event.stopPropagation();
    if(favorites.includes(id)) favorites = favorites.filter(f => f !== id);
    else favorites.push(id);
    localStorage.setItem('pokedex_favs', JSON.stringify(favorites));

    if(btn) btn.classList.toggle('active');
    updateFloatingBar();
}

function toggleTeam(id) {
    if(myTeam.includes(id)) myTeam = myTeam.filter(t => t !== id);
    else {
        if(myTeam.length >= 6) { alert("Équipe complète (6 max) !"); return; }
        myTeam.push(id);
    }
    localStorage.setItem('pokedex_team', JSON.stringify(myTeam));
    updateFloatingBar();

    const btnModal = document.getElementById('btn-add-team');
    if(btnModal && document.getElementById('modal').classList.contains('active')) {
        btnModal.innerHTML = myTeam.includes(id) ? '<i class="fas fa-minus"></i> Retirer' : '<i class="fas fa-plus"></i> Ajouter';
        btnModal.style.background = myTeam.includes(id) ? '#e74c3c' : '#27ae60';
    }
}

let navHistory = JSON.parse(localStorage.getItem('pokedex_history')) || [];

// --- LOGIQUE DES TIERS ---
const SMOGON_TIERS = {
    "Mewtwo": "Uber", "Rayquaza": "Uber", "Arceus": "Uber", "Zacian": "Uber", "Koraidon": "Uber", "Miraidon": "Uber",
    "Landorus-Therian": "OU", "Great Tusk": "OU", "Kingambit": "OU", "Gholdengo": "OU", "Dragapult": "OU",
    "Charizard": "PU", "Pikachu": "PU"
};

const TIER_RANK = { "Uber":1, "OU":2, "UU":3, "RU":4, "NU":5, "PU":6, "LC":7, "Unknown":99 };

const TIER_VALUES = {
    "Uber": 100, "OU": 95, "UU": 85, "RU": 75, "NU": 65, "PU": 55, "LC": 40, "Unknown": 50
};

function getTier(poke) {
    if (!poke) return "Unknown";

    if (SMOGON_TIERS[poke.name]) return SMOGON_TIERS[poke.name];

    if (poke.tag === "Mega" || poke.tag === "Gigantamax") return "Uber";
    if (poke.tag === "Paradox" || poke.tag === "UltraBeast") return "OU";
    if (poke.tag === "Baby" || (poke.totalStats < 300 && poke.totalStats > 0)) return "LC";

    const stats = poke.totalStats;

    if (stats >= 670) return "Uber"; 
    if (stats >= 570) return "OU";   
    if (stats >= 520) return "UU";   
    if (stats >= 480) return "RU";   
    if (stats >= 420) return "NU";   
    if (stats >= 320) return "PU";   

    return "LC"; 
}

// --- THEMES ---
function setTheme(themeName) {
    document.documentElement.className = ''; 
    if(themeName !== 'default') {
        document.documentElement.classList.add(themeName);
    }
    localStorage.setItem('pokedex_theme', themeName);
}
const savedTheme = localStorage.getItem('pokedex_theme');
if(savedTheme) setTheme(savedTheme);

// --- HISTORIQUE ---
function addToHistory(poke) {
    navHistory = navHistory.filter(h => h.id !== poke.id);
    navHistory.unshift({ id: poke.id, img: poke.img });
    if(navHistory.length > 10) navHistory.pop();

    localStorage.setItem('pokedex_history', JSON.stringify(navHistory));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history-list');
    if(!container) return;
    container.innerHTML = navHistory.map(h =>
        `<div class="history-item" style="background-image:url('${h.img}')" onclick="openModal(allPokemon.find(p=>p.id=='${h.id}'))" title="Voir"></div>`
    ).join('');
}

function updateButtonsState() {
    document.querySelectorAll('.card').forEach(card => {
        const btnFav = card.querySelector('.btn-fav');
        const btnComp = card.querySelector('.btn-compare');

        if(btnFav) {
            const id = btnFav.getAttribute('onclick').match(/'([^']+)'/)[1];
            if(favorites.includes(id)) btnFav.classList.add('active');
            else btnFav.classList.remove('active');
        }
        if(btnComp) {
            const id = btnComp.getAttribute('onclick').match(/'([^']+)'/)[1];
            if(compareList.includes(id)) btnComp.classList.add('active');
            else btnComp.classList.remove('active');
        }
    });
    updateFloatingBar();
}

function toggleCompare(id, btn) {
    event.stopPropagation();
    if(compareList.includes(id)) compareList = compareList.filter(c => c !== id);
    else {
        if(compareList.length >= 2) compareList.shift();
        compareList.push(id);
    }
    updateButtonsState();
}

function updateFloatingBar() {
    let bar = document.getElementById('floating-bar');
    if(!bar) {
        bar = document.createElement('div');
        bar.id = 'floating-bar';
        bar.className = 'floating-bar';
        document.body.appendChild(bar);
    }

    let teamHTML = myTeam.map(uid => {
        const p = allPokemon.find(x => x.id === uid);
        if(!p) return '';
        return `
        <div class="team-slot" style="background-image:url('${p.img}')" onclick="openModal(allPokemon.find(x => x.id === '${uid}'))">
            <div class="team-slot-remove" onclick="event.stopPropagation(); toggleTeam('${uid}')">&times;</div>
        </div>`;
    }).join('');

    let compareBtn = compareList.length === 2 ?
        `<button onclick="openCompareModal()" style="background:#f1c40f; border:none; padding:8px 20px; border-radius:20px; cursor:pointer; color:#333; font-weight:bold; box-shadow:0 4px 0 #d35400;">VS COMPARER</button>` : '';

    let analyzeBtn = myTeam.length > 0 ?
        `<button onclick="openTeamAnalysis()" style="background:#9b59b6; border:none; padding:8px 20px; border-radius:20px; cursor:pointer; color:white; font-weight:bold; margin-left:10px; box-shadow:0 4px 0 #8e44ad;">
            <i class="fas fa-chart-pie"></i> Analyser
        </button>` : '';

    const clearTeamBtn = myTeam.length > 0 ? `<button class="btn-mini-clear" onclick="clearTeam()" title="Vider l'équipe">🗑️</button>` : '';
    const clearFavBtn = favorites.length > 0 ? `<button class="btn-mini-clear" onclick="clearFavorites()" title="Tout supprimer">🗑️</button>` : '';

    bar.innerHTML = `
        <div style="display:flex; align-items:center; margin-right:15px;">
            <div style="font-size:0.9em; font-weight:bold; margin-right:5px;">Mon Équipe (${myTeam.length}/6)</div>
            ${clearTeamBtn}
        </div>

        ${teamHTML}
        ${analyzeBtn} ${compareBtn}

        ${favorites.length > 0 ? `
            <div style="margin-left:20px; display:flex; align-items:center; gap:8px; border-left:1px solid rgba(255,255,255,0.3); padding-left:15px;">
                <div style="cursor:pointer; font-size:1.2em;" onclick="filterFavorites()" title="Voir Favoris">
                    ❤️ <span style="font-size:0.7em;">${favorites.length}</span>
                </div>
                ${clearFavBtn}
            </div>` : ''}
    `;

    if(myTeam.length === 0 && compareList.length === 0 && favorites.length === 0) {
        bar.style.display = 'none';
    } else {
        bar.style.display = 'flex';
    }
}

function filterFavorites() {
    document.getElementById('sidebar-search').value = "fav:";
    applyFilters();
}

function updateChartColors() {
    const isDark = document.documentElement.classList.contains('theme-dark');
    const textColor = isDark ? '#e2e8f0' : '#666';
    const gridColor = isDark ? '#334155' : '#ddd';

    Chart.defaults.color = textColor;
    Chart.defaults.scale.grid.color = gridColor;

    if(statChartInstance) statChartInstance.update();
    if(teamChartInstance) teamChartInstance.update();
    if(compareChartInstance) compareChartInstance.update();
}

const originalSetTheme = setTheme; 
setTheme = function(themeName) {
    originalSetTheme(themeName);
    updateChartColors();
};

function toggleShiny(imgId, normalSrc) {
    const img = document.getElementById(imgId);
    if(img.src === normalSrc) {
        if(normalSrc.includes('/normal/')) img.src = normalSrc.replace('/normal/', '/shiny/');
        else {
            img.style.filter = "hue-rotate(150deg) brightness(1.1)";
        }
    } else {
        img.src = normalSrc;
        img.style.filter = "none";
    }
}

function calculateWeaknesses(types) {
    let result = {};
    const typeNames = Object.keys(TYPE_CHART);

    typeNames.forEach(attacker => {
        let multiplier = 1;
        types.forEach(defender => {
            if(TYPE_CHART[attacker] && TYPE_CHART[attacker][defender] !== undefined) {
                multiplier *= TYPE_CHART[attacker][defender];
            }
        });
        if(multiplier !== 1) result[attacker] = multiplier;
    });
    return result;
}

// --- MODAL COMPARATEUR ---
let compareChartInstance = null;

function openCompareModal() {
    const p1 = allPokemon.find(p => p.id === compareList[0]);
    const p2 = allPokemon.find(p => p.id === compareList[1]);

    if(!p1 || !p2) return;

    const modal = document.getElementById('modal');
    document.getElementById('modal-img-mini').style.display = 'none';

    const statsKeys = ["HP", "Attack", "Defence", "SpecialAttack", "SpecialDefence", "Speed"];
    const labels = {HP:"PV", Attack:"ATK", Defence:"DEF", SpecialAttack:"SPA", SpecialDefence:"SPD", Speed:"VIT"};

    let statsHTML = `<div class="vs-stats-grid">`;

    let p1Wins = 0;
    let p2Wins = 0;

    statsKeys.forEach(key => {
        const v1 = p1.stats[key];
        const v2 = p2.stats[key];
        const maxVal = Math.max(v1, v2, 150);

        const pct1 = (v1 / maxVal) * 100;
        const pct2 = (v2 / maxVal) * 100;

        let class1 = "loser"; let class2 = "loser";
        let barClass1 = "fill-loser"; let barClass2 = "fill-loser";

        if (v1 > v2) {
            class1 = "winner"; barClass1 = "fill-winner"; p1Wins++;
        } else if (v2 > v1) {
            class2 = "winner"; barClass2 = "fill-winner"; p2Wins++;
        } else {
            class1 = "tie"; class2 = "tie";
            barClass1 = "fill-tie"; barClass2 = "fill-tie";
        }

        statsHTML += `
            <div class="vs-stat-row">
                <div class="vs-val left ${class1}">${v1}</div>

                <div class="vs-bar-track left">
                    <div class="vs-bar-fill ${barClass1}" style="width: ${pct1}%"></div>
                </div>

                <div class="vs-stat-label">${labels[key]}</div>

                <div class="vs-bar-track right">
                    <div class="vs-bar-fill ${barClass2}" style="width: ${pct2}%"></div>
                </div>

                <div class="vs-val right ${class2}">${v2}</div>
            </div>`;
    });

    const t1 = p1.totalStats; const t2 = p2.totalStats;
    statsHTML += `
        <div class="vs-stat-row" style="margin-top:10px; border-top:1px dashed var(--border); padding-top:10px;">
            <div class="vs-val left ${t1 >= t2 ? 'winner' : ''}">${t1}</div>
            <div style="grid-column: 2/5; text-align:center; font-weight:bold; letter-spacing:2px;">TOTAL BST</div>
            <div class="vs-val right ${t2 >= t1 ? 'winner' : ''}">${t2}</div>
        </div>
    </div>`;

    const w1 = calculateWeaknesses(p1.types);
    const w2 = calculateWeaknesses(p2.types);
    const allTypes = Object.keys(TYPE_CHART);

    let typeRows = "";
    allTypes.forEach(t => {
        const val1 = w1[t] || 1;
        const val2 = w2[t] || 1;

        if (val1 !== 1 || val2 !== 1) {
            const badge1 = val1 > 1 ? `<span class="eff-2">x${val1}</span>` : (val1 < 1 ? `<span class="eff-05">x${val1}</span>` : '-');
            const badge2 = val2 > 1 ? `<span class="eff-2">x${val2}</span>` : (val2 < 1 ? `<span class="eff-05">x${val2}</span>` : '-');

            typeRows += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:5px 0; border-bottom:1px solid var(--border);">
                    <div style="flex:1; text-align:right;">${badge1}</div>
                    <div style="width:80px; text-align:center;"><span class="type-badge type-${t}" style="font-size:0.7em;">${t}</span></div>
                    <div style="flex:1; text-align:left;">${badge2}</div>
                </div>`;
        }
    });

    document.getElementById('modal-body-content').innerHTML = `
        <div class="vs-container">
            <div class="vs-header">
                <div class="vs-fighter">
                    <img src="${p1.img}" onclick="openImageZoom('${p1.img}')" class="img-clickable">
                    <h3 style="margin:5px 0;">${p1.name}</h3>
                    <div style="font-size:0.8em;">${p1.types.map(t=>`<span class="type-badge type-${t}">${t}</span>`).join(' ')}</div>
                </div>

                <div class="vs-badge">VS</div>

                <div class="vs-fighter">
                    <img src="${p2.img}" onclick="openImageZoom('${p2.img}')" class="img-clickable">
                    <h3 style="margin:5px 0;">${p2.name}</h3>
                    <div style="font-size:0.8em;">${p2.types.map(t=>`<span class="type-badge type-${t}">${t}</span>`).join(' ')}</div>
                </div>
            </div>

            <div style="display:flex; gap:30px; flex-wrap:wrap;">
                <div style="flex:1.5; min-width:350px;">
                    <h4 style="text-align:center; color:var(--text-muted); margin-bottom:15px;">COMPARATIF STATS BASE</h4>
                    ${statsHTML}
                </div>

                <div style="flex:1; min-width:300px;">
                    <div style="height:250px; margin-bottom:20px;">
                        <canvas id="compareChart"></canvas>
                    </div>

                    <div style="background:var(--bg-input); padding:15px; border-radius:12px; border:1px solid var(--border);">
                        <h4 style="margin:0 0 10px 0; text-align:center;">SENSIBILITÉS TYPES</h4>
                        <div style="display:flex; justify-content:space-between; font-size:0.8em; color:var(--text-muted); margin-bottom:5px;">
                            <span>${p1.name}</span>
                            <span>${p2.name}</span>
                        </div>
                        <div style="max-height:200px; overflow-y:auto;">
                            ${typeRows}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    modal.classList.add('active');

    if(compareChartInstance) compareChartInstance.destroy();
    const ctx = document.getElementById('compareChart');
    if(ctx) {
        const isDark = document.documentElement.classList.contains('theme-dark');
        const color1 = 'rgba(52, 152, 219, 1)'; 
        const bg1 = 'rgba(52, 152, 219, 0.2)';
        const color2 = 'rgba(231, 76, 60, 1)'; 
        const bg2 = 'rgba(231, 76, 60, 0.2)';
        const gridColor = isDark ? '#334155' : '#ddd';
        const txtColor = isDark ? '#e2e8f0' : '#666';

        compareChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Vit'],
                datasets: [
                    { label: p1.name, data: Object.values(p1.stats), borderColor: color1, backgroundColor: bg1, borderWidth: 2 },
                    { label: p2.name, data: Object.values(p2.stats), borderColor: color2, backgroundColor: bg2, borderWidth: 2 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        suggestedMin: 0,
                        grid: { color: gridColor },
                        pointLabels: { color: txtColor, font: { size: 11, weight:'bold' } },
                        angleLines: { color: gridColor }
                    }
                },
                plugins: {
                    legend: { labels: { color: txtColor } }
                }
            }
        });
    }
}

// --- 3. CHARGEMENT (API AZURIOM) ---
// --- 3. CHARGEMENT (API AZURIOM) ---
async function initData() {
    const grid = document.getElementById('pokedex-grid');
    
    try {
        console.log("Démarrage du chargement du Pokédex...");

        // 1. Demander la liste des fichiers
        // Assurez-vous que la route /api/pokedex/list existe bien côté PHP
        const responseList = await fetch('/api/pokedex/list');
        
        if (!responseList.ok) {
            // Si l'API échoue, on affiche l'erreur dans la grille sans bloquer la page
            throw new Error(`Erreur API Liste: ${responseList.status} (Route introuvable ?)`);
        }
        
        const fileNames = await responseList.json();
        console.log(`${fileNames.length} fichiers trouvés.`);

        if (!Array.isArray(fileNames) || fileNames.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding:50px;">Aucun fichier Pokémon trouvé via l\'API.</div>';
            return;
        }

        // 2. Télécharger les fichiers sans bloquer si l'un d'eux échoue
        const promises = fileNames.map(fName => 
            fetch(`/api/pokedex/pokemon/${fName}`)
                .then(res => {
                    if (!res.ok) throw new Error(`Fichier ${fName} invalide`);
                    return res.json();
                })
                .catch(err => {
                    console.warn(`Impossible de charger ${fName}:`, err);
                    return null; // On retourne null pour l'ignorer ensuite
                })
        );

        // allSettled attend que tout soit fini, succès ou échec
        const results = await Promise.allSettled(promises);
        
        // On ne garde que les réussites
        const loadedData = results
            .filter(r => r.status === 'fulfilled' && r.value !== null)
            .map(r => r.value);
        
        // 3. Traiter les données
        allPokemon = []; 

        loadedData.forEach((pokeData, index) => {
            const poke = Array.isArray(pokeData) ? pokeData[0] : pokeData;
            if (!poke) return;

            const fName = poke.pixelmonName || "Inconnu"; 
            const realIdStr = String(poke.pokedexId || index); 

            // Création du Pokémon de base
            const parent = formatPokemon(poke, realIdStr);
            if (parent) allPokemon.push(parent);

            // Création des formes
            if (poke.forms) {
                Object.entries(poke.forms).forEach(([key, form]) => {
                    if (key === "0") return; 
                    const formattedForm = formatPokemon(form, realIdStr, true, poke, key);
                    if (formattedForm) allPokemon.push(formattedForm);
                });
            }
        });

        console.log(`Traitement terminé : ${allPokemon.length} Pokémon prêts.`);

        // Initialisation des filtres
        generateCheckboxes(typesList, 'type-filters', 'type');
        generateCheckboxes(MAIN_TAGS, 'main-tag-filters', 'main-tag');
        generateStatFilters();
        
        // Affichage final
        renderGrid(allPokemon);
        renderHistory();

    } catch (error) {
        console.error("Erreur critique :", error);
        // Affichage de l'erreur directement dans la grille pour le débogage
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:50px; color:#e74c3c; background: rgba(0,0,0,0.5); border-radius: 8px;">
            <strong>Erreur de chargement</strong><br>
            <pre style="margin-top:10px; font-size:0.8em;">${error.message}</pre>
            <br>
            <em>Vérifiez la console (F12) pour plus de détails.</em>
        </div>`;
    }
}

// --- 4. FORMATAGE (CHEMINS AZURIOM) ---
function formatPokemon(data, id = null, isForm = false, parentData = null, formKey = null) {
    if (!data) return null;

    let displayName = data.pixelmonName || (parentData ? parentData.pixelmonName : "Inconnu");
    let detectedTag = data.formType || (isForm ? "Forme" : "");
    let cosmeticTheme = data.cosmeticTheme || null;
    let customSlug = null;
    let obtentionMethod = data.obtention || "";

    if (isForm && parentData) {
        if (formKey && COSMETIC_MAP[formKey]) {
            const cName = COSMETIC_MAP[formKey];
            detectedTag = "Cosmetic";
            cosmeticTheme = cName;
            displayName = `${cName} ${parentData.pixelmonName}`;
        } else {
            const specialInfo = identifySpecialForm(parentData.pixelmonName, formKey, data, parentData);
            if (specialInfo) {
                displayName = specialInfo.name;
                detectedTag = specialInfo.tag;
                customSlug = specialInfo.slug;
            } else {
                const pName = parentData.pixelmonName;
                if (OFFICIAL_MEGAS.includes(pName)) {
                    if (formKey === "1" || (pName === "Greninja" && ["9","10","11"].includes(formKey))) {
                        detectedTag = "Mega";
                        displayName = (["Charizard","Mewtwo"].includes(pName)) ? `Mega ${pName} X` : `Mega ${pName}`;
                    }
                    else if (formKey === "2" && ["Charizard","Mewtwo"].includes(pName)) {
                        detectedTag = "Mega";
                        displayName = `Mega ${pName} Y`;
                    }
                }
                if (OFFICIAL_GMAX.includes(pName) && detectedTag !== "Mega" && !customSlug) {
                    const isDualMega = ["Charizard","Mewtwo"].includes(pName);
                    if ((isDualMega && parseInt(formKey) >= 3) || (!isDualMega && parseInt(formKey) >= 1)) {
                        detectedTag = "Gigantamax";
                        displayName = `Gigantamax ${pName}`;
                    }
                }
                for (const [region, pokes] of Object.entries(REGION_MAPPING)) {
                    if (pokes.includes(pName)) {
                        if (isFormDistinct(data, parentData)) {
                            detectedTag = region;
                            displayName = `${region} ${pName}`;
                            customSlug = `${pName.toLowerCase()}-${region.toLowerCase()}`;
                        }
                    }
                }
            }
        }
    }

    let uniqueId;
    if (isForm && formKey) {
        uniqueId = `${id}-${formKey}`;
    } else {
        uniqueId = `${id}-base`;
    }

    let caps = { ride: false, fly: false, surf: false };

        if (data.capabilities) {
            caps.ride = !!data.capabilities.ride;
            caps.fly = !!data.capabilities.fly;
            caps.surf = !!data.capabilities.surf;
        }
        else if (data.isRideable !== undefined || data.canFly !== undefined || data.canSurf !== undefined) {
            caps.ride = !!data.isRideable;
            caps.fly = !!data.canFly;
            caps.surf = !!data.canSurf;
        }
        else if (parentData && parentData.capabilities) {
            caps.ride = !!parentData.capabilities.ride;
            caps.fly = !!parentData.capabilities.fly;
            caps.surf = !!parentData.capabilities.surf;
        }
        else if (parentData && (parentData.isRideable !== undefined || parentData.canFly !== undefined)) {
            caps.ride = !!parentData.isRideable;
            caps.fly = !!parentData.canFly;
            caps.surf = !!parentData.canSurf;
        }

    let finalStats = data.stats ? { ...data.stats } : (parentData ? { ...parentData.stats } : {});
    if (!finalStats.HP) finalStats = { HP:0, Attack:0, Defence:0, Speed:0, SpecialAttack:0, SpecialDefence:0 };

    if (detectedTag === "Gigantamax" && parentData && finalStats.HP === parentData.stats.HP) {
        finalStats.HP = Math.floor(finalStats.HP * 2);
    }
    const finalTotal = Object.values(finalStats).reduce((a,b)=>a+b, 0);

    // --- CHEMINS IMAGES AZURIOM ---
    let imgUrl;
    if (data.customImage) {
        // Chemin public Azuriom
        imgUrl = `/assets/plugins/pokedex/img/${data.customImage}`;
    } else {
        let urlName = "";
        const baseName = (parentData ? parentData.pixelmonName : displayName).toLowerCase()
            .replace("mr. ", "mr-").replace("mime jr.", "mime-jr")
            .replace("type: null", "type-null").replace("tapu ", "tapu-")
            .replace("wo-chien", "wo-chien").replace("chien-pao", "chien-pao")
            .replace(/['\.]/g, "").replace(/\s+/g, "-");

        if (customSlug) urlName = customSlug;
        else if (detectedTag === "Mega") {
            urlName = `${baseName}-mega`;
            if (displayName.includes(" X")) urlName += "-x";
            if (displayName.includes(" Y")) urlName += "-y";
        }
        else if (detectedTag === "Gigantamax") urlName = `${baseName}-gigantamax`;
        else if (cosmeticTheme) urlName = baseName;
        else urlName = baseName;

        imgUrl = `https://img.pokemondb.net/sprites/home/normal/${urlName}.png`;
    }

    let tmMoves = [];
    for(let i=1; i<=9; i++) {
        if(Array.isArray(data[`tmMoves${i}`])) tmMoves = tmMoves.concat(data[`tmMoves${i}`]);
    }
    tmMoves = [...new Set(tmMoves)].sort();

    return {
        name: displayName,
        id: uniqueId,
        pokedexId: id,
        isForm: isForm,
        tag: detectedTag,
        cosmeticTheme: cosmeticTheme,
        obtention: obtentionMethod,
        // Chemin public Azuriom pour ingameImg
        ingameImg: data.ingameImage ? `/plugins/pokedex/img/${data.ingameImage}` : imgUrl,
        parentName: parentData ? parentData.pixelmonName : null,
        weight: data.weight || (parentData ? parentData.weight : 0),
        catchRate: data.catchRate || (parentData ? parentData.catchRate : 0),
        malePercent: (data.malePercent !== undefined) ? data.malePercent : (parentData ? parentData.malePercent : 50),
        capabilities: caps || data.capabilities || (parentData ? parentData.capabilities : { ride: false, fly: false, surf: false }),
        spawnLocations: Array.isArray(data.spawnLocations) ? data.spawnLocations : (parentData ? parentData.spawnLocations : []),
        preEvolutions: Array.isArray(data.preEvolutions) ? data.preEvolutions : [],
        evolutions: Array.isArray(data.evolutions) ? data.evolutions : [],
        moves: {
            levelUp: data.levelUpMoves || (parentData ? parentData.levelUpMoves : {}),
            tutor: Array.isArray(data.tutorMoves) ? data.tutorMoves : [],
            egg: Array.isArray(data.eggMoves) ? data.eggMoves : [],
            tm: tmMoves,
            transfer: Array.isArray(data.transferMoves) ? data.transferMoves : [],
            hm: Array.isArray(data.hmMoves) ? data.hmMoves : [],
            tr: Array.isArray(data.trMoves) ? data.trMoves : []
        },
        types: Array.isArray(data.types) ? data.types : (parentData ? parentData.types : ["Normal"]),
        stats: finalStats,
        totalStats: finalTotal,
        abilities: Array.isArray(data.abilities) ? data.abilities : (parentData ? parentData.abilities : []),
        eggGroups: Array.isArray(data.eggGroups) ? data.eggGroups : (parentData ? parentData.eggGroups : []),
        expGroup: data.experienceGroup || (parentData ? parentData.experienceGroup : "Unknown"),
        img: imgUrl
    };
}

function clearTeam() {
    if(myTeam.length === 0) return;
    if(confirm("Vider toute l'équipe ?")) {
        myTeam = [];
        localStorage.setItem('pokedex_team', JSON.stringify(myTeam));
        updateFloatingBar();

        const btnModal = document.getElementById('btn-add-team');
        if(btnModal) {
            btnModal.innerHTML = '<i class="fas fa-plus"></i> Ajouter';
            btnModal.style.background = '#27ae60';
        }
    }
}

function clearFavorites() {
    if(favorites.length === 0) return;
    if(confirm("Supprimer tous les favoris ?")) {
        favorites = [];
        localStorage.setItem('pokedex_favs', JSON.stringify(favorites));

        updateFloatingBar();
        updateButtonsState();

        if(document.getElementById('sidebar-search').value === "fav:") {
            applyFilters();
        }
    }
}

// --- Rendu Grille ---
function renderGrid(data) {
    const grid = document.getElementById('pokedex-grid');
    grid.innerHTML = '';

    if (!data || data.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding:40px; color:#666;">Aucun Pokémon trouvé.</div>';
        return;
    }

    const fragment = document.createDocumentFragment();

    data.forEach(poke => {
        const badges = poke.types.map(t => `<span class="type-badge type-${t}">${t}</span>`).join('');

        let tagHTML = '';
        if (poke.tag && !['forme', 'form'].includes(poke.tag.toLowerCase())) {
            let cssClass = poke.tag.toLowerCase();
            if (cssClass.includes('mega')) cssClass = 'mega';
            if (cssClass.includes('gigantamax')) cssClass = 'gigantamax';
            tagHTML = `<span class="form-tag tag-${cssClass}">${poke.tag}</span>`;
        }

        const tier = getTier(poke);
        const tierHTML = (tier && tier !== "Unknown")
            ? `<span class="tier-badge tier-${tier}" style="margin-left:5px; font-size:0.6em; vertical-align:middle;">${tier}</span>`
            : '';

        const isFav = favorites.includes(poke.id) ? 'active' : '';
        const isComp = compareList.includes(poke.id) ? 'active' : '';

        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openModal(poke);

        const imgSafe = poke.img || 'https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg';

        card.innerHTML = `
            <div class="card-actions">
                <button class="btn-compare ${isComp}" onclick="toggleCompare('${poke.id}', this)" title="Comparer"><i class="fas fa-balance-scale"></i></button>
                <button class="btn-fav ${isFav}" onclick="toggleFavorite('${poke.id}', this)" title="Favori"><i class="fas fa-heart"></i></button>
            </div>
            <div class="card-img">
                ${poke.pokedexId ? `<span class="card-id">#${poke.pokedexId}</span>` : ''}
                <img src="${imgSafe}" loading="lazy" onerror="this.src='https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg'">
            </div>
            <div class="card-body">
                <div class="card-title">
                    <span style="font-size:0.9em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${poke.name}</span>
                    <div style="display:flex; align-items:center;">
                        ${tagHTML}
                        ${tierHTML}
                    </div>
                </div>
                <div class="types-row">${badges}</div>
                <div style="font-size:0.8em; color:#888;">Total: <strong>${poke.totalStats}</strong></div>
            </div>
        `;
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
    updateFloatingBar();
}

function clearFilters() {
    document.getElementById('sidebar-search').value = "";
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.stat-input').forEach(i => i.value = "");
    document.getElementById('sort-select').value = "id";
    applyFilters();
}

function applyFilters() {
    const sortValue = document.getElementById('sort-select').value;
    let searchQuery = document.getElementById('sidebar-search').value.toLowerCase();

    const showFavsOnly = searchQuery === "fav:";
    if(showFavsOnly) searchQuery = "";

    const selectedTypes = Array.from(document.querySelectorAll('.filter-type:checked')).map(cb => cb.value);
    const selectedEggs = Array.from(document.querySelectorAll('.filter-egg:checked')).map(cb => cb.value);
    const selectedMainTags = Array.from(document.querySelectorAll('.filter-main-tag:checked')).map(cb => cb.value);
    const selectedCosmeticTags = Array.from(document.querySelectorAll('.filter-cosmetic:checked')).map(cb => cb.value);
    const selectedTiers = Array.from(document.querySelectorAll('.filter-tier:checked')).map(cb => cb.value);

    let filtered = allPokemon.filter(poke => {
        if (showFavsOnly && !favorites.includes(poke.id)) return false;

        if (searchQuery) {
            const matchName = poke.name.toLowerCase().includes(searchQuery);
            const matchId = String(poke.pokedexId).includes(searchQuery);
            const matchMove = Object.values(poke.moves).some(list => Array.isArray(list) && list.some(m => m.toLowerCase().includes(searchQuery)));

            if (!matchName && !matchId && !matchMove) return false;
        }

        if (selectedTiers.length > 0) {
            const pokeTier = getTier(poke);
            if (!selectedTiers.includes(pokeTier)) return false;
        }

        if (selectedMainTags.length > 0) {
            if (!selectedMainTags.includes(poke.tag)) return false;
        }

        if (selectedCosmeticTags.length > 0) {
            const pokeTag = poke.cosmeticTheme || poke.tag;
            if (!selectedCosmeticTags.includes(pokeTag)) return false;
        } else {
            if (poke.tag === 'Cosmetic' || poke.cosmeticTheme) return false;
        }

        if (selectedTypes.length > 0 && !poke.types.some(t => selectedTypes.includes(t))) return false;
        if (selectedEggs.length > 0 && !poke.eggGroups.some(g => selectedEggs.includes(g))) return false;

        let statsOk = true;
        document.querySelectorAll('.stat-input').forEach(input => {
            const stat = input.dataset.stat;
            const isMin = input.classList.contains('min');
            const val = parseInt(input.value);
            if (!isNaN(val)) {
                if (isMin && poke.stats[stat] < val) statsOk = false;
                if (!isMin && poke.stats[stat] > val) statsOk = false;
            }
        });
        return statsOk;
    });

    filtered.sort((a, b) => {
            if (sortValue === 'weight-desc') return b.weight - a.weight;
            if (sortValue === 'weight-asc') return a.weight - b.weight;
            if (sortValue === 'stat-total') return b.totalStats - a.totalStats;
            if (sortValue === 'stat-hp') return b.stats.HP - a.stats.HP;
            if (sortValue === 'stat-attack') return b.stats.Attack - a.stats.Attack;
            if (sortValue === 'stat-defence') return b.stats.Defence - a.stats.Defence;
            if (sortValue === 'stat-spatk') return b.stats.SpecialAttack - a.stats.SpecialAttack;
            if (sortValue === 'stat-spdef') return b.stats.SpecialDefence - a.stats.SpecialDefence;
            if (sortValue === 'stat-speed') return b.stats.Speed - a.stats.Speed;

            if (sortValue === 'tag') {
                        let tagA = (a.tag && !['Forme','form'].includes(a.tag)) ? a.tag : "zzzz";
                        let tagB = (b.tag && !['Forme','form'].includes(b.tag)) ? b.tag : "zzzz";
                        if (tagA !== tagB) return tagA.localeCompare(tagB);
                    }

                    if (sortValue === 'tier') {
                        const tierA = getTier(a);
                        const tierB = getTier(b);

                        const rankA = TIER_RANK[tierA] || 99;
                        const rankB = TIER_RANK[tierB] || 99;

                        if (rankA !== rankB) return rankA - rankB; 
                        return b.totalStats - a.totalStats; 
                    }

            if (sortValue === 'name') return a.name.localeCompare(b.name);
            return (parseInt(a.pokedexId) || 9999) - (parseInt(b.pokedexId) || 9999);
        });

        renderGrid(filtered);
    }

function formatEvolutionCondition(cond) {
    if (!cond) return "";
    let text = [];
    try {
        if (cond.evoType === 'leveling') text.push(cond.level ? `Niveau ${cond.level}` : "Montée de niveau");
        if (cond.evoType === 'interact') text.push("Interaction");
        if (cond.evoType === 'trade') text.push("Échange");
        if (Array.isArray(cond.conditions)) {
            cond.conditions.forEach(c => {
                if (c.item && c.item.itemID) text.push(`avec ${c.item.itemID.split(':')[1]}`);
                if (c.friendship) text.push(`Amitié ${c.friendship}+`);
                if (c.time) text.push(`(${c.time})`);
                if (c.biome) text.push(`Biome spécifique`);
            });
        }
    } catch (e) { return "Cond. Spéciale"; }
    return text.join(" + ");
}

function openModal(poke) {
    try {
        currentPokemon = poke; 
        addToHistory(poke);
        currentPokeStats = poke.stats;
        const modal = document.getElementById('modal');
        document.getElementById('modal-img-mini').style.display = 'none';

        document.getElementById('modal-body-content').innerHTML = buildModalContent(poke);
        updateCalculator();
        modal.classList.add('active');

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-target="tab-general"]').classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('tab-general').classList.add('active');

        if(statChartInstance) statChartInstance.destroy();
        const ctx = document.getElementById('statChart');
        if(ctx) {
            statChartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Vit'],
                    datasets: [{
                        label: 'Stats Base',
                        data: [poke.stats.HP, poke.stats.Attack, poke.stats.Defence, poke.stats.SpecialAttack, poke.stats.SpecialDefence, poke.stats.Speed],
                        backgroundColor: 'rgba(255, 62, 62, 0.2)',
                        borderColor: 'rgba(255, 62, 62, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(255, 62, 62, 1)'
                    }]
                },
                options: {
                    scales: { r: { suggestedMin: 0, suggestedMax: 150, pointLabels: { font: { size: 12 } } } },
                    plugins: { legend: { display: false } }
                }
            });
        }
    } catch (e) { console.error(e); alert("Erreur ouverture modal : " + e.message); }
}

function switchMoveTab(category, btn) {
    document.querySelectorAll('.move-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.move-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });

    const target = document.getElementById(`move-content-${category}`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    }
}

function buildModalContent(poke) {
    const badges = poke.types.map(t => `<span class="type-badge type-${t}">${t}</span>`).join(' ');
    const tier = getTier(poke);
    const tierBadge = `<span class="tier-badge tier-${tier}">${tier}</span>`;
    let tagHTML = '';
    if (poke.tag && !['forme', 'form'].includes(poke.tag.toLowerCase())) {
        let cssClass = poke.tag.toLowerCase();
        if (cssClass.includes('mega')) cssClass = 'mega';
        if (cssClass.includes('gigantamax')) cssClass = 'gigantamax';
        tagHTML = `<span class="form-tag tag-${cssClass}" style="font-size:1em; margin-left:10px;">${poke.tag}</span>`;
    }

    let backButtonHTML = '';
    if (poke.parentName) {
        backButtonHTML = `
            <button onclick="switchToForm('${poke.parentName.replace(/'/g, "\\'")}')"
                    style="background:none; border:none; color:#3498db; cursor:pointer; font-size:1em; padding:0; margin-bottom:10px; display:flex; align-items:center;">
                <i class="fas fa-arrow-left" style="margin-right:5px;"></i> Retour à ${poke.parentName}
            </button>`;
    }

    let genderHTML = (poke.malePercent === -1)
        ? "<span><i class='fas fa-genderless'></i> Asexué</span>"
        : `<span style="color:#3498db"><i class="fas fa-mars"></i> ${poke.malePercent}%</span> <span style="color:#e91e63; margin-left:10px;"><i class="fas fa-venus"></i> ${100 - poke.malePercent}%</span>`;

    const caps = poke.capabilities || { ride: false, fly: false, surf: false };
    const capsHTML = `
        <div style="display:flex; gap:15px; margin-top:5px;">
            <div title="Monture" style="color:${caps.ride ? '#27ae60' : '#bdc3c7'}"><i class="fas fa-horse"></i> ${caps.ride ? 'Oui' : 'Non'}</div>
            <div title="Vol" style="color:${caps.fly ? '#2980b9' : '#bdc3c7'}"><i class="fas fa-plane"></i> ${caps.fly ? 'Oui' : 'Non'}</div>
            <div title="Surf" style="color:${caps.surf ? '#2980b9' : '#bdc3c7'}"><i class="fas fa-water"></i> ${caps.surf ? 'Oui' : 'Non'}</div>
        </div>`;

    let obtentionHTML = poke.obtention ? `<div class="obtention-box"><strong><i class="fas fa-map-marker-alt"></i> Obtention :</strong> ${poke.obtention}</div>` : "";
    let ingameImageHTML = (poke.ingameImg && poke.ingameImg !== poke.img) ?
        `<div style="text-align:center; margin-top:15px;">
            <strong>Aperçu en jeu :</strong><br>
            <img src="${poke.ingameImg}"
                 onclick="openImageZoom(this.src)"
                 class="img-clickable"
                 style="max-width:100%; max-height:200px; border-radius:8px; margin-top:5px; box-shadow:0 2px 5px rgba(0,0,0,0.2);"
                 title="Cliquez pour agrandir">
        </div>` : "";
    const weaknesses = calculateWeaknesses(poke.types);
    let weakHTML = `<div style="margin-top:10px; font-size:0.9em;"><strong>Faiblesses/Résistances :</strong><br><table class="type-table" style="width:100%; border-collapse:collapse; margin-top:5px;"><tr>`;
    for (const [type, mult] of Object.entries(weaknesses)) {
        let colorClass = mult > 1 ? (mult > 2 ? "eff-4" : "eff-2") : (mult < 1 ? (mult == 0 ? "eff-0" : (mult < 0.5 ? "eff-025" : "eff-05")) : "");
        weakHTML += `<td class="${colorClass}">${type}: x${mult}</td>`;
    }
    weakHTML += `</tr></table></div>`;

        const catchRateHTML = `
            <div class="catch-calc-box">
                <h4 style="margin-top:0;"><i class="fas fa-calculator"></i> Simulateur de Capture</h4>

                <div class="calc-row">
                    <label>Ball:</label>
                    <select id="catch-ball" onchange="updateCatchRate()" style="max-width:200px;">
                        <optgroup label="Standard">
                            <option value="poke">Poké Ball (x1)</option>
                            <option value="great">Super Ball (x1.5)</option>
                            <option value="ultra">Hyper Ball (x2)</option>
                            <option value="master">Master Ball (100%)</option>
                        </optgroup>
                        <optgroup label="Spéciales">
                            <option value="net">Filet Ball (Eau/Insecte x3.5)</option>
                            <option value="dusk">Sombre Ball (Nuit/Grotte x3)</option>
                            <option value="quick">Rapide Ball (Tour 1 x5)</option>
                            <option value="timer">Chrono Ball (Tours+)</option>
                            <option value="repeat">Bis Ball (Déjà pris x3.5)</option>
                            <option value="dive">Scuba Ball (Eau x3.5)</option>
                            <option value="nest">Faiblo Ball (Niv-)</option>
                            <option value="heavy">Masse Ball (Poids)</option>
                            <option value="fast">Speed Ball (Vitesse)</option>
                            <option value="lure">Appât Ball (Pêche x4)</option>
                            <option value="dream">Rêve Ball (Dodo x4)</option>
                            <option value="beast">Ultra Ball (Chimère)</option>
                        </optgroup>
                    </select>
                </div>

                <div style="margin-bottom:10px; font-size:0.8em; display:flex; gap:10px; flex-wrap:wrap; background:var(--bg-card); padding:5px; border-radius:4px; border:1px solid var(--border);">
                    <label><input type="checkbox" id="chk-night" onchange="updateCatchRate()"> Nuit/Grotte</label>
                    <label><input type="checkbox" id="chk-water" onchange="updateCatchRate()"> Eau/Pêche</label>
                    <label><input type="checkbox" id="chk-turn1" onchange="updateCatchRate()"> Tour 1</label>
                    <label><input type="checkbox" id="chk-caught" onchange="updateCatchRate()"> Déjà capturé</label>
                </div>

                <div class="calc-row">
                    <label>Niveau Cible:</label>
                    <input type="number" id="lvl-val" value="50" min="1" max="100" oninput="updateCatchRate()" style="width:60px; padding:5px;">
                </div>

                <div class="calc-row">
                    <label>PV Restants:</label>
                    <input type="range" id="catch-hp" min="1" max="100" value="100" oninput="updateCatchRate()">
                    <span id="catch-hp-val">100%</span>
                </div>

                <div class="calc-row">
                    <label>Statut:</label>
                    <select id="catch-status" onchange="updateCatchRate()">
                        <option value="1">Aucun</option>
                        <option value="1.5">Paralysie / Brûlure / Poison</option>
                        <option value="2.5">Sommeil / Gel</option>
                    </select>
                </div>

                <div style="font-weight:bold; margin-top:10px; display:flex; justify-content:space-between;">
                    <span>Taux: <span id="catch-result" style="color:var(--primary); font-size:1.2em;">0%</span></span>
                    <span id="catch-detail" style="font-size:0.8em; color:var(--text-muted); font-style:italic;"></span>
                </div>
                <div class="calc-result-bar"><div id="catch-bar" class="calc-fill" style="background:#4caf50;"></div></div>
            </div>`;

    let evoHTML = "";
    if (poke.preEvolutions && poke.preEvolutions.length > 0) {
        poke.preEvolutions.slice().reverse().forEach(preName => {
            const prePoke = allPokemon.find(p => p.name === preName) || { img: "", name: preName };
            evoHTML += `<div class="evo-card" onclick="switchToForm('${preName.replace(/'/g, "\\'")}')" style="cursor:pointer; text-align:center; display:inline-block; margin:10px;">
                    <img src="${prePoke.img}" style="width:60px; height:60px; opacity:0.7;">
                    <div style="font-size:0.8em;">${preName}</div>
                    <div style="font-size:0.7em; color:#888;">(Pré-évo)</div>
                </div> <i class="fas fa-chevron-right" style="color:#ccc; vertical-align:middle;"></i> `;
        });
    }
    evoHTML += `<div class="evo-card" style="text-align:center; display:inline-block; margin:10px; border:2px solid #ff3e3e; border-radius:8px; padding:5px;">
            <img src="${poke.img}" style="width:70px; height:70px;">
            <div style="font-weight:bold; font-size:0.9em;">${poke.name}</div>
        </div>`;
    if (poke.evolutions && poke.evolutions.length > 0) {
        poke.evolutions.forEach(evo => {
            const nextName = (evo.to && evo.to.name) ? evo.to.name : (evo.to || "???");
            const nextPoke = allPokemon.find(p => p.name === nextName) || { img: "", name: nextName };
            evoHTML += ` <i class="fas fa-chevron-right" style="color:#ccc; vertical-align:middle;"></i>
                <div class="evo-card" onclick="switchToForm('${nextName.replace(/'/g, "\\'")}')" style="cursor:pointer; text-align:center; display:inline-block; margin:10px;">
                    <img src="${nextPoke.img}" style="width:60px; height:60px;">
                    <div style="font-size:0.8em;">${nextName}</div>
                    <div style="font-size:0.7em; color:#666;">${formatEvolutionCondition(evo)}</div>
                </div>`;
        });
    }
    const specialForms = allPokemon.filter(p => p.parentName === poke.name && (MAIN_TAGS.includes(p.tag) || Object.values(REGION_MAPPING).flat().includes(p.tag) || p.cosmeticTheme));
    if (specialForms.length > 0) {
        evoHTML += `<div style="border-left:2px solid #eee; margin:0 15px; display:inline-block; height:60px; vertical-align:middle;"></div>`;
        specialForms.forEach(form => {
            let icon = '<i class="fas fa-star" style="color:#f1c40f;"></i>';
            if (form.tag === 'Mega') icon = '<i class="fas fa-dna" style="color:#ff9800;"></i>';
            else if (form.tag === 'Gigantamax') icon = '<i class="fas fa-cloud" style="color:#e74c3c;"></i>';
            evoHTML += `<div class="evo-card" onclick="switchToForm('${form.name.replace(/'/g, "\\'")}')" style="cursor:pointer; text-align:center; display:inline-block; margin:10px;">
                    <img src="${form.img}" style="width:60px; height:60px;">
                    <div style="font-size:0.8em; font-weight:bold;">${form.name}</div>
                    <div style="font-size:0.7em;">${icon} ${form.tag}</div>
                </div>`;
        });
    }

    const generalHTML = `
        <div id="tab-general" class="tab-panel active">
            ${backButtonHTML}
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0;">
                    ${poke.name} ${tagHTML} ${tierBadge}
                    <button onclick="toggleShiny('main-img-${poke.id}', '${poke.img}')" style="border:none; background:none; cursor:pointer; font-size:0.6em; vertical-align:middle; margin-left:10px;" title="Voir Shiny">✨</button>
                </h2>
                <button id="btn-add-team" onclick="toggleTeam('${poke.id}')" style="background:#27ae60; color:white; border:none; padding:5px 10px; border-radius:15px; cursor:pointer;">
                    ${myTeam.includes(poke.id) ? '<i class="fas fa-minus"></i> Retirer' : '<i class="fas fa-plus"></i> Ajouter'}
                </button>
            </div>
            <div style="text-align:center; margin:10px 0;">
                <img id="main-img-${poke.id}" src="${poke.img}" style="max-height:150px;">
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:20px; margin-top:15px;">
                <div style="flex:1; min-width:250px;">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.9em; margin-bottom:15px;">
                        <div><strong>Poids:</strong> ${poke.weight}kg</div>
                        <div><strong>Taux Capture:</strong> ${poke.catchRate}</div>
                        <div><strong>Genre:</strong> ${genderHTML}</div>
                        <div><strong>Oeufs:</strong> ${poke.eggGroups.join(', ')}</div>
                    </div>
                    <div style="margin-bottom:10px;"><strong>Capacités:</strong> ${capsHTML}</div>
                    <div style="margin-bottom:10px;">${weakHTML}</div>
                    ${catchRateHTML}
                </div>
            </div>
            ${obtentionHTML}
            ${ingameImageHTML}
            <div class="evo-section" style="border-top:1px solid #eee; padding-top:15px; overflow-x:auto; white-space:nowrap;">
                <h3 style="margin-top:0;">Chaîne Évolutive & Formes</h3>
                ${evoHTML}
            </div>
        </div>`;

    const statsKeys = ["HP", "Attack", "Defence", "SpecialAttack", "SpecialDefence", "Speed"];
        const statLabels = {HP:"HP", Attack:"Attaque", Defence:"Défense", SpecialAttack:"Atk. Spé", SpecialDefence:"Déf. Spé", Speed:"Vitesse"};

        const baseStatsHTML = statsKeys.map(key => {
        const val = poke.stats[key];
                const width = Math.min((val / 255) * 100, 100);

                let barColor = "#2ecc71";

                if (val < 50) {
                    barColor = "#e74c3c";
                } else if (val < 80) {
                    barColor = "#f1c40f";
                } else if (val < 120) {
                    barColor = "#2ecc71";
                } else {
                    barColor = "#3498db";
                }

                return `<div style="display:flex; align-items:center; font-size:0.9em; margin-bottom:5px;">
                    <div style="width:80px; font-weight:bold;">${statLabels[key]}</div>
                    <div style="width:30px;">${val}</div>
                    <div style="flex:1; background:#eee; height:8px; border-radius:4px; overflow:hidden;">
                        <div style="width:${width}%; background:${barColor}; height:100%; border-radius:4px; transition: width 0.5s ease;"></div>
                    </div>
                </div>`;
            }).join('');

    const calcRows = statsKeys.map(key => `<tr><td>${statLabels[key]}</td><td>${poke.stats[key]}</td><td><input type="number" min="0" max="31" value="31" class="calc-iv" data-stat="${key}" oninput="updateCalculator()"></td><td><input type="number" min="0" max="252" value="0" class="calc-ev" data-stat="${key}" oninput="updateCalculator()"></td><td><span id="res-${key}" class="stat-result">0</span></td></tr>`).join('');
    const natureOptions = Object.keys(NATURES).sort().map(n => `<option value="${n}">${n}</option>`).join('');

        let simRows = statsKeys.map(key => `
                <div class="sim-row">
                    <div class="sim-label" id="label-${key}">${statLabels[key].substring(0,3)}</div>
                    <div class="sim-base">${poke.stats[key]}</div>

                    <div class="sim-inputs-group">
                        <span style="font-size:0.7em; color:#888;">IV</span>
                        <input type="number" id="iv-${key}" class="sim-val-input" value="31" min="0" max="31" oninput="updateCalculator()">
                    </div>

                    <div class="sim-inputs-group">
                        <span style="font-size:0.7em; color:#888;">EV</span>
                        <input type="number" id="ev-${key}" class="sim-val-input" value="0" min="0" max="252" step="4" oninput="updateCalculator()">
                    </div>

                    <div class="sim-result" id="res-${key}">0</div>

                    <div class="sim-bar-container">
                        <div class="sim-bar-fill" id="bar-${key}"></div>
                    </div>
                </div>
            `).join('');

        const statsHTML = `
                <div id="tab-stats" class="tab-panel">
                    <h3>Base Stats & Graphique</h3>
                    <div style="display:flex; gap:20px; flex-wrap:wrap;">
                        <div style="flex:1; min-width:300px;">${baseStatsHTML}</div>
                        <div style="flex:1.5; min-width:350px;">
                            <div class="chart-container-large"><canvas id="statChart"></canvas></div>
                        </div>
                    </div>

                    <div class="sim-container">
                        <div class="sim-header">
                            <h3 style="margin:0; border:none; padding:0;"><i class="fas fa-calculator"></i> Simulateur Stratégique</h3>

                            <div class="sim-controls">
                                <div class="sim-control-group" style="flex:1; max-width: 200px;">
                                    <label>Niveau</label>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <input type="range" id="sim-level-slider" min="1" max="100" value="50" oninput="updateCalculator()" style="flex:1; cursor:pointer;">

                                        <input type="number" id="sim-level" class="sim-input" value="50" oninput="updateCalculator()" style="width:60px;">
                                    </div>
                                </div>

                                <div class="sim-control-group" style="flex:1;">
                                    <label>Nature</label>
                                    <select id="sim-nature" class="sim-input" onchange="updateCalculator()" style="width:100%;">
                                        <option value="Hardy">Hardy (Neutre)</option>
                                        ${natureOptions}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="sim-grid">
                            <div style="display:grid; grid-template-columns: 60px 50px 1fr 1fr 70px; font-size:0.8em; color:#888; padding-bottom:5px; text-transform:uppercase; border-bottom:1px solid var(--border); margin-bottom:10px;">
                                <span>Stat</span>
                                <span style="text-align:center;">Base</span>
                                <span style="text-align:center;">IV</span>
                                <span style="text-align:center;">EVs <strong id="ev-total-counter" style="color:#7f8c8d; margin-left:5px;">0 / 510</strong></span>
                                <span style="text-align:right;">Total</span>
                            </div>
                            ${simRows}
                        </div>
                    </div>
                </div>`;

    const makeMoveList = (moves) => {
        if (!moves || moves.length === 0) return '<div style="color:#999; font-style:italic;">Aucune attaque.</div>';
        return `<ul class="moves-list" style="columns:2; padding:0; list-style:none;">${moves.map(m => `<li style="padding:4px 0; border-bottom:1px solid #eee;">${m}</li>`).join('')}</ul>`;
    };
    let levelUpHTML = "Aucune attaque par niveau.";
    if (poke.moves.levelUp && Object.keys(poke.moves.levelUp).length > 0) {
        levelUpHTML = `<table style="width:100%; border-collapse:collapse;">${Object.entries(poke.moves.levelUp).map(([lvl, m]) => `<tr><td style="font-weight:bold; width:50px; border-bottom:1px solid #eee; padding:5px;">Lv ${lvl}</td><td style="border-bottom:1px solid #eee;">${Array.isArray(m) ? m.join(', ') : m}</td></tr>`).join('')}</table>`;
    }
    const movesHTML = `<div id="tab-moves" class="tab-panel"><div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:15px; border-bottom:2px solid #eee; padding-bottom:10px;"><button class="move-cat-btn active" onclick="switchMoveTab('levelup', this)">Niveau</button><button class="move-cat-btn" onclick="switchMoveTab('tm', this)">CT/CS (TM)</button><button class="move-cat-btn" onclick="switchMoveTab('egg', this)">Œuf</button><button class="move-cat-btn" onclick="switchMoveTab('tutor', this)">Maître</button><button class="move-cat-btn" onclick="switchMoveTab('transfer', this)">Transfert</button><button class="move-cat-btn" onclick="switchMoveTab('tr', this)">TR</button><button class="move-cat-btn" onclick="switchMoveTab('hm', this)">CS (HM)</button></div><div id="move-content-levelup" class="move-content active">${levelUpHTML}</div><div id="move-content-tm" class="move-content" style="display:none;">${makeMoveList(poke.moves.tm)}</div><div id="move-content-egg" class="move-content" style="display:none;">${makeMoveList(poke.moves.egg)}</div><div id="move-content-tutor" class="move-content" style="display:none;">${makeMoveList(poke.moves.tutor)}</div><div id="move-content-transfer" class="move-content" style="display:none;">${makeMoveList(poke.moves.transfer)}</div><div id="move-content-tr" class="move-content" style="display:none;">${makeMoveList(poke.moves.tr)}</div><div id="move-content-hm" class="move-content" style="display:none;">${makeMoveList(poke.moves.hm)}</div></div>`;

    const linkedCosmetics = allPokemon.filter(p => p.parentName === poke.name && !['Mega','Gigantamax','Alolan','Galarian','Hisuian','Paldean'].includes(p.tag));
    let cosmeticContentHTML = '';
    if (linkedCosmetics.length > 0) {
        const itemsHTML = linkedCosmetics.map(cosm => {
            const clickAction = `switchToForm('${cosm.name.replace(/'/g, "\\'")}')`;
            return `<div class="card" onclick="${clickAction}" style="width: 150px; display:inline-block; margin:10px; vertical-align:top; border:1px solid #eee; cursor:pointer;"><div class="card-img" style="height:120px;"><img src="${cosm.img}" style="width:80px; height:80px;"></div><div class="card-body" style="padding:10px; text-align:center;"><div style="font-weight:bold; font-size:0.9em;">${cosm.name}</div><div class="form-tag tag-${cosm.tag ? cosm.tag.toLowerCase() : ''}">${cosm.tag || ''}</div>${cosm.cosmeticTheme ? `<div style="font-size:0.7em; color:#888;">${cosm.cosmeticTheme}</div>` : ''}</div></div>`;
        }).join('');
        cosmeticContentHTML = `<div id="tab-cosmetics" class="tab-panel"><h3>Cosmétiques</h3><div style="display:flex; flex-wrap:wrap;">${itemsHTML}</div></div>`;
    }

    setTimeout(() => {
        const navContainer = document.querySelector('.modal-nav');
        const oldBtn = navContainer.querySelector('[data-target="tab-cosmetics"]');
        if(oldBtn) oldBtn.remove();
        if (linkedCosmetics.length > 0) {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.dataset.target = 'tab-cosmetics';
            btn.innerText = `Cosmétiques (${linkedCosmetics.length})`;
            btn.onclick = (e) => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                document.getElementById('tab-cosmetics').classList.add('active');
            };
            navContainer.appendChild(btn);
        }
    }, 0);

    setTimeout(() => updateCatchRate(), 100);

    return generalHTML + statsHTML + movesHTML + cosmeticContentHTML;
}

// --- SYSTÈME DE ZOOM D'IMAGE ---
function openImageZoom(src) {
    let overlay = document.getElementById('zoom-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'zoom-overlay';
        overlay.className = 'zoom-overlay';
        overlay.onclick = closeImageZoom;

        overlay.innerHTML = `
            <img id="zoom-img-content" class="zoom-img">
            <div class="zoom-close-hint">Cliquer pour fermer</div>
        `;
        document.body.appendChild(overlay);
    }

    const imgElement = document.getElementById('zoom-img-content');
    imgElement.src = src;
    overlay.style.display = 'flex';
}

function closeImageZoom() {
    const overlay = document.getElementById('zoom-overlay');
    if (overlay) overlay.style.display = 'none';
}

document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") closeImageZoom();
});

// --- LOGIQUE CALCUL CAPTURE ---
function updateCatchRate() {
    if(!currentPokemon) return;

    const ballType = document.getElementById('catch-ball').value;
    const hpPercent = parseInt(document.getElementById('catch-hp').value);
    const statusMult = parseFloat(document.getElementById('catch-status').value);

    const isNight = document.getElementById('chk-night').checked;
    const isWaterContext = document.getElementById('chk-water').checked; 
    const isTurn1 = document.getElementById('chk-turn1').checked;
    const isCaught = document.getElementById('chk-caught').checked;
    const targetLevel = parseInt(document.getElementById('lvl-val').value) || 50;

    document.getElementById('catch-hp-val').innerText = hpPercent + "%";

    let ballMult = 1;
    let baseRate = currentPokemon.catchRate;
    let detailText = "";

    switch(ballType) {
        case 'master': ballMult = 255; break; 
        case 'poke': ballMult = 1; break;
        case 'great': ballMult = 1.5; break;
        case 'ultra': ballMult = 2; break;
        case 'safari': ballMult = 1.5; break;

        case 'net':
            if(currentPokemon.types.includes("Water") || currentPokemon.types.includes("Bug")) {
                ballMult = 3.5; detailText = "Bonus Type (Eau/Insecte) !";
            } else ballMult = 1;
            break;

        case 'dusk':
            if(isNight) { ballMult = 3; detailText = "Bonus Nuit/Grotte !"; }
            else ballMult = 1;
            break;

        case 'quick':
            if(isTurn1) { ballMult = 5; detailText = "Bonus Tour 1 !"; }
            else ballMult = 1;
            break;

        case 'repeat':
            if(isCaught) { ballMult = 3.5; detailText = "Bonus Déjà Capturé !"; }
            else ballMult = 1;
            break;

        case 'dive':
            if(isWaterContext) { ballMult = 3.5; detailText = "Bonus Eau !"; }
            else ballMult = 1;
            break;

        case 'nest':
            if(targetLevel < 30) {
                ballMult = Math.max(1, (41 - targetLevel) / 10);
                detailText = `Bonus Niveau Faible (x${ballMult.toFixed(1)})`;
            } else ballMult = 1;
            break;

        case 'heavy':
            const w = currentPokemon.weight;
            let modifier = 0;
            if(w < 100) modifier = -20;
            else if(w >= 200 && w < 300) modifier = 20;
            else if(w >= 300) modifier = 30;

            baseRate += modifier;
            if(baseRate < 1) baseRate = 1;

            detailText = `Poids ${w}kg : Modif ${modifier > 0 ? '+' : ''}${modifier}`;
            ballMult = 1;
            break;

        case 'fast':
            if(currentPokemon.stats.Speed >= 100) {
                ballMult = 4; detailText = "Bonus Vitesse !";
            } else ballMult = 1;
            break;

        case 'lure':
             if(isWaterContext) { ballMult = 4; detailText = "Bonus Pêche !"; }
             else ballMult = 1;
             break;

        case 'dream':
             if(statusMult > 2) { 
                 ballMult = 4; detailText = "Bonus Sommeil !";
             } else ballMult = 1;
             break;

        case 'beast':
             if(currentPokemon.tag === "UltraBeast") {
                 ballMult = 5; detailText = "Bonus Ultra-Chimère !";
             } else {
                 ballMult = 0.1; detailText = "Malus (Pas une UC)";
             }
             break;

        default: ballMult = 1;
    }

    if (ballMult >= 255) {
        document.getElementById('catch-result').innerText = "100%";
        document.getElementById('catch-bar').style.width = "100%";
        document.getElementById('catch-bar').style.background = "#2ecc71";
        document.getElementById('catch-detail').innerText = "Capture Certaine";
        return;
    }

    let a = ((300 - (2 * hpPercent)) * baseRate * ballMult) / 300 * statusMult;
    let probability = (a / 255) * 100;
    if (probability > 100) probability = 100;

    document.getElementById('catch-result').innerText = probability.toFixed(1) + "%";
    document.getElementById('catch-detail').innerText = detailText;

    const bar = document.getElementById('catch-bar');
    bar.style.width = probability + "%";
    if(probability < 10) bar.style.background = "#c0392b";
    else if(probability < 30) bar.style.background = "#e74c3c";
    else if(probability < 60) bar.style.background = "#f1c40f";
    else bar.style.background = "#2ecc71";
}

function updateCalculator() {
    const levelInput = document.getElementById('sim-level');
    const levelSlider = document.getElementById('sim-level-slider');
    let level = 50;

    if (document.activeElement === levelInput) {
        let val = parseInt(levelInput.value);
        if (isNaN(val)) val = 50;

        if (val > 100) { val = 100; levelInput.value = 100; }
        if (val < 1) { val = 1; }

        level = val;
        levelSlider.value = level;
    }
    else if (document.activeElement === levelSlider) {
        level = parseInt(levelSlider.value);
        levelInput.value = level; 
    }
    else {
        level = parseInt(levelSlider.value) || 50;
    }

    const natureName = document.getElementById('sim-nature').value;
    const nature = NATURES[natureName] || {};
    const stats = ["HP", "Attack", "Defence", "SpecialAttack", "SpecialDefence", "Speed"];

    let currentTotalEVs = 0;

    stats.forEach(stat => {
        const val = parseInt(document.getElementById(`ev-${stat}`).value) || 0;
        currentTotalEVs += val;
    });

    if (currentTotalEVs > 510) {
        const activeInput = document.activeElement;
        if (activeInput && activeInput.classList.contains('sim-val-input') && activeInput.id.startsWith('ev-')) {
            const currentVal = parseInt(activeInput.value) || 0;
            const excess = currentTotalEVs - 510;
            const newVal = Math.max(0, currentVal - excess);

            activeInput.value = newVal;
            currentTotalEVs = 510;
        }
    }

    const evCounter = document.getElementById('ev-total-counter');
    if (evCounter) {
        evCounter.innerText = `${currentTotalEVs} / 510`;
        if (currentTotalEVs >= 510) evCounter.style.color = '#e74c3c'; 
        else if (currentTotalEVs > 0) evCounter.style.color = '#27ae60'; 
        else evCounter.style.color = '#7f8c8d'; 
    }

    stats.forEach(stat => {
        const base = currentPokeStats[stat];
        const iv = parseInt(document.getElementById(`iv-${stat}`).value) || 0;
        const ev = parseInt(document.getElementById(`ev-${stat}`).value) || 0;

        let result = 0;

        if (stat === 'HP') {
            if (base === 1) result = 1;
            else result = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
        } else {
            let val = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
            if (nature.pos === stat) val = Math.floor(val * 1.1);
            if (nature.neg === stat) val = Math.floor(val * 0.9);
            result = val;
        }

        const resEl = document.getElementById(`res-${stat}`);
        resEl.innerText = result;

        const rowLabel = document.getElementById(`label-${stat}`);
        rowLabel.classList.remove('nature-plus', 'nature-minus');
        if(nature.pos === stat) {
            rowLabel.classList.add('nature-plus');
            resEl.style.color = '#27ae60';
            resEl.innerText += "+";
        } else if(nature.neg === stat) {
            rowLabel.classList.add('nature-minus');
            resEl.style.color = '#e74c3c';
            resEl.innerText += "-";
        } else {
            resEl.style.color = '';
        }

        const bar = document.getElementById(`bar-${stat}`);

                const maxScale = (level * 4) + 10;

                        const percent = Math.min((result / maxScale) * 100, 100);
                        bar.style.width = percent + "%";

                        if (percent < 20) {
                            bar.style.backgroundColor = "#e74c3c";
                        } else if (percent < 45) {
                            bar.style.backgroundColor = "#f1c40f"; 
                        } else {
                            bar.style.backgroundColor = "#2ecc71";
                        }

                        if (percent >= 95) {
                             bar.style.backgroundColor = "#3498db";
                        }
                    });
                }

function switchToForm(pokemonName) {
    const target = allPokemon.find(p => p.name === pokemonName);
    if (target) {
        openModal(target);
        setTimeout(() => document.querySelector('[data-target="tab-general"]')?.click(), 50);
    }
}

function closeModal() { document.getElementById('modal').classList.remove('active'); }

function showImagePopup(imgUrl, title) {
    const popup = document.getElementById('image-popup');
    document.getElementById('popup-img').src = imgUrl;
    document.getElementById('popup-title').innerText = title;
    popup.style.display = 'flex';
    setTimeout(() => popup.classList.add('active'), 10);
}

function closeImagePopup() {
    const popup = document.getElementById('image-popup');
    popup.classList.remove('active');
    setTimeout(() => popup.style.display = 'none', 300);
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(e.target.dataset.target).classList.add('active');
    });
});
document.getElementById('modal').addEventListener('click', (e) => {
    if(e.target.id === 'modal') closeModal();
});

document.getElementById('sort-select').addEventListener('change', applyFilters);
document.getElementById('sidebar-search').addEventListener('input', applyFilters);

function generateStatFilters() {
    const container = document.getElementById('stats-filters');
    const stats = ["HP", "Attack", "Defence", "SpecialAttack", "SpecialDefence", "Speed"];
    const shortNames = {HP:"HP", Attack:"Atk", Defence:"Def", SpecialAttack:"SpA", SpecialDefence:"SpD", Speed:"Vit"};
    container.innerHTML = stats.map(s => `
        <div class="stat-filter-row">
            <label>${shortNames[s]}</label>
            <input type="number" class="stat-input min" data-stat="${s}" placeholder="0"> -
            <input type="number" class="stat-input max" data-stat="${s}" placeholder="255">
        </div>
    `).join('');
    document.querySelectorAll('.stat-input').forEach(i => i.addEventListener('input', applyFilters));
}

function generateCheckboxes(list, containerId, className) {
    document.getElementById(containerId).innerHTML = list.map(item => `
        <label class="checkbox-label"><input type="checkbox" value="${item}" class="filter-${className}"> ${item}</label>
    `).join('');
    document.querySelectorAll(`.filter-${className}`).forEach(cb => cb.addEventListener('change', applyFilters));
}

// Lancement
initData();