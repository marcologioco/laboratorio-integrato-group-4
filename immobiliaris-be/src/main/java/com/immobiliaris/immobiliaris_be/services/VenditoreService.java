package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import com.immobiliaris.immobiliaris_be.model.Venditore;

public interface VenditoreService {
    
    List<Venditore> findAllVenditori();
    Optional<Venditore> findVenditoreById(Integer idVenditore);
    List<Venditore> findVenditoreByIdUtente(Integer idUtente);
    List<Venditore> findVenditoreByNome(String nome);
    List<Venditore> findVenditoreByCognome(String cognome);
    List<Venditore> findVenditoreByEmail(String email);
    List<Venditore> findVenditoreByTelefono(String telefono);
    List<Venditore> findVenditoreByIndirizzo(String indirizzo);
    List<Venditore> findVenditoreByCitta(String citta);
    List<Venditore> findVenditoreByProvincia(String provincia);
    List<Venditore> findVenditoreByCodiceFiscale(String codiceFiscale);
    Venditore saveVenditore(Venditore venditore);
    Venditore updateVenditore(Integer id, Venditore venditoreDetails);
    void deleteById(Integer id);
    Venditore patchVenditore(Integer idVenditore, Venditore venditore);
}
