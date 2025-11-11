package com.immobiliaris.immobiliaris_be.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Ruolo;

@Repository
public interface RuoloRepo extends JpaRepository<Ruolo, Integer>{
    
    // Trova il ruolo per id_ruolo
    // SELECT * FROM RUOLO WHERE id_ruolo=?;
    List<Ruolo> findByIdRuolo(Integer id_ruolo);
}

