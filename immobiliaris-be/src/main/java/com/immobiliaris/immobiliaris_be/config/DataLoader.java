package com.immobiliaris.immobiliaris_be.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.immobiliaris.immobiliaris_be.model.Utente;
import com.immobiliaris.immobiliaris_be.services.UtenteService;

/**
 * DataLoader - Carica dati iniziali nel database all'avvio dell'applicazione
 * 
 * Crea gli utenti di test con password hashate usando BCrypt tramite UtenteService.
 * Questo approccio è più sicuro e manutenibile rispetto ad avere password in chiaro
 * o hash pre-generati nel file data-test.sql.
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UtenteService utenteService;

    @Override
    public void run(String... args) throws Exception {
        loadUsers();
    }

    /**
     * Carica gli utenti di test nel database.
     * Le password vengono automaticamente hashate dal UtenteService.
     */
    private void loadUsers() {
        // Admin
        Utente admin = new Utente();
        admin.setNome("Admin");
        admin.setCognome("Default");
        admin.setEmail("admin@example.com");
        admin.setPassword("admin123"); // Verrà hashata automaticamente
        admin.setTelefono("3331234567"); // Numero cellulare valido
        admin.setIdRuolo(2); // Admin
        utenteService.saveUtente(admin);

        // Utente 1 - Luca Rossi (proprietario e venditore)
        Utente luca = new Utente();
        luca.setNome("Luca");
        luca.setCognome("Rossi");
        luca.setEmail("luca.rossi@example.com");
        luca.setPassword("pwd123");
        luca.setTelefono("3456789012");
        luca.setIdRuolo(1); // Utente normale
        utenteService.saveUtente(luca);

        // Utente 2 - Marta Bianchi (proprietaria e venditrice)
        Utente marta = new Utente();
        marta.setNome("Marta");
        marta.setCognome("Bianchi");
        marta.setEmail("marta.bianchi@example.com");
        marta.setPassword("pwd456");
        marta.setTelefono("3478901234");
        marta.setIdRuolo(1);
        utenteService.saveUtente(marta);

        // Utente 3 - Giulia Verdi (proprietaria e venditrice)
        Utente giulia = new Utente();
        giulia.setNome("Giulia");
        giulia.setCognome("Verdi");
        giulia.setEmail("giulia.verdi@example.com");
        giulia.setPassword("pwd789");
        giulia.setTelefono("3491122334");
        giulia.setIdRuolo(1);
        utenteService.saveUtente(giulia);

        // Utente 4 - Paolo Ferrari (utente che ha richiesto valutazione)
        Utente paolo = new Utente();
        paolo.setNome("Paolo");
        paolo.setCognome("Ferrari");
        paolo.setEmail("paolo.ferrari@example.com");
        paolo.setPassword("pwd101");
        paolo.setTelefono("3332233445");
        paolo.setIdRuolo(1);
        utenteService.saveUtente(paolo);

        // Utente 5 - Sara Conti (utente che ha richiesto valutazione)
        Utente sara = new Utente();
        sara.setNome("Sara");
        sara.setCognome("Conti");
        sara.setEmail("sara.conti@example.com");
        sara.setPassword("pwd202");
        sara.setTelefono("3489988776");
        sara.setIdRuolo(1);
        utenteService.saveUtente(sara);

        System.out.println("✅ DataLoader: Utenti di test caricati con password hashate");
    }
}
