package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.immobiliaris.immobiliaris_be.model.Venditore;
import com.immobiliaris.immobiliaris_be.repos.VenditoreRepo;

@Service
public class VenditoreServiceImpl implements VenditoreService{
    
    @Autowired
    private VenditoreRepo venditoreRepo;

    @Override
    public List<Venditore> findAllVenditori(){
        return venditoreRepo.findAll();
    }

    @Override
    public Optional<Venditore> findVenditoreById(Integer id_venditore){
        return venditoreRepo.findByIdVenditore(id_venditore);
    }

    @Override
    public List<Venditore> findVenditoreByIdUtente(Integer id_utente){
        return venditoreRepo.findByIdUtenteVenditore(id_utente);
    }

    @Override
    public List<Venditore> findVenditoreByNome(String nome) {
        return venditoreRepo.findByNomeVenditore(nome);
    }

    @Override
    public List<Venditore> findVenditoreByCognome(String cognome) {
        return venditoreRepo.findByCognomeVenditore(cognome);
    }

    @Override
    public List<Venditore> findVenditoreByEmail(String email) {
        return venditoreRepo.findByEmailVenditore(email);
    }

    @Override
    public List<Venditore> findVenditoreByTelefono(String telefono) {
        return venditoreRepo.findByTelefonoVenditore(telefono);
    }

    @Override
    public List<Venditore> findVenditoreByIndirizzo(String indirizzo) {
        return venditoreRepo.findByIndirizzoVenditore(indirizzo);
    }

    @Override
    public List<Venditore> findVenditoreByCitta(String citta) {
        return venditoreRepo.findByCittaVenditore(citta);
    }

    @Override
    public List<Venditore> findVenditoreByProvincia(String provincia) {
        return venditoreRepo.findByProvinciaVenditore(provincia);
    }

    @Override
    public List<Venditore> FindVenditoreByCodiceFiscale(String codice_fiscale) {
        return venditoreRepo.findByCodiceFiscaleVenditore(codice_fiscale);
    }

    @Override
    public Venditore saveVenditore(Venditore venditore) {
        return venditoreRepo.save(venditore);
    }

    @Override
    public Venditore updateVenditore(Integer id, Venditore venditoreDetails) {
    Venditore venditore = venditoreRepo.findByIdVenditore(id)
        .orElseThrow(() -> new RuntimeException("Venditore non trovato con id: " + id));

        venditore.setId_venditore(venditoreDetails.getId_venditore());
        venditore.setId_utente(venditoreDetails.getId_venditore());
        venditore.setNome(venditoreDetails.getNome());
        venditore.setCognome(venditoreDetails.getCognome());
        venditore.setEmail(venditoreDetails.getEmail());
        venditore.setTelefono(venditoreDetails.getTelefono());
        venditore.setIndirizzo(venditoreDetails.getIndirizzo());
        venditore.setCitta(venditoreDetails.getCitta());
        venditore.setProvincia(venditoreDetails.getProvincia());
        venditore.setCodice_fiscale(venditoreDetails.getCodice_fiscale());
        
        return venditoreRepo.save(venditore);
        
    }

    @Override
    public void deleteById(Integer id) {
        venditoreRepo.deleteById(id);
    }

    @Override
    public Venditore patchVenditore(Integer idVenditore, Venditore venditore) {
        Venditore existingVenditore = venditoreRepo.findByIdVenditore(idVenditore)
            .orElseThrow(() -> new RuntimeException("Venditore non trovato con id: " + idVenditore));

        if (venditore.getId_utente() != null) {
            existingVenditore.setId_utente(venditore.getId_utente());
        }
        if (venditore.getNome() != null && !venditore.getNome().isBlank()) {
            existingVenditore.setNome(venditore.getNome().trim());
        }
        if (venditore.getCognome() != null && !venditore.getCognome().isBlank()) {
            existingVenditore.setCognome(venditore.getCognome().trim());
        }
        if (venditore.getEmail() != null && !venditore.getEmail().isBlank()) {
            existingVenditore.setEmail(venditore.getEmail().trim());
        }
        if (venditore.getTelefono() != null && !venditore.getTelefono().isBlank()) {
            existingVenditore.setTelefono(venditore.getTelefono().trim());
        }
        if (venditore.getIndirizzo() != null && !venditore.getIndirizzo().isBlank()) {
            existingVenditore.setIndirizzo(venditore.getIndirizzo().trim());
        }
        if (venditore.getCitta() != null && !venditore.getCitta().isBlank()) {
            existingVenditore.setCitta(venditore.getCitta().trim());
        }
        if (venditore.getProvincia() != null && !venditore.getProvincia().isBlank()) {
            existingVenditore.setProvincia(venditore.getProvincia().trim());
        }
        if (venditore.getCodice_fiscale() != null && !venditore.getCodice_fiscale().isBlank()) {
            existingVenditore.setCodice_fiscale(venditore.getCodice_fiscale().trim());
        }

        return venditoreRepo.save(existingVenditore);
    }

    

}
