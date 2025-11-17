/**
 * Form Valutazione Immobile - Multi-step
 */

let currentStep = 1;
const totalSteps = 3;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Valutazione.js caricato');
    setupFormNavigation();
    setupFormSubmit();
});

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
    
    // Mostra lo step corrente
    document.getElementById(`step-${step}`)?.classList.add('active');
    
    currentStep = step;
    updateProgressBar();
}

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

function validateCurrentStep() {
    const currentStepEl = document.getElementById(`step-${currentStep}`);
    if (!currentStepEl) {
        console.log('Step non trovato:', currentStep);
        return true;
    }
    
    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    console.log('Campi richiesti nello step', currentStep, ':', requiredInputs.length);
    
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value || input.value.trim() === '') {
            isValid = false;
            input.classList.add('border-red-500');
            console.log('Campo vuoto:', input.id);
            
            // Rimuovi il bordo rosso quando l'utente inizia a digitare
            input.addEventListener('input', function() {
                this.classList.remove('border-red-500');
            }, { once: true });
        }
    });
    
    if (!isValid) {
        showError('Compila tutti i campi obbligatori');
        console.log('Validazione fallita');
    } else {
        console.log('Validazione superata');
    }
    
    return isValid;
}

async function inviaValutazione() {
    const submitBtn = document.getElementById('submit-btn');
    const loadingEl = document.getElementById('loading');
    const resultEl = document.getElementById('result');
    
    // Disabilita pulsante e mostra loading
    if (submitBtn) submitBtn.disabled = true;
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (resultEl) resultEl.classList.add('hidden');
    
    try {
        // Raccogli dati dal form
        const formData = {
            // Dati utente
            nome: document.getElementById('nome').value,
            cognome: document.getElementById('cognome').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            password: document.getElementById('password').value,
            
            // Dati immobile
            indirizzo: document.getElementById('indirizzo').value,
            citta: document.getElementById('citta').value,
            provincia: document.getElementById('provincia').value,
            cap: document.getElementById('cap').value,
            metriQuadri: parseFloat(document.getElementById('metriQuadri').value),
            camere: parseInt(document.getElementById('camere').value),
            bagni: parseInt(document.getElementById('bagni').value),
            
            // Dati opzionali
            balconi: parseInt(document.getElementById('balconi').value) || 0,
            terrazzo: document.getElementById('terrazzo').checked,
            giardino: document.getElementById('giardino').checked,
            garage: document.getElementById('garage').checked,
            stato: document.getElementById('stato').value,
            tipo: document.getElementById('tipo').value,
            descrizione: document.getElementById('descrizione').value
        };
        
        // Chiamata API
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
        
        // Mostra risultato
        mostraRisultato(data);
        
    } catch (error) {
        console.error('Errore:', error);
        showError('Si è verificato un errore durante la valutazione. Riprova più tardi.');
        
        if (submitBtn) submitBtn.disabled = false;
        if (loadingEl) loadingEl.classList.add('hidden');
        
    }
}

function mostraRisultato(data) {
    const loadingEl = document.getElementById('loading');
    const resultEl = document.getElementById('result');
    const formContainer = document.getElementById('form-container');
    
    if (loadingEl) loadingEl.classList.add('hidden');
    if (formContainer) formContainer.classList.add('hidden');
    
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

function showError(message) {
    const errorEl = document.getElementById('error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        
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
    
    goToStep(1);
    
    const formContainer = document.getElementById('form-container');
    const resultEl = document.getElementById('result');
    
    if (formContainer) formContainer.classList.remove('hidden');
    if (resultEl) resultEl.classList.add('hidden');
}
