package com.immobiliaris.immobiliaris_be.repos;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.enums.StatoImmobile;
import com.immobiliaris.immobiliaris_be.enums.TipoImmobile;
import com.immobiliaris.immobiliaris_be.model.Immobile;

@Repository
public interface ImmobileRepo extends JpaRepository<Immobile, Integer> {
    
    // Trova immobili per id_venditore
    // SELECT * FROM immobile WHERE id_venditore = ?
    List<Immobile> findByIdVenditore(Integer idVenditore);
    
    // Trova immobili per tipo
    // SELECT * FROM immobile WHERE tipo = ?
    List<Immobile> findByTipo(TipoImmobile tipo);
    
    // Trova immobili per stato
    // SELECT * FROM immobile WHERE stato = ?
    List<Immobile> findByStato(StatoImmobile stato);
    
    // Trova immobili per città
    // SELECT * FROM immobile WHERE citta = ?
    List<Immobile> findByCitta(String citta);
    
    // Trova immobili per CAP
    // SELECT * FROM immobile WHERE cap = ?
    List<Immobile> findByCap(String cap);
    
    // Trova immobili per provincia
    // SELECT * FROM immobile WHERE provincia = ?
    List<Immobile> findByProvincia(String provincia);
}