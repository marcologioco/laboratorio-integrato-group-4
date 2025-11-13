package com.immobiliaris.immobiliaris_be.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Utente;

@Repository
public interface UtenteRepo extends JpaRepository<Utente, Integer> {
    
    // Trova utente per email (unique)
    // SELECT * FROM utente WHERE email = ?
    Optional<Utente> findByEmail(String email);
    
    // Trova utenti per id_ruolo
    // SELECT * FROM utente WHERE id_ruolo = ?
    List<Utente> findByIdRuolo(Integer idRuolo);
}