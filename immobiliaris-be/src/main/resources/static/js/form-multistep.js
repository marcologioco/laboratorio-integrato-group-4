document.addEventListener('DOMContentLoaded', function () {
            
    // --- LOGICA FORM MULTISTEP ---
    const formContainer = document.getElementById('valuation-form-container');
    // Se il form non è in questa pagina, non eseguire il codice
    if (!formContainer) return; 

    const form = document.getElementById('multi-step-form');
    const steps = Array.from(formContainer.querySelectorAll('.form-step'));
    const progressBar = document.getElementById('progress-bar');
    const currentStepDisplay = document.getElementById('current-step-display');
    
    const totalSteps = steps.filter(step => step.dataset.step !== '8').length; // 7 passi di input
    let currentStep = 1;
    const formData = {};

    // Funzione per mostrare lo step
    function showStep(stepNumber) {
        steps.forEach(step => {
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
            const progress = ((stepNumber -1) / totalSteps) * 100 + (100 / totalSteps); // Inizia già "piena" per lo step 1
            progressBar.style.width = `${progress}%`;
            currentStepDisplay.textContent = stepNumber;
        } else {
            // Step di conferma (step 8)
            progressBar.style.width = '100%';
            currentStepDisplay.textContent = '✓'; // Fatto!
        }
    }
    
    // Validazione
    function validateStep(stepNumber) {
        const activeStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        const errorDisplay = document.getElementById(`error-step-${stepNumber}`);
        let isValid = true;
        
        // Pulisce l'errore precedente
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
                // La validazione avviene al click sulla card
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
            case 7: // Email
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
            if (validateStep(currentStep)) {
                // Qui invieresti i dati a un server
                console.log('Dati del Form Inviati:', formData);
                
                // Vai allo step di conferma (step 8)
                currentStep = 8; // Vai direttamente allo step 8
                showStep(currentStep);
            }
        }
    });
    
    // Gestione Click Card Selezionabili (Step 2 e 3)
    formContainer.querySelectorAll('.form-card').forEach(card => {
        card.addEventListener('click', function() {
            const field = card.dataset.field;
            const value = card.dataset.value;
            
            // Salva il dato
            formData[field] = value;

            // Aggiorna lo stile
            const parentStep = card.closest('.form-step');
            parentStep.querySelectorAll('.form-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            // Pulisce l'errore se presente
            const errorDisplay = parentStep.querySelector('small[id^="error-"]');
            if(errorDisplay) errorDisplay.classList.add('hidden');
            
            // Vai automaticamente allo step successivo
            setTimeout(() => {
                if (validateStep(currentStep)) {
                    currentStep++;
                    showStep(currentStep);
                }
            }, 200); // Piccolo ritardo per far vedere la selezione
        });
    });

    // Gestione "Inizia di nuovo"
    const startOverButton = document.getElementById('start-over');
    if (startOverButton) {
        startOverButton.addEventListener('click', function() {
            // Resetta i dati
            Object.keys(formData).forEach(key => delete formData[key]);
            
            // Resetta gli input e le selezioni
            if(form) form.reset();
            formContainer.querySelectorAll('.form-card').forEach(c => c.classList.remove('selected'));
            formContainer.querySelectorAll('small[id^="error-"]').forEach(err => err.classList.add('hidden'));

            // Torna al primo step
            currentStep = 1;
            showStep(currentStep);
        });
    }

});