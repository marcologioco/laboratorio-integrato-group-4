package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import com.immobiliaris.immobiliaris_be.model.Zona;

public interface ZoneService {

    List<Zona> findAllZone();
    Optional<Zona> findZonaByCap(String cap);

    Zona addZona(Zona z);

    Zona findZonaByNome(String nomeZona);
    List<Zona> findZonaByPrezzoMedio(Double prezzoMedioSqm);
    Zona updateZona(String cap, Zona zona);
    void deleteZonaById(String cap);
    Zona patchZona(String cap, Zona zona);

}
