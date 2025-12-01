package com.immobiliaris.immobiliaris_be.services;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.immobiliaris.immobiliaris_be.model.Utente;
import com.immobiliaris.immobiliaris_be.repos.UtenteRepo;

@Service
public class UtenteServiceImpl implements UtenteService {

    @Autowired
    private UtenteRepo utenteRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Pattern per validazione
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^3\\d{9}$");

    @Override
    public List<Utente> findAllUtenti() {
        return utenteRepo.findAll();
    }

    @Override
    public Optional<Utente> findUtenteById(Integer idUtente) {
        return utenteRepo.findById(idUtente);
    }

    @Override
    public Optional<Utente> findUtenteByEmail(String email) {
        return utenteRepo.findByEmail(email);
    }

    @Override
    public List<Utente> findUtentiByIdRuolo(Integer idRuolo) {
        return utenteRepo.findByIdRuolo(idRuolo);
    }

    @Override
    public Utente saveUtente(Utente utente) {
        // Valida email se presente
        if (utente.getEmail() != null && !utente.getEmail().isBlank()) {
            if (!EMAIL_PATTERN.matcher(utente.getEmail()).matches()) {
                throw new IllegalArgumentException("Email non valida");
            }
        }
        
        // Valida telefono se presente
        if (utente.getTelefono() != null && !utente.getTelefono().isBlank()) {
            String cleanPhone = utente.getTelefono().replaceAll("\\D", "");
            if (!PHONE_PATTERN.matcher(cleanPhone).matches()) {
                throw new IllegalArgumentException("Numero cellulare non valido. Formato richiesto: 3xxxxxxxxx (10 cifre)");
            }
            utente.setTelefono(cleanPhone); // Salva numero pulito
        }
        
        // Hasha la password prima di salvare
        if (utente.getPassword() != null && !utente.getPassword().isBlank()) {
            utente.setPassword(passwordEncoder.encode(utente.getPassword()));
        }
        return utenteRepo.save(utente);
    }

    @Override
    public Utente updateUtente(Integer id, Utente utenteDetails) {
        Utente utente = utenteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con id: " + id));

        // Valida email se modificata
        if (utenteDetails.getEmail() != null && !utenteDetails.getEmail().isBlank()) {
            if (!EMAIL_PATTERN.matcher(utenteDetails.getEmail()).matches()) {
                throw new IllegalArgumentException("Email non valida");
            }
            utente.setEmail(utenteDetails.getEmail());
        }
        
        // Valida telefono se modificato
        if (utenteDetails.getTelefono() != null && !utenteDetails.getTelefono().isBlank()) {
            String cleanPhone = utenteDetails.getTelefono().replaceAll("\\D", "");
            if (!PHONE_PATTERN.matcher(cleanPhone).matches()) {
                throw new IllegalArgumentException("Numero cellulare non valido. Formato richiesto: 3xxxxxxxxx (10 cifre)");
            }
            utente.setTelefono(cleanPhone);
        }

        utente.setNome(utenteDetails.getNome());
        utente.setCognome(utenteDetails.getCognome());
        
        // Hasha la password se è stata modificata
        if (utenteDetails.getPassword() != null && !utenteDetails.getPassword().isBlank()) {
            utente.setPassword(passwordEncoder.encode(utenteDetails.getPassword()));
        }
        
        utente.setIdRuolo(utenteDetails.getIdRuolo());

        return utenteRepo.save(utente);
    }

    @Override
    public void deleteById(Integer id) {
        utenteRepo.deleteById(id);
    }

    @Override
    public Utente patchUtente(Integer idUtente, Utente patchUtente) {
        Utente existingUtente = utenteRepo.findById(idUtente)
                .orElseThrow(() -> new RuntimeException("Utente non trovato con id: " + idUtente));

        if (patchUtente.getNome() != null && !patchUtente.getNome().isBlank()) {
            existingUtente.setNome(patchUtente.getNome().trim());
        }

        if (patchUtente.getCognome() != null && !patchUtente.getCognome().isBlank()) {
            existingUtente.setCognome(patchUtente.getCognome().trim());
        }

        if (patchUtente.getEmail() != null && !patchUtente.getEmail().isBlank()) {
            String email = patchUtente.getEmail().trim();
            if (!EMAIL_PATTERN.matcher(email).matches()) {
                throw new IllegalArgumentException("Email non valida");
            }
            existingUtente.setEmail(email);
        }

        if (patchUtente.getPassword() != null && !patchUtente.getPassword().isBlank()) {
            // Hasha la password se viene cambiata
            existingUtente.setPassword(passwordEncoder.encode(patchUtente.getPassword().trim()));
        }

        if (patchUtente.getTelefono() != null && !patchUtente.getTelefono().isBlank()) {
            String cleanPhone = patchUtente.getTelefono().replaceAll("\\D", "");
            if (!PHONE_PATTERN.matcher(cleanPhone).matches()) {
                throw new IllegalArgumentException("Numero cellulare non valido. Formato richiesto: 3xxxxxxxxx (10 cifre)");
            }
            existingUtente.setTelefono(cleanPhone);
        }

        if (patchUtente.getIdRuolo() != null) {
            existingUtente.setIdRuolo(patchUtente.getIdRuolo());
        }

        return utenteRepo.save(existingUtente);
    }
}
