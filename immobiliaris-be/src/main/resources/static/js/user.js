/**
 * User Dashboard - Area Personale Utente
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Proteggi la pagina: solo utenti autenticati
  if (!protectPage()) {
    return;
  }

  // Carica i dati dell'utente
  await loadUserData();
  
  // Carica valutazioni e immobili
  await loadUserValutazioni();

  // Gestione logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  // Interazioni con le card degli immobili (se presenti)
  document.querySelectorAll('.immobile-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const overlay = card.querySelector('.immobile-overlay');
      if (overlay) overlay.classList.add('opacity-100');
    });
    card.addEventListener('mouseleave', () => {
      const overlay = card.querySelector('.immobile-overlay');
      if (overlay) overlay.classList.remove('opacity-100');
    });
  });
});

/**
 * Carica i dati dell'utente corrente dal backend
 */
async function loadUserData() {
  try {
    const user = getUser();
    
    if (!user) {
      logout();
      return;
    }

    // Aggiorna UI con dati utente
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    const userInitialsEl = document.getElementById('user-initials');

    if (userNameEl) {
      userNameEl.textContent = `${user.nome} ${user.cognome}`;
    }

    if (userEmailEl) {
      userEmailEl.textContent = user.email;
    }

    if (userInitialsEl) {
      const initials = `${user.nome.charAt(0)}${user.cognome.charAt(0)}`.toUpperCase();
      userInitialsEl.textContent = initials;
    }

    // Opzionale: verifica token con il backend
    await verifyToken();

  } catch (error) {
    console.error('Errore caricamento dati utente:', error);
    showError('Errore nel caricamento dei dati');
  }
}

/**
 * Verifica la validità del token con il backend
 */
async function verifyToken() {
  try {
    const response = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/auth/validate`);
    
    if (!response.ok) {
      throw new Error('Token non valido');
    }

    const data = await response.json();
    console.log('Token valido:', data);

  } catch (error) {
    console.error('Errore verifica token:', error);
    // Se il token non è valido, logout automatico (già gestito in authenticatedFetch)
  }
}

/**
 * Carica le valutazioni dell'utente
 */
async function loadUserValutazioni() {
  try {
    const user = getUser();
    const response = await authenticatedFetch(
      `${AUTH_CONFIG.API_BASE_URL}/valutazioni/utente/${user.idUtente}`
    );

    if (!response.ok) {
      throw new Error('Errore nel caricamento delle valutazioni');
    }

    const valutazioni = await response.json();
    console.log('Valutazioni utente:', valutazioni);

    // Render valutazioni
    renderValutazioni(valutazioni);
    
    // Carica anche gli immobili
    await loadUserImmobili(valutazioni);

  } catch (error) {
    console.error('Errore caricamento valutazioni:', error);
    const container = document.getElementById('valutazioni-container');
    if (container) {
      container.innerHTML = '<div class="text-center py-8 text-gray-500"><p>Nessuna valutazione trovata</p></div>';
    }
  }
}

/**
 * Renderizza le valutazioni
 */
function renderValutazioni(valutazioni) {
  const container = document.getElementById('valutazioni-container');
  if (!container) return;

  if (!valutazioni || valutazioni.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-xl shadow-md text-center">
        <p class="text-gray-600 mb-4">Non hai ancora valutazioni</p>
        <a href="/index.html" class="inline-block px-6 py-2 bg-my-orange text-white rounded-lg hover:bg-[#a35728] transition">Richiedi una valutazione</a>
      </div>
    `;
    return;
  }

  const html = valutazioni.map(val => {
    const statoClass = getStatoClass(val.stato);
    const statoText = getStatoText(val.stato);
    const dataRichiesta = new Date(val.dataRichiesta).toLocaleDateString('it-IT');
    const dataCompletamento = val.dataCompletamento ? new Date(val.dataCompletamento).toLocaleDateString('it-IT') : 'In attesa';
    
    return `
      <div class="bg-white p-6 rounded-xl shadow-md mb-4">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-lg">Valutazione #${val.idValutazione}</h3>
            <p class="text-sm text-gray-500">Richiesta il ${dataRichiesta}</p>
          </div>
          <span class="px-3 py-1 ${statoClass} rounded-full text-sm font-semibold">${statoText}</span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p class="text-gray-500 text-sm">Valore Stimato</p>
            <p class="font-bold text-2xl text-my-orange">€${val.valoreStimato?.toLocaleString('it-IT') || 'N/A'}</p>
          </div>
          <div>
            <p class="text-gray-500 text-sm">Valore Base Zona</p>
            <p class="font-semibold text-lg text-gray-700">€${val.valoreCalcolatoZona?.toLocaleString('it-IT') || 'N/A'}</p>
          </div>
        </div>
        
        ${val.dataCompletamento ? `<p class="text-sm text-gray-600">Completata il ${dataCompletamento}</p>` : ''}
        ${val.note ? `<p class="text-sm text-gray-600 mt-2"><em>${val.note}</em></p>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * Carica gli immobili collegati alle valutazioni
 */
async function loadUserImmobili(valutazioni) {
  const container = document.getElementById('immobili-container');
  if (!container) return;

  try {
    // Estrai gli ID immobili unici
    const immobiliIds = [...new Set(valutazioni.map(v => v.idImmobile))];
    
    if (immobiliIds.length === 0) {
      container.innerHTML = '<div class="text-center py-8 text-gray-500 col-span-full"><p>Nessun immobile trovato</p></div>';
      return;
    }

    // Carica i dettagli degli immobili
    const immobiliPromises = immobiliIds.map(id => 
      authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/immobili/${id}`).then(r => r.json())
    );
    
    const immobili = await Promise.all(immobiliPromises);
    renderImmobili(immobili, valutazioni);

  } catch (error) {
    console.error('Errore caricamento immobili:', error);
    container.innerHTML = '<div class="text-center py-8 text-gray-500 col-span-full"><p>Errore nel caricamento degli immobili</p></div>';
  }
}

/**
 * Renderizza gli immobili
 */
function renderImmobili(immobili, valutazioni) {
  const container = document.getElementById('immobili-container');
  if (!container) return;

  const html = immobili.map(imm => {
    const valutazione = valutazioni.find(v => v.idImmobile === imm.idImmobile);
    const dataValutazione = valutazione ? new Date(valutazione.dataRichiesta).toLocaleDateString('it-IT') : 'N/A';
    
    return `
      <div class="immobile-card bg-white p-6 rounded-2xl shadow-lg relative">
        <h3 class="font-bold text-lg mb-4">${imm.indirizzo || 'Indirizzo non disponibile'}</h3>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div><p class="text-gray-500 text-sm">Superficie</p><p class="font-semibold">${imm.metriQuadri || 'N/A'} m²</p></div>
          <div><p class="text-gray-500 text-sm">Camere</p><p class="font-semibold">${imm.camere || 'N/A'}</p></div>
          <div><p class="text-gray-500 text-sm">Bagni</p><p class="font-semibold">${imm.bagni || 'N/A'}</p></div>
          <div><p class="text-gray-500 text-sm">Tipo</p><p class="font-semibold">${imm.tipo || 'N/A'}</p></div>
        </div>
        
        <div><p class="text-gray-500 text-sm">Città</p><p class="font-semibold">${imm.citta || 'N/A'}, ${imm.provincia || ''} - ${imm.cap || ''}</p></div>
        
        <div class="immobile-overlay rounded-2xl">
          <p class="text-lg mb-2">Valutazione del <strong>${dataValutazione}</strong></p>
          ${valutazione ? `<p class="text-sm opacity-90">Valore: <strong>€${valutazione.valoreStimato?.toLocaleString('it-IT')}</strong></p>` : ''}
          <p class="text-sm opacity-90 mt-2">${imm.descrizione || 'Nessuna descrizione'}</p>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * Ottieni classe CSS per stato valutazione
 */
function getStatoClass(stato) {
  switch(stato) {
    case 'COMPLETATA': return 'bg-green-100 text-green-800';
    case 'IN_ATTESA': return 'bg-yellow-100 text-yellow-800';
    case 'IN_LAVORAZIONE': return 'bg-blue-100 text-blue-800';
    case 'ANNULLATA': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Ottieni testo italiano per stato valutazione
 */
function getStatoText(stato) {
  switch(stato) {
    case 'COMPLETATA': return 'Completata';
    case 'IN_ATTESA': return 'In Attesa';
    case 'IN_LAVORAZIONE': return 'In Lavorazione';
    case 'ANNULLATA': return 'Annullata';
    default: return stato;
  }
}
