package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import com.immobiliaris.immobiliaris_be.enums.StatoValutazione;
import com.immobiliaris.immobiliaris_be.model.Valutazione;

public interface ValutazioneService {

    List<Valutazione> findAllValutazioni();
    Optional<Valutazione> findValutazioneById(Integer idValutazione);
    Optional<Valutazione> findValutazioneByIdImmobile(Integer idImmobile);
    List<Valutazione> findValutazioniByIdUtente(Integer idUtente);
    List<Valutazione> findValutazioniByStato(StatoValutazione stato);
    Valutazione saveValutazione(Valutazione valutazione);
    Valutazione updateValutazione(Integer id, Valutazione valutazioneDetails);
    void deleteById(Integer id);
    Valutazione patchValutazione(Integer idValutazione, Valutazione valutazione);
}