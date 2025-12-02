package com.immobiliaris.immobiliaris_be.services;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.immobiliaris.immobiliaris_be.dto.RichiestaValutazioneDTO;
import com.immobiliaris.immobiliaris_be.dto.RichiestaValutazioneImmobileDTO;
import com.immobiliaris.immobiliaris_be.dto.RispostaValutazioneDTO;
import com.immobiliaris.immobiliaris_be.enums.StatoImmobile;
import com.immobiliaris.immobiliaris_be.enums.StatoValutazione;
import com.immobiliaris.immobiliaris_be.enums.TipoImmobile;
import com.immobiliaris.immobiliaris_be.model.Immobile;
import com.immobiliaris.immobiliaris_be.model.Utente;
import com.immobiliaris.immobiliaris_be.model.Valutazione;
import com.immobiliaris.immobiliaris_be.model.Venditore;
import com.immobiliaris.immobiliaris_be.model.Zona;
import com.immobiliaris.immobiliaris_be.repos.ZonaRepo;

/**
 * Service per la valutazione automatica degli immobili
 * 
 * Calcola il valore stimato di un immobile basandosi su:
 * - Prezzo medio al m² della zona (da tabella zone)
 * - Caratteristiche dell'immobile (bagni, balconi, garage, etc.)
 * - Stato dell'immobile (nuovo, abitabile, da ristrutturare)
 */
@Service
public class ValutazioneAutomaticaService {

    @Autowired
    private UtenteService utenteService;
    
    @Autowired
    private ImmobileService immobileService;
    
    @Autowired
    private ValutazioneService valutazioneService;
    
    @Autowired
    private VenditoreService venditoreService;
    
    @Autowired
    private ZonaRepo zonaRepository;
    
    // ===== PARAMETRI DI VALUTAZIONE =====
    private static final double PREZZO_BAGNO_EXTRA = 5000.0;        // €5.000 per ogni bagno oltre il primo
    private static final double PREZZO_BALCONE = 3000.0;             // €3.000 per balcone
    private static final double PREZZO_TERRAZZO = 15000.0;           // €15.000 per terrazzo
    private static final double PREZZO_GIARDINO = 20000.0;           // €20.000 per giardino
    private static final double PREZZO_GARAGE = 12000.0;             // €12.000 per garage
    
    private static final double MOLTIPLICATORE_NUOVA = 1.15;         // +15% se casa nuova
    private static final double MOLTIPLICATORE_ABITABILE = 1.0;      // Prezzo base
    private static final double MOLTIPLICATORE_DA_RISTRUTTURARE = 0.75; // -25% se da ristrutturare
    
    /**
     * Crea un nuovo utente, registra l'immobile e calcola la valutazione automatica
     * 
     * @param richiesta DTO con dati utente e immobile
     * @return Risposta con valutazione calcolata
     */
    @Transactional
    public RispostaValutazioneDTO creaValutazioneAutomatica(RichiestaValutazioneDTO richiesta) {
        
        // 1. CREA O VERIFICA UTENTE
        Utente utente = creaORecuperaUtente(richiesta);
        
        // 2. CREA VENDITORE SE L'UTENTE È PROPRIETARIO
        Integer idVenditore = gestisciVenditore(richiesta, utente);
        
        // 3. CREA IMMOBILE
        Immobile immobile = creaImmobile(richiesta, idVenditore);
        
        // 4. CALCOLA VALUTAZIONE
        Double valoreStimato = calcolaValoreImmobile(richiesta);
        Double valoreBaseZona = calcolaValoreBaseZona(richiesta.getCap(), richiesta.getMetriQuadri());
        
        // 5. CREA VALUTAZIONE
        Valutazione valutazione = creaValutazione(immobile, utente, valoreStimato, valoreBaseZona);
        
        // 6. PREPARA RISPOSTA
        String messaggio = String.format(
            "Valutazione completata! Il valore stimato del tuo immobile è di €%.2f. " +
            "Riceverai una valutazione più dettagliata entro 72 ore.",
            valoreStimato
        );
        
        return new RispostaValutazioneDTO(
            utente.getIdUtente(),
            immobile.getIdImmobile(),
            valutazione.getIdValutazione(),
            valoreStimato,
            valoreBaseZona,
            messaggio
        );
    }
    
    /**
     * Crea una valutazione per un utente già autenticato
     * Riusa i dati utente esistenti e crea solo l'immobile e la valutazione
     * 
     * @param richiesta DTO con solo i dati dell'immobile
     * @param emailUtente Email dell'utente autenticato
     * @return Risposta con valutazione calcolata
     */
    @Transactional
    public RispostaValutazioneDTO creaValutazionePerUtenteLoggato(
            RichiestaValutazioneImmobileDTO richiesta, String emailUtente) {
        
        // 1. RECUPERA UTENTE ESISTENTE
        Optional<Utente> utenteOptional = utenteService.findUtenteByEmail(emailUtente);
        if (!utenteOptional.isPresent()) {
            throw new RuntimeException("Utente non trovato");
        }
        Utente utente = utenteOptional.get();
        
        // 2. RECUPERA O CREA VENDITORE (l'utente loggato è automaticamente proprietario)
        Integer idVenditore = recuperaOCreaVenditoreLogged(utente, richiesta);
        
        // 3. CREA IMMOBILE
        Immobile immobile = creaImmobilePerLogged(richiesta, idVenditore);
        
        // 4. CALCOLA VALUTAZIONE
        Double valoreStimato = calcolaValoreImmobilePerLogged(richiesta);
        Double valoreBaseZona = calcolaValoreBaseZona(richiesta.getCap(), richiesta.getMetriQuadri());
        
        // 5. CREA VALUTAZIONE
        Valutazione valutazione = creaValutazione(immobile, utente, valoreStimato, valoreBaseZona);
        
        // 6. PREPARA RISPOSTA
        String messaggio = String.format(
            "Nuova valutazione completata! Il valore stimato è di €%.2f. " +
            "Riceverai una valutazione più dettagliata entro 72 ore.",
            valoreStimato
        );
        
        return new RispostaValutazioneDTO(
            utente.getIdUtente(),
            immobile.getIdImmobile(),
            valutazione.getIdValutazione(),
            valoreStimato,
            valoreBaseZona,
            messaggio
        );
    }
    
    /**
     * Crea un nuovo utente o recupera uno esistente per email
     */
    private Utente creaORecuperaUtente(RichiestaValutazioneDTO richiesta) {
        // Verifica se l'utente esiste già
        Optional<Utente> utenteOptional = utenteService.findUtenteByEmail(richiesta.getEmail());
        
        if (utenteOptional.isPresent()) {
            return utenteOptional.get();
        }
        
        // Crea nuovo utente
        Utente nuovoUtente = new Utente();
        nuovoUtente.setNome(richiesta.getNome());
        nuovoUtente.setCognome(richiesta.getCognome());
        nuovoUtente.setEmail(richiesta.getEmail());
        nuovoUtente.setTelefono(richiesta.getTelefono());
        nuovoUtente.setPassword(richiesta.getPassword()); // Verrà hashata dal service
        nuovoUtente.setIdRuolo(1); // Utente normale
        
        return utenteService.saveUtente(nuovoUtente);
    }
    
    /**
     * Gestisce la creazione del venditore se l'utente è il proprietario
     * 
     * @param richiesta DTO con flag isProprietario
     * @param utente Utente che ha fatto la richiesta
     * @return ID del venditore (può essere l'utente stesso o null se vende per terzi)
     */
    private Integer gestisciVenditore(RichiestaValutazioneDTO richiesta, Utente utente) {
        // Se l'utente è il proprietario, crea o recupera il record venditore
        if (Boolean.TRUE.equals(richiesta.getIsProprietario())) {
            // Verifica se esiste già un venditore per questo utente
            List<Venditore> venditori = venditoreService.findVenditoreByIdUtente(utente.getIdUtente());
            
            if (!venditori.isEmpty()) {
                return venditori.get(0).getIdVenditore();
            }
            
            // Crea nuovo venditore
            Venditore venditore = new Venditore();
            venditore.setIdUtente(utente.getIdUtente());
            venditore.setNome(utente.getNome());
            venditore.setCognome(utente.getCognome());
            venditore.setEmail(utente.getEmail());
            venditore.setTelefono(utente.getTelefono());
            // Indirizzo verrà aggiunto dall'immobile
            venditore.setCitta(richiesta.getCitta());
            venditore.setProvincia(richiesta.getProvincia());
            
            Venditore venditoreSalvato = venditoreService.saveVenditore(venditore);
            return venditoreSalvato.getIdVenditore();
        }
        
        // Se non è proprietario, restituisce null (dovrà essere gestito diversamente)
        return null;
    }
    
    /**
     * Crea un nuovo immobile
     */
    private Immobile creaImmobile(RichiestaValutazioneDTO richiesta, Integer idVenditore) {
        Immobile immobile = new Immobile();
        
        // Imposta il venditore (può essere null se l'utente vende per terzi)
        immobile.setIdVenditore(idVenditore);
        
        // Dati base
        immobile.setIndirizzo(richiesta.getIndirizzo());
        immobile.setCitta(richiesta.getCitta());
        immobile.setProvincia(richiesta.getProvincia());
        immobile.setCap(richiesta.getCap());
        immobile.setMetriQuadri(richiesta.getMetriQuadri());
        immobile.setCamere(richiesta.getCamere());
        immobile.setBagni(richiesta.getBagni());
        immobile.setDescrizione(richiesta.getDescrizione());
        
        // Tipo e stato (con valori default se non forniti)
        if (richiesta.getTipo() != null) {
            try {
                immobile.setTipo(TipoImmobile.valueOf(richiesta.getTipo().toUpperCase()));
            } catch (IllegalArgumentException e) {
                immobile.setTipo(TipoImmobile.APPARTAMENTO); // Default
            }
        } else {
            immobile.setTipo(TipoImmobile.APPARTAMENTO);
        }
        
        if (richiesta.getStato() != null) {
            try {
                immobile.setStato(StatoImmobile.valueOf(richiesta.getStato().toUpperCase()));
            } catch (IllegalArgumentException e) {
                immobile.setStato(StatoImmobile.ABITABILE); // Default
            }
        } else {
            immobile.setStato(StatoImmobile.ABITABILE);
        }
        
        // Prezzo iniziale (verrà aggiornato dalla valutazione)
        immobile.setPrezzo(0.0);
        
        return immobileService.saveImmobile(immobile);
    }
    
    /**
     * Recupera o crea il venditore per un utente già loggato
     */
    private Integer recuperaOCreaVenditoreLogged(Utente utente, RichiestaValutazioneImmobileDTO richiesta) {
        // Verifica se esiste già un venditore per questo utente
        List<Venditore> venditori = venditoreService.findVenditoreByIdUtente(utente.getIdUtente());
        
        if (!venditori.isEmpty()) {
            return venditori.get(0).getIdVenditore();
        }
        
        // Crea nuovo venditore
        Venditore venditore = new Venditore();
        venditore.setIdUtente(utente.getIdUtente());
        venditore.setNome(utente.getNome());
        venditore.setCognome(utente.getCognome());
        venditore.setEmail(utente.getEmail());
        venditore.setTelefono(utente.getTelefono());
        venditore.setCitta(richiesta.getCitta());
        venditore.setProvincia(richiesta.getProvincia());
        
        Venditore venditoreSalvato = venditoreService.saveVenditore(venditore);
        return venditoreSalvato.getIdVenditore();
    }
    
    /**
     * Crea un nuovo immobile per utente loggato
     */
    private Immobile creaImmobilePerLogged(RichiestaValutazioneImmobileDTO richiesta, Integer idVenditore) {
        Immobile immobile = new Immobile();
        
        immobile.setIdVenditore(idVenditore);
        
        // Dati base
        immobile.setIndirizzo(richiesta.getIndirizzo());
        immobile.setCitta(richiesta.getCitta());
        immobile.setProvincia(richiesta.getProvincia());
        immobile.setCap(richiesta.getCap());
        immobile.setMetriQuadri(richiesta.getMetriQuadri());
        immobile.setCamere(richiesta.getCamere());
        immobile.setBagni(richiesta.getBagni());
        immobile.setDescrizione(richiesta.getDescrizione());
        
        // Tipo e stato
        if (richiesta.getTipo() != null) {
            try {
                immobile.setTipo(TipoImmobile.valueOf(richiesta.getTipo().toUpperCase()));
            } catch (IllegalArgumentException e) {
                immobile.setTipo(TipoImmobile.APPARTAMENTO);
            }
        } else {
            immobile.setTipo(TipoImmobile.APPARTAMENTO);
        }
        
        if (richiesta.getStato() != null) {
            try {
                immobile.setStato(StatoImmobile.valueOf(richiesta.getStato().toUpperCase()));
            } catch (IllegalArgumentException e) {
                immobile.setStato(StatoImmobile.ABITABILE);
            }
        } else {
            immobile.setStato(StatoImmobile.ABITABILE);
        }
        
        immobile.setPrezzo(0.0);
        
        return immobileService.saveImmobile(immobile);
    }
    
    /**
     * Crea la valutazione automatica
     */
    private Valutazione creaValutazione(Immobile immobile, Utente utente, 
                                       Double valoreStimato, Double valoreBaseZona) {
        Valutazione valutazione = new Valutazione();
        
        valutazione.setIdImmobile(immobile.getIdImmobile());
        valutazione.setIdUtente(utente.getIdUtente());
        valutazione.setStato(StatoValutazione.COMPLETATA);
        valutazione.setValoreStimato(valoreStimato);
        valutazione.setValoreCalcolatoZona(valoreBaseZona);
        valutazione.setDataRichiesta(new Date());
        valutazione.setDataCompletamento(new Date());
        
        // Deadline per revisione manuale (72 ore)
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.HOUR, 72);
        valutazione.setDeadline(cal.getTime());
        
        valutazione.setNote("Valutazione automatica completata istantaneamente");
        
        return valutazioneService.saveValutazione(valutazione);
    }
    
    /**
     * CALCOLO VALUTAZIONE AUTOMATICA
     * 
     * Formula:
     * 1. Valore base = m² × prezzo_medio_zona
     * 2. Aggiunte per caratteristiche (bagni, balconi, garage, etc.)
     * 3. Moltiplicatore per stato immobile
     */
    public Double calcolaValoreImmobile(RichiestaValutazioneDTO richiesta) {
        
        // 1. VALORE BASE DALLA ZONA
        Double valoreBase = calcolaValoreBaseZona(richiesta.getCap(), richiesta.getMetriQuadri());
        
        if (valoreBase == null) {
            // CAP non trovato, usa un valore medio di default
            valoreBase = richiesta.getMetriQuadri() * 2500.0; // €2.500/m² come fallback
        }
        
        // 2. AGGIUNTE PER CARATTERISTICHE
        double aggiunte = 0.0;
        
        // Bagni extra (oltre il primo)
        if (richiesta.getBagni() != null && richiesta.getBagni() > 1) {
            aggiunte += (richiesta.getBagni() - 1) * PREZZO_BAGNO_EXTRA;
        }
        
        // Balconi
        if (richiesta.getBalconi() != null && richiesta.getBalconi() > 0) {
            aggiunte += richiesta.getBalconi() * PREZZO_BALCONE;
        }
        
        // Terrazzo
        if (Boolean.TRUE.equals(richiesta.getTerrazzo())) {
            aggiunte += PREZZO_TERRAZZO;
        }
        
        // Giardino
        if (Boolean.TRUE.equals(richiesta.getGiardino())) {
            aggiunte += PREZZO_GIARDINO;
        }
        
        // Garage
        if (Boolean.TRUE.equals(richiesta.getGarage())) {
            aggiunte += PREZZO_GARAGE;
        }
        
        // 3. APPLICA MOLTIPLICATORE PER STATO
        double moltiplicatore = MOLTIPLICATORE_ABITABILE; // Default
        
        if (richiesta.getStato() != null) {
            switch (richiesta.getStato().toUpperCase()) {
                case "NUOVA":
                    moltiplicatore = MOLTIPLICATORE_NUOVA;
                    break;
                case "RISTRUTTURATA":
                    moltiplicatore = MOLTIPLICATORE_ABITABILE; // Stessa valutazione di abitabile
                    break;
                case "DA_RISTRUTTURARE":
                    moltiplicatore = MOLTIPLICATORE_DA_RISTRUTTURARE;
                    break;
                default:
                    moltiplicatore = MOLTIPLICATORE_ABITABILE;
            }
        }
        
        // 4. CALCOLO FINALE
        Double valoreTotale = (valoreBase + aggiunte) * moltiplicatore;
        
        // Arrotonda a 100€
        return Math.round(valoreTotale / 100.0) * 100.0;
    }
    
    /**
     * CALCOLO VALUTAZIONE AUTOMATICA per utente loggato
     * (stesso algoritmo ma con DTO diverso)
     */
    public Double calcolaValoreImmobilePerLogged(RichiestaValutazioneImmobileDTO richiesta) {
        
        // 1. VALORE BASE DALLA ZONA
        Double valoreBase = calcolaValoreBaseZona(richiesta.getCap(), richiesta.getMetriQuadri());
        
        if (valoreBase == null) {
            valoreBase = richiesta.getMetriQuadri() * 2500.0;
        }
        
        // 2. AGGIUNTE PER CARATTERISTICHE
        double aggiunte = 0.0;
        
        if (richiesta.getBagni() != null && richiesta.getBagni() > 1) {
            aggiunte += (richiesta.getBagni() - 1) * PREZZO_BAGNO_EXTRA;
        }
        
        if (richiesta.getBalconi() != null && richiesta.getBalconi() > 0) {
            aggiunte += richiesta.getBalconi() * PREZZO_BALCONE;
        }
        
        if (Boolean.TRUE.equals(richiesta.getTerrazzo())) {
            aggiunte += PREZZO_TERRAZZO;
        }
        
        if (Boolean.TRUE.equals(richiesta.getGiardino())) {
            aggiunte += PREZZO_GIARDINO;
        }
        
        if (Boolean.TRUE.equals(richiesta.getGarage())) {
            aggiunte += PREZZO_GARAGE;
        }
        
        // 3. APPLICA MOLTIPLICATORE PER STATO
        double moltiplicatore = MOLTIPLICATORE_ABITABILE;
        
        if (richiesta.getStato() != null) {
            switch (richiesta.getStato().toUpperCase()) {
                case "NUOVA":
                    moltiplicatore = MOLTIPLICATORE_NUOVA;
                    break;
                case "RISTRUTTURATA":
                    moltiplicatore = MOLTIPLICATORE_ABITABILE;
                    break;
                case "DA_RISTRUTTURARE":
                    moltiplicatore = MOLTIPLICATORE_DA_RISTRUTTURARE;
                    break;
                default:
                    moltiplicatore = MOLTIPLICATORE_ABITABILE;
            }
        }
        
        // 4. CALCOLO FINALE
        Double valoreTotale = (valoreBase + aggiunte) * moltiplicatore;
        
        return Math.round(valoreTotale / 100.0) * 100.0;
    }
    
    /**
     * Calcola il valore base dalla zona (CAP)
     */
    private Double calcolaValoreBaseZona(String cap, Double metriQuadri) {
        Zona zona = zonaRepository.findByCap(cap);
        
        if (zona != null && zona.getPrezzoMedioSqm() != null) {
            return metriQuadri * zona.getPrezzoMedioSqm();
        }
        
        return null;
    }
}
