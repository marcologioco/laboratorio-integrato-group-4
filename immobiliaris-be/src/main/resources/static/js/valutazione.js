/**
 * Form Valutazione Immobile - Multi-step (6 Step Version con step 0)
 */

let currentStep = 0;
const totalSteps = 5; // Step da 1 a 5 (lo step 0 non conta nel progresso)
let isLoggedMode = false;

// --- INIZIALIZZAZIONE ---
document.addEventListener('DOMContentLoaded', () => {
    checkLoggedMode();
    setupRegistrationChoice();
    setupFormNavigation();
    setupFormSubmit();
    setupCustomCards();
    updateProgressBar(); // Inizializza la barra
});

// --- CONTROLLO MODALITÀ UTENTE LOGGATO ---
function checkLoggedMode() {
    const urlParams = new URLSearchParams(window.location.search);
    isLoggedMode = urlParams.get('mode') === 'logged';
    
    if (isLoggedMode) {
        // Utente già loggato: salta lo step 0 e lo step 1 (dati personali)
        const token = getToken();
        if (!token) {
            // Se non c'è il token, redirect al login
            window.location.href = 'login.html';
            return;
        }
        
        // Nascondi step 0 e step 1
        document.getElementById('step-0').classList.add('hidden');
        document.getElementById('step-0').classList.remove('active');
        document.getElementById('step-1').classList.add('hidden');
        
        // IMPORTANTE: Rimuovi required dai campi dello step 1 per evitare errori di validazione HTML5
        const step1 = document.getElementById('step-1');
        if (step1) {
            step1.querySelectorAll('[required]').forEach(input => {
                input.removeAttribute('required');
            });
        }
        
        // Mostra la progress bar e vai allo step 2
        document.getElementById('progress-container').style.display = 'block';
        currentStep = 2;
        goToStep(2);
    }
}

// --- GESTIONE SCELTA REGISTRAZIONE ---
function setupRegistrationChoice() {
    document.querySelectorAll('.registration-choice').forEach(card => {
        card.addEventListener('click', function() {
            const choice = this.getAttribute('data-choice');
            
            if (choice === 'yes') {
                // Redirect al login
                window.location.href = 'login.html';
            } else {
                // Procedi con la registrazione normale
                document.getElementById('step-0').classList.add('hidden');
                document.getElementById('step-0').classList.remove('active');
                document.getElementById('progress-container').style.display = 'block';
                currentStep = 1;
                goToStep(1);
            }
        });
    });
}

// --- NAVIGAZIONE FORM ---
function setupFormNavigation() {
    // Pulsanti Avanti
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateCurrentStep()) {
                goToStep(currentStep + 1);
            }
        });
    });
    
    // Pulsanti Indietro
    const prevButtons = document.querySelectorAll('.btn-prev');
    prevButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            goToStep(currentStep - 1);
        });
    });
}

function goToStep(step) {
    if (step < 0 || step > totalSteps) return;
    
    // Step 0 è speciale, non permettere di tornarci
    if (step === 0 && currentStep > 0) return;
    
    // Nascondi tutti gli step
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden'); // Usa la classe hidden di Tailwind
    });
    
    // Mostra step corrente
    const stepEl = document.getElementById(`step-${step}`);
    if (stepEl) {
        stepEl.classList.remove('hidden');
        stepEl.classList.add('active');
    }
    
    currentStep = step;
    updateProgressBar();
    
    // Scroll in cima al form per UX su mobile
    const formContainer = document.getElementById('form-container');
    if(formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateProgressBar() {
    // Lo step 0 non conta nel progresso
    if (currentStep === 0) return;
    
    const progress = (currentStep / totalSteps) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    const stepIndicator = document.getElementById('step-indicator');
    if (stepIndicator) {
        stepIndicator.textContent = `Step ${currentStep} di ${totalSteps}`;
    }
}

// --- VALIDAZIONE ---
function validateCurrentStep() {
    const currentStepEl = document.getElementById(`step-${currentStep}`);
    if (!currentStepEl) return true;
    
    let isValid = true;
    let errorMessage = '';

    // Step 1: Dati personali & Checkbox Proprietario (SALTA SE LOGGED)
    if (currentStep === 1 && !isLoggedMode) {
        // Valida email
        const emailInput = document.getElementById('email');
        if (emailInput && !validateEmailField(emailInput)) {
            isValid = false;
        }
        
        // Valida telefono
        const telefonoInput = document.getElementById('telefono');
        if (telefonoInput && !validatePhoneField(telefonoInput)) {
            isValid = false;
        }
        
        const isProprietarioSelected = document.querySelector('input[name="isProprietario"]:checked');
        if (!isProprietarioSelected) {
            isValid = false;
            errorMessage = 'Indica se sei il proprietario dell\'immobile';
        }
    }
    
    // Step 3: Tipo Immobile (adesso è isolato)
    if (currentStep === 3) {
        const tipoInput = document.getElementById('tipo');
        if (!tipoInput.value) {
            isValid = false;
            errorMessage = 'Seleziona il tipo di immobile';
        }
    }

    // Step 4: Stato Immobile (adesso è isolato)
    if (currentStep === 4) {
        const statoInput = document.getElementById('stato');
        if (!statoInput.value) {
            isValid = false;
            errorMessage = 'Seleziona lo stato dell\'immobile';
        }
    }

    // Validazione input generici (text, number, email, etc.)
    // Escludiamo anche gli input che sono in step nascosti
    const requiredInputs = currentStepEl.querySelectorAll('input[required]:not([type="email"]):not([name="telefono"]), select[required]:not(.hidden)');
    requiredInputs.forEach(input => {
        // Salta la validazione se l'input è in uno step nascosto
        const parentStep = input.closest('.form-step');
        if (parentStep && parentStep.classList.contains('hidden')) {
            return;
        }
        
        if (!input.value || input.value.trim() === '') {
            isValid = false;
            input.classList.add('border-red-500');
            input.addEventListener('input', function() {
                this.classList.remove('border-red-500');
            }, { once: true });
        }
    });
    
    if (!isValid) {
        showError(errorMessage || 'Compila tutti i campi obbligatori per proseguire');
    }
    
    return isValid;
}

// --- GESTIONE CARD PERSONALIZZATE ---
function setupCustomCards() {
    // Helper attivazione/disattivazione visiva
    const updateCardStyle = (card, isActive) => {
        const icon = card.querySelector('svg');
        const text = card.querySelector('span');

        if (isActive) {
            card.classList.remove('border-gray-100', 'bg-white');
            card.classList.add('border-my-orange', 'bg-orange-50');
            if(icon) { icon.classList.remove('text-gray-400'); icon.classList.add('text-my-orange'); }
            if(text) { text.classList.remove('text-gray-600'); text.classList.add('text-my-orange'); }
        } else {
            card.classList.remove('border-my-orange', 'bg-orange-50');
            card.classList.add('border-gray-100', 'bg-white');
            if(icon) { icon.classList.remove('text-my-orange'); icon.classList.add('text-gray-400'); }
            if(text) { text.classList.remove('text-my-orange'); text.classList.add('text-gray-600'); }
        }
    };

    // Card Selezione Singola (Tipo e Stato)
    document.querySelectorAll('.selection-card').forEach(card => {
        card.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const value = this.getAttribute('data-value');
            
            // Aggiorna select nascosta
            const hiddenSelect = document.getElementById(targetId);
            if (hiddenSelect) hiddenSelect.value = value;

            // Aggiorna UI: disattiva fratelli, attiva corrente
            document.querySelectorAll(`.selection-card[data-target="${targetId}"]`).forEach(c => updateCardStyle(c, false));
            updateCardStyle(this, true);
        });
    });

    // Card Selezione Multipla (Checkbox: Terrazzo, Garage...)
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const checkbox = document.getElementById(targetId);
            
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                updateCardStyle(this, checkbox.checked);
            }
        });
    });
}

// --- INVIO FORM ---
function setupFormSubmit() {
    const form = document.getElementById('valutazione-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validazione finale (Step 5)
        if (!validateCurrentStep()) return;
        
        await inviaValutazione();
    });
}

async function inviaValutazione() {
    console.log('=== INIZIO INVIO VALUTAZIONE ===');
    console.log('isLoggedMode:', isLoggedMode);
    
    const submitBtn = document.getElementById('submit-btn');
    const loadingEl = document.getElementById('loading');
    const formContainer = document.getElementById('form-container');
    
    if (submitBtn) submitBtn.disabled = true;
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (formContainer) formContainer.classList.add('hidden');
    
    try {
        let formData;
        
        if (isLoggedMode) {
            // Utente già loggato: invia solo i dati dell'immobile
            const token = getToken();
            
            formData = {
                indirizzo: document.getElementById('indirizzo').value,
                citta: document.getElementById('citta').value,
                provincia: document.getElementById('provincia').value,
                cap: document.getElementById('cap').value,
                metriQuadri: parseFloat(document.getElementById('metriQuadri').value),
                camere: parseInt(document.getElementById('camere').value),
                bagni: parseInt(document.getElementById('bagni').value),
                balconi: parseInt(document.getElementById('balconi').value) || 0,
                terrazzo: document.getElementById('terrazzo').checked,
                giardino: document.getElementById('giardino').checked,
                garage: document.getElementById('garage').checked,
                stato: document.getElementById('stato').value,
                tipo: document.getElementById('tipo').value,
                descrizione: document.getElementById('descrizione').value
            };

            // Chiamata API per utente loggato (endpoint diverso)
            console.log('Invio dati utente loggato:', formData);
            console.log('Token:', token);
            
            const response = await fetch('http://localhost:8080/api/valutazioni/logged', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Errore response:', errorText);
                throw new Error('Errore valutazione: ' + response.status);
            }
            
            const data = await response.json();
            console.log('Dati ricevuti:', data);
            mostraRisultatoLogged(data);
            
        } else {
            // Utente nuovo: invia tutti i dati (inclusi dati personali)
            formData = {
                nome: document.getElementById('nome').value,
                cognome: document.getElementById('cognome').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                password: document.getElementById('password').value,
                isProprietario: document.querySelector('input[name="isProprietario"]:checked')?.value === 'true',
                indirizzo: document.getElementById('indirizzo').value,
                citta: document.getElementById('citta').value,
                provincia: document.getElementById('provincia').value,
                cap: document.getElementById('cap').value,
                metriQuadri: parseFloat(document.getElementById('metriQuadri').value),
                camere: parseInt(document.getElementById('camere').value),
                bagni: parseInt(document.getElementById('bagni').value),
                balconi: parseInt(document.getElementById('balconi').value) || 0,
                terrazzo: document.getElementById('terrazzo').checked,
                giardino: document.getElementById('giardino').checked,
                garage: document.getElementById('garage').checked,
                stato: document.getElementById('stato').value,
                tipo: document.getElementById('tipo').value,
                descrizione: document.getElementById('descrizione').value
            };

            // Chiamata API per nuovo utente
            console.log('Invio dati nuovo utente:', formData);
            
            const response = await fetch('http://localhost:8080/api/valutazioni/automatica', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Errore response:', errorText);
                throw new Error('Errore valutazione: ' + response.status);
            }
            
            const data = await response.json();
            console.log('Dati ricevuti:', data);
            mostraRisultato(data);
        }
        
    } catch (error) {
        console.error('=== ERRORE VALUTAZIONE ===');
        console.error('Errore:', error);
        console.error('Messaggio:', error.message);
        console.error('Stack:', error.stack);
        
        showError('Errore durante la valutazione. Riprova più tardi.');
        if (submitBtn) submitBtn.disabled = false;
        if (loadingEl) loadingEl.classList.add('hidden');
        if (formContainer) formContainer.classList.remove('hidden');
    }
}

function mostraRisultato(data) {
    const loadingEl = document.getElementById('loading');
    const resultEl = document.getElementById('result');
    
    if (loadingEl) loadingEl.classList.add('hidden');
    
    if (resultEl) {
        resultEl.classList.remove('hidden');
        document.getElementById('result-valore').textContent = `€${data.valoreStimato.toLocaleString('it-IT')}`;
        document.getElementById('result-base').textContent = `€${data.valoreBaseZona.toLocaleString('it-IT')}`;
        document.getElementById('result-messaggio').textContent = data.messaggio;
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function mostraRisultatoLogged(data) {
    const loadingEl = document.getElementById('loading');
    const resultEl = document.getElementById('result');
    
    if (loadingEl) loadingEl.classList.add('hidden');
    
    if (resultEl) {
        resultEl.classList.remove('hidden');
        document.getElementById('result-valore').textContent = `€${data.valoreStimato.toLocaleString('it-IT')}`;
        document.getElementById('result-base').textContent = `€${data.valoreBaseZona.toLocaleString('it-IT')}`;
        document.getElementById('result-messaggio').textContent = data.messaggio;
        
        // Modifica il bottone per tornare alla dashboard invece di reset
        const resetBtn = resultEl.querySelector('button');
        if (resetBtn) {
            resetBtn.textContent = 'Torna alla Dashboard';
            resetBtn.onclick = () => window.location.href = 'user.html';
        }
        
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showError(message) {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => errorEl.classList.add('hidden'), 5000);
    } else {
        alert(message);
    }
}

function resetForm() {
    const form = document.getElementById('valutazione-form');
    if (form) form.reset();
    
    // Reset stile card
    document.querySelectorAll('.selection-card, .feature-card').forEach(card => {
        card.classList.remove('border-my-orange', 'bg-orange-50');
        card.classList.add('border-gray-100', 'bg-white');
        const icon = card.querySelector('svg');
        const text = card.querySelector('span');
        if(icon) { icon.classList.remove('text-my-orange'); icon.classList.add('text-gray-400'); }
        if(text) { text.classList.remove('text-my-orange'); text.classList.add('text-gray-600'); }
    });
    
    // Torna allo step iniziale corretto
    if (isLoggedMode) {
        goToStep(2);
    } else {
        document.getElementById('progress-container').style.display = 'none';
        document.getElementById('step-0').classList.remove('hidden');
        document.getElementById('step-0').classList.add('active');
        currentStep = 0;
    }
    
    document.getElementById('form-container').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('submit-btn').disabled = false;
}