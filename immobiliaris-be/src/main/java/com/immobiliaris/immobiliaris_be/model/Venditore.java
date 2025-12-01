package com.immobiliaris.immobiliaris_be.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "venditore")
@JsonPropertyOrder({
    "id_venditore",
    "id_utente",
    "nome",
    "cognome",
    "email",
    "telefono",
    "indirizzo",
    "citta",
    "provincia",
    "codice_fiscale"
})
public class Venditore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_venditore")
    private Integer idVenditore;

    @Column(name = "id_utente", nullable = true)
    private Integer idUtente;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "cognome")
    private String cognome;

    @Email(message = "Email non valida")
    @Column(name = "email")
    private String email;

    @Pattern(regexp = "^3\\d{9}$", message = "Numero cellulare non valido. Formato richiesto: 3xxxxxxxxx (10 cifre)")
    @Column(name = "telefono")
    private String telefono;

    @Column(name = "indirizzo")
    private String indirizzo;

    @Column(name = "citta")
    private String citta;

    @Column(name = "provincia")
    private String provincia;

    @Column(name = "codice_fiscale")
    private String codiceFiscale;

    // Getters and Setters
    public Integer getIdVenditore() {
        return idVenditore;
    }

    public void setIdVenditore(Integer idVenditore) {
        this.idVenditore = idVenditore;
    }

    public Integer getIdUtente() {
        return idUtente;
    }

    public void setIdUtente(Integer idUtente) {
        this.idUtente = idUtente;
    }

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

    public String getCodiceFiscale() {
        return codiceFiscale;
    }

    public void setCodiceFiscale(String codiceFiscale) {
        this.codiceFiscale = codiceFiscale;
    }
}
