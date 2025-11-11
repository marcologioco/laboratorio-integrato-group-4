package com.immobiliaris.immobiliaris_be.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.immobiliaris.immobiliaris_be.enums.StatoContratto;
import com.immobiliaris.immobiliaris_be.model.Contratto;

public interface ContrattiService {

    List<Contratto> findAllContratti();
    Optional<Contratto> findContrattoById(Integer id);

    List<Contratto> findContrattiByIdImmobile(Integer idImmobile);
    List<Contratto> findContrattiByIdVenditore(Integer idVenditore);
    List<Contratto> findContrattiByTipo(String tipo);
    List<Contratto> findContrattiByEsclusiva(Boolean esclusiva);
    List<Contratto> findContrattiByDataInizio(LocalDate dataInizio);
    List<Contratto> findContrattiByDataFine(LocalDate dataFine);
    List<Contratto> findContrattiByPrezzoFinaleMinimo(Double prezzo);
    List<Contratto> findContrattiByStato(StatoContratto stato);

    Contratto addContratto(Contratto c);
    Contratto updateContratto(Contratto c);
    void deleteContratto(Integer id);
    Contratto patchContratto(Integer id, Contratto contratto);

}
