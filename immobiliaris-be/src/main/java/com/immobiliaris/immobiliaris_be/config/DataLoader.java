package com.immobiliaris.immobiliaris_be.config;

import java.time.LocalDate;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.immobiliaris.immobiliaris_be.enums.StatoContratto;
import com.immobiliaris.immobiliaris_be.enums.StatoImmobile;
import com.immobiliaris.immobiliaris_be.enums.StatoValutazione;
import com.immobiliaris.immobiliaris_be.enums.TipoImmobile;
import com.immobiliaris.immobiliaris_be.model.*;
import com.immobiliaris.immobiliaris_be.repos.*;
import com.immobiliaris.immobiliaris_be.services.UtenteService;

/**
 * DataLoader - Carica dati iniziali nel database all'avvio dell'applicazione
 * 
 * Gestisce l'inizializzazione completa del database con dati di test:
 * - Ruoli
 * - Utenti (con password hashate)
 * - Zone con prezzi al mq
 * - Venditori
 * - Immobili
 * - Valutazioni
 * - Contratti
 * 
 * Include controllo di persistenza: carica i dati solo al primo avvio.
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UtenteService utenteService;
    
    @Autowired
    private RuoloRepo ruoloRepo;
    
    @Autowired
    private ZonaRepo zonaRepo;
    
    @Autowired
    private VenditoreRepo venditoreRepo;
    
    @Autowired
    private ImmobileRepo immobileRepo;
    
    @Autowired
    private ValutazioneRepo valutazioneRepo;
    
    @Autowired
    private ContrattoRepo contrattoRepo;

    @Override
    public void run(String... args) throws Exception {
        // Verifica se il database è già stato inizializzato
        if (utenteService.findUtenteByEmail("admin@example.com").isPresent()) {
            System.out.println("DataLoader: Dati già presenti nel database, skip inizializzazione");
            return;
        }

        System.out.println("DataLoader: Inizializzazione database...");
        
        loadRuoli();
        loadUsers();
        loadZone();
        loadVenditori();
        loadImmobili();
        loadValutazioni();
        loadContratti();
        
        System.out.println("DataLoader: Database inizializzato con successo!");
    }

    /**
     * Carica i ruoli nel database
     */
    private void loadRuoli() {
        Ruolo ruoloUtente = new Ruolo();
        ruoloUtente.setNome("utente");
        ruoloRepo.save(ruoloUtente);

        Ruolo ruoloAdmin = new Ruolo();
        ruoloAdmin.setNome("admin");
        ruoloRepo.save(ruoloAdmin);

        System.out.println("  ✓ Ruoli caricati");
    }

    /**
     * Carica gli utenti di test nel database.
     * Le password vengono automaticamente hashate dal UtenteService.
     * Verifica se gli utenti esistono già per evitare duplicazioni con DB persistente.
     */
    private void loadUsers() {
        // Verifica se il database è già stato inizializzato
        if (utenteService.findUtenteByEmail("admin@example.com").isPresent()) {
            System.out.println(" DataLoader: Dati già presenti nel database, skip inizializzazione");
            return;
        }

        System.out.println("DataLoader: Inizializzazione dati di test...");

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

        System.out.println("  ✓ Utenti caricati (6)");
    }

    /**
     * Carica le zone con i prezzi medi al mq
     */
    private void loadZone() {
        // Zone di Torino
        zonaRepo.save(new Zona("10121", "Centro Storico", 4000.00));
        zonaRepo.save(new Zona("10122", "Centro - Porta Palazzo", 3700.00));
        zonaRepo.save(new Zona("10123", "Quadrilatero Romano", 4100.00));
        zonaRepo.save(new Zona("10124", "Piazza Vittorio / Vanchiglia", 3900.00));
        zonaRepo.save(new Zona("10125", "San Salvario", 3100.00));
        zonaRepo.save(new Zona("10126", "Lingotto / Nizza Millefonti", 2400.00));
        zonaRepo.save(new Zona("10127", "Filadelfia / Stadio", 2300.00));
        zonaRepo.save(new Zona("10128", "Crocetta Est", 3500.00));
        zonaRepo.save(new Zona("10129", "Crocetta Ovest", 3600.00));
        zonaRepo.save(new Zona("10131", "Madonna del Pilone", 2700.00));
        zonaRepo.save(new Zona("10132", "Sassi / Borgata Rosa", 2600.00));
        zonaRepo.save(new Zona("10133", "Cavoretto / Gran Madre", 3200.00));
        zonaRepo.save(new Zona("10134", "Santa Rita Sud", 2100.00));
        zonaRepo.save(new Zona("10135", "Mirafiori Sud", 1800.00));
        zonaRepo.save(new Zona("10136", "Mirafiori Nord", 1900.00));
        zonaRepo.save(new Zona("10137", "Santa Rita Nord", 2100.00));
        zonaRepo.save(new Zona("10138", "Cenisia", 2400.00));
        zonaRepo.save(new Zona("10139", "Pozzo Strada", 2100.00));
        zonaRepo.save(new Zona("10141", "Borgo San Paolo", 2200.00));
        zonaRepo.save(new Zona("10142", "Borgo San Paolo Ovest", 2200.00));
        zonaRepo.save(new Zona("10143", "Campidoglio", 2600.00));
        zonaRepo.save(new Zona("10144", "San Donato", 2500.00));
        zonaRepo.save(new Zona("10145", "Cit Turin", 3100.00));
        zonaRepo.save(new Zona("10146", "Parella", 2300.00));
        zonaRepo.save(new Zona("10147", "Madonna di Campagna", 1900.00));
        zonaRepo.save(new Zona("10148", "Borgo Vittoria", 2000.00));
        zonaRepo.save(new Zona("10149", "Lucento", 2000.00));
        zonaRepo.save(new Zona("10151", "Vallette", 1700.00));
        zonaRepo.save(new Zona("10152", "Aurora", 1700.00));
        zonaRepo.save(new Zona("10153", "Vanchiglia / Regio Parco", 2800.00));
        zonaRepo.save(new Zona("10154", "Barriera di Milano", 1600.00));
        zonaRepo.save(new Zona("10155", "Barriera di Milano Nord", 1600.00));
        zonaRepo.save(new Zona("10156", "Rebaudengo / Falchera", 1500.00));
        
        // Altre città
        zonaRepo.save(new Zona("14100", "Asti Centro", 1900.00));
        zonaRepo.save(new Zona("15121", "Alessandria Centro", 1700.00));
        zonaRepo.save(new Zona("12100", "Cuneo Centro", 2200.00));

        System.out.println("  ✓ Zone caricate (36)");
    }

    /**
     * Carica i venditori nel database
     */
    private void loadVenditori() {
        Venditore v1 = new Venditore();
        v1.setIdUtente(2); // Luca Rossi
        v1.setNome("Luca");
        v1.setCognome("Rossi");
        v1.setEmail("luca.rossi@vendite.it");
        v1.setTelefono("3456789012");
        v1.setIndirizzo("Via Roma 10");
        v1.setCitta("Torino");
        v1.setProvincia("TO");
        v1.setCodiceFiscale("RSSLCU80A01L219Z");
        venditoreRepo.save(v1);

        Venditore v2 = new Venditore();
        v2.setIdUtente(null);
        v2.setNome("Elena");
        v2.setCognome("Gallo");
        v2.setEmail("elena.gallo@vendite.it");
        v2.setTelefono("3475678901");
        v2.setIndirizzo("Corso Francia 25");
        v2.setCitta("Torino");
        v2.setProvincia("TO");
        v2.setCodiceFiscale("GLLLNE85B41L219K");
        venditoreRepo.save(v2);

        Venditore v3 = new Venditore();
        v3.setIdUtente(3); // Marta Bianchi
        v3.setNome("Marta");
        v3.setCognome("Bianchi");
        v3.setEmail("marta.bianchi@vendite.it");
        v3.setTelefono("3478901234");
        v3.setIndirizzo("Via Garibaldi 55");
        v3.setCitta("Alessandria");
        v3.setProvincia("AL");
        v3.setCodiceFiscale("BNCMRT90C22F205A");
        venditoreRepo.save(v3);

        Venditore v4 = new Venditore();
        v4.setIdUtente(null);
        v4.setNome("Marco");
        v4.setCognome("Russo");
        v4.setEmail("marco.russo@vendite.it");
        v4.setTelefono("3495566778");
        v4.setIndirizzo("Via Po 15");
        v4.setCitta("Torino");
        v4.setProvincia("TO");
        v4.setCodiceFiscale("RSSMRC82C01L219E");
        venditoreRepo.save(v4);

        Venditore v5 = new Venditore();
        v5.setIdUtente(4); // Giulia Verdi
        v5.setNome("Giulia");
        v5.setCognome("Verdi");
        v5.setEmail("giulia.verdi@vendite.it");
        v5.setTelefono("3491122334");
        v5.setIndirizzo("Viale Italia 8");
        v5.setCitta("Asti");
        v5.setProvincia("AT");
        v5.setCodiceFiscale("VRDGLI91E15H501Y");
        venditoreRepo.save(v5);

        Venditore v6 = new Venditore();
        v6.setIdUtente(null);
        v6.setNome("Carlo");
        v6.setCognome("Bianchi");
        v6.setEmail("carlo.bianchi@vendite.it");
        v6.setTelefono("3334455667");
        v6.setIndirizzo("Corso Nizza 12");
        v6.setCitta("Cuneo");
        v6.setProvincia("CN");
        v6.setCodiceFiscale("BNCCRL80B22H501Z");
        venditoreRepo.save(v6);

        System.out.println("  ✓ Venditori caricati (6)");
    }

    /**
     * Carica gli immobili nel database
     */
    private void loadImmobili() {
        Immobile i1 = new Immobile();
        i1.setIdVenditore(1);
        i1.setTipo(TipoImmobile.APPARTAMENTO);
        i1.setIndirizzo("Via Genova 12");
        i1.setCitta("Torino");
        i1.setProvincia("TO");
        i1.setCap("10137");
        i1.setMetriQuadri(80.0);
        i1.setCamere(3);
        i1.setBagni(1);
        i1.setPrezzo(160000.0);
        i1.setDescrizione("Appartamento luminoso con balcone e garage");
        i1.setStato(StatoImmobile.ABITABILE);
        immobileRepo.save(i1);

        Immobile i2 = new Immobile();
        i2.setIdVenditore(3);
        i2.setTipo(TipoImmobile.VILLA);
        i2.setIndirizzo("Via dei Fiori 5");
        i2.setCitta("Torino");
        i2.setProvincia("TO");
        i2.setCap("10126");
        i2.setMetriQuadri(180.0);
        i2.setCamere(5);
        i2.setBagni(3);
        i2.setPrezzo(750000.0);
        i2.setDescrizione("Villa con giardino e piscina");
        i2.setStato(StatoImmobile.NUOVA);
        immobileRepo.save(i2);

        Immobile i3 = new Immobile();
        i3.setIdVenditore(4);
        i3.setTipo(TipoImmobile.APPARTAMENTO);
        i3.setIndirizzo("Via Chambery 45");
        i3.setCitta("Torino");
        i3.setProvincia("TO");
        i3.setCap("10141");
        i3.setMetriQuadri(65.0);
        i3.setCamere(2);
        i3.setBagni(1);
        i3.setPrezzo(130000.0);
        i3.setDescrizione("Bilocale con riscaldamento autonomo");
        i3.setStato(StatoImmobile.DA_RISTRUTTURARE);
        immobileRepo.save(i3);

        Immobile i4 = new Immobile();
        i4.setIdVenditore(5);
        i4.setTipo(TipoImmobile.VILLA);
        i4.setIndirizzo("Viale Europa 33");
        i4.setCitta("Asti");
        i4.setProvincia("AT");
        i4.setCap("14100");
        i4.setMetriQuadri(200.0);
        i4.setCamere(6);
        i4.setBagni(3);
        i4.setPrezzo(560000.0);
        i4.setDescrizione("Villa indipendente con ampio cortile");
        i4.setStato(StatoImmobile.ABITABILE);
        immobileRepo.save(i4);

        Immobile i5 = new Immobile();
        i5.setIdVenditore(3);
        i5.setTipo(TipoImmobile.APPARTAMENTO);
        i5.setIndirizzo("Corso Alessandria 10");
        i5.setCitta("Alessandria");
        i5.setProvincia("AL");
        i5.setCap("15121");
        i5.setMetriQuadri(90.0);
        i5.setCamere(3);
        i5.setBagni(2);
        i5.setPrezzo(220000.0);
        i5.setDescrizione("Appartamento centrale vicino servizi");
        i5.setStato(StatoImmobile.ABITABILE);
        immobileRepo.save(i5);

        Immobile i6 = new Immobile();
        i6.setIdVenditore(6);
        i6.setTipo(TipoImmobile.APPARTAMENTO);
        i6.setIndirizzo("Via Cuneo 5");
        i6.setCitta("Cuneo");
        i6.setProvincia("CN");
        i6.setCap("12100");
        i6.setMetriQuadri(75.0);
        i6.setCamere(2);
        i6.setBagni(1);
        i6.setPrezzo(140000.0);
        i6.setDescrizione("Bilocale in zona centrale");
        i6.setStato(StatoImmobile.ABITABILE);
        immobileRepo.save(i6);

        System.out.println("  ✓ Immobili caricati (6)");
    }

    /**
     * Carica le valutazioni nel database
     */
    private void loadValutazioni() {
        Calendar cal = Calendar.getInstance();

        // Valutazione 1
        Valutazione val1 = new Valutazione();
        val1.setIdImmobile(1);
        val1.setIdUtente(3); // Marta
        val1.setStato(StatoValutazione.COMPLETATA);
        val1.setValoreStimato(180000.0);
        val1.setValoreCalcolatoZona(168000.0);
        cal.set(2024, Calendar.MAY, 28, 10, 30, 0);
        val1.setDataRichiesta(cal.getTime());
        val1.setDataCompletamento(cal.getTime());
        cal.add(Calendar.DAY_OF_MONTH, 3);
        val1.setDeadline(cal.getTime());
        val1.setNote("Valutazione automatica completata istantaneamente");
        valutazioneRepo.save(val1);

        // Valutazione 2
        Valutazione val2 = new Valutazione();
        val2.setIdImmobile(2);
        val2.setIdUtente(2); // Luca
        val2.setStato(StatoValutazione.COMPLETATA);
        val2.setValoreStimato(558900.0);
        val2.setValoreCalcolatoZona(432000.0);
        cal.set(2024, Calendar.APRIL, 10, 14, 15, 0);
        val2.setDataRichiesta(cal.getTime());
        val2.setDataCompletamento(cal.getTime());
        cal.add(Calendar.DAY_OF_MONTH, 3);
        val2.setDeadline(cal.getTime());
        val2.setNote("Valutazione automatica completata istantaneamente");
        valutazioneRepo.save(val2);

        // Valutazione 3
        Valutazione val3 = new Valutazione();
        val3.setIdImmobile(3);
        val3.setIdUtente(6); // Sara
        val3.setStato(StatoValutazione.COMPLETATA);
        val3.setValoreStimato(107300.0);
        val3.setValoreCalcolatoZona(143000.0);
        cal.set(2024, Calendar.MAY, 15, 9, 0, 0);
        val3.setDataRichiesta(cal.getTime());
        val3.setDataCompletamento(cal.getTime());
        cal.add(Calendar.DAY_OF_MONTH, 3);
        val3.setDeadline(cal.getTime());
        val3.setNote("Valutazione automatica completata istantaneamente");
        valutazioneRepo.save(val3);

        // Valutazione 4
        Valutazione val4 = new Valutazione();
        val4.setIdImmobile(4);
        val4.setIdUtente(4); // Giulia
        val4.setStato(StatoValutazione.COMPLETATA);
        val4.setValoreStimato(410000.0);
        val4.setValoreCalcolatoZona(380000.0);
        cal.set(2024, Calendar.FEBRUARY, 20, 16, 45, 0);
        val4.setDataRichiesta(cal.getTime());
        val4.setDataCompletamento(cal.getTime());
        cal.add(Calendar.DAY_OF_MONTH, 3);
        val4.setDeadline(cal.getTime());
        val4.setNote("Valutazione automatica completata istantaneamente");
        valutazioneRepo.save(val4);

        // Valutazione 5
        Valutazione val5 = new Valutazione();
        val5.setIdImmobile(5);
        val5.setIdUtente(5); // Paolo
        val5.setStato(StatoValutazione.COMPLETATA);
        val5.setValoreStimato(158000.0);
        val5.setValoreCalcolatoZona(153000.0);
        cal.set(2024, Calendar.MAY, 25, 11, 20, 0);
        val5.setDataRichiesta(cal.getTime());
        val5.setDataCompletamento(cal.getTime());
        cal.add(Calendar.DAY_OF_MONTH, 3);
        val5.setDeadline(cal.getTime());
        val5.setNote("Valutazione automatica completata istantaneamente");
        valutazioneRepo.save(val5);

        // Valutazione 6
        Valutazione val6 = new Valutazione();
        val6.setIdImmobile(6);
        val6.setIdUtente(3); // Marta
        val6.setStato(StatoValutazione.COMPLETATA);
        val6.setValoreStimato(165000.0);
        val6.setValoreCalcolatoZona(165000.0);
        cal.set(2024, Calendar.MAY, 5, 13, 30, 0);
        val6.setDataRichiesta(cal.getTime());
        val6.setDataCompletamento(cal.getTime());
        cal.add(Calendar.DAY_OF_MONTH, 3);
        val6.setDeadline(cal.getTime());
        val6.setNote("Valutazione automatica completata istantaneamente");
        valutazioneRepo.save(val6);

        System.out.println("  ✓ Valutazioni caricate (6)");
    }

    /**
     * Carica i contratti nel database
     */
    private void loadContratti() {
        Contratto c1 = new Contratto();
        c1.setIdImmobile(1);
        c1.setIdVenditore(1);
        c1.setTipo("vendita");
        c1.setEsclusiva(true);
        c1.setDataInizio(LocalDate.of(2024, 5, 1));
        c1.setDataFine(LocalDate.of(2024, 11, 1));
        c1.setPrezzoFinaleMinimo(150000.0);
        c1.setStato(StatoContratto.ATTIVO);
        c1.setNote("Contratto standard 6 mesi");
        contrattoRepo.save(c1);

        Contratto c2 = new Contratto();
        c2.setIdImmobile(2);
        c2.setIdVenditore(3);
        c2.setTipo("vendita");
        c2.setEsclusiva(true);
        c2.setDataInizio(LocalDate.of(2024, 4, 15));
        c2.setDataFine(LocalDate.of(2024, 10, 15));
        c2.setPrezzoFinaleMinimo(720000.0);
        c2.setStato(StatoContratto.COMPLETATO);
        c2.setNote("Venduto sopra prezzo minimo");
        contrattoRepo.save(c2);

        Contratto c3 = new Contratto();
        c3.setIdImmobile(3);
        c3.setIdVenditore(4);
        c3.setTipo("vendita");
        c3.setEsclusiva(true);
        c3.setDataInizio(LocalDate.of(2024, 5, 20));
        c3.setDataFine(null);
        c3.setPrezzoFinaleMinimo(120000.0);
        c3.setStato(StatoContratto.ANNULLATO);
        c3.setNote("Cliente ha cambiato idea");
        contrattoRepo.save(c3);

        Contratto c4 = new Contratto();
        c4.setIdImmobile(4);
        c4.setIdVenditore(5);
        c4.setTipo("vendita");
        c4.setEsclusiva(true);
        c4.setDataInizio(LocalDate.of(2024, 3, 1));
        c4.setDataFine(LocalDate.of(2024, 9, 1));
        c4.setPrezzoFinaleMinimo(550000.0);
        c4.setStato(StatoContratto.COMPLETATO);
        c4.setNote("Venduto al prezzo di mercato");
        contrattoRepo.save(c4);

        Contratto c5 = new Contratto();
        c5.setIdImmobile(5);
        c5.setIdVenditore(3);
        c5.setTipo("vendita");
        c5.setEsclusiva(true);
        c5.setDataInizio(LocalDate.of(2024, 6, 1));
        c5.setDataFine(null);
        c5.setPrezzoFinaleMinimo(220000.0);
        c5.setStato(StatoContratto.ATTIVO);
        c5.setNote("Contratto standard 6 mesi");
        contrattoRepo.save(c5);

        Contratto c6 = new Contratto();
        c6.setIdImmobile(6);
        c6.setIdVenditore(6);
        c6.setTipo("vendita");
        c6.setEsclusiva(true);
        c6.setDataInizio(LocalDate.of(2024, 5, 10));
        c6.setDataFine(null);
        c6.setPrezzoFinaleMinimo(140000.0);
        c6.setStato(StatoContratto.ATTIVO);
        c6.setNote("Contratto in corso");
        contrattoRepo.save(c6);

        System.out.println("  ✓ Contratti caricati (6)");
    }
}
