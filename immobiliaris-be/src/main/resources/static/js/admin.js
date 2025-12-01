/**
 * Admin Dashboard - Gestione area amministrativa con chiamate API
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
  // Proteggi la pagina: solo admin
  if (!protectPage(true)) {
    return;
  }

  // Carica dati admin
  await loadAdminData();

  // Gestione logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Setup listeners
  setupCardListeners();
  setupSidebarNavigation();
  setupContractsListeners();
});

// Carica i dati dell'amministratore
async function loadAdminData() {
  try {
    const user = getUser();
    if (!user) {
      logout();
      return;
    }

    const adminNameEl = document.getElementById('admin-name');
    const adminEmailEl = document.getElementById('admin-email');

    if (adminNameEl) adminNameEl.textContent = `${user.nome} ${user.cognome}`;
    if (adminEmailEl) adminEmailEl.textContent = user.email;

    await loadAllData();
  } catch (error) {
    console.error('Errore caricamento dati admin:', error);
  }
}

// Carica tutti i dati dal backend
async function loadAllData() {
  try {
    const utentiResponse = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/utenti`);
    if (utentiResponse.ok) {
      currentData.utenti = await utentiResponse.json();
      console.log('Utenti caricati:', currentData.utenti);
      updateCount('utenti', currentData.utenti.length);
    }

    const immobiliResponse = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/immobili`);
    if (immobiliResponse.ok) {
      currentData.immobili = await immobiliResponse.json();
      console.log('Immobili caricati:', currentData.immobili);
      updateCount('immobili', currentData.immobili.length);
    }

    const valutazioniResponse = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/valutazioni`);
    if (valutazioniResponse.ok) {
      currentData.valutazioni = await valutazioniResponse.json();
      console.log('Valutazioni caricate:', currentData.valutazioni);
      updateCount('valutazioni', currentData.valutazioni.length);
    }

    const venditoriResponse = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/venditori`);
    if (venditoriResponse.ok) {
      currentData.venditori = await venditoriResponse.json();
      console.log('Venditori caricati:', currentData.venditori);
      updateCount('venditori', currentData.venditori.length);
    }

    const contrattiResponse = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/contratti`);
    if (contrattiResponse.ok) {
      currentData.contratti = await contrattiResponse.json();
      console.log('Contratti caricati:', currentData.contratti);
    }
  } catch (error) {
    console.error('Errore caricamento dati:', error);
  }
}

// Aggiorna i contatori nelle card
function updateCount(type, count) {
  const countEl = document.getElementById(`count-${type}`);
  if (countEl) {
    countEl.textContent = count;
  }
}

function setupCardListeners() {
  if (!overview) return;
  overview.querySelectorAll('.card-admin').forEach(card => {
    card.addEventListener('click', () => showDetailView(card.dataset.type));
  });
}

function setupSidebarNavigation() {
  sidebarLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const text = link.textContent.toLowerCase();
      if (text.includes('dashboard')) showCards();
      else if (text.includes('utenti')) showDetailView('utenti');
      else if (text.includes('valutazioni')) showDetailView('valutazioni');
      else if (text.includes('immobili')) showDetailView('immobili');
      else if (text.includes('contratti')) showContractsView();
    });
  });
}

// Setup listeners per la sezione contratti
function setupContractsListeners() {
  const btnViewContracts = document.getElementById('btn-view-contracts');
  const btnCreateContract = document.getElementById('btn-create-contract');
  const btnBackContracts = document.getElementById('btn-back-contracts');
  const btnBackFromForm = document.getElementById('btn-back-from-form');
  const btnSaveContract = document.getElementById('btn-save-contract');
  const btnSendContract = document.getElementById('btn-send-contract');
  const btnPreviewContract = document.getElementById('btn-preview-contract');

  if (btnViewContracts) {
    btnViewContracts.addEventListener('click', showContractsList);
  }

  if (btnCreateContract) {
    btnCreateContract.addEventListener('click', showContractForm);
  }

  if (btnBackContracts) {
    btnBackContracts.addEventListener('click', showContractsView);
  }

  if (btnBackFromForm) {
    btnBackFromForm.addEventListener('click', showContractsView);
  }

  if (btnSaveContract) {
    btnSaveContract.addEventListener('click', saveContract);
  }

  if (btnSendContract) {
    btnSendContract.addEventListener('click', saveAndSendContract);
  }

  if (btnPreviewContract) {
    btnPreviewContract.addEventListener('click', previewContract);
  }

  // Listeners per selezione immobile/venditore
  const selectImmobile = document.getElementById('select-immobile');
  const selectVenditore = document.getElementById('select-venditore');

  if (selectImmobile) {
    selectImmobile.addEventListener('change', updateContractFromImmobile);
  }

  if (selectVenditore) {
    selectVenditore.addEventListener('change', updateContractFromVenditore);
  }
}

// Mostra le card principali (overview)
function showCards(type = null) {
  if (!overview) return;
  
  hideAllViews();
  overview.classList.remove('hidden');
  if (closeBtn) closeBtn.classList.add('hidden');

  overview.querySelectorAll('.card-admin').forEach(card => {
    if (!type || card.dataset.type === type) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// Mostra vista dettaglio per un tipo di dato
function showDetailView(type) {
  if (!detailView || !detailCards || !detailTitle) return;
  
  hideAllViews();
  detailTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
  detailCards.innerHTML = '';

  switch(type) {
    case 'utenti':
      renderUtenti(currentData.utenti);
      break;
    case 'venditori':
      renderVenditori(currentData.venditori);
      break;
    case 'immobili':
      renderImmobili(currentData.immobili);
      break;
    case 'valutazioni':
      renderValutazioni(currentData.valutazioni);
      break;
  }

  detailView.classList.remove('hidden');
  if (closeBtn) closeBtn.classList.remove('hidden');
}

// Mostra vista principale contratti
function showContractsView() {
  hideAllViews();
  if (contractsView) contractsView.classList.remove('hidden');
}

// Mostra lista contratti esistenti
function showContractsList() {
  hideAllViews();
  if (contractsListView) {
    contractsListView.classList.remove('hidden');
    renderContractsList();
  }
}

// Mostra form creazione contratto
function showContractForm() {
  hideAllViews();
  if (contractFormView) {
    contractFormView.classList.remove('hidden');
    populateContractSelects();
    setDefaultDates();
  }
}

// Nascondi tutte le viste
function hideAllViews() {
  if (overview) overview.classList.add('hidden');
  if (detailView) detailView.classList.add('hidden');
  if (contractsView) contractsView.classList.add('hidden');
  if (contractsListView) contractsListView.classList.add('hidden');
  if (contractFormView) contractFormView.classList.add('hidden');
}

// Renderizza lista contratti
function renderContractsList() {
  const contractsList = document.getElementById('contracts-list');
  if (!contractsList) return;
  contractsList.innerHTML = '';

  if (currentData.contratti.length === 0) {
    contractsList.innerHTML = '<p class="text-center py-8 text-gray-500 bg-white rounded-xl border border-dashed">Nessun contratto archiviato.</p>';
    return;
  }

  currentData.contratti.forEach(contratto => {
    const immobile = currentData.immobili.find(i => i.idImmobile === contratto.idImmobile);
    const venditore = currentData.venditori.find(v => v.idVenditore === contratto.idVenditore);
    
    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between';
    
    cardEl.innerHTML = `
       <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-blue-50 rounded text-blue-600 flex items-center justify-center text-xl">📄</div>
          <div>
             <h4 class="font-bold text-gray-800">Contratto #${contratto.idContratto} - ${contratto.tipo || 'Vendita'}</h4>
             <p class="text-sm text-gray-500">
                ${venditore ? venditore.cognome : 'N/A'} • ${immobile ? immobile.indirizzo : 'N/A'}
             </p>
          </div>
       </div>
       <div class="flex items-center gap-4">
          <div class="text-right hidden md:block">
             <p class="text-xs text-gray-400">Scadenza</p>
             <p class="text-sm font-semibold">${contratto.dataFine || 'N/A'}</p>
          </div>
          <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">${contratto.stato}</span>
          <button class="p-2 text-gray-400 hover:text-blue-600 transition view-contract-btn" data-id="${contratto.idContratto}">
             👁️
          </button>
          <button class="p-2 text-gray-400 hover:text-blue-600 transition edit-contratto-btn" data-id="${contratto.idContratto}">
             ✏️
          </button>
          <button class="p-2 text-gray-400 hover:text-red-600 transition delete-contratto-btn" data-id="${contratto.idContratto}">
             🗑️
          </button>
       </div>
    `;
    contractsList.appendChild(cardEl);
    
    const deleteBtn = cardEl.querySelector('.delete-contratto-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Eliminare il contratto ID ${contratto.idContratto}?`)) {
          await deleteContratto(contratto.idContratto);
          cardEl.remove();
        }
      });
    }

    const editBtn = cardEl.querySelector('.edit-contratto-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        openEditContractModal(contratto);
      });
    }
  });
}

// Popola i select del form contratto
function populateContractSelects() {
  const selectImmobile = document.getElementById('select-immobile');
  const selectVenditore = document.getElementById('select-venditore');

  if (selectImmobile) {
    selectImmobile.innerHTML = '<option value="">-- Seleziona un immobile --</option>';
    currentData.immobili.forEach(immobile => {
      const option = document.createElement('option');
      option.value = immobile.idImmobile;
      option.textContent = `${immobile.tipo} - ${immobile.indirizzo}, ${immobile.citta} (${immobile.metriQuadri}mq)`;
      option.dataset.immobile = JSON.stringify(immobile);
      selectImmobile.appendChild(option);
    });
  }

  if (selectVenditore) {
    selectVenditore.innerHTML = '<option value="">-- Seleziona un venditore --</option>';
    currentData.venditori.forEach(venditore => {
      const option = document.createElement('option');
      option.value = venditore.idVenditore;
      option.textContent = `${venditore.nome} ${venditore.cognome} - ${venditore.email}`;
      option.dataset.venditore = JSON.stringify(venditore);
      selectVenditore.appendChild(option);
    });
  }
}

// Imposta date di default
function setDefaultDates() {
  const dataInizio = document.getElementById('data-inizio');
  const dataFine = document.getElementById('data-fine');

  if (dataInizio) {
    const today = new Date();
    dataInizio.value = today.toISOString().split('T')[0];
  }

  if (dataFine) {
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    dataFine.value = sixMonthsLater.toISOString().split('T')[0];
  }
}

// Aggiorna contratto con dati immobile selezionato
function updateContractFromImmobile() {
  const select = document.getElementById('select-immobile');
  const selectedOption = select.options[select.selectedIndex];
  
  if (!selectedOption || !selectedOption.dataset.immobile) return;

  const immobile = JSON.parse(selectedOption.dataset.immobile);

  // Aggiorna campi del contratto
  document.getElementById('immobile-tipo').textContent = immobile.tipo || '';
  document.getElementById('immobile-indirizzo').textContent = immobile.indirizzo || '';
  document.getElementById('immobile-citta').textContent = immobile.citta || '';
  document.getElementById('immobile-provincia').textContent = immobile.provincia || '';
  document.getElementById('immobile-cap').textContent = immobile.cap || '';
  document.getElementById('immobile-mq').textContent = immobile.metriQuadri || '';
  document.getElementById('immobile-camere').textContent = immobile.camere || '';
  document.getElementById('immobile-bagni').textContent = immobile.bagni || '';
  document.getElementById('immobile-stato').textContent = immobile.stato || '';
  document.getElementById('immobile-prezzo').textContent = immobile.prezzo ? immobile.prezzo.toLocaleString() : '';
  document.getElementById('immobile-prezzo-num').textContent = immobile.prezzo || '';

  // Imposta prezzo minimo suggerito (90% del prezzo)
  if (immobile.prezzo) {
    const prezzoMinimo = Math.floor(immobile.prezzo * 0.9);
    document.getElementById('prezzo-minimo').value = prezzoMinimo;
    document.getElementById('contratto-prezzo-minimo').textContent = prezzoMinimo.toLocaleString();
  }
}

// Aggiorna contratto con dati venditore selezionato
function updateContractFromVenditore() {
  const select = document.getElementById('select-venditore');
  const selectedOption = select.options[select.selectedIndex];
  
  if (!selectedOption || !selectedOption.dataset.venditore) return;

  const venditore = JSON.parse(selectedOption.dataset.venditore);

  // Aggiorna campi del contratto
  document.getElementById('venditore-nome').textContent = `${venditore.nome} ${venditore.cognome}`;
  document.getElementById('venditore-citta').textContent = venditore.citta || '';
  document.getElementById('venditore-indirizzo').textContent = venditore.indirizzo || '';
  document.getElementById('venditore-cf').textContent = venditore.codiceFiscale || '';
  document.getElementById('venditore-tel').textContent = venditore.telefono || '';
  document.getElementById('venditore-email').textContent = venditore.email || '';
  
  // Campi che potrebbero non essere nel DB
  document.getElementById('venditore-luogo-nascita').textContent = '_______________';
  document.getElementById('venditore-data-nascita').textContent = '_______________';
}

// Anteprima contratto
function previewContract() {
  updateContractFields();
  alert('Contratto aggiornato! Scorri verso il basso per vedere l\'anteprima completa.');
  
  // Scroll al template
  document.getElementById('contract-template').scrollIntoView({ behavior: 'smooth' });
}

// Aggiorna tutti i campi del contratto
function updateContractFields() {
  // Date
  const dataInizio = document.getElementById('data-inizio').value;
  const dataFine = document.getElementById('data-fine').value;
  const prezzoMinimo = document.getElementById('prezzo-minimo').value;
  const commissione = document.getElementById('commissione').value;

  if (dataInizio) {
    const dataInizioFormatted = new Date(dataInizio).toLocaleDateString('it-IT');
    document.getElementById('contratto-data-inizio').textContent = dataInizioFormatted;
  }

  if (dataFine) {
    const dataFineFormatted = new Date(dataFine).toLocaleDateString('it-IT');
    document.getElementById('contratto-data-fine').textContent = dataFineFormatted;
  }

  if (prezzoMinimo) {
    document.getElementById('contratto-prezzo-minimo').textContent = parseInt(prezzoMinimo).toLocaleString();
  }

  if (commissione) {
    document.getElementById('contratto-commissione').textContent = commissione;
  }

  // Data firma
  const oggi = new Date().toLocaleDateString('it-IT');
  document.getElementById('firma-data').textContent = oggi;
  document.getElementById('firma-data-agenzia').textContent = oggi;
}

// Salva contratto
async function saveContract() {
  const selectImmobile = document.getElementById('select-immobile');
  const selectVenditore = document.getElementById('select-venditore');
  const dataInizio = document.getElementById('data-inizio').value;
  const dataFine = document.getElementById('data-fine').value;
  const prezzoMinimo = document.getElementById('prezzo-minimo').value;

  if (!selectImmobile.value || !selectVenditore.value || !dataInizio || !dataFine || !prezzoMinimo) {
    alert('Compila tutti i campi obbligatori');
    return;
  }

  const contractData = {
    idImmobile: parseInt(selectImmobile.value),
    idVenditore: parseInt(selectVenditore.value),
    tipo: 'vendita',
    esclusiva: true,
    dataInizio: dataInizio,
    dataFine: dataFine,
    prezzoFinaleMinimo: parseFloat(prezzoMinimo),
    stato: 'ATTIVO',
    note: 'Contratto generato da admin dashboard'
  };

  try {
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/contratti`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contractData)
      }
    );

    if (!response.ok) {
      throw new Error('Errore durante il salvataggio del contratto');
    }

    const savedContract = await response.json();
    console.log('Contratto salvato:', savedContract);
    
    // Ricarica i contratti
    await loadAllData();
    
    alert('Contratto salvato con successo!');
    showContractsList();
  } catch (error) {
    console.error('Errore salvataggio contratto:', error);
    alert('Errore durante il salvataggio del contratto');
  }
}

// Salva e invia contratto via email
async function saveAndSendContract() {
  await saveContract();
  
  const selectVenditore = document.getElementById('select-venditore');
  const selectedOption = selectVenditore.options[selectVenditore.selectedIndex];
  
  if (selectedOption && selectedOption.dataset.venditore) {
    const venditore = JSON.parse(selectedOption.dataset.venditore);
    
    // Simulazione invio email
    alert(`Contratto inviato via email a: ${venditore.email}\n\nNota: In produzione, qui verrà implementato l'invio email con il PDF del contratto allegato.`);
    
    // In produzione, qui chiameresti un endpoint backend per inviare l'email
    // await sendContractEmail(savedContract.idContratto, venditore.email);
  }
}

// Renderizza lista utenti
// Renderizza lista utenti (Design Card con Avatar)
function renderUtenti(utenti) {
  detailCards.innerHTML = ''; // Pulisci container
  
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

    const initials = (utente.nome[0] + utente.cognome[0]).toUpperCase();

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
        <button class="delete-btn text-red-500 hover:text-red-700 text-xs font-bold uppercase flex items-center gap-1" data-id="${utente.idUtente}">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Elimina
        </button>
      </div>
    `;
    detailCards.appendChild(cardEl);
    
    // Ricollega listener delete
    cardEl.querySelector('.delete-btn').addEventListener('click', async () => {
      if (confirm(`Eliminare utente ${utente.nome}?`)) {
        await deleteUtente(utente.idUtente);
        cardEl.remove();
      }
    });
  });
}

// Renderizza lista venditori
function renderVenditori(venditori) {
  venditori.forEach(venditore => {
    // Trova l'utente associato se esiste
    const utenteAssociato = currentData.utenti.find(u => u.idUtente === venditore.idUtente);
    const utenteBadge = utenteAssociato ? 
      `<span class="inline-block ml-2 px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded">👤 Utente ID: ${utenteAssociato.idUtente}</span>` : 
      '<span class="inline-block ml-2 px-2 py-1 text-xs font-semibold bg-gray-400 text-white rounded">Nessun utente associato</span>';
    
    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white p-4 rounded-xl shadow-md';
    cardEl.innerHTML = `
      <div class="flex items-start justify-between mb-2">
        <p class="text-sm text-gray-600"><strong>ID Venditore:</strong> ${venditore.idVenditore}</p>
        ${utenteBadge}
      </div>
      <p class="text-sm text-gray-600"><strong>Nome:</strong> ${venditore.nome} ${venditore.cognome || ''}</p>
      <p class="text-sm text-gray-600"><strong>Email:</strong> ${venditore.email || 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Telefono:</strong> ${venditore.telefono || 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Città:</strong> ${venditore.citta || 'N/A'} (${venditore.provincia || 'N/A'})</p>
      <p class="text-sm text-gray-600"><strong>Indirizzo:</strong> ${venditore.indirizzo || 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Codice Fiscale:</strong> ${venditore.codiceFiscale || 'N/A'}</p>
      ${utenteAssociato ? `<p class="text-sm text-blue-600 mt-2"><strong>Account utente:</strong> ${utenteAssociato.email}</p>` : ''}
      <div class="mt-3">
        <button class="delete-venditore-btn text-xs text-red-600 hover:text-red-800" data-id="${venditore.idVenditore}">Elimina venditore</button>
      </div>
    `;
    detailCards.appendChild(cardEl);
    
    // attach delete listener
    const deleteBtn = cardEl.querySelector('.delete-venditore-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Eliminare il venditore ${venditore.nome} ${venditore.cognome || ''}?`)) {
          await deleteVenditore(venditore.idVenditore);
          cardEl.remove();
        }
      });
    }
  });
}

// Renderizza lista immobili
function renderImmobili(immobili) {
  if (!detailCards) return;
  detailCards.innerHTML = '';
  detailCards.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
  
  if (immobili.length === 0) {
    detailCards.innerHTML = '<p class="col-span-full text-center text-gray-500">Nessun immobile trovato.</p>';
    return;
  }
  
  immobili.forEach(immobile => {
    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group';
    
    // Placeholder immagine colorato
    const placeholderColor = '274239'; // Verde scuro
    const imgUrl = `https://ui-avatars.com/api/?name=${immobile.tipo}&background=${placeholderColor}&color=fff&size=200&font-size=0.33`;

    cardEl.innerHTML = `
      <div class="h-32 bg-gray-100 relative overflow-hidden">
         <div class="absolute inset-0 flex items-center justify-center bg-my-green-dark/10">
            <span class="text-4xl opacity-20">🏠</span>
         </div>
         <div class="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm">
            ID: ${immobile.idImmobile}
         </div>
      </div>
      <div class="p-5">
        <div class="mb-3">
            <h4 class="font-bold text-lg text-my-black leading-tight">${immobile.indirizzo || 'Indirizzo mancante'}</h4>
            <p class="text-sm text-gray-500">${immobile.citta} (${immobile.provincia})</p>
        </div>
        
        <div class="grid grid-cols-3 gap-2 text-center py-3 border-t border-b border-gray-50 bg-gray-50/50 rounded-lg mb-3">
            <div><span class="block text-xs font-bold text-gray-400 uppercase">Mq</span><span class="font-semibold text-gray-700">${immobile.metriQuadri}</span></div>
            <div><span class="block text-xs font-bold text-gray-400 uppercase">Locali</span><span class="font-semibold text-gray-700">${immobile.camere || '-'}</span></div>
            <div><span class="block text-xs font-bold text-gray-400 uppercase">Bagni</span><span class="font-semibold text-gray-700">${immobile.bagni || '-'}</span></div>
        </div>

        <div class="flex justify-between items-center">
             <span class="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">${immobile.stato || 'N/A'}</span>
             <span class="font-bold text-my-green-dark text-lg">${immobile.prezzo ? '€ ' + immobile.prezzo.toLocaleString() : '-'}</span>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
          <button class="edit-immobile-btn w-1/2 text-xs text-blue-600 hover:text-blue-800 font-bold" data-id="${immobile.idImmobile}">✏️ Modifica immobile</button>
          <button class="delete-immobile-btn w-1/2 text-xs text-red-600 hover:text-red-800 font-bold" data-id="${immobile.idImmobile}">🗑️ Elimina immobile</button>
        </div>
      </div>
    `;
    detailCards.appendChild(cardEl);
    
    // attach delete listener
    const deleteBtn = cardEl.querySelector('.delete-immobile-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (confirm(`Eliminare l'immobile ID ${immobile.idImmobile}?`)) {
          await deleteImmobile(immobile.idImmobile);
          cardEl.remove();
        }
      });
    }

    // attach edit listener
    const editBtn = cardEl.querySelector('.edit-immobile-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        openEditImmobileModal(immobile);
      });
    }
  });
}


// Renderizza lista valutazioni
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
                  <button class="p-2 text-gray-400 hover:text-blue-600 transition edit-valutazione-btn" data-id="${val.idValutazione}">
                    ✏️
                  </button>
                  <button class="p-2 text-gray-400 hover:text-red-600 transition delete-valutazione-btn" data-id="${val.idValutazione}">
                    🗑️
                  </button>
            </div>
        `;
        detailCards.appendChild(cardEl);
        
        // attach delete listener
        const deleteBtn = cardEl.querySelector('.delete-valutazione-btn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', async () => {
            if (confirm(`Eliminare la valutazione ID ${val.idValutazione}?`)) {
              await deleteValutazione(val.idValutazione);
              cardEl.remove();
            }
          });
        }

        // attach edit listener
        const editBtn = cardEl.querySelector('.edit-valutazione-btn');
        if (editBtn) {
          editBtn.addEventListener('click', () => {
            openEditValutazioneModal(val);
          });
        }
    });
}

// Elimina un utente
async function deleteUtente(idUtente) {
  try {
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/utenti/${idUtente}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Errore eliminazione utente');
    }

    console.log('Utente eliminato con successo');
    currentData.utenti = currentData.utenti.filter(u => u.idUtente !== idUtente);
  } catch (error) {
    console.error('Errore eliminazione utente:', error);
    alert('Errore durante l\'eliminazione dell\'utente');
  }
}

// Click X per tornare all'overview
if (closeBtn) {
  closeBtn.addEventListener('click', () => showCards());
}

// Elimina un venditore
async function deleteVenditore(idVenditore) {
  try {
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/venditori/${idVenditore}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Errore eliminazione venditore');
    }

    console.log('Venditore eliminato con successo');
    currentData.venditori = currentData.venditori.filter(v => v.idVenditore !== idVenditore);
    // aggiorna contatore
    updateCount('venditori', currentData.venditori.length);
  } catch (error) {
    console.error('Errore eliminazione venditore:', error);
    alert('Errore durante l\'eliminazione del venditore');
  }
}

// Elimina un immobile
async function deleteImmobile(idImmobile) {
  try {
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/immobili/${idImmobile}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Errore eliminazione immobile');
    }

    console.log('Immobile eliminato con successo');
    currentData.immobili = currentData.immobili.filter(i => i.idImmobile !== idImmobile);
    updateCount('immobili', currentData.immobili.length);
  } catch (error) {
    console.error('Errore eliminazione immobile:', error);
    alert('Errore durante l\'eliminazione dell\'immobile');
  }
}

// Elimina una valutazione
async function deleteValutazione(idValutazione) {
  try {
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/valutazioni/${idValutazione}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Errore eliminazione valutazione');
    }

    console.log('Valutazione eliminata con successo');
    currentData.valutazioni = currentData.valutazioni.filter(v => v.idValutazione !== idValutazione);
    updateCount('valutazioni', currentData.valutazioni.length);
  } catch (error) {
    console.error('Errore eliminazione valutazione:', error);
    alert('Errore durante l\'eliminazione della valutazione');
  }
}

// Elimina un contratto
async function deleteContratto(idContratto) {
  try {
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/contratti/${idContratto}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      throw new Error('Errore eliminazione contratto');
    }

    console.log('Contratto eliminato con successo');
    currentData.contratti = currentData.contratti.filter(c => c.idContratto !== idContratto);
  } catch (error) {
    console.error('Errore eliminazione contratto:', error);
    alert('Errore durante l\'eliminazione del contratto');
  }
}

// Apri modal per modificare immobile
function openEditImmobileModal(immobile) {
  // crea overlay
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';

  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-96 overflow-y-auto';
  modal.style.cssText = 'position:relative;background:white;border-radius:8px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);padding:24px;width:100%;max-width:42rem;max-height:400px;overflow-y:auto;';

  modal.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold">Modifica Immobile ID ${immobile.idImmobile}</h3>
      <button id="edit-imm-close" style="font-size:24px;cursor:pointer;border:none;background:none;color:#666;">×</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Indirizzo</label>
        <input id="edit-imm-indirizzo" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.indirizzo || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Città</label>
        <input id="edit-imm-citta" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.citta || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Provincia</label>
        <input id="edit-imm-provincia" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.provincia || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">CAP</label>
        <input id="edit-imm-cap" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.cap || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Metri quadri</label>
        <input id="edit-imm-mq" type="number" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.metriQuadri || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Camere</label>
        <input id="edit-imm-camere" type="number" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.camere || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Bagni</label>
        <input id="edit-imm-bagni" type="number" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.bagni || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Prezzo</label>
        <input id="edit-imm-prezzo" type="number" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.prezzo || ''}">
      </div>
      <div class="md:col-span-2">
        <label class="block text-xs text-gray-600 font-semibold mb-1">Descrizione</label>
        <textarea id="edit-imm-desc" class="w-full border border-gray-300 rounded px-2 py-2">${immobile.descrizione || ''}</textarea>
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Tipo</label>
        <input id="edit-imm-tipo" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.tipo || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Stato</label>
        <input id="edit-imm-stato" class="w-full border border-gray-300 rounded px-2 py-2" value="${immobile.stato || ''}">
      </div>
    </div>
    <div class="mt-6 flex justify-end gap-2">
      <button id="edit-imm-cancel" style="padding:10px 16px;background:#e5e7eb;border:none;border-radius:6px;cursor:pointer;font-weight:500;">Annulla</button>
      <button id="edit-imm-save" style="padding:10px 16px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:500;">Salva</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // listeners
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  modal.querySelector('#edit-imm-close').addEventListener('click', () => overlay.remove());
  modal.querySelector('#edit-imm-cancel').addEventListener('click', () => overlay.remove());
  
  modal.querySelector('#edit-imm-save').addEventListener('click', async () => {
    const updated = {
      indirizzo: document.getElementById('edit-imm-indirizzo').value.trim(),
      citta: document.getElementById('edit-imm-citta').value.trim(),
      provincia: document.getElementById('edit-imm-provincia').value.trim(),
      cap: document.getElementById('edit-imm-cap').value.trim(),
      metriQuadri: parseFloat(document.getElementById('edit-imm-mq').value) || null,
      camere: parseInt(document.getElementById('edit-imm-camere').value) || null,
      bagni: parseInt(document.getElementById('edit-imm-bagni').value) || null,
      prezzo: parseFloat(document.getElementById('edit-imm-prezzo').value) || null,
      descrizione: document.getElementById('edit-imm-desc').value.trim(),
      tipo: document.getElementById('edit-imm-tipo').value.trim(),
      stato: document.getElementById('edit-imm-stato').value.trim()
    };

    try {
      const updatedImmobile = await updateImmobile(immobile.idImmobile, updated);
      // Aggiorna currentData
      currentData.immobili = currentData.immobili.map(i => i.idImmobile === updatedImmobile.idImmobile ? updatedImmobile : i);
      // Rirenderizza la vista
      renderImmobili(currentData.immobili);
      overlay.remove();
      alert('Immobile aggiornato con successo');
    } catch (e) {
      console.error('Errore aggiornamento immobile:', e);
      alert('Errore durante l\'aggiornamento dell\'immobile');
    }
  });
}

// Aggiorna immobile (PATCH)
async function updateImmobile(idImmobile, data) {
  try {
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/immobili/${idImmobile}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(txt || 'Errore update immobile');
    }

    const updated = await response.json();
    return updated;
  } catch (error) {
    throw error;
  }
}

// Apri modal per modificare una valutazione
function openEditValutazioneModal(val) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';

  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-96 overflow-y-auto';
  modal.style.cssText = 'position:relative;background:white;border-radius:8px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);padding:24px;width:100%;max-width:36rem;max-height:480px;overflow-y:auto;';

  // stato options (adatta se necessario)
  const stati = ['RICHIESTA','IN_CORSO','COMPLETATA','ANNULLATA'];

  modal.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold">Modifica Valutazione ID ${val.idValutazione}</h3>
      <button id="edit-val-close" style="font-size:24px;cursor:pointer;border:none;background:none;color:#666;">×</button>
    </div>
    <div class="grid grid-cols-1 gap-3">
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Valore Stimato (€)</label>
        <input id="edit-val-valore" type="number" class="w-full border border-gray-300 rounded px-2 py-2" value="${val.valoreStimato || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Stato</label>
        <select id="edit-val-stato" class="w-full border border-gray-300 rounded px-2 py-2">
          ${stati.map(s => `<option value="${s}" ${val.stato === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Note</label>
        <textarea id="edit-val-note" class="w-full border border-gray-300 rounded px-2 py-2">${val.note || val.noteValutazione || ''}</textarea>
      </div>
    </div>
    <div class="mt-6 flex justify-end gap-2">
      <button id="edit-val-cancel" style="padding:10px 16px;background:#e5e7eb;border:none;border-radius:6px;cursor:pointer;font-weight:500;">Annulla</button>
      <button id="edit-val-save" style="padding:10px 16px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:500;">Salva</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // listeners
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  modal.querySelector('#edit-val-close').addEventListener('click', () => overlay.remove());
  modal.querySelector('#edit-val-cancel').addEventListener('click', () => overlay.remove());

  modal.querySelector('#edit-val-save').addEventListener('click', async () => {
    const updated = {
      valoreStimato: parseFloat(document.getElementById('edit-val-valore').value) || null,
      stato: document.getElementById('edit-val-stato').value.trim(),
      note: document.getElementById('edit-val-note').value.trim()
    };

    try {
      const updatedVal = await updateValutazione(val.idValutazione, updated);
      // Aggiorna currentData
      currentData.valutazioni = currentData.valutazioni.map(v => v.idValutazione === updatedVal.idValutazione ? updatedVal : v);
      // Rirenderizza la vista
      renderValutazioni(currentData.valutazioni);
      overlay.remove();
      alert('Valutazione aggiornata con successo');
    } catch (e) {
      console.error('Errore aggiornamento valutazione:', e);
      alert('Errore durante l\'aggiornamento della valutazione');
    }
  });
}

// Aggiorna valutazione (PATCH)
async function updateValutazione(idValutazione, data) {
  try {
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/valutazioni/${idValutazione}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(txt || 'Errore update valutazione');
    }

    const updated = await response.json();
    return updated;
  } catch (error) {
    throw error;
  }
}

// Apri modal per modificare un contratto
function openEditContractModal(contratto) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';

  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-96 overflow-y-auto';
  modal.style.cssText = 'position:relative;background:white;border-radius:8px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1);padding:24px;width:100%;max-width:42rem;max-height:500px;overflow-y:auto;';

  const stati = ['ATTIVO', 'COMPLETATO', 'ANNULLATO'];

  modal.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold">Modifica Contratto ID ${contratto.idContratto}</h3>
      <button id="edit-contr-close" style="font-size:24px;cursor:pointer;border:none;background:none;color:#666;">×</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Tipo</label>
        <input id="edit-contr-tipo" class="w-full border border-gray-300 rounded px-2 py-2" value="${contratto.tipo || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Stato</label>
        <select id="edit-contr-stato" class="w-full border border-gray-300 rounded px-2 py-2">
          ${stati.map(s => `<option value="${s}" ${contratto.stato === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Data Inizio</label>
        <input id="edit-contr-datainizio" type="date" class="w-full border border-gray-300 rounded px-2 py-2" value="${contratto.dataInizio || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Data Fine</label>
        <input id="edit-contr-datafine" type="date" class="w-full border border-gray-300 rounded px-2 py-2" value="${contratto.dataFine || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Prezzo Finale Minimo</label>
        <input id="edit-contr-prezzo" type="number" class="w-full border border-gray-300 rounded px-2 py-2" value="${contratto.prezzoFinaleMinimo || ''}">
      </div>
      <div>
        <label class="block text-xs text-gray-600 font-semibold mb-1">Esclusiva</label>
        <input id="edit-contr-esclusiva" type="checkbox" class="w-4 h-4 border border-gray-300 rounded" ${contratto.esclusiva ? 'checked' : ''}>
      </div>
      <div class="md:col-span-2">
        <label class="block text-xs text-gray-600 font-semibold mb-1">Note</label>
        <textarea id="edit-contr-note" class="w-full border border-gray-300 rounded px-2 py-2">${contratto.note || ''}</textarea>
      </div>
    </div>
    <div class="mt-6 flex justify-end gap-2">
      <button id="edit-contr-cancel" style="padding:10px 16px;background:#e5e7eb;border:none;border-radius:6px;cursor:pointer;font-weight:500;">Annulla</button>
      <button id="edit-contr-save" style="padding:10px 16px;background:#2563eb;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:500;">Salva</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // listeners
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  modal.querySelector('#edit-contr-close').addEventListener('click', () => overlay.remove());
  modal.querySelector('#edit-contr-cancel').addEventListener('click', () => overlay.remove());

  modal.querySelector('#edit-contr-save').addEventListener('click', async () => {
    const updated = {
      tipo: document.getElementById('edit-contr-tipo').value.trim(),
      stato: document.getElementById('edit-contr-stato').value.trim(),
      dataInizio: document.getElementById('edit-contr-datainizio').value.trim(),
      dataFine: document.getElementById('edit-contr-datafine').value.trim(),
      prezzoFinaleMinimo: parseFloat(document.getElementById('edit-contr-prezzo').value) || null,
      esclusiva: document.getElementById('edit-contr-esclusiva').checked,
      note: document.getElementById('edit-contr-note').value.trim()
    };

    try {
      const updatedContratto = await updateContract(contratto.idContratto, updated);
      // Aggiorna currentData
      currentData.contratti = currentData.contratti.map(c => c.idContratto === updatedContratto.idContratto ? updatedContratto : c);
      // Rirenderizza la lista
      renderContractsList();
      overlay.remove();
      alert('Contratto aggiornato con successo');
    } catch (e) {
      console.error('Errore aggiornamento contratto:', e);
      alert('Errore durante l\'aggiornamento del contratto');
    }
  });
}

// Aggiorna contratto (PATCH)
async function updateContract(idContratto, data) {
  try {
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/contratti/${idContratto}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(txt || 'Errore update contratto');
    }

    const updated = await response.json();
    return updated;
  } catch (error) {
    throw error;
  }
}