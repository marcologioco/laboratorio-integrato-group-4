/**
 * Admin Dashboard - Gestione area amministrativa
 */

const overview = document.getElementById('overview');
const detailView = document.getElementById('detail-view');
const detailCards = document.getElementById('detail-cards');
const detailTitle = document.getElementById('detail-title');
const closeBtn = document.getElementById('close-overview');
const sidebarLinks = document.querySelectorAll('aside nav a');

// Nuovi elementi per contratti
const contractsView = document.getElementById('contracts-view');
const contractsListView = document.getElementById('contracts-list-view');
const contractFormView = document.getElementById('contract-form-view');

let currentData = {
  utenti: [],
  immobili: [],
  valutazioni: [],
  venditori: [],
  contratti: []
};

// Inizializzazione pagina admin
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof protectPage === 'function' && !protectPage(true)) {
    return;
  }

  await loadAdminData();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof logout === 'function') logout();
    });
  }

  setupCardListeners();
  setupSidebarNavigation();
  setupContractsListeners();

  // Listener chiudi overview
  if (closeBtn) closeBtn.addEventListener('click', showCards);
  
  // Evidenzia Dashboard all'avvio
  const dashboardLink = Array.from(sidebarLinks).find(link => link.textContent.toLowerCase().includes('dashboard'));
  if (dashboardLink) setActiveSidebarLink(dashboardLink);
});

async function loadAdminData() {
  try {
    const user = getUser();
    if (!user) return;

    const adminNameEl = document.getElementById('admin-name');
    const adminEmailEl = document.getElementById('admin-email');

    if (adminNameEl) adminNameEl.textContent = `${user.nome} ${user.cognome}`;
    if (adminEmailEl) adminEmailEl.textContent = user.email;

    await loadAllData();
  } catch (error) {
    console.error('Errore caricamento dati admin:', error);
  }
}

async function loadAllData() {
  try {
    // Parallel fetch per performance
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
    console.error('Errore caricamento dati:', error);
  }
}

function updateCount(type, count) {
  const countEl = document.getElementById(`count-${type}`);
  if (countEl) countEl.textContent = count;
}

// --- NAVIGAZIONE ---

function setupCardListeners() {
    if (!overview) return;
    overview.querySelectorAll('.card-admin').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.type;
            showDetailView(type);
        });
    });
}function setupSidebarNavigation() {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            setActiveSidebarLink(link);
            const text = link.textContent.toLowerCase();
            if (text.includes('dashboard')) showCards();
            else if (text.includes('utenti')) showDetailView('utenti');
            else if (text.includes('venditori')) showDetailView('utenti'); // O separato se preferisci
            else if (text.includes('valutazioni')) showDetailView('valutazioni');
            else if (text.includes('immobili')) showDetailView('immobili');
            else if (text.includes('contratti')) showContractsView();
        });
    });
}

function setActiveSidebarLink(activeLink) {
    sidebarLinks.forEach(link => {
        link.classList.remove('bg-my-green-dark', 'text-white', 'font-semibold', 'shadow-md');
        link.classList.add('text-my-black', 'hover:bg-gray-100', 'hover:font-semibold');
    });
    activeLink.classList.remove('text-my-black', 'hover:bg-gray-100', 'hover:font-semibold');
    activeLink.classList.add('bg-my-green-dark', 'text-white', 'font-semibold', 'shadow-md');
}function hideAllViews() {
  if (overview) overview.classList.add('hidden');
  if (detailView) detailView.classList.add('hidden');
  if (contractsView) contractsView.classList.add('hidden');
  if (contractsListView) contractsListView.classList.add('hidden');
  if (contractFormView) contractFormView.classList.add('hidden');
  if (closeBtn) closeBtn.classList.add('hidden');
}

function showCards(type = null) {
    hideAllViews();
    if (overview) overview.classList.remove('hidden');
    // Evidenzia Dashboard nella sidebar
    const dashboardLink = Array.from(sidebarLinks).find(link => link.textContent.toLowerCase().includes('dashboard'));
    if (dashboardLink) setActiveSidebarLink(dashboardLink);
}function showDetailView(type) {
    hideAllViews();
    if (!detailView || !detailCards || !detailTitle) return;

    detailTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    detailCards.innerHTML = '';
    detailCards.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';

    switch (type) {
        case 'utenti': renderUtenti(currentData.utenti); break;
        case 'venditori': renderVenditori(currentData.venditori); break;
        case 'immobili': renderImmobili(currentData.immobili); break;
        case 'valutazioni': renderValutazioni(currentData.valutazioni); break;
    }

    detailView.classList.remove('hidden');
    if (closeBtn) closeBtn.classList.remove('hidden');
    
    // Evidenzia la sezione corrispondente nella sidebar
    const activeLink = Array.from(sidebarLinks).find(link => {
        const text = link.textContent.toLowerCase();
        return text.includes(type);
    });
    if (activeLink) setActiveSidebarLink(activeLink);
}// --- RENDER FUNCTIONS ---

// Helper per immagini
function getImmobileImage(tipo) {
  const t = tipo ? tipo.toUpperCase() : '';
  if (t.includes('VILLA')) return 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&h=250&q=80';
  if (t.includes('UFFICIO')) return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&h=250&q=80';
  return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&h=250&q=80';
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
    let badgeColor = 'bg-blue-100 text-blue-700';
    if (immobile.tipo === 'VILLA') badgeColor = 'bg-purple-100 text-purple-700';
    if (immobile.tipo === 'APPARTAMENTO') badgeColor = 'bg-orange-100 text-orange-700';

    cardEl.innerHTML = `
          <div class="h-48 bg-gray-200 relative overflow-hidden">
             <img src="${imgUrl}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
             <div class="absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold uppercase shadow-sm ${badgeColor}">${immobile.tipo}</div>
             <div class="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm text-gray-600">ID: ${immobile.idImmobile}</div>
          </div>
          <div class="p-5">
            <div class="mb-4">
                <h4 class="font-bold text-lg text-my-black leading-tight mb-1">${immobile.indirizzo}</h4>
                <p class="text-sm text-gray-500">${immobile.citta} (${immobile.provincia})</p>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center py-3 border-t border-b border-gray-50 bg-gray-50/50 rounded-lg mb-4">
                <div><span class="block text-[10px] font-bold text-gray-400 uppercase">Mq</span><span class="font-semibold text-gray-700 text-sm">${immobile.metriQuadri}</span></div>
                <div><span class="block text-[10px] font-bold text-gray-400 uppercase">Locali</span><span class="font-semibold text-gray-700 text-sm">${immobile.camere}</span></div>
                <div><span class="block text-[10px] font-bold text-gray-400 uppercase">Bagni</span><span class="font-semibold text-gray-700 text-sm">${immobile.bagni}</span></div>
            </div>
            <div class="flex justify-between items-center mb-4">
                 <span class="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 uppercase">${immobile.stato}</span>
                 <span class="font-bold text-my-green-dark text-lg">${immobile.prezzo ? '€ ' + immobile.prezzo.toLocaleString() : '-'}</span>
            </div>
            
            <div id="details-${immobile.idImmobile}" class="hidden border-t border-gray-100 pt-4 mb-4 bg-gray-50 -mx-5 px-5 pb-4 mt-4 shadow-inner">
                <h5 class="text-xs font-bold text-gray-500 uppercase mb-2">Descrizione</h5>
                <p class="text-sm text-gray-600 italic">"${immobile.descrizione || 'Nessuna descrizione.'}"</p>
            </div>
            
            <div class="flex gap-2 pt-2 border-t border-gray-100">
                <button class="toggle-details-btn flex-1 py-2 text-xs font-bold text-my-green-dark bg-green-50 hover:bg-green-100 rounded transition-colors flex items-center justify-center gap-1" data-target="details-${immobile.idImmobile}">
                    <svg class="w-4 h-4 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg> Specifiche
                </button>
                <button class="delete-immobile-btn p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          </div>
        `;
    detailCards.appendChild(cardEl);

    // Listeners card
    const toggleBtn = cardEl.querySelector('.toggle-details-btn');
    const detailsDiv = cardEl.querySelector(`#details-${immobile.idImmobile}`);
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      detailsDiv.classList.toggle('hidden');
      const icon = toggleBtn.querySelector('svg');
      if (detailsDiv.classList.contains('hidden')) {
        icon.style.transform = 'rotate(0deg)';
        toggleBtn.childNodes[2].textContent = ' Specifiche';
      } else {
        icon.style.transform = 'rotate(180deg)';
        toggleBtn.childNodes[2].textContent = ' Chiudi';
      }
    });

    cardEl.querySelector('.delete-immobile-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm('Eliminare immobile?')) {
        await deleteImmobile(immobile.idImmobile);
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

    // Trova immobile associato per mostrare l'indirizzo
    const imm = currentData.immobili.find(i => i.idImmobile === val.idImmobile);
    const indirizzo = imm ? `${imm.indirizzo}, ${imm.citta}` : `Immobile ID ${val.idImmobile}`;
    const imgUrl = imm ? getImmobileImage(imm.tipo) : 'https://via.placeholder.com/100';

    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-my-green-dark transition-all';

    cardEl.innerHTML = `
            <div class="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4 w-full md:w-auto">
                    <div class="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src="${imgUrl}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <p class="font-bold text-gray-800 text-lg">${indirizzo}</p>
                        <p class="text-xs text-gray-500">Valutazione #${val.idValutazione} • ${data}</p>
                    </div>
                </div>

                <div class="flex items-center gap-6 mt-3 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                     <div class="text-right">
                        <p class="text-xs text-gray-400 uppercase font-bold">Valore</p>
                        <p class="font-bold text-my-orange text-lg">€ ${val.valoreStimato ? val.valoreStimato.toLocaleString() : '-'}</p>
                     </div>
                     <span class="px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColor}">${val.stato}</span>
                     <button class="toggle-val-btn p-2 text-gray-400 hover:text-my-green-dark transition"><svg class="w-5 h-5 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></button>
                     <button class="delete-val-btn p-2 text-gray-400 hover:text-red-600 transition">🗑️</button>
                </div>
            </div>
            
            <div class="hidden bg-gray-50 border-t border-gray-100 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 details-panel">
                <div>
                    <p class="font-bold text-xs uppercase text-gray-400">Immobile</p>
                    <p>${imm ? `${imm.tipo} • ${imm.metriQuadri}mq` : 'N/A'}</p>
                </div>
                <div>
                    <p class="font-bold text-xs uppercase text-gray-400">Valore Zona</p>
                    <p>€ ${val.valoreCalcolatoZona ? val.valoreCalcolatoZona.toLocaleString() : '-'}</p>
                </div>
                <div>
                    <p class="font-bold text-xs uppercase text-gray-400">Note</p>
                    <p class="italic">"${val.note || 'Nessuna nota.'}"</p>
                </div>
            </div>
        `;
    detailCards.appendChild(cardEl);

    // Listeners
    const toggleBtn = cardEl.querySelector('.toggle-val-btn');
    const detailsPanel = cardEl.querySelector('.details-panel');
    const icon = toggleBtn.querySelector('svg');
    toggleBtn.addEventListener('click', () => {
      detailsPanel.classList.toggle('hidden');
      if (detailsPanel.classList.contains('hidden')) icon.style.transform = 'rotate(0deg)';
      else icon.style.transform = 'rotate(180deg)';
    });

    cardEl.querySelector('.delete-val-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm('Eliminare valutazione?')) {
        await deleteValutazione(val.idValutazione);
        cardEl.remove();
      }
    });
  });
}

function renderUtenti(utenti) {
  detailCards.innerHTML = '';
  if (utenti.length === 0) { detailCards.innerHTML = '<p class="col-span-full text-center">Nessuno.</p>'; return; }

  utenti.forEach(utente => {
    const isVenditore = currentData.venditori.some(v => v.idUtente === utente.idUtente);
    const initials = (utente.nome && utente.cognome) ? (utente.nome[0] + utente.cognome[0]).toUpperCase() : 'U';
    const badgeRole = utente.idRuolo === 2 ? '<span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">ADMIN</span>' : '<span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">UTENTE</span>';
    const badgeVend = isVenditore ? '<span class="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded border border-orange-200">VENDITORE</span>' : '';

    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all';
    cardEl.innerHTML = `
        <div class="flex items-center justify-between mb-4">
           <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200">${initials}</div>
              <div><h4 class="font-bold text-my-black leading-tight">${utente.nome} ${utente.cognome}</h4><p class="text-xs text-gray-400">ID: ${utente.idUtente}</p></div>
           </div>
           <div class="flex flex-col gap-1 text-right">${badgeRole}${badgeVend}</div>
        </div>
        <div class="space-y-2 text-sm text-gray-600 mb-4">
          <div class="flex items-center gap-2"><span class="text-gray-400">📧</span> ${utente.email}</div>
          <div class="flex items-center gap-2"><span class="text-gray-400">📞</span> ${utente.telefono || '-'}</div>
        </div>
        <div class="border-t border-gray-100 pt-3 flex justify-end">
          <button class="delete-btn text-red-500 hover:text-red-700 text-xs font-bold uppercase flex items-center gap-1"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Elimina</button>
        </div>
      `;
    detailCards.appendChild(cardEl);
    cardEl.querySelector('.delete-btn').addEventListener('click', async () => {
      if (confirm('Eliminare utente?')) {
        await deleteUtente(utente.idUtente);
        cardEl.remove();
      }
    });
  });
}

function renderVenditori(venditori) {
  // Stessa logica se vuoi
  renderUtenti(venditori);
}

// --- CONTRATTI ---

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
    if(contractsView) contractsView.classList.remove('hidden');
    // Evidenzia Contratti nella sidebar
    const contractsLink = Array.from(sidebarLinks).find(link => link.textContent.toLowerCase().includes('contratti'));
    if (contractsLink) setActiveSidebarLink(contractsLink);
}
function showContractsList() { hideAllViews(); if (contractsListView) { contractsListView.classList.remove('hidden'); renderContractsList(); } }
function showContractForm() { hideAllViews(); if (contractFormView) { contractFormView.classList.remove('hidden'); populateContractSelects(); setDefaultDates(); } }

function renderContractsList() {
  const list = document.getElementById('contracts-list');
  if (!list) return;
  list.innerHTML = '';

  if (currentData.contratti.length === 0) {
    list.innerHTML = '<p class="text-center py-8 text-gray-500">Nessun contratto.</p>';
    return;
  }

  currentData.contratti.forEach(c => {
    const imm = currentData.immobili.find(i => i.idImmobile === c.idImmobile);
    const vend = currentData.venditori.find(v => v.idVenditore === c.idVenditore);
    const vendName = vend ? `${vend.nome} ${vend.cognome}` : 'Venditore Sconosciuto';

    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between hover:border-blue-400 transition-colors';
    card.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-50 rounded text-blue-600 flex items-center justify-center text-xl">📄</div>
                <div>
                    <h4 class="font-bold text-gray-800">Contratto #${c.idContratto}</h4>
                    <p class="text-sm text-gray-600">Venditore: <strong>${vendName}</strong></p>
                    <p class="text-xs text-gray-400">${imm ? imm.indirizzo : 'Immobile N/A'}</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">${c.stato}</span>
                <button class="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition view-contract-btn" title="Visualizza">👁️</button>
                <button class="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition del-contract-btn" title="Elimina">🗑️</button>
            </div>
        `;
    list.appendChild(card);

    card.querySelector('.view-contract-btn').addEventListener('click', () => openContractForView(c));
    card.querySelector('.del-contract-btn').addEventListener('click', async () => {
      if (confirm('Eliminare contratto?')) { await deleteContratto(c.idContratto); card.remove(); }
    });
  });
}

function openContractForView(contratto) {
  showContractForm();

  const selImm = document.getElementById('select-immobile');
  const selVend = document.getElementById('select-venditore');

  // Attendi popolamento select (hack leggero)
  setTimeout(() => {
    if (selImm) { selImm.value = contratto.idImmobile; updateContractFromImmobile(); }
    if (selVend) { selVend.value = contratto.idVenditore; updateContractFromVenditore(); }

    if (document.getElementById('data-inizio')) document.getElementById('data-inizio').value = contratto.dataInizio;
    if (document.getElementById('data-fine')) document.getElementById('data-fine').value = contratto.dataFine;
    if (document.getElementById('prezzo-minimo')) document.getElementById('prezzo-minimo').value = contratto.prezzoFinaleMinimo;

    updateContractFields();
  }, 100);

  window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const fields = ['tipo', 'indirizzo', 'citta', 'provincia', 'cap', 'metriQuadri', 'camere', 'bagni', 'stato', 'prezzo'];
  fields.forEach(f => {
    const el = document.getElementById(`immobile-${f === 'metriQuadri' ? 'mq' : f}`);
    if (el) el.textContent = imm[f] || '___';
  });
}

function updateContractFromVenditore() {
  const sel = document.getElementById('select-venditore');
  const opt = sel.options[sel.selectedIndex];
  if (!opt || !opt.dataset.obj) return;
  const v = JSON.parse(opt.dataset.obj);

  document.getElementById('venditore-nome').textContent = `${v.nome} ${v.cognome}`;
  document.getElementById('venditore-citta').textContent = v.citta || '___';
  document.getElementById('venditore-indirizzo').textContent = v.indirizzo || '___';
  document.getElementById('venditore-cf').textContent = v.codiceFiscale || '___';
  document.getElementById('venditore-tel').textContent = v.telefono || '___';
  document.getElementById('venditore-email').textContent = v.email || '___';
}

function setDefaultDates() {
  const dStart = document.getElementById('data-inizio');
  const dEnd = document.getElementById('data-fine');
  if (dStart && dEnd && !dStart.value) {
    const now = new Date();
    dStart.value = now.toISOString().split('T')[0];
    const future = new Date();
    future.setMonth(future.getMonth() + 6);
    dEnd.value = future.toISOString().split('T')[0];
  }
}

function updateContractFields() {
  const minPrice = document.getElementById('prezzo-minimo').value;
  const comm = document.getElementById('commissione').value;
  const dStart = document.getElementById('data-inizio').value;
  const dEnd = document.getElementById('data-fine').value;

  if (document.getElementById('contratto-prezzo-minimo')) document.getElementById('contratto-prezzo-minimo').textContent = parseInt(minPrice || 0).toLocaleString();
  if (document.getElementById('contratto-commissione')) document.getElementById('contratto-commissione').textContent = comm;

  if (dStart) document.getElementById('contratto-data-inizio').textContent = new Date(dStart).toLocaleDateString('it-IT');
  if (dEnd) document.getElementById('contratto-data-fine').textContent = new Date(dEnd).toLocaleDateString('it-IT');

  const today = new Date().toLocaleDateString('it-IT');
  document.getElementById('firma-data').textContent = today;
  document.getElementById('firma-data-agenzia').textContent = today;
}

function previewContract() {
  updateContractFields();
  document.getElementById('contract-template').scrollIntoView({ behavior: 'smooth' });
}

async function saveContract() {
  const idImm = document.getElementById('select-immobile').value;
  const idVend = document.getElementById('select-venditore').value;

  if (!idImm || !idVend) { alert('Seleziona Immobile e Venditore'); return; }

  const payload = {
    idImmobile: parseInt(idImm),
    idVenditore: parseInt(idVend),
    tipo: 'vendita',
    esclusiva: true,
    dataInizio: document.getElementById('data-inizio').value,
    dataFine: document.getElementById('data-fine').value,
    prezzoFinaleMinimo: parseFloat(document.getElementById('prezzo-minimo').value) || 0,
    stato: 'ATTIVO',
    note: 'Admin Generated'
  };

  try {
    const res = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/contratti`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Errore salvataggio');

    alert('Contratto salvato!');
    await loadAllData();
    showContractsList();
  } catch (e) { console.error(e); alert('Errore salvataggio'); }
}

async function saveAndSendContract() {
  await saveContract();
  alert('Contratto inviato via email!');
}

// --- DELETE ---
async function deleteUtente(id) { await apiDelete('utenti', id); currentData.utenti = currentData.utenti.filter(u => u.idUtente !== id); renderUtenti(currentData.utenti); }
async function deleteImmobile(id) { await apiDelete('immobili', id); currentData.immobili = currentData.immobili.filter(i => i.idImmobile !== id); renderImmobili(currentData.immobili); }
async function deleteValutazione(id) { await apiDelete('valutazioni', id); currentData.valutazioni = currentData.valutazioni.filter(v => v.idValutazione !== id); renderValutazioni(currentData.valutazioni); }
async function deleteVenditore(id) { await apiDelete('venditori', id); currentData.venditori = currentData.venditori.filter(v => v.idVenditore !== id); renderVenditori(currentData.venditori); }
async function deleteContratto(id) { await apiDelete('contratti', id); currentData.contratti = currentData.contratti.filter(c => c.idContratto !== id); renderContractsList(); }

async function apiDelete(resource, id) {
  try {
    const res = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/${resource}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Err');
  } catch (e) { console.error(e); alert('Errore eliminazione'); }
}