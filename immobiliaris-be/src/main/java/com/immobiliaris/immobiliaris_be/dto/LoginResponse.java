package com.immobiliaris.immobiliaris_be.dto;

import com.immobiliaris.immobiliaris_be.model.Utente;

/**
 * DTO per la risposta di login
 * Contiene i dati dell'utente autenticato e il suo ruolo
 * 
 * Nota: In futuro aggiungeremo anche il campo "token" per JWT
 */
public class LoginResponse {
    
    private Utente user;
    private String ruolo;  // "admin" o "utente"

    // Costruttori
    public LoginResponse() {
    }

    public LoginResponse(Utente user, String ruolo) {
        this.user = user;
        this.ruolo = ruolo;
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
}
