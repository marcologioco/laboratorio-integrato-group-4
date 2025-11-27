/**
 * User Dashboard - Area Personale
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Controllo auth (presumo tu abbia auth-utils.js importato)
  if (typeof protectPage === 'function' && !protectPage()) return;

  await loadUserData();
  await loadUserValutazioni();

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof logout === 'function') logout();
    });
  }
  handleAnchorLinks();
});

/**
 * Gestisci i link anchor con scroll fluido
 */
function handleAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Carica Dati Utente (Header Sidebar)
 */
async function loadUserData() {
  try {
    const user = getUser(); // Da auth-utils.js
    if (!user) return;

    // Riempi Sidebar
    if(document.getElementById('user-name')) document.getElementById('user-name').textContent = `${user.nome} ${user.cognome}`;
    if(document.getElementById('user-email')) document.getElementById('user-email').textContent = user.email;
    
    if(document.getElementById('user-initials')) {
       const initials = (user.nome[0] + user.cognome[0]).toUpperCase();
       document.getElementById('user-initials').textContent = initials;
    }

  } catch (error) {
    console.error('Errore user data:', error);
  }
}

/**
 * Carica Valutazioni (API)
 */
async function loadUserValutazioni() {
  try {
    const user = getUser();
    const response = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/valutazioni/utente/${user.idUtente}`);

    if (!response.ok) throw new Error('Errore fetch valutazioni');

    const valutazioni = await response.json();
    
    // Renderizza la nuova UI
    renderValutazioni(valutazioni);
    
    // Carica Immobili correlati
    await loadUserImmobili(valutazioni);

  } catch (error) {
    console.error(error);
    document.getElementById('valutazioni-container').innerHTML = '<p class="text-red-500">Errore caricamento dati.</p>';
  }
}

/**
 * RENDER VALUTAZIONI (NUOVO DESIGN PREMIUM)
 */
function renderValutazioni(valutazioni) {
  const container = document.getElementById('valutazioni-container');
  
  // Aggiorno contatore statistiche in alto
  if(document.getElementById('total-val-count')) {
      document.getElementById('total-val-count').innerText = valutazioni.length;
  }

  if (!valutazioni || valutazioni.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
        <p class="text-gray-600 mb-4">Non hai ancora richiesto valutazioni.</p>
        <a href="/index.html" class="text-my-orange font-bold hover:underline">Richiedine una ora</a>
      </div>`;
    return;
  }

  const html = valutazioni.map(val => {
    const data = new Date(val.dataRichiesta);
    const giorno = data.getDate();
    let mese = data.toLocaleDateString('it-IT', { month: 'long' });
    const anno = data.getFullYear();

    // Assicura che la prima lettera del mese sia maiuscola
    mese = mese.charAt(0).toUpperCase() + mese.slice(1);

    const dataFmt = `${giorno} ${mese} ${anno}`;
    //const dataFmt = new Date(val.dataRichiesta).toLocaleDateString('it-IT');
    //const valoreFmt = val.valoreStimato ? '€ ' + val.valoreStimato.toLocaleString('it-IT') : '--';
    
    // Determina colori e testi in base allo stato
    let badgeClass = 'bg-gray-100 text-gray-800';
    let iconStatus = ''; 
    
    if (val.stato === 'COMPLETATA') {
        badgeClass = 'bg-green-100 text-green-800';
        iconStatus = `<svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`;
    } else {
        badgeClass = 'bg-yellow-100 text-yellow-800';
        iconStatus = `<svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    }

    return `
      <div class="bg-gray-50 rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between group">
        
        <div class="flex items-center gap-4 mb-4 md:mb-0">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${badgeClass}">
                        ${iconStatus} ${val.stato}
                    </span>
                    <span class="text-xs text-gray-600">${dataFmt}</span>
                </div>
                <p class="text-sm text-gray-800">Valutazione Automatica</p>
            </div>
        </div>

        <div class="text-left md:text-right pl-16 md:pl-0">
            <p class="text-xs text-gray-600 uppercase font-bold">Valore Stimato</p>
            <p class="text-2xl font-extrabold text-my-orange leading-none">${val.valoreStimato ? `€${val.valoreStimato.toLocaleString()}` : 'In elaborazione...'}</p>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * Carica Immobili (API)
 */
async function loadUserImmobili(valutazioni) {
  const container = document.getElementById('immobili-container');
  try {
    const ids = [...new Set(valutazioni.map(v => v.idImmobile))];
    if (ids.length === 0) {
        container.innerHTML = '<p class="text-gray-600 col-span-full text-center">Nessun immobile salvato.</p>';
        return;
    }

    const promises = ids.map(id => authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/immobili/${id}`).then(r => r.json()));
    const immobili = await Promise.all(promises);

    renderImmobili(immobili, valutazioni);

  } catch (error) {
    console.error(error);
    container.innerHTML = '<p class="text-red-400">Errore caricamento immobili</p>';
  }
}

/**
 * RENDER IMMOBILI (NUOVO DESIGN PREMIUM - CARD BIANCHE)
 */
function renderImmobili(immobili, valutazioni) {
  const container = document.getElementById('immobili-container');
  
  const html = immobili.map(imm => {
    // Trova l'ultima valutazione associata a questo immobile
    const val = valutazioni.find(v => v.idImmobile === imm.idImmobile);
    const ultimoPrezzo = val && val.valoreStimato ? '€ ' + val.valoreStimato.toLocaleString('it-IT') : 'In lavorazione';

    return `
      <div class="bg-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
        
        <div class="p-6 border-b border-gray-50 flex-grow">
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-my-green-dark group-hover:text-white transition-colors flex-shrink-0">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                
                <div>
                    <h3 class="font-bold text-lg text-my-black leading-tight group-hover:text-my-orange transition-colors">
                        ${imm.indirizzo || 'Indirizzo Sconosciuto'}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1 flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        ${imm.citta} (${imm.provincia})
                    </p>
                </div>
            </div>
        </div>
        
        <div class="p-4 grid grid-cols-3 gap-2 text-center bg-gray-50/50">
            <div>
                <p class="text-[20px] text-gray-600 uppercase font-bold tracking-wider">📏Mq</p>
                <p class="font-semibold text-gray-700">${imm.metriQuadri}</p>
            </div>
            <div class="border-l border-r border-gray-200">
                <p class="text-[20px] text-gray-600 uppercase font-bold tracking-wider">🛏Locali</p>
                <p class="font-semibold text-gray-700">${imm.camere}</p>
            </div>
            <div>
                <p class="text-[20px] text-gray-600 uppercase font-bold tracking-wider">🚿Bagni</p>
                <p class="font-semibold text-gray-700">${imm.bagni}</p>
            </div>
        </div>

        <div class="px-6 py-4 bg-white border-t border-gray-100 flex justify-between items-center">
             <span class="text-xs text-gray-600 font-medium">Stima Recente</span>
             <span class="text-my-green-dark font-bold text-lg">${ultimoPrezzo}</span>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}