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
      else if (text.includes('preventivi')) showDetailView('immobili');
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
    contractsList.innerHTML = '<p class="text-gray-600">Nessun contratto presente</p>';
    return;
  }

  currentData.contratti.forEach(contratto => {
    const immobile = currentData.immobili.find(i => i.idImmobile === contratto.idImmobile);
    const venditore = currentData.venditori.find(v => v.idVenditore === contratto.idVenditore);

    const statusClass = contratto.stato === 'ATTIVO' ? 'text-green-600' : 
                       contratto.stato === 'COMPLETATO' ? 'text-blue-600' : 'text-red-600';

    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white p-6 rounded-xl shadow-md';
    cardEl.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <p class="text-sm text-gray-600"><strong>ID Contratto:</strong> ${contratto.idContratto}</p>
          <p class="text-sm text-gray-600"><strong>Tipo:</strong> ${contratto.tipo || 'Vendita'}</p>
          <p class="text-sm text-gray-600"><strong>Immobile:</strong> ${immobile ? `${immobile.tipo} - ${immobile.indirizzo}, ${immobile.citta}` : 'N/A'}</p>
          <p class="text-sm text-gray-600"><strong>Venditore:</strong> ${venditore ? `${venditore.nome} ${venditore.cognome}` : 'N/A'}</p>
          <p class="text-sm text-gray-600"><strong>Data Inizio:</strong> ${contratto.dataInizio || 'N/A'}</p>
          <p class="text-sm text-gray-600"><strong>Data Fine:</strong> ${contratto.dataFine || 'N/A'}</p>
          <p class="text-sm text-gray-600"><strong>Prezzo Minimo:</strong> ${contratto.prezzoFinaleMinimo ? '€' + contratto.prezzoFinaleMinimo.toLocaleString() : 'N/A'}</p>
          <p class="text-sm ${statusClass}"><strong>Stato:</strong> ${contratto.stato}</p>
          <p class="text-sm text-gray-600"><strong>Esclusiva:</strong> ${contratto.esclusiva ? 'Sì' : 'No'}</p>
        </div>
        <button class="view-contract-btn text-blue-600 hover:text-blue-800 text-sm" data-id="${contratto.idContratto}">
          👁️ Visualizza
        </button>
      </div>
    `;

    contractsList.appendChild(cardEl);
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
function renderUtenti(utenti) {
  utenti.forEach(utente => {
    // Verifica se l'utente è anche un venditore
    const isVenditore = currentData.venditori.some(v => v.idUtente === utente.idUtente);
    const venditoreBadge = isVenditore ? 
      '<span class="inline-block ml-2 px-2 py-1 text-xs font-semibold bg-my-orange text-white rounded">🏠 Venditore</span>' : '';
    
    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white p-4 rounded-xl shadow-md';
    cardEl.innerHTML = `
      <div class="flex items-start justify-between mb-2">
        <p class="text-sm text-gray-600"><strong>ID:</strong> ${utente.idUtente}</p>
        ${venditoreBadge}
      </div>
      <p class="text-sm text-gray-600"><strong>Nome:</strong> ${utente.nome} ${utente.cognome}</p>
      <p class="text-sm text-gray-600"><strong>Email:</strong> ${utente.email}</p>
      <p class="text-sm text-gray-600"><strong>Telefono:</strong> ${utente.telefono || 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Ruolo:</strong> ${utente.idRuolo === 2 ? 'Admin' : 'Utente'}</p>
      <button class="delete-btn text-xs text-red-600 hover:text-red-800 mt-2" data-id="${utente.idUtente}">Elimina</button>
    `;
    detailCards.appendChild(cardEl);
    
    cardEl.querySelector('.delete-btn').addEventListener('click', async () => {
      if (confirm(`Eliminare utente ${utente.nome} ${utente.cognome}?`)) {
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
    `;
    detailCards.appendChild(cardEl);
  });
}

// Renderizza lista immobili
function renderImmobili(immobili) {
  immobili.forEach(immobile => {
    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white p-4 rounded-xl shadow-md';
    cardEl.innerHTML = `
      <p class="text-sm text-gray-600"><strong>ID:</strong> ${immobile.idImmobile}</p>
      <p class="text-sm text-gray-600"><strong>Tipo:</strong> ${immobile.tipo || 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Indirizzo:</strong> ${immobile.indirizzo || 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Città:</strong> ${immobile.citta || 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Superficie:</strong> ${immobile.metriQuadri} m²</p>
      <p class="text-sm text-gray-600"><strong>Camere:</strong> ${immobile.camere || 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Bagni:</strong> ${immobile.bagni || 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Prezzo:</strong> ${immobile.prezzo ? '€' + immobile.prezzo.toLocaleString() : 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Stato:</strong> ${immobile.stato || 'N/A'}</p>
    `;
    detailCards.appendChild(cardEl);
  });
}

// Renderizza lista valutazioni
function renderValutazioni(valutazioni) {
  valutazioni.forEach(val => {
    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white p-4 rounded-xl shadow-md';
    const statusClass = val.stato === 'COMPLETATA' ? 'text-green-600' : 
                       val.stato === 'ANNULLATA' ? 'text-red-600' : 'text-yellow-600';
    cardEl.innerHTML = `
      <p class="text-sm text-gray-600"><strong>ID:</strong> ${val.idValutazione}</p>
      <p class="text-sm text-gray-600"><strong>ID Immobile:</strong> ${val.idImmobile}</p>
      <p class="text-sm text-gray-600"><strong>Data:</strong> ${val.dataRichiesta ? new Date(val.dataRichiesta).toLocaleDateString() : 'N/A'}</p>
      <p class="text-sm ${statusClass}"><strong>Stato:</strong> ${val.stato}</p>
      <p class="text-sm text-gray-600"><strong>Valore Stimato:</strong> ${val.valoreStimato ? '€' + val.valoreStimato.toLocaleString() : 'N/A'}</p>
      <p class="text-sm text-gray-600"><strong>Valore Zona:</strong> ${val.valoreCalcolatoZona ? '€' + val.valoreCalcolatoZona.toLocaleString() : 'N/A'}</p>
    `;
    detailCards.appendChild(cardEl);
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