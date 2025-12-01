package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.immobiliaris.immobiliaris_be.model.Venditore;
import com.immobiliaris.immobiliaris_be.repos.VenditoreRepo;

@Service
public class VenditoreServiceImpl implements VenditoreService{
    
    @Autowired
    private VenditoreRepo venditoreRepo;
    
    // Pattern per validazione
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^3\\d{9}$");

    @Override
    public List<Venditore> findAllVenditori(){
        return venditoreRepo.findAll();
    }

    @Override
    public Optional<Venditore> findVenditoreById(Integer idVenditore){
        return venditoreRepo.findById(idVenditore);
    }

    @Override
    public List<Venditore> findVenditoreByIdUtente(Integer idUtente){
        return venditoreRepo.findByIdUtente(idUtente);
    }

    @Override
    public List<Venditore> findVenditoreByNome(String nome) {
        return venditoreRepo.findByNome(nome);
    }

    @Override
    public List<Venditore> findVenditoreByCognome(String cognome) {
        return venditoreRepo.findByCognome(cognome);
    }

    @Override
    public List<Venditore> findVenditoreByEmail(String email) {
        return venditoreRepo.findByEmail(email);
    }

    @Override
    public List<Venditore> findVenditoreByTelefono(String telefono) {
        return venditoreRepo.findByTelefono(telefono);
    }

    @Override
    public List<Venditore> findVenditoreByIndirizzo(String indirizzo) {
        return venditoreRepo.findByIndirizzo(indirizzo);
    }

    @Override
    public List<Venditore> findVenditoreByCitta(String citta) {
        return venditoreRepo.findByCitta(citta);
    }

    @Override
    public List<Venditore> findVenditoreByProvincia(String provincia) {
        return venditoreRepo.findByProvincia(provincia);
    }

    @Override
    public List<Venditore> findVenditoreByCodiceFiscale(String codiceFiscale) {
        return venditoreRepo.findByCodiceFiscale(codiceFiscale);
    }

    @Override
    public Venditore saveVenditore(Venditore venditore) {
        // Valida email se presente
        if (venditore.getEmail() != null && !venditore.getEmail().isBlank()) {
            if (!EMAIL_PATTERN.matcher(venditore.getEmail()).matches()) {
                throw new IllegalArgumentException("Email non valida");
            }
        }
        
        // Valida telefono se presente
        if (venditore.getTelefono() != null && !venditore.getTelefono().isBlank()) {
            String cleanPhone = venditore.getTelefono().replaceAll("\\D", "");
            if (!PHONE_PATTERN.matcher(cleanPhone).matches()) {
                throw new IllegalArgumentException("Numero cellulare non valido. Formato richiesto: 3xxxxxxxxx (10 cifre)");
            }
            venditore.setTelefono(cleanPhone);
        }
        
        return venditoreRepo.save(venditore);
    }

    @Override
    public Venditore updateVenditore(Integer id, Venditore venditoreDetails) {
        Venditore venditore = venditoreRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Venditore non trovato con id: " + id));

        venditore.setIdUtente(venditoreDetails.getIdUtente());
        venditore.setNome(venditoreDetails.getNome());
        venditore.setCognome(venditoreDetails.getCognome());
        
        // Valida email se modificata
        if (venditoreDetails.getEmail() != null && !venditoreDetails.getEmail().isBlank()) {
            if (!EMAIL_PATTERN.matcher(venditoreDetails.getEmail()).matches()) {
                throw new IllegalArgumentException("Email non valida");
            }
            venditore.setEmail(venditoreDetails.getEmail());
        }
        
        // Valida telefono se modificato
        if (venditoreDetails.getTelefono() != null && !venditoreDetails.getTelefono().isBlank()) {
            String cleanPhone = venditoreDetails.getTelefono().replaceAll("\\D", "");
            if (!PHONE_PATTERN.matcher(cleanPhone).matches()) {
                throw new IllegalArgumentException("Numero cellulare non valido. Formato richiesto: 3xxxxxxxxx (10 cifre)");
            }
            venditore.setTelefono(cleanPhone);
        }
        
        venditore.setIndirizzo(venditoreDetails.getIndirizzo());
        venditore.setCitta(venditoreDetails.getCitta());
        venditore.setProvincia(venditoreDetails.getProvincia());
        venditore.setCodiceFiscale(venditoreDetails.getCodiceFiscale());
        
        return venditoreRepo.save(venditore);
    }

    @Override
    public void deleteById(Integer id) {
        venditoreRepo.deleteById(id);
    }

    @Override
    public Venditore patchVenditore(Integer idVenditore, Venditore venditore) {
        Venditore existingVenditore = venditoreRepo.findById(idVenditore)
            .orElseThrow(() -> new RuntimeException("Venditore non trovato con id: " + idVenditore));

        if (venditore.getIdUtente() != null) {
            existingVenditore.setIdUtente(venditore.getIdUtente());
        }
        if (venditore.getNome() != null && !venditore.getNome().isBlank()) {
            existingVenditore.setNome(venditore.getNome().trim());
        }
        if (venditore.getCognome() != null && !venditore.getCognome().isBlank()) {
            existingVenditore.setCognome(venditore.getCognome().trim());
        }
        if (venditore.getEmail() != null && !venditore.getEmail().isBlank()) {
            String email = venditore.getEmail().trim();
            if (!EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("Email non valida");
            }
            existingVenditore.setEmail(email);
        }
        if (venditore.getTelefono() != null && !venditore.getTelefono().isBlank()) {
            String cleanPhone = venditore.getTelefono().replaceAll("\\D", "");
            if (!PHONE_PATTERN.matcher(cleanPhone).matches()) {
                throw new IllegalArgumentException("Numero cellulare non valido. Formato richiesto: 3xxxxxxxxx (10 cifre)");
            }
            existingVenditore.setTelefono(cleanPhone);
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
        if (venditore.getCodiceFiscale() != null && !venditore.getCodiceFiscale().isBlank()) {
            existingVenditore.setCodiceFiscale(venditore.getCodiceFiscale().trim());
        }

        return venditoreRepo.save(existingVenditore);
    }

    

}
