/**
 * Utility per gestione autenticazione JWT
 */

const AUTH_CONFIG = {
  API_BASE_URL: 'http://localhost:8080/api',
  TOKEN_KEY: 'immobiliaris_token',
  USER_KEY: 'immobiliaris_user'
};

// Salva token e dati utente nel localStorage
function saveAuthData(token, user) {
  localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
  localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
}

// Recupera il token salvato
function getToken() {
  return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
}

// Recupera i dati utente salvati
function getUser() {
  const userData = localStorage.getItem(AUTH_CONFIG.USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

// Verifica se l'utente è autenticato
function isAuthenticated() {
  return !!getToken();
}

// Verifica se l'utente è admin
function isAdmin() {
  const user = getUser();
  return user && user.idRuolo === 2;
}

// Logout: rimuove token e dati utente
function logout() {
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  window.location.href = 'login.html';
}

// Fetch con autenticazione JWT
async function authenticatedFetch(url, options = {}) {
  const token = getToken();
  
  if (!token) {
    throw new Error('Non autenticato');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Se 401 o 403, redirect al login
  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error('Sessione scaduta o non autorizzato');
  }

  return response;
}

// Proteggi pagina: verifica autenticazione
function protectPage(requireAdmin = false) {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }

  if (requireAdmin && !isAdmin()) {
    alert('Accesso negato: solo amministratori');
    window.location.href = 'account.html';
    return false;
  }

  return true;
}

// Redirect basato su ruolo dopo login
function redirectByRole() {
  const user = getUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // idRuolo: 1 = utente, 2 = admin
  if (user.idRuolo === 2) {
    window.location.href = 'admin.html';
  } else {
    window.location.href = 'account.html';
  }
}

// Mostra messaggio di errore
function showError(message, elementId = 'error-message') {
  const errorEl = document.getElementById(elementId);
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

// Mostra messaggio di successo
function showSuccess(message, elementId = 'success-message') {
  const successEl = document.getElementById(elementId);
  if (successEl) {
    successEl.textContent = message;
    successEl.classList.remove('hidden');
    setTimeout(() => {
      successEl.classList.add('hidden');
    }, 3000);
  }
}
