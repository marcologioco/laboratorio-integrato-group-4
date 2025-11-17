document.addEventListener('DOMContentLoaded', function () {
            
    // --- LOGICA FORM MULTISTEP ---
    const formContainer = document.getElementById('valuation-form-container');
    if (!formContainer) return; 

    const form = document.getElementById('multi-step-form');
    const steps = Array.from(formContainer.querySelectorAll('.form-step'));
    const progressBar = document.getElementById('progress-bar');
    const currentStepDisplay = document.getElementById('current-step-display');
    
    // MODIFICA 1: Escludiamo lo step 9 (Conferma) dal conteggio della barra
    const totalSteps = steps.filter(step => step.dataset.step !== '9').length; 
    
    let currentStep = 1;
    const formData = {};

    // Funzione per mostrare lo step
    function showStep(stepNumber) {
        steps.forEach(step => {
            // Assicuriamoci che il confronto sia tra numeri
            if (parseInt(step.dataset.step) === stepNumber) {
                step.classList.remove('hidden');
                step.classList.add('active-step');
            } else {
                step.classList.add('hidden');
                step.classList.remove('active-step');
            }
        });
        
        // Aggiorna la progress bar
        if (stepNumber <= totalSteps) {
            const progress = ((stepNumber -1) / totalSteps) * 100 + (100 / totalSteps); 
            progressBar.style.width = `${progress}%`;
            currentStepDisplay.textContent = stepNumber;
        } else {
            // Step di conferma (step 9)
            progressBar.style.width = '100%';
            currentStepDisplay.textContent = '✓'; 
        }
    }
    
    // Validazione
    function validateStep(stepNumber) {
        const activeStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        const errorDisplay = document.getElementById(`error-step-${stepNumber}`);
        let isValid = true;
        
        if(errorDisplay) errorDisplay.classList.add('hidden');

        switch(stepNumber) {
            case 1: // CAP
                const cap = activeStep.querySelector('#cap');
                const capRegex = /^[0-9]{5}$/;
                if (!capRegex.test(cap.value)) {
                    isValid = false;
                    if(errorDisplay) errorDisplay.classList.remove('hidden');
                } else {
                    formData.cap = cap.value;
                }
                break;
            
            case 2: // Tipo
            case 3: // Stato
                const fieldName = stepNumber === 2 ? 'tipo' : 'stato';
                if (!formData[fieldName]) {
                     isValid = false;
                     if(errorDisplay) errorDisplay.classList.remove('hidden');
                }
                break;

            case 4: // Metratura
                const metratura = activeStep.querySelector('#metratura');
                if (!metratura.value || parseInt(metratura.value) <= 0) {
                    isValid = false;
                    if(errorDisplay) errorDisplay.classList.remove('hidden');
                } else {
                    formData.metratura = metratura.value;
                }
                break;

            case 5: // Locali
                const locali = activeStep.querySelector('#locali');
                if (!locali.value || parseInt(locali.value) <= 0) {
                    isValid = false;
                    if(errorDisplay) errorDisplay.classList.remove('hidden');
                } else {
                    formData.locali = locali.value;
                }
                break;

            case 6: // Bagni
                const bagni = activeStep.querySelector('#bagni');
                if (!bagni.value || parseInt(bagni.value) <= 0) {
                    isValid = false;
                    if(errorDisplay) errorDisplay.classList.remove('hidden');
                } else {
                    formData.bagni = bagni.value;
                }
                break;

            // MODIFICA 2: Il Case 7 ora gestisce i Checkbox (Opzionali)
            case 7: 
                // Qui non c'è validazione bloccante perché sono checkbox opzionali.
                // Salviamo semplicemente i dati.
                const giardino = activeStep.querySelector('input[name="giardino"]');
                const garage = activeStep.querySelector('input[name="garage"]');
                const terrazzo = activeStep.querySelector('input[name="terrazzo"]');
                
                formData.giardino = giardino ? giardino.checked : false;
                formData.garage = garage ? garage.checked : false;
                formData.terrazzo = terrazzo ? terrazzo.checked : false;
                
                isValid = true; 
                break;

            // MODIFICA 3: Aggiunto Case 8 per l'Email
            case 8: 
                const email = activeStep.querySelector('#email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email.value)) {
                    isValid = false;
                    if(errorDisplay) errorDisplay.classList.remove('hidden');
                } else {
                    formData.email = email.value;
                }
                break;
        }
        
        return isValid;
    }

    // Gestione Click (Next, Back, Submit)
    formContainer.addEventListener('click', function(e) {
        const action = e.target.dataset.action;

        if (action === 'next') {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        } 
        
        else if (action === 'back') {
            currentStep--;
            showStep(currentStep);
        } 
        
        else if (action === 'submit') {
            // Validiamo lo step corrente (che è l'8, email)
            if (validateStep(currentStep)) {
                
                console.log('Dati del Form Inviati:', formData);
                // Qui puoi inserire la chiamata AJAX/Fetch
                
                // Vai allo step di conferma (step 9)
                currentStep = 9; 
                showStep(currentStep);
            }
        }
    });
    
    // Gestione Click Card Selezionabili (Step 2 e 3)
    formContainer.querySelectorAll('.form-card').forEach(card => {
        card.addEventListener('click', function() {
            const field = card.dataset.field;
            const value = card.dataset.value;
            
            formData[field] = value;

            const parentStep = card.closest('.form-step');
            parentStep.querySelectorAll('.form-card').forEach(c => c.classList.remove('selected', 'border-my-green-dark', 'bg-gray-50'));
            // Aggiunge classi visive per la selezione
            card.classList.add('selected', 'border-my-green-dark', 'bg-gray-50'); 

            const errorDisplay = parentStep.querySelector('small[id^="error-"]');
            if(errorDisplay) errorDisplay.classList.add('hidden');
            
            setTimeout(() => {
                if (validateStep(currentStep)) {
                    currentStep++;
                    showStep(currentStep);
                }
            }, 200); 
        });
    });

    // Gestione "Inizia di nuovo"
    const startOverButton = document.getElementById('start-over');
    if (startOverButton) {
        startOverButton.addEventListener('click', function() {
            Object.keys(formData).forEach(key => delete formData[key]);
            if(form) form.reset();
            
            // Reset visuale delle card
            formContainer.querySelectorAll('.form-card').forEach(c => 
                c.classList.remove('selected', 'border-my-green-dark', 'bg-gray-50')
            );
            
            formContainer.querySelectorAll('small[id^="error-"]').forEach(err => err.classList.add('hidden'));

            currentStep = 1;
            showStep(currentStep);
        });
    }
});