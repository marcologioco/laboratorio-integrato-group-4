package com.immobiliaris.immobiliaris_be.repos;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.immobiliaris.immobiliaris_be.model.Zona;

@Repository
public interface ZonaRepo extends JpaRepository<Zona,String>{

    //trova zone per cap;
    List<Zona> findByCap(String cap);
    //trova zone per prezzo medio al metro quadro
    List<Zona> findByPrezzoMedioSqm(Double prezzoMedioSqm);

}
