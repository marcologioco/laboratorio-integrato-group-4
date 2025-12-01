/**
 * User Dashboard - Area Personale Utente
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Proteggi la pagina: solo utenti autenticati
  if (typeof protectPage === 'function' && !protectPage()) {
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
 * Carica i dati dell'utente corrente dal backend
 */
async function loadUserData() {
  try {
    const user = getUser();
    
    if (!user) return;

    // Aggiorna UI con dati utente
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    const userInitialsEl = document.getElementById('user-initials');

    if (userNameEl) userNameEl.textContent = `${user.nome} ${user.cognome}`;
    if (userEmailEl) userEmailEl.textContent = user.email;

    if (userInitialsEl) {
      const initials = (user.nome.charAt(0) + user.cognome.charAt(0)).toUpperCase();
      userInitialsEl.textContent = initials;
    }

  } catch (error) {
    console.error('Errore caricamento dati utente:', error);
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
    
    // Render valutazioni
    renderValutazioni(valutazioni);
    
    // Carica anche gli immobili associati
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
 * RENDER VALUTAZIONI (Versione Clean senza ID visibile)
 */
function renderValutazioni(valutazioni) {
  const container = document.getElementById('valutazioni-container');
  
  // Aggiorna contatore
  if(document.getElementById('total-val-count')) {
      document.getElementById('total-val-count').innerText = valutazioni.length;
  }

  if (!container) return;

  if (!valutazioni || valutazioni.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-xl shadow-sm text-center border border-dashed border-gray-300">
        <p class="text-gray-600 mb-4">Non hai ancora richiesto valutazioni.</p>
        <a href="/index.html" class="inline-block px-6 py-2 bg-my-orange text-white rounded-lg hover:bg-[#a35728] transition">Richiedine una ora</a>
      </div>`;
    return;
  }

  const html = valutazioni.map(val => {
    // Formattazione data migliorata
    const data = new Date(val.dataRichiesta);
    const giorno = data.getDate();
    let mese = data.toLocaleDateString('it-IT', { month: 'long' });
    const anno = data.getFullYear();
    mese = mese.charAt(0).toUpperCase() + mese.slice(1);
    const dataFmt = `${giorno} ${mese} ${anno}`;
    
    const valoreFmt = val.valoreStimato ? '€ ' + val.valoreStimato.toLocaleString('it-IT') : '--';
    
    // Logica stile badge
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
            <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-my-green-dark border border-gray-200">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${badgeClass}">
                        ${iconStatus} ${val.stato}
                    </span>
                    <span class="text-xs text-gray-400 border-l border-gray-300 pl-2 ml-1">${dataFmt}</span>
                </div>
                <p class="text-sm text-gray-600">Valutazione basata su dati di zona</p>
            </div>
        </div>

        <div class="text-left md:text-right pl-16 md:pl-0">
            <p class="text-xs text-gray-400 uppercase font-bold">Valore Stimato</p>
            <p class="text-2xl font-extrabold text-my-orange leading-none">${val.valoreStimato ? `€${val.valoreStimato.toLocaleString()}` : 'In elaborazione...'}</p>
            <p class="text-xs text-gray-400 mt-1">Valore medio zona: € ${val.valoreCalcolatoZona?.toLocaleString('it-IT') || 'N/A'}</p>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * Carica gli immobili collegati
 */
async function loadUserImmobili(valutazioni) {
  const container = document.getElementById('immobili-container');
  if (!container) return;

  try {
    const immobiliIds = [...new Set(valutazioni.map(v => v.idImmobile))];
    
    if (immobiliIds.length === 0) {
      container.innerHTML = '<div class="text-center py-8 text-gray-500 col-span-full"><p>Nessun immobile trovato</p></div>';
      return;
    }

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
 * RENDER IMMOBILI (Con Tasto Copia e Mailto)
 */
function renderImmobili(immobili, valutazioni) {
  const container = document.getElementById('immobili-container');
  if (!container) return;

  const html = immobili.map(imm => {
    const valutazione = valutazioni.find(v => v.idImmobile === imm.idImmobile);
    const ultimoPrezzo = valutazione && valutazione.valoreStimato ? '€ ' + valutazione.valoreStimato.toLocaleString('it-IT') : 'In attesa';
    
    // Configurazione Mail
    const mailAgenzia = 'immobiliarishelp@gmail.com';
    const mailSubject = `Richiesta info per immobile: ${imm.indirizzo}`;
    const mailBody = `Buongiorno,\n\nvorrei avere maggiori informazioni sul mio immobile in:\n${imm.indirizzo}, ${imm.citta}.\n\nGrazie.`;
    const mailLink = `mailto:${mailAgenzia}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    return `
      <div class="bg-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
        
        <div class="p-6 border-b border-gray-50">
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

        <div id="user-details-${imm.idImmobile}" class="hidden bg-gray-50 px-6 py-4 border-t border-gray-100 shadow-inner">
            <div class="mb-4">
                <p class="text-xs font-bold text-gray-500 uppercase mb-1">Descrizione</p>
                <p class="text-sm text-gray-600 italic">"${imm.descrizione || 'Nessuna descrizione disponibile.'}"</p>
            </div>
            
            <p class="text-xs font-bold text-gray-500 uppercase mb-2">Contatta Assistenza</p>
            
            <div class="flex gap-2">
                <a href="${mailLink}" class="flex-1 flex items-center justify-center py-2 bg-my-green-dark text-white rounded hover:bg-[#111A19] transition-colors text-sm font-semibold shadow-sm">
                    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    Scrivi Mail
                </a>
                
                <button class="copy-email-btn px-3 py-2 bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition-colors text-sm font-semibold shadow-sm" title="Copia indirizzo email" data-email="${mailAgenzia}">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </button>
            </div>
            <p class="text-[10px] text-gray-400 mt-2 text-center">Oppure scrivi a: <span class="font-mono text-gray-600">${mailAgenzia}</span></p>
        </div>

        <button class="w-full py-2 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1 toggle-user-details" data-target="user-details-${imm.idImmobile}">
            <svg class="w-4 h-4 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            Specifiche & Contatti
        </button>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;

  // 1. Listener Toggle Dettagli
  document.querySelectorAll('.toggle-user-details').forEach(btn => {
      btn.addEventListener('click', () => {
          const targetId = btn.dataset.target;
          const targetDiv = document.getElementById(targetId);
          const icon = btn.querySelector('svg');
          
          targetDiv.classList.toggle('hidden');
          
          if (targetDiv.classList.contains('hidden')) {
              icon.style.transform = 'rotate(0deg)';
              btn.childNodes[2].textContent = ' Specifiche & Contatti';
          } else {
              icon.style.transform = 'rotate(180deg)';
              btn.childNodes[2].textContent = ' Chiudi';
          }
      });
  });

  // 2. Listener Copia Email
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
      btn.addEventListener('click', () => {
          const email = btn.dataset.email;
          navigator.clipboard.writeText(email).then(() => {
              // Feedback visivo temporaneo
              const originalHTML = btn.innerHTML;
              btn.innerHTML = `<svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
              setTimeout(() => {
                  btn.innerHTML = originalHTML;
              }, 2000);
          }).catch(err => {
              console.error('Errore copia:', err);
              alert('Copia manuale: ' + email);
          });
      });
  });
}