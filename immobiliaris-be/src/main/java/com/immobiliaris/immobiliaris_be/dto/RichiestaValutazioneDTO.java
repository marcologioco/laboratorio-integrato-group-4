package com.immobiliaris.immobiliaris_be.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * DTO per la richiesta di valutazione automatica da parte di un nuovo utente
 * Include sia i dati dell'utente che i dati dell'immobile
 */
public class RichiestaValutazioneDTO {
    
    // ===== DATI UTENTE =====
    @NotBlank(message = "Nome obbligatorio")
    private String nome;
    
    @NotBlank(message = "Cognome obbligatorio")
    private String cognome;
    
    @Email(message = "Email non valida")
    @NotBlank(message = "Email obbligatoria")
    private String email;
    
    @NotBlank(message = "Telefono obbligatorio")
    private String telefono;
    
    @NotBlank(message = "Password obbligatoria")
    private String password;
    
    // ===== DATI IMMOBILE =====
    @NotBlank(message = "Indirizzo obbligatorio")
    private String indirizzo;
    
    @NotBlank(message = "Città obbligatoria")
    private String citta;
    
    @NotBlank(message = "Provincia obbligatoria")
    private String provincia;
    
    @NotBlank(message = "CAP obbligatorio")
    private String cap;
    
    @NotNull(message = "Metri quadri obbligatori")
    @Positive(message = "Metri quadri deve essere maggiore di 0")
    private Double metriQuadri;
    
    @NotNull(message = "Numero camere obbligatorio")
    @Positive(message = "Numero camere deve essere maggiore di 0")
    private Integer camere;
    
    @NotNull(message = "Numero bagni obbligatorio")
    @Positive(message = "Numero bagni deve essere maggiore di 0")
    private Integer bagni;
    
    private Integer balconi; // Opzionale
    
    private Boolean terrazzo; // Opzionale
    
    private Boolean giardino; // Opzionale
    
    private Boolean garage; // Opzionale
    
    private String stato; // ABITABILE, DA_RISTRUTTURARE, NUOVA
    
    private String tipo; // APPARTAMENTO, VILLA, ATTICO, etc.
    
    private String descrizione; // Opzionale
    
    private Boolean isProprietario; // Indica se l'utente è il proprietario dell'immobile

    // ===== GETTERS E SETTERS =====
    
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }

    public String getCitta() {
        return citta;
    }

    public void setCitta(String citta) {
        this.citta = citta;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getCap() {
        return cap;
    }

    public void setCap(String cap) {
        this.cap = cap;
    }

    public Double getMetriQuadri() {
        return metriQuadri;
    }

    public void setMetriQuadri(Double metriQuadri) {
        this.metriQuadri = metriQuadri;
    }

    public Integer getCamere() {
        return camere;
    }

    public void setCamere(Integer camere) {
        this.camere = camere;
    }

    public Integer getBagni() {
        return bagni;
    }

    public void setBagni(Integer bagni) {
        this.bagni = bagni;
    }

    public Integer getBalconi() {
        return balconi;
    }

    public void setBalconi(Integer balconi) {
        this.balconi = balconi;
    }

    public Boolean getTerrazzo() {
        return terrazzo;
    }

    public void setTerrazzo(Boolean terrazzo) {
        this.terrazzo = terrazzo;
    }

    public Boolean getGiardino() {
        return giardino;
    }

    public void setGiardino(Boolean giardino) {
        this.giardino = giardino;
    }

    public Boolean getGarage() {
        return garage;
    }

    public void setGarage(Boolean garage) {
        this.garage = garage;
    }

    public String getStato() {
        return stato;
    }

    public void setStato(String stato) {
        this.stato = stato;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public Boolean getIsProprietario() {
        return isProprietario;
    }

    public void setIsProprietario(Boolean isProprietario) {
        this.isProprietario = isProprietario;
    }
}
