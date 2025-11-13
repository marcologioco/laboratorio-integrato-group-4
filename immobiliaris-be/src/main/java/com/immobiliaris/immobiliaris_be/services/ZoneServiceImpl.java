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
    public Zona findZonaByNome(String nomeZona) {
        return repo.findByNomeZona(nomeZona);
    }

    @Override
    public List<Zona> findZonaByPrezzoMedio(Double prezzoMedioSqm) {
        return repo.findByPrezzoMedioSqm(prezzoMedioSqm);
    }

    @Override
    public Zona updateZona(String cap, Zona z) {
        Zona zona = repo.findById(cap)
            .orElseThrow(() -> new RuntimeException("Zona non trovata con cap: " + cap));

        zona.setNomeZona(z.getNomeZona());
        zona.setPrezzoMedioSqm(z.getPrezzoMedioSqm());

        return repo.save(zona);
    }

    @Override
    public void deleteZonaById(String cap) {
        repo.deleteById(cap);
    }

    @Override
    public Zona patchZona(String cap, Zona zona) {
        Zona existingZona = repo.findById(cap)
            .orElseThrow(() -> new RuntimeException("Zona non trovata con cap: " + cap));
        
        if (zona.getNomeZona() != null && !zona.getNomeZona().isBlank()){
            existingZona.setNomeZona(zona.getNomeZona().trim());
        }

        if (zona.getPrezzoMedioSqm() != null){
            existingZona.setPrezzoMedioSqm(zona.getPrezzoMedioSqm());
        }
        
        return repo.save(existingZona);
        
    }

   
    
    


    
    
    
    

    

    
    
    
    


}
