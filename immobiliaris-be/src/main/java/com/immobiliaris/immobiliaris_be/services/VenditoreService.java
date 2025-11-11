package com.immobiliaris.immobiliaris_be.services;

import java.util.List;

import com.immobiliaris.immobiliaris_be.model.Venditore;

public interface VenditoreService {
    
    List<Venditore> findAllVenditori();
    List<Venditore> findVenditoreById(Integer id_venditore);
    List<Venditore> findVenditoreByIdUtente(Integer id_utente);
    List<Venditore> findVenditoreByNome(String nome);
    List<Venditore> findVenditoreByCognome(String cognome);
    List<Venditore> findVenditoreByEmail(String email);
    List<Venditore> findVenditoreByTelefono(String telefono);
    List<Venditore> findVenditoreByIndirizzo(String indirizzo);
    List<Venditore> findVenditoreByCitta(String citta);
    List<Venditore> findVenditoreByProvincia(String provincia);
    List<Venditore> FindVenditoreByCodiceFiscale(String codice_fiscale);
    Venditore saveVenditore(Venditore venditore);
    Venditore updateVenditore(Integer id, Venditore venditoreDetails);
    void deleteById(Integer id);
    Venditore patchVenditore(Integer idVenditore, Venditore venditore);                      

}
