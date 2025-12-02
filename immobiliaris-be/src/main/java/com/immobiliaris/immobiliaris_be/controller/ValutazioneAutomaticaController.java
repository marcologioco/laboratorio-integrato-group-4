package com.immobiliaris.immobiliaris_be.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.immobiliaris.immobiliaris_be.dto.RichiestaValutazioneDTO;
import com.immobiliaris.immobiliaris_be.dto.RichiestaValutazioneImmobileDTO;
import com.immobiliaris.immobiliaris_be.dto.RispostaValutazioneDTO;
import com.immobiliaris.immobiliaris_be.services.ValutazioneAutomaticaService;

import jakarta.validation.Valid;

/**
 * Controller per la valutazione automatica degli immobili
 * 
 * Endpoint pubblico che permette a nuovi utenti di:
 * 1. Registrarsi al sito
 * 2. Inserire i dati del proprio immobile
 * 3. Ricevere una valutazione istantanea automatica
 */
@RestController
@RequestMapping("/api/valutazioni")
@CrossOrigin(origins = "*")
public class ValutazioneAutomaticaController {

    @Autowired
    private ValutazioneAutomaticaService valutazioneAutomaticaService;
    
    /**
     * POST /api/valutazioni/automatica
     * 
     * Crea un nuovo utente (se non esiste), registra l'immobile e calcola
     * una valutazione automatica istantanea basata sui dati forniti.
     * 
     * @param richiesta DTO con dati utente e immobile
     * @return Risposta con valutazione calcolata
     */
    @PostMapping("/automatica")
    public ResponseEntity<RispostaValutazioneDTO> creaValutazioneAutomatica(
            @Valid @RequestBody RichiestaValutazioneDTO richiesta) {
        
        try {
            RispostaValutazioneDTO risposta = valutazioneAutomaticaService.creaValutazioneAutomatica(richiesta);
            return ResponseEntity.status(HttpStatus.CREATED).body(risposta);
            
        } catch (Exception e) {
            // Log dell'errore
            System.err.println("Errore durante la creazione della valutazione automatica: " + e.getMessage());
            e.printStackTrace();
            
            // Risposta di errore generica
            RispostaValutazioneDTO errore = new RispostaValutazioneDTO();
            errore.setMessaggio("Errore durante la valutazione: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errore);
        }
    }
    
    /**
     * POST /api/valutazioni/logged
     * 
     * Crea una valutazione per un utente già autenticato.
     * Recupera i dati utente dal token JWT e crea solo l'immobile e la valutazione.
     * 
     * @param richiesta DTO con solo i dati dell'immobile
     * @param authentication Informazioni dell'utente autenticato
     * @return Risposta con valutazione calcolata
     */
    @PostMapping("/logged")
    public ResponseEntity<RispostaValutazioneDTO> creaValutazionePerUtenteLoggato(
            @Valid @RequestBody RichiestaValutazioneImmobileDTO richiesta,
            Authentication authentication) {
        
        try {
            // Recupera l'email dell'utente autenticato dal token
            String emailUtente = authentication.getName();
            
            RispostaValutazioneDTO risposta = valutazioneAutomaticaService.creaValutazionePerUtenteLoggato(richiesta, emailUtente);
            return ResponseEntity.status(HttpStatus.CREATED).body(risposta);
            
        } catch (Exception e) {
            // Log dell'errore
            System.err.println("Errore durante la creazione della valutazione per utente loggato: " + e.getMessage());
            e.printStackTrace();
            
            // Risposta di errore generica
            RispostaValutazioneDTO errore = new RispostaValutazioneDTO();
            errore.setMessaggio("Errore durante la valutazione: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errore);
        }
    }
}
