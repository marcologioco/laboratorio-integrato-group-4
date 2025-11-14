package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import com.immobiliaris.immobiliaris_be.enums.StatoImmobile;
import com.immobiliaris.immobiliaris_be.enums.TipoImmobile;
import com.immobiliaris.immobiliaris_be.model.Immobile;

public interface ImmobileService {

    List<Immobile> findAllImmobili();
    Optional<Immobile> findImmobileById(Integer idImmobile);
    List<Immobile> findImmobiliByIdVenditore(Integer idVenditore);
    List<Immobile> findImmobiliByTipo(TipoImmobile tipo);
    List<Immobile> findImmobiliByStato(StatoImmobile stato);
    List<Immobile> findImmobiliByCitta(String citta);
    List<Immobile> findImmobiliByCap(String cap);
    List<Immobile> findImmobiliByProvincia(String provincia);
    Immobile saveImmobile(Immobile immobile);
    Immobile updateImmobile(Integer id, Immobile immobileDetails);
    void deleteById(Integer id);
    Immobile patchImmobile(Integer idImmobile, Immobile immobile);
}
