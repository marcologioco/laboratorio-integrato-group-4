package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.immobiliaris.immobiliaris_be.enums.StatoValutazione;
import com.immobiliaris.immobiliaris_be.model.Valutazione;
import com.immobiliaris.immobiliaris_be.repos.ValutazioneRepo;

@Service
public class ValutazioneServiceImpl implements ValutazioneService {

    @Autowired
    private ValutazioneRepo valutazioneRepo;

    @Override
    public List<Valutazione> findAllValutazioni() {
        return valutazioneRepo.findAll();
    }

    @Override
    public Optional<Valutazione> findValutazioneById(Integer idValutazione) {
        return valutazioneRepo.findById(idValutazione);
    }

    @Override
    public Optional<Valutazione> findValutazioneByIdImmobile(Integer idImmobile) {
        return valutazioneRepo.findByIdImmobile(idImmobile);
    }

    @Override
    public List<Valutazione> findValutazioniByIdUtente(Integer idUtente) {
        return valutazioneRepo.findByIdUtente(idUtente);
    }

    @Override
    public List<Valutazione> findValutazioniByStato(StatoValutazione stato) {
        return valutazioneRepo.findByStato(stato);
    }

    @Override
    public Valutazione saveValutazione(Valutazione valutazione) {
        return valutazioneRepo.save(valutazione);
    }

    @Override
    public Valutazione updateValutazione(Integer id, Valutazione valutazioneDetails) {
        Valutazione valutazione = valutazioneRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Valutazione non trovata con id: " + id));

        valutazione.setIdImmobile(valutazioneDetails.getIdImmobile());
        valutazione.setIdUtente(valutazioneDetails.getIdUtente());
        valutazione.setStato(valutazioneDetails.getStato());
        valutazione.setValoreStimato(valutazioneDetails.getValoreStimato());
        valutazione.setValoreCalcolatoZona(valutazioneDetails.getValoreCalcolatoZona());
        valutazione.setDeadline(valutazioneDetails.getDeadline());
        valutazione.setDataRichiesta(valutazioneDetails.getDataRichiesta());
        valutazione.setDataCompletamento(valutazioneDetails.getDataCompletamento());
        valutazione.setNote(valutazioneDetails.getNote());

        return valutazioneRepo.save(valutazione);
    }

    @Override
    public void deleteById(Integer id) {
        valutazioneRepo.deleteById(id);
    }

    @Override
    public Valutazione patchValutazione(Integer idValutazione, Valutazione patchValutazione) {
        Valutazione existingValutazione = valutazioneRepo.findById(idValutazione)
                .orElseThrow(() -> new RuntimeException("Valutazione non trovata con id: " + idValutazione));

        if (patchValutazione.getIdImmobile() != null) {
            existingValutazione.setIdImmobile(patchValutazione.getIdImmobile());
        }

        if (patchValutazione.getIdUtente() != null) {
            existingValutazione.setIdUtente(patchValutazione.getIdUtente());
        }

        if (patchValutazione.getStato() != null) {
            existingValutazione.setStato(patchValutazione.getStato());
        }

        if (patchValutazione.getValoreStimato() != null) {
            existingValutazione.setValoreStimato(patchValutazione.getValoreStimato());
        }

        if (patchValutazione.getValoreCalcolatoZona() != null) {
            existingValutazione.setValoreCalcolatoZona(patchValutazione.getValoreCalcolatoZona());
        }

        if (patchValutazione.getDeadline() != null) {
            existingValutazione.setDeadline(patchValutazione.getDeadline());
        }

        if (patchValutazione.getDataRichiesta() != null) {
            existingValutazione.setDataRichiesta(patchValutazione.getDataRichiesta());
        }

        if (patchValutazione.getDataCompletamento() != null) {
            existingValutazione.setDataCompletamento(patchValutazione.getDataCompletamento());
        }

        if (patchValutazione.getNote() != null && !patchValutazione.getNote().isBlank()) {
            existingValutazione.setNote(patchValutazione.getNote().trim());
        }

        return valutazioneRepo.save(existingValutazione);
    }
}