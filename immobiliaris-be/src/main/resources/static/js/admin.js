/**
 * Admin Dashboard - Gestione area amministrativa
 */

// Elementi DOM principali
const overview = document.getElementById('overview');
const detailView = document.getElementById('detail-view');
const detailCards = document.getElementById('detail-cards');
const detailTitle = document.getElementById('detail-title');
const closeBtn = document.getElementById('close-overview');
const sidebarLinks = document.querySelectorAll('aside nav a');

// Elementi per contratti
const contractsView = document.getElementById('contracts-view');
const contractsListView = document.getElementById('contracts-list-view');
const contractFormView = document.getElementById('contract-form-view');

// Stato dati locale
let currentData = {
    utenti: [],
    immobili: [],
    valutazioni: [],
    venditori: [],
    contratti: []
};

// --- INIZIALIZZAZIONE ---
document.addEventListener('DOMContentLoaded', async () => {
    // Proteggi pagina (richiede auth-utils.js)
    if (typeof protectPage === 'function' && !protectPage(true)) {
        return;
    }

    // Setup Listeners Navigazione
    setupSidebarNavigation();
    setupCardListeners();
    setupContractsListeners(); // Listener specifici per i contratti

    // Carica Dati
    await loadAdminData();

    // Logout Listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof logout === 'function') logout();
        });
    }
    
    // Listener tasto chiudi dettaglio
    if (closeBtn) {
        closeBtn.addEventListener('click', () => showCards());
    }
});

// --- CARICAMENTO DATI ---

async function loadAdminData() {
    try {
        const user = getUser();
        if (!user) return;

        const nameEl = document.getElementById('admin-name');
        const emailEl = document.getElementById('admin-email');
        
        if (nameEl) nameEl.textContent = `${user.nome} ${user.cognome}`;
        if (emailEl) emailEl.textContent = user.email;

        await loadAllData();
    } catch (error) {
        console.error('Errore init admin:', error);
    }
}

async function loadAllData() {
    try {
        // Caricamento parallelo per velocità
        const [utentiRes, immobiliRes, valutazioniRes, venditoriRes, contrattiRes] = await Promise.all([
            authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/utenti`),
            authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/immobili`),
            authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/valutazioni`),
            authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/venditori`),
            authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/contratti`)
        ]);

        if (utentiRes.ok) {
            currentData.utenti = await utentiRes.json();
            updateCount('utenti', currentData.utenti.length);
        }
        if (immobiliRes.ok) {
            currentData.immobili = await immobiliRes.json();
            updateCount('immobili', currentData.immobili.length);
        }
        if (valutazioniRes.ok) {
            currentData.valutazioni = await valutazioniRes.json();
            updateCount('valutazioni', currentData.valutazioni.length);
        }
        if (venditoriRes.ok) {
            currentData.venditori = await venditoriRes.json();
            updateCount('venditori', currentData.venditori.length);
        }
        if (contrattiRes.ok) {
            currentData.contratti = await contrattiRes.json();
        }

    } catch (error) {
        console.error('Errore fetch dati:', error);
    }
}

function updateCount(type, count) {
    const el = document.getElementById(`count-${type}`);
    if (el) el.textContent = count;
}

// --- NAVIGAZIONE INTERNA ---

function setupSidebarNavigation() {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const text = link.textContent.toLowerCase();

            // Logica di routing semplice basata sul testo del link
            if (text.includes('dashboard')) showCards();
            else if (text.includes('utenti')) showDetailView('utenti');
            else if (text.includes('venditori')) showDetailView('utenti'); // O venditori se separati
            else if (text.includes('immobili')) showDetailView('immobili');
            else if (text.includes('valutazioni')) showDetailView('valutazioni');
            else if (text.includes('contratti')) showContractsView();
        });
    });
}

function setupCardListeners() {
    if (!overview) return;
    overview.querySelectorAll('.card-admin').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            if (type) showDetailView(type);
        });
    });
}

function hideAllViews() {
    if (overview) overview.classList.add('hidden');
    if (detailView) detailView.classList.add('hidden');
    if (contractsView) contractsView.classList.add('hidden');
    if (contractsListView) contractsListView.classList.add('hidden');
    if (contractFormView) contractFormView.classList.add('hidden');
    if (closeBtn) closeBtn.classList.add('hidden');
}

function showCards() {
    hideAllViews();
    if (overview) overview.classList.remove('hidden');
}

function showDetailView(type) {
    hideAllViews();
    if (!detailView || !detailCards) return;

    if (detailTitle) detailTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    detailCards.innerHTML = ''; // Pulisci card precedenti
    
    // Reset classi griglia standard
    detailCards.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';

    switch (type) {
        case 'utenti': renderUtenti(currentData.utenti); break;
        case 'venditori': renderVenditori(currentData.venditori); break;
        case 'immobili': renderImmobili(currentData.immobili); break;
        case 'valutazioni': renderValutazioni(currentData.valutazioni); break;
    }

    detailView.classList.remove('hidden');
    if (closeBtn) closeBtn.classList.remove('hidden');
}

// --- FUNZIONI RENDER ---

// Helper Immagini
function getImmobileImage(tipo) {
    const t = tipo ? tipo.toUpperCase() : '';
    if (t.includes('VILLA')) return 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80';
    if (t.includes('UFFICIO')) return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';
    // Default Appartamento
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80';
}

function renderImmobili(immobili) {
    if (!detailCards) return;
    
    if (immobili.length === 0) {
        detailCards.innerHTML = '<p class="col-span-full text-center text-gray-500">Nessun immobile trovato.</p>';
        return;
    }

    immobili.forEach(immobile => {
        const cardEl = document.createElement('div');
        cardEl.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group h-fit';
        
        const imgUrl = getImmobileImage(immobile.tipo);
        
        // Colore badge in base al tipo
        let badgeColor = 'bg-blue-100 text-blue-700';
        if (immobile.tipo === 'VILLA') badgeColor = 'bg-purple-100 text-purple-700';
        if (immobile.tipo === 'APPARTAMENTO') badgeColor = 'bg-orange-100 text-orange-700';

        cardEl.innerHTML = `
          <div class="h-48 bg-gray-200 relative overflow-hidden">
             <img src="${imgUrl}" alt="${immobile.tipo}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
             
             <div class="absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold uppercase shadow-sm ${badgeColor}">
                ${immobile.tipo || 'Immobile'}
             </div>
             <div class="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm text-gray-600">
                ID: ${immobile.idImmobile}
             </div>
             <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
    
          <div class="p-5">
            <div class="mb-4">
                <h4 class="font-bold text-lg text-my-black leading-tight mb-1">${immobile.indirizzo || 'Indirizzo mancante'}</h4>
                <p class="text-sm text-gray-500 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    ${immobile.citta} (${immobile.provincia})
                </p>
            </div>
            
            <div class="grid grid-cols-3 gap-2 text-center py-3 border-t border-b border-gray-50 bg-gray-50/50 rounded-lg mb-4">
                <div><span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mq</span><span class="font-semibold text-gray-700 text-sm">${immobile.metriQuadri}</span></div>
                <div class="border-l border-r border-gray-200"><span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Locali</span><span class="font-semibold text-gray-700 text-sm">${immobile.camere || '-'}</span></div>
                <div><span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bagni</span><span class="font-semibold text-gray-700 text-sm">${immobile.bagni || '-'}</span></div>
            </div>
    
            <div class="flex justify-between items-center mb-4">
                 <span class="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 uppercase tracking-wide border border-gray-200">${immobile.stato || 'N/A'}</span>
                 <span class="font-bold text-my-green-dark text-lg">${immobile.prezzo ? '€ ' + immobile.prezzo.toLocaleString() : '-'}</span>
            </div>
            
            <div id="details-${immobile.idImmobile}" class="hidden border-t border-gray-100 pt-4 mb-4 bg-gray-50 -mx-5 px-5 pb-4 mt-4 shadow-inner">
                <h5 class="text-xs font-bold text-gray-500 uppercase mb-2">Descrizione</h5>
                <p class="text-sm text-gray-600 leading-relaxed italic">
                    "${immobile.descrizione || 'Nessuna descrizione disponibile.'}"
                </p>
            </div>
    
            <div class="flex gap-2 pt-2 border-t border-gray-100">
                <button class="toggle-details-btn flex-1 py-2 text-xs font-bold text-my-green-dark bg-green-50 hover:bg-green-100 rounded transition-colors flex items-center justify-center gap-1">
                    <svg class="w-4 h-4 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                    Specifiche
                </button>
                
                <button class="delete-immobile-btn p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Elimina">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
          </div>
        `;
        detailCards.appendChild(cardEl);

        // Listener DELETE
        const delBtn = cardEl.querySelector('.delete-immobile-btn');
        delBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if(confirm(`Eliminare immobile ID ${immobile.idImmobile}?`)) {
                await deleteImmobile(immobile.idImmobile);
                cardEl.remove();
            }
        });

        // Listener TOGGLE
        const toggleBtn = cardEl.querySelector('.toggle-details-btn');
        const detailsDiv = cardEl.querySelector(`#details-${immobile.idImmobile}`);
        const icon = toggleBtn.querySelector('svg');

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            detailsDiv.classList.toggle('hidden');
            
            if (detailsDiv.classList.contains('hidden')) {
                icon.style.transform = 'rotate(0deg)';
                toggleBtn.childNodes[2].textContent = ' Specifiche';
            } else {
                icon.style.transform = 'rotate(180deg)';
                toggleBtn.childNodes[2].textContent = ' Chiudi';
            }
        });
    });
}

function renderUtenti(utenti) {
    detailCards.innerHTML = '';
    
    if(utenti.length === 0) {
        detailCards.innerHTML = '<p class="col-span-full text-center text-gray-500">Nessun utente trovato.</p>';
        return;
    }
  
    utenti.forEach(utente => {
      const isVenditore = currentData.venditori.some(v => v.idUtente === utente.idUtente);
      const badgeRuolo = utente.idRuolo === 2 
          ? '<span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase">Admin</span>' 
          : '<span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">Utente</span>';
      
      const badgeVenditore = isVenditore 
          ? '<span class="px-2 py-0.5 bg-my-orange/10 text-my-orange text-xs font-bold rounded uppercase border border-my-orange/20">Venditore</span>' 
          : '';
  
      const initials = (utente.nome && utente.cognome) ? (utente.nome[0] + utente.cognome[0]).toUpperCase() : 'U';
  
      const cardEl = document.createElement('div');
      cardEl.className = 'bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all';
      cardEl.innerHTML = `
        <div class="flex items-center justify-between mb-4">
           <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                  ${initials}
              </div>
              <div>
                  <h4 class="font-bold text-my-black leading-tight">${utente.nome} ${utente.cognome}</h4>
                  <p class="text-xs text-gray-400">ID: ${utente.idUtente}</p>
              </div>
           </div>
           <div class="flex flex-col gap-1 text-right">
              ${badgeRuolo}
              ${badgeVenditore}
           </div>
        </div>
        
        <div class="space-y-2 text-sm text-gray-600 mb-4">
          <div class="flex items-center gap-2">
              <span class="text-gray-400">📧</span> ${utente.email}
          </div>
          <div class="flex items-center gap-2">
              <span class="text-gray-400">📞</span> ${utente.telefono || '-'}
          </div>
        </div>
  
        <div class="border-t border-gray-100 pt-3 flex justify-end">
          <button class="delete-btn text-red-500 hover:text-red-700 text-xs font-bold uppercase flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Elimina
          </button>
        </div>
      `;
      detailCards.appendChild(cardEl);
      
      cardEl.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm(`Eliminare utente ${utente.nome}?`)) {
          await deleteUtente(utente.idUtente);
          cardEl.remove();
        }
      });
    });
}

function renderValutazioni(valutazioni) {
    if (!detailCards) return;
    detailCards.innerHTML = '';
    detailCards.className = 'grid grid-cols-1 gap-4'; 
    
    if (valutazioni.length === 0) {
        detailCards.innerHTML = '<p class="col-span-full text-center text-gray-500">Nessuna valutazione trovata.</p>';
        return;
    }

    valutazioni.forEach(val => {
        const data = new Date(val.dataRichiesta).toLocaleDateString('it-IT');
        const statusColor = val.stato === 'COMPLETATA' ? 'text-green-600 bg-green-50 border-green-200' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
        
        const cardEl = document.createElement('div');
        cardEl.className = 'bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between hover:border-my-green-dark transition-colors';
        
        cardEl.innerHTML = `
            <div class="flex items-center gap-4 w-full md:w-auto">
                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-gray-400 border border-gray-200">
                    #${val.idValutazione}
                </div>
                <div>
                    <p class="font-bold text-gray-800">Valutazione Immobile ID ${val.idImmobile}</p>
                    <p class="text-xs text-gray-500">Richiesta il: ${data}</p>
                </div>
            </div>

            <div class="flex items-center gap-6 mt-3 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                 <div class="text-right">
                    <p class="text-xs text-gray-400 uppercase font-bold">Valore</p>
                    <p class="font-bold text-my-orange text-lg">€ ${val.valoreStimato ? val.valoreStimato.toLocaleString() : '-'}</p>
                 </div>
                 <span class="px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColor}">
                    ${val.stato}
                 </span>
                 <button class="delete-val-btn p-2 text-gray-400 hover:text-red-600 transition">
                    🗑️
                 </button>
            </div>
        `;
        detailCards.appendChild(cardEl);

        cardEl.querySelector('.delete-val-btn').addEventListener('click', async () => {
            if (confirm(`Eliminare la valutazione #${val.idValutazione}?`)) {
                await deleteValutazione(val.idValutazione);
                cardEl.remove();
            }
        });
    });
}

function renderVenditori(venditori) {
    detailCards.innerHTML = '';
    // Logica rendering venditori (puoi usare la stessa di renderUtenti con piccole modifiche se vuoi)
    if(venditori.length === 0) {
        detailCards.innerHTML = '<p class="col-span-full text-center text-gray-500">Nessun venditore trovato.</p>';
        return;
    }
    // Riutilizza logica simile o personalizzala
    venditori.forEach(v => {
        const cardEl = document.createElement('div');
        cardEl.className = 'bg-white p-5 rounded-xl shadow-sm border border-gray-100';
        cardEl.innerHTML = `
            <h4 class="font-bold">${v.nome} ${v.cognome}</h4>
            <p class="text-sm text-gray-600">${v.email}</p>
            <p class="text-xs text-gray-400 mt-2">ID Venditore: ${v.idVenditore}</p>
            <button class="del-vend-btn text-red-500 text-xs mt-2 font-bold">ELIMINA</button>
        `;
        detailCards.appendChild(cardEl);
        cardEl.querySelector('.del-vend-btn').addEventListener('click', async () => {
            if(confirm('Eliminare venditore?')) {
                await deleteVenditore(v.idVenditore);
                cardEl.remove();
            }
        });
    });
}

// --- LOGICA CONTRATTI ---

function setupContractsListeners() {
    const btnView = document.getElementById('btn-view-contracts');
    const btnCreate = document.getElementById('btn-create-contract');
    const btnBack = document.getElementById('btn-back-contracts');
    const btnBackForm = document.getElementById('btn-back-from-form');
    const btnSave = document.getElementById('btn-save-contract');
    const btnSend = document.getElementById('btn-send-contract');
    const btnPreview = document.getElementById('btn-preview-contract');

    if (btnView) btnView.addEventListener('click', showContractsList);
    if (btnCreate) btnCreate.addEventListener('click', showContractForm);
    if (btnBack) btnBack.addEventListener('click', showContractsView);
    if (btnBackForm) btnBackForm.addEventListener('click', showContractsView);
    if (btnSave) btnSave.addEventListener('click', saveContract);
    if (btnSend) btnSend.addEventListener('click', saveAndSendContract);
    if (btnPreview) btnPreview.addEventListener('click', previewContract);

    const selImm = document.getElementById('select-immobile');
    const selVend = document.getElementById('select-venditore');
    if (selImm) selImm.addEventListener('change', updateContractFromImmobile);
    if (selVend) selVend.addEventListener('change', updateContractFromVenditore);
}

function showContractsView() {
    hideAllViews();
    if (contractsView) contractsView.classList.remove('hidden');
}

function showContractsList() {
    hideAllViews();
    if (contractsListView) {
        contractsListView.classList.remove('hidden');
        renderContractsList();
    }
}

function showContractForm() {
    hideAllViews();
    if (contractFormView) {
        contractFormView.classList.remove('hidden');
        populateContractSelects();
        setDefaultDates();
    }
}

function renderContractsList() {
    const list = document.getElementById('contracts-list');
    if (!list) return;
    list.innerHTML = '';

    if (currentData.contratti.length === 0) {
        list.innerHTML = '<p class="text-center py-8 text-gray-500">Nessun contratto archiviato.</p>';
        return;
    }

    currentData.contratti.forEach(c => {
        const imm = currentData.immobili.find(i => i.idImmobile === c.idImmobile);
        const vend = currentData.venditori.find(v => v.idVenditore === c.idVenditore);
        
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between';
        card.innerHTML = `
            <div>
                <h4 class="font-bold text-gray-800">Contratto #${c.idContratto}</h4>
                <p class="text-sm text-gray-500">${vend ? vend.cognome : 'N/A'} • ${imm ? imm.indirizzo : 'N/A'}</p>
            </div>
            <div class="flex gap-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">${c.stato}</span>
                <button class="text-red-500 hover:text-red-700 px-2 del-contract">🗑️</button>
            </div>
        `;
        list.appendChild(card);
        card.querySelector('.del-contract').addEventListener('click', async () => {
            if(confirm('Eliminare contratto?')) {
                await deleteContratto(c.idContratto);
                card.remove();
            }
        });
    });
}

function populateContractSelects() {
    const sImm = document.getElementById('select-immobile');
    const sVend = document.getElementById('select-venditore');
    
    if (sImm) {
        sImm.innerHTML = '<option value="">-- Seleziona --</option>';
        currentData.immobili.forEach(i => {
            const op = document.createElement('option');
            op.value = i.idImmobile;
            op.textContent = `${i.tipo} - ${i.indirizzo}`;
            op.dataset.obj = JSON.stringify(i);
            sImm.appendChild(op);
        });
    }
    if (sVend) {
        sVend.innerHTML = '<option value="">-- Seleziona --</option>';
        currentData.venditori.forEach(v => {
            const op = document.createElement('option');
            op.value = v.idVenditore;
            op.textContent = `${v.nome} ${v.cognome}`;
            op.dataset.obj = JSON.stringify(v);
            sVend.appendChild(op);
        });
    }
}

function updateContractFromImmobile() {
    const sel = document.getElementById('select-immobile');
    const opt = sel.options[sel.selectedIndex];
    if (!opt || !opt.dataset.obj) return;
    const imm = JSON.parse(opt.dataset.obj);
    
    // Aggiorna campi testo contratto
    const fields = {
        'immobile-tipo': imm.tipo,
        'immobile-indirizzo': imm.indirizzo,
        'immobile-citta': imm.citta,
        'immobile-provincia': imm.provincia,
        'immobile-cap': imm.cap,
        'immobile-mq': imm.metriQuadri,
        'immobile-camere': imm.camere,
        'immobile-bagni': imm.bagni,
        'immobile-stato': imm.stato,
        'immobile-prezzo': imm.prezzo
    };
    
    for (const [id, val] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el) el.textContent = val || '______';
    }
    if (document.getElementById('immobile-prezzo-num')) {
        document.getElementById('immobile-prezzo-num').textContent = imm.prezzo || '______';
    }
}

function updateContractFromVenditore() {
    const sel = document.getElementById('select-venditore');
    const opt = sel.options[sel.selectedIndex];
    if (!opt || !opt.dataset.obj) return;
    const v = JSON.parse(opt.dataset.obj);

    const fields = {
        'venditore-nome': `${v.nome} ${v.cognome}`,
        'venditore-citta': v.citta,
        'venditore-indirizzo': v.indirizzo,
        'venditore-cf': v.codiceFiscale,
        'venditore-tel': v.telefono,
        'venditore-email': v.email
    };

    for (const [id, val] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el) el.textContent = val || '______';
    }
}

function setDefaultDates() {
    const dStart = document.getElementById('data-inizio');
    const dEnd = document.getElementById('data-fine');
    if (dStart && dEnd) {
        const now = new Date();
        dStart.value = now.toISOString().split('T')[0];
        const future = new Date();
        future.setMonth(future.getMonth() + 6);
        dEnd.value = future.toISOString().split('T')[0];
    }
}

function updateContractFields() {
    // Aggiorna l'anteprima con i dati degli input manuali
    const minPrice = document.getElementById('prezzo-minimo').value;
    const comm = document.getElementById('commissione').value;
    const dStart = document.getElementById('data-inizio').value;
    const dEnd = document.getElementById('data-fine').value;

    if(document.getElementById('contratto-prezzo-minimo')) 
        document.getElementById('contratto-prezzo-minimo').textContent = minPrice;
    if(document.getElementById('contratto-commissione')) 
        document.getElementById('contratto-commissione').textContent = comm;
    if(document.getElementById('contratto-data-inizio')) 
        document.getElementById('contratto-data-inizio').textContent = dStart;
    if(document.getElementById('contratto-data-fine')) 
        document.getElementById('contratto-data-fine').textContent = dEnd;
        
    const today = new Date().toLocaleDateString('it-IT');
    if(document.getElementById('firma-data')) document.getElementById('firma-data').textContent = today;
    if(document.getElementById('firma-data-agenzia')) document.getElementById('firma-data-agenzia').textContent = today;
}

function previewContract() {
    updateContractFields();
    alert('Anteprima aggiornata. Scorri in basso.');
    document.getElementById('contract-template').scrollIntoView({behavior: 'smooth'});
}

async function saveContract() {
    // Recupera ID e valori
    const idImm = document.getElementById('select-immobile').value;
    const idVend = document.getElementById('select-venditore').value;
    
    if(!idImm || !idVend) {
        alert('Seleziona Immobile e Venditore');
        return;
    }

    const payload = {
        idImmobile: parseInt(idImm),
        idVenditore: parseInt(idVend),
        tipo: 'vendita',
        esclusiva: true,
        dataInizio: document.getElementById('data-inizio').value,
        dataFine: document.getElementById('data-fine').value,
        prezzoFinaleMinimo: parseFloat(document.getElementById('prezzo-minimo').value) || 0,
        stato: 'ATTIVO',
        note: 'Creato da Admin'
    };

    try {
        const res = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/contratti`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(!res.ok) throw new Error('Errore salvataggio');
        
        alert('Contratto salvato!');
        await loadAllData(); // Ricarica tutto
        showContractsList(); // Torna alla lista
    } catch (e) {
        console.error(e);
        alert('Errore durante il salvataggio');
    }
}

async function saveAndSendContract() {
    await saveContract();
    alert('Simulazione: Email inviata al venditore con PDF allegato.');
}

// --- FUNZIONI DELETE (API) ---

async function deleteUtente(id) {
    try {
        const res = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/utenti/${id}`, { method: 'DELETE' });
        if(!res.ok) throw new Error('Err delete');
        currentData.utenti = currentData.utenti.filter(u => u.idUtente !== id);
    } catch(e) { console.error(e); alert('Errore eliminazione'); }
}

async function deleteImmobile(id) {
    try {
        const res = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/immobili/${id}`, { method: 'DELETE' });
        if(!res.ok) throw new Error('Err delete');
        currentData.immobili = currentData.immobili.filter(i => i.idImmobile !== id);
    } catch(e) { console.error(e); alert('Errore eliminazione'); }
}

async function deleteValutazione(id) {
    try {
        const res = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/valutazioni/${id}`, { method: 'DELETE' });
        if(!res.ok) throw new Error('Err delete');
        currentData.valutazioni = currentData.valutazioni.filter(v => v.idValutazione !== id);
    } catch(e) { console.error(e); alert('Errore eliminazione'); }
}

async function deleteVenditore(id) {
    try {
        const res = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/venditori/${id}`, { method: 'DELETE' });
        if(!res.ok) throw new Error('Err delete');
        currentData.venditori = currentData.venditori.filter(v => v.idVenditore !== id);
    } catch(e) { console.error(e); alert('Errore eliminazione'); }
}

async function deleteContratto(id) {
    try {
        const res = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/contratti/${id}`, { method: 'DELETE' });
        if(!res.ok) throw new Error('Err delete');
        currentData.contratti = currentData.contratti.filter(c => c.idContratto !== id);
    } catch(e) { console.error(e); alert('Errore eliminazione'); }
}