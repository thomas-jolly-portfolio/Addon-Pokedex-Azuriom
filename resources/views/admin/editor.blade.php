@extends('admin.layouts.admin')

@section('title', 'Éditeur Pokédex Ultimate')

@push('styles')
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --primary: #3b82f6; --secondary: #1e293b; --accent: #8b5cf6;
            --success: #10b981; --danger: #ef4444; --warning: #f59e0b;
            --light: #f1f5f9; --border: #e2e8f0; --text: #334155;
        }

        /* --- LAYOUT GLOBAL --- */
        .editor-wrapper { display: flex; height: 85vh; background: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden; font-family: 'Inter', sans-serif; }
        
        /* SIDEBAR */
        .sidebar { width: 300px; background: var(--secondary); color: #94a3b8; display: flex; flex-direction: column; border-right: 1px solid #334155; }
        .sidebar-header { padding: 20px; background: rgba(0,0,0,0.2); border-bottom: 1px solid #334155; }
        .sidebar-title { color: white; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .search-container { padding: 15px; }
        .search-input { width: 100%; background: #0f172a; border: 1px solid #334155; padding: 10px; border-radius: 6px; color: white; outline: none; transition: 0.2s; }
        .search-input:focus { border-color: var(--primary); }
        
        .file-list { flex: 1; overflow-y: auto; list-style: none; padding: 0; margin: 0; }
        .file-item { padding: 12px 20px; cursor: pointer; border-bottom: 1px solid #334155; font-size: 0.9em; transition: 0.2s; display: flex; justify-content: space-between; align-items: center; }
        .file-item:hover { background: #334155; color: white; }
        .file-item.active { background: var(--primary); color: white; border-left: 4px solid white; }
        .badge-id { font-family: monospace; opacity: 0.6; font-size: 0.85em; }

        /* MAIN AREA */
        .main-content { flex: 1; display: flex; flex-direction: column; background: #f8fafc; overflow: hidden; position: relative; }
        
        /* TOOLBAR */
        .toolbar { padding: 15px 30px; background: white; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .current-info h1 { margin: 0; font-size: 1.5rem; color: var(--secondary); font-weight: 800; }
        .current-info span { color: #64748b; font-size: 0.9em; }

        /* TABS */
        .tabs-nav { display: flex; padding: 0 30px; background: white; border-bottom: 1px solid var(--border); gap: 20px; }
        .tab-btn { background: none; border: none; padding: 15px 5px; cursor: pointer; color: #64748b; font-weight: 600; border-bottom: 3px solid transparent; transition: 0.2s; font-size: 0.95em; }
        .tab-btn:hover { color: var(--primary); }
        .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }

        /* FORM CONTENT */
        .editor-form { flex: 1; overflow-y: auto; padding: 30px; }
        .tab-pane { display: none; animation: fadeIn 0.3s; }
        .tab-pane.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        /* CARDS & INPUTS */
        .card { background: white; border-radius: 8px; padding: 25px; border: 1px solid var(--border); margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .card-header { font-size: 1.1em; font-weight: 700; color: var(--secondary); margin-bottom: 20px; border-bottom: 2px solid var(--light); padding-bottom: 10px; display: flex; align-items: center; gap: 10px; }
        
        .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .form-group { margin-bottom: 15px; }
        .form-label { display: block; font-weight: 600; margin-bottom: 8px; color: #475569; font-size: 0.9em; }
        .form-control { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 6px; font-size: 0.95em; transition: 0.2s; background: #fff; }
        .form-control:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        
        /* TYPES SELECTOR */
        .type-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
        .type-badge { text-align: center; padding: 6px; font-size: 0.8em; border-radius: 4px; cursor: pointer; border: 2px solid transparent; opacity: 0.5; font-weight: bold; color: white; text-transform: uppercase; transition: 0.2s; }
        .type-badge:hover { opacity: 0.8; transform: scale(1.05); }
        .type-badge.selected { opacity: 1; border-color: #333; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transform: scale(1.1); }

        /* STATS SLIDERS */
        .stat-row { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
        .stat-label { width: 50px; font-weight: bold; color: #64748b; font-size: 0.85em; text-transform: uppercase; }
        .stat-input { width: 70px; text-align: center; font-weight: bold; }
        .stat-slider { flex: 1; height: 8px; border-radius: 4px; background: #e2e8f0; appearance: none; cursor: pointer; }
        .stat-slider::-webkit-slider-thumb { appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--primary); border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }

        /* DROPS & LISTS */
        .list-item-row { display: flex; gap: 10px; margin-bottom: 8px; align-items: center; }
        .btn-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: none; cursor: pointer; transition: 0.2s; }
        .btn-add { background: var(--success); color: white; }
        .btn-remove { background: var(--danger); color: white; }
        .btn-icon:hover { opacity: 0.9; transform: translateY(-1px); }

        /* IMAGES */
        .img-upload-zone { border: 2px dashed var(--border); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; transition: 0.2s; background: #f8fafc; }
        .img-upload-zone:hover { border-color: var(--primary); background: #eff6ff; }
        .preview-img { max-height: 100px; display: block; margin: 10px auto; object-fit: contain; }

        /* UTILS */
        .btn-save { background: var(--success); color: white; border: none; padding: 10px 25px; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .btn-save:hover { background: #059669; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); }
        .text-muted { color: #94a3b8; font-size: 0.9em; }
        
        /* Type Colors */
        .bg-Normal { background-color: #A8A77A; } .bg-Fire { background-color: #EE8130; } .bg-Water { background-color: #6390F0; } .bg-Electric { background-color: #F7D02C; } .bg-Grass { background-color: #7AC74C; } .bg-Ice { background-color: #96D9D6; } .bg-Fighting { background-color: #C22E28; } .bg-Poison { background-color: #A33EA1; } .bg-Ground { background-color: #E2BF65; } .bg-Flying { background-color: #A98FF3; } .bg-Psychic { background-color: #F95587; } .bg-Bug { background-color: #A6B91A; } .bg-Rock { background-color: #B6A136; } .bg-Ghost { background-color: #735797; } .bg-Dragon { background-color: #6F35FC; } .bg-Steel { background-color: #B7B7CE; } .bg-Dark { background-color: #705746; } .bg-Fairy { background-color: #D685AD; }
    </style>
@endpush

@section('content')
<div class="editor-wrapper">
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="sidebar-title"><i class="fas fa-shapes"></i> Pokédex Editor <span class="badge badge-primary" style="font-size:0.7em; background:var(--primary); padding:2px 6px; border-radius:4px;">PRO</span></div>
            <button onclick="createNewFile()" class="btn btn-primary w-100" style="width:100%; background:var(--primary); border:none; padding:8px; color:white; border-radius:4px; cursor:pointer;"><i class="fas fa-plus"></i> Nouveau</button>
        </div>
        <div class="search-container">
            <input type="text" id="searchInput" class="search-input" placeholder="Rechercher (Nom, ID)..." oninput="filterFiles()">
        </div>
        <ul class="file-list custom-scroll" id="file-list-ul">
            </ul>
    </aside>

    <main class="main-content">
        <div class="toolbar">
            <div class="current-info">
                <h1 id="header-name">Sélectionnez un Pokémon</h1>
                <span id="header-id">--</span>
            </div>
            <button onclick="saveData()" class="btn-save"><i class="fas fa-save"></i> SAUVEGARDER</button>
        </div>

        <div class="tabs-nav">
            <button class="tab-btn active" onclick="switchTab('general')"><i class="fas fa-info-circle"></i> Général</button>
            <button class="tab-btn" onclick="switchTab('stats')"><i class="fas fa-chart-bar"></i> Statistiques</button>
            <button class="tab-btn" onclick="switchTab('breeding')"><i class="fas fa-egg"></i> Élevage & Évo</button>
            <button class="tab-btn" onclick="switchTab('drops')"><i class="fas fa-gift"></i> Drops & Spawn</button>
            <button class="tab-btn" onclick="switchTab('assets')"><i class="fas fa-images"></i> Images & Formes</button>
        </div>

        <div class="editor-form custom-scroll" id="form-container">
            <div class="text-center" style="margin-top:100px; color:#cbd5e1;">
                <i class="fas fa-mouse-pointer fa-3x mb-4"></i>
                <h3>Cliquez sur un fichier à gauche pour commencer l'édition</h3>
            </div>
        </div>
    </main>
</div>

<div id="toast" style="position: fixed; bottom: 30px; right: 30px; background: #10b981; color: white; padding: 12px 25px; border-radius: 50px; display: none; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); font-weight:bold; align-items:center; gap:10px; z-index:9999;">
    <i class="fas fa-check-circle"></i> Modifications enregistrées !
</div>
@endsection

@push('footer-scripts')
<script>
    // --- CONFIG ---
    const TYPES = ["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Steel","Dark","Fairy"];
    const STATS = ["HP","Attack","Defence","SpecialAttack","SpecialDefence","Speed"];
    
    // --- STATE ---
    let files = [];
    let fullJsonData = null; // Whole JSON (base + forms)
    let currentData = null;  // Data of current form being edited
    let currentFilename = null;
    let currentFormKey = 'base'; // 'base' or form name (e.g., 'mega')

    const API = {
        list: "{{ route('pokedex.admin.editor.list') }}",
        load: "{{ route('pokedex.admin.editor.load', ':id') }}".replace(':id', ''), 
        save: "{{ route('pokedex.admin.editor.save', ':id') }}".replace(':id', ''),
        upload: "{{ route('pokedex.admin.editor.upload') }}"
    };

    // --- INITIALIZATION ---
    async function loadFileList() {
        try {
            const res = await fetch(API.list);
            files = await res.json();
            renderFileList(files);
        } catch(e) { console.error("Error list", e); }
    }

    function renderFileList(list) {
        const ul = document.getElementById('file-list-ul');
        ul.innerHTML = list.map(f => `
            <li class="file-item" onclick="loadFile('${f}')" id="file-${f.replace('.','-')}">
                <div>
                    <div style="font-weight:bold;">${f.replace('.json','')}</div>
                    <div class="badge-id">${f}</div>
                </div>
                <i class="fas fa-chevron-right" style="opacity:0.3;"></i>
            </li>
        `).join('');
    }

    function filterFiles() {
        const term = document.getElementById('searchInput').value.toLowerCase();
        renderFileList(files.filter(f => f.toLowerCase().includes(term)));
    }

    // --- LOAD & RENDER ---
    async function loadFile(filename) {
        // Active UI
        document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
        const activeItem = document.getElementById(`file-${filename.replace('.','-')}`);
        if(activeItem) activeItem.classList.add('active');

        currentFilename = filename;
        currentFormKey = 'base'; // Reset to base
        
        try {
            const res = await fetch(API.load + filename);
            const raw = await res.json();
            
            // Store full JSON data
            fullJsonData = Array.isArray(raw) ? raw[0] : raw;
            
            // Initialize currentData with base
            currentData = fullJsonData;
            
            updateHeader();
            renderEditor();
        } catch(e) { 
            console.error(e);
            alert("Error loading JSON"); 
        }
    }

    function updateHeader() {
        const baseName = fullJsonData.name || fullJsonData.pixelmonName || 'No Name';
        const formSuffix = currentFormKey !== 'base' ? ` (${currentFormKey})` : '';
        
        document.getElementById('header-name').innerText = baseName + formSuffix;
        document.getElementById('header-id').innerText = `ID: ${fullJsonData.pixelmonName} | File: ${currentFilename}`;
    }

    function switchForm(formKey) {
        // Save current form data to global object
        saveCurrentFormToGlobal();

        currentFormKey = formKey;

        if (formKey === 'base') {
            currentData = fullJsonData;
        } else {
            if (!fullJsonData.forms) fullJsonData.forms = {};
            if (!fullJsonData.forms[formKey]) {
                // Create new empty form based on base
                fullJsonData.forms[formKey] = { ...fullJsonData, forms: undefined, pixelmonName: fullJsonData.pixelmonName };
            }
            currentData = fullJsonData.forms[formKey];
        }
        
        updateHeader();
        renderEditor();
    }

    function saveCurrentFormToGlobal() {
        if (currentFormKey === 'base') {
            Object.assign(fullJsonData, currentData);
        } else {
            if (!fullJsonData.forms) fullJsonData.forms = {};
            fullJsonData.forms[currentFormKey] = currentData;
        }
    }

    function addForm() {
        const formName = prompt("Form name (e.g: mega, gmax, alolan) :");
        if (formName) switchForm(formName);
    }

    function renderEditor() {
        const c = document.getElementById('form-container');
        const imgPath = '/assets/plugins/pokedex/data/sprites/';
        
        // --- FORMS SELECTOR ---
        let formsHtml = `<div class="card mb-3"><div class="card-header"><i class="fas fa-shapes"></i> Formes & Variantes</div><div class="d-flex gap-2 flex-wrap">`;
        formsHtml += `<button class="btn btn-sm ${currentFormKey === 'base' ? 'btn-primary' : 'btn-outline-primary'}" onclick="switchForm('base')">Base</button>`;
        
        if (fullJsonData.forms) {
            Object.keys(fullJsonData.forms).forEach(k => {
                if (k === '0') return; // Skip default redundant key
                formsHtml += `<button class="btn btn-sm ${currentFormKey === k ? 'btn-primary' : 'btn-outline-primary'}" onclick="switchForm('${k}')">${k}</button>`;
            });
        }
        formsHtml += `<button class="btn btn-sm btn-success" onclick="addForm()"><i class="fas fa-plus"></i></button></div></div>`;


        // --- 1. GENERAL TAB ---
        let html = formsHtml;
        
        html += `<div id="tab-general" class="tab-pane active">
            <div class="card">
                <div class="card-header"><i class="fas fa-id-card"></i> Identité</div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Nom Interne (Pixelmon ID)</label>
                        <input type="text" class="form-control" value="${currentData.pixelmonName || ''}" onchange="updateField('pixelmonName', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nom Affiché (Français)</label>
                        <input type="text" class="form-control" value="${currentData.name || ''}" onchange="updateField('name', this.value)">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Numéro Pokédex</label>
                        <input type="number" class="form-control" value="${currentData.pokedexId || 0}" onchange="updateField('pokedexId', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tag Spécial (Legendary, etc)</label>
                        <input type="text" class="form-control" value="${currentData.formType || ''}" onchange="updateField('formType', this.value)" placeholder="Ex: Legendary, UltraBeast...">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Description / Obtention</label>
                    <textarea class="form-control" rows="3" onchange="updateField('obtention', this.value)">${currentData.obtention || ''}</textarea>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><i class="fas fa-fire"></i> Types</div>
                <div class="type-grid">
                    ${TYPES.map(t => {
                        const isSelected = (currentData.types || []).includes(t);
                        return `<div class="type-badge bg-${t} ${isSelected ? 'selected' : ''}" onclick="toggleType('${t}', this)">${t}</div>`;
                    }).join('')}
                </div>
            </div>
        </div>`;

        // --- 2. STATS TAB ---
        html += `<div id="tab-stats" class="tab-pane">
            <div class="card">
                <div class="card-header"><i class="fas fa-chart-line"></i> Stats de Base</div>
                ${STATS.map(s => {
                    const val = currentData.stats ? (currentData.stats[s] || 0) : 0;
                    return `<div class="stat-row">
                        <span class="stat-label">${s.substring(0,3)}</span>
                        <input type="range" class="stat-slider" min="1" max="255" value="${val}" oninput="syncStat('${s}', this.value)">
                        <input type="number" class="stat-input form-control" id="stat-val-${s}" value="${val}" onchange="syncStat('${s}', this.value, true)">
                    </div>`;
                }).join('')}
            </div>
            <div class="card">
                <div class="card-header"><i class="fas fa-crosshairs"></i> Capture & Genre</div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Taux de Capture (0-255)</label>
                        <input type="number" class="form-control" value="${currentData.catchRate || 45}" onchange="updateField('catchRate', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pourcentage Mâle (-1 = Asexué)</label>
                        <input type="number" class="form-control" value="${currentData.malePercent ?? 50}" onchange="updateField('malePercent', parseInt(this.value))">
                    </div>
                </div>
            </div>
        </div>`;

        // --- 3. BREEDING TAB (ENHANCED) ---
        html += `<div id="tab-breeding" class="tab-pane">
            <div class="card">
                <div class="card-header"><i class="fas fa-dna"></i> Évolution & Œufs</div>
                
                <div class="form-group">
                    <label class="form-label">Pré-Évolutions</label>
                    <div id="pre-evo-list">
                        ${(currentData.preEvolutions || []).map((ev, i) => `
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" value="${ev}" onchange="updateArrayItem('preEvolutions', ${i}, this.value)">
                                <button class="btn btn-danger" onclick="removeArrayItem('preEvolutions', ${i})"><i class="fas fa-trash"></i></button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-sm btn-success" onclick="addArrayItem('preEvolutions')"><i class="fas fa-plus"></i> Ajouter Pré-évo</button>
                </div>

                <div class="form-group mt-3">
                    <label class="form-label">Évolutions (Suivantes)</label>
                    <div id="evo-list">
                        ${(currentData.evolutions || []).map((ev, i) => {
                            const evoName = typeof ev === 'string' ? ev : (ev.to ? (ev.to.name || ev.to) : 'Inconnu');
                            return `
                            <div class="input-group mb-2">
                                <span class="input-group-text">Vers</span>
                                <input type="text" class="form-control" value="${evoName}" disabled title="Édition complexe non supportée">
                                <button class="btn btn-danger" onclick="removeArrayItem('evolutions', ${i})"><i class="fas fa-trash"></i></button>
                            </div>`;
                        }).join('')}
                        <button class="btn btn-sm btn-success mt-1" onclick="addSimpleEvolution()"><i class="fas fa-plus"></i> Ajouter Évo Simple</button>
                        <small class="text-muted d-block mt-1">Note: Pour des conditions complexes (level, item), modifiez le JSON manuellement.</small>
                    </div>
                </div>

                <div class="form-group mt-3">
                    <label class="form-label">Groupes d'Œuf</label>
                    <input type="text" class="form-control" value="${(currentData.eggGroups || []).join(', ')}" onchange="updateArray('eggGroups', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Cycles d'Œuf (Pas)</label>
                    <input type="number" class="form-control" value="${currentData.eggCycles || 20}" onchange="updateField('eggCycles', parseInt(this.value))">
                </div>
            </div>
        </div>`;

        // --- 4. DROPS TAB (NEW) ---
        html += `<div id="tab-drops" class="tab-pane">
            <div class="card">
                <div class="card-header"><i class="fas fa-gift"></i> Drops (Loots)</div>
                <div id="drops-list">
                    ${(currentData.drops || []).map((d, i) => `
                        <div class="list-item-row">
                            <input type="text" class="form-control" placeholder="Item (ex: minecraft:bone)" value="${d.item}" onchange="updateDrop(${i}, 'item', this.value)">
                            <input type="number" class="form-control" placeholder="Qté" style="width:80px" value="${d.quantity || 1}" onchange="updateDrop(${i}, 'quantity', parseInt(this.value))">
                            <input type="number" class="form-control" placeholder="%" style="width:80px" value="${d.chance || 100}" onchange="updateDrop(${i}, 'chance', parseInt(this.value))">
                            <button class="btn-icon btn-remove" onclick="removeDrop(${i})"><i class="fas fa-trash"></i></button>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-save w-100 mt-2" style="justify-content:center; background:#64748b;" onclick="addDrop()"><i class="fas fa-plus"></i> Ajouter un Drop</button>
            </div>
        </div>`;

        // --- 5. ASSETS TAB (CORRIGÉ AVEC UPLOAD) ---
        html += `<div id="tab-assets" class="tab-pane">
            <div class="card"><div class="card-header"><i class="fas fa-images"></i> Images</div>
                <div class="form-row">
                    <div><label class="form-label">Sprite 2D</label>
                        <div class="img-upload-zone" onclick="document.getElementById('file-sprite').click()">
                            ${currentData.customImage ? `<img src="${imgPath}${currentData.customImage}" class="preview-img">` : '<i class="fas fa-cloud-upload-alt fa-2x text-muted"></i><br>Cliquez pour upload'}
                            <input type="file" id="file-sprite" hidden onchange="uploadImage(this, 'customImage')">
                        </div>
                        ${currentData.customImage ? `<button class="btn btn-sm btn-danger w-100 mt-2" onclick="updateField('customImage', null); renderEditor();">Supprimer</button>` : ''}
                    </div>
                    <div><label class="form-label">Aperçu 3D</label>
                        <div class="img-upload-zone" onclick="document.getElementById('file-ingame').click()">
                            ${currentData.ingameImage ? `<img src="${imgPath}${currentData.ingameImage}" class="preview-img">` : '<i class="fas fa-cloud-upload-alt fa-2x text-muted"></i><br>Cliquez pour upload'}
                            <input type="file" id="file-ingame" hidden onchange="uploadImage(this, 'ingameImage')">
                        </div>
                        ${currentData.ingameImage ? `<button class="btn btn-sm btn-danger w-100 mt-2" onclick="updateField('ingameImage', null); renderEditor();">Supprimer</button>` : ''}
                    </div>
                </div>
            </div>
        </div>`;

        c.innerHTML = html;
        
        // Restore active tab
        const activeTabBtn = document.querySelector('.tab-btn.active');
        if(activeTabBtn) {
            const tabName = activeTabBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
            switchTab(tabName);
        }
    }

    // --- LOGIC FUNCTIONS (CORRIGÉE) ---
    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        const pane = document.getElementById(`tab-${tabName}`);
        if(pane) pane.classList.add('active');

        const btn = document.querySelector(`.tab-btn[onclick*="'${tabName}'"]`) || 
                    document.querySelector(`.tab-btn[onclick*='"${tabName}"']`);
        if(btn) btn.classList.add('active');
    }

    function updateField(key, val) { currentData[key] = val; }
    
    function updateArray(key, str) { 
        currentData[key] = str.split(',').map(s => s.trim()).filter(s => s); 
    }

    // NOUVELLES FONCTIONS POUR TABLEAUX (Pré-evos)
    function addArrayItem(key) {
        if (!currentData[key]) currentData[key] = [];
        currentData[key].push("Nouveau");
        renderEditor();
    }
    
    function addSimpleEvolution() {
        const nextPoke = prompt("Nom du Pokémon (ex: Ivysaur) :");
        if(!nextPoke) return;
        if (!currentData.evolutions) currentData.evolutions = [];
        // Add simple string evolution. User can edit JSON for more complex ones.
        currentData.evolutions.push(nextPoke);
        renderEditor();
    }

    function removeArrayItem(key, index) {
        if (currentData[key]) {
            currentData[key].splice(index, 1);
            renderEditor();
        }
    }
    function updateArrayItem(key, index, value) {
        if (currentData[key]) currentData[key][index] = value;
    }

    function toggleType(type, el) {
        if(!currentData.types) currentData.types = [];
        if(currentData.types.includes(type)) {
            currentData.types = currentData.types.filter(t => t !== type);
            el.classList.remove('selected');
        } else {
            if(currentData.types.length >= 2) return alert("Max 2 types !");
            currentData.types.push(type);
            el.classList.add('selected');
        }
    }

    function syncStat(stat, val, fromInput = false) {
        if(!currentData.stats) currentData.stats = {};
        currentData.stats[stat] = parseInt(val);
        if(!fromInput) document.getElementById(`stat-val-${stat}`).value = val;
        else {
            const slider = document.querySelector(`#tab-stats input[oninput="syncStat('${stat}', this.value)"]`);
            if(slider) slider.value = val;
        }
    }

    // --- DROPS LOGIC ---
    function addDrop() {
        if(!currentData.drops) currentData.drops = [];
        currentData.drops.push({ item: "", quantity: 1, chance: 100 });
        renderEditor(); 
        switchTab('drops'); 
    }
    function updateDrop(idx, field, val) { currentData.drops[idx][field] = val; }
    function removeDrop(idx) {
        currentData.drops.splice(idx, 1);
        renderEditor();
        switchTab('drops');
    }

    // --- UPLOAD ---
    async function uploadImage(input, field) {
        const file = input.files[0]; if(!file) return;
        
        const zone = input.parentElement;
        const oldContent = zone.innerHTML;
        zone.innerHTML = '<i class="fas fa-spinner fa-spin fa-2x"></i> Upload...';

        const formData = new FormData(); 
        formData.append('file', file);
        
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (!metaToken) {
            alert("ERREUR CRITIQUE : CSRF Token Manquant");
            zone.innerHTML = oldContent;
            return;
        }
        const csrfToken = metaToken.getAttribute('content');

        try {
            const res = await fetch(API.upload, { 
                method: 'POST', 
                headers: { 'X-CSRF-TOKEN': csrfToken },
                body: formData 
            });

            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch(jsonError) {
                console.error("Réponse serveur non-JSON :", text);
                alert("Erreur Serveur Upload");
                zone.innerHTML = oldContent;
                return;
            }
            
            if(data.status === 'success') {
                currentData[field] = data.filename;
                renderEditor(); 
                switchTab('assets'); 
            } else {
                alert("Erreur upload: " + (data.error || 'Inconnue'));
                zone.innerHTML = oldContent;
            }
        } catch(e) { 
            console.error(e); 
            alert("Erreur technique"); 
            zone.innerHTML = oldContent; 
        }
    }

    // --- SAVE ---
    async function saveData() {
        if(!currentFilename) return;
        
        // Ensure current form data is saved to global object
        saveCurrentFormToGlobal();

        const btn = document.querySelector('.btn-save');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...';
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            // Backend expects an array with the data
            const payload = { data: [fullJsonData] };

            const res = await fetch(API.save + currentFilename, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
                body: JSON.stringify(payload) 
            });
            const resJson = await res.json();
            if(resJson.status === 'success') {
                const t = document.getElementById('toast');
                t.style.display = 'flex';
                setTimeout(() => t.style.display = 'none', 3000);
            } else { alert("Erreur serveur sauvegarde"); }
        } catch(e) { console.error(e); alert("Erreur réseau"); }
        finally { btn.innerHTML = '<i class="fas fa-save"></i> SAUVEGARDER'; }
    }

    function createNewFile() {
        const name = prompt("Nom du fichier (ex: 001-Bulbasaur) :");
        if(!name) return;
        if(!name.endsWith('.json')) name += '.json';
        
        fullJsonData = { pixelmonName: "Nouveau", stats: {}, types: [], forms: {} };
        currentData = fullJsonData;
        currentFilename = name;
        currentFormKey = 'base';
        
        updateHeader();
        renderEditor();
    }

    loadFileList();
</script>
@endpush