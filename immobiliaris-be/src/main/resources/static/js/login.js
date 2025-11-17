/**
 * Login Form Handler
 * Gestisce l'autenticazione con il backend
 */

document.addEventListener('DOMContentLoaded', () => {
  // Se già autenticato, redirect alla pagina appropriata
  if (isAuthenticated()) {
    redirectByRole();
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginButton = document.getElementById('loginButton');

  if (!loginForm) {
    console.error('Form di login non trovato');
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validazione base
    if (!email || !password) {
      showError('Inserisci email e password');
      return;
    }

    // Disabilita il pulsante durante il login
    loginButton.disabled = true;
    loginButton.textContent = 'Accesso in corso...';

    try {
      // Chiamata API di login
      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Email o password errati');
        }
        throw new Error('Errore durante il login');
      }

      const data = await response.json();

      // Salva token e dati utente
      saveAuthData(data.token, data.user);

      // Mostra messaggio di successo
      showSuccess('Login effettuato con successo!');

      // Redirect basato sul ruolo
      setTimeout(() => {
        redirectByRole();
      }, 500);

    } catch (error) {
      console.error('Errore login:', error);
      showError(error.message || 'Errore durante il login');
      
      // Riabilita il pulsante
      loginButton.disabled = false;
      loginButton.textContent = 'Accedi';
    }
  });
});