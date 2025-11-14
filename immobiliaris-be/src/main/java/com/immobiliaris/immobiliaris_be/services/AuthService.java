package com.immobiliaris.immobiliaris_be.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.immobiliaris.immobiliaris_be.dto.LoginRequest;
import com.immobiliaris.immobiliaris_be.dto.LoginResponse;
import com.immobiliaris.immobiliaris_be.model.Utente;

/**
 * Service per gestire l'autenticazione degli utenti
 */
@Service
public class AuthService {

    @Autowired
    private UtenteService utenteService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Autentica un utente con email e password
     * 
     * @param loginRequest contiene email e password
     * @return LoginResponse con dati utente e ruolo
     * @throws RuntimeException se credenziali non valide
     */
    public LoginResponse login(LoginRequest loginRequest) {
        // 1. Cerco l'utente per email
        Utente utente = utenteService.findUtenteByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email o password non validi"));

        // 2. Verifico la password
        // passwordEncoder.matches() confronta la password in chiaro con l'hash nel DB
        if (!passwordEncoder.matches(loginRequest.getPassword(), utente.getPassword())) {
            throw new RuntimeException("Email o password non validi");
        }

        // 3. Determino il ruolo (1 = utente, 2 = admin)
        String ruolo = utente.getIdRuolo() == 2 ? "admin" : "utente";

        // 4. Creo e ritorno la risposta
        // Nota: la password hashata viene comunque ritornata nell'oggetto Utente
        // In futuro potremmo rimuoverla per sicurezza
        return new LoginResponse(utente, ruolo);
    }
}
