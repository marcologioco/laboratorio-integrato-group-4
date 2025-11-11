package com.immobiliaris.immobiliaris_be.model;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "zona")
@JsonPropertyOrder({
    "cap",
    "nome_zona",
    "prezzo_medio_sqm"
})
public class Zona {

    @Id
    @Column(name = "cap", length = 10)
    private String cap;

    @Column(name = "nome_zona", length = 100)
    private String nomeZona;

    @Column(name = "prezzo_medio_sqm", nullable = false)
    @ColumnDefault(value = "0.00")
    private Double prezzoMedioSqm;

    public String getCap() {
        return cap;
    }

    public void setCap(String cap) {
        this.cap = cap;
    }

    public String getNomeZona() {
        return nomeZona;
    }

    public void setNomeZona(String nomeZona) {
        this.nomeZona = nomeZona;
    }

    public Double getPrezzoMedioSqm() {
        return prezzoMedioSqm;
    }

    public void setPrezzoMedioSqm(Double prezzoMedioSqm) {
        this.prezzoMedioSqm = prezzoMedioSqm;
    }

    public Zona(String cap, String nomeZona, Double prezzoMedioSqm) {
        this.cap = cap;
        this.nomeZona = nomeZona;
        this.prezzoMedioSqm = prezzoMedioSqm;
    }

    @Override
    public String toString() {
        return "Zona [cap=" + cap + 
                ", nomeZona=" + nomeZona + 
                ", prezzoMedioSqm=" + prezzoMedioSqm + 
                "]";
    }

}
