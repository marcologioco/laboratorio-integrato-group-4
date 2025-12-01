/**
 * Form Valutazione Immobile - Multi-step
 */

let currentStep = 1;
const totalSteps = 3;

// --- INIZIALIZZAZIONE ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('Valutazione.js caricato correttamente');
    
    // Inizializza tutte le funzioni
    setupFormNavigation();
    setupFormSubmit();
    setupCustomCards(); // Questa ora viene chiamata correttamente
});

// --- NAVIGAZIONE FORM ---
function setupFormNavigation() {
    // Tutti i pulsanti Avanti
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (validateCurrentStep()) {
                goToStep(currentStep + 1);
            }
        });
    });
    
    // Tutti i pulsanti Indietro
    const prevButtons = document.querySelectorAll('.btn-prev');
    prevButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            goToStep(currentStep - 1);
        });
    });
}

function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    
    // Nascondi tutti gli step
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    
    // Mostra lo step corrente (rimuove la classe hidden se presente e aggiunge active)
    const stepEl = document.getElementById(`step-${step}`);
    if (stepEl) {
        stepEl.classList.remove('hidden'); // Assicura che non sia nascosto da Tailwind
        stepEl.classList.add('active');
    }
    
    // Gestione visualizzazione step precedenti/successivi (per sicurezza su Tailwind)
    document.querySelectorAll('.form-step').forEach(s => {
        if (s.id !== `step-${step}`) {
            s.classList.remove('active');
            s.classList.add('hidden');
        }
    });
    
    currentStep = step;
    updateProgressBar();
}

function updateProgressBar() {
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
    if (!currentStepEl) {
        console.log('Step non trovato:', currentStep);
        return true;
    }
    
    let isValid = true;
    
    // Validazione speciale per step 1: verifica radio button isProprietario
    if (currentStep === 1) {
        const isProprietarioSelected = document.querySelector('input[name="isProprietario"]:checked');
        if (!isProprietarioSelected) {
            isValid = false;
            showError('Indica se sei il proprietario dell\'immobile');
        }
    }
    
    // Validazione input required generici
    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
        // Skip radio buttons già validati sopra o select nascoste gestite dalle card
        if (input.type === 'radio') return;
        
        // Per le select nascoste (Step 3), controlliamo se hanno un valore
        if (input.tagName === 'SELECT' && input.classList.contains('hidden')) {
             if (!input.value || input.value === "") {
                 isValid = false;
                 // Non possiamo colorare il bordo della select nascosta, mostriamo errore generico
             }
             return;
        }

        if (!input.value || input.value.trim() === '') {
            isValid = false;
            input.classList.add('border-red-500');
            
            // Rimuovi il bordo rosso quando l'utente inizia a digitare
            input.addEventListener('input', function() {
                this.classList.remove('border-red-500');
            }, { once: true });
        }
    });
    
    if (!isValid) {
        if (currentStep === 3) {
             showError('Seleziona le caratteristiche obbligatorie (Tipo e Stato)');
        } else if (currentStep !== 1) {
             showError('Compila tutti i campi obbligatori');
        }
    }
    
    return isValid;
}

// --- GESTIONE CARD PERSONALIZZATE (STEP 3) ---
function setupCustomCards() {
    
    // Funzione helper per attivare graficamente una card
    const activateCard = (card) => {
        // 1. Sfondo e Bordo
        card.classList.remove('border-gray-100', 'bg-white');
        // Usa bg-orange-50 se esiste nel tuo tema, altrimenti bg-orange-100 di default tailwind
        card.classList.add('border-my-orange', 'bg-orange-50'); 
        
        // 2. Icona (SVG)
        const icon = card.querySelector('svg');
        if (icon) {
            icon.classList.remove('text-gray-400');
            icon.classList.add('text-my-orange');
        }
        
        // 3. Testo (Span)
        const text = card.querySelector('span');
        if (text) {
            text.classList.remove('text-gray-600');
            text.classList.add('text-my-orange');
        }
    };

    // Funzione helper per disattivare graficamente una card
    const deactivateCard = (card) => {
        // 1. Ripristina Sfondo e Bordo
        card.classList.remove('border-my-orange', 'bg-orange-50');
        card.classList.add('border-gray-100', 'bg-white');
        
        // 2. Ripristina Icona
        const icon = card.querySelector('svg');
        if (icon) {
            icon.classList.remove('text-my-orange');
            icon.classList.add('text-gray-400');
        }
        
        // 3. Ripristina Testo
        const text = card.querySelector('span');
        if (text) {
            text.classList.remove('text-my-orange');
            text.classList.add('text-gray-600');
        }
    };

    // 1. LOGICA SELEZIONE SINGOLA (Tipo e Stato)
    const selectionCards = document.querySelectorAll('.selection-card');
    selectionCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target'); // es: 'tipo'
            const value = this.getAttribute('data-value');     // es: 'APPARTAMENTO'
            
            // Aggiorna la select nascosta
            const hiddenSelect = document.getElementById(targetId);
            if (hiddenSelect) {
                hiddenSelect.value = value;
                console.log(`Aggiornato ${targetId}: ${value}`);
            }

            // Resetta tutte le card dello stesso gruppo (fratelli)
            const siblings = document.querySelectorAll(`.selection-card[data-target="${targetId}"]`);
            siblings.forEach(sibling => deactivateCard(sibling));

            // Attiva la card cliccata
            activateCard(this);
        });
    });

    // 2. LOGICA SELEZIONE MULTIPLA (Accessori: Terrazzo, ecc.)
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target'); // es: 'terrazzo'
            const checkbox = document.getElementById(targetId);
            
            if (checkbox) {
                // Inverti lo stato del checkbox
                checkbox.checked = !checkbox.checked;
                console.log(`Aggiornato ${targetId}: ${checkbox.checked}`);
                
                // Aggiorna la grafica in base al nuovo stato
                if (checkbox.checked) {
                    activateCard(this);
                } else {
                    deactivateCard(this);
                }
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
        
        if (!validateCurrentStep()) {
            return;
        }
        
        await inviaValutazione();
    });
}

async function inviaValutazione() {
    const submitBtn = document.getElementById('submit-btn');
    const loadingEl = document.getElementById('loading');
    const resultEl = document.getElementById('result');
    const formContainer = document.getElementById('form-container');
    
    // UI Loading state
    if (submitBtn) submitBtn.disabled = true;
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (formContainer) formContainer.classList.add('hidden'); // Nascondiamo il form durante il caricamento
    
    try {
        // Raccogli dati dal form
        const formData = {
            // Dati utente
            nome: document.getElementById('nome').value,
            cognome: document.getElementById('cognome').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            password: document.getElementById('password').value,
            
            // Indica se l'utente è il proprietario
            isProprietario: document.querySelector('input[name="isProprietario"]:checked')?.value === 'true',
            
            // Dati immobile
            indirizzo: document.getElementById('indirizzo').value,
            citta: document.getElementById('citta').value,
            provincia: document.getElementById('provincia').value,
            cap: document.getElementById('cap').value,
            metriQuadri: parseFloat(document.getElementById('metriQuadri').value),
            camere: parseInt(document.getElementById('camere').value),
            bagni: parseInt(document.getElementById('bagni').value),
            
            // Dati opzionali e Step 3
            balconi: parseInt(document.getElementById('balconi').value) || 0,
            terrazzo: document.getElementById('terrazzo').checked,
            giardino: document.getElementById('giardino').checked,
            garage: document.getElementById('garage').checked,
            stato: document.getElementById('stato').value, // Prende valore dalla select nascosta
            tipo: document.getElementById('tipo').value,   // Prende valore dalla select nascosta
            descrizione: document.getElementById('descrizione').value
        };

        console.log('Invio dati:', formData);
        
        // Simulazione ritardo rete (Rimuovi setTimeout in produzione) o chiamata reale
        // const response = await fetch('http://localhost:8080/api/valutazioni/automatica', { ... });
        
        // Qui uso fetch reale come nel tuo codice originale:
        const response = await fetch('http://localhost:8080/api/valutazioni/automatica', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Errore durante la valutazione');
        }
        
        const data = await response.json();
        mostraRisultato(data);
        
    } catch (error) {
        console.error('Errore:', error);
        showError('Si è verificato un errore durante la valutazione. Riprova più tardi.');
        
        // Ripristina UI in caso di errore
        if (submitBtn) submitBtn.disabled = false;
        if (loadingEl) loadingEl.classList.add('hidden');
        if (formContainer) formContainer.classList.remove('hidden');
    }
}

function mostraRisultato(data) {
    const loadingEl = document.getElementById('loading');
    const resultEl = document.getElementById('result');
    const formContainer = document.getElementById('form-container');
    
    if (loadingEl) loadingEl.classList.add('hidden');
    // formContainer rimane hidden (già fatto in inviaValutazione)
    
    if (resultEl) {
        resultEl.classList.remove('hidden');
        
        // Popola i risultati
        document.getElementById('result-valore').textContent = 
            `€${data.valoreStimato.toLocaleString('it-IT')}`;
        document.getElementById('result-base').textContent = 
            `€${data.valoreBaseZona.toLocaleString('it-IT')}`;
        document.getElementById('result-messaggio').textContent = data.messaggio;
        
        // Scroll al risultato
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// --- UTILITIES ---
function showError(message) {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        
        // Scroll verso l'errore se non è visibile
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            errorEl.classList.add('hidden');
        }, 5000);
    } else {
        alert(message);
    }
}

function resetForm() {
    const form = document.getElementById('valutazione-form');
    if (form) form.reset();
    
    // Resetta lo stile delle card (rimuovi arancione)
    document.querySelectorAll('.selection-card, .feature-card').forEach(card => {
        card.classList.remove('border-my-orange', 'bg-orange-50');
        card.classList.add('border-gray-100', 'bg-white');
        
        const icon = card.querySelector('svg');
        if(icon) {
            icon.classList.remove('text-my-orange');
            icon.classList.add('text-gray-400');
        }
        
        const text = card.querySelector('span');
        if(text) {
             text.classList.remove('text-my-orange');
             text.classList.add('text-gray-600');
        }
    });
    
    goToStep(1);
    
    const formContainer = document.getElementById('form-container');
    const resultEl = document.getElementById('result');
    const submitBtn = document.getElementById('submit-btn');
    
    if (formContainer) formContainer.classList.remove('hidden');
    if (resultEl) resultEl.classList.add('hidden');
    if (submitBtn) submitBtn.disabled = false;
}