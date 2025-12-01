/**
 * Utility per validazione email e telefono cellulare
 */

/**
 * Valida formato email
 * @param {string} email - Email da validare
 * @returns {boolean} - true se valida, false altrimenti
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida numero cellulare italiano
 * Formato richiesto: 3xxxxxxxxx (10 cifre che iniziano con 3)
 * @param {string} phone - Numero di telefono da validare
 * @returns {boolean} - true se valido, false altrimenti
 */
function isValidCellulare(phone) {
  const phoneRegex = /^3\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Formatta numero di telefono rimuovendo spazi, trattini e altri caratteri
 * @param {string} phone - Numero di telefono da formattare
 * @returns {string} - Numero formattato (solo cifre)
 */
function formatPhoneNumber(phone) {
  return phone.replace(/\D/g, '');
}

/**
 * Mostra errore di validazione su un campo input
 * @param {HTMLElement} inputElement - Elemento input
 * @param {string} message - Messaggio di errore
 */
function showFieldError(inputElement, message) {
  if (!inputElement) return;
  
  // Aggiungi classe errore
  inputElement.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
  inputElement.classList.remove('border-gray-300');
  
  // Cerca o crea elemento errore
  let errorElement = inputElement.parentElement.querySelector('.field-error');
  
  if (!errorElement) {
    errorElement = document.createElement('p');
    errorElement.className = 'field-error text-red-500 text-sm mt-1';
    inputElement.parentElement.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

/**
 * Rimuove errore di validazione da un campo input
 * @param {HTMLElement} inputElement - Elemento input
 */
function clearFieldError(inputElement) {
  if (!inputElement) return;
  
  // Rimuovi classe errore
  inputElement.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
  inputElement.classList.add('border-gray-300');
  
  // Nascondi messaggio errore
  const errorElement = inputElement.parentElement.querySelector('.field-error');
  if (errorElement) {
    errorElement.classList.add('hidden');
  }
}

/**
 * Valida campo email in tempo reale
 * @param {HTMLElement} inputElement - Campo email
 */
function validateEmailField(inputElement) {
  const email = inputElement.value.trim();
  
  if (!email) {
    showFieldError(inputElement, 'Email obbligatoria');
    return false;
  }
  
  if (!isValidEmail(email)) {
    showFieldError(inputElement, 'Email non valida');
    return false;
  }
  
  clearFieldError(inputElement);
  return true;
}

/**
 * Valida campo telefono cellulare in tempo reale
 * @param {HTMLElement} inputElement - Campo telefono
 */
function validatePhoneField(inputElement) {
  const phone = formatPhoneNumber(inputElement.value.trim());
  
  if (!phone) {
    showFieldError(inputElement, 'Numero di cellulare obbligatorio');
    return false;
  }
  
  if (!isValidCellulare(phone)) {
    showFieldError(inputElement, 'Numero cellulare non valido. Inserisci 10 cifre che iniziano con 3 (es. 3331234567)');
    return false;
  }
  
  clearFieldError(inputElement);
  // Formatta il campo con il numero pulito
  inputElement.value = phone;
  return true;
}

/**
 * Setup validazione automatica per campi email
 * @param {string} selector - Selettore CSS per i campi email
 */
function setupEmailValidation(selector = 'input[type="email"]') {
  document.querySelectorAll(selector).forEach(input => {
    // Validazione al blur (quando perde focus)
    input.addEventListener('blur', () => {
      if (input.value) {
        validateEmailField(input);
      }
    });
    
    // Rimuovi errore quando inizia a digitare
    input.addEventListener('input', () => {
      if (input.classList.contains('border-red-500')) {
        clearFieldError(input);
      }
    });
  });
}

/**
 * Setup validazione automatica per campi telefono
 * @param {string} selector - Selettore CSS per i campi telefono
 */
function setupPhoneValidation(selector = 'input[name="telefono"], input[id="telefono"]') {
  document.querySelectorAll(selector).forEach(input => {
    // Imposta tipo tel e pattern
    input.setAttribute('type', 'tel');
    input.setAttribute('pattern', '^3\\d{9}$');
    input.setAttribute('maxlength', '10');
    input.setAttribute('placeholder', '3331234567');
    
    // Validazione al blur
    input.addEventListener('blur', () => {
      if (input.value) {
        validatePhoneField(input);
      }
    });
    
    // Rimuovi errore quando inizia a digitare
    input.addEventListener('input', () => {
      if (input.classList.contains('border-red-500')) {
        clearFieldError(input);
      }
      
      // Permetti solo numeri
      input.value = input.value.replace(/\D/g, '');
    });
  });
}

/**
 * Inizializza validazione su tutti i form della pagina
 */
function initializeValidation() {
  setupEmailValidation();
  setupPhoneValidation();
}

// Auto-inizializza al caricamento della pagina
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeValidation);
  } else {
    initializeValidation();
  }
}
