package com.immobiliaris.immobiliaris_be.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ruolo")
public class Ruolo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_ruolo")
    private Integer id_ruolo;

    @Column(nullable=false, unique=true)
    private String nome;

    public Integer getId_ruolo() {
        return id_ruolo;
    }

    public void setId_ruolo(Integer id_ruolo) {
        this.id_ruolo = id_ruolo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }


}
