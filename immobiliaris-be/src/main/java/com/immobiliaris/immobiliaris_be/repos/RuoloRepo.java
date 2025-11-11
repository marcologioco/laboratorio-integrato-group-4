package com.immobiliaris.immobiliaris_be.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Ruolo;

@Repository
public interface RuoloRepo extends JpaRepository<Ruolo, Integer> {
    
    // Trova il ruolo per nome
    // SELECT * FROM ruolo WHERE nome = ?
    Optional<Ruolo> findByNome(String nome);
}