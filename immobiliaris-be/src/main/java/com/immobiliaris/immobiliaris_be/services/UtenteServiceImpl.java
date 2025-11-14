package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.immobiliaris.immobiliaris_be.model.Utente;
import com.immobiliaris.immobiliaris_be.repos.UtenteRepo;

@Service
public class UtenteServiceImpl implements UtenteService {

    @Autowired
    private UtenteRepo utenteRepo;

    @Override
    public List<Utente> findAllUtenti() {
        return utenteRepo.findAll();
    }

    @Override
    public Optional<Utente> findUtenteById(Integer idUtente) {
        return utenteRepo.findById(idUtente);
    }

    @Override
    public Optional<Utente> findUtenteByEmail(String email) {
        return utenteRepo.findByEmail(email);
    }

    @Override
    public List<Utente> findUtentiByIdRuolo(Integer idRuolo) {
        return utenteRepo.findByIdRuolo(idRuolo);
    }

    @Override
    public Utente saveUtente(Utente utente) {
        return utenteRepo.save(utente);
    }

    @Override
    public Utente updateUtente(Integer id, Utente utenteDetails) {
        Utente utente = utenteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con id: " + id));

        utente.setNome(utenteDetails.getNome());
        utente.setCognome(utenteDetails.getCognome());
        utente.setEmail(utenteDetails.getEmail());
        utente.setPassword(utenteDetails.getPassword());
        utente.setTelefono(utenteDetails.getTelefono());
        utente.setIdRuolo(utenteDetails.getIdRuolo());

        return utenteRepo.save(utente);
    }

    @Override
    public void deleteById(Integer id) {
        utenteRepo.deleteById(id);
    }

    @Override
    public Utente patchUtente(Integer idUtente, Utente patchUtente) {
        Utente existingUtente = utenteRepo.findById(idUtente)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con id: " + idUtente));

        if (patchUtente.getNome() != null && !patchUtente.getNome().isBlank()) {
            existingUtente.setNome(patchUtente.getNome().trim());
        }

        if (patchUtente.getCognome() != null && !patchUtente.getCognome().isBlank()) {
            existingUtente.setCognome(patchUtente.getCognome().trim());
        }

        if (patchUtente.getEmail() != null && !patchUtente.getEmail().isBlank()) {
            existingUtente.setEmail(patchUtente.getEmail().trim());
        }

        if (patchUtente.getPassword() != null && !patchUtente.getPassword().isBlank()) {
            existingUtente.setPassword(patchUtente.getPassword().trim());
        }

        if (patchUtente.getTelefono() != null && !patchUtente.getTelefono().isBlank()) {
            existingUtente.setTelefono(patchUtente.getTelefono().trim());
        }

        if (patchUtente.getIdRuolo() != null) {
            existingUtente.setIdRuolo(patchUtente.getIdRuolo());
        }

        return utenteRepo.save(existingUtente);
    }
}
