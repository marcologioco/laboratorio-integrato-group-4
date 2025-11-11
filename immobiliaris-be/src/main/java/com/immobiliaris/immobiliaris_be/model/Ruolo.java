package com.immobiliaris.immobiliaris_be.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ruolo")
@JsonPropertyOrder({
    "id_ruolo",
    "nome"
})
public class Ruolo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruolo")
    private Integer idRuolo;

    @Column(name = "nome", nullable = false, unique = true, length = 50)
    private String nome;

    // Getters and Setters
    public Integer getIdRuolo() {
        return idRuolo;
    }

    public void setIdRuolo(Integer idRuolo) {
        this.idRuolo = idRuolo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
