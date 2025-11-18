/**
 * Admin Dashboard - Gestione area amministrativa con chiamate API
 */

const overview = document.getElementById('overview');
const detailView = document.getElementById('detail-view');
const detailCards = document.getElementById('detail-cards');
const detailTitle = document.getElementById('detail-title');
const closeBtn = document.getElementById('close-overview');
const sidebarLinks = document.querySelectorAll('aside nav a');

let currentData = {
  utenti: [],
  immobili: [],
  valutazioni: []
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
    }

    const immobiliResponse = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/immobili`);
    if (immobiliResponse.ok) {
      currentData.immobili = await immobiliResponse.json();
      console.log('Immobili caricati:', currentData.immobili);
    }

    const valutazioniResponse = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/valutazioni`);
    if (valutazioniResponse.ok) {
      currentData.valutazioni = await valutazioniResponse.json();
      console.log('Valutazioni caricate:', currentData.valutazioni);
    }
  } catch (error) {
    console.error('Errore caricamento dati:', error);
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
    });
  });
}

// Mostra le card principali (overview)
function showCards(type = null) {
  if (!overview) return;
  overview.classList.remove('hidden');
  if (detailView) detailView.classList.add('hidden');
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
  
  detailTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);
  detailCards.innerHTML = '';

  switch(type) {
    case 'utenti':
      renderUtenti(currentData.utenti);
      break;
    case 'immobili':
      renderImmobili(currentData.immobili);
      break;
    case 'valutazioni':
      renderValutazioni(currentData.valutazioni);
      break;
  }

  if (overview) overview.classList.add('hidden');
  detailView.classList.remove('hidden');
  if (closeBtn) closeBtn.classList.remove('hidden');
}

// Renderizza lista utenti
function renderUtenti(utenti) {
  utenti.forEach(utente => {
    const cardEl = document.createElement('div');
    cardEl.className = 'bg-white p-4 rounded-xl shadow-md';
    cardEl.innerHTML = `
      <p class="text-sm text-gray-600"><strong>ID:</strong> ${utente.idUtente}</p>
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
