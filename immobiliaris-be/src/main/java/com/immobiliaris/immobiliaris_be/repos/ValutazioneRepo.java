package com.immobiliaris.immobiliaris_be.repos;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.enums.StatoValutazione;
import com.immobiliaris.immobiliaris_be.model.Valutazione;

@Repository
public interface ValutazioneRepo extends JpaRepository<Valutazione, Integer> {
    
    // Trova valutazione per id_immobile (ci aspettiamo max una valutazione per immobile)
    // SELECT * FROM valutazione WHERE id_immobile = ?
    Optional<Valutazione> findByIdImmobile(Integer idImmobile);
    
    // Trova valutazioni per id_utente
    // SELECT * FROM valutazione WHERE id_utente = ?
    List<Valutazione> findByIdUtente(Integer idUtente);
    
    // Trova valutazioni per stato
    // SELECT * FROM valutazione WHERE stato = ?
    List<Valutazione> findByStato(StatoValutazione stato);
}