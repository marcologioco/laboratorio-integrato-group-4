package com.immobiliaris.immobiliaris_be.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.immobiliaris.immobiliaris_be.enums.StatoValutazione;

import jakarta.persistence.*;

@Entity
@Table(name = "valutazione")
@JsonPropertyOrder({
    "id_valutazione",
    "id_immobile",
    "id_utente",
    "stato",
    "valore_stimato",
    "valore_calcolato_zona",
    "deadline",
    "data_richiesta",
    "data_completamento",
    "note"
})
public class Valutazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_valutazione")
    private Integer idValutazione;

    @Column(name = "id_immobile", nullable = false)
    private Integer idImmobile;

    @Column(name = "id_utente")
    private Integer idUtente;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato", length = 30)
    private StatoValutazione stato;

    @Column(name = "valore_stimato")
    private Double valoreStimato;

    @Column(name = "valore_calcolato_zona")
    private Double valoreCalcolatoZona;

    @Column(name = "deadline")
    @Temporal(TemporalType.TIMESTAMP)
    private Date deadline;

    @Column(name = "data_richiesta")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataRichiesta;

    @Column(name = "data_completamento")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCompletamento;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    // Getters and Setters
    public Integer getIdValutazione() {
        return idValutazione;
    }

    public void setIdValutazione(Integer idValutazione) {
        this.idValutazione = idValutazione;
    }

    public Integer getIdImmobile() {
        return idImmobile;
    }

    public void setIdImmobile(Integer idImmobile) {
        this.idImmobile = idImmobile;
    }

    public Integer getIdUtente() {
        return idUtente;
    }

    public void setIdUtente(Integer idUtente) {
        this.idUtente = idUtente;
    }

    public StatoValutazione getStato() {
        return stato;
    }

    public void setStato(StatoValutazione stato) {
        this.stato = stato;
    }

    public Double getValoreStimato() {
        return valoreStimato;
    }

    public void setValoreStimato(Double valoreStimato) {
        this.valoreStimato = valoreStimato;
    }

    public Double getValoreCalcolatoZona() {
        return valoreCalcolatoZona;
    }

    public void setValoreCalcolatoZona(Double valoreCalcolatoZona) {
        this.valoreCalcolatoZona = valoreCalcolatoZona;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public Date getDataRichiesta() {
        return dataRichiesta;
    }

    public void setDataRichiesta(Date dataRichiesta) {
        this.dataRichiesta = dataRichiesta;
    }

    public Date getDataCompletamento() {
        return dataCompletamento;
    }

    public void setDataCompletamento(Date dataCompletamento) {
        this.dataCompletamento = dataCompletamento;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}