package com.immobiliaris.immobiliaris_be.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Utente;

@Repository
public interface UtenteRepo extends JpaRepository<Utente, Integer> {
    
    //Trova utente per id_utente
    //SELECT * FROM UTENTE WHERE id_utente = ?;
    List<Utente> findByIdUtente(Integer id_utente);
}
