package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.immobiliaris.immobiliaris_be.model.Zona;
import com.immobiliaris.immobiliaris_be.repos.ZonaRepo;

@Service
public class ZoneServiceImpl implements ZoneService{

    @Autowired
    private ZonaRepo repo;

    @Override
    public List<Zona> findAllZone() {
       return repo.findAll();
    }

    @Override
    public Optional<Zona> findZonaByCap(String cap) {
        return repo.findById(cap);
    }

    @Override
    public Zona addZona(Zona z) {
        return repo.save(z);
    }

    @Override
    public List<Zona> findZonaByPrezzoMedio(Double prezzoMedioSqm) {
        return repo.findByPrezzoMedioSqm(prezzoMedioSqm);
    }

    @Override
    public Zona updateZona(Zona zona) {
        return null;
    }

    @Override
    public void deleteZona(String cap) {
        repo.deleteById(cap);
    }

    @Override
    public Zona patchZona(String cap, Zona zona) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'patchZona'");
    }
   
    
    


    
    
    
    

    

    
    
    
    


}
