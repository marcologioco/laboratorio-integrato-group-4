package com.immobiliaris.immobiliaris_be.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Contratto;
import java.time.LocalDate;
import com.immobiliaris.immobiliaris_be.enums.StatoContratto;

@Repository
public interface ContrattoRepo extends JpaRepository<Contratto,Integer>{

    //trova contratti per id_contratto
    List<Contratto> findByIdContratto(Integer idContratto);

    //trova contratti per id_immobile
    List<Contratto> findByIdImmobile(Integer idImmobile);

    //trova contratti per id_venditore
    List<Contratto> findByIdVenditore(Integer idVenditore);

    //trova contratti per tipo
    List<Contratto> findByTipo(String tipo);

    //trova contratti in base all'esclusività
    List<Contratto> findByEsclusiva(Boolean esclusiva);

    //trova contratti per data di inizio
    List<Contratto> findByDataInizio(LocalDate dataInizio);

    //trova contratti per data di fine
    List<Contratto> findByDataFine(LocalDate dataFine);

    //trova contratti per prezzo finale minimo
    List<Contratto> findByPrezzoFinaleMinimo(Double prezzoFinaleMinimo);

    //trova contratti in base allo stato
    List<Contratto> findByStato(StatoContratto stato);

}



