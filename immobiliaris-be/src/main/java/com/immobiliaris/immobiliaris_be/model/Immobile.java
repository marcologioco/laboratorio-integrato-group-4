package com.immobiliaris.immobiliaris_be.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.immobiliaris.immobiliaris_be.model.StatoImmobile;
import com.immobiliaris.immobiliaris_be.model.TipoImmobile;

import jakarta.persistence.*;

@Entity
@Table(name = "immobile")
@JsonPropertyOrder({
    "id_immobile",
    "id_venditore",
    "tipo",
    "indirizzo",
    "citta",
    "provincia",
    "cap",
    "metri_quadri",
    "camere",
    "bagni",
    "prezzo",
    "descrizione",
    "stato",
    "data_inserimento"
})
public class Immobile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_immobile")
    private Integer idImmobile;

    @Column(name = "id_venditore", nullable = false)
    private Integer idVenditore;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", length = 30)
    private TipoImmobile tipo;

    @Column(name = "indirizzo", length = 255)
    private String indirizzo;

    @Column(name = "citta", length = 100)
    private String citta;

    @Column(name = "provincia", length = 50)
    private String provincia;

    @Column(name = "cap", length = 10, nullable = false)
    private String cap;

    @Column(name = "metri_quadri")
    private Double metriQuadri;

    @Column(name = "camere")
    private Integer camere;

    @Column(name = "bagni")
    private Integer bagni;

    @Column(name = "prezzo")
    private Double prezzo;

    @Column(name = "descrizione", columnDefinition = "TEXT")
    private String descrizione;

    @Enumerated(EnumType.STRING)
    @Column(name = "stato", length = 30)
    private StatoImmobile stato;

    @Column(name = "data_inserimento")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataInserimento;

    // Getters and Setters
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

    public TipoImmobile getTipo() {
        return tipo;
    }

    public void setTipo(TipoImmobile tipo) {
        this.tipo = tipo;
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

    public Double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Double prezzo) {
        this.prezzo = prezzo;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public StatoImmobile getStato() {
        return stato;
    }

    public void setStato(StatoImmobile stato) {
        this.stato = stato;
    }

    public Date getDataInserimento() {
        return dataInserimento;
    }

    public void setDataInserimento(Date dataInserimento) {
        this.dataInserimento = dataInserimento;
    }
}