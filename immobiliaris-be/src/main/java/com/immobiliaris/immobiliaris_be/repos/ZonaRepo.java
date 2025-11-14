package com.immobiliaris.immobiliaris_be.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Zona;

@Repository
public interface ZonaRepo extends JpaRepository<Zona,String>{

    // Trova zona per nome
    // SELECT * FROM zona WHERE nome_zona = ?
    Zona findByNomeZona(String nomeZona);
    
    // Trova zone per prezzo medio al metro quadro
    // SELECT * FROM zona WHERE prezzo_medio_sqm = ?
    List<Zona> findByPrezzoMedioSqm(Double prezzoMedioSqm);
}
