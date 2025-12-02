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
}

function setupSidebarNavigation() {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            setActiveSidebarLink(link);
            const text = link.textContent.toLowerCase();
            if (text.includes('dashboard')) showCards();
            else if (text.includes('utenti')) showDetailView('utenti');
            else if (text.includes('venditori')) showDetailView('utenti'); 
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
}

function hideAllViews() {
  if (overview) overview.classList.add('hidden');
  if (detailView) detailView.classList.add('hidden');
  if (contractsView) contractsView.classList.add('hidden');
  if (contractsListView) contractsListView.classList.add('hidden');
  if (contractFormView) contractFormView.classList.add('hidden');
}

function showCards() {
  hideAllViews();
  if (overview) overview.classList.remove('hidden');
  const dashboardLink = Array.from(sidebarLinks).find(link => link.textContent.toLowerCase().includes('dashboard'));
  if (dashboardLink) setActiveSidebarLink(dashboardLink);
}

function showDetailView(type) {
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
  
  const activeLink = Array.from(sidebarLinks).find(link => {
    const text = link.textContent.toLowerCase();
    return text.includes(type);
  });
  if (activeLink) setActiveSidebarLink(activeLink);
}

function showContractsView() {
  hideAllViews();
  if (contractsView) contractsView.classList.remove('hidden');
  const contractsLink = Array.from(sidebarLinks).find(link => link.textContent.toLowerCase().includes('contratti'));
  if (contractsLink) setActiveSidebarLink(contractsLink);
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

function openContractForView(contratto) {
  showContractForm();

  const selImm = document.getElementById('select-immobile');
  const selVend = document.getElementById('select-venditore');

  // Attendi popolamento select
  setTimeout(() => {
    if (selImm) {
      selImm.value = contratto.idImmobile;
      updateContractFromImmobile();
    }
    if (selVend) {
      selVend.value = contratto.idVenditore;
      updateContractFromVenditore();
    }

    if (document.getElementById('data-inizio')) {
      document.getElementById('data-inizio').value = contratto.dataInizio;
    }
    if (document.getElementById('data-fine')) {
      document.getElementById('data-fine').value = contratto.dataFine;
    }
    if (document.getElementById('prezzo-minimo')) {
      document.getElementById('prezzo-minimo').value = contratto.prezzoFinaleMinimo;
    }

    updateContractFields();
  }, 100);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
          <div class="w-10 h-10  rounded text-blue-600 flex items-center justify-center text-xl">
              <img src="./assets/contratto.png" class="w-6 h-6" alt="Doc">
          </div>
          <div>
             <h4 class="font-bold text-gray-800">Contratto #${contratto.idContratto} - ${contratto.tipo || 'Vendita'}</h4>
             <p class="text-sm text-gray-500">
                ${venditore ? venditore.cognome : 'N/A'} • ${immobile ? immobile.indirizzo : 'N/A'}
             </p>
          </div>
       </div>
       
       <div class="flex items-center gap-3">
          <div class="text-right hidden md:block mr-2">
             <p class="text-xs text-gray-400">Scadenza</p>
             <p class="text-sm text-my-orange font-bold">${contratto.dataFine || 'N/A'}</p>
          </div>
          
          <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200">${contratto.stato}</span>
          
          <button class="p-2 text-gray-400 hover:text-my-green-light-600 hover:bg-blue-50 rounded-lg transition view-contract-btn" title="Visualizza" data-id="${contratto.idContratto}">
             <img src="./assets/occhio.png" class="w-5 h-5 opacity-70 hover:opacity-100" alt="Vedi">
          </button>
          
          <button class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition edit-contratto-btn" title="Modifica" data-id="${contratto.idContratto}">
             <img src="./assets/matita.png" class="w-5 h-5 opacity-70 hover:opacity-100" alt="Modifica">
          </button>
          
          <button class="p-2 text-gray-400 hover:text-red-300 hover:bg-red-50 rounded-lg transition delete-contratto-btn" title="Elimina" data-id="${contratto.idContratto}">
             <img src="./assets/elimina.png" class="w-5 h-5 opacity-70 hover:opacity-100" alt="Elimina">
          </button>
       </div>
    `;
    contractsList.appendChild(cardEl);
    
    const viewBtn = cardEl.querySelector('.view-contract-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        openContractForView(contratto);
      });
    }
    
    // LISTENER ELIMINA (Con Modale Premium)
    const deleteBtn = cardEl.querySelector('.delete-contratto-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita click involontari sulla card
        
        // Info aggiuntiva da mostrare nella modale (es. Tipo contratto)
        const infoExtra = `Tipo: ${contratto.tipo || 'Generico'}`;

        // Apre la modale personalizzata
        openDeleteModal(contratto.idContratto, 'Contratto', infoExtra, async () => {
            try {
                await deleteContratto(contratto.idContratto);
                
                // Animazione di rimozione elegante
                cardEl.style.transition = 'all 0.3s ease';
                cardEl.style.opacity = '0';
                cardEl.style.transform = 'scale(0.9)';
                setTimeout(() => cardEl.remove(), 300);
                
            } catch (err) {
                console.error(err);
                alert("Errore eliminazione: " + err.message);
            }
        });
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

function renderUtenti(utenti) {
  if (!detailCards) return;
  detailCards.innerHTML = ''; 
  
  if(utenti.length === 0) {
      detailCards.innerHTML = '<p class="col-span-full text-center text-gray-500">Nessun utente trovato.</p>';
      return;
  }

  utenti.forEach(utente => {
    const isVenditore = currentData.venditori.some(v => v.idUtente === utente.idUtente);
    const badgeRuolo = utente.idRuolo === 2 
        ? '<span class="px-2 py-0.5 text-my-green-light text-xs font-bold rounded uppercase border border-my-green-light/20">Admin</span>' 
        : '<span class="px-2 py-0.5 text-[#274239] text-xs font-bold rounded uppercase border border-black/20">Utente</span>';
    
    const badgeVenditore = isVenditore 
        ? '<span class="px-2 py-0.5 text-my-orange text-xs font-bold rounded uppercase border border-my-orange/20">Venditore</span>' 
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
      
      <div class="space-y-2 text-sm text-gray-600 mb-4 pt-3 border-t border-gray-50">
        <div class="flex items-center gap-2">
            <img src="./assets/email.png" class="w-4 h-4 opacity-50" alt="Email">
            <span>${utente.email}</span>
        </div>
        <div class="flex items-center gap-2">
            <img src="./assets/telefono.png" class="w-4 h-4 opacity-50" alt="Tel">
            <span>${utente.telefono || '-'}</span>
        </div>
      </div>

      <div class="mt-auto pt-3 border-t border-gray-100 flex justify-end gap-2">
        <button class="delete-utente-btn text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 transition-colors uppercase tracking-wide" data-id="${utente.idUtente}">
            <img src="./assets/elimina.png" class="w-4 h-4 opacity-70" alt="Del"> 
            Elimina
        </button>
      </div>
    `;
    detailCards.appendChild(cardEl);
    
    // LISTENER ELIMINA
    const deleteBtn = cardEl.querySelector('.delete-utente-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            openDeleteModal(utente.idUtente, 'Utente', `${utente.nome} ${utente.cognome}`, async () => {
                try {
                    await deleteUtente(utente.idUtente);
                    // Animazione
                    cardEl.style.transition = 'all 0.3s ease';
                    cardEl.style.opacity = '0';
                    cardEl.style.transform = 'scale(0.9)';
                    setTimeout(() => cardEl.remove(), 300);
                } catch (err) {
                    console.error(err);
                    alert("Errore: " + err.message);
                }
            });
        });
    }
  });
}

// Renderizza lista venditori (Stessa logica)
function renderVenditori(venditori) {
    if (!detailCards) return;
    detailCards.innerHTML = ''; // Pulisci
    
    if (venditori.length === 0) {
        detailCards.innerHTML = '<p class="col-span-full text-center text-gray-500">Nessun venditore trovato.</p>';
        return;
    }

    venditori.forEach(venditore => {
      const utenteAssociato = currentData.utenti.find(u => u.idUtente === venditore.idUtente);
      const utenteBadge = utenteAssociato ? 
        `<span class="inline-flex items-center ml-2 px-2 py-1 text-xs font-semibold bg-my-orange text-white rounded">
            <img src="./assets/icona-utenti.png" class="w-3 h-3 mr-1 brightness-0 invert" alt="User"> 
            ID: ${utenteAssociato.idUtente}
        </span>` : 
        '<span class="inline-block ml-2 px-2 py-1 text-xs font-semibold bg-gray-400 text-white rounded">Nessun utente</span>';
      
      const cardEl = document.createElement('div');
      cardEl.className = 'bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all';
      cardEl.innerHTML = `
        <div class="flex items-start justify-between mb-2">
          <p class="text-sm text-gray-600"><strong>ID Venditore:</strong> ${venditore.idVenditore}</p>
          ${utenteBadge}
        </div>
        <div class="mb-3">
            <p class="text-lg font-bold text-my-black">${venditore.nome} ${venditore.cognome || ''}</p>
            <p class="text-sm text-gray-500">${venditore.citta || ''} (${venditore.provincia || ''})</p>
        </div>
        
        <div class="space-y-1 text-sm text-gray-600 mb-4">
           <div class="flex items-center gap-2"><img src="./assets/email.png" class="w-4 h-4 opacity-50"> ${venditore.email || '-'}</div>
           <div class="flex items-center gap-2"><img src="./assets/telefono.png" class="w-4 h-4 opacity-50"> ${venditore.telefono || '-'}</div>
           <div class="flex items-center gap-2"><span class="text-xs font-mono bg-gray-100 px-1 rounded">CF: ${venditore.codiceFiscale || '-'}</span></div>
        </div>

        <div class="mt-3 border-t border-gray-100 pt-3 flex justify-end">
          <button class="delete-venditore-btn text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1" data-id="${venditore.idVenditore}">
             <img src="./assets/elimina.png" class="w-4 h-4 opacity-70"> Elimina venditore
          </button>
        </div>
      `;
      detailCards.appendChild(cardEl);
      
      // LISTENER CON MODALE
      const deleteBtn = cardEl.querySelector('.delete-venditore-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          openDeleteModal(venditore.idVenditore, 'Venditore', `${venditore.nome} ${venditore.cognome}`, async () => {
            try {
                await deleteVenditore(venditore.idVenditore);
                cardEl.style.transition = 'all 0.3s ease';
                cardEl.style.opacity = '0';
                cardEl.style.transform = 'scale(0.9)';
                setTimeout(() => cardEl.remove(), 300);
            } catch (err) {
                console.error(err);
                alert("Errore: " + err.message);
            }
          });
        });
      }
    });
}



// Helper per immagini immobili
function getImmobileImage(tipo) {
    const t = tipo ? tipo.toUpperCase() : '';
    if (t.includes('VILLA')) {
        return 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80';
    }
    if (t.includes('UFFICIO')) {
        return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';
    }
    // Default: Appartamento
    return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80';
}


// Modale di Conferma Eliminazione (Con info extra)
function openDeleteModal(id, tipoElemento, infoExtra, onConfirm) {
  // 1. Overlay
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-0';
  setTimeout(() => overlay.classList.remove('opacity-0'), 10);

  // 2. Modale
  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform scale-95 transition-transform duration-300';

  modal.innerHTML = `
    <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50 mb-4">
            <svg class="h-8 w-8 text-my-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </div>
        
        <h3 class="text-lg font-bold text-gray-900 mb-2">Elimina ${tipoElemento}</h3>
        
        <div class="text-sm text-gray-500 mb-6">
            Sei sicuro di voler eliminare questo elemento?<br>
            <div class="mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                <span class="block font-bold text-gray-800">ID: ${id}</span>
                <span class="block text-gray-600 break-words">${infoExtra || ''}</span>
            </div>
            <p class="mt-2 text-xs text-my-orange">Questa azione è irreversibile.</p>
        </div>

        <div class="flex gap-3 justify-center">
            <button id="delete-cancel" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                Annulla
            </button>
            <button id="delete-confirm" class="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-lg transition-colors">
                Sì, Elimina
            </button>
        </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  setTimeout(() => modal.classList.remove('scale-95'), 10);

  const close = () => {
      overlay.classList.remove('opacity-100');
      setTimeout(() => overlay.remove(), 200);
  };

  overlay.addEventListener('click', (e) => { if(e.target === overlay) close(); });
  modal.querySelector('#delete-cancel').addEventListener('click', close);
  
  modal.querySelector('#delete-confirm').addEventListener('click', () => {
      onConfirm();
      close();
  });
}


// Renderizza lista immobili
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
    if (immobile.tipo === 'VILLA') badgeColor = 'bg-my-green-light text-my-green-dark';
    if (immobile.tipo === 'APPARTAMENTO') badgeColor = 'bg-orange-100 text-orange-700';

    cardEl.innerHTML = `
      <div class="h-48 relative overflow-hidden bg-gray-200">
         <img src="${imgUrl}" alt="${immobile.tipo} a ${immobile.citta}" 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
         <div class="absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold uppercase shadow-sm ${badgeColor}">${immobile.tipo || 'Immobile'}</div>
         <div class="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm text-gray-600">ID: ${immobile.idImmobile}</div>
      </div>

      <div class="p-5">
        <div class="mb-3">
            <h4 class="font-bold text-lg text-my-black leading-tight mb-1">${immobile.indirizzo || 'Indirizzo mancante'}</h4>
            <p class="text-sm text-gray-500">${immobile.citta} (${immobile.provincia})</p>
        </div>
        
        <div class="grid grid-cols-3 gap-2 text-center py-3 border-t border-b border-gray-50 bg-gray-50/50 rounded-lg mb-3">
            <div><span class="block text-xs font-bold text-gray-400 uppercase">Mq</span><span class="font-semibold text-gray-700">${immobile.metriQuadri}</span></div>
            <div><span class="block text-xs font-bold text-gray-400 uppercase">Locali</span><span class="font-semibold text-gray-700">${immobile.camere || '-'}</span></div>
            <div><span class="block text-xs font-bold text-gray-400 uppercase">Bagni</span><span class="font-semibold text-gray-700">${immobile.bagni || '-'}</span></div>
        </div>

        <div class="flex justify-between items-center">
             <span class="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 uppercase border border-gray-200">${immobile.stato || 'N/A'}</span>
             <span class="font-bold text-my-green-dark text-lg">${immobile.prezzo ? '€ ' + immobile.prezzo.toLocaleString('it-IT') : '-'}</span>
        </div>
        
        <div id="details-${immobile.idImmobile}" class="hidden border-t border-gray-100 pt-4 mb-4 bg-gray-50 -mx-5 px-5 pb-4 mt-4 shadow-inner">
            <h5 class="text-xs font-bold text-gray-500 uppercase mb-2">Descrizione</h5>
            <p class="text-sm text-gray-600 italic">"${immobile.descrizione || 'Nessuna descrizione.'}"</p>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
           <button class="toggle-details-btn w-1/3 text-xs text-gray-500 hover:text-my-orange font-bold flex items-center justify-center gap-1" data-target="details-${immobile.idImmobile}">
                 <svg class="w-4 h-4 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                 </svg>
                 Info
            </button>

            <button class="edit-immobile-btn w-1/3 text-xs text-my-green-light hover:text-my-orange font-bold flex items-center justify-center gap-1" data-id="${immobile.idImmobile}">
                <img src="./assets/matita.png" class="w-4 h-4 opacity-70" alt="Modifica">
                Modifica
            </button>
            
            <button class="delete-immobile-btn w-1/3 text-xs text-my-green-light hover:text-my-orange font-bold flex items-center justify-center gap-1" data-id="${immobile.idImmobile}">
                <img src="./assets/elimina.png" class="w-4 h-4 opacity-70" alt="Elimina">
                Elimina
            </button>
        </div>
      </div>
    `;
    detailCards.appendChild(cardEl);
    
    // LISTENER MODIFICA
    const editBtn = cardEl.querySelector('.edit-immobile-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditImmobileModal(immobile);
      });
    }

    // LISTENER ELIMINA (Aggiornato con indirizzo)
    const deleteBtn = cardEl.querySelector('.delete-immobile-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Passiamo l'indirizzo come terzo parametro
        openDeleteModal(immobile.idImmobile, 'Immobile', immobile.indirizzo, async () => {
            try {
                await deleteImmobile(immobile.idImmobile);
                cardEl.style.transition = 'all 0.3s ease';
                cardEl.style.opacity = '0';
                cardEl.style.transform = 'scale(0.9)';
                setTimeout(() => cardEl.remove(), 300);
            } catch (err) {
                console.error(err);
                alert("Errore: " + err.message);
            }
        });
      });
    }

     // --- LISTENER TOGGLE DETTAGLI (Con Rotazione Freccia) ---
    const toggleBtn = cardEl.querySelector('.toggle-details-btn');
    const detailsDiv = cardEl.querySelector(`#details-${immobile.idImmobile}`);
    
    if(toggleBtn && detailsDiv) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 1. Apri/Chiudi il div
            detailsDiv.classList.toggle('hidden');
            
            // 2. Ruota la freccia
            const arrowIcon = toggleBtn.querySelector('svg');
            if (detailsDiv.classList.contains('hidden')) {
                // Chiuso: Freccia Giù (Reset)
                arrowIcon.classList.remove('rotate-180');
                // Opzionale: Cambia testo se vuoi
                // toggleBtn.lastChild.textContent = ' Info'; 
            } else {
                // Aperto: Freccia Su (Ruota 180°)
                arrowIcon.classList.add('rotate-180');
                // Opzionale: Cambia testo se vuoi
                // toggleBtn.lastChild.textContent = ' Chiudi';
            }
        });
    }
    
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
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColor}">
                    ${val.stato}
                </span>
                
                <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition edit-valutazione-btn" title="Modifica" data-id="${val.idValutazione}">
                    <img src="./assets/matita.png" class="w-5 h-5 opacity-70 hover:opacity-100" alt="Modifica">
                </button>
                
                <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition delete-valutazione-btn" title="Elimina" data-id="${val.idValutazione}">
                    <img src="./assets/elimina.png" class="w-5 h-5 opacity-70 hover:opacity-100" alt="Elimina">
                </button>
            </div>
        `;
        detailCards.appendChild(cardEl);
        
        // attach delete listener
        // Listener DELETE Valutazione
        const deleteBtn = cardEl.querySelector('.delete-valutazione-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                
                // Usa la modale personalizzata
                openDeleteModal(val.idValutazione, 'Valutazione', `Relativa all'immobile #${val.idImmobile}`, async () => {
                    try {
                        await deleteValutazione(val.idValutazione);
                        cardEl.style.transition = 'all 0.3s ease';
                        cardEl.style.opacity = '0';
                        setTimeout(() => cardEl.remove(), 300);
                    } catch (err) {
                        console.error(err);
                        alert("Errore eliminazione: " + err.message);
                    }
                });
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

// Apri modal per modificare immobile (Versione Premium)
function openEditImmobileModal(immobile) {
  // 1. Crea Overlay con effetto blur
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0';
  // Trigger animazione fade-in
  setTimeout(() => overlay.classList.remove('opacity-0'), 10);

  // 2. Crea il contenitore Modale
  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300';

  // Definiamo le opzioni per le select
  const tipi = ['APPARTAMENTO', 'VILLA', 'UFFICIO'];
  const stati = ['NUOVA', 'RISTRUTTURATA', 'ABITABILE', 'DA_RISTRUTTURARE'];

  modal.innerHTML = `
    <div class="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center">
      <div>
        <h3 class="text-2xl font-bold text-my-green-dark">Modifica Immobile</h3>
        <div class="flex items-center gap-2 mt-1">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider">ID: ${immobile.idImmobile}</span>
            <span class="text-sm text-gray-400 truncate max-w-xs">${immobile.indirizzo || ''}</span>
        </div>
      </div>
      <button id="edit-imm-close" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="space-y-6">
          
          <div class="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h4 class="text-xs font-bold text-my-orange uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Localizzazione
              </h4>
              <div class="space-y-4">
                  <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Indirizzo completo</label>
                      <input id="edit-imm-indirizzo" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-my-orange focus:border-transparent transition-all" value="${immobile.indirizzo || ''}" placeholder="Via Roma 10">
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                      <div>
                          <label class="block text-sm font-semibold text-gray-700 mb-1">Città</label>
                          <input id="edit-imm-citta" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-my-orange focus:border-transparent" value="${immobile.citta || ''}">
                      </div>
                      <div class="grid grid-cols-2 gap-2">
                          <div>
                              <label class="block text-sm font-semibold text-gray-700 mb-1">Prov</label>
                              <input id="edit-imm-provincia" class="w-full border border-gray-300 rounded-lg px-2 py-2.5 text-center uppercase" maxlength="2" value="${immobile.provincia || ''}">
                          </div>
                          <div>
                              <label class="block text-sm font-semibold text-gray-700 mb-1">CAP</label>
                              <input id="edit-imm-cap" class="w-full border border-gray-300 rounded-lg px-2 py-2.5 text-center" maxlength="5" value="${immobile.cap || ''}">
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Descrizione Immobile</label>
              <textarea id="edit-imm-desc" rows="5" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-my-orange focus:border-transparent resize-none text-sm leading-relaxed" placeholder="Inserisci una descrizione dettagliata...">${immobile.descrizione || ''}</textarea>
          </div>
      </div>

      <div class="space-y-6">
          
          <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Tipologia</label>
                  <div class="relative">
                      <select id="edit-imm-tipo" class="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-my-orange focus:border-transparent cursor-pointer font-medium text-my-green-dark">
                          ${tipi.map(t => `<option value="${t}" ${immobile.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                  </div>
              </div>
              <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Stato Attuale</label>
                  <div class="relative">
                      <select id="edit-imm-stato" class="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-my-orange focus:border-transparent cursor-pointer font-medium">
                          ${stati.map(s => `<option value="${s}" ${immobile.stato === s ? 'selected' : ''}>${s.replace('_', ' ')}</option>`).join('')}
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                  </div>
              </div>
          </div>

          <div class="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h4 class="text-xs font-bold text-my-orange uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  Caratteristiche
              </h4>
              <div class="grid grid-cols-3 gap-4 mb-4">
                  <div>
                      <label class="block text-xs text-gray-500 mb-1 font-bold">Metri Quadri</label>
                      <input id="edit-imm-mq" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-my-orange" value="${immobile.metriQuadri || ''}">
                  </div>
                  <div>
                      <label class="block text-xs text-gray-500 mb-1 font-bold">Camere</label>
                      <input id="edit-imm-camere" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-my-orange" value="${immobile.camere || ''}">
                  </div>
                  <div>
                      <label class="block text-xs text-gray-500 mb-1 font-bold">Bagni</label>
                      <input id="edit-imm-bagni" type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-my-orange" value="${immobile.bagni || ''}">
                  </div>
              </div>
              
              <div class="pt-4 border-t border-gray-200">
                  <label class="block text-sm font-bold text-my-green-dark mb-1">Prezzo Richiesto</label>
                  <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm">€</span>
                      </div>
                      <input id="edit-imm-prezzo" type="number" class="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-3 font-mono text-lg font-bold text-my-green-dark focus:ring-2 focus:ring-my-orange focus:border-transparent" value="${immobile.prezzo || ''}" placeholder="0.00">
                  </div>
              </div>
          </div>

      </div>
    </div>

    <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4 flex justify-end gap-3 rounded-b-2xl">
      <button id="edit-imm-cancel" class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
        Annulla
      </button>
      <button id="edit-imm-save" class="px-8 py-2.5 bg-my-green-dark text-white font-bold rounded-lg hover:bg-[#111A19] transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
        Salva Modifiche
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Animazione Entrata (Scale up)
  setTimeout(() => modal.classList.remove('scale-95'), 10);

  // --- LISTENERS (Logica invariata) ---
  
  const closeModal = () => {
      overlay.classList.remove('opacity-100');
      overlay.classList.add('opacity-0');
      setTimeout(() => overlay.remove(), 300);
  };

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  modal.querySelector('#edit-imm-close').addEventListener('click', closeModal);
  modal.querySelector('#edit-imm-cancel').addEventListener('click', closeModal);
  
  modal.querySelector('#edit-imm-save').addEventListener('click', async () => {
    // Recupero dati (uguale a prima)
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
      tipo: document.getElementById('edit-imm-tipo').value,
      stato: document.getElementById('edit-imm-stato').value
    };

    try {
      const btnSave = modal.querySelector('#edit-imm-save');
      btnSave.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Salvataggio...';
      btnSave.disabled = true;

      const updatedImmobile = await updateImmobile(immobile.idImmobile, updated);
      
      // Aggiorna dati locali e UI
      currentData.immobili = currentData.immobili.map(i => i.idImmobile === updatedImmobile.idImmobile ? updatedImmobile : i);
      renderImmobili(currentData.immobili);
      
      closeModal();
    } catch (e) {
      console.error('Errore aggiornamento:', e);
      alert('Errore: ' + e.message);
      const btnSave = modal.querySelector('#edit-imm-save');
      btnSave.innerHTML = 'Salva Modifiche';
      btnSave.disabled = false;
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
  // 1. Overlay
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0';
  setTimeout(() => overlay.classList.remove('opacity-0'), 10);

  // 2. Modale
  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300';

  const stati = ['IN_CORSO', 'COMPLETATA', 'ANNULLATA'];

  modal.innerHTML = `
    <div class="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center">
      <div>
        <h3 class="text-2xl font-bold text-my-green-dark">Modifica Valutazione</h3>
        <p class="text-sm text-gray-500">Riferimento ID: <span class="font-mono font-bold text-my-orange">#${val.idValutazione}</span></p>
      </div>
      <button id="edit-val-close" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="p-8 space-y-6">
        
        <div>
            <label class="block text-sm font-bold text-my-green-dark mb-2">Valore Stimato</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span class="text-gray-500 font-bold">€</span>
                </div>
                <input id="edit-val-valore" type="number" class="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 font-mono text-xl font-bold text-my-green-dark focus:ring-2 focus:ring-my-orange focus:border-transparent transition-shadow" value="${val.valoreStimato || ''}" placeholder="0.00">
            </div>
            <p class="text-xs text-gray-400 mt-1 ml-1">Inserisci il valore finale calcolato o modificato.</p>
        </div>

        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Stato Lavorazione</label>
            <div class="relative">
                <select id="edit-val-stato" class="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-my-orange focus:border-transparent cursor-pointer font-medium">
                    ${stati.map(s => `<option value="${s}" ${val.stato === s ? 'selected' : ''}>${s.replace('_', ' ')}</option>`).join('')}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>

        <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Note Interne</label>
            <textarea id="edit-val-note" rows="4" class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-my-orange focus:border-transparent resize-none text-sm leading-relaxed bg-gray-50 focus:bg-white transition-colors" placeholder="Aggiungi dettagli sulla valutazione...">${val.note || val.noteValutazione || ''}</textarea>
        </div>

    </div>

    <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4 flex justify-end gap-3 rounded-b-2xl">
      <button id="edit-val-cancel" class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
        Annulla
      </button>
      <button id="edit-val-save" class="px-8 py-2.5 bg-my-green-dark text-white font-bold rounded-lg hover:bg-[#111A19] transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
        Salva Modifiche
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  setTimeout(() => modal.classList.remove('scale-95'), 10);

  // --- Logic ---
  const closeModal = () => {
      overlay.classList.remove('opacity-100');
      setTimeout(() => overlay.remove(), 300);
  };

  overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });
  modal.querySelector('#edit-val-close').addEventListener('click', closeModal);
  modal.querySelector('#edit-val-cancel').addEventListener('click', closeModal);

  modal.querySelector('#edit-val-save').addEventListener('click', async () => {
    const updated = {
      valoreStimato: parseFloat(document.getElementById('edit-val-valore').value) || null,
      stato: document.getElementById('edit-val-stato').value.trim(),
      note: document.getElementById('edit-val-note').value.trim()
    };

    try {
      const btnSave = modal.querySelector('#edit-val-save');
      btnSave.innerHTML = 'Salvando...';
      btnSave.disabled = true;

      const updatedVal = await updateValutazione(val.idValutazione, updated);
      
      currentData.valutazioni = currentData.valutazioni.map(v => v.idValutazione === updatedVal.idValutazione ? updatedVal : v);
      renderValutazioni(currentData.valutazioni);
      
      closeModal();
      // (Opzionale: Toast success)
    } catch (e) {
      console.error('Errore update:', e);
      alert('Errore durante l\'aggiornamento della valutazione');
      const btnSave = modal.querySelector('#edit-val-save');
      btnSave.innerHTML = 'Salva Modifiche';
      btnSave.disabled = false;
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
  // 1. Overlay
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 opacity-0';
  setTimeout(() => overlay.classList.remove('opacity-0'), 10);

  // 2. Modale
  const modal = document.createElement('div');
  modal.className = 'bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform scale-95 transition-transform duration-300';

  const stati = ['ATTIVO', 'COMPLETATO', 'ANNULLATO'];

  modal.innerHTML = `
    <div class="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center">
      <div>
        <h3 class="text-2xl font-bold text-my-green-dark">Modifica Contratto</h3>
        <p class="text-sm text-gray-500">Riferimento: <span class="font-mono font-bold text-my-orange">#${contratto.idContratto}</span></p>
      </div>
      <button id="edit-contr-close" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Tipo Contratto</label>
            <input id="edit-contr-tipo" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-my-orange focus:border-transparent transition-shadow bg-gray-50" value="${contratto.tipo || ''}" placeholder="Es. Vendita, Affitto...">
          </div>
          
          <div class="grid grid-cols-2 gap-4">
              <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Data Inizio</label>
                  <input id="edit-contr-datainizio" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-my-orange" value="${contratto.dataInizio || ''}">
              </div>
              <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-1">Data Fine</label>
                  <input id="edit-contr-datafine" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-my-orange" value="${contratto.dataFine || ''}">
              </div>
          </div>

          <div class="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-bold text-my-green-dark">Esclusiva</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="edit-contr-esclusiva" class="sr-only peer" ${contratto.esclusiva ? 'checked' : ''}>
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-my-orange"></div>
                  </label>
              </div>
              <p class="text-xs text-gray-500">Abilita se l'agenzia ha l'esclusiva sulla vendita.</p>
          </div>
      </div>

      <div class="space-y-6">
          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Stato Attuale</label>
              <div class="relative">
                  <select id="edit-contr-stato" class="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-my-orange focus:border-transparent cursor-pointer font-medium">
                      ${stati.map(s => `<option value="${s}" ${contratto.stato === s ? 'selected' : ''}>${s}</option>`).join('')}
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
              </div>
          </div>

          <div>
              <label class="block text-sm font-bold text-my-green-dark mb-1">Prezzo Minimo (€)</label>
              <input id="edit-contr-prezzo" type="number" class="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-xl font-bold text-my-green-dark focus:ring-2 focus:ring-my-orange" value="${contratto.prezzoFinaleMinimo || ''}" placeholder="0.00">
          </div>

          <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Note Interne</label>
              <textarea id="edit-contr-note" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-my-orange resize-none text-sm">${contratto.note || ''}</textarea>
          </div>
      </div>

    </div>

    <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4 flex justify-end gap-3 rounded-b-2xl">
      <button id="edit-contr-cancel" class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
        Annulla
      </button>
      <button id="edit-contr-save" class="px-8 py-2.5 bg-my-green-dark text-white font-bold rounded-lg hover:bg-[#111A19] transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
        Salva Modifiche
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  setTimeout(() => modal.classList.remove('scale-95'), 10);

  // --- LISTENERS ---
  const closeModal = () => {
      overlay.classList.remove('opacity-100');
      setTimeout(() => overlay.remove(), 300);
  };

  overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });
  modal.querySelector('#edit-contr-close').addEventListener('click', closeModal);
  modal.querySelector('#edit-contr-cancel').addEventListener('click', closeModal);

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
      const btnSave = modal.querySelector('#edit-contr-save');
      btnSave.innerHTML = 'Salvando...';
      btnSave.disabled = true;

      const updatedContratto = await updateContract(contratto.idContratto, updated);
      
      currentData.contratti = currentData.contratti.map(c => c.idContratto === updatedContratto.idContratto ? updatedContratto : c);
      renderContractsList();
      
      closeModal();
      alert('Contratto aggiornato con successo');
    } catch (e) {
      console.error('Errore aggiornamento contratto:', e);
      alert('Errore durante l\'aggiornamento del contratto');
      
      const btnSave = modal.querySelector('#edit-contr-save');
      btnSave.innerHTML = 'Salva Modifiche';
      btnSave.disabled = false;
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

//Listener Contatti Email (header e footer) - apri Gmail
document.querySelectorAll('.open-gmail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = btn.dataset.email;
        
        // Apri Gmail senza soggetto/corpo predefinito
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
        window.open(gmailUrl, '_blank');
    });
});