/**
 * JS VALUTAZIONE - Versione Definitiva (Compatibile con Step 0)
 */

let currentStep = 0; // Partiamo da Step 0 (Scelta login)
const totalSteps = 5;

// Parametri di calcolo
const PREZZI = {
    MQ_BASE: 1800,
    GARAGE: 15000,
    GIARDINO: 10000,
    TERRAZZO: 5000,
    BALCONE: 3000
};

document.addEventListener('DOMContentLoaded', async () => {
    setupRegistrationChoice(); // Gestisce i click su "Sì/No" nello step 0
    setupNavigation();
    setupCards();
    setupSubmit();
    
    // Controllo Login all'avvio
    await checkLoginState();
});

// --- 1. GESTIONE LOGICA LOGIN ---
async function checkLoginState() {
    if (typeof getUser !== 'function') return;
    const user = getUser();

    // Nascondi tutti gli step inizialmente per evitare flash
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });

    if (user) {
        console.log("Utente loggato:", user.email);
        
        // SE LOGGATO: Saltiamo Step 0 e Step 1
        // Precompiliamo i campi nascosti per sicurezza
        fillHiddenFields(user);
        
        // Andiamo diretti allo Step 2 (Immobile)
        goToStep(2);
        
        // Mostra un piccolo avviso "Bentornato" sopra il form (opzionale)
        showWelcomeBanner(user);

    } else {
        // SE OSPITE: Mostriamo Step 0
        goToStep(0);
    }
}

function fillHiddenFields(user) {
    if(document.getElementById('nome')) document.getElementById('nome').value = user.nome || 'Utente';
    if(document.getElementById('cognome')) document.getElementById('cognome').value = user.cognome || 'Loggato';
    if(document.getElementById('email')) document.getElementById('email').value = user.email;
    if(document.getElementById('telefono')) document.getElementById('telefono').value = user.telefono || '0000000000';
    if(document.getElementById('password')) document.getElementById('password').value = "LoggedUserPass";
    
    // Proprietario: SI di default
    const propSi = document.querySelector('input[name="isProprietario"][value="true"]');
    if(propSi) propSi.checked = true;
}

function showWelcomeBanner(user) {
    const container = document.getElementById('form-container');
    const banner = document.createElement('div');
    banner.className = 'bg-green-50 text-green-800 px-4 py-3 rounded-lg mb-4 text-sm flex items-center justify-between';
    banner.innerHTML = `
        <span>👋 Ciao <strong>${user.nome}</strong>, sei loggato.</span>
        <a href="#" onclick="logout()" class="underline hover:text-red-600 ml-4">Esci</a>
    `;
    container.insertBefore(banner, container.firstChild);
}

// --- 2. GESTIONE SCELTA INIZIALE (Step 0) ---
function setupRegistrationChoice() {
    document.querySelectorAll('.registration-choice').forEach(card => {
        card.addEventListener('click', function() {
            const choice = this.getAttribute('data-choice');
            
            if (choice === 'yes') {
                // Ha già un account -> Mandalo al login
                window.location.href = 'login.html';
            } else {
                // Non ha un account -> Vai a Step 1 (Registrazione)
                goToStep(1);
            }
        });
    });
}

// --- 3. NAVIGAZIONE ---
function setupNavigation() {
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if(validateStep(currentStep)) goToStep(currentStep + 1);
        });
    });
    
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            goToStep(currentStep - 1);
        });
    });
}

function goToStep(step) {
    // Controlli limiti
    if (step < 0 || step > totalSteps) return;

    // Nascondi tutti
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    
    // Mostra target
    const target = document.getElementById(`step-${step}`);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
    
    currentStep = step;
    
    // Aggiorna Barra Progresso (Visibile solo da step 1 in poi)
    const progressContainer = document.getElementById('progress-container');
    if (step > 0) {
        progressContainer.style.display = 'block';
        const bar = document.getElementById('progress-bar');
        const ind = document.getElementById('step-indicator');
        if(bar) bar.style.width = `${(step/totalSteps)*100}%`;
        if(ind) ind.textContent = `Step ${step} di ${totalSteps}`;
    } else {
        progressContainer.style.display = 'none';
    }
    
    // Gestisci visibilità pulsante "Indietro"
    updateBackButtonVisibility();
    
    // NO SCROLL (Come richiesto)
}

function updateBackButtonVisibility() {
    const user = typeof getUser === 'function' ? getUser() : null;
    const backButtons = document.querySelectorAll('.btn-prev');
    
    backButtons.forEach(btn => {
        // Se l'utente è loggato e siamo allo step 2 (primo step visibile per utenti loggati)
        // nascondi il pulsante indietro per impedire di tornare agli step 0 e 1
        if (user && currentStep === 2) {
            btn.style.display = 'none';
        } else if (currentStep <= 1) {
            // Negli step 0 e 1 non c'è mai il pulsante indietro
            btn.style.display = 'none';
        } else {
            btn.style.display = 'inline-flex';
        }
    });
}

// --- 4. VALIDAZIONE ---
function validateStep(step) {
    const stepEl = document.getElementById(`step-${step}`);
    if (!stepEl) return true;

    const inputs = stepEl.querySelectorAll('input[required], select[required]');
    let valid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.classList.add('border-red-500');
            input.addEventListener('input', () => input.classList.remove('border-red-500'), { once: true });
        }
    });

    if(!valid) {
        alert("Compila tutti i campi obbligatori!");
        return false;
    }

    // Validazione speciale per Step 2 (Indirizzo)
    if (step === 2) {
        const indirizzo = document.getElementById('indirizzo').value.trim();
        const provincia = document.getElementById('provincia').value.trim();
        
        // Validazione formato indirizzo
        if (!validateAddressFormat(indirizzo)) {
            alert("L'indirizzo deve iniziare con Via, Viale, Corso, Piazza, ecc. seguito dal nome della via.\nEsempio: Via Garibaldi, Corso Francia, Piazza Castello");
            document.getElementById('indirizzo').classList.add('border-red-500');
            document.getElementById('indirizzo').focus();
            return false;
        }
        
        // Validazione provincia (2 caratteri maiuscoli)
        if (!/^[A-Z]{2}$/.test(provincia)) {
            alert("La provincia deve essere una sigla di 2 lettere maiuscole (es: TO, AL, AT, CN).");
            document.getElementById('provincia').classList.add('border-red-500');
            document.getElementById('provincia').focus();
            return false;
        }
    }
    
    return valid;
}

// Validazione formato indirizzo (deve iniziare con tipo di via + nome)
function validateAddressFormat(indirizzo) {
    if (!indirizzo || indirizzo.length < 5) return false;
    
    // Pattern: deve iniziare con un tipo di via seguito da almeno un nome
    const tipiVia = [
        'via', 'viale', 'corso', 'piazza', 'piazzale', 
        'largo', 'vicolo', 'strada', 'vico', 'borgo',
        'contrada', 'traversa', 'salita', 'discesa', 'rampa'
    ];
    
    const indirizzoLower = indirizzo.toLowerCase().trim();
    
    // Controlla se inizia con uno dei tipi di via
    const iniziaConTipoVia = tipiVia.some(tipo => {
        const regex = new RegExp(`^${tipo}\\s+.+`, 'i');
        return regex.test(indirizzoLower);
    });
    
    if (!iniziaConTipoVia) return false;
    
    // Deve avere almeno un nome dopo il tipo (es: "Via Roma" è valido, "Via" no)
    const parti = indirizzo.trim().split(/\s+/);
    return parti.length >= 2;
}

// --- 5. CARDS & CHECKBOX ---
function setupCards() {
    // Selezione Singola
    document.querySelectorAll('.selection-card').forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.dataset.target;
            const val = card.dataset.value;
            document.getElementById(targetId).value = val;
            
            document.querySelectorAll(`.selection-card[data-target="${targetId}"]`).forEach(c => {
                c.classList.remove('border-my-orange', 'bg-orange-50');
            });
            card.classList.add('border-my-orange', 'bg-orange-50');
        });
    });

    // Selezione Multipla
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.dataset.target;
            const checkbox = document.getElementById(targetId);
            if(checkbox) {
                checkbox.checked = !checkbox.checked;
                if(checkbox.checked) card.classList.add('border-my-orange', 'bg-orange-50');
                else card.classList.remove('border-my-orange', 'bg-orange-50');
            }
        });
    });
}

// --- 6. INVIO DATI ---
function setupSubmit() {
    const form = document.getElementById('valutazione-form');
    if(!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Calcolo Prezzo Frontend (immediato)
        const stima = calcolaPrezzoFrontend();
        
        const btn = document.getElementById('submit-btn');
        const loading = document.getElementById('loading');
        const formContainer = document.getElementById('form-container');
        
        btn.disabled = true;
        formContainer.classList.add('hidden');
        loading.classList.remove('hidden');
        
        try {
            const user = typeof getUser === 'function' ? getUser() : null;
            let resultData = null;

            if (user) {
                // --- UTENTE LOGGATO: Usa endpoint dedicato ---
                resultData = await inviaValutazioneUtente();

            } else {
                // --- OSPITE: Chiamata automatica ---
                resultData = await inviaValutazioneOspite();
            }
            
            // Mostra risultato
            mostraRisultato(resultData);

        } catch (error) {
            console.error(error);
            alert("Errore: " + error.message);
            btn.disabled = false;
            loading.classList.add('hidden');
            formContainer.classList.remove('hidden');
        }
    });
}

// --- 7. FUNZIONI CALCOLO & API ---

function calcolaPrezzoFrontend() {
    const mq = parseFloat(document.getElementById('metriQuadri').value) || 0;
    const bagni = parseInt(document.getElementById('bagni').value) || 1;
    const balconi = parseInt(document.getElementById('balconi').value) || 0;
    const garage = document.getElementById('garage').checked;
    const giardino = document.getElementById('giardino').checked;
    const terrazzo = document.getElementById('terrazzo').checked;
    const stato = document.getElementById('stato').value;

    let valore = mq * PREZZI.MQ_BASE;
    if(garage) valore += PREZZI.GARAGE;
    if(giardino) valore += PREZZI.GIARDINO;
    if(terrazzo) valore += PREZZI.TERRAZZO;
    if(balconi > 0) valore += (balconi * PREZZI.BALCONE);
    if(bagni > 1) valore += ((bagni - 1) * 5000);
    
    if(stato === 'NUOVA') valore *= 1.15;
    if(stato === 'DA_RISTRUTTURARE') valore *= 0.75;

    return Math.round(valore / 100) * 100;
}

async function inviaValutazioneUtente() {
    const payload = {
        // Dati immobile
        indirizzo: document.getElementById('indirizzo').value,
        citta: document.getElementById('citta').value,
        provincia: document.getElementById('provincia').value,
        cap: document.getElementById('cap').value,
        metriQuadri: parseFloat(document.getElementById('metriQuadri').value),
        camere: parseInt(document.getElementById('camere').value),
        bagni: parseInt(document.getElementById('bagni').value),
        balconi: parseInt(document.getElementById('balconi').value) || 0,
        tipo: document.getElementById('tipo').value,
        stato: document.getElementById('stato').value,
        descrizione: document.getElementById('descrizione').value,
        // Caratteristiche opzionali
        garage: document.getElementById('garage').checked,
        giardino: document.getElementById('giardino').checked,
        terrazzo: document.getElementById('terrazzo').checked
    };

    const res = await authenticatedFetch(`${AUTH_CONFIG.API_BASE_URL}/valutazioni/logged`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const txt = await res.text();
        throw new Error("Errore durante la valutazione: " + txt);
    }
    return await res.json();
}

async function inviaValutazioneOspite() {
    const payload = {
        nome: document.getElementById('nome').value,
        cognome: document.getElementById('cognome').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        password: document.getElementById('password').value,
        isProprietario: document.querySelector('input[name="isProprietario"]:checked')?.value === 'true',
        // Dati immobile
        indirizzo: document.getElementById('indirizzo').value,
        citta: document.getElementById('citta').value,
        provincia: document.getElementById('provincia').value,
        cap: document.getElementById('cap').value,
        metriQuadri: parseFloat(document.getElementById('metriQuadri').value),
        camere: parseInt(document.getElementById('camere').value),
        bagni: parseInt(document.getElementById('bagni').value),
        balconi: parseInt(document.getElementById('balconi').value) || 0,
        tipo: document.getElementById('tipo').value,
        stato: document.getElementById('stato').value,
        descrizione: document.getElementById('descrizione').value,
        // Caratteristiche opzionali
        garage: document.getElementById('garage').checked,
        giardino: document.getElementById('giardino').checked,
        terrazzo: document.getElementById('terrazzo').checked
    };

    const res = await fetch(`${AUTH_CONFIG.API_BASE_URL}/valutazioni/automatica`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const txt = await res.text();
        if(txt.includes("ConstraintViolation")) throw new Error("Email già registrata. Fai il login.");
        throw new Error("Errore server.");
    }
    return await res.json();
}

// --- 8. MOSTRA RISULTATO ---
function mostraRisultato(data) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('progress-container').style.display = 'none'; // Nasconde barra

    const resultEl = document.getElementById('result');
    resultEl.classList.remove('hidden');
    
    document.getElementById('result-valore').textContent = `€ ${data.valoreStimato.toLocaleString('it-IT')}`;
    document.getElementById('result-base').textContent = `€ ${data.valoreBaseZona ? data.valoreBaseZona.toLocaleString('it-IT') : '-'}`;
    document.getElementById('result-messaggio').textContent = data.messaggio || "Valutazione completata!";
    
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
    window.location.reload();
}