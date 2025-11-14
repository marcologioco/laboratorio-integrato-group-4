package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import com.immobiliaris.immobiliaris_be.model.Utente;

public interface UtenteService {

    List<Utente> findAllUtenti();
    Optional<Utente> findUtenteById(Integer idUtente);
    Optional<Utente> findUtenteByEmail(String email);
    List<Utente> findUtentiByIdRuolo(Integer idRuolo);
    Utente saveUtente(Utente utente);
    Utente updateUtente(Integer id, Utente utenteDetails);
    void deleteById(Integer id);
    Utente patchUtente(Integer idUtente, Utente utente);
}
