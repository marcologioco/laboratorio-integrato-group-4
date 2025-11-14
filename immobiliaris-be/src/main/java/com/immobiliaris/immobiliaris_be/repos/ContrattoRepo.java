package com.immobiliaris.immobiliaris_be.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Contratto;
import java.time.LocalDate;
import com.immobiliaris.immobiliaris_be.enums.StatoContratto;

@Repository
public interface ContrattoRepo extends JpaRepository<Contratto,Integer>{

    // Trova contratti per id_immobile
    // SELECT * FROM contratto WHERE id_immobile = ?
    List<Contratto> findByIdImmobile(Integer idImmobile);

    // Trova contratti per id_venditore
    // SELECT * FROM contratto WHERE id_venditore = ?
    List<Contratto> findByIdVenditore(Integer idVenditore);

    // Trova contratti per tipo
    // SELECT * FROM contratto WHERE tipo = ?
    List<Contratto> findByTipo(String tipo);

    // Trova contratti in base all'esclusività
    // SELECT * FROM contratto WHERE esclusiva = ?
    List<Contratto> findByEsclusiva(Boolean esclusiva);

    // Trova contratti per data di inizio
    // SELECT * FROM contratto WHERE data_inizio = ?
    List<Contratto> findByDataInizio(LocalDate dataInizio);

    // Trova contratti per data di fine
    // SELECT * FROM contratto WHERE data_fine = ?
    List<Contratto> findByDataFine(LocalDate dataFine);

    // Trova contratti per prezzo finale minimo
    // SELECT * FROM contratto WHERE prezzo_finale_minimo = ?
    List<Contratto> findByPrezzoFinaleMinimo(Double prezzoFinaleMinimo);

    // Trova contratti in base allo stato
    // SELECT * FROM contratto WHERE stato = ?
    List<Contratto> findByStato(StatoContratto stato);
}



