package com.immobiliaris.immobiliaris_be.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Zona;
import java.util.List;


@Repository
public interface ZonaRepo extends JpaRepository<Zona,String>{
    
    //trova zone per cap;
    List<Zona> findByCap(String cap);

    //trova zone per prezzo medio al metro quadro
    List<Zona> findByPrezzoMedioSqm(Double prezzoMedioSqm);
}
