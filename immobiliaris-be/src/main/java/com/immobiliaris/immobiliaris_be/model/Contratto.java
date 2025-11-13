package com.immobiliaris.immobiliaris_be.model;

import java.time.LocalDate;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.immobiliaris.immobiliaris_be.enums.StatoContratto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "contratto")
@JsonPropertyOrder({
    "id_contratto",
    "id_immobile",
    "id_venditore",
    "tipo",
    "esclusiva",
    "data_inizio",
    "data_fine",
    "prezzo_finale_minimo",
    "stato",
    "note"
})
public class Contratto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contratto")
    private Integer idContratto;

    @Column(name = "id_immobile", nullable = false)
    private Integer idImmobile;

    @Column(name = "id_venditore", nullable = false)
    private Integer idVenditore;

    @Column(name = "tipo", length = 30)
    private String tipo;

    @Column(name = "esclusiva")
    @ColumnDefault(value = "true")
    private Boolean esclusiva;

    @Column(name = "data_inizio", nullable = false)
    private LocalDate dataInizio;

    @Column(name = "data_fine")
    private LocalDate dataFine;

    @Column(name = "prezzo_finale_minimo")
    private Double prezzoFinaleMinimo;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato", nullable = false)
    private StatoContratto stato;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    //Getters e setters
    public Integer getIdContratto() {
        return idContratto;
    }

    public void setIdContratto(Integer idContratto) {
        this.idContratto = idContratto;
    }

    public Integer getIdImmobile() {
        return idImmobile;
    }

    public void setIdImmobile(Integer idImmobile) {
        this.idImmobile = idImmobile;
    }

    public Integer getIdVenditore() {
        return idVenditore;
    }

    public void setIdVenditore(Integer idVenditore) {
        this.idVenditore = idVenditore;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Boolean getEsclusiva() {
        return esclusiva;
    }

    public void setEsclusiva(Boolean esclusiva) {
        this.esclusiva = esclusiva;
    }

    public LocalDate getDataInizio() {
        return dataInizio;
    }

    public void setDataInizio(LocalDate dataInizio) {
        this.dataInizio = dataInizio;
    }

    public LocalDate getDataFine() {
        return dataFine;
    }

    public void setDataFine(LocalDate dataFine) {
        this.dataFine = dataFine;
    }

    public Double getPrezzoFinaleMinimo() {
        return prezzoFinaleMinimo;
    }

    public void setPrezzoFinaleMinimo(Double prezzoFinaleMinimo) {
        this.prezzoFinaleMinimo = prezzoFinaleMinimo;
    }

    public StatoContratto getStato() {
        return stato;
    }

    public void setStato(StatoContratto stato) {
        this.stato = stato;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    // Costruttore vuoto (richiesto da JPA)
    public Contratto() {
    }

    //Costruttore parametrizzato
    public Contratto(Integer idImmobile, Integer idVenditore, String tipo, Boolean esclusiva, LocalDate dataInizio,
            LocalDate dataFine, Double prezzoFinaleMinimo, StatoContratto stato, String note) {
        this.idImmobile = idImmobile;
        this.idVenditore = idVenditore;
        this.tipo = tipo;
        this.esclusiva = esclusiva;
        this.dataInizio = dataInizio;
        this.dataFine = dataFine;
        this.prezzoFinaleMinimo = prezzoFinaleMinimo;
        this.stato = stato;
        this.note = note;
    }

    @Override
    public String toString() {
        return "Contratto [idContratto=" + idContratto + 
                ", idImmobile=" + idImmobile + 
                ", idVenditore=" + idVenditore + 
                ", tipo=" + tipo + 
                ", esclusiva=" + esclusiva + 
                ", dataInizio=" + dataInizio + 
                ", dataFine=" + dataFine + 
                ", prezzoFinaleMinimo=" + prezzoFinaleMinimo + 
                ", stato=" + stato + 
                ", note=" + note + "]";
    }

    

}
