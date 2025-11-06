package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.immobiliaris.immobiliaris_be.enums.StatoImmobile;
import com.immobiliaris.immobiliaris_be.enums.TipoImmobile;
import com.immobiliaris.immobiliaris_be.model.Immobile;
import com.immobiliaris.immobiliaris_be.repos.ImmobileRepo;

@Service
public class ImmobileServiceImpl implements ImmobileService {

    @Autowired
    private ImmobileRepo immobileRepo;

    @Override
    public List<Immobile> findAllImmobili() {
        return immobileRepo.findAll();
    }

    @Override
    public Optional<Immobile> findImmobileById(Integer idImmobile) {
        return immobileRepo.findById(idImmobile);
    }

    @Override
    public List<Immobile> findImmobiliByIdVenditore(Integer idVenditore) {
        return immobileRepo.findByIdVenditore(idVenditore);
    }

    @Override
    public List<Immobile> findImmobiliByTipo(TipoImmobile tipo) {
        return immobileRepo.findByTipo(tipo);
    }

    @Override
    public List<Immobile> findImmobiliByStato(StatoImmobile stato) {
        return immobileRepo.findByStato(stato);
    }

    @Override
    public List<Immobile> findImmobiliByCitta(String citta) {
        return immobileRepo.findByCitta(citta);
    }

    @Override
    public List<Immobile> findImmobiliByCap(String cap) {
        return immobileRepo.findByCap(cap);
    }

    @Override
    public List<Immobile> findImmobiliByProvincia(String provincia) {
        return immobileRepo.findByProvincia(provincia);
    }

    @Override
    public Immobile saveImmobile(Immobile immobile) {
        return immobileRepo.save(immobile);
    }

    @Override
    public Immobile updateImmobile(Integer id, Immobile immobileDetails) {
        Immobile immobile = immobileRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Immobile non trovato con id: " + id));

        immobile.setIdVenditore(immobileDetails.getIdVenditore());
        immobile.setTipo(immobileDetails.getTipo());
        immobile.setIndirizzo(immobileDetails.getIndirizzo());
        immobile.setCitta(immobileDetails.getCitta());
        immobile.setProvincia(immobileDetails.getProvincia());
        immobile.setCap(immobileDetails.getCap());
        immobile.setMetriQuadri(immobileDetails.getMetriQuadri());
        immobile.setCamere(immobileDetails.getCamere());
        immobile.setBagni(immobileDetails.getBagni());
        immobile.setPrezzo(immobileDetails.getPrezzo());
        immobile.setDescrizione(immobileDetails.getDescrizione());
        immobile.setStato(immobileDetails.getStato());
        immobile.setDataInserimento(immobileDetails.getDataInserimento());

        return immobileRepo.save(immobile);
    }

    @Override
    public void deleteById(Integer id) {
        immobileRepo.deleteById(id);
    }

    @Override
    public Immobile patchImmobile(Integer idImmobile, Immobile patchImmobile) {
        Immobile existingImmobile = immobileRepo.findById(idImmobile)
                .orElseThrow(() -> new RuntimeException("Immobile non trovato con id: " + idImmobile));

        if (patchImmobile.getIdVenditore() != null) {
            existingImmobile.setIdVenditore(patchImmobile.getIdVenditore());
        }

        if (patchImmobile.getTipo() != null) {
            existingImmobile.setTipo(patchImmobile.getTipo());
        }

        if (patchImmobile.getIndirizzo() != null) {
            existingImmobile.setIndirizzo(patchImmobile.getIndirizzo());
        }

        if (patchImmobile.getCitta() != null) {
            existingImmobile.setCitta(patchImmobile.getCitta());
        }

        if (patchImmobile.getProvincia() != null) {
            existingImmobile.setProvincia(patchImmobile.getProvincia());
        }

        if (patchImmobile.getCap() != null) {
            existingImmobile.setCap(patchImmobile.getCap());
        }

        if (patchImmobile.getMetriQuadri() != null) {
            existingImmobile.setMetriQuadri(patchImmobile.getMetriQuadri());
        }

        if (patchImmobile.getCamere() != null) {
            existingImmobile.setCamere(patchImmobile.getCamere());
        }

        if (patchImmobile.getBagni() != null) {
            existingImmobile.setBagni(patchImmobile.getBagni());
        }

        if (patchImmobile.getPrezzo() != null) {
            existingImmobile.setPrezzo(patchImmobile.getPrezzo());
        }

        if (patchImmobile.getDescrizione() != null) {
            existingImmobile.setDescrizione(patchImmobile.getDescrizione());
        }

        if (patchImmobile.getStato() != null) {
            existingImmobile.setStato(patchImmobile.getStato());
        }

        if (patchImmobile.getDataInserimento() != null) {
            existingImmobile.setDataInserimento(patchImmobile.getDataInserimento());
        }

        return immobileRepo.save(existingImmobile);
    }
}