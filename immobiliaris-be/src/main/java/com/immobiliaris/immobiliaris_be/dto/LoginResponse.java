package com.immobiliaris.immobiliaris_be.dto;

import com.immobiliaris.immobiliaris_be.model.Utente;

/**
 * DTO per la risposta di login
 * Contiene i dati dell'utente autenticato, il suo ruolo e il token JWT
 */
public class LoginResponse {
    
    private Utente user;
    private String ruolo;  // "admin" o "utente"
    private String token;  // Token JWT per le richieste successive

    // Costruttori
    public LoginResponse() {
    }

    public LoginResponse(Utente user, String ruolo, String token) {
        this.user = user;
        this.ruolo = ruolo;
        this.token = token;
    }

    // Getter e Setter
    public Utente getUser() {
        return user;
    }

    public void setUser(Utente user) {
        this.user = user;
    }

    public String getRuolo() {
        return ruolo;
    }

    public void setRuolo(String ruolo) {
        this.ruolo = ruolo;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
