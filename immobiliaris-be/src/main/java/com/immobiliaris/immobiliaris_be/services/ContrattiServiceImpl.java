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
    public void deleteContratto(Integer id) {
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
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Contratto updateContratto(Contratto c) {
        // TODO Auto-generated method stub
        return null;
    }

}
