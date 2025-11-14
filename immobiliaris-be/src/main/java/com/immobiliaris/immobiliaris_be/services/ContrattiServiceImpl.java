package com.immobiliaris.immobiliaris_be.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.immobiliaris.immobiliaris_be.enums.StatoContratto;
import com.immobiliaris.immobiliaris_be.model.Contratto;
import com.immobiliaris.immobiliaris_be.repos.ContrattoRepo;

@Service
public class ContrattiServiceImpl implements ContrattiService{

    @Autowired
    private ContrattoRepo repo;

    @Override
    public Contratto addContratto(Contratto c) {
        return repo.save(c);
    }

    @Override
    public void deleteContrattoById(Integer id) {
        repo.deleteById(id);
    }

    @Override
    public List<Contratto> findAllContratti() {
        return repo.findAll();
    }

    @Override
    public List<Contratto> findContrattiByDataFine(LocalDate dataFine) {
        return repo.findByDataFine(dataFine);
    }

    @Override
    public List<Contratto> findContrattiByDataInizio(LocalDate dataInizio) {
        return repo.findByDataInizio(dataInizio);
    }

    @Override
    public List<Contratto> findContrattiByEsclusiva(Boolean esclusiva) {
        return repo.findByEsclusiva(esclusiva);
    }

    @Override
    public List<Contratto> findContrattiByIdImmobile(Integer idImmobile) {
        return repo.findByIdImmobile(idImmobile);
    }

    @Override
    public List<Contratto> findContrattiByIdVenditore(Integer idVenditore) {
        return repo.findByIdVenditore(idVenditore);
    }

    @Override
    public List<Contratto> findContrattiByPrezzoFinaleMinimo(Double prezzo) {
        return repo.findByPrezzoFinaleMinimo(prezzo);
    }

    @Override
    public List<Contratto> findContrattiByStato(StatoContratto stato) {
        return repo.findByStato(stato);
    }

    @Override
    public List<Contratto> findContrattiByTipo(String tipo) {
        return repo.findByTipo(tipo);
    }

    @Override
    public Optional<Contratto> findContrattoById(Integer id) {
        return repo.findById(id);
    }

    @Override
    public Contratto patchContratto(Integer id, Contratto contratto) {
        Contratto existingContratto = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Contratto non trovato con id: " + id));

        if (contratto.getDataFine() != null){
            existingContratto.setDataFine(contratto.getDataFine());
        }
        if (contratto.getDataInizio() != null){
            existingContratto.setDataInizio(contratto.getDataInizio());
        }
        if (contratto.getEsclusiva() != null){
            existingContratto.setEsclusiva(contratto.getEsclusiva());
        }
        if (contratto.getIdImmobile() != null){
            existingContratto.setIdImmobile(contratto.getIdImmobile());
        }
        if (contratto.getIdVenditore() != null){
            existingContratto.setIdVenditore(contratto.getIdVenditore());
        }
        if (contratto.getPrezzoFinaleMinimo() != null){
            existingContratto.setPrezzoFinaleMinimo(contratto.getPrezzoFinaleMinimo());
        }
        if (contratto.getStato() != null){
            existingContratto.setStato(contratto.getStato());
        }
        if (contratto.getTipo() != null){
            existingContratto.setTipo(contratto.getTipo());
        }
        if (contratto.getNote() != null){
            existingContratto.setNote(contratto.getNote());
        }
        return repo.save(existingContratto);
    }

    @Override
    public Contratto updateContratto(Integer id, Contratto c) {
        Contratto contratto = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Contratto non trovato con id: " + id));

        contratto.setIdImmobile(c.getIdImmobile());
        contratto.setIdVenditore(c.getIdVenditore());
        contratto.setTipo(c.getTipo());
        contratto.setEsclusiva(c.getEsclusiva());
        contratto.setDataInizio(c.getDataInizio());
        contratto.setDataFine(c.getDataFine());
        contratto.setPrezzoFinaleMinimo(c.getPrezzoFinaleMinimo());
        contratto.setStato(c.getStato());
        contratto.setNote(c.getNote());

        return repo.save(contratto);
    }

}
