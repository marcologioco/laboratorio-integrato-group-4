package com.immobiliaris.immobiliaris_be.dto;

/**
 * DTO per la risposta della valutazione automatica
 */
public class RispostaValutazioneDTO {
    
    private Integer idUtente;
    private Integer idImmobile;
    private Integer idValutazione;
    private Double valoreStimato;
    private Double valoreBaseZona;
    private String messaggio;
    
    public RispostaValutazioneDTO() {
    }
    
    public RispostaValutazioneDTO(Integer idUtente, Integer idImmobile, Integer idValutazione, 
                                   Double valoreStimato, Double valoreBaseZona, String messaggio) {
        this.idUtente = idUtente;
        this.idImmobile = idImmobile;
        this.idValutazione = idValutazione;
        this.valoreStimato = valoreStimato;
        this.valoreBaseZona = valoreBaseZona;
        this.messaggio = messaggio;
    }

    // Getters e Setters
    
    public Integer getIdUtente() {
        return idUtente;
    }

    public void setIdUtente(Integer idUtente) {
        this.idUtente = idUtente;
    }

    public Integer getIdImmobile() {
        return idImmobile;
    }

    public void setIdImmobile(Integer idImmobile) {
        this.idImmobile = idImmobile;
    }

    public Integer getIdValutazione() {
        return idValutazione;
    }

    public void setIdValutazione(Integer idValutazione) {
        this.idValutazione = idValutazione;
    }

    public Double getValoreStimato() {
        return valoreStimato;
    }

    public void setValoreStimato(Double valoreStimato) {
        this.valoreStimato = valoreStimato;
    }

    public Double getValoreBaseZona() {
        return valoreBaseZona;
    }

    public void setValoreBaseZona(Double valoreBaseZona) {
        this.valoreBaseZona = valoreBaseZona;
    }

    public String getMessaggio() {
        return messaggio;
    }

    public void setMessaggio(String messaggio) {
        this.messaggio = messaggio;
    }
}
