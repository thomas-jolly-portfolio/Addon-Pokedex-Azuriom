@extends('admin.layouts.admin')

@section('title', 'Éditeur Pokédex')

@push('styles')
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root { --primary: #3498db; --secondary: #2c3e50; --success: #27ae60; --danger: #e74c3c; --light: #f8f9fa; --border: #e9ecef; }
        
        /* Layout spécifique pour s'intégrer dans l'admin */
        .editor-container { display: flex; height: 85vh; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
        
        /* Sidebar Fichiers */
        .file-sidebar { width: 280px; background: var(--secondary); color: white; display: flex; flex-direction: column; border-right: 1px solid rgba(255,255,255,0.1); }
        .sidebar-header { padding: 15px; background: rgba(0,0,0,0.2); font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .search-box { padding: 10px; background: rgba(255,255,255,0.05); }
        .search-box input { width: 100%; background: rgba(255,255,255,0.1); border: none; padding: 8px; color: white; border-radius: 4px; }
        .file-list { flex: 1; overflow-y: auto; list-style: none; padding: 0; margin: 0; }
        .file-item { padding: 10px 15px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9em; display: flex; justify-content: space-between; transition: 0.2s; }
        .file-item:hover { background: rgba(255,255,255,0.1); }
        .file-item.active { background: var(--primary); border-left: 4px solid white; }

        /* Zone Principale */
        .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .editor-toolbar { padding: 10px 20px; background: white; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .json-editor-content { flex: 1; overflow-y: auto; padding: 20px; background: #f8f9fa; }
        
        /* Formulaire */
        .form-group { margin-bottom: 15px; }
        .form-label { display: block; font-weight: 600; margin-bottom: 5px; font-size: 0.85em; color: #555; }
        .form-control { width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 4px; font-size: 0.9em; }
        .row-group { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 15px; border: 1px solid var(--border); }
        
        /* Boutons */
        .btn-primary { background: var(--primary); color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
        .btn-success { background: var(--success); color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
        .btn-primary:hover { opacity: 0.9; }
    </style>
@endpush

@section('content')
<div class="editor-container">
    <aside class="file-sidebar">
        <div class="sidebar-header">
            <span><i class="fas fa-database"></i> JSON Data</span>
            <span class="badge badge-info" id="file-count">0</span>
        </div>
        <div class="search-box">
            <input type="text" id="search-file" placeholder="Rechercher (ex: 004)..." oninput="filterFiles()">
        </div>
        <ul class="file-list custom-scroll" id="file-list-ul">
            </ul>
    </aside>

    <main class="main-area">
        <div class="editor-toolbar">
            <h4 class="m-0" id="current-file-title">Sélectionnez un fichier</h4>
            <div>
                <button onclick="saveData()" class="btn-success"><i class="fas fa-save"></i> Sauvegarder</button>
            </div>
        </div>

        <div class="json-editor-content" id="editor-form">
            <div class="text-center text-muted mt-5">
                <i class="fas fa-arrow-left fa-3x mb-3"></i><br>
                Cliquez sur un fichier à gauche pour l'éditer.
            </div>
        </div>
    </main>
</div>

<div id="toast" style="position: fixed; bottom: 20px; right: 20px; background: #2ecc71; color: white; padding: 15px 25px; border-radius: 8px; display: none; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 9999;">
    <i class="fas fa-check-circle"></i> Sauvegarde réussie !
</div>
@endsection

@push('footer-scripts')
<script>
    let files = [];
    let currentData = null;
    let currentFilename = null;

    // --- API ROUTES (Injectées par Blade) ---
    const API = {
        list: "{{ route('pokedex.admin.editor.list') }}",
        // On met ':id' pour que Laravel soit content, et on l'enlève pour avoir l'URL de base
        load: "{{ route('pokedex.admin.editor.load', ':id') }}".replace(':id', ''), 
        save: "{{ route('pokedex.admin.editor.save', ':id') }}".replace(':id', '')
    };

    // --- CHARGEMENT INITIAL ---
    async function loadFileList() {
        try {
            const res = await fetch(API.list);
            files = await res.json();
            renderFileList(files);
            document.getElementById('file-count').innerText = files.length;
        } catch(e) { console.error("Erreur chargement liste", e); }
    }

    function renderFileList(list) {
        const ul = document.getElementById('file-list-ul');
        ul.innerHTML = list.map(f => `
            <li class="file-item" onclick="loadFile('${f}')" id="file-${f.replace('.','-')}">
                <span><i class="fas fa-file-code"></i> ${f}</span>
            </li>
        `).join('');
    }

    function filterFiles() {
        const term = document.getElementById('search-file').value.toLowerCase();
        const filtered = files.filter(f => f.toLowerCase().includes(term));
        renderFileList(filtered);
    }

    // --- CHARGEMENT FICHIER ---
    async function loadFile(filename) {
        // UI Active
        document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
        const activeItem = document.getElementById(`file-${filename.replace('.','-')}`);
        if(activeItem) activeItem.classList.add('active');

        currentFilename = filename;
        document.getElementById('current-file-title').innerText = filename;

        try {
            const res = await fetch(API.load + filename);
            const raw = await res.json();
            
            // Gestion si le JSON est un tableau ou objet (Pixelmon met parfois dans [0])
            currentData = Array.isArray(raw) ? raw[0] : raw;
            
            renderForm();
        } catch(e) { alert("Impossible de lire le fichier JSON"); console.error(e); }
    }

    // --- GENERATION DU FORMULAIRE ---
    function renderForm() {
        const container = document.getElementById('editor-form');
        if(!currentData) return;

        let html = `
        <div class="card">
            <div class="row-group">
                <div class="form-group">
                    <label class="form-label">Nom Pixelmon (ID interne)</label>
                    <input type="text" class="form-control" value="${currentData.pixelmonName || ''}" onchange="updateField('pixelmonName', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Nom Affiché (Traduction)</label>
                    <input type="text" class="form-control" value="${currentData.name || currentData.pixelmonName || ''}" onchange="updateField('name', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Numéro Pokédex</label>
                    <input type="number" class="form-control" value="${currentData.pokedexId || 0}" onchange="updateField('pokedexId', parseInt(this.value))">
                </div>
            </div>
        </div>

        <div class="card">
            <h5 class="mb-3 border-b pb-2">Statistiques de Base</h5>
            <div class="row-group" style="grid-template-columns: repeat(6, 1fr);">
                ${['HP','Attack','Defence','SpecialAttack','SpecialDefence','Speed'].map(s => `
                    <div class="form-group text-center">
                        <label class="form-label" style="font-size:0.7em">${s.substring(0,3).toUpperCase()}</label>
                        <input type="number" class="form-control text-center" value="${currentData.stats ? currentData.stats[s] : 0}" 
                        onchange="updateStat('${s}', parseInt(this.value))">
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="card">
            <h5 class="mb-3 border-b pb-2">Informations</h5>
            <div class="row-group">
                <div class="form-group">
                    <label class="form-label">Types (Séparés par virgule)</label>
                    <input type="text" class="form-control" value="${(currentData.types || []).join(', ')}" 
                    onchange="updateArray('types', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Groupes Oeuf</label>
                    <input type="text" class="form-control" value="${(currentData.eggGroups || []).join(', ')}" 
                    onchange="updateArray('eggGroups', this.value)">
                </div>
                <div class="form-group">
                    <label class="form-label">Taux Capture</label>
                    <input type="number" class="form-control" value="${currentData.catchRate || 45}" onchange="updateField('catchRate', parseInt(this.value))">
                </div>
                <div class="form-group">
                    <label class="form-label">Pourcentage Mâle (-1 = Asexué)</label>
                    <input type="number" class="form-control" value="${currentData.malePercent ?? 50}" onchange="updateField('malePercent', parseInt(this.value))">
                </div>
            </div>
        </div>`;

        container.innerHTML = html;
    }

    // --- MISES A JOUR DES DONNEES (EN MEMOIRE) ---
    function updateField(key, value) {
        currentData[key] = value;
    }
    
    function updateStat(stat, value) {
        if(!currentData.stats) currentData.stats = {};
        currentData.stats[stat] = value;
    }

    function updateArray(key, valueString) {
        currentData[key] = valueString.split(',').map(s => s.trim()).filter(s => s);
    }

    // --- SAUVEGARDE (AVEC CSRF TOKEN) ---
    async function saveData() {
        if(!currentFilename) return;
        
        const saveBtn = document.querySelector('.btn-success');
        const oldText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...';
        
        try {
            // IMPORTANT : On récupère le token CSRF d'Azuriom
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            const res = await fetch(API.save + currentFilename, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken // INDISPENSABLE POUR LARAVEL
                },
                // On enveloppe les données car le controller attend $request->input('data')
                // Et Pixelmon s'attend parfois à un tableau d'objets, donc on remet dans [] si besoin
                body: JSON.stringify({ data: [currentData] }) 
            });

            const result = await res.json();
            if(result.status === 'success') {
                showToast();
                // On peut recharger la liste pour être sûr
                // loadFileList(); 
            } else {
                alert("Erreur lors de la sauvegarde côté serveur.");
            }
        } catch(e) {
            console.error(e);
            alert("Erreur réseau ou permission.");
        } finally {
            saveBtn.innerHTML = oldText;
        }
    }

    function showToast() {
        const t = document.getElementById('toast');
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 3000);
    }

    // Lancement
    loadFileList();
</script>
@endpush